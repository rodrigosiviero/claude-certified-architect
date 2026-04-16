import type { QuizQuestion } from '../types';

const domain1Quiz: QuizQuestion[] = [
  {
    question: 'Which implementation correctly terminates the agentic loop?',
    options: [
      'Check if Claude\'s response contains "Task complete"',
      'Stop after exactly 5 iterations',
      'Use stop_reason == "end_turn" as the primary termination signal',
      'Stop when the last tool call returned HTTP 200',
    ],
    correctIndex: 2,
    explanation: 'stop_reason is the ONLY reliable programmatic termination signal. Iteration count is a safety net, not the primary mechanism.',
    trap: 'Option B (iteration count) is tempting because it\'s simple and prevents infinite loops. But the exam tests that you know stop_reason is the PRIMARY signal — iteration count is secondary safety only. Option A parses natural language which is an anti-pattern.',
  },
  {
    question: 'Your research coordinator routes every request through all three subagents. How should you optimize?',
    options: [
      'Add a keyword classifier to pre-route requests',
      'Always use all subagents for comprehensive results',
      'Let Claude decide dynamically which subagents to invoke based on the query',
      'Create a single mega-agent with all capabilities',
    ],
    correctIndex: 2,
    explanation: 'Claude drives subagent selection dynamically in the hub-and-spoke pattern. The coordinator reads the query and decides which subagent to invoke — only when needed.',
    trap: 'Option A (keyword classifier) is tempting if you\'re thinking about traditional routing. But the exam tests that Claude itself handles dynamic routing — pre-configured keyword rules are an anti-pattern the exam specifically calls out.',
  },
  {
    question: 'You need to mask PII in tool results before Claude sees them. Which hook type should you use?',
    options: [
      'PreToolUse — to prevent the tool from running',
      'PostToolUse — to normalize/filter results after execution',
      'A system prompt instruction to ignore PII',
      'Modify the tool schema to exclude PII fields',
    ],
    correctIndex: 1,
    explanation: 'PostToolUse fires AFTER the tool executes, letting you filter or normalize the result before it enters Claude\'s context. PreToolUse fires BEFORE execution (for gating/blocking).',
    trap: 'Option A (PreToolUse) is tempting because "masking PII" sounds like prevention. But you WANT the tool to run — you just need to scrub the output. Option C doesn\'t actually prevent PII from entering the context window.',
  },
  {
    question: 'Your agent\'s session state grows unbounded after 50+ turns. What is the correct approach?',
    options: [
      'Restart the session every 10 turns',
      'Implement context window management: summarize old turns, prune stale tool results',
      'Increase max_tokens to accommodate the growing context',
      'Store all state in a database and retrieve on each turn',
    ],
    correctIndex: 1,
    explanation: 'Context window management involves summarizing older conversation turns and pruning stale tool results. This keeps the context relevant and within limits.',
    trap: 'Option A (hard restart) loses all context. Option C doesn\'t help — max_tokens controls output length, not context size. Option D adds latency and doesn\'t solve the context window problem.',
  },
  {
    question: 'A subagent completed its task but the next subagent sees stale context from the previous one. What went wrong?',
    options: [
      'The subagents need separate API keys',
      'The coordinator shared a single message history between subagents instead of isolated contexts',
      'The model version is outdated',
      'The tool results were formatted incorrectly',
    ],
    correctIndex: 1,
    explanation: 'Each subagent should have its own isolated message context. Sharing a single history causes cross-contamination where Subagent B sees Subagent A\'s full conversation.',
    trap: 'Option D is a distractor — formatting issues cause different symptoms. The key pattern the exam tests is context isolation between subagents in the hub-and-spoke model.',
  },
];

export default domain1Quiz;
