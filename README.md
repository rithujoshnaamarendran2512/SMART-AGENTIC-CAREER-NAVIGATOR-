# The Agentic Career Navigator

## A Multi-Agent System for Real-Time Skill Evolution

An AI-powered career guidance platform where eight specialized agents collaborate to analyze a user's profile, identify skill gaps, monitor industry trends, recommend learning resources, generate a personalized roadmap, and continuously re-evaluate career readiness.

---

## Tech Stack

| Layer            | Technology                          |
|-----------------|--------------------------------------|
| Frontend         | React 18 + TypeScript + Vite        |
| Styling          | Tailwind CSS 3                      |
| Icons            | Lucide React                        |
| Database         | Supabase (PostgreSQL)               |
| Authentication   | Supabase Auth (email/password)      |
| AI/ML Layer      | Custom agent modules (TypeScript)   |
| Data Processing  | Weighted scoring + similarity logic |

---

## Project Structure

```
agentic-career-navigator/
│
├── index.html                          # HTML entry point
├── package.json                        # Dependencies and scripts
├── vite.config.ts                      # Vite configuration
├── tsconfig.json                       # TypeScript config (root)
├── tsconfig.app.json                   # TypeScript config (app)
├── tsconfig.node.json                  # TypeScript config (node)
├── tailwind.config.js                  # Tailwind CSS configuration
├── postcss.config.js                   # PostCSS configuration
├── eslint.config.js                    # ESLint configuration
├── .env                                # Environment variables (Supabase keys)
├── .gitignore
├── README.md                           # This file
│
├── supabase/
│   └── migrations/
│       ├── create_career_navigator_schema.sql   # Database schema (11 tables + RLS)
│       └── seed_catalog_data.sql                # Seed data (skills, careers, resources, trends)
│
└── src/
    ├── main.tsx                        # React entry point
    ├── App.tsx                         # Root component + routing
    ├── index.css                       # Tailwind CSS imports
    ├── vite-env.d.ts                   # Vite type declarations
    │
    ├── agents/                         # === MULTI-AGENT LAYER ===
    │   ├── profileAgent.ts             # Agent 1: Profile Analysis
    │   ├── careerAgent.ts              # Agent 2: Career Recommendation (weighted scoring)
    │   ├── skillAgent.ts               # Agent 3: Skill Requirement
    │   ├── gapAgent.ts                 # Agent 4: Skill Gap Analysis
    │   ├── trendAgent.ts               # Agent 5: Industry Trend
    │   ├── learningAgent.ts            # Agent 6: Learning Recommendation
    │   ├── roadmapAgent.ts             # Agent 7: Career Roadmap (7 phases)
    │   ├── progressAgent.ts            # Agent 8: Progress Tracking
    │   └── orchestrator.ts             # Agent Orchestrator (coordinates all 8)
    │
    ├── components/                     # === UI COMPONENTS ===
    │   ├── AppShell.tsx                # Sidebar navigation + layout
    │   └── ui.tsx                      # Reusable UI (Card, Badge, ProgressBar, etc.)
    │
    ├── pages/                          # === PAGES ===
    │   ├── HomePage.tsx                # Landing page (project overview)
    │   ├── AuthPage.tsx                # Login / Sign up
    │   ├── DashboardPage.tsx           # Main dashboard (agent pipeline summary)
    │   ├── ProfilePage.tsx             # Profile builder (education, skills, projects, certs)
    │   ├── CareersPage.tsx             # Career recommendations with score breakdowns
    │   ├── SkillsPage.tsx              # Skill gap analysis table
    │   ├── LearningPage.tsx            # Learning resource recommendations
    │   ├── RoadmapPage.tsx             # 7-phase personalized career roadmap
    │   ├── TrendsPage.tsx              # Industry trends (emerging/declining skills)
    │   └── ProgressPage.tsx            # Progress tracking with continuous re-evaluation
    │
    ├── hooks/                          # === REACT HOOKS ===
    │   ├── useAuth.tsx                 # Authentication context + provider
    │   └── useAppData.ts               # Loads all catalog + user data
    │
    └── lib/                            # === DATA & TYPES ===
        ├── supabase.ts                 # Supabase client singleton
        ├── types.ts                    # All TypeScript interfaces & agent output types
        ├── catalog.ts                  # Catalog data access (skills, careers, trends)
        └── userData.ts                 # User data access (CRUD for all user tables)
```

---

## Multi-Agent Architecture

