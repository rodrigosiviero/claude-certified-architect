import type { DomainMindMap } from './types';

const domain5MindMap: DomainMindMap = {
  domainId: 'd5',
  title: 'Domain 5 — Monitoring, Safety & Production Readiness',
  color: '#dc2626',
  root: {
    id: 'd5',
    label: 'Monitoring, Safety & Production',
    color: '#dc2626',
    children: [
      {
        id: 'd5-context',
        label: 'Context Management',
        color: '#f87171',
        children: [
          { id: 'd5-lost', label: 'Lost in the middle', detail: 'Critical info at START and END of context', color: '#fca5a5' },
          { id: 'd5-state', label: 'State files > chat', detail: 'Structured JSON/YAML, not conversation memory', color: '#fca5a5' },
          { id: 'd5-scratch', label: 'Scratchpad files', detail: 'Write phase results to files, reference later', color: '#fca5a5' },
          { id: 'd5-sumloss', label: 'Summarization lossy', detail: 'Numbers/details get distorted over rounds', color: '#fca5a5' },
        ],
      },
      {
        id: 'd5-escalation',
        label: 'Escalation Triggers',
        color: '#f87171',
        children: [
          { id: 'd5-explicit', label: 'Explicit = IMMEDIATE', detail: '"Talk to a human" → no "let me try first"', color: '#fca5a5' },
          { id: 'd5-sentiment', label: 'Sentiment ≠ trigger', detail: '"Frustrating" → help better, don\'t escalate', color: '#fca5a5' },
          { id: 'd5-attempt', label: 'Attempt-first', detail: 'Try to help, escalate if persists', color: '#fca5a5' },
          { id: 'd5-ambiguous', label: 'Multiple matches', detail: 'Ask user to clarify which one', color: '#fca5a5' },
        ],
      },
      {
        id: 'd5-pii',
        label: 'PII Protection',
        color: '#f87171',
        children: [
          { id: 'd5-boundary', label: 'Tool boundaries', detail: 'Redact WHERE data crosses systems', color: '#fca5a5' },
          { id: 'd5-least', label: 'Least information', detail: 'Only pass what\'s strictly needed', color: '#fca5a5' },
          { id: 'd5-safelog', label: 'Safe logging', detail: 'Log THAT query happened, not WHAT it contained', color: '#fca5a5' },
          { id: 'd5-noerr', label: 'Errors hide PII', detail: 'Error messages must NEVER expose PII', color: '#fca5a5' },
          { id: 'd5-prevent', label: 'Redact BEFORE', detail: 'Prevention, not cure — before Claude sees it', color: '#fca5a5' },
        ],
      },
      {
        id: 'd5-workflow',
        label: 'Large Workflows',
        color: '#f87171',
        children: [
          { id: 'd5-paginate', label: 'Paginate', detail: 'LIMIT + count + has_more, never dump all', color: '#fca5a5' },
          { id: 'd5-subagent', label: 'Subagent isolation', detail: 'Verbose exploration without polluting main context', color: '#fca5a5' },
          { id: 'd5-checkpoint', label: 'Crash recovery', detail: 'State manifests: checkpoint + resume', color: '#fca5a5' },
          { id: 'd5-stratified', label: 'Stratified monitoring', detail: 'Per-segment quality, not just overall', color: '#fca5a5' },
        ],
      },
      {
        id: 'd5-multiturn',
        label: 'Multi-Turn Operations',
        color: '#f87171',
        children: [
          { id: 'd5-persist', label: 'State persistence', detail: 'Structured files survive across turns', color: '#fca5a5' },
          { id: 'd5-toolerr', label: 'Tool error handling', detail: 'Log → retry alternative → ask user', color: '#fca5a5' },
          { id: 'd5-pressure', label: 'Context pressure', detail: 'Summarize + external files + sub-agents', color: '#fca5a5' },
        ],
      },
      {
        id: 'd5-prov',
        label: 'Provenance & Attribution',
        color: '#f87171',
        children: [
          { id: 'd5-audit', label: 'Auditability', detail: 'Trace any output back to its source', color: '#fca5a5' },
          { id: 'd5-tags', label: 'Source tagging', detail: 'Tag retrieved context with origin', color: '#fca5a5' },
          { id: 'd5-reliability', label: 'Source reliability', detail: 'Prefer official docs over forums', color: '#fca5a5' },
          { id: 'd5-standards', label: 'Documentation', detail: 'Model version + sources + timestamp + prompt', color: '#fca5a5' },
        ],
      },
    ],
  },
};

export default domain5MindMap;
