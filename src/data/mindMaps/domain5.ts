import type { DomainMindMap } from './types';

const domain5MindMap: DomainMindMap = {
  domainId: 'd5',
  title: 'Domain 5 — Context Management & Reliability',
  color: '#dc2626',
  root: {
    id: 'd5',
    label: 'Context Management & Reliability',
    color: '#dc2626',
    children: [
      {
        id: 'd5-ctx',
        label: 'Context Management',
        color: '#f87171',
        children: [
          { id: 'd5-lost', label: 'Lost in the middle', detail: 'Key findings at START and END', color: '#fca5a5' },
          { id: 'd5-progsum', label: 'Progressive summarization', detail: 'Loses amounts, dates, percentages', color: '#fca5a5' },
          { id: 'd5-casefacts', label: 'Case facts block', detail: 'Persistent transactional facts per prompt', color: '#fca5a5' },
          { id: 'd5-trim', label: 'Trim tool outputs', detail: '40 fields → only 5 relevant fields', color: '#fca5a5' },
          { id: 'd5-metadata', label: 'Subagent metadata', detail: 'Dates, sources, methodology context', color: '#fca5a5' },
        ],
      },
      {
        id: 'd5-esc',
        label: 'Escalation & Ambiguity',
        color: '#f87171',
        children: [
          { id: 'd5-explicit', label: 'Explicit = IMMEDIATE', detail: '"Talk to human" → no "let me try"', color: '#fca5a5' },
          { id: 'd5-sentiment', label: 'Sentiment unreliable', detail: 'Frustration ≠ complexity', color: '#fca5a5' },
          { id: 'd5-policy', label: 'Policy gaps → escalate', detail: 'Competitor matching with no policy', color: '#fca5a5' },
          { id: 'd5-multiple', label: 'Multiple matches', detail: 'Ask for identifiers, never heuristic', color: '#fca5a5' },
        ],
      },
      {
        id: 'd5-err',
        label: 'Error Propagation',
        color: '#f87171',
        children: [
          { id: 'd5-structerr', label: 'Structured error context', detail: 'Type + attempted + partial + alternatives', color: '#fca5a5' },
          { id: 'd5-accessvs', label: 'Access fail ≠ empty result', detail: 'Timeout ≠ 0 matches', color: '#fca5a5' },
          { id: 'd5-nosilent', label: 'No silent suppression', detail: 'Empty as success = anti-pattern', color: '#fca5a5' },
          { id: 'd5-noterm', label: 'No terminate on single fail', detail: 'One failure ≠ kill entire workflow', color: '#fca5a5' },
          { id: 'd5-coverage', label: 'Coverage annotations', detail: 'Well-supported vs gaps', color: '#fca5a5' },
        ],
      },
      {
        id: 'd5-explore',
        label: 'Codebase Exploration',
        color: '#f87171',
        children: [
          { id: 'd5-degrade', label: 'Context degradation', detail: 'Inconsistent answers, "typical patterns"', color: '#fca5a5' },
          { id: 'd5-scratch', label: 'Scratchpad files', detail: 'Persist key findings across boundaries', color: '#fca5a5' },
          { id: 'd5-subiso', label: 'Subagent delegation', detail: 'Verbose output isolated, main coordinates', color: '#fca5a5' },
          { id: 'd5-manifest', label: 'State manifests', detail: 'Crash recovery: export + reload', color: '#fca5a5' },
          { id: 'd5-compact', label: '/compact', detail: 'Reduce context during extended sessions', color: '#fca5a5' },
        ],
      },
      {
        id: 'd5-review',
        label: 'Human Review & Confidence',
        color: '#f87171',
        children: [
          { id: 'd5-aggregate', label: 'Aggregate masks problems', detail: '97% overall ≠ 97% per segment', color: '#fca5a5' },
          { id: 'd5-stratified', label: 'Stratified sampling', detail: 'Measure error rates per doc type/field', color: '#fca5a5' },
          { id: 'd5-fieldconf', label: 'Field-level confidence', detail: 'Calibrated with labeled validation sets', color: '#fca5a5' },
          { id: 'd5-route', label: 'Route by confidence', detail: 'Low → human, ambiguous → review', color: '#fca5a5' },
        ],
      },
      {
        id: 'd5-prov',
        label: 'Provenance & Uncertainty',
        color: '#f87171',
        children: [
          { id: 'd5-claimsrc', label: 'Claim-source mappings', detail: 'Source URLs, excerpts, dates', color: '#fca5a5' },
          { id: 'd5-conflict', label: 'Conflicting sources', detail: 'Annotate, don\'t average', color: '#fca5a5' },
          { id: 'd5-temporal', label: 'Temporal data', detail: 'Require publication dates in outputs', color: '#fca5a5' },
          { id: 'd5-render', label: 'Content type rendering', detail: 'Financial→tables, news→prose, tech→lists', color: '#fca5a5' },
          { id: 'd5-contested', label: 'Contested vs established', detail: 'Separate sections in synthesis', color: '#fca5a5' },
        ],
      },
    ],
  },
};

export default domain5MindMap;
