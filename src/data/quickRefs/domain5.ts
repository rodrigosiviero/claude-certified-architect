import type { QuickRefData } from '../types';

const domain5QuickRef: QuickRefData = {
      domainLabel: 'Domain 5 — Context Management & Reliability',
      examWeight: '15% Exam Weight',
      topTested: ['Case Facts Block', 'Escalation vs Sentiment', 'Error Propagation', 'Provenance'],
      sections: [
        { title: '5.1 Context Management', points: [
          '"Lost in the middle" — put key findings at START and END',
          'Progressive summarization loses: amounts, percentages, dates, expectations',
          'Tool results accumulate tokens — trim to relevant fields only',
          'Persistent "case facts" block per prompt, outside summarized history',
          'Extract transactional facts (amounts, dates, order #, statuses) into case facts',
          'Subagents must include metadata (dates, source, methodology) in outputs',
          'Upstream agents return structured data, not verbose reasoning chains',
          'Organize detailed results with explicit section headers to mitigate position effects',
        ] },
        { title: '5.2 Escalation & Ambiguity', points: [
          'Explicit human request = IMMEDIATE escalation, no "let me try first"',
          'Sentiment-based escalation is unreliable — frustration ≠ escalation',
          'Self-reported confidence scores are unreliable proxies for complexity',
          'Policy gaps/ambiguous = escalate (competitor price match with no policy)',
          'Multiple customer matches → ask for identifiers, never heuristic selection',
          'Acknowledge frustration + offer resolution, escalate only if reiterated',
          'Add explicit escalation criteria with few-shot examples to system prompt',
          'Straightforward issues: offer to resolve even if customer is frustrated',
        ] },
        { title: '5.3 Error Propagation', points: [
          'Structured error context: failure type, attempted query, partial results, alternatives',
          'Access failures (timeout) ≠ valid empty results (0 matches)',
          'Generic errors ("search unavailable") hide valuable context from coordinator',
          'Silently suppressing errors = anti-pattern (empty results as success)',
          'Terminating entire workflow on single failure = anti-pattern',
          'Subagents: local recovery for transient, propagate only unresolvable errors',
          'Coverage annotations: well-supported findings vs gaps from unavailable sources',
          'Include what was attempted + partial results in propagated errors',
        ] },
        { title: '5.4 Large Codebase Exploration', points: [
          'Context degradation: inconsistent answers, "typical patterns" vs specific classes',
          'Scratchpad files persist key findings across context boundaries',
          'Subagent delegation: verbose output isolated, main agent coordinates',
          'State manifests for crash recovery: export state, coordinator loads on resume',
          'Summarize findings before spawning next phase subagents',
          '/compact reduces context usage during extended sessions',
          'Spawn subagents for specific questions ("find test files", "trace dependencies")',
          'Each exploration phase: summarize → inject into next phase context',
        ] },
        { title: '5.5 Human Review & Confidence', points: [
          'Aggregate accuracy (97%) masks poor performance on specific segments',
          'Stratified random sampling for error rates in high-confidence extractions',
          'Field-level confidence scores calibrated with labeled validation sets',
          'Validate by document type AND field segment before automating',
          'Low confidence or contradictory sources → human review',
          'Prioritize limited reviewer capacity — not everything reviewed equally',
          'Calibration: run on labeled set → compare confidence to actual accuracy',
          'Detect novel error patterns through ongoing stratified sampling',
        ] },
        { title: '5.6 Provenance & Uncertainty', points: [
          'Source attribution lost during summarization without claim-source mappings',
          'Structured claim-source mappings: source URLs, doc names, excerpts, dates',
          'Conflicting sources: annotate with attribution, don\'t arbitrarily pick one',
          'Temporal data: require publication/collection dates in structured outputs',
          'Distinguish well-established findings from contested ones in reports',
          'Render by content type: financial→tables, news→prose, technical→lists',
          'Subagents must preserve claim-source mappings through synthesis',
          'Let coordinator reconcile conflicts, don\'t resolve at subagent level',
        ] },
      ],
      antiPatterns: [
        { pattern: 'Escalating on sentiment alone', reason: '"This is frustrating" ≠ "I want a human." Offer resolution, escalate only if reiterated.' },
        { pattern: 'Silently suppressing errors', reason: 'Returning empty results as success hides failures. Always propagate structured error context.' },
        { pattern: 'Trusting aggregate accuracy', reason: '97% overall may hide 60% on a specific doc type. Validate by segment.' },
        { pattern: 'Averaging conflicting sources', reason: 'Annotate conflicts with source attribution. Let coordinator decide reconciliation.' },
      ],
      examTips: [
        'Domain 5 = 15% of exam.',
        'Case facts blocks > summarized history. Structured errors > generic. Annotate > average.',
        'Access failure ≠ empty result. Sentiment ≠ escalation. Aggregate ≠ per-segment.',
      ],

};

export default domain5QuickRef;
