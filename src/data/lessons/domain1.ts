import type { LessonExplanation } from './types';

export const domain1Explanations: LessonExplanation[] = [
  {
    id: '1-1',
    explanation: `## How the Agentic Loop Works

A chatbot takes your message and gives one response. An **agent** takes your message, decides if it needs to take actions (call tools), executes those actions, and then decides what to do next. This cycle repeats until the task is done.

\`\`\`mermaid
flowchart TD
    A[Send message + tools to Claude] --> B[Claude responds]
    B --> C{stop_reason?}
    C -->|tool_use| D[Execute ALL tool_use blocks]
    D --> E[Append tool_results to messages]
    E --> A
    C -->|end_turn| F[Done! Return response]
    C -->|max_turns reached| G[Safety stop]
    G --> F

    style A fill:#3b82f6,color:#fff
    style C fill:#f59e0b,color:#fff
    style F fill:#10b981,color:#fff
    style G fill:#ef4444,color:#fff
\`\`\`

### stop_reason Is THE Critical Field

**stop_reason** tells your code what to do next:

| stop_reason | Meaning | Your code should... |
|---|---|---|
| \`"tool_use"\` | Claude wants to call tools | Execute ALL tool_use blocks, append results, loop |
| \`"end_turn"\` | Claude is finished | Break the loop, return response to user |
| \`"max_tokens"\` | Response was truncated | Continue the conversation to let Claude finish |

> 💡 **Exam tip:** Never check response text for keywords like "done" to decide if the loop should stop. Always use stop_reason. Claude might say "I am done looking up the customer" but still need to process a refund.

### How Tool Results Are Appended

When stop_reason is \`"tool_use"\`, Claude's response contains one or more **tool_use blocks**. Each block has:

- **id**: A unique identifier (e.g., \`"toolu_abc123"\`)
- **name**: The tool to call (e.g., \`"lookup_order"\`)
- **input**: The parameters (e.g., \`{"order_id": "ORD-12345"}\`)

Your code executes each tool, then appends a **tool_result** message with role \`"user"\` that matches each tool_use by its id:

\`\`\`
messages: [
  { role: "user", content: "Where is my order ORD-12345?" },
  { role: "assistant", content: [tool_use: lookup_order(...)] },
  { role: "user", content: [tool_result: "Order shipped, arrives June 15"] }
]
\`\`\`

> 💡 The tool_result uses role \`"user"\`, not \`"tool"\`. And the tool_use_id in the result MUST match the id in the tool_use block.

### Key Mistakes to Avoid

- **Only executing ONE tool** when Claude requests multiple. Claude can request several tools in one response. Execute ALL of them.
- **Forgetting to append results.** Without results, Claude has no context for the next step.
- **No maximum iteration count.** Always set a safety net (20-50 iterations). This prevents infinite loops if Claude keeps calling tools without reaching end_turn.
- **Using max_turns as primary termination.** Primary = stop_reason. max_turns is a safety net, not the main exit condition.

### Model-Driven Decision Making

The fundamental shift: **Claude decides which tools to call**, not you. You define the tools and their descriptions. Claude reads them and decides what to use based on the user query. This is agentic architecture — the AI drives, your code executes.`,
  },
  {
    id: '1-2',
    explanation: `## Multi-Agent Orchestration Patterns

When your system has many tasks, one agent with all the tools becomes unreliable. The solution: **specialized agents with an orchestrator**.

\`\`\`mermaid
flowchart TB
    U[User Query] --> O[Orchestrator Agent]
    O -->|Route| A[Refund Agent]
    O -->|Route| B[Shipping Agent]
    O -->|Route| C[Tech Support Agent]
    A -->|Result| O
    B -->|Result| O
    C -->|Result| O
    O -->|Synthesized answer| U

    style O fill:#3b82f6,color:#fff
    style A fill:#10b981,color:#fff
    style B fill:#10b981,color:#fff
    style C fill:#10b981,color:#fff
\`\`\`

### Three Core Patterns

| Pattern | How it works | Best for |
|---|---|---|
| **Hub-and-Spoke** | Central coordinator routes to specialists, synthesizes results | Complex tasks needing aggregation |
| **Handoff Chain** | Agent A output becomes Agent B input (pipeline) | Ordered sequential tasks |
| **Parallel Fan-out** | Coordinator invokes multiple agents simultaneously | Independent research tasks |

### Hub-and-Spoke (Most Common)

One orchestrator receives all messages, delegates to specialists, and aggregates results. Specialists do NOT talk to each other — only to the orchestrator. Simple, predictable, easy to debug.

**Key rule:** The coordinator does NOT do domain work itself — it only delegates and synthesizes.

### Handoff Chain (Pipeline)

Agent A completes work → passes structured context to Agent B → Agent B continues. Like an assembly line: extract data → analyze it → generate report. Rigid but reliable — if one step fails, everything stops.

### Parallel Fan-out

Coordinator invokes multiple subagents at the same time. Good for independent tasks: "Research competitor pricing" + "Analyze our margins" + "Generate pricing recommendation" — all run simultaneously, results feed into a synthesis step.

### Dynamic Selection vs Keyword Routing

> ⚠️ **Anti-pattern:** Keyword-based routing: \`if query contains "refund" → route to refund_agent\`. This breaks when users say "I want my money back" (no "refund" keyword).

**Correct approach:** The orchestrator should be a Claude agent itself. Claude understands intent and routes dynamically. No hardcoded keyword matching.

### Context Isolation Between Agents

Subagents have **isolated context** — they do not see each other's conversations. Only what the coordinator explicitly passes. This prevents confusion and saves tokens.`,
  },
  {
    id: '1-3',
    explanation: `## Subagent Invocation and Context Isolation

The orchestrator delegates to specialists using the **Task** tool. Each subagent starts with a completely blank conversation.

\`\`\`mermaid
sequenceDiagram
    participant O as Orchestrator
    participant T as Task Tool
    participant S as Subagent

    O->>T: invoke("shipping_agent", task: "Check order ORD-789")
    Note over T,S: Fresh conversation created
    T->>S: System prompt + specific task only
    S->>S: Runs own agentic loop
    S->>S: May call tools multiple times
    S-->>T: Returns result only
    T-->>O: "Order shipped, arrives June 15"
    Note over O: Appends result to main conversation
\`\`\`

### The Task Tool Is Required

- The **Task** tool is how Claude invokes subagents. It **MUST** be in \`allowedTools\` for subagent invocation to work.
- Forgetting this is the **#1 reason** subagents fail silently. The tool call is never made because the tool is not available.

### Subagents Start with a Blank Slate

A subagent gets:
- Its own **system prompt** (specialist instructions)
- The **specific task** (not the full parent conversation)
- Only the **tools it needs** (not all parent tools)

The subagent does NOT see:
- The parent conversation history
- Other subagent conversations
- Any context not explicitly passed

> 💡 Never assume subagents share context — they don't. Each invocation is a fresh start.

### Goal-Oriented Prompts for Subagents

Tell the subagent **exactly what to produce**. Include \`outputFormat\` in the task description:

- ❌ "Help with shipping"
- ✅ "Find the shipping status of order ORD-789. Return format: {status, tracking_number, estimated_delivery}"

### Context Trimming

For large contexts, pass **summaries** rather than full conversation history. Subagent context windows are limited. If the orchestrator had a 10-minute conversation, pass a structured summary, not the raw transcript.

### Result Attribution

When a subagent returns results, the coordinator should **track which subagent produced which findings**. This matters for debugging and for the orchestrator's synthesis step.`,
  },
  {
    id: '1-4',
    explanation: `## Workflow Enforcement and Structured Handoffs

Some tasks have mandatory steps that MUST happen in order. A refund requires: verify customer → check order → verify return window → process refund. You cannot skip steps.

\`\`\`mermaid
stateDiagram-v2
    [*] --> IDLE
    IDLE --> CUSTOMER_VERIFIED: get_customer success
    CUSTOMER_VERIFIED --> ORDER_FOUND: get_order success
    ORDER_FOUND --> REFUND_CHECKED: check_return_window (within policy)
    REFUND_CHECKED --> REFUND_PROCESSED: process_refund
    REFUND_PROCESSED --> [*]

    IDLE --> BLOCKED: process_refund without verification
    BLOCKED --> IDLE: Error: prerequisites not met
\`\`\`

### The Problem with Prompt-Only Enforcement

"Always call get_customer before process_refund" works ~95% of the time. For financial systems, **95% is not enough** — every missed verification risks a wrong refund.

### Two Levels of Enforcement

| Level | How it works | Reliability | Use for |
|---|---|---|---|
| **Prompt instructions** | Tell Claude the rules in system prompt | ~95% | Nice-to-have guidance |
| **Programmatic (hooks/state machines)** | Code blocks tool calls until prerequisites met | ~100% | Must-never-fail rules |

### Programmatic Prerequisites

Before allowing a tool call, your code checks if prerequisites are met. If not, block and return error: "Cannot process refund: customer not verified yet."

This is deterministic — it works 100% of the time because it is code, not a suggestion.

### State Machines for Workflow

Define valid states and transitions: IDLE → CUSTOMER_VERIFIED → ORDER_FOUND → REFUND_CHECKED → REFUND_PROCESSED. Any attempt to jump states is blocked.

### Structured Handoff Packages

When passing work to humans or other agents, include structured data:
- What was tried (actions taken)
- What worked / what failed
- Confidence level
- Caveats and edge cases found
- Recommended next steps`,
  },
  {
    id: '1-5',
    explanation: `## SDK Hooks: PreToolUse and PostToolUse

Hooks are middleware that run on **every tool call** without modifying the tool implementations. They are deterministic — no exceptions.

\`\`\`mermaid
flowchart LR
    C[Claude requests tool] --> P{PreToolUse Hook}
    P -->|Block| X[Return error to Claude]
    P -->|Modify| M[Changed parameters]
    P -->|Allow| E[Execute tool]
    M --> E
    E --> Q{PostToolUse Hook}
    Q -->|Transform| T[Modified result]
    Q -->|Allow| R[Original result]
    T --> F[Return to Claude]
    R --> F

    style P fill:#f59e0b,color:#fff
    style Q fill:#10b981,color:#fff
    style X fill:#ef4444,color:#fff
\`\`\`

### PreToolUse Hook (Before Execution)

Fires before the tool runs. Can:
- **Block** the call entirely (return error to Claude)
- **Modify** the input parameters
- **Redirect** to a different tool

Use for: blocking dangerous operations, rate limiting, input validation.

### PostToolUse Hook (After Execution)

Fires after the tool returns, before Claude sees the result. Can:
- **Transform** the result (mask PII, normalize format)
- **Filter** sensitive data
- **Validate** output format

Use for: PII masking, output normalization, audit logging.

### Hook Types Reference

| Hook | When it fires | Common uses |
|---|---|---|
| PreToolUse | Before a tool executes | Validate inputs, block dangerous commands |
| PostToolUse | After a tool returns | Audit outputs, trigger side effects |
| UserPromptSubmit | When a prompt is sent | Inject additional context |
| Stop | When the agent finishes | Validate result, save session state |
| SubagentStart/Stop | When a subagent spawns or completes | Track parallel task results |
| PreCompact | Before context compaction | Archive full transcript |

### Combine Hooks with Prompts

**Prompts guide** Claude's behavior. **Hooks enforce** the boundaries. This is the recommended pattern. Hooks add complexity — use them only for rules that MUST never be broken.`,
  },
  {
    id: '1-6',
    explanation: `## Task Decomposition Strategies

Claude has a limited attention span. If you ask it to "build a complete e-commerce system," it tries to plan everything at once, runs out of context, and produces mediocre results.

\`\`\`mermaid
flowchart TD
    subgraph Prompt Chaining
        A1[Research] --> A2[Analyze]
        A2 --> A3[Draft]
        A3 --> A4[Review]
    end

    subgraph Per-File Passes
        B1[File 1: verify] --> B2[File 2: verify]
        B2 --> B3[File 3: verify]
        B3 --> B4[Cross-file check]
    end

    subgraph Dynamic Adaptive
        C1[Explore codebase] --> C2{Found issue?}
        C2 -->|Yes| C3[Fix and re-explore]
        C2 -->|No| C4[Done]
        C3 --> C2
    end

    style A1 fill:#3b82f6,color:#fff
    style B1 fill:#10b981,color:#fff
    style C1 fill:#8b5cf6,color:#fff
\`\`\`

### Three Decomposition Strategies

**1. Prompt Chaining** — Sequential steps where each output feeds the next. Best for pipelines with clear boundaries: research → analyze → draft → review.

**2. Dynamic Adaptive** — Claude explores and adjusts based on findings. Best for open-ended tasks where the path is unclear ("improve the architecture").

**3. Per-File Passes** — Complete one file at a time, verify, then move to next. After all files, do a cross-file consistency check. Best for predictable refactors.

### Choosing the Wrong Strategy

- ❌ Prompt chaining for open-ended tasks → rigid output, misses discoveries
- ❌ Dynamic adaptive for predictable tasks → wasted exploration turns
- ✅ Match strategy to task type

### Decomposition Granularity

- Too fine (one function per call) = coordination overhead
- Too coarse (everything in one call) = losing agentic benefits
- Sweet spot: each subtask should be independently verifiable

### Plan Mode

The plan-then-execute pattern: tell Claude to create a plan first without making changes. Review the plan, then execute step by step. Crucial for large, irreversible operations.`,
  },
  {
    id: '1-7',
    explanation: `## Session State, Persistence and Resumption

Every message stays in the conversation — this is your **session state**. It grows with every turn and eventually must be managed.

\`\`\`mermaid
flowchart TD
    S[Session grows with each turn] --> T{Context size OK?}
    T -->|Yes| C[Continue normally]
    T -->|No| D{Still valid?}
    D -->|Yes, < 24h old| R[Resume with --resume flag]
    D -->|No, stale| F[Fresh session + inject summary]
    
    R --> C
    F --> C

    style T fill:#f59e0b,color:#fff
    style D fill:#8b5cf6,color:#fff
    style C fill:#10b981,color:#fff
\`\`\`

### Progressive Summarization

As conversations grow, older turns are compressed. But **summarized tool results become unreliable** — numbers change, details get lost.

**Solution: Immutable case facts.** Pin critical data (customer IDs, order amounts, refund status) in a block that is NEVER summarized. This is essential for long sessions.

### When to Resume vs Start Fresh

| Situation | Action |
|---|---|
| Session still valid, no external changes, < 24h old | \`--resume\` to continue |
| Context stale, tool results outdated, files changed | Fresh session + inject summary |
| Want to explore alternatives | Session fork from a specific message |

### Session Forking

Create a branch from a specific message index. Explore multiple approaches from the same conversation point. Each fork is independent — changes in one do not affect the other.

### State Persistence

If your agent crashes, all progress is lost. Design for crash recovery:
- Export structured state manifests periodically
- A new agent can pick up from the last checkpoint by reading the manifest
- Write intermediate findings to scratchpad files that persist across sessions`,
  },
];

export default domain1Explanations;
