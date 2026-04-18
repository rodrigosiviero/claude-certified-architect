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
        id: 'd4-thinking',
        label: 'Extended Thinking',
        color: '#a78bfa',
        children: [
          { id: 'd4-budget', label: 'budget_tokens', detail: 'Controls thinking depth before answering', color: '#c4b5fd' },
          { id: 'd4-usefor', label: 'Use for', detail: 'Multi-step reasoning, math, complex analysis', color: '#c4b5fd' },
          { id: 'd4-nouse', label: "Don't use for", detail: 'Simple extraction, formatting, classification', color: '#c4b5fd' },
          { id: 'd4-tradeoff', label: 'Tradeoff', detail: 'Accuracy ↑ vs Cost/Latency ↑', color: '#c4b5fd' },
        ],
      },
      {
        id: 'd4-struct',
        label: 'Structured Output',
        color: '#a78bfa',
        children: [
          { id: 'd4-schema', label: 'JSON Schema', detail: 'Required fields, types, enums, descriptions', color: '#c4b5fd' },
          { id: 'd4-force', label: 'tool_choice force', detail: 'Claude cannot deviate from schema', color: '#c4b5fd' },
          { id: 'd4-retry', label: 'Retry FORMAT only', detail: 'Retries fix format, NOT missing info', color: '#c4b5fd' },
          { id: 'd4-vs', label: 'Schema > prompting', detail: '100% vs ~90% reliability', color: '#c4b5fd' },
        ],
      },
      {
        id: 'd4-meta',
        label: 'Metaprompt',
        color: '#a78bfa',
        children: [
          { id: 'd4-gen', label: 'Prompt generator', detail: 'A prompt that writes optimized prompts', color: '#c4b5fd' },
          { id: 'd4-prod', label: 'Produces', detail: 'Role + rules + format + edge cases', color: '#c4b5fd' },
        ],
      },
      {
        id: 'd4-multi',
        label: 'Multi-Instance Review',
        color: '#a78bfa',
        children: [
          { id: 'd4-sep', label: 'Separate instances', detail: 'Independent evaluation, no shared context', color: '#c4b5fd' },
          { id: 'd4-bias', label: 'Prevents self-bias', detail: 'Same session reviewing own work = biased', color: '#c4b5fd' },
          { id: 'd4-consensus', label: 'Consensus pattern', detail: 'Gen → Review → Tie-breaker if needed', color: '#c4b5fd' },
        ],
      },
    ],
  },
};

export default domain4MindMap;
