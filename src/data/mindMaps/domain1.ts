import type { MindMapNode } from './types';

import type { DomainMindMap } from './types';

const domain1MindMap: DomainMindMap = {
  domainId: 'd1',
  title: 'Domain 1 — Agentic Architecture & Orchestration',
  color: '#7c3aed',
  root: {
    id: 'd1',
    label: 'Agentic Architecture',
    color: '#7c3aed',
    children: [
      {
        id: 'd1-loop',
        label: 'Agentic Loop',
        color: '#8b5cf6',
        children: [
          { id: 'd1-cycle', label: 'The Cycle', detail: 'User msg → Claude → stop_reason → tools → append → repeat', color: '#a78bfa' },
          {
            id: 'd1-stop',
            label: 'stop_reason',
            detail: 'The ONLY reliable termination signal',
            color: '#a78bfa',
            children: [
              { id: 'd1-endturn', label: 'end_turn', detail: 'Claude is done → break loop', color: '#c4b5fd' },
              { id: 'd1-tooluse', label: 'tool_use', detail: 'Claude wants a tool → execute & loop', color: '#c4b5fd' },
              { id: 'd1-maxtok', label: 'max_tokens', detail: 'Cut off → increase budget or simplify', color: '#c4b5fd' },
            ],
          },
          {
            id: 'd1-ctx',
            label: 'Context Management',
            color: '#a78bfa',
            children: [
              { id: 'd1-append', label: 'Append ALL results', detail: 'Never selectively omit tool results', color: '#c4b5fd' },
              { id: 'd1-prune', label: 'Prune stale context', detail: 'Summarize after N turns, FIFO', color: '#c4b5fd' },
              { id: 'd1-budget', label: 'Token budgeting', detail: 'Reserve for system + output', color: '#c4b5fd' },
            ],
          },
        ],
      },
      {
        id: 'd1-arch',
        label: 'Architectures',
        color: '#8b5cf6',
        children: [
          { id: 'd1-hub', label: 'Hub-and-Spoke', detail: 'Orchestrator delegates to specialists, aggregates results', color: '#a78bfa' },
          { id: 'd1-pipe', label: 'Pipeline', detail: 'Sequential: A → B → C, output feeds next', color: '#a78bfa' },
          { id: 'd1-router', label: 'Router / Classifier', detail: 'Dispatches to handler based on intent', color: '#a78bfa' },
          { id: 'd1-swarm', label: 'Swarm (OpenAI)', detail: 'Agents handoff to each other via protocol', color: '#a78bfa' },
          { id: 'd1-graph', label: 'Graph / DAG', detail: 'Conditional branching, parallel paths', color: '#a78bfa' },
        ],
      },
      {
        id: 'd1-hooks',
        label: 'Hooks & Guardrails',
        color: '#8b5cf6',
        children: [
          { id: 'd1-pre', label: 'Pre-tool hooks', detail: 'Validate/modify before execution', color: '#a78bfa' },
          { id: 'd1-post', label: 'Post-tool hooks', detail: 'Audit/log after execution', color: '#a78bfa' },
          { id: 'd1-gate', label: 'Validation gates', detail: 'Enforce workflow steps in order', color: '#a78bfa' },
          { id: 'd1-human', label: 'Human-in-the-loop', detail: 'Critical actions need approval', color: '#a78bfa' },
        ],
      },
      {
        id: 'd1-workflow',
        label: 'Workflow Patterns',
        color: '#8b5cf6',
        children: [
          { id: 'd1-decomp', label: 'Task Decomposition', detail: 'Break complex into ordered subtasks with deps', color: '#a78bfa' },
          { id: 'd1-session', label: 'Session State', detail: 'Prune, summarize, persist externally', color: '#a78bfa' },
          { id: 'd1-fork', label: 'fork_session', detail: 'Branch conversation, independent exploration', color: '#a78bfa' },
          { id: 'd1-explore', label: 'Explore subagent', detail: 'Dedicated codebase navigator, own context', color: '#a78bfa' },
          { id: 'd1-retry', label: 'Retry & Recovery', detail: 'Only transient errors, exponential backoff', color: '#a78bfa' },
          { id: 'd1-plan', label: 'Plan-then-Execute', detail: 'Plan mode for large migrations', color: '#a78bfa' },
        ],
      },
    ],
  },
};

export default domain1MindMap;
