import type { LessonExplanation } from './types';

export const domain3Explanations: LessonExplanation[] = [
  {
    id: '3-1',
    explanation: `## CLAUDE.md Hierarchy

CLAUDE.md files give Claude persistent context about your project — coding standards, architecture decisions, and team conventions. They load automatically and are prompt-cached so only the first request pays full token cost.

\`\`\`mermaid
flowchart TB
    U["~/.claude/CLAUDE.md<br/>👤 User Level<br/>Personal preferences"]
    P[".claude/CLAUDE.md<br/>👥 Project Level<br/>Team standards"]
    D["src/api/CLAUDE.md<br/>📁 Directory Level<br/>Scoped rules"]

    U -->|Merge| M["Final context<br/>User → Project → Directory"]
    P -->|Merge| M
    D -->|Overrides| M

    style U fill:#8b5cf6,color:#fff
    style P fill:#3b82f6,color:#fff
    style D fill:#10b981,color:#fff
\`\`\`

### The Three Levels

| Level | Location | Purpose | Shared? |
|---|---|---|---|
| **User** | \`~/.claude/CLAUDE.md\` | Personal coding style, preferred libraries, editor settings | ❌ Never shared |
| **Project** | \`.claude/CLAUDE.md\` | Team coding standards, architecture decisions, conventions | ✅ Git-committed |
| **Directory** | \`directory/CLAUDE.md\` | Framework-specific rules, test patterns, API conventions | ✅ Scoped to folder |

### Merge Order

\`User → Project → Directory\` — later overrides earlier. Directory-level rules win over project-level when they conflict.

### @import Directive

Use \`@import\` selectively to pull in external files. Don't import everything — only what's needed.

\`\`\`markdown
# .claude/CLAUDE.md
@import ./docs/architecture.md
@import ./docs/api-conventions.md
\`\`\`

> ⚠️ **Exam trap:** Team standards belong in \`.claude/CLAUDE.md\` (project level), NOT in \`~/.claude/CLAUDE.md\` (user level). User level is personal and never shared with the team.`,
  },
  {
    id: '3-2',
    explanation: `## Commands & Skills

Commands and Skills are two ways to give Claude reusable instructions — but they serve very different purposes.

\`\`\`mermaid
flowchart LR
    subgraph Commands
        C1["In-session only"]
        C2["Quick tasks"]
        C3["Ephemeral"]
    end
    subgraph "Skills + context: fork"
        S1["Persist across sessions"]
        S2["Isolated sub-agent"]
        S3["Stored in .claude/skills/"]
    end

    style C1 fill:#f59e0b,color:#fff
    style S1 fill:#3b82f6,color:#fff
\`\`\`

### Commands

- **In-session, always available** — defined during current session
- **Ephemeral** — gone when the session ends
- **Best for:** quick tasks, one-off operations

### Skills + context: fork

- **Persist across sessions** — stored in \`.claude/skills/\`
- **\`context: fork\`** creates an isolated sub-agent with its own context window
- **Best for:** verbose tasks that might pollute the main conversation

### When to Use What

| Scenario | Use |
|---|---|
| Quick refactor across 3 files | Command |
| Generate a full test suite (verbose) | Skill + \`context: fork\` |
| Check linting rules | Command |
| Deep code review with analysis | Skill + \`context: fork\` |

### Personal Skill Variants

Personal skill variants go in \`~/.claude/skills/\` with different names. When names conflict, personal skills override project skills.

> 💡 **Key distinction:** CLAUDE.md = passive instructions (loaded but not executed). Commands = active instructions you invoke. Skills = reusable + forkable.`,
  },
  {
    id: '3-3',
    explanation: `## Path-Specific Rules

Rules let you define conventions that apply only when editing matching files — zero cost when not triggered.

\`\`\`mermaid
flowchart LR
    E["Edit src/api/auth.ts"] --> M{"Which rules match?"}
    M -->|"*.ts"| R1["TypeScript conventions"]
    M -->|"src/api/**"| R2["API patterns"]
    M -->|"*.test.ts"| R3["(no match)"]
    R1 --> A["Both rules apply<br/>additive, not exclusive"]
    R2 --> A

    style E fill:#3b82f6,color:#fff
    style A fill:#10b981,color:#fff
\`\`\`

### How Rules Work

1. Place rule files in \`.claude/rules/\` with glob patterns
2. **Only loads when editing matching files** → context efficient
3. **One rule file covers ALL matching files** (e.g., \`*.test.ts\`)
4. Rules are **lazy-loaded** — zero cost when not triggered

### Glob Pattern Examples

| Pattern | Matches |
|---|---|
| \`*.py\` | All Python files |
| \`src/**/*.ts\` | All TypeScript files under src/ |
| \`tests/**/*\` | Everything in tests/ directory |
| \`*.test.ts\` | Only test files |

### What to Put in Rules

- Linting conventions (e.g., "use double quotes in Python")
- Test patterns (e.g., "all tests must have describe/it structure")
- Import ordering rules
- API endpoint conventions

### Key Behaviors

- **Multiple rule files can match the same file** — they all apply
- **Rules are additive, not exclusive** — order doesn't matter
- **Cross-directory** — one rule can cover patterns across the entire project

> 💡 **Exam tip:** Rules are lazy-loaded and additive. This is a common question — know that multiple rules CAN apply to the same file and they don't conflict.`,
  },
  {
    id: '3-4',
    explanation: `## Plan vs Execute

The canonical pattern for using Claude Code: **plan first, then execute.** Plan mode is read-only exploration with zero risk.

\`\`\`mermaid
flowchart LR
    P["🧐 Plan Mode<br/>Read-only exploration"] --> R["Understand codebase"]
    R --> D["Decide approach"]
    D --> E["⚡ Execute Mode<br/>Implement changes"]

    style P fill:#3b82f6,color:#fff
    style E fill:#10b981,color:#fff
\`\`\`

### Plan Mode

- **Investigate only** — NO changes made to any files
- Claude can read files, search code, explore structure
- Use when: unfamiliar codebase, complex change, uncertain scope
- **Safe** — nothing gets modified

### Direct Execution

- Claude implements changes immediately
- Use when: well-understood task, small scope, confident approach

### The Canonical Pattern

\`\`\`
1. Plan → investigate the codebase, understand dependencies
2. Identify scope → what files need to change, what tests exist
3. Execute → implement the changes
\`\`\`

### Explore Sub-Agent

For verbose discovery tasks, use the **Explore sub-agent** — it investigates without cluttering the main conversation context.

| Mode | Reads | Writes | Use When |
|---|---|---|---|
| **Plan** | ✅ | ❌ | Unfamiliar code, complex change |
| **Execute** | ✅ | ✅ | Well-understood, small scope |
| **Explore sub-agent** | ✅ | ❌ | Verbose discovery, protect main context |

> ⚠️ **Exam trap:** Always plan first for unfamiliar codebases. Jumping straight to execute on unknown territory is an anti-pattern.`,
  },
  {
    id: '3-5',
    explanation: `## Iterative Refinement

Working with Claude Code is a conversation, not a one-shot command. Iterate to get the best results.

\`\`\`mermaid
flowchart LR
    S["Start simple"] --> W["Make it work"]
    W --> R["Make it right"]
    R --> F["Make it fast"]

    style S fill:#3b82f6,color:#fff
    style W fill:#f59e0b,color:#fff
    style R fill:#10b981,color:#fff
    style F fill:#8b5cf6,color:#fff
\`\`\`

### Provide Concrete I/O Examples

Bad: "Fix the function — it doesn't work right"
Good: "Input: [1, None, 3] → Expected: [1, 0, 3] → Current output: error"

**Show Claude the actual input → expected output → current (wrong) output.**

### Fix Independent Bugs Sequentially

Don't ask Claude to fix 5 unrelated bugs in one shot. Fix them one at a time, verify each, then move to the next.

### Interview Pattern for Unfamiliar Domains

Don't jump straight to "fix X." Start with:
1. "Explain how X works"
2. "What are the common pitfalls with X?"
3. "Now fix this specific issue with X"

### Each Iteration Needs a Success Criterion

Know when to stop. Each iteration should have a clear goal:
- "After this change, the test \`test_auth_flow\` should pass"
- "After this refactor, there should be zero TypeScript errors"

> 💡 **Exam tip:** "Make it work, make it right, make it fast" — this iterative approach is the recommended pattern. Not one-shot perfection.`,
  },
  {
    id: '3-6',
    explanation: `## CI/CD Integration

Running Claude Code in CI/CD requires special considerations — every session is stateless and non-interactive.

\`\`\`mermaid
flowchart TB
    CI["CI Pipeline"] --> P["claude -p 'review this PR'<br/>⚠️ -p flag is MANDATORY"]
    P --> G["Generation session<br/>Produces code/review"]
    G --> R["Review session<br/>Independent evaluation"]
    R --> D["Deploy or reject"]

    style CI fill:#3b82f6,color:#fff
    style P fill:#ef4444,color:#fff
    style G fill:#10b981,color:#fff
    style R fill:#8b5cf6,color:#fff
\`\`\`

### The -p Flag

\`-p\` is **MANDATORY** in CI. Without it, Claude enters interactive mode and **hangs forever**.

\`\`\`bash
# ✅ Correct
claude -p "Review this PR for security issues"

# ❌ Wrong — hangs in CI
claude
\`\`\`

### Stateless Sessions

- **No memory between runs** — every CI session starts from scratch
- CI sessions have no access to previous conversation
- **Inject everything needed** in the prompt — context, prior findings, test fixtures

### Separate Gen and Review Sessions

\`\`\`
Session 1: Generate code  →  output
Session 2: Review code    →  independent evaluation
\`\`\`

**Never** use the same session for generation and review — the reviewer would be biased by its own code.

### CLAUDE.md in CI

Document test fixtures and setup in CLAUDE.md so Claude knows the context. CI sessions rely on CLAUDE.md for project context since there's no conversation history.

| Rule | Why |
|---|---|
| Always use \`-p\` | Without it, Claude hangs |
| Separate gen/review | Prevents reviewer bias |
| Include prior findings | Sessions are stateless |
| Document fixtures in CLAUDE.md | Claude needs test context |
| Set clear exit criteria | Know what "done" means |

> ⚠️ **Exam trap:** "Running \`claude\` without -p in CI" is a classic wrong answer. CI is non-interactive — always use -p.

### Structured CI Output with --json-schema

The full CI pattern combines three flags:
- \`-p\` for non-interactive mode
- \`--output-format json\` for machine-parseable output
- \`--json-schema\` to define the expected output structure

\`\`\`bash
claude -p "Extract code issues" \\
  --output-format json \\
  --json-schema '{"type":"object","properties":{"issues":{"type":"array","items":{"properties":{"severity":{"type":"string","enum":["high","medium","low"]},"file":{"type":"string"},"description":{"type":"string"}}}}}}'
\`\`\`

Claude's response is guaranteed to match the schema — no post-processing needed.`,
  },
];

export default domain3Explanations;