```
User Profile
     ↓
┌─────────────────────────┐
│  Profile Analysis Agent │  → Structured profile JSON
└───────────┬─────────────┘
            ↓
┌─────────────────────────┐
│  Career Recommendation  │  → Ranked careers with compatibility %
│  Agent                  │     (Skill 40% + Interest 20% + Education 15%
└───────────┬─────────────┘      + Experience 15% + Demand 10%)
            ↓
┌─────────────────────────┐
│  Skill Requirement Agent│  → Required skills per career
└───────────┬─────────────┘
            ↓
┌─────────────────────────┐
│  Skill Gap Analysis     │  → Gap report (acquired/partial/missing)
│  Agent                  │
└───────────┬─────────────┘
            ↓
┌─────────────────────────┐
│  Industry Trend Agent   │  → Emerging & declining skills
└───────────┬─────────────┘
            ↓
┌─────────────────────────┐
│  Learning Recommendation│  → Courses, tutorials, projects per gap
│  Agent                  │
└───────────┬─────────────┘
            ↓
┌─────────────────────────┐
│  Career Roadmap Agent   │  → 7-phase adaptive roadmap
└───────────┬─────────────┘
            ↓
┌─────────────────────────┐
│  Progress Tracking      │  → Updated readiness + remaining gaps
│  Agent                  │
└───────────┬─────────────┘
            ↓
     Continuous Re-evaluation (feedback loop)
```

### Agent Communication

Each agent produces a typed output that becomes the input for the next agent.
The **Orchestrator** (`src/agents/orchestrator.ts`) coordinates the full pipeline
and can run individual agents or the complete chain.

---

## Database Design

### Tables (11 total)

| Table                  | Purpose                                    |
|------------------------|--------------------------------------------|
| `profiles`             | User profile data (education, experience)  |
| `skills`               | Catalog of all known skills                |
| `user_skills`          | User's self-assessed skill levels (1-5)    |
| `careers`              | Catalog of career roles                    |
| `career_skills`        | Skills required per career (level+priority)|
| `learning_resources`   | Courses/tutorials linked to skills         |
| `industry_trends`      | Trend data (labeled demo or live)          |
| `recommendations`      | Saved career compatibility scores          |
| `progress`             | User's learning progress per skill         |
| `user_projects`        | Projects added by user                     |
| `user_certifications`  | Certifications added by user               |

### Security

- Row Level Security (RLS) enabled on every table
- User-owned tables are owner-scoped (`auth.uid() = user_id`)
- Catalog tables are read-only for authenticated users
- 4 separate policies per table (SELECT, INSERT, UPDATE, DELETE)

---

