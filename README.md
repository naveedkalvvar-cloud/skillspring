# SkillSpring AI — Sleek Modern Web Platform

SkillSpring AI is a deterministic, AI-assisted career acceleration and skill-gap diagnostic platform built for software engineers. It bridges the gap between current candidate capability and target industry benchmarks through verifiable scoring, dynamic roadmap replanning, live market rubrics, and evidence-backed skill calibration.

---

## 🚀 Key Technologies & Stack Rules

- **Framework**: Next.js 14+ (App Router, JavaScript & JSX only — strict `.js` / `.jsx`, zero TypeScript).
- **Styling**: Tailwind CSS 3.x with curated design tokens matching modern editorial aesthetics.
- **Typography**: IBM Plex Sans (Body), Newsreader (Headlines & Editorial), Space Mono (Labels & Code).
- **Icons**: Material Symbols Outlined (font-based, zero emoji usage across UI).
- **Authentication**: Auth.js (NextAuth v5) with JWT session strategy, credential sign-in, and local guest mode fallback.
- **State & Persistence**: Reactive Zustand store (`lib/store.js`) with per-account isolation (`lib/persistence/`) and MongoDB integration (`models/`).
- **Modals & Drawers**: Radix UI Dialog (`@radix-ui/react-dialog`) with focus trapping, Escape dismiss, and responsive mobile bottom sheets.
- **Testing**: Vitest with 81 passing unit tests across scoring, derivation, replanning, taxonomy, and auth.
- **Scoring Engine**: 100% deterministic mathematical calculations (`lib/scoring.js`, `lib/replan.js`) — zero hardcoded metrics.

---

## 📐 Architecture & Core Principles

### 1. Deterministic Scoring Engine (`lib/scoring.js`)
- **Mathematical Integrity**: Readiness scores are calculated strictly from demonstrated skill levels, benchmark requirements, importance weights (`high: 3`, `medium: 2`, `low: 1`), and verification multipliers (`0.7×` for self-reported, `1.0×` with verified evidence).
- **Competency Radar Matrix**: 7-axis radar assessment (Frontend, Backend, Databases, DevOps, Testing, Soft Skills, System Design) computed on the fly.
- **Zero-Hardcoding Guarantee**: Scores and gap counts are never mocked with static placeholders.

### 2. Dynamic Roadmap & Re-Planning (`lib/replan.js`)
- **Atomic Recalibration**: Completing milestones immediately updates skill coverage, recomputes total readiness, prunes mastered steps, and generates next-step recommendations.
- **Audit Trail**: Every recalibration event produces an immutable `changeRecord` tracking `{ before, after, delta, skillsRaised, removedSteps, addedSteps }`.

### 3. Multi-Role Live Market Benchmarks (`lib/benchmarks/`)
- Four junior engineering benchmarks calibrated against verified postings:
  - **Full-Stack Developer** (`data/benchmarks/full-stack.v1.json`)
  - **Backend Engineer** (`data/benchmarks/backend.v1.json`)
  - **Frontend Engineer** (`data/benchmarks/frontend.v1.json`)
  - **DevOps Engineer** (`data/benchmarks/devops.v1.json`)
- Centralized skill taxonomy (`data/taxonomy/skills.json`) with standardized competency levels and evidence criteria.

### 4. Dual-Mode AI Intelligence (`lib/llm/`)
- Primary AI engine powered by **Google Gemini 1.5 Flash** with automatic fallback to **Anthropic Claude 3.5 Sonnet**.
- Dual execution modes:
  - `LLM_MODE=live`: Live API synthesis for custom roadmaps, CV skill extraction, and gap analysis.
  - `LLM_MODE=mock`: Instant deterministic offline fallback with Zod schema validation.

### 5. Trust & Verification Hierarchy (`components/ui/TrustBadge.jsx`)
- **Verified (Solid Border)**: Curated industry benchmarks, verified repository evidence, and peer-reviewed resources.
- **AI-Suggested (Dashed Violet Border)**: AI-synthesized milestones, LLM extractions, and dynamic learning recommendations requiring human review.

---

## 📱 Application Screens & Features

| Screen / Feature | Route | Key Capabilities |
| :--- | :--- | :--- |
| **Landing Page** | `/` | Hero 7/5 split, interactive SVG radar preview, value propositions, "Get started" and "Use demo student" quick-launch paths. |
| **Authentication** | `/sign-in`, `/sign-up` | Auth-first onboarding, Zod input validation, NextAuth session creation, offline local accounts registry. |
| **Onboarding Flow** | `/onboarding/*` | 4-step wizard: Role Selection (`/role`), Competencies & CV upload (`/skills`), Projects (`/projects`), and animated synthesis (`/analyzing`). |
| **Dashboard** | `/dashboard` | Overall readiness score ring, competency radar chart, top critical gaps, next-up milestone action, velocity trajectory. |
| **Gap Analysis** | `/gap-analysis` | Filterable competency list (by category, importance, status), live delta metrics, and deep-dive drawer. |
| **Roadmap** | `/roadmap` | Adaptive 4-phase milestone sprint timeline, status management (todo, in-progress, done), study pace indicator. |
| **Resources & YouTube** | `/resources` | Peer-reviewed catalog + **Dedicated YouTube Video Masterclasses** with direct video links and 1-click roadmap scheduling. |
| **Progress & Evidence** | `/progress` | Score timeline sparkline, skill growth matrix, verified portfolio evidence grid, CSV export. |
| **Profile & Settings** | `/profile` | Interactive 4-role benchmark switcher, weekly study slider (2–30 hrs), profile name editing, active session card with Sign Out. |

