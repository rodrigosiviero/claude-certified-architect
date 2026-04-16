import type { DomainMindMap } from './types';

const domain2MindMap: DomainMindMap = {
  domainId: 'd2',
  title: 'Domain 2 — Context Engineering',
  color: '#0891b2',
  root: {
    id: 'd2',
    label: 'Context Engineering',
    color: '#0891b2',
    children: [
      {
        id: 'd2-system',
        label: 'System Prompts',
        color: '#06b6d4',
        children: [
          { id: 'd2-role', label: 'Role Definition', detail: 'Who Claude is, expertise level, tone', color: '#22d3ee' },
          {
            id: 'd2-instruct',
            label: 'Instructions',
            color: '#22d3ee',
            children: [
              { id: 'd2-explicit', label: 'Be Explicit', detail: '"Return JSON with keys {x,y}" > "give me data"', color: '#67e8f9' },
              { id: 'd2-step', label: 'Step-by-step', detail: 'Numbered steps > vague paragraphs', color: '#67e8f9' },
              { id: 'd2-negative', label: 'Negative examples', detail: '"Do NOT do X" prevents hallucination', color: '#67e8f9' },
            ],
          },
          { id: 'd2-const', label: 'Constraints', detail: 'Hard rules Claude must follow', color: '#22d3ee' },
          { id: 'd2-schema', label: 'Output Schema', detail: 'JSON schema forces structured response', color: '#22d3ee' },
        ],
      },
      {
        id: 'd2-memory',
        label: 'Memory Systems',
        color: '#06b6d4',
        children: [
          { id: 'd2-short', label: 'Short-term', detail: 'Within conversation context window', color: '#22d3ee' },
          { id: 'd2-long', label: 'Long-term', detail: 'External storage, vector DB, retrieval', color: '#22d3ee' },
          { id: 'd2-episodic', label: 'Episodic', detail: 'Session summaries injected into context', color: '#22d3ee' },
        ],
      },
      {
        id: 'd2-window',
        label: 'Context Window',
        color: '#06b6d4',
        children: [
          {
            id: 'd2-strategies',
            label: 'Truncation Strategies',
            color: '#22d3ee',
            children: [
              { id: 'd2-fifo', label: 'FIFO', detail: 'Drop oldest messages first', color: '#67e8f9' },
              { id: 'd2-sliding', label: 'Sliding Window', detail: 'Keep last N messages', color: '#67e8f9' },
              { id: 'd2-summarize', label: 'Summarize', detail: 'Compress old context into summary', color: '#67e8f9' },
            ],
          },
          { id: 'd2-rag', label: 'RAG', detail: 'Retrieve relevant chunks → inject into context', color: '#22d3ee' },
          { id: 'd2-cache', label: 'Prompt Caching', detail: 'Cache system prompt for speed + cost', color: '#22d3ee' },
        ],
      },
      {
        id: 'd2-tools',
        label: 'Tool Context',
        color: '#06b6d4',
        children: [
          { id: 'd2-desc', label: 'Tool Descriptions', detail: 'Claude reads them to decide when/how to use', color: '#22d3ee' },
          { id: 'd2-ischema', label: 'Input Schema', detail: 'JSON schema defines parameters clearly', color: '#22d3ee' },
          { id: 'd2-results', label: 'Tool Results', detail: 'Always append, format clearly, include errors', color: '#22d3ee' },
        ],
      },
    ],
  },
};

export default domain2MindMap;
