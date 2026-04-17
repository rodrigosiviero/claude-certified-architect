import type { LessonExplanation } from './types';

export const domain5Explanations: LessonExplanation[] = [
  {
    id: '5-1',
    explanation: `## Context Management

Claude has a limited context window and attention isn't uniform — what you put where matters.

\`\`\`mermaid
flowchart LR
    subgraph "Context Window"
        S["🔥 START<br/>High attention"] --> M["😴 MIDDLE<br/>Low attention"]
        M --> E["🔥 END<br/>High attention"]
    end

    style S fill:#ef4444,color:#fff
    style M fill:#64748b,color:#fff
    style E fill:#ef4444,color:#fff
\`\`\`

### "Lost in the Middle" Effect

Claude attends most to the **beginning and end** of context — middle gets less attention. Put critical info at START and END.

### State Tracking > Conversation Memory

| Approach | Reliability |
|---|---|
| Rely on chat history | Fragile — gets summarized, details lost |
| Use structured files (JSON/YAML) | Durable — exact state persists |

### Scratchpad Files for Multi-Phase Work

For multi-phase tasks:
1. Write phase results to **files**
2. Reference files in the next phase
3. Don't rely on conversation memory across phases

### Progressive Summarization Risk

Progressive summarization is **lossy** — specific numbers and details get rounded or dropped over multiple rounds. Use files, not chat history, for data that must be exact.

> ⚠️ **Exam tip:** "Lost in the middle" + state tracking with files are the two most tested concepts here.`,
  },
  {
    id: '5-2',
    explanation: `## Escalation Triggers

Knowing when to escalate to a human vs when to keep helping is critical for production AI systems.

\`\`\`mermaid
flowchart LR
    M[User Message] --> E{Explicit request?}
    E -->|"Talk to a human"<br/>"I want a real person"| ESC["⚡ IMMEDIATE<br/>escalation"]
    E -->|Not explicit| S{Sentiment?}
    S -->|"This is frustrating"<br/>"ugh"| HELP["Continue helping<br/>Do NOT escalate"]
    S -->|Neutral| A["Attempt first<br/>Escalate if persists"]

    style ESC fill:#ef4444,color:#fff
    style HELP fill:#10b981,color:#fff
    style A fill:#f59e0b,color:#fff
\`\`\`

### Explicit = IMMEDIATE Escalation

\`\`\`
"I want to talk to a human"        → Escalate NOW (no "let me try first")
"Connect me to a real person"       → Escalate NOW
"Transfer me to an agent"           → Escalate NOW
\`\`\`

### Sentiment ≠ Trigger

\`\`\`
"This is so frustrating"            → Do NOT escalate, just help better
"ugh this doesn't work"             → Do NOT escalate, just help better
"I hate this"                       → Do NOT escalate, just help better
\`\`\`

Frustration ≠ escalation request. Help better, don't pass the user off.

### Multiple Ambiguous Matches

When multiple escalation points match, **ask the user to clarify** which one they need.

### Attempt-First for Non-Explicit

For non-explicit requests: attempt to help first, then escalate if the request persists or you can't resolve it.

> ⚠️ **Exam trap:** Escalating on "this is frustrating" is WRONG. Sentiment alone is never an escalation trigger.`,
  },
  {
    id: '5-3',
    explanation: `## PII Protection

Personally Identifiable Information (PII) must be protected at every boundary where data flows between systems.

\`\`\`mermaid
flowchart LR
    U[User Input] --> R["🔴 Redact PII<br/>at tool boundary"]
    R --> C[Claude Context]
    C --> T[Tool Call]
    T --> L["🔒 Safe Logging<br/>field-level redaction"]

    style R fill:#ef4444,color:#fff
    style L fill:#10b981,color:#fff
\`\`\`

### Redact at Tool Boundaries

Tool boundaries = the point where data leaves one system and enters another. **Redact BEFORE data enters Claude's context** — prevention, not cure.

### Least Information Principle

Only pass what's **strictly needed** for the task. If Claude doesn't need an SSN to answer the question, don't send it.

### Common PII to Watch For

- SSN, CPF, national ID numbers
- Email addresses, phone numbers
- Physical addresses, dates of birth
- Financial account numbers
- Medical records

### Safe Logging

\`\`\`
❌ Log: "User john@email.com queried account 12345"
✅ Log: "User [REDACTED] queried account [REDACTED]"
\`\`\`

Log **that** a query happened, not **what** it contained.

### Error Messages Must NEVER Expose PII

\`\`\`
❌ Error: "Failed to process SSN 123-45-6789"
✅ Error: "Failed to process identity verification"
\`\`\`

> 💡 **Exam tip:** Redaction happens at tool boundaries, BEFORE Claude sees the data. Not after.`,
  },
  {
    id: '5-4',
    explanation: `## Large Workflows

When dealing with large datasets or long-running processes, paginate, isolate, and checkpoint.

\`\`\`mermaid
flowchart LR
    Q[Query] --> P["Paginate<br/>LIMIT + count + summary"]
    P --> N{Has more?}
    N -->|Yes| M["Claude requests<br/>next page"]
    N -->|No| D[Done]
    
    D --> CK["Checkpoint<br/>state manifest"]
    CK --> |Crash?| RS["Resume from<br/>last checkpoint"]

    style P fill:#3b82f6,color:#fff
    style CK fill:#10b981,color:#fff
\`\`\`

### Paginate Results

\`\`\`
Pattern: return first N results + total_count + has_more boolean
\`\`\`

Never dump everything at once. Let Claude request more pages if needed — don't pre-fetch everything.

### Subagent Isolation

For **verbose exploration tasks**, use subagent isolation. The sub-agent does the heavy lifting without polluting the main conversation context.

### Crash Recovery

Use **state manifests** — checkpoint your progress so you can resume from the last successful point if something crashes.

\`\`\`json
{
  "last_processed": 47,
  "total": 200,
  "results_so_far": [...],
  "phase": "extraction"
}
\`\`\`

### Stratified Quality Monitoring

Measure quality **per segment**, not just overall average. A good overall score can hide terrible performance on specific segments.

> 💡 **Exam tip:** Paginate with LIMIT + count + summary. Never dump all results.`,
  },
  {
    id: '5-5',
    explanation: `## Multi-Turn Operations

Production AI conversations span multiple turns. Managing state, errors, and tool results across turns is essential.

\`\`\`mermaid
flowchart LR
    T1["Turn 1<br/>User asks question"] --> T2["Turn 2<br/>Tool call + result"]
    T2 --> T3["Turn 3<br/>Claude synthesizes"]
    T3 --> T4["Turn 4<br/>User follows up"]
    T4 --> T5["Turn 5<br/>Claude uses prior context"]

    style T1 fill:#3b82f6,color:#fff
    style T3 fill:#10b981,color:#fff
    style T5 fill:#8b5cf6,color:#fff
\`\`\`

### State Persistence Across Turns

- Use **structured state files** (JSON/YAML) for data that must survive across turns
- Don't rely on Claude "remembering" from earlier turns for critical data
- Conversation context is finite — important details can get pushed out

### Tool Result Handling

When a tool call fails:
1. Log the error clearly
2. Try an alternative approach if possible
3. Ask the user for clarification if the tool can't proceed
4. Never silently ignore tool failures

### Multi-Turn Error Recovery

\`\`\`
Turn 1: Claude calls tool → Error: timeout
Turn 2: Claude retries with simpler query → Partial success
Turn 3: Claude combines partial results + informs user of limitation
\`\`\`

### Context Window Pressure

Long multi-turn conversations fill the context window. Use:
- Summarization of earlier turns (but beware progressive summarization loss)
- External state files for critical data
- Sub-agents for independent sub-tasks

> 💡 **Exam tip:** Structured state files > conversation memory for multi-turn reliability.`,
  },
  {
    id: '5-6',
    explanation: `## Provenance & Attribution

In production AI systems, you must know **where** every piece of information came from.

\`\`\`mermaid
flowchart LR
    S1["Source A<br/>Internal docs"] --> C[Claude Response]
    S2["Source B<br/>Tool result"] --> C
    S3["Source C<br/>User input"] --> C
    C --> A["Attribution<br/>'Based on Source A + B'"]

    style A fill:#10b981,color:#fff
\`\`\`

### Why Attribution Matters

- **Auditability** — trace any output back to its source
- **Trust** — users can verify information
- **Compliance** — regulations may require source tracking
- **Debugging** — when output is wrong, find which source was incorrect

### How to Implement

- Tag each piece of retrieved context with its source
- Include source references in Claude's output instructions
- Log which sources were used for each response

\`\`\`json
{
  "response": "The API rate limit is 100 req/min",
  "sources": ["internal-api-docs.md", "rate-limits-config.yaml"],
  "confidence": "high"
}
\`\`\`

### Source Reliability

Not all sources are equal. Teach Claude to:
- Prefer official documentation over forum posts
- Flag outdated sources
- Note conflicts between sources
- Express uncertainty when sources disagree

### Documentation Standards

Every AI output in production should be traceable:
- Which model version generated it
- What sources/context were used
- When it was generated
- What prompt triggered it

> ⚠️ **Exam tip:** Provenance = traceability. Every output must be attributable to its sources.`,
  },
];

export default domain5Explanations;
