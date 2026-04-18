import type { Flashcard } from './types';

export const domain4Cards: Flashcard[] = [
  {
    id: 'd4-01', domainId: 'domain4', lessonId: '4-1', difficulty: 'easy',
    tags: ['explicit-criteria', 'classification'],
    front: 'What are explicit criteria and why do they matter?',
    back: 'Categorical rules with concrete definitions (CRITICAL/WARNING/INFO). "CRITICAL: SQL injection" beats "be conservative." Define what qualifies, what doesn\'t, and what action to take per category. Without explicit criteria, Claude over-flags or under-flags unpredictably.',
  },
  {
    id: 'd4-02', domainId: 'domain4', lessonId: '4-1', difficulty: 'medium',
    tags: ['explicit-criteria', 'anti-patterns'],
    front: 'Why is "When NOT to flag" as important as "what to flag"?',
    back: 'Without explicit exclusions, Claude flags everything that could remotely match. "Do NOT flag inputs from authenticated admin panel" prevents over-flagging. Exclusions make the system usable instead of drowning in alerts.',
  },
  {
    id: 'd4-03', domainId: 'domain4', lessonId: '4-2', difficulty: 'medium',
    tags: ['few-shot', 'examples'],
    front: 'How many few-shot examples should you include?',
    back: '2-4 examples, NOT 20. Focus on ambiguous cases — obvious cases don\'t need examples. Include reasoning (Thought → Reason → Decision) and both positive AND negative examples. Quality over quantity.',
  },
  {
    id: 'd4-04', domainId: 'domain4', lessonId: '4-2', difficulty: 'hard',
    tags: ['few-shot', 'structure'],
    front: 'What structure should each few-shot example follow?',
    back: 'Input → Analysis (Thought) → Reason → Decision → Action. Include reasoning so Claude learns the pattern, not just the output. Order matters — put the most representative example first. Each example should cover a different edge case.',
  },
  {
    id: 'd4-05', domainId: 'domain4', lessonId: '4-3', difficulty: 'hard',
    tags: ['structured-output', 'json-schema'],
    front: 'What is the most reliable way to enforce structured output from Claude?',
    back: 'Use tool_use with a JSON schema as input_schema. This eliminates syntax errors entirely (~100% valid JSON vs ~90% with "respond in JSON"). Force with tool_choice: {"type": "tool", "name": "extract_x"} for guaranteed output.',
  },
  {
    id: 'd4-06', domainId: 'domain4', lessonId: '4-3', difficulty: 'medium',
    tags: ['structured-output', 'tool-choice'],
    front: 'What is the difference between tool_choice "auto", "any", and forced?',
    back: '"auto" — model may return text OR call a tool (flexible). "any" — model MUST call a tool but can choose which (multiple schemas, unknown doc type). Forced {"type":"tool","name":"x"} — model MUST call a specific named tool (guaranteed extraction).',
  },
  {
    id: 'd4-07', domainId: 'domain4', lessonId: '4-3', difficulty: 'hard',
    tags: ['structured-output', 'semantic-errors'],
    front: 'Can JSON schemas prevent all extraction errors?',
    back: 'No. Schemas eliminate SYNTAX errors (invalid JSON, wrong types) but NOT semantic errors. Line items that don\'t sum to total, values in wrong fields — these are semantic. Add cross-check fields like calculated_total vs stated_total and conflict_detected booleans.',
  },
  {
    id: 'd4-08', domainId: 'domain4', lessonId: '4-4', difficulty: 'medium',
    tags: ['retry', 'validation'],
    front: 'When do retries fix extraction failures and when do they NOT?',
    back: 'Retries fix FORMAT errors (wrong JSON structure, missing required fields). Retries DON\'T fix missing information — if the source document doesn\'t contain the data, retrying won\'t create it. For absent info, add more source context or make fields optional.',
  },
  {
    id: 'd4-09', domainId: 'domain4', lessonId: '4-5', difficulty: 'medium',
    tags: ['batch-processing', 'api'],
    front: 'What is the Message Batches API and when should you use it?',
    back: '50% cost savings, up to 24h processing, NO latency SLA. Use for non-blocking workloads: overnight reports, weekly audits, nightly test generation. Do NOT use for blocking workflows like pre-merge checks. Cannot do multi-turn tool calling within a batch.',
  },
  {
    id: 'd4-10', domainId: 'domain4', lessonId: '4-6', difficulty: 'hard',
    tags: ['multi-instance', 'review'],
    front: 'Why is self-review (same session) problematic?',
    back: 'The model retains reasoning context from generation, making it less likely to question its own decisions. Independent instances without prior context are more effective. Use multi-pass: local (per-file) → integration (cross-file) → architecture passes.',
  },
  {
    id: 'd4-11', domainId: 'domain4', lessonId: '4-4', difficulty: 'medium',
    tags: ['validation', 'pydantic'],
    front: 'How does Pydantic help with Claude\'s structured output validation?',
    back: 'Pydantic validates at two levels: (1) Schema validation — catches type errors, missing required fields, enum violations. (2) Semantic validation via custom validators (field_validator, model_validator) — catches business logic errors like negative amounts or inconsistent dates. Feed ValidationError messages back to Claude for retry.',
  },
  {
    id: 'd4-12', domainId: 'domain4', lessonId: '4-3', difficulty: 'hard',
    tags: ['schema', 'nullable'],
    front: 'Why use nullable fields in JSON schemas for Claude extraction?',
    back: 'When a field might not be present in the source, making it optional AND nullable gives Claude an explicit "I don\'t know" option (null) instead of forcing it to fabricate a value. Over-marking fields as required without nullable causes hallucination.',
  },
  {
    id: 'd4-13', domainId: 'domain4', lessonId: '4-3', difficulty: 'medium',
    tags: ['schema', 'other-pattern'],
    front: 'What is the "other" + detail string pattern in JSON schemas?',
    back: 'For classification fields where predefined categories might not cover everything: add "other" to the enum plus a companion detail field. Example: {category: {enum: ["bug","feature","other"]}, category_detail: {type: "string"}}. Prevents Claude from shoehorning ambiguous items into wrong categories.',
  },
];
