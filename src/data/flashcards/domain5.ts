import type { Flashcard } from './types';

export const domain5Cards: Flashcard[] = [
  {
    id: 'd5-01', domainId: 'domain5', lessonId: '5-1', difficulty: 'hard',
    tags: ['context-window', 'limits'],
    front: 'What is "Lost in the Middle" in the context of LLM context windows?',
    back: 'Claude remembers the beginning and end of a conversation well but struggles with details in the middle of very long contexts. Solutions: put critical instructions at start/end, use context: fork to reset, summarize middle sections.',
  },
  {
    id: 'd5-02', domainId: 'domain5', lessonId: '5-1', difficulty: 'medium',
    tags: ['context-window', 'management'],
    front: 'What are the key strategies for managing context window limits?',
    back: '1) Summarize old turns instead of keeping full history. 2) Use context: fork to branch conversations. 3) Prioritize recent and relevant context. 4) Store important facts externally (databases, files). 5) Use structured output to compress information.',
  },
  {
    id: 'd5-03', domainId: 'domain5', lessonId: '5-2', difficulty: 'hard',
    tags: ['context-fork', 'branching'],
    front: 'What does context: fork do and when should you use it?',
    back: 'Creates a new conversation branch from the current state, discarding the fork\'s history from the main thread. Use for: exploring risky approaches without polluting main context, parallel investigations, or "what-if" analysis.',
  },
  {
    id: 'd5-04', domainId: 'domain5', lessonId: '5-2', difficulty: 'medium',
    tags: ['context-fork', 'vs-summarize'],
    front: 'When should you use context: fork vs. summarization?',
    back: 'Fork when you need a clean slate for exploration (the original context is untouched). Summarize when you want to compress history while keeping the same thread. Fork is better for divergent tasks; summarization for convergent ones.',
  },
  {
    id: 'd5-05', domainId: 'domain5', lessonId: '5-3', difficulty: 'medium',
    tags: ['retry', 'error-handling'],
    front: 'When should you retry a failed Claude call and when should you not?',
    back: 'Retry on: rate limits (429), transient network errors, timeout. Don\'t retry on: invalid inputs (400), tool errors (fix the tool), "I can\'t do that" responses (reformulate the prompt). Retrying the same bad input never helps.',
  },
  {
    id: 'd5-06', domainId: 'domain5', lessonId: '5-3', difficulty: 'hard',
    tags: ['retry', 'escalation'],
    front: 'What is the escalation pattern for handling repeated failures?',
    back: 'After N retries: 1) Log the failure context. 2) Try a simpler/different approach. 3) If still failing, escalate to a human with full context. Never loop infinitely — every retry path needs a termination condition and an escalation route.',
  },
  {
    id: 'd5-07', domainId: 'domain5', lessonId: '5-4', difficulty: 'easy',
    tags: ['pii', 'privacy'],
    front: 'Why must PII be handled before Claude processes data?',
    back: 'Claude conversations may be logged. PII (names, emails, SSNs, credit cards) should be redacted or anonymized BEFORE sending to the API. Use tools/hooks to strip PII at the boundary between user input and Claude.',
  },
  {
    id: 'd5-08', domainId: 'domain5', lessonId: '5-4', difficulty: 'medium',
    tags: ['pii', 'tool-boundary'],
    front: 'What is "tool boundary protection" for PII?',
    back: 'Intercept data at tool invocation boundaries using SDK hooks. PreToolUse hook can scan and redact PII before tools see it. PostToolUse hook can scrub PII from tool results before they reach the conversation history.',
  },
  {
    id: 'd5-09', domainId: 'domain5', lessonId: '5-5', difficulty: 'hard',
    tags: ['provenance', 'hallucination'],
    front: 'What is the provenance problem with LLM outputs?',
    back: 'Claude may blend information from multiple sources without indicating which fact came from where. When asked about conflicting statistics, it may "average" them or pick arbitrarily. Always cite sources and validate claims against original data.',
  },
  {
    id: 'd5-10', domainId: 'domain5', lessonId: '5-6', difficulty: 'medium',
    tags: ['production', 'monitoring'],
    front: 'What should you monitor in a production Claude integration?',
    back: '1) Latency (response time per turn). 2) Token usage (cost tracking). 3) Error rates (by type). 4) Tool call accuracy (wrong tool selections). 5) Output quality (sample review). 6) Context window utilization (% of max tokens used).',
  },
];
