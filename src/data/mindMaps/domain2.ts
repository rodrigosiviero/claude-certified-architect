import type { DomainMindMap } from './types';

const domain2MindMap: DomainMindMap = {
  domainId: 'd2',
  title: 'Domain 2 — Tools & Context Engineering',
  color: '#0891b2',
  root: {
    id: 'd2',
    label: 'Tools & Context Engineering',
    color: '#0891b2',
    children: [
      {
        id: 'd2-tools',
        label: 'Tool Interfaces',
        color: '#22d3ee',
        children: [
          { id: 'd2-desc', label: 'Descriptions', detail: 'Purpose + format + when NOT to use', color: '#67e8f9' },
          { id: 'd2-schema', label: 'JSON Schema', detail: 'Define input types, required fields, enums', color: '#67e8f9' },
          { id: 'd2-limit', label: 'Max ~7 tools', detail: 'Beyond 7 → accuracy drops, use sub-agents', color: '#67e8f9' },
          { id: 'd2-choice', label: 'tool_choice', detail: 'auto / any / none / specific tool', color: '#67e8f9' },
        ],
      },
      {
        id: 'd2-errors',
        label: 'Error Handling',
        color: '#22d3ee',
        children: [
          { id: 'd2-struct', label: 'Structured errors', detail: '{error: "msg", code: "RATE_LIMIT", retryable: true}', color: '#67e8f9' },
          { id: 'd2-catch', label: 'Catch ALL errors', detail: 'Never let exceptions escape to Claude raw', color: '#67e8f9' },
          { id: 'd2-fallback', label: 'Graceful fallbacks', detail: 'Default values, cached results, partial data', color: '#67e8f9' },
        ],
      },
      {
        id: 'd2-mcp',
        label: 'MCP Server Integration',
        color: '#22d3ee',
        children: [
          { id: 'd3-tools-res', label: 'Tools vs Resources vs Prompts', detail: 'Actions vs Data vs Templates', color: '#67e8f9' },
          { id: 'd2-stdio', label: 'stdio transport', detail: 'Local process, most common for dev', color: '#67e8f9' },
          { id: 'd2-sse', label: 'SSE transport', detail: 'Remote server, shared/team MCP', color: '#67e8f9' },
          { id: 'd2-mcpjson', label: '.mcp.json config', detail: '${ENV_VAR} for secrets, never hardcode', color: '#67e8f9' },
          { id: 'd2-isolated', label: 'Servers isolated', detail: 'No shared state between MCP servers', color: '#67e8f9' },
        ],
      },
      {
        id: 'd2-builtin',
        label: 'Built-in Tools',
        color: '#22d3ee',
        children: [
          { id: 'd2-read', label: 'Read', detail: '🟢 Free tier — always safe, no side effects', color: '#67e8f9' },
          { id: 'd2-write', label: 'Write', detail: '🟡 Caution — new files or full overwrite', color: '#67e8f9' },
          { id: 'd2-edit', label: 'Edit', detail: '🟡 Caution — surgical modifications, Read first', color: '#67e8f9' },
          { id: 'd2-bash', label: 'Bash', detail: '🔴 Confirm — most powerful, most dangerous', color: '#67e8f9' },
          { id: 'd2-grep', label: 'Grep/Glob/LS', detail: '🟢 Free — zero side effects', color: '#67e8f9' },
        ],
      },
      {
        id: 'd2-search',
        label: 'Tool Search',
        color: '#22d3ee',
        children: [
          { id: 'd2-embed', label: 'Embedding-based', detail: 'Semantic selection, NOT keyword matching', color: '#67e8f9' },
          { id: 'd2-precomp', label: 'Pre-compute', detail: 'Compute embeddings offline, not at query time', color: '#67e8f9' },
          { id: 'd2-topk', label: 'Top 4-5', detail: 'Select top tools per request by similarity', color: '#67e8f9' },
          { id: 'd2-rerank', label: 'Re-rank', detail: 'Combine similarity + usage frequency', color: '#67e8f9' },
        ],
      },
    ],
  },
};

export default domain2MindMap;
