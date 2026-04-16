import type { Flashcard } from './types';

export const domain2Cards: Flashcard[] = [
  {
    id: 'd2-01', domainId: 'domain2', lessonId: '2-1', difficulty: 'easy',
    tags: ['tool-design', 'best-practices'],
    front: 'What makes a good tool description for Claude?',
    back: 'Clear, specific, and unambiguous. Include: what the tool does, expected inputs, output format, and edge cases. Bad: "Processes data". Good: "Calculates the mean of a numeric array. Returns a single float. Returns 0 for empty arrays."',
  },
  {
    id: 'd2-02', domainId: 'domain2', lessonId: '2-1', difficulty: 'medium',
    tags: ['tool-design', 'schema'],
    front: 'Why should tool input schemas be strict and narrow?',
    back: 'Narrow schemas reduce ambiguity and prevent Claude from passing invalid inputs. Use enums for categorical values, set min/max for numbers, require specific formats. The tighter the schema, the fewer errors.',
  },
  {
    id: 'd2-03', domainId: 'domain2', lessonId: '2-2', difficulty: 'hard',
    tags: ['mcp', 'protocol'],
    front: 'What is MCP (Model Context Protocol)?',
    back: 'An open protocol that standardizes how AI models connect to external tools and data sources. It provides a universal interface for tool discovery, invocation, and data exchange — similar to USB-C but for AI integrations.',
  },
  {
    id: 'd2-04', domainId: 'domain2', lessonId: '2-2', difficulty: 'medium',
    tags: ['mcp', 'server'],
    front: 'What are the three core primitives of MCP?',
    back: '1) Resources — read-only data sources (files, DB records). 2) Tools — executable functions that can modify state. 3) Prompts — reusable prompt templates that can be parameterized.',
  },
  {
    id: 'd2-05', domainId: 'domain2', lessonId: '2-3', difficulty: 'medium',
    tags: ['tool-choice', 'forced-tool'],
    front: 'What does tool_choice: { type: "tool", name: "specific_tool" } do?',
    back: 'Forces Claude to call a specific tool — it MUST use that tool. Use when you need guaranteed tool execution (e.g., PII redaction must always run). Claude cannot skip it or choose differently.',
  },
  {
    id: 'd2-06', domainId: 'domain2', lessonId: '2-4', difficulty: 'hard',
    tags: ['tool-errors', 'graceful-degradation'],
    front: 'How should tool errors be communicated back to Claude?',
    back: 'Return structured error objects (not just exceptions) with: error type, message, and whether retry is possible. Claude can then decide to retry with different params, use a fallback tool, or inform the user. Never silently swallow errors.',
  },
  {
    id: 'd2-07', domainId: 'domain2', lessonId: '2-4', difficulty: 'medium',
    tags: ['tool-errors', 'empty-results'],
    front: 'Why is returning an empty array on tool error dangerous?',
    back: 'Claude interprets an empty array as "no results found" — a valid business outcome. It cannot distinguish "query returned nothing" from "database timed out." Always include error metadata when something goes wrong.',
  },
  {
    id: 'd2-08', domainId: 'domain2', lessonId: '2-5', difficulty: 'medium',
    tags: ['computer-use', 'vision-loop'],
    front: 'What is the computer use agent loop?',
    back: 'Screenshot → Claude analyzes image → Decide action (click/type/scroll) → Execute action → Take new screenshot → Loop. Claude uses vision to "see" the screen and decide what to do next.',
  },
  {
    id: 'd2-09', domainId: 'domain2', lessonId: '2-6', difficulty: 'hard',
    tags: ['tool-distribution', 'too-many-tools'],
    front: 'What happens when you give Claude 30+ tools?',
    back: 'Tool selection accuracy drops significantly (~40% wrong calls with 30+ tools). Solutions: group related tools behind a "router" tool, use tool_choice to narrow options, or split into multiple specialist sub-agents.',
  },
  {
    id: 'd2-10', domainId: 'domain2', lessonId: '2-6', difficulty: 'easy',
    tags: ['tool-naming'],
    front: 'What is the most important rule for naming tools?',
    back: 'Be descriptive and use verb-noun format. Bad: "process", "handle", "do". Good: "calculate_mean", "search_database", "send_email". Claude relies heavily on tool names to select the right one.',
  },
];
