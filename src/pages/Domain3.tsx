import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronRight, CheckCircle2, Circle, Code, BookOpen, FlaskConical, ArrowRight, AlertTriangle, Lightbulb, ExternalLink , Brain } from 'lucide-react';
import { useCourse } from '../context/CourseContext';
import DomainQuiz from '../components/DomainQuiz';
import MindMap from '../components/MindMap';
import { domain3MindMap } from '../data/mindMaps';
import domain3Quiz from '../data/quizzes/domain3';
import domain3QuickRef from '../data/quickRefs/domain3';
import QuickRef from '../components/QuickRef';
import { domain3Explanations } from '../data/lessons';
import LessonContent from '../components/LessonContent';
import NotesFab from '../components/NotesFab';

const lessons = [
  {
    id: '3-1',
    title: 'CLAUDE.md Hierarchy & Scoping',
    duration: '45 min',
    description: 'Master the three levels of CLAUDE.md configuration files: user-level for personal preferences, project-level for team standards (in version control), and directory-level for scoped conventions. Understand @import for selective cross-package sharing.',
    knowledge: [
      'Three hierarchy levels that cascade: (1) User-level at ~/.claude/CLAUDE.md — personal to ONE developer, never enters version control. (2) Project-level at .claude/CLAUDE.md in the repo root — shared by the entire team, committed to Git. (3) Directory-level — any CLAUDE.md inside a subdirectory, scoped to files in that directory.',
      'User-level CLAUDE.md (~/.claude/CLAUDE.md): stores YOUR personal preferences — preferred language, editor style, personal aliases. NEVER shared via version control. Common exam trap: a developer puts team coding standards here and wonders why nobody else sees them.',
      'Project-level CLAUDE.md (.claude/CLAUDE.md in repo root): the single source of truth for team standards. Committed to version control, so every developer who clones the repo gets the same rules. This is where architecture decisions, code style, testing requirements, and project structure belong.',
      'Directory-level CLAUDE.md: placed inside subdirectories like src/api/CLAUDE.md or packages/auth/CLAUDE.md. Only loads when Claude is working on files in that directory or its children. Perfect for module-specific conventions.',
      'The @import directive: allows one CLAUDE.md to selectively include content from another file. Use it to import specific standards by topic into specific packages — not everything everywhere. Example: @import ../shared/api-conventions.md imports only API rules into a specific package.',
      'Import selectively: the key mistake is using @import to load ALL standards into EVERY package. Instead, import by domain. The auth package imports auth-specific rules, the API package imports API-specific rules. This saves context tokens and avoids confusion.',
      'Cascading behavior: Claude reads ALL applicable CLAUDE.md files and combines their instructions. User-level + project-level + directory-level all stack. If there\'s a conflict, more specific (directory) overrides more general (project).',
      'The .claude/ directory structure: .claude/CLAUDE.md (project-level config), .claude/commands/ (custom slash commands), .claude/skills/ (reusable skills), .claude/rules/ (path-scoped rules). Each serves a distinct purpose.',
    ],
    skills: [
      'Place team standards in project-level .claude/CLAUDE.md',
      'Keep personal preferences in ~/.claude/CLAUDE.md only',
      'Use @import selectively — by domain, not wholesale',
      'Choose directory-level CLAUDE.md for module-specific conventions',
    ],
    codeExample: `// CLAUDE.md Hierarchy — three levels that cascade

// LEVEL 1: User-level (~/.claude/CLAUDE.md)
// Location: your home directory, NEVER in version control
// Purpose: personal preferences only

// ~/.claude/CLAUDE.md
\`\`\`markdown
# My Preferences
- I prefer TypeScript over JavaScript
- Use descriptive variable names
- I work in US Eastern timezone
- When generating commits, use conventional commit format
\`\`\`

// LEVEL 2: Project-level (.claude/CLAUDE.md in repo root)
// Location: committed to Git, shared by everyone
// Purpose: team standards, architecture decisions

// .claude/CLAUDE.md
\`\`\`markdown
# Project Standards
## Architecture
- This is a Next.js 14 app with App Router
- API routes go in src/app/api/
- Components go in src/components/
- Use Server Components by default, "use client" only when needed

## Code Style
- TypeScript strict mode enabled
- Use Zod for runtime validation
- Prefer async/await over .then()

## Testing
- All new features must include tests
- Use Vitest + React Testing Library
- Test files: co-located as *.test.tsx

## Database
- Prisma ORM with PostgreSQL
- Migrations: npx prisma migrate dev
- Never modify migrations after they're committed
\`\`\`

// LEVEL 3: Directory-level (CLAUDE.md in any subdirectory)
// Only loads when working on files in that directory

// src/api/CLAUDE.md
\`\`\`markdown
# API Module Conventions
- All endpoints must validate input with Zod schemas
- Return types: { success: boolean, data?: T, error?: string }
- Rate limiting: 100 req/min per user
- Use tRPC for internal APIs, REST for external
\`\`\`

// packages/auth/CLAUDE.md
\`\`\`markdown
# Auth Package
- JWT tokens, never session cookies
- Refresh token rotation on every use
- Passwords: bcrypt with 12 rounds minimum
- All auth changes require security review
\`\`\`

// @import — selective sharing across packages

// .claude/CLAUDE.md (project root)
\`\`\`markdown
# Shared Standards
## API Conventions
- RESTful endpoints, snake_case for JSON
- Version all endpoints: /api/v1/

## Error Handling
- Never expose stack traces in production
- Use structured error codes, not free-text messages
\`\`\`

// packages/billing/.claude/CLAUDE.md
\`\`\`markdown
# Billing Package
@import ../../.claude/shared/api-conventions.md
@import ../../.claude/shared/error-handling.md

// Only imports what billing needs — not auth rules,
// not testing rules, not component conventions.
\`\`\`

// ❌ BAD: Import everything everywhere
\`\`\`markdown
@import ../../.claude/CLAUDE.md  // ALL rules, even irrelevant ones
// Wastes context tokens, confuses Claude with unrelated rules
\`\`\`

// ✅ GOOD: Import by domain
\`\`\`markdown
@import ../../.claude/shared/api-conventions.md  // Only API rules
@import ../../.claude/shared/error-handling.md   // Only error rules`,
    antiPatterns: [
      {
        pattern: 'Team standards in ~/.claude/CLAUDE.md',
        problem: 'User-level CLAUDE.md is local to ONE machine. Other developers who clone the repo will NOT see these rules. This is the #1 config mistake.',
      },
      {
        pattern: 'Importing ALL standards into every package',
        problem: '@import should be selective. Loading auth rules into the billing package wastes context and confuses Claude with irrelevant instructions.',
      },
      {
        pattern: 'No project-level CLAUDE.md',
        problem: 'Without .claude/CLAUDE.md in the repo root, every developer defines their own standards locally. Inconsistency ensues.',
      },
    ],
    keyConcepts: [
      { concept: 'Three hierarchy levels', description: 'User (~/.claude/CLAUDE.md) = personal. Project (.claude/CLAUDE.md) = team. Directory = scoped to that folder.' },
      { concept: '@import directive', description: 'Selectively include shared standards by domain. Import only what each package needs.' },
      { concept: 'Version control boundary', description: 'Project-level is committed to Git (shared). User-level is local only (personal). Never confuse the two.' },
      { concept: 'Cascading merge', description: 'All applicable CLAUDE.md files combine. More specific (directory) overrides more general (project).' },
    ],
    resources: [
      { label: 'Claude Code Configuration (Official Docs)', url: 'https://docs.anthropic.com/en/docs/claude-code/memory' },
      { label: 'CLAUDE.md Best Practices', url: 'https://docs.anthropic.com/en/docs/claude-code/best-practices' },
    ],
    examTips: [
      'The exam WILL test: "team standards not visible to new developer" → answer is "standards are in user-level ~/.claude/CLAUDE.md instead of project-level."',
      '@import is selective, not wholesale. The exam tests whether you know to import by domain.',
      'Three levels cascade: user → project → directory. Know which is shared and which is personal.',
    ],
  },
  {
    id: '3-2',
    title: 'Custom Commands & Skills',
    duration: '45 min',
    description: 'Create reusable slash commands and skills for Claude Code. Commands always execute in the current session context, while skills with context: fork run in isolated sub-agents — perfect for verbose tasks that shouldn\'t pollute the main conversation.',
    knowledge: [
      'Custom commands live in .claude/commands/ (project-scoped, shared with team) or ~/.claude/commands/ (user-scoped, personal). They become slash commands: /deploy, /review, /test.',
      'Commands always run in-session: their output goes directly into the main conversation context. This is fine for quick tasks (git commit, run tests) but terrible for verbose tasks (deep codebase exploration, multi-file analysis) because all output consumes context tokens.',
      'Skills live in .claude/skills/ (project-scoped) or ~/.claude/skills/ (user-scoped). Unlike commands, skills support frontmatter that controls execution context.',
      'The context: fork pattern is the critical distinction. A skill with "---\\ncontext: fork\\n---" in its frontmatter runs in an isolated sub-agent. Only the structured summary returns to the main session. The verbose intermediate output stays sandboxed.',
      'When to use commands vs skills: commands for quick, non-verbose tasks (git commit, run linter, check types). Skills with context: fork for verbose tasks (explore codebase, generate comprehensive test suites, multi-file refactoring analysis).',
      'Personal skill variants: if you want to experiment with a modified version of a team skill, create your own in ~/.claude/skills/ with a DIFFERENT name. Never modify the team\'s shared skill in .claude/skills/.',
      'Skills frontmatter options: context: fork (isolated execution), allowed-tools: [list] (restrict which tools the skill can use), description: text (what the skill does). These control the skill\'s execution environment.',
      'CLAUDE.md vs Commands vs Skills: CLAUDE.md is always-loaded passive instructions. Commands are active but in-session. Skills are active and can be isolated (with context: fork). Choose based on verbosity and sharing needs.',
    ],
    skills: [
      'Create project-scoped commands in .claude/commands/',
      'Create skills with context: fork for verbose tasks',
      'Create personal skill variants in ~/.claude/skills/',
      'Choose between commands, skills, and CLAUDE.md instructions',
    ],
    codeExample: `// CUSTOM COMMANDS — always in-session

// .claude/commands/deploy.md (project-scoped slash command)
\`\`\`markdown
# Deploy Command
Build the project, run tests, and deploy to staging.

Steps:
1. Run \`npm run build\` — fail if errors
2. Run \`npm test\` — fail if any test fails
3. Run \`npm run deploy:staging\`
4. Post deployment URL as confirmation
\`\`\`
// Usage: /deploy in Claude Code
// All output goes into main session context

// ~/.claude/commands/my-review.md (personal command)
\`\`\`markdown
# Personal Code Review
Review the current diff focusing on:
- Security issues (my top priority)
- Performance regressions
- Missing error handling
Format as a checklist I can paste into the PR.
\`\`\`
// Usage: /my-review — personal, not shared with team


// SKILLS — can run in isolated context

// .claude/skills/explore-codebase.md (project-scoped skill)
\`\`\`markdown
---
context: fork
allowed-tools: ["Read", "Grep", "Glob", "LS"]
description: "Deep codebase exploration with structured output"
---

# Explore Codebase Skill
Explore the codebase to understand the architecture and generate
a structured summary. Focus on:

1. Directory structure and module boundaries
2. Key dependencies and their roles
3. Data flow patterns
4. Testing strategy

Output a structured JSON summary with:
- architecture: high-level description
- modules: list of modules with their purpose
- data_flow: how data moves through the system
- test_coverage: assessment of testing strategy
- recommendations: top 3 improvement suggestions
\`\`\`

// When invoked, this skill:
// 1. Spawns an isolated sub-agent
// 2. Sub-agent reads files, explores directories (verbose!)
// 3. All verbose output stays in the sub-agent's context
// 4. Only the structured JSON summary returns to main session
// Main session stays clean!

// Personal skill variant
// ~/.claude/skills/my-explore.md
\`\`\`markdown
---
context: fork
allowed-tools: ["Read", "Grep", "Glob", "LS", "Bash"]
description: "My personal exploration with Bash access"
---

// Same as team skill but I added Bash to allowed-tools
// for running quick scripts during exploration.
// Different name avoids conflicting with team skill.
\`\`\`

// Decision framework:
// Quick task, non-verbose?     → COMMAND (in .claude/commands/)
// Verbose task, needs sandbox? → SKILL with context: fork
// Personal variant of team X?  → SKILL in ~/.claude/skills/ with different name
// Passive always-loaded rules? → CLAUDE.md (not a command or skill)`,
    antiPatterns: [
      {
        pattern: 'Using a command for verbose tasks',
        problem: 'Commands run in-session. A deep codebase exploration generating hundreds of lines will consume massive context tokens and push out earlier conversation. Use a skill with context: fork instead.',
      },
      {
        pattern: 'Modifying team skills for personal use',
        problem: 'Editing .claude/skills/team-skill.md affects everyone. Create a personal variant in ~/.claude/skills/ with a different name instead.',
      },
      {
        pattern: 'Putting executable workflows in CLAUDE.md',
        problem: 'CLAUDE.md is for passive instructions that are always loaded. Executable workflows with steps and tool calls belong in commands or skills.',
      },
    ],
    keyConcepts: [
      { concept: 'context: fork', description: 'Skill frontmatter that runs the skill in an isolated sub-agent. Only the summary returns. Verbose output stays sandboxed.' },
      { concept: 'Commands vs Skills', description: 'Commands = in-session, always. Skills = can be isolated with context: fork. Choose based on output verbosity.' },
      { concept: 'Personal variants', description: '~/.claude/skills/ with a different name. Never modify team skills for personal preferences.' },
      { concept: 'allowed-tools', description: 'Skill frontmatter that restricts which tools the skill can use. Limits the blast radius of automated operations.' },
    ],
    resources: [
      { label: 'Claude Code Commands', url: 'https://docs.anthropic.com/en/docs/claude-code/commands' },
      { label: 'Claude Code Skills', url: 'https://docs.anthropic.com/en/docs/claude-code/skills' },
    ],
    examTips: [
      'context: fork is heavily tested. Know that it isolates verbose output from the main session.',
      '"Verbode exploration floods main session" → answer: use skill with context: fork.',
      'Personal variants go in ~/.claude/skills/ with a DIFFERENT name, not in the shared .claude/skills/.',
    ],
  },
  {
    id: '3-3',
    title: 'Path-Specific Rules',
    duration: '35 min',
    description: 'Use .claude/rules/ with glob patterns to apply conventions only when editing matching files. This solves the problem of scattered file types (test files, API routes) that exist across many directories.',
    knowledge: [
      'The problem: some file types are scattered across many directories. Test files (*.test.ts) might exist in 40+ directories. You want consistent rules for all of them, but directory-level CLAUDE.md would require 40+ identical files.',
      'The solution: .claude/rules/ with glob patterns. Create a single file like .claude/rules/testing.md with frontmatter paths: ["**/*.test.ts"] and the rules inside it. This ONE file covers ALL matching test files across every directory.',
      'Rules only activate when editing files that match the glob pattern. Editing src/auth/login.ts? The testing rules DON\'T load. Editing src/auth/login.test.ts? The testing rules DO load. This saves context tokens compared to loading ALL rules for ALL files.',
      'Directory-level CLAUDE.md vs glob-patterned rules: use directory-level when conventions naturally align with folder boundaries (all rules for src/api/ live in that directory). Use glob-patterned rules when conventions span multiple directories (test files everywhere).',
      'Glob pattern reference: **/*.test.tsx matches all .test.tsx files in any directory. src/api/** matches everything under src/api/. **/*.{ts,tsx} matches all TypeScript files project-wide. terraform/**/* matches everything in the terraform directory.',
      'Anti-pattern: placing cross-directory conventions in project-level .claude/CLAUDE.md. This loads the testing convention when editing non-test files, adding irrelevant noise and wasting context.',
      'Anti-pattern: creating a CLAUDE.md in every directory for cross-cutting concerns. 40 directories with identical CLAUDE.md files is unmaintainable. One glob-patterned rule file is the correct approach.',
      'Rules are just markdown files with optional YAML frontmatter. The frontmatter specifies which files trigger the rule. The body contains the instructions Claude should follow when editing matching files.',
    ],
    skills: [
      'Create glob-patterned rules in .claude/rules/',
      'Choose between directory-level CLAUDE.md and glob rules',
      'Write effective glob patterns for file matching',
    ],
    codeExample: `// Path-specific rules with glob patterns

// PROBLEM: Test files scattered across 40+ directories
// You want ALL *.test.ts files to follow the same convention.
//
// ❌ WRONG: CLAUDE.md in every directory
// src/auth/CLAUDE.md (same content)
// src/api/CLAUDE.md (same content)
// src/users/CLAUDE.md (same content)
// ... 37 more identical files. Unmaintainable!

// ❌ WRONG: Put testing rules in project-level CLAUDE.md
// .claude/CLAUDE.md
// - Loads for ALL files, even non-test files
// - Wastes context when editing src/auth/login.ts
// - Adds irrelevant noise

// ✅ CORRECT: Single glob-patterned rule file
// .claude/rules/testing.md
\`\`\`markdown
---
paths: ["**/*.test.ts", "**/*.test.tsx"]
---
# Testing Conventions
- Use describe/it blocks (not test())
- Group by behavior, not by implementation
- Each test should have ONE assertion focus
- Use beforeEach for setup, afterEach for cleanup
- Mock external dependencies, never internal modules
- Test file structure: arrange → act → assert
\`\`\`

// This ONE file covers ALL test files across ALL directories.
// Only loads when editing files matching **/*.test.ts or **/*.test.tsx.

// More glob pattern examples:

// .claude/rules/api-routes.md
\`\`\`markdown
---
paths: ["src/app/api/**"]
---
# API Route Conventions
- Validate all inputs with Zod schemas
- Return typed responses with proper HTTP status codes
- Include request ID in error responses
- Rate limit all public endpoints
\`\`\`

// .claude/rules/terraform.md
\`\`\`markdown
---
paths: ["terraform/**/*"]
---
# Terraform Conventions
- All resources must have a description tag
- Use variables for environment-specific values
- Never hardcode AWS region
- State locking required for all environments
\`\`\`

// .claude/rules/react-components.md
\`\`\`markdown
---
paths: ["src/components/**/*.{ts,tsx}"]
---
# React Component Conventions
- Use Server Components by default
- "use client" only when hooks or event handlers are needed
- Props interface defined above the component
- Extract reusable logic into custom hooks
\`\`\`

// Decision framework:
// Conventions align with folder?     → Directory-level CLAUDE.md
// Conventions span multiple folders? → .claude/rules/ with glob patterns`,
    antiPatterns: [
      {
        pattern: 'Placing cross-directory conventions in project CLAUDE.md',
        problem: 'Testing rules in .claude/CLAUDE.md load when editing ALL files, not just tests. Wastes context and adds noise.',
      },
      {
        pattern: 'CLAUDE.md in every directory for cross-cutting concerns',
        problem: '40+ identical files is unmaintainable. One glob-patterned rule file covers all matching files.',
      },
      {
        pattern: 'Over-broad glob patterns',
        problem: '"**/*" matches everything — no different from project-level CLAUDE.md. Be specific with patterns like "**/*.test.ts".',
      },
    ],
    keyConcepts: [
      { concept: '.claude/rules/ with paths', description: 'Rule files that activate only when editing files matching the glob pattern. One file, many directories.' },
      { concept: 'Directory vs Glob', description: 'Directory CLAUDE.md for folder-aligned conventions. Glob rules for scattered file types.' },
      { concept: 'Context efficiency', description: 'Rules load only when relevant. This saves tokens compared to always-loading project-level instructions.' },
    ],
    resources: [
      { label: 'Claude Code Rules', url: 'https://docs.anthropic.com/en/docs/claude-code/memory#rules' },
    ],
    examTips: [
      'The exam WILL present a "scattered test files" scenario. The answer is always .claude/rules/ with glob patterns.',
      'Know the difference: directory CLAUDE.md for folder boundaries, glob rules for cross-directory patterns.',
      'Glob rules only load when editing matching files — this context efficiency is a key exam point.',
    ],
  },
  {
    id: '3-4',
    title: 'Plan Mode vs Direct Execution',
    duration: '40 min',
    description: 'Decide when to use plan mode (investigation, architecture decisions, multi-file analysis) versus direct execution (clear-scope tasks, single-file changes). The canonical pattern from the official PDF: plan to investigate, then execute to implement.',
    knowledge: [
      'Plan mode tells Claude to think through the approach without making changes. Claude reads files, explores the codebase, and generates a detailed plan — but does NOT write any code or modify any files. Think of it as a "dry run" or "architectural review."',
      'Direct execution is the default mode: Claude reads files, makes changes, runs tests, and iterates. This is appropriate for clear-scope tasks where you know exactly what needs to happen.',
      'The canonical pattern from the official PDF: PLAN for investigation, then DIRECT EXECUTION for implementation. For a large refactoring: (1) Use plan mode to explore the codebase and design the approach. (2) Switch to direct execution to implement the planned approach. Claude retains the plan context.',
      'When to use plan mode: architectural decisions, multi-file refactoring, unfamiliar codebase exploration, migration planning, breaking down complex tasks into steps. Any task where you\'re not sure of the approach yet.',
      'When to use direct execution: bug fixes with clear scope, single-file changes, adding a new function, updating configurations. Any task where you can clearly describe what needs to change.',
      'The Explore sub-agent: for verbose discovery tasks (understanding a large codebase), use Claude\'s built-in Explore capability. This runs in an isolated context and returns a structured summary, keeping the main session clean. This is related to the context: fork pattern from Domain 3.2.',
      'Plan mode and direct execution are NOT mutually exclusive. The exam tests this. You should combine them: plan first to understand, then execute to implement. Don\'t stay in plan mode forever (changes never happen), and don\'t skip planning for complex tasks (risky blind execution).',
      'After planning, Claude retains full context of the investigation. When you switch to direct execution, Claude already knows the codebase structure, dependencies, and the planned approach. This makes implementation faster and more accurate.',
    ],
    skills: [
      'Choose plan mode for architectural decisions',
      'Switch to direct execution after planning',
      'Use Explore sub-agent for verbose discovery',
      'Combine plan + execute for complex tasks',
    ],
    codeExample: `// Plan Mode vs Direct Execution

// SCENARIO: Migrate Express.js app to Fastify (45+ files affected)

// ❌ WRONG: Jump straight to execution
// Claude starts editing files without understanding the scope
// Misses critical dependencies, breaks things across modules

// ❌ WRONG: Stay in plan mode forever
// You have a beautiful plan but nothing actually changes
// Plan mode does NOT modify files

// ✅ CORRECT: Plan first, then execute

// Step 1: Plan mode — investigate
claude "I need to migrate this Express app to Fastify.
       First, explore the codebase and create a detailed
       migration plan. Do NOT make any changes yet."
// Claude:
// - Reads package.json to understand dependencies
// - Explores route definitions across all files
// - Identifies middleware patterns in use
// - Maps Express-specific APIs to Fastify equivalents
// - Generates a step-by-step migration plan
// - NO files are modified

// Step 2: Direct execution — implement the plan
claude "Now implement the migration plan we created.
       Start with the foundation (package.json, server.ts)
       then migrate routes one module at a time.
       Run tests after each module migration."
// Claude:
// - Already knows the codebase from planning
// - Implements changes following the plan
// - Runs tests to verify each step
// - Makes files changes, runs commands

// The Explore sub-agent for verbose discovery
// When plan mode generates too much verbose output:
claude "Use the Explore sub-agent to understand the
       authentication module. I need a structured summary
       of how auth works, not every file's contents."
// Explore runs in isolation:
// - Reads all auth-related files
// - Traces the auth flow
// - Returns a clean structured summary
// - Verbose reading stays sandboxed

// Quick reference:
// Plan mode:     Think, explore, design — NO changes
// Direct:        Read, modify, test — MAKE changes
// Combined:      Plan → Execute (canonical pattern)
// Explore agent: Verbose discovery → Clean summary`,
    antiPatterns: [
      {
        pattern: 'Direct execution for complex multi-file tasks',
        problem: 'Without planning, Claude doesn\'t understand the full scope. Changes may break dependencies across modules. Plan first for anything touching 5+ files.',
      },
      {
        pattern: 'Staying in plan mode',
        problem: 'Plan mode NEVER modifies files. A perfect plan with no execution is worthless. Switch to direct execution after planning.',
      },
      {
        pattern: 'Treating plan and execute as mutually exclusive',
        problem: 'The exam tests the COMBINED pattern: plan to investigate, execute to implement. They work together, not in isolation.',
      },
    ],
    keyConcepts: [
      { concept: 'Plan mode', description: 'Think-only mode. Claude explores, analyzes, and plans but makes NO changes. For investigation and architecture.' },
      { concept: 'Direct execution', description: 'Default mode. Claude reads, modifies, tests, iterates. For implementation of clear-scope tasks.' },
      { concept: 'Plan then Execute', description: 'Canonical pattern: plan for investigation, then switch to execution for implementation. Claude retains plan context.' },
      { concept: 'Explore sub-agent', description: 'Isolated verbose discovery. Returns structured summary to main session. Clean alternative to in-session exploration.' },
    ],
    resources: [
      { label: 'Claude Code Overview', url: 'https://docs.anthropic.com/en/docs/claude-code/overview' },
    ],
    examTips: [
      '"Migrate large codebase" → plan mode first, then direct execution. This is the canonical pattern from the PDF.',
      'Plan mode does NOT modify files. The exam will test this directly.',
      'Explore sub-agent keeps verbose output out of the main session. Same concept as context: fork for skills.',
    ],
  },
  {
    id: '3-5',
    title: 'Iterative Refinement',
    duration: '35 min',
    description: 'Techniques for getting better results from Claude Code through concrete examples, exact error output, and the interview pattern. These are practical patterns for day-to-day Claude Code usage that the exam tests in scenario questions.',
    knowledge: [
      'Provide 2-3 concrete input/output examples instead of abstract descriptions. "Make the API faster" is vague. "This endpoint takes 3 seconds; it should take under 500ms. Here\'s the current query and the expected output format" is concrete.',
      'Include exact test failure output when asking Claude to fix bugs. Don\'t paraphrase "the test is failing." Paste the actual error: "Expected status 200 but received 404. Route /api/users/123 returned NOT_FOUND. Stack trace: ..."',
      'The interview pattern: when working in an unfamiliar domain, ask Claude to interview YOU first. "I need to build a payment processing system. Before writing any code, interview me about the requirements, constraints, and edge cases." This produces much better results than jumping straight to code.',
      'Batch interacting issues: when Claude finds multiple bugs, don\'t try to fix them all simultaneously. Fix independent issues sequentially. Fix dependent issues together. This prevents cascading errors where fix A breaks fix B.',
      'Specificity beats volume: a short, specific prompt with concrete examples outperforms a long, detailed prompt with abstract descriptions. Show, don\'t tell.',
      'Progressive refinement: start with a working version, then iterate. Don\'t try to get everything perfect in one shot. "First, make it work. Then, make it clean. Then, make it fast." Each iteration has a clear focus.',
      'The "show your work" pattern: ask Claude to explain its reasoning before making changes. "Before editing, tell me what you plan to change and why." This catches wrong assumptions early.',
      'Context restoration: if a long session loses focus, summarize the current state and start a fresh prompt with that summary. Don\'t try to fix accumulated confusion — reset with clear context.',
    ],
    skills: [
      'Provide concrete I/O examples in prompts',
      'Include exact error output for bug fixes',
      'Use the interview pattern for unfamiliar domains',
      'Fix independent issues sequentially, dependent ones together',
    ],
    codeExample: `// Iterative Refinement Techniques

// ❌ BAD: Vague, abstract request
claude "Fix the API performance issue"
// Claude doesn't know which endpoint, what "slow" means,
// or what the expected behavior is. Will guess wrong.

// ✅ GOOD: Concrete with examples
claude \`The GET /api/users/:id endpoint is slow.

Current behavior:
- Request: GET /api/users/123
- Response time: ~3 seconds
- Response: { "id": 123, "name": "John", "orders": [...] }

Expected behavior:
- Response time: under 500ms
- Same response format
- The bottleneck is likely the N+1 query loading orders

Here's the current implementation:
\${readFile('src/api/users.ts')}

Fix the N+1 query issue and verify the response format.\`

// ❌ BAD: Paraphrased error
claude "The login test is failing, fix it"
// Claude doesn't know WHICH test, WHAT error, or WHY.

// ✅ GOOD: Exact error output
claude \`Fix this failing test:

Test: "should return 200 for valid credentials"
File: tests/auth/login.test.ts

Error output:
  Expected: 200
  Received: 404
  Message: "Route POST /api/v1/auth/login not found"

The route exists at POST /api/auth/login (without v1).
Either fix the test or fix the route registration.\`

// Interview pattern for unfamiliar domains
claude \`I need to build a payment processing module.
Before writing any code, interview me about:

1. What payment providers do we support?
2. What currencies? What about refunds?
3. PCI compliance requirements?
4. Idempotency for duplicate payments?
5. Webhook handling for async confirmations?

Ask me questions one at a time. After you have
all the information, propose an architecture.\`

// Batch interacting issues — sequential fixes
// Claude found 3 bugs:
// Bug A: Missing null check (independent)
// Bug B: Wrong date format (independent)
// Bug C: Uses result of Bug A (dependent on A)

// ❌ BAD: Fix all at once
claude "Fix all three bugs"
// Fix C depends on Fix A — parallel fixes create conflicts

// ✅ GOOD: Fix sequentially
claude "Fix Bug A (missing null check) first"
// ... verify fix A works ...
claude "Now fix Bug B (wrong date format)"
// ... verify fix B works ...
claude "Now fix Bug C, which depends on Bug A's fix"
// ... verify fix C works ...`,
    antiPatterns: [
      {
        pattern: 'Vague abstract requests',
        problem: '"Fix the bug" without error output forces Claude to guess. Include exact error messages, expected vs actual behavior.',
      },
      {
        pattern: 'Fixing dependent bugs simultaneously',
        problem: 'If Fix C depends on Fix A, fixing both at once creates conflicts. Fix sequentially: A first, verify, then C.',
      },
      {
        pattern: 'Trying to get everything perfect in one shot',
        problem: 'Progressive refinement beats one-shot perfection. Make it work → make it clean → make it fast. Each pass has a clear focus.',
      },
    ],
    keyConcepts: [
      { concept: 'Concrete I/O examples', description: '2-3 specific input/output pairs instead of abstract descriptions. Show the exact problem.' },
      { concept: 'Exact error output', description: 'Paste actual error messages, stack traces, and expected vs actual. Don\'t paraphrase.' },
      { concept: 'Interview pattern', description: 'For unfamiliar domains, ask Claude to interview you about requirements before writing code.' },
      { concept: 'Sequential fixes', description: 'Fix independent bugs one at a time. Fix dependent bugs after their dependencies are resolved.' },
    ],
    resources: [
      { label: 'Claude Code Best Practices', url: 'https://docs.anthropic.com/en/docs/claude-code/best-practices' },
    ],
    examTips: [
      'The exam tests "how to get better results from Claude Code" — answer is always: concrete examples, exact errors, specificity.',
      'Interview pattern: for unfamiliar domains, have Claude interview you first. This produces better code than jumping in.',
      'Sequential fixes for independent bugs. Don\'t batch everything — fix one at a time and verify.',
    ],
  },
  {
    id: '3-6',
    title: 'CI/CD Integration',
    duration: '45 min',
    description: 'Run Claude Code in automated CI/CD pipelines for code review and test generation. Learn the critical -p flag for non-interactive mode, stateless session management, and the pattern of including prior findings to avoid duplicate reports.',
    knowledge: [
      'The -p flag is MANDATORY for CI/CD. Without it, Claude enters interactive mode and waits for user input — causing your pipeline to hang indefinitely. Always use: claude -p "your prompt here" in CI.',
      'CI sessions are stateless and fresh every run. Each pipeline execution starts with zero memory of prior runs. This is fundamentally different from interactive usage where conversation context accumulates.',
      'Separate sessions for generation and review. Using the same Claude session to generate AND review code creates confirmation bias — Claude is more likely to approve its own work. Use separate sessions (or separate pipeline steps) for generation and review.',
      'The duplicate findings problem: when CI re-runs review on every commit to an open PR, Claude reports the same issues again and again because each run starts fresh. Fix: include prior findings in the prompt and instruct Claude to report only NEW or still-unresolved issues.',
      'Test generation needs context about existing tests. Claude has no inherent knowledge of your test suite. Without providing existing test files, Claude will generate tests that duplicate already-covered scenarios. Fix: include existing test files in the generation prompt.',
      'Document fixtures in CLAUDE.md for CI. If your tests use specific fixtures (sample data, mock objects), document them in .claude/CLAUDE.md so Claude knows to use them instead of inventing new test data.',
      'The --output-format flag controls Claude\'s output format. Use --output-format json in CI for machine-parseable results. Use --json-schema to define the expected output structure.',
      'Review criteria in CLAUDE.md: document what your CI review should check — security issues, performance regressions, style violations, test coverage requirements. Claude follows these criteria consistently when they\'re documented.',
    ],
    skills: [
      'Use claude -p for non-interactive CI execution',
      'Separate generation and review sessions',
      'Include prior findings to avoid duplicate reports',
      'Provide existing test context for test generation',
    ],
    codeExample: `// CI/CD Integration with Claude Code

// CRITICAL: -p flag for non-interactive mode
// ❌ WRONG: Interactive mode (pipeline hangs forever)
// claude "Review the code"
// Claude waits for user input that never comes in CI

// ✅ CORRECT: Non-interactive mode
// claude -p "Review the code" --output-format json

// GitHub Actions CI Pipeline
// .github/workflows/claude-review.yml
\`\`\`yaml
name: Claude Code Review
on: pull_request

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Get changed files
        id: changed
        run: |
          echo "files=$(git diff --name-only \\
            \${{ github.event.pull_request.base.sha }} \\
            \${{ github.sha }} | tr '\\n' ' ')" >> $GITHUB_OUTPUT

      - name: Claude Code Review (non-interactive, fresh session)
        env:
          ANTHROPIC_API_KEY: \${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          claude -p "
            Review changed files: \${{ steps.changed.outputs.files }}
            Prior findings (do not re-report): \\
              $(cat .claude/prior_findings.json 2>/dev/null || echo '{}')
            Output structured findings per JSON schema.
          " --output-format json \\
            > review_result.json

      - name: Post Review as PR Comment
        run: python scripts/post_github_comment.py review_result.json
\`\`\`

// SOLVING THE DUPLICATE FINDINGS PROBLEM

// Step 1: Store prior findings after each review
\`\`\`yaml
- name: Store findings for next run
  run: |
    cp review_result.json .claude/prior_findings.json
    git add .claude/prior_findings.json
    git commit -m "chore: update prior review findings"
\`\`\`

// Step 2: Include in next review prompt
// "Prior findings: $(cat .claude/prior_findings.json)"
// "Report only NEW or still-unresolved issues."

// SEPARATE SESSIONS: Generate vs Review

// ❌ WRONG: Same session for both
claude -p "Generate tests for auth.ts, then review them"
// Confirmation bias: Claude approves its own work

// ✅ CORRECT: Separate pipeline steps
\`\`\`yaml
# Step 1: Generate tests (separate session)
- name: Generate Tests
  run: |
    claude -p "
      Generate tests for: \${{ steps.changed.outputs.files }}
      Existing test suite: \\
        $(find tests/ -name '*.py' | head -20 | xargs cat)
      Follow CLAUDE.md test generation guidelines.
      Do NOT duplicate existing test scenarios.
    " --output-format json > generated_tests.json

# Step 2: Review (completely separate session)
- name: Review Generated Tests
  run: |
    claude -p "
      Review the generated tests in: generated_tests.json
      Check for: security, edge cases, assertion quality.
      Do NOT generate code — only review.
    " --output-format json > review.json
\`\`\`

// CLAUDE.md for CI-optimized instructions
// .claude/CLAUDE.md
\`\`\`markdown
## CI Test Generation Guidelines
When generating tests in CI mode:

### Available Fixtures (use these — do not create new)
- tests/fixtures/orders.py — sample orders
- tests/fixtures/customers.py — customer profiles

### Focus On:
1. Error paths and exception handling
2. Boundary values (zero, max, empty)
3. State transitions
4. Do NOT duplicate existing test scenarios
\`\`\``,
    antiPatterns: [
      {
        pattern: 'Running Claude Code without -p in CI',
        problem: 'Without -p, Claude enters interactive mode. The pipeline hangs forever waiting for user input. This is the #1 CI mistake.',
      },
      {
        pattern: 'Same session for generate and review',
        problem: 'Confirmation bias — Claude is more likely to approve its own work. Use separate sessions/steps.',
      },
      {
        pattern: 'Re-running reviews without prior findings',
        problem: 'Each CI run starts fresh. Without prior findings context, Claude reports the same issues on every commit. Include them in the prompt.',
      },
    ],
    keyConcepts: [
      { concept: '-p flag', description: 'Non-interactive mode. MANDATORY for CI. Without it, Claude waits for input and hangs the pipeline.' },
      { concept: 'Stateless sessions', description: 'Every CI run starts fresh. No memory of prior runs. Must explicitly include prior context.' },
      { concept: 'Separate generate and review', description: 'Different sessions for code generation and review to avoid confirmation bias.' },
      { concept: 'Prior findings pattern', description: 'Include previous review results in the prompt. Instruct Claude to skip already-fixed issues.' },
    ],
    resources: [
      { label: 'Claude Code CI/CD Integration', url: 'https://docs.anthropic.com/en/docs/claude-code/ci-cd' },
      { label: 'Claude Code Overview', url: 'https://docs.anthropic.com/en/docs/claude-code/overview' },
    ],
    examTips: [
      '"Pipeline hangs indefinitely" → answer: missing -p flag for non-interactive mode. This is a guaranteed question.',
      '"Duplicate findings on every CI run" → answer: include prior findings in the prompt context.',
      '"Confirmation bias in CI" → answer: separate sessions for generation and review.',
      'CI sessions are STATELESS. Every run starts fresh. This is tested directly.',
    ],
  },
  {
    id: '3-exam',
    title: 'Domain 3 Exam Practice Quiz',
    duration: '15 min',
    description: 'Interactive quiz covering all 6 subdomains of Claude Code configuration and workflows.',
    knowledge: [],
    skills: [],
    codeExample: '',
    quiz: domain3Quiz,
  },
  {
    id: '3-summary',
    title: 'Chapter Summary & Quick Reference',
    duration: '10 min',
    description: 'Visual cheat sheet for exam day — collapsible cards, anti-patterns, and 60-second scan.',
    knowledge: [],
    skills: [],
    codeExample: '',
    quickRef: domain3QuickRef,
  },
];

