import type { Flashcard } from './types';

export const domain5Cards: Flashcard[] = [
  {
    id: 'd5-01', domainId: 'domain5', lessonId: '5-1', difficulty: 'hard',
    tags: ['context', 'lost-in-middle'],
    front: 'What is "Lost in the Middle" and how do you mitigate it?',
    back: 'Models process info at beginning and end of long inputs well but may omit findings from middle sections. Mitigate by placing key findings summaries at START of aggregated inputs and organizing detailed results with explicit section headers.',
  },
  {
    id: 'd5-02', domainId: 'domain5', lessonId: '5-1', difficulty: 'medium',
    tags: ['context', 'case-facts'],
    front: 'What is a "case facts" block and why use it?',
    back: 'A persistent block of transactional facts (amounts, dates, order #, statuses) included in each prompt OUTSIDE summarized history. It preserves exact values that would be lost or distorted by progressive summarization.',
  },
  {
    id: 'd5-03', domainId: 'domain5', lessonId: '5-1', difficulty: 'medium',
    tags: ['context', 'tool-results'],
    front: 'Why do tool results consume tokens disproportionately?',
    back: 'An order lookup might return 40+ fields when only 5 are relevant to the current task. Trim verbose tool outputs to only relevant fields BEFORE they accumulate in context. This is proactive — not lossy like summarization.',
  },
  {
    id: 'd5-04', domainId: 'domain5', lessonId: '5-2', difficulty: 'easy',
    tags: ['escalation', 'triggers'],
    front: 'When should you IMMEDIATELY escalate to a human?',
    back: 'Explicit customer requests: "talk to a human", "I want a real person", "connect me to an agent". Also: policy gaps where the customer\'s request isn\'t covered. Honor immediately — no "let me try first."',
  },
  {
    id: 'd5-05', domainId: 'domain5', lessonId: '5-2', difficulty: 'medium',
    tags: ['escalation', 'ambiguity'],
    front: 'What do you do when tool results return multiple customer matches?',
    back: 'Ask for additional identifiers (order #, zip code, DOB). NEVER select based on heuristics or pick the first match. Multiple matches = ambiguity = clarification needed.',
  },
  {
    id: 'd5-06', domainId: 'domain5', lessonId: '5-3', difficulty: 'hard',
    tags: ['error-propagation', 'structured'],
    front: 'What should a structured error from a subagent include?',
    back: 'Failure type (timeout, 404, etc.), the attempted query/operation, any partial results obtained, and potential alternative approaches. This enables the coordinator to make intelligent recovery decisions.',
  },
  {
    id: 'd5-07', domainId: 'domain5', lessonId: '5-3', difficulty: 'medium',
    tags: ['error-propagation', 'anti-patterns'],
    front: 'What are the two error propagation anti-patterns?',
    back: '1) Silently suppressing errors — returning empty results as success hides failures. 2) Terminating entire workflow on single failure — one subagent failing shouldn\'t kill the whole pipeline. Both prevent intelligent recovery.',
  },
  {
    id: 'd5-08', domainId: 'domain5', lessonId: '5-4', difficulty: 'medium',
    tags: ['exploration', 'scratchpad'],
    front: 'How do scratchpad files help in large codebase exploration?',
    back: 'They persist key findings across context boundaries. As context degrades (inconsistent answers, "typical patterns" instead of specific classes), agents reference scratchpad files to maintain accurate information without re-reading all files.',
  },
  {
    id: 'd5-09', domainId: 'domain5', lessonId: '5-5', difficulty: 'hard',
    tags: ['review', 'confidence'],
    front: 'Why are aggregate accuracy metrics dangerous?',
    back: '97% overall may hide 60% on specific document types. Validate accuracy by document type AND field segment before automating. Use stratified random sampling to measure error rates per segment and detect novel error patterns.',
  },
  {
    id: 'd5-10', domainId: 'domain5', lessonId: '5-6', difficulty: 'hard',
    tags: ['provenance', 'conflicts'],
    front: 'How should you handle conflicting statistics from credible sources?',
    back: 'Annotate conflicts with source attribution. Include both values with their sources. Let the coordinator decide how to reconcile. Require publication/collection dates to check if the difference is temporal. NEVER average conflicting values silently.',
  },
];
