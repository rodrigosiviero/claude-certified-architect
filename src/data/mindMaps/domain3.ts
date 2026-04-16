import type { DomainMindMap } from './types';

const domain3MindMap: DomainMindMap = {
  domainId: 'd3',
  title: 'Domain 3 — Tool Design & Integration',
  color: '#059669',
  root: {
    id: 'd3',
    label: 'Tool Design',
    color: '#059669',
    children: [
      {
        id: 'd3-principles',
        label: 'Design Principles',
        color: '#10b981',
        children: [
          { id: 'd3-single', label: 'Single Purpose', detail: 'One tool = one action, clear name', color: '#34d399' },
          { id: 'd3-idempot', label: 'Idempotent', detail: 'Same input = same result, safe to retry', color: '#34d399' },
          { id: 'd3-granular', label: 'Granularity', detail: 'Fine-grained > monolithic "do everything" tools', color: '#34d399' },
          { id: 'd3-desc', label: 'Descriptions', detail: 'Clear names + descriptions = better tool selection by Claude', color: '#34d399' },
        ],
      },
      {
        id: 'd3-choice',
        label: 'tool_choice',
        color: '#10b981',
        children: [
          { id: 'd3-auto', label: 'auto (default)', detail: 'Claude decides when to use tools', color: '#34d399' },
          { id: 'd3-any', label: 'any / required', detail: 'Force tool use on this turn', color: '#34d399' },
          { id: 'd3-none', label: 'none', detail: 'Disable all tools for this turn', color: '#34d399' },
          {
            id: 'd3-forced',
            label: 'Forced specific tool',
            detail: 'Force one specific tool by name',
            color: '#34d399',
            children: [
              { id: 'd3-fexample', label: 'Example', detail: '{type: "tool", name: "search_docs"}', color: '#6ee7b7' },
            ],
          },
        ],
      },
      {
        id: 'd3-impl',
        label: 'Implementation',
        color: '#10b981',
        children: [
          { id: 'd3-ischema', label: 'Input Schema', detail: 'JSON Schema: types, required, enums', color: '#34d399' },
          { id: 'd3-error', label: 'Error Handling', detail: 'Return structured errors, never crash', color: '#34d399' },
          { id: 'd3-validate', label: 'Validation', detail: 'Validate inputs server-side before execution', color: '#34d399' },
          { id: 'd3-parallel', label: 'Parallel Tools', detail: 'Multiple tool_use in one response', color: '#34d399' },
        ],
      },
      {
        id: 'd3-advanced',
        label: 'Advanced',
        color: '#10b981',
        children: [
          { id: 'd3-computer', label: 'Computer Use', detail: 'Screen capture + mouse/keyboard actions', color: '#34d399' },
          { id: 'd3-caching', label: 'Prompt Caching', detail: 'Cache tool definitions for speed + cost', color: '#34d399' },
          { id: 'd3-multi', label: 'Multi-tool', detail: 'Batch independent calls for efficiency', color: '#34d399' },
        ],
      },
    ],
  },
};

export default domain3MindMap;
