/**
 * Question Bank — D3 Claude Code & Development Workflows (10 questions)
 */
import type { PoolQuestion } from './d1';

const d3New: PoolQuestion[] = [
  {
    poolId: 146, domain: 'd3', domainLabel: 'CLAUDE.md Hierarchy',
    examTask: '3.1 CLAUDE.md Hierarchy & Scoping',
    scenario: 'Your project has a root CLAUDE.md with general coding standards and a src/api/CLAUDE.md with API-specific conventions. A developer asks Claude Code to refactor an API endpoint. Claude follows the general standards from the root CLAUDE.md but ignores the API-specific error handling and authentication patterns defined in the nested CLAUDE.md.',
    question: 'What is the most likely cause and correct fix for Claude not applying the API-specific conventions?',
    options: [
      'A) Claude Code loads only the root CLAUDE.md by default. You need to move the API conventions into the root file or use .claude/rules/ with glob patterns targeting src/api/** to ensure API-specific conventions are automatically applied.',
      'B) The nested CLAUDE.md has a formatting error. Fix the markdown syntax and Claude will automatically detect and apply it.',
      'C) Claude Code doesn\'t support nested CLAUDE.md files. All conventions must be in the single root CLAUDE.md.',
      'D) The developer needs to explicitly reference the nested CLAUDE.md in their prompt: "Follow the conventions in src/api/CLAUDE.md when refactoring."',
    ],
    correct: 0,
    explanation: 'Claude Code does support nested CLAUDE.md files and loads them for relevant file paths — but the rules system (.claude/rules/) with glob patterns provides more reliable path-scoped application than nested CLAUDE.md files, which may not always be loaded depending on how the query is framed. B is unlikely to be the cause. C is incorrect — nested CLAUDE.md files are supported. D requires manual intervention on every query, defeating the purpose of configuration files. [Task 3.1 — CLAUDE.md Hierarchy: understanding which configuration files are loaded and when is essential for reliable convention enforcement.]',
  },
  {
    poolId: 147, domain: 'd3', domainLabel: 'Custom Commands & Skills',
    examTask: '3.2 Custom Commands & Skills',
    scenario: 'Your team wants a /review slash command that runs a standard code review checklist (security, performance, testing, documentation). The command should be available to all team members when they clone the repository. Currently, one developer has it working in their personal ~/.claude/commands/ directory, but other team members don\'t have it.',
    question: 'Where should the command file be created to make it universally available to the team?',
    options: [
      'A) In ~/.claude/commands/ on each developer\'s machine, distributed via a setup script.',
      'B) In .claude/commands/ within the project repository, so it\'s version-controlled and automatically available when anyone clones the repo.',
      'C) In the root CLAUDE.md file as a special ## Commands section.',
      'D) In a shared network drive that all developers mount at ~/.claude/shared-commands/.',
    ],
    correct: 1,
    explanation: 'Project-scoped commands in .claude/commands/ are version-controlled with the repo and automatically available to all team members on clone. A requires per-developer setup and drifts over time. C is not how commands are defined — CLAUDE.md is for context and instructions, not command definitions. D is an unconventional approach that adds infrastructure complexity. [Task 3.2 — Custom Commands: project-scoped commands in .claude/commands/ ensure consistent availability across teams.]',
  },
  {
    poolId: 148, domain: 'd3', domainLabel: 'Path-Specific Rules',
    examTask: '3.3 Path-Specific Rules',
    scenario: 'Your codebase has test files spread throughout the codebase alongside source files (Button.test.tsx next to Button.tsx). You want Claude Code to always use Jest testing patterns and React Testing Library conventions when generating or modifying test files, regardless of which directory they\'re in.',
    question: 'What configuration approach will most reliably apply test-specific conventions to all test files?',
    options: [
      'A) Create a .claude/rules/test-conventions.md file with YAML frontmatter specifying a glob pattern like **/*.test.{ts,tsx,js,jsx} to automatically apply testing conventions to matching files.',
      'B) Add a testing conventions section to each subdirectory\'s CLAUDE.md file where test files exist.',
      'C) Include testing conventions in the root CLAUDE.md under a "## Test Files" header.',
      'D) Add testing conventions as comments in each test file that Claude should follow.',
    ],
    correct: 0,
    explanation: 'Rules files in .claude/rules/ with glob patterns apply conventions based on file paths regardless of directory structure — essential for test files that are co-located with source files across many directories. B requires maintaining multiple CLAUDE.md files and misses directories that might contain tests in the future. C relies on Claude inferring which section applies, which is unreliable. D requires modifying existing files and depends on Claude reading comments. [Task 3.3 — Path-Specific Rules: glob-based rules are the most reliable way to apply conventions to scattered file patterns.]',
  },
  {
    poolId: 149, domain: 'd3', domainLabel: 'Plan Mode vs Direct Execution',
    examTask: '3.4 Plan Mode vs Direct Execution',
    scenario: 'You need to migrate a monolithic REST API to a microservices architecture. The codebase has 45 API endpoints, 12 database models, and complex inter-service dependencies. You estimate the changes will touch 80+ files.',
    question: 'What is the most appropriate Claude Code approach for this task?',
    options: [
      'A) Use direct execution mode with detailed upfront instructions specifying exactly how each microservice should be structured, including API boundaries and data models.',
      'B) Use plan mode first to explore the codebase, understand dependencies, map service boundaries, and design the migration approach, then switch to direct execution with the approved plan.',
      'C) Use direct execution and let Claude discover the architecture during implementation, making incremental changes that reveal the natural service boundaries.',
      'D) Start in direct execution mode and switch to plan mode only if Claude encounters unexpected complexity during implementation.',
    ],
    correct: 1,
    explanation: 'Plan mode is designed for complex tasks involving architectural decisions, large-scale changes, and multiple valid approaches. Exploring the codebase and designing the migration plan before making any changes prevents costly rework. A assumes you already know the optimal structure without exploration. C risks discovering critical dependencies late in the process. D ignores that the complexity is already stated in the requirements. [Task 3.4 — Plan Mode: use plan mode for complex architectural tasks before committing to changes.]',
  },
  {
    poolId: 150, domain: 'd3', domainLabel: 'Iterative Refinement',
    examTask: '3.5 Iterative Refinement',
    scenario: 'You ask Claude Code to implement a complex data transformation pipeline. The first implementation works but has 3 issues: it doesn\'t handle null values, the error messages are generic, and it processes records sequentially instead of in batches. You want to address all three issues.',
    question: 'What iterative refinement approach would be most effective?',
    options: [
      'A) Start over with a new, more detailed prompt that includes all requirements: null handling, specific error messages, and batch processing.',
      'B) Address one issue at a time in follow-up prompts: first "Add null value handling for all fields," then "Replace generic error messages with field-specific messages including the record ID," then "Refactor to process records in batches of 100."',
      'C) Submit a single follow-up listing all three issues and ask Claude to fix them all simultaneously.',
      'D) Implement the fixes manually since Claude\'s first attempt was incomplete.',
    ],
    correct: 1,
    explanation: 'One issue at a time ensures each fix is correct and doesn\'t introduce regressions. It also makes it easy to verify each change independently and roll back if needed. A discards working code and starts over — wasteful. C risks Claude missing or partially addressing one of the three issues in a single pass. D negates the productivity benefit of using Claude Code. [Task 3.5 — Iterative Refinement: incremental improvement is more reliable than big-bang rewrites.]',
  },
  {
    poolId: 151, domain: 'd3', domainLabel: 'CI/CD Integration',
    examTask: '3.6 CI/CD Integration',
    scenario: 'Your GitHub Actions pipeline runs claude "Review this PR for security vulnerabilities" but the job hangs indefinitely. Logs show Claude Code is waiting for interactive input — a confirmation prompt about reading a large file.',
    question: 'What is the correct way to run Claude Code in a CI/CD pipeline?',
    options: [
      'A) Add the -p (or --print) flag: claude -p "Review this PR for security vulnerabilities" to run in non-interactive mode, processing the prompt and outputting to stdout without waiting for user input.',
      'B) Set the environment variable CLAUDE_HEADLESS=true before running the command to disable interactive prompts.',
      'C) Redirect stdin from /dev/null: claude "Review this PR for security vulnerabilities" < /dev/null',
      'D) Add the --batch flag: claude --batch "Review this PR for security vulnerabilities" to enable batch processing mode.',
    ],
    correct: 0,
    explanation: 'The -p (or --print) flag is the documented way to run Claude Code non-interactively. It processes the prompt, outputs to stdout, and exits — exactly what CI/CD requires. B references a non-existent environment variable. C is a Unix workaround that doesn\'t address Claude Code\'s interactive mode. D references a non-existent flag. [Task 3.6 — CI/CD Integration: the -p flag is essential for automated pipeline usage of Claude Code.]',
  },
  {
    poolId: 152, domain: 'd3', domainLabel: 'CLAUDE.md Hierarchy',
    examTask: '3.1 CLAUDE.md Hierarchy & Scoping',
    scenario: 'Your project has CLAUDE.md at the root with general instructions. A new team member adds detailed API documentation to a file called src/api/DOCS.md expecting Claude to reference it during API development. Claude never references this file because it\'s not in a recognized location.',
    question: 'Where should API documentation be placed so Claude Code automatically uses it during API-related tasks?',
    options: [
      'A) In the root CLAUDE.md file under an "## API Documentation" section.',
      'B) In a CLAUDE.md file at src/api/CLAUDE.md — Claude Code automatically loads nested CLAUDE.md files when working with files in that directory.',
      'C) In a .claude/context/ directory as a markdown file that Claude loads on startup.',
      'D) In the project\'s README.md file, which Claude Code always reads.',
    ],
    correct: 1,
    explanation: 'Claude Code loads CLAUDE.md files at multiple levels — root and nested directories. When working with files in src/api/, it automatically loads src/api/CLAUDE.md alongside the root CLAUDE.md. A bloats the root file. C is not a recognized Claude Code directory. D is not guaranteed — README.md is not automatically loaded as context. [Task 3.1 — CLAUDE.md Hierarchy: nested CLAUDE.md files provide directory-scoped context automatically.]',
  },
  {
    poolId: 153, domain: 'd3', domainLabel: 'Custom Commands & Skills',
    examTask: '3.2 Custom Commands & Skills',
    scenario: 'You create a custom /migrate command in .claude/commands/migrate.md that guides Claude through database migration best practices. The command works but always uses generic migration patterns, ignoring your project\'s specific ORM (Prisma) and database conventions.',
    question: 'How can you make the /migrate command project-aware without hardcoding project details in the command file?',
    options: [
      'A) Reference project conventions using $ARGUMENTS in the command and require users to specify the ORM each time: /migrate prisma.',
      'B) Have the command file instruct Claude to read the project\'s schema.prisma and existing migration files before generating new migrations — leveraging CLAUDE.md and project context that is automatically available.',
      'C) Create separate commands for each ORM: /migrate-prisma, /migrate-typeorm, /migrate-knex.',
      'D) Include the full Prisma documentation in the command file so Claude has all the context it needs.',
    ],
    correct: 1,
    explanation: 'Having the command instruct Claude to read relevant project files leverages the automatically available context (CLAUDE.md, existing code) without hardcoding details. This makes the command reusable across projects with different ORMs. A shifts burden to the user. C creates maintenance overhead. D bloats the command file and may become outdated. [Task 3.2 — Custom Commands: effective commands leverage project context rather than embedding static information.]',
  },
  {
    poolId: 154, domain: 'd3', domainLabel: 'Plan Mode vs Direct Execution',
    examTask: '3.4 Plan Mode vs Direct Execution',
    scenario: 'You need to add rate limiting to 8 API endpoints. Each endpoint has similar but not identical request patterns. You\'re deciding between plan mode and direct execution.',
    question: 'When is plan mode the better choice over direct execution for this task?',
    options: [
      'A) Plan mode is better because any task touching more than 5 files should use plan mode.',
      'B) Direct execution is appropriate here because the pattern is consistent (add rate limiting), the scope is well-defined (8 endpoints), and you can provide clear instructions for the implementation approach.',
      'C) Plan mode is better because rate limiting is a security feature and all security changes require plan mode.',
      'D) Use plan mode first to explore the codebase, then direct execution for implementation.',
    ],
    correct: 1,
    explanation: 'This is a well-defined, repetitive task with a clear implementation pattern — ideal for direct execution. The scope is bounded (8 endpoints) and the approach is straightforward (apply the same rate limiting pattern). Plan mode adds unnecessary overhead here. A uses an arbitrary file count threshold. C applies a blanket rule that doesn\'t exist. D adds an unnecessary exploration step for a straightforward task. [Task 3.4 — Plan Mode: direct execution is appropriate for well-defined, pattern-based tasks even when they span multiple files.]',
  },
  {
    poolId: 155, domain: 'd3', domainLabel: 'CI/CD Integration',
    examTask: '3.6 CI/CD Integration',
    scenario: 'Your team wants to use Claude Code in CI for two workflows: (1) a blocking pre-merge PR review that developers wait for, and (2) an overnight technical debt report. Your manager proposes using the Message Batches API for both to save 50% on costs.',
    question: 'How should you evaluate this proposal?',
    options: [
      'A) Approve the proposal — 50% cost savings justifies the switch for both workflows.',
      'B) Use Message Batches for the overnight technical debt report only. Keep real-time API calls for the pre-merge review since developers need results before they can merge, and batch processing has no guaranteed latency SLA.',
      'C) Reject the proposal entirely — Message Batches are not suitable for any production workflow.',
      'D) Use Message Batches for both but implement status polling to check for early completion on the pre-merge reviews.',
    ],
    correct: 1,
    explanation: 'Message Batches offer 50% savings but can take up to 24 hours with no latency SLA — unacceptable for blocking workflows where developers wait for results. The overnight report is ideal for batching since results are reviewed the next day regardless. A ignores the latency requirements. C is overly cautious — batching is perfect for non-blocking workloads. D adds complexity and doesn\'t solve the fundamental latency issue. [Task 3.6 — CI/CD Integration: match API choice to workflow latency requirements.]',
  },
];

export default d3New;