---

## 🎥 Curated YouTube Masterclass Integration

The Resources screen features a dedicated **YouTube Video Lectures & Masterclasses** section offering direct access to top engineering educators:
- **System Design & Architecture**: ByteByteGo (Alex Xu)
- **Full-Stack Bootcamp**: freeCodeCamp.org (React & Node.js)
- **Backend Masterclass**: Hussein Nasser (OS, TCP & DB Engines)
- **Containerization & K8s**: TechWorld with Nana (Docker & Kubernetes)
- **Relational Databases**: freeCodeCamp.org (SQL Database Masterclass)
- **Web Security**: Fireship (OWASP Top 10 Vulnerabilities Explained)

Each card features YouTube badges, channel info, view counts, direct external links (`target="_blank"`), and a 1-click **Add to Roadmap** button.

---

## 🔒 Session & State Management

- **User State Isolation**: Authenticated accounts persist to `skillspring-user-${email}` and MongoDB. Refreshes, sign-ins, and sign-outs cleanly preserve the user's assessed state without dummy seed data contamination.
- **Demo Mode**: Explicitly accessible via *"Use demo student (Ayesha Khan)"* for testing with pre-calibrated sample data.
- **Offline / Zero-DB Resilience**: Full functionality in guest mode when MongoDB or LLM APIs are offline.

---

## 🛠️ Getting Started

### 1. Prerequisites
- Node.js 18.x or 20.x
- npm 9.x or later

### 2. Installation
```bash
git clone <repository-url>
cd stitch_sleek_modern_web_platform
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory:
```env
# Google Gemini API Key (Primary LLM)
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash

# Anthropic API Key (Alternative/Fallback LLM)
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# LLM Mode: 'live' for API generation, 'mock' for instant deterministic offline fallback
LLM_MODE=mock

# MongoDB URI (Optional: guest mode runs seamlessly without database)
MONGODB_URI=

# Auth.js secret
AUTH_SECRET=development-secret-key-at-least-32-chars-long
NEXT_PUBLIC_DEMO_MODE=true
```

### 4. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing & Verification

Run the complete Vitest test suite (81 unit tests):
```bash
npx vitest run
```

Test Coverage Breakdown:
- `tests/scoring.test.js`: Deterministic scoring formulas, coverage ratios, evidence multipliers (39 tests)
- `tests/taxonomy.test.js`: Skill taxonomy integrity, IDs, and level requirements (13 tests)
- `tests/derivation.test.js`: Dynamic roadmap derivation and recalibration (12 tests)
- `tests/phase10.test.js`: Security, auth endpoints, rate-limiting, and middleware (10 tests)
- `tests/phase7.test.js`: Onboarding flows and role benchmarks (7 tests)

Verify the Zero-Hardcoded-Scores rule:
```bash
# Must return zero matches outside seed data definitions and test mocks
git grep -E "\b(62|68|69|72)\b" -- "app/" "components/" "lib/" ":!lib/seed/*"
```

Production build validation:
```bash
npm run build
```

---

## 📂 Project Structure

```
├── app/
│   ├── (app)/                  # Protected application shell
│   │   ├── dashboard/          # S6 Core Dashboard
│   │   ├── gap-analysis/       # S7 Gap Analysis
│   │   ├── roadmap/            # S8 Adaptive Roadmap
│   │   ├── resources/          # S9 Resources & YouTube Masterclasses
│   │   ├── progress/           # S10 Progress & Portfolio Evidence
│   │   └── profile/            # S11 Profile & Benchmark Switcher
│   ├── api/                    # API routes (Auth, Student State, LLM, Benchmarks)
│   ├── onboarding/             # S2–S5 Multi-step candidate calibration wizard
│   ├── sign-in/ & sign-up/     # Authentication pages
│   ├── layout.jsx              # Root layout with Google Fonts
│   └── page.jsx                # S1 Landing Page
├── components/
│   ├── dashboard/              # ReadinessCard, RadarCard, CriticalGaps, NextUpCard
│   ├── resources/              # ResourceCard, YouTubeSection
│   ├── roadmap/                # MilestoneCard, Timeline, RecalibrationBanner
│   ├── shell/                  # Sidebar, TopHeader, BottomNav
│   ├── modals/                 # Radix Dialog modals & D1 Explainer drawer
│   └── ui/                     # TrustBadge, CircularProgress, Buttons
├── data/
│   ├── benchmarks/             # 4 Verified market benchmark datasets (JSON)
│   └── taxonomy/               # Unified skill taxonomy (skills.json)
├── lib/
│   ├── auth/                   # Session helpers, validation schemas, local users
│   ├── benchmarks/             # Benchmark loaders and taxonomy derivation
│   ├── llm/                    # Dual-mode Gemini/Anthropic client & prompt templates
│   ├── persistence/            # Local & remote persistence adapters
│   ├── scoring.js              # Pure deterministic readiness calculation
│   ├── replan.js               # Dynamic roadmap replanning engine
│   └── store.js                # Centralized Zustand reactive store
└── tests/                      # 81 Vitest unit tests
```

---

## 📄 License
This project is proprietary and confidential. Built with SkillSpring AI standards.
