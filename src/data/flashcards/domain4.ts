import type { Flashcard } from './types';

export const domain4Cards: Flashcard[] = [
  {
    id: 'd4-01', domainId: 'domain4', lessonId: '4-1', difficulty: 'easy',
    tags: ['prompt-engineering', 'clarity'],
    front: 'What is the #1 rule of effective prompt engineering?',
    back: 'Be specific and explicit. Vague prompts produce vague results. Instead of "analyze this data", say "identify the top 3 trends in this sales data, focusing on Q4 revenue changes, formatted as a numbered list."',
  },
  {
    id: 'd4-02', domainId: 'domain4', lessonId: '4-1', difficulty: 'medium',
    tags: ['prompt-engineering', 'system-prompt'],
    front: 'What is the purpose of a system prompt?',
    back: 'Sets the persistent context and behavioral rules for Claude across all interactions. It defines the persona, constraints, output format, and domain knowledge. System prompt is processed before every user message.',
  },
  {
    id: 'd4-03', domainId: 'domain4', lessonId: '4-2', difficulty: 'hard',
    tags: ['few-shot', 'examples'],
    front: 'When should you use few-shot prompting vs. tool use?',
    back: 'Few-shot when you need Claude to follow a specific output pattern or style (consistent format, tone). Tool use when you need structured, validated output with schemas. Tools are more reliable for structured data; few-shot is better for creative/formatting tasks.',
  },
  {
    id: 'd4-04', domainId: 'domain4', lessonId: '4-2', difficulty: 'medium',
    tags: ['few-shot', 'quality'],
    front: 'What makes a good few-shot example set?',
    back: '1) Representative of real inputs (diverse, edge cases). 2) Consistent format across examples. 3) 3-5 examples is usually the sweet spot. 4) Include both positive and negative examples if applicable. 5) Order matters — put most relevant examples last (recency bias).',
  },
  {
    id: 'd4-05', domainId: 'domain4', lessonId: '4-3', difficulty: 'hard',
    tags: ['structured-output', 'json-schema'],
    back: 'Use tool_use with a JSON schema — Claude is trained to produce valid JSON when using tools. The schema enforces types, required fields, and value constraints. Asking for "respond in JSON" without a schema produces unreliable output.',
    front: 'What is the most reliable way to get structured output from Claude?',
  },
  {
    id: 'd4-06', domainId: 'domain4', lessonId: '4-3', difficulty: 'medium',
    tags: ['structured-output', 'vs-raw'],
    front: 'Why is "respond in JSON" unreliable compared to tool use with schemas?',
    back: 'Without a schema, Claude may: add extra fields, use inconsistent types, miss required fields, or wrap JSON in markdown code blocks. Tool schemas force Claude through a validation layer that catches all these issues.',
  },
  {
    id: 'd4-07', domainId: 'domain4', lessonId: '4-4', difficulty: 'hard',
    tags: ['chain-of-thought', 'reasoning'],
    front: 'What is chain-of-thought prompting and when should you use it?',
    back: 'Asking Claude to "think step by step" before giving an answer. Use for: complex reasoning, math/logic problems, multi-step analysis, debugging. Don\'t use for: simple lookups, creative writing, or when latency matters (it adds tokens).',
  },
  {
    id: 'd4-08', domainId: 'domain4', lessonId: '4-4', difficulty: 'medium',
    tags: ['explicit-criteria', 'evaluation'],
    front: 'What are explicit criteria and why do they matter?',
    back: 'Clear, measurable rules for evaluating output quality. Instead of "make it good", use "must be under 200 words, use 3+ data points, avoid jargon, and include a conclusion." Vague criteria → inconsistent output. Explicit criteria → reproducible quality.',
  },
  {
    id: 'd4-09', domainId: 'domain4', lessonId: '4-5', difficulty: 'medium',
    tags: ['multi-instance', 'review'],
    front: 'What is the multi-instance review pattern?',
    back: 'Running multiple Claude instances on the same task and having them cross-review each other\'s output. Reduces individual bias and hallucinations. One instance generates, another reviews — like peer review in software.',
  },
  {
    id: 'd4-10', domainId: 'domain4', lessonId: '4-5', difficulty: 'hard',
    tags: ['multi-instance', 'self-review'],
    front: 'Why is self-review (Claude reviewing its own work) problematic?',
    back: 'Claude has a self-consistency bias — it tends to approve its own output because it "made sense" when generated. A fresh instance with different context is more likely to catch errors. Always use a separate instance for review.',
  },
];
