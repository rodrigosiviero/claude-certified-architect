import type { Flashcard } from './types';

export const domain1Cards: Flashcard[] = [
  {
    id: 'd1-01', domainId: 'domain1', lessonId: '1-1', difficulty: 'medium',
    tags: ['agentic-loop', 'stop_reason'],
    front: 'What is the ONLY reliable programmatic signal that an agentic loop should terminate?',
    back: 'stop_reason === "end_turn". Never parse natural language like "Task complete" — it\'s fragile and model-dependent.',
  },
  {
    id: 'd1-02', domainId: 'domain1', lessonId: '1-1', difficulty: 'easy',
    tags: ['agentic-loop', 'tool_use'],
    front: 'When stop_reason is "tool_use", what must you do?',
    back: 'Execute ALL requested tools in the response, collect ALL results, append them to the conversation, then send back for the next iteration. Do NOT discard any tool_use blocks.',
  },
  {
    id: 'd1-03', domainId: 'domain1', lessonId: '1-1', difficulty: 'hard',
    tags: ['agentic-loop', 'iteration-limit'],
    front: 'What is the role of max_iterations in an agentic loop?',
    back: 'It\'s a safety net to prevent infinite loops, NOT the primary termination mechanism. The loop should terminate on stop_reason === "end_turn". max_iterations catches edge cases where the model never stops.',
  },
  {
    id: 'd1-04', domainId: 'domain1', lessonId: '1-2', difficulty: 'medium',
    tags: ['multi-agent', 'orchestration'],
    front: 'What is the Hub-and-Spoke orchestration pattern?',
    back: 'A central "coordinator" agent receives all requests and routes them to specialist sub-agents. The coordinator aggregates results and returns a unified response. Most common pattern for Claude architectures.',
  },
  {
    id: 'd1-05', domainId: 'domain1', lessonId: '1-3', difficulty: 'medium',
    tags: ['subagent', 'context-isolation'],
    front: 'Why is context isolation important when invoking sub-agents?',
    back: 'Each sub-agent should have its own isolated context to prevent information leakage between tasks. The parent agent controls what context is passed to each sub-agent, ensuring focused and efficient execution.',
  },
  {
    id: 'd1-06', domainId: 'domain1', lessonId: '1-4', difficulty: 'hard',
    tags: ['workflow', 'structured-handoffs'],
    front: 'What is a structured handoff in multi-agent systems?',
    back: 'A formal protocol where agents pass control using defined schemas — including task description, context, constraints, and expected output format. Prevents ambiguity and information loss between agents.',
  },
  {
    id: 'd1-07', domainId: 'domain1', lessonId: '1-5', difficulty: 'hard',
    tags: ['sdk-hooks', 'pre-tool-use'],
    front: 'What is the difference between PreToolUse and PostToolUse hooks?',
    back: 'PreToolUse runs BEFORE a tool executes — can validate inputs, block execution, or modify parameters. PostToolUse runs AFTER — can transform outputs, log results, or trigger side effects. Both are part of the SDK hook system.',
  },
  {
    id: 'd1-08', domainId: 'domain1', lessonId: '1-6', difficulty: 'medium',
    tags: ['task-decomposition'],
    front: 'What are the key principles of effective task decomposition?',
    back: '1) Each subtask should be atomic and independently verifiable. 2) Dependencies between tasks should be explicit. 3) Tasks should map to a single agent\'s capability. 4) The decomposition should minimize context overlap.',
  },
  {
    id: 'd1-09', domainId: 'domain1', lessonId: '1-7', difficulty: 'hard',
    tags: ['session-state', 'persistence'],
    front: 'What are the critical components of session state that need persistence?',
    back: 'Conversation history, tool results cache, accumulated knowledge/context, task progress markers, and any intermediate results. Without persistence, resuming a session means restarting from scratch.',
  },
  {
    id: 'd1-10', domainId: 'domain1', lessonId: '1-7', difficulty: 'medium',
    tags: ['session-state', 'resumption'],
    front: 'Why is session resumption important for production agentic systems?',
    back: 'Long-running tasks may be interrupted (network issues, timeouts, rate limits). Resumption allows the agent to continue from where it stopped instead of redoing all work, saving time and cost.',
  },
  {
    id: 'd1-11', domainId: 'domain1', lessonId: '1-7', difficulty: 'medium',
    tags: ['session', 'fork'],
    front: 'What is fork_session and when would you use it?',
    back: 'Programmatically creates a branch of the current conversation into a new independent session. The fork starts from the current state but diverges. Use for risky approaches — if the fork fails, the original session is untouched. Useful for parallel exploration.',
  },
  {
    id: 'd1-12', domainId: 'domain1', lessonId: '1-7', difficulty: 'medium',
    tags: ['subagent', 'explore'],
    front: 'What is the Explore subagent and why does it matter for large codebases?',
    back: 'A dedicated subagent that navigates directories, reads files, and returns structured findings in its own context. The main agent receives only the summary, keeping its context clean. Critical for large codebases where direct exploration would fill the context window.',
  },
];
