import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import User from "@/models/User";
import StudentState from "@/models/StudentState";
import { signInSchema } from "@/lib/auth/validation";
import { getLocalUser, formatCandidateName } from "@/lib/auth/localUsers";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days sliding
  },
  pages: {
    signIn: "/sign-in",
    newUser: "/onboarding",
    error: "/sign-in",
  },
  providers: [
    ...(process.env.GITHUB_ID && process.env.GITHUB_SECRET && process.env.GITHUB_ID !== "mock-github-id"
      ? [GitHub({ clientId: process.env.GITHUB_ID, clientSecret: process.env.GITHUB_SECRET })]
      : []),
    ...(process.env.GOOGLE_ID && process.env.GOOGLE_SECRET && process.env.GOOGLE_ID !== "mock-google-id"
      ? [Google({ clientId: process.env.GOOGLE_ID, clientSecret: process.env.GOOGLE_SECRET })]
      : []),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const validated = signInSchema.safeParse(credentials);
        if (!validated.success) {
          return null;
        }

        const { email, password } = validated.data;
        const normalizedEmail = email.toLowerCase().trim();

        const conn = await connectDB();
        if (!conn) {
          // When MongoDB is offline, allow credentials sign-in in local guest mode
          const localUser = getLocalUser(normalizedEmail);
          const cleanName = localUser?.name || formatCandidateName(normalizedEmail);
          return {
            id: localUser?.id || `guest-${normalizedEmail.replace(/[^a-zA-Z0-9]/g, "")}`,
            email: normalizedEmail,
            name: cleanName,
          };
        }

        const user = await User.findOne({ email: normalizedEmail }).select("+passwordHash");
        if (!user || !user.passwordHash) {
          // Constant-time compare with dummy hash to prevent timing attacks
          await bcrypt.compare(
            password,
            "$2a$12$e80yvE3d6b0rC864l8i5eO6oR2wQfXn8y3sZ.s8x0fVqX0x2vG0wW"
          );
          return null;
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
          return null;
        }

        // Update last login
        user.lastLoginAt = new Date();
        await user.save();

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "github" || account?.provider === "google") {
        const conn = await connectDB();
        if (!conn) return false;

        const normalizedEmail = user.email?.toLowerCase().trim();
        if (!normalizedEmail) return false;

        let existingUser = await User.findOne({ email: normalizedEmail }).select("+passwordHash");

        if (existingUser) {
          // Security rule from Phase 10:
          // If an account with that email already has a password, require signing in with the password first (no silent takeover).
          if (existingUser.passwordHash && !existingUser.providers.includes(account.provider)) {
            return false;
          }

          if (!existingUser.providers.includes(account.provider)) {
            existingUser.providers.push(account.provider);
            await existingUser.save();
          }
          user.id = existingUser._id.toString();
        } else {
          // Create new OAuth user
          const newUser = await User.create({
            email: normalizedEmail,
            name: user.name || "",
            providers: [account.provider],
            lastLoginAt: new Date(),
          });

          // Create default StudentState
          await StudentState.create({
            userId: newUser._id,
            roleId: "fullstack-engineer",
            skills: {},
            projects: [],
            courses: [],
            roadmap: [],
            history: [],
            changeLog: [],
            settings: { weeklyHours: 6 },
            version: 1,
          });

          user.id = newUser._id.toString();
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET || "default_development_secret_at_least_32_characters_long",
  trustHost: true,
});