## Setup Instructions (VS Code)

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [VS Code](https://code.visualstudio.com/)
- A [Supabase](https://supabase.com/) account (free tier works)

### Step 1: Create the Project

1. Open VS Code
2. Open a terminal (`Ctrl+` `` ` `` or `View → Terminal`)
3. Create a new folder and navigate into it:

```bash
mkdir agentic-career-navigator
cd agentic-career-navigator
```

### Step 2: Initialize the Project

```bash
npm create vite@latest . -- --template react-ts
```

When prompted, select "React" and "TypeScript".

Then install dependencies:

```bash
npm install
npm install @supabase/supabase-js lucide-react
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Step 3: Create the File Structure

Create the following folders and files in VS Code (use the Explorer sidebar or terminal):

```bash
mkdir -p src/agents src/components src/pages src/hooks src/lib
mkdir -p supabase/migrations
```

Now create each file listed in the **Project Structure** above and paste the
corresponding code from this project into each file.

### Step 4: Configure Tailwind CSS

**`tailwind.config.js`** — replace with:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: { extend: {} },
  plugins: [],
}
```

**`src/index.css`** — replace with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Step 5: Configure Vite

**`vite.config.ts`** — replace with:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
```

Add this to your `tsconfig.app.json` under `compilerOptions`:

```json
"paths": {
  "@/*": ["./src/*"]
}
```

### Step 6: Set Up Supabase

1. Go to [supabase.com](https://supabase.com/) and create a new project
2. In the SQL Editor, run the two SQL files from `supabase/migrations/`:
   - First run `create_career_navigator_schema.sql` (creates tables + RLS)
   - Then run `seed_catalog_data.sql` (inserts skills, careers, resources, trends)
3. Go to **Project Settings → API** and copy your:
   - Project URL
   - Anon/public key

4. Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

5. Go to **Authentication → Settings** and:
   - Make sure **Email auth** is enabled
   - Turn **OFF** "Confirm email" (so users can sign in immediately)

### Step 7: Run the Project

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## Running the Project

| Command              | Description                         |
|----------------------|-------------------------------------|
| `npm run dev`        | Start the development server        |
| `npm run build`      | Build for production                |
| `npm run preview`    | Preview the production build        |
| `npm run typecheck`  | Run TypeScript type checking        |
| `npm run lint`       | Run ESLint                          |

---

## User Workflow

1. **Register** — Create an account with email and password
2. **Build Profile** — Enter education, skills (with proficiency 1-5), experience, interests, projects, and certifications
3. **View Career Recommendations** — The Career Agent ranks careers with transparent compatibility scores
4. **Select Target Career** — Click "Set as Target Career" on a recommendation
5. **Review Skill Gaps** — The Gap Agent shows what you have vs. what's needed
6. **Explore Industry Trends** — See which skills are emerging or declining (labeled as demo data)
7. **Follow Learning Recommendations** — Curated courses and tutorials for your gaps
8. **Follow Your Roadmap** — A 7-phase plan from foundation to job readiness
9. **Track Progress** — Update your learning progress; the system re-evaluates readiness
10. **Continuous Re-evaluation** — As you progress, gaps and readiness update automatically

---

## Recommendation Engine

### Career Compatibility Score Formula

```
Compatibility = (Skill Match × 0.40)
              + (Interest Match × 0.20)
              + (Education Match × 0.15)
              + (Experience Match × 0.15)
              + (Industry Demand × 0.10)
```

Each sub-score is normalized to 0–100, and the final score is also 0–100.

### Skill Gap Calculation

For each required skill:

```
Gap = Required Level − User Level

Gap Category:
  Gap = 0  → Acquired
  Gap = 1  → Low Gap
  Gap = 2  → Medium Gap
  Gap ≥ 3  → High Gap (Missing)
```

### Career Readiness

```
Career Readiness = (1 − Overall Gap %) × Progress Factor
```

The Progress Agent recalculates this whenever the user updates their learning progress.

---

## Industry Trend Data

The system has a **modular trend layer**. Currently, trend data is **simulated**
(labeled `source = 'demo'` in the database) and is clearly displayed as "Demo Data"
in the UI.

To connect a **live job-market API** in the future:

1. Create an edge function that fetches data from a job board or labor statistics API
2. Store the results in the `industry_trends` table with `source = 'live'`
3. The Trend Agent automatically detects live data and updates the UI label

The agent logic does not change — only the data source.

---

## Testing with the Sample User

Use this example to test the system:

- **Name:** Rithu Joshna
- **Education:** B.Sc. Computer Science
- **Skills:** Python (4), Java (3), SQL (3), HTML (3), CSS (3), C (2), C++ (2), Git (3), Pandas (3), Scikit-learn (2), Flask (2), JavaScript (2), SQLite (2)
- **Interests:** Artificial Intelligence, Machine Learning, Software Development, Data Science
- **Goal:** Find a suitable technology career and identify required skills

**Expected top recommendations:** Python Developer, Data Analyst, Machine Learning Engineer

---

## Viva Preparation — Key Questions

### What is Agentic AI?
AI systems composed of multiple specialized agents that each handle a specific task and collaborate to produce a final result — unlike a single chatbot that tries to do everything.

### How do agents communicate?
Each agent produces a typed output (a structured object) that becomes the input for the next agent. The Orchestrator module coordinates the pipeline.

### How is career compatibility calculated?
A weighted scoring formula across 5 factors: Skill Match (40%), Interest Match (20%), Education Match (15%), Experience Match (15%), Industry Demand (10%).

### How is a skill gap identified?
By comparing the user's proficiency level (1-5) against the required level for a target career. The difference determines the gap category.

### How does real-time skill evolution work?
The Progress Agent continuously compares current skills, industry requirements, and target career requirements. When progress changes, it recalculates gaps, readiness, and recommendations.

### What happens if industry data changes?
The Trend Agent processes updated data from the `industry_trends` table. New emerging skills are prioritized in learning recommendations and the roadmap.

### Why TypeScript instead of Python/Flask?
The original spec suggested Flask/Python, but this implementation uses a modern web stack (React + TypeScript + Supabase) for a richer, interactive UI. The multi-agent architecture and scoring logic are identical in concept.

---

## Future Enhancements

- LLM-powered agents (GPT/Claude integration)
- Real-time job-market API integration
- Resume parsing and analysis
- LinkedIn/GitHub profile import
- AI mock interviews
- Cloud deployment (Vercel/Netlify)
- Mobile application
- Multilingual support

---

## Limitations

- Industry trend data is currently simulated (clearly labeled as demo)
- No live job-board API integration yet (architecture is modular for this)
- Skill levels are self-assessed (no automated assessment)
- Career catalog is limited to 8 roles (extensible via database)