export default function Domain3() {
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const { completeLesson, isLessonCompleted } = useCourse();

  const toggleLesson = (id: string) => {
    setExpandedLesson(expandedLesson === id ? null : id);
  };

  const markComplete = (id: string) => {
    const newCompleted = new Set(completedLessons);
    if (newCompleted.has(id)) {
      newCompleted.delete(id);
    } else {
      newCompleted.add(id);
      completeLesson('domain3', id);
    }
    setCompletedLessons(newCompleted);
  };

  return (
    <div className="space-y-8">
      {/* Domain Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-8 text-white">
        <div className="flex items-center gap-3 mb-2">
          <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">Domain 3</span>
          <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">20% Exam Weight</span>
        </div>
        <h1 className="text-3xl font-bold mb-2">Claude Code Configuration &amp; Workflows</h1>
        <p className="text-blue-100 max-w-2xl">Master CLAUDE.md hierarchy, custom commands and skills, path-specific rules, plan mode, iterative refinement, and CI/CD integration.</p>
        <div className="flex items-center gap-6 mt-4 text-sm text-blue-100">
          <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" /> 8 Lessons</span>
          <span className="flex items-center gap-1"><FlaskConical className="w-4 h-4" /> Full Code Examples</span>
          <span className="flex items-center gap-1"><Lightbulb className="w-4 h-4" /> Exam Tips</span>
        </div>
      </div>

      {/** Mind Map **/}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
          <Brain className="w-5 h-5 text-emerald-500" />
          Mind Map — Key Concepts
        </h2>
        <MindMap data={domain3MindMap.root} />
      </div>

      {/* Progress */}
      <div className="bg-white rounded-xl border p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-700">Progress</span>
          <span className="text-sm text-slate-500">{completedLessons.size}/{lessons.length} lessons completed</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all"
            style={{ width: `${(completedLessons.size / lessons.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Lessons */}
      <div className="space-y-3">
        {lessons.map((lesson) => {
          const isExpanded = expandedLesson === lesson.id;
          const isCompleted = completedLessons.has(lesson.id) || isLessonCompleted('domain3', lesson.id);

          return (
            <div key={lesson.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <button
                onClick={() => toggleLesson(lesson.id)}
                className="w-full flex items-center gap-4 p-5 text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${isCompleted ? 'bg-green-500' : 'bg-slate-100'}`}>
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{lesson.id}</span>
                    <h3 className="font-semibold text-slate-900">{lesson.title}</h3>
                  </div>
                  <p className="text-sm text-slate-500 mt-1 truncate">{lesson.description}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-xs text-slate-400">{lesson.duration}</span>
                  {isExpanded ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
                </div>
              </button>

              {isExpanded && (
                <div className="border-t p-6 space-y-6">
                  {/* Deep Explanation */}
                  {(() => {
                    const expl = domain3Explanations.find(e => e.id === lesson.id);
                    return expl ? (
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                          <Lightbulb className="w-4 h-4 text-amber-500" />
                          Learn
                        </h4>
                        <LessonContent content={expl.explanation} domainColor="violet" />
                      </div>
                    ) : null;
                  })()}

                  {/* Knowledge */}
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-blue-500" />
                      Key Knowledge
                    </h4>
                    <ul className="space-y-2">
                      {lesson.knowledge.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Skills */}
                  {'skills' in lesson && lesson.skills && lesson.skills.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                        <FlaskConical className="w-4 h-4 text-green-500" />
                        Practical Skills
                      </h4>
                      <ul className="space-y-2">
                        {lesson.skills.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Code Example */}
                  {'quiz' in lesson && (lesson as any).quiz ? (
                    <DomainQuiz questions={(lesson as any).quiz} domainColor="amber" domainId="domain3" />
                  ) : 'quickRef' in lesson && (lesson as any).quickRef ? (
                    <QuickRef {...(lesson as any).quickRef} domainColor="amber" />
                  ) : (
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                        <Code className="w-4 h-4 text-amber-500" />
                        Full Working Example
                      </h4>
                      <pre className="bg-slate-900 text-slate-100 rounded-lg p-4 text-sm overflow-x-auto max-h-[600px]">
                        <code>{lesson.codeExample}</code>
                      </pre>
                    </div>
                  )}

                  {/* Anti-patterns */}
                  {'antiPatterns' in lesson && lesson.antiPatterns && lesson.antiPatterns.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                        Anti-Patterns to Avoid
                      </h4>
                      <div className="space-y-2">
                        {lesson.antiPatterns.map((pattern, i) => (
                          <div key={i} className="bg-red-50 border border-red-200 rounded-lg p-3">
                            <p className="font-medium text-red-900 text-sm">{pattern.pattern}</p>
                            <p className="text-red-700 text-sm">{pattern.problem}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Key Concepts */}
                  {'keyConcepts' in lesson && lesson.keyConcepts && lesson.keyConcepts.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Key Concepts</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {lesson.keyConcepts.map((concept, i) => (
                          <div key={i} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <p className="font-medium text-blue-900 text-sm">{concept.concept}</p>
                            <p className="text-blue-700 text-xs">{concept.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Resources */}
                  {'resources' in lesson && lesson.resources && lesson.resources.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                        <ExternalLink className="w-4 h-4 text-indigo-500" />
                        Official Documentation
                      </h4>
                      <div className="space-y-2">
                        {lesson.resources.map((resource, i) => (
                          <a
                            key={i}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 hover:underline"
                          >
                            <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                            {resource.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Exam Tips */}
                  {lesson.examTips && lesson.examTips.length > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <h4 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4" />
                      Exam Tips
                    </h4>
                    <ul className="space-y-1">
                      {lesson.examTips.map((tip, i) => (
                        <li key={i} className="text-sm text-amber-800 flex items-start gap-2">
                          <span className="text-amber-600">→</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                  )}

                  {/* Mark Complete */}
                  <div className="flex justify-end pt-4 border-t border-slate-100">
                    <button
                      onClick={() => markComplete(lesson.id)}
                      className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
                        isCompleted
                          ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}
                    >
                      {isCompleted ? 'Mark as Incomplete' : 'Mark as Complete'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <NotesFab lessonId={expandedLesson || '3-1'} />

      {/* Navigation */}
      <div className="flex justify-between pt-8 border-t border-slate-200 dark:border-slate-800">
        <Link
          to="/domain/2"
          className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors"
        >
          Previous: Tool Design &amp; MCP
        </Link>
        <Link
          to="/domain/4"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors"
        >
          Next: Prompt Engineering &amp; Extended Thinking
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}