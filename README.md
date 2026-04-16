# 🏛️ Claude Architect Course

Interactive study guide for the **Claude Architect certification exam**. Covers all 5 exam domains with lessons, hands-on labs, quizzes, flashcards, scenario practice exams, and progress tracking.

Built with React, TypeScript, and Tailwind CSS. Runs entirely in the browser — no backend, no API keys needed.

---

## What's Inside

| Feature | Details |
|---------|---------|
| **5 Domains** | Full curriculum with 30+ lessons covering every exam topic |
| **14 Hands-on Labs** | Python-based with step-by-step console logging |
| **201 Quiz Questions** | Per-lesson quizzes with instant feedback and explanations |
| **120 Scenario Questions** | 6 exam scenarios × 20 questions each |
| **60-Question Practice Exam** | Mixed trivia-style exam with scoring |
| **20 Mixed Scenarios** | Scenario-based questions across all domains |
| **50 Flashcards** | Spaced repetition-style study cards |
| **Quick Reference Cards** | Visual exam-prep cheat sheets per domain |
| **Mind Maps** | Interactive knowledge maps for each domain |
| **Progress Tracking** | Scores, streaks, weak areas, and achievements |

---

## Exam Scenarios

The real exam randomly picks 4 of 6 scenarios. This course lets you practice all of them:

| # | Scenario | Focus |
|---|----------|-------|
| 🎧 1 | Customer Support Resolution Agent | Agentic loops, tool design, PII protection |
| 💻 2 | Code Generation with Claude Code | Refactoring, testing, security hooks |
| 🔬 3 | Multi-Agent Research System | Orchestration, citation tracking, hallucination detection |
| 🚀 4 | Developer Productivity with Claude | Code review, documentation, scope management |
| 🔄 5 | Claude Code for CI/CD | Pipelines, deployment validation, incident response |
| 📊 6 | Structured Data Extraction | Schema design, validation, accuracy testing |

---

## Exam Domains

| Domain | Topic | Lessons |
|--------|-------|---------|
| 1 | Agentic Architecture | Loops, termination, multi-agent orchestration, subagents, hooks |
| 2 | Tool Design & MCP | Tool descriptions, error handling, schemas, MCP servers |
| 3 | Claude Code Configuration | CLAUDE.md hierarchy, commands, path rules, CI/CD integration |
| 4 | Prompt Engineering | System prompts, few-shot examples, structured output, criteria |
| 5 | Safety & Evaluation | PII protection, monitoring, retry strategies, accuracy metrics |

---

## Getting Started

```bash
# Clone the repo
git clone https://github.com/rodrigosiviero/claude-certified-architect.git
cd claude-architect-course

# Install dependencies (pnpm recommended)
pnpm install

# Start dev server
pnpm dev

# Or use npm
npm install && npm run dev
```

The app opens at `http://localhost:5173`.

---

## Build for Production

```bash
pnpm build        # outputs to dist/
pnpm preview      # preview the production build
```

The built app is fully static — deploy to any static host (Vercel, Netlify, GitHub Pages, S3, etc.).

---

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── DomainQuiz.tsx       # Interactive quiz with instant feedback
│   ├── QuickRef.tsx         # Visual quick-reference cards
│   ├── FlashcardDeck.tsx    # Spaced repetition flashcards
│   ├── MindMap.tsx          # Interactive knowledge maps
│   ├── LabRunner.tsx        # Hands-on lab player with console
│   ├── CodeBlock.tsx        # Syntax-highlighted code display
│   └── ...
├── context/
│   └── CourseContext.tsx     # Global state (progress, scores, labs)
├── data/
│   ├── lessons/             # Lesson content for all 5 domains
│   ├── labs/                # 14 hands-on Python labs
│   ├── quizzes/             # Per-domain quiz questions
│   ├── quickRefs/           # Quick reference card data
│   ├── mindMaps/            # Mind map structures
│   ├── flashcards/          # 50 study flashcards
│   ├── scenarios/           # 20 mixed scenario questions
│   ├── scenarioExams/       # 6 × 20 scenario-specific exams
│   ├── practiceExam/        # 60-question practice exam
│   ├── examScenarioLabs/    # 24 exam scenario walkthroughs
│   ├── achievements/        # Achievement definitions
│   └── diagrams/            # Mermaid diagram definitions
├── pages/
│   ├── Home.tsx             # Landing page
│   ├── CourseOverview.tsx   # Full course overview
│   ├── Dashboard.tsx        # Progress dashboard
│   ├── Domain1-5.tsx        # Domain lesson pages
│   ├── Labs.tsx             # Lab browser
│   ├── ScenarioExam.tsx     # Mixed scenario exam (20Q)
│   ├── ScenarioExamHub.tsx  # 6-scenario practice hub (6×20Q)
│   ├── PracticeExam.tsx     # 60-question practice test
│   ├── Flashcards.tsx       # Flashcard study mode
│   ├── Achievements.tsx     # Achievement gallery
│   └── ...
├── hooks/                   # Custom React hooks
├── lib/                     # Utility functions
├── App.tsx                  # Router setup
└── main.tsx                 # Entry point
```

---

## Key Features in Detail

### Interactive Quizzes
Every lesson ends with a quiz that provides instant feedback — correct/incorrect with detailed explanations and trap analysis. Scores persist across sessions.

### Scenario-Based Practice
The exam tests through realistic scenarios. Practice all 6 official exam scenarios with 20 questions each, covering all 5 domains in the context of real-world use cases.

### Hands-on Labs
14 Python labs walk through building real agentic systems. Each lab includes detailed console output that traces the agentic loop execution step by step.

### Progress Dashboard
Track your scores across all quizzes, labs, and practice exams. The dashboard highlights weak areas (scores below 70%) so you know exactly what to review.

### Flashcards
50 expertly crafted flashcards covering the most testable concepts. Flip to reveal the answer, mark your confidence, and track your study streak.

### Quick Reference Cards
Visual cheat sheets for each domain with key concepts, code patterns, and exam tips — designed for last-minute review.

---

## Tech Stack

- **React 18** + **TypeScript** — type-safe component architecture
- **Vite** — fast builds and HMR
- **Tailwind CSS** — utility-first styling
- **React Router v6** — client-side routing
- **Recharts** — progress charts and visualizations
- **Lucide React** — consistent icon set
- **Vitest** — test suite (327 tests)

---

## Running Tests

```bash
pnpm test           # run all tests once
pnpm test:watch     # run tests in watch mode
```

---

## License

MIT — use this however you want. Good luck on the exam! 🎓
