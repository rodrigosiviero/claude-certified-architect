import type { Flashcard } from './types';

export const domain3Cards: Flashcard[] = [
  {
    id: 'd3-01', domainId: 'domain3', lessonId: '3-1', difficulty: 'medium',
    tags: ['claude-md', 'hierarchy'],
    front: 'What is the CLAUDE.md hierarchy and why does it matter?',
    back: 'CLAUDE.md files are loaded in order: global (~/.claude/CLAUDE.md) → project root → subdirectory. Later files can override earlier ones. This allows team standards at root + per-module customization.',
  },
  {
    id: 'd3-02', domainId: 'domain3', lessonId: '3-1', difficulty: 'easy',
    tags: ['claude-md', 'purpose'],
    front: 'What should you put in a CLAUDE.md file?',
    back: 'Project context, coding conventions, architecture decisions, file structure descriptions, testing requirements, and any rules Claude should follow when working in your project. Think of it as a coding standards doc Claude reads every time.',
  },
  {
    id: 'd3-03', domainId: 'domain3', lessonId: '3-2', difficulty: 'hard',
    tags: ['path-rules', 'file-restrictions'],
    front: 'How do path restriction rules work in Claude Code?',
    back: 'Path rules control which files Claude can read/modify. They use glob patterns (e.g., "src/**/*.py"). You can set allow-lists (only these files) or deny-lists (not these files). Critical for preventing Claude from touching config files, secrets, or production code.',
  },
  {
    id: 'd3-04', domainId: 'domain3', lessonId: '3-3', difficulty: 'medium',
    tags: ['allowed-tools', 'permissions'],
    front: 'What is the allowedTools configuration?',
    back: 'A list that restricts which tools a sub-agent or session can use. For example, a "read-only analyst" agent might only have allowedTools: ["read_file", "search"]. This prevents agents from exceeding their intended capabilities.',
  },
  {
    id: 'd3-05', domainId: 'domain3', lessonId: '3-3', difficulty: 'hard',
    tags: ['subagent', 'tool-restriction'],
    front: 'Why is allowedTools critical for sub-agent security?',
    back: 'Without restrictions, a sub-agent could modify files, execute arbitrary commands, or access sensitive data. allowedTools creates a sandbox ensuring each agent can only do what it\'s supposed to. Missing a needed tool in allowedTools is a common bug.',
  },
  {
    id: 'd3-06', domainId: 'domain3', lessonId: '3-4', difficulty: 'medium',
    tags: ['ci-cd', 'flags'],
    front: 'What does the -p flag do when running Claude Code in CI/CD?',
    back: 'It enables "pipe mode" — Claude reads from stdin and writes to stdout, perfect for non-interactive CI/CD pipelines. Without -p, Claude expects interactive input and will hang waiting for user responses.',
  },
  {
    id: 'd3-07', domainId: 'domain3', lessonId: '3-4', difficulty: 'easy',
    tags: ['ci-cd', 'automation'],
    front: 'What are common pitfalls when running Claude Code in CI/CD?',
    back: '1) Missing -p flag (hangs pipeline). 2) No timeout set (infinite loops). 3) No CLAUDE.md (no context). 4) Hardcoded secrets in config. 5) Not handling rate limits gracefully.',
  },
  {
    id: 'd3-08', domainId: 'domain3', lessonId: '3-5', difficulty: 'hard',
    tags: ['plan-execute', 'workflow'],
    front: 'What is the Plan → Execute workflow pattern?',
    back: 'Split work into two phases: Plan (Claude analyzes and creates a detailed plan) → Execute (Claude follows the plan step by step). This prevents Claude from making premature decisions and gives you a chance to review before changes are made.',
  },
  {
    id: 'd3-09', domainId: 'domain3', lessonId: '3-5', difficulty: 'medium',
    tags: ['plan-execute', 'benefits'],
    front: 'Why split Plan and Execute into separate phases?',
    back: '1) You can review and correct the plan before execution. 2) Claude follows the plan more faithfully than ad-hoc decisions. 3) Easier to debug (you can see what was planned vs. what happened). 4) Reduces hallucinated actions on large tasks.',
  },
  {
    id: 'd3-10', domainId: 'domain3', lessonId: '3-6', difficulty: 'medium',
    tags: ['mcp-config', 'secrets'],
    front: 'Where should MCP server secrets (API keys) be stored?',
    back: 'In environment variables or a secrets manager — NEVER in .mcp.json or CLAUDE.md files which may be committed to git. Use ${ENV_VAR} syntax in config files to reference env vars safely.',
  },
  {
    id: 'd3-11', domainId: 'domain3', lessonId: '3-6', difficulty: 'medium',
    tags: ['ci-cd', 'json-schema'],
    front: 'What is the full CI pattern for structured Claude output?',
    back: 'Combine three flags: -p (non-interactive), --output-format json (machine-parseable), --json-schema (defines expected output structure). Claude\'s response is guaranteed to match the schema — no post-processing needed.',
  },
  {
    id: 'd3-12', domainId: 'domain3', lessonId: '3-6', difficulty: 'easy',
    tags: ['ci-cd', 'cli'],
    front: 'What does the -p / --print flag do in Claude Code CLI?',
    back: 'Runs Claude in non-interactive mode. Claude processes the prompt, outputs the result, and exits. No conversation, no follow-up. Essential for scripts and CI pipelines where no human is present.',
  },
];
