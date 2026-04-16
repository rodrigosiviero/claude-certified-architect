import type { QuizQuestion } from '../types';

const domain3Quiz: QuizQuestion[] = [
  {
    question: 'A developer puts personal editor preferences (dark theme, single quotes) in the project-level CLAUDE.md. What is wrong?',
    options: [
      'CLAUDE.md doesn\'t support style preferences',
      'Personal preferences should go in ~/.claude/CLAUDE.md (user-level), not the project-level config shared by the team',
      'Preferences should go in package.json instead',
      'Nothing — all preferences belong in project CLAUDE.md',
    ],
    correctIndex: 1,
    explanation: 'The CLAUDE.md hierarchy has three levels: user (~/.claude/CLAUDE.md), project (./CLAUDE.md), and session. Personal prefs belong at user level so they don\'t impose on teammates.',
    trap: 'Option A is false — CLAUDE.md can contain style preferences. Option D ignores team collaboration. The exam tests understanding of the CLAUDE.md hierarchy and scope.',
  },
  {
    question: 'Your agent explores a large codebase by reading files, but all exploration content fills the main context window. What should you use?',
    options: [
      'Reduce the number of files the agent reads',
      'Use the Task tool for exploration so it happens in an isolated subagent context',
      'Increase the context window size in the API call',
      'Compress file contents before sending to Claude',
    ],
    correctIndex: 1,
    explanation: 'The Task tool creates an isolated subagent context for exploration work. The main agent only receives the summarized findings, keeping the primary context clean and focused.',
    trap: 'Option A limits functionality. Option C is not a real API parameter. Option D adds complexity. The exam tests understanding of Task tool for context isolation.',
  },
  {
    question: 'A test rule "Always mock external API calls" in CLAUDE.md applies to ALL files, including non-test files. What is the fix?',
    options: [
      'Remove the rule entirely',
      'Move the rule to .claude/rules/test-files.md with a path-specific pattern',
      'Add "except for src/" in the rule text',
      'Create a separate CLAUDE.md for test files',
    ],
    correctIndex: 1,
    explanation: 'Path-specific rules in .claude/rules/ only apply to matching file patterns. This keeps test rules scoped to test files without polluting rules for source files.',
    trap: 'Option A loses the rule. Option C relies on Claude understanding natural language exceptions unreliably. Option D is not the correct mechanism. The exam tests .claude/rules/ path-specific configuration.',
  },
  {
    question: 'Your CI pipeline runs "claude Review this PR" and hangs forever. What flag is missing?',
    options: [
      '--model claude-sonnet-4-20250514',
      '--print (or -p) for non-interactive mode',
      '--max-tokens 4096',
      '--temperature 0',
    ],
    correctIndex: 1,
    explanation: 'The --print (-p) flag runs Claude in non-interactive/print mode, essential for CI/CD pipelines where there is no terminal for interactive input. Without it, Claude waits for stdin indefinitely.',
    trap: 'Option A doesn\'t solve the interactive mode problem. Options C and D are generation parameters, not mode flags. The exam tests CI/CD integration with Claude CLI.',
  },
  {
    question: 'An agent immediately starts modifying 45 files without a plan. What pattern should have been used?',
    options: [
      'Use a smaller model that plans better',
      'Use plan mode first: let Claude create a plan, get human approval, then execute',
      'Reduce the number of files to 5',
      'Add more system prompt instructions about being careful',
    ],
    correctIndex: 1,
    explanation: 'Plan mode forces Claude to create a structured plan before making changes. The plan is presented for human review and approval, preventing uncontrolled modifications.',
    trap: 'Option D is a band-aid — system prompts alone don\'t prevent massive changes. Option A is not a real solution. The exam tests plan mode vs execute mode workflow.',
  },
];

export default domain3Quiz;
