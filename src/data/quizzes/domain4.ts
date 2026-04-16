import type { QuizQuestion } from '../types';

const domain4Quiz: QuizQuestion[] = [
  {
    question: 'A code review system prompt says "Flag all problems." It flags naming, tests, style, everything. What is wrong?',
    options: [
      'The system prompt is too long',
      'The prompt lacks specific criteria — it should define exact review categories (security, performance, bugs) with clear rules',
      'Claude doesn\'t support code review system prompts',
      'The prompt needs to mention specific file types',
    ],
    correctIndex: 1,
    explanation: 'System prompts need explicit criteria and rules. "Flag all problems" gives no guidance on severity, categories, or what constitutes a "problem." Specific criteria produce focused, useful reviews.',
    trap: 'Option A misidentifies the problem — it\'s not length but specificity. Option D is a minor improvement but doesn\'t address the core issue of vague criteria. The exam tests system prompt engineering with explicit criteria.',
  },
  {
    question: 'Few-shot examples map "my stuff" to search_orders and "tracking" to search_orders. Users get wrong results. Why?',
    options: [
      'Few-shot examples don\'t work with tool-calling',
      'The examples are ambiguous — "my stuff" could mean orders or products, "tracking" could mean packages or analytics',
      'Too many examples cause confusion',
      'The examples need to use JSON format',
    ],
    correctIndex: 1,
    explanation: 'Few-shot examples must be unambiguous. Each example should clearly map to one intent. "my stuff" and "tracking" are vague and create conflicting signals for Claude to resolve.',
    trap: 'Option A is false — few-shot examples are recommended for tool routing. Option C isn\'t the issue — there are too few clear examples, not too many. The exam tests few-shot example design principles.',
  },
  {
    question: 'You ask Claude to "Respond in JSON" but get inconsistent field names and missing fields. What should you add?',
    options: [
      'A longer system prompt',
      'An explicit JSON schema with field names, types, required fields, and an example response',
      'The --json flag in the API call',
      'Post-processing validation on the response',
    ],
    correctIndex: 1,
    explanation: 'Providing an explicit schema (with field names, types, required/optional markers, and an example) gives Claude a clear contract. Without it, Claude improvises the structure, leading to inconsistency.',
    trap: 'Option D is reactive — validate after the fact. The exam tests proactive structured output design with schemas. Option C doesn\'t exist in the Messages API.',
  },
  {
    question: 'Claude Sonnet writes code and Claude Sonnet reviews it. The reviewer misses obvious bugs. Why?',
    options: [
      'Sonnet isn\'t capable of code review',
      'Same model reviewing its own code has blind spots — use a different (ideally stronger) model for review',
      'The code is too complex for any model',
      'You need to add more examples to the review prompt',
    ],
    correctIndex: 1,
    explanation: 'Using the same model to review its own output creates blind spots — it tends to confirm its own assumptions. A different model (especially a stronger one like Opus for reviewing Sonnet output) catches more issues.',
    trap: 'Option A is false — Sonnet is capable. Option D might help slightly but doesn\'t address the core issue. The exam tests multi-instance review patterns with model diversity.',
  },
  {
    question: 'An agent retries a failing API call 5 times with the same parameters. The error is "404 Not Found." What should it do?',
    options: [
      'Retry with exponential backoff',
      'Analyze the error type — 404 means the resource doesn\'t exist, retrying won\'t help. Adapt strategy instead.',
      'Increase the timeout between retries',
      'Try a different model for the retry',
    ],
    correctIndex: 1,
    explanation: 'Error analysis should drive retry strategy. 404 (resource not found) means the resource doesn\'t exist — no amount of retries will fix this. The agent should adapt its approach (e.g., search for the correct endpoint).',
    trap: 'Option A (backoff) is a standard pattern but doesn\'t address the root cause here — a 404 won\'t become a 200 by waiting. The exam tests adaptive error handling vs blind retry.',
  },
];

export default domain4Quiz;
