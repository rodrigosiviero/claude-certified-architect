import type { DomainMindMap } from './types';

const domain4MindMap: DomainMindMap = {
  domainId: 'd4',
  title: 'Domain 4 — Prompt Engineering & Evaluation',
  color: '#7c3aed',
  root: {
    id: 'd4',
    label: 'Prompt Engineering & Evaluation',
    color: '#7c3aed',
    children: [
      {
        id: 'd4-criteria',
        label: 'Explicit Criteria',
        color: '#a78bfa',
        children: [
          { id: 'd4-cats', label: 'Categorical rules', detail: 'CRITICAL / WARNING / INFO with definitions', color: '#c4b5fd' },
          { id: 'd4-when', label: '"When NOT to flag"', detail: 'Exclusions prevent over-flagging', color: '#c4b5fd' },
          { id: 'd4-specific', label: 'Specificity wins', detail: '"SQL injection" > "be conservative"', color: '#c4b5fd' },
          { id: 'd4-action', label: 'Action-oriented labels', detail: 'Tell Claude exactly what to do per category', color: '#c4b5fd' },
        ],
      },
      {
        id: 'd4-fewshot',
        label: 'Few-Shot Examples',
        color: '#a78bfa',
        children: [
          { id: 'd4-count', label: '2-4 examples', detail: 'Not 20 — focus on ambiguous cases', color: '#c4b5fd' },
          { id: 'd4-reasoning', label: 'Include reasoning', detail: 'Thought → Reason → Decision → Action', color: '#c4b5fd' },
          { id: 'd4-posneg', label: 'Positive AND negative', detail: '"This IS X" + "This is NOT X because..."', color: '#c4b5fd' },
          { id: 'd4-order', label: 'Order matters', detail: 'Most representative example first', color: '#c4b5fd' },
        ],
      },
      {
        id: 'd4-struct',
        label: 'Structured Output',
        color: '#a78bfa',
        children: [
          { id: 'd4-tooluse', label: 'tool_use + JSON Schema', detail: 'Most reliable, eliminates syntax errors', color: '#c4b5fd' },
          { id: 'd4-choice', label: 'tool_choice options', detail: 'auto / any / forced specific tool', color: '#c4b5fd' },
          { id: 'd4-semantic', label: 'Syntax vs Semantic', detail: 'Schema fixes syntax, NOT semantic errors', color: '#c4b5fd' },
          { id: 'd4-optional', label: 'Optional/nullable fields', detail: 'Prevents fabrication when info missing', color: '#c4b5fd' },
          { id: 'd4-enum', label: 'Enum + "other" + detail', detail: 'Extensible categories for edge cases', color: '#c4b5fd' },
        ],
      },
      {
        id: 'd4-retry',
        label: 'Validation & Retry',
        color: '#a78bfa',
        children: [
          { id: 'd4-feedback', label: 'Error-feedback retry', detail: 'Append specific validation errors on retry', color: '#c4b5fd' },
          { id: 'd4-pydantic', label: 'Pydantic validation', detail: 'Schema + semantic validation, field_validator', color: '#c4b5fd' },
          { id: 'd4-noretry', label: "Won't fix absence", detail: 'Info missing from source → add context, not retry', color: '#c4b5fd' },
          { id: 'd4-selfcheck', label: 'Self-correction fields', detail: 'calculated_total vs stated_total, conflict_detected', color: '#c4b5fd' },
          { id: 'd4-pattern', label: 'detected_pattern', detail: 'Track false positive patterns for analysis', color: '#c4b5fd' },
        ],
      },
      {
        id: 'd4-batch',
        label: 'Batch Processing',
        color: '#a78bfa',
        children: [
          { id: 'd4-50off', label: '50% cost savings', detail: 'Message Batches API, up to 24h window', color: '#c4b5fd' },
          { id: 'd4-when', label: 'Batch vs Sync', detail: 'Batch: overnight/weekly. Sync: pre-merge/realtime', color: '#c4b5fd' },
          { id: 'd4-nomulti', label: 'No multi-turn tools', detail: 'Cannot execute tools mid-batch request', color: '#c4b5fd' },
          { id: 'd4-customid', label: 'custom_id', detail: 'Correlate batch request/response pairs', color: '#c4b5fd' },
        ],
      },
      {
        id: 'd4-multi',
        label: 'Multi-Instance Review',
        color: '#a78bfa',
        children: [
          { id: 'd4-selfbias', label: 'Self-review biased', detail: 'Model retains reasoning, won\'t question itself', color: '#c4b5fd' },
          { id: 'd4-independent', label: 'Independent instances', detail: 'No prior context = unbiased review', color: '#c4b5fd' },
          { id: 'd4-multipass', label: 'Multi-pass', detail: 'Local → Integration → Architecture passes', color: '#c4b5fd' },
          { id: 'd4-confidence', label: 'Confidence routing', detail: 'Low → human, medium → senior, high → auto', color: '#c4b5fd' },
        ],
      },
    ],
  },
};

export default domain4MindMap;
