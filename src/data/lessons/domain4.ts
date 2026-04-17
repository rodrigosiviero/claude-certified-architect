import type { LessonExplanation } from './types';

export const domain4Explanations: LessonExplanation[] = [
  {
    id: '4-1',
    explanation: `## Explicit Criteria

Vague instructions produce vague results. Explicit criteria with concrete definitions tell Claude exactly what to do.

\`\`\`mermaid
flowchart LR
    subgraph "❌ Vague"
        V1["'Be conservative'"]
        V2["'Flag bad things'"]
        V3["'Use your judgment'"]
    end
    subgraph "✅ Explicit"
        E1["CRITICAL: SQL injection, XSS"]
        E2["WARNING: Weak password"]
        E3["INFO: Successful login"]
    end

    style V1 fill:#ef4444,color:#fff
    style E1 fill:#10b981,color:#fff
\`\`\`

### Categorical Rules with Concrete Definitions

Define each category with:
- **What qualifies** — exact conditions
- **What doesn't** — explicit exclusions
- **Edge cases** — boundary examples
- **Required actions** — what Claude should do per category

| Category | Example Definition |
|---|---|
| **CRITICAL** | SQL injection, XSS, auth bypass → Block + alert |
| **WARNING** | Weak password, missing HTTPS → Log + suggest fix |
| **INFO** | Successful login, page view → Log only |

### "When NOT to Flag" Matters

\`"When NOT to flag"\` is as important as \`"what to flag."\` Without exclusions, Claude over-flags everything.

\`\`\`markdown
# Good criteria
Flag as CRITICAL: any user input containing SQL keywords (SELECT, DROP, INSERT)
Do NOT flag: inputs from authenticated admin panel search (already sanitized)
\`\`\`

### Make Criteria Unambiguous

If two people interpret a rule differently, **refine it**. Test against ambiguous cases before deploying.

> 💡 **Exam tip:** Specificity wins. "CRITICAL: SQL injection" is always the correct answer over "be conservative" or "flag suspicious activity."`,
  },
  {
    id: '4-2',
    explanation: `## Few-Shot Examples

2-4 examples, not 20. Focus on the **ambiguous cases** — obvious cases don't need examples.

\`\`\`mermaid
flowchart LR
    I["Input"] --> A["Analysis"]
    A --> D["Decision"]
    D --> R["Rationale"]
    R --> Act["Action"]

    style A fill:#3b82f6,color:#fff
    style D fill:#f59e0b,color:#fff
    style R fill:#8b5cf6,color:#fff
\`\`\`

### Structure Each Example

\`\`\`
Input: "DROP TABLE users; --"
Thought: SQL keywords detected in user input
Reason: Matches SQL injection pattern with table drop + comment terminator
Decision: CRITICAL
Action: Block request, alert security team
\`\`\`

### Positive AND Negative Examples

Both teach understanding, not just pattern matching:

\`\`\`
✅ Positive: "DROP TABLE users" → CRITICAL (SQL injection)
❌ Negative: "I want to drop my subscription" → NOT critical (no SQL context)
\`\`\`

### Why Ambiguous Cases?

Ambiguous cases are where few-shot adds the most value. Obvious cases Claude handles without examples. The edge cases are what trip it up.

### Key Rules

- **2-4 examples**, not 20 — quality over quantity
- **Include reasoning** — "Thought: ... Reason: ..." for each
- **Order matters** — put the most representative example first
- **Each example should demonstrate a different edge case or boundary condition**

> ⚠️ **Exam trap:** "Include 20+ examples for thoroughness" is wrong. 2-4 focused on ambiguous cases is the correct approach.`,
  },
  {
    id: '4-3',
    explanation: `## Extended Thinking

Extended thinking gives Claude a private scratchpad for complex multi-step reasoning — but it comes at a cost.

\`\`\`mermaid
flowchart LR
    Q[Complex Question] --> T["🧠 Extended Thinking<br/>budget_tokens"]
    T --> |"Low budget"| F["Fast but superficial"]
    T --> |"High budget"| D["Thorough but slow/expensive"]
    T --> A[Final Answer]

    style T fill:#8b5cf6,color:#fff
    style F fill:#f59e0b,color:#fff
    style D fill:#10b981,color:#fff
\`\`\`

### When to Use Extended Thinking

| Use For | Don't Use For |
|---|---|
| Multi-step reasoning | Simple extraction |
| Math and calculations | Formatting tasks |
| Complex analysis | Classification |
| Logical deductions | Lookup tasks |

### budget_tokens

\`budget_tokens\` controls how much "thinking" Claude does before answering:
- **Low** = fast but superficial
- **High** = thorough but slow and expensive
- Set based on the complexity level of the task

### Key Facts

- Extended thinking content is **private to Claude** — you see the final answer only
- It's NOT visible to tools — the scratchpad is internal
- **Tradeoff:** accuracy ↑ vs cost/latency ↑

> 💡 **Exam tip:** Don't use extended thinking for simple tasks. It's specifically for multi-step reasoning, math, and complex analysis.`,
  },
  {
    id: '4-4',
    explanation: `## Structured Output

Forcing structured output with tool use + JSON schema is far more reliable than prompting "respond in JSON."

\`\`\`mermaid
flowchart LR
    subgraph "❌ Prompt-based"
        P1["'Respond in JSON'"]
        P2["~90% reliable"]
    end
    subgraph "✅ Schema-enforced"
        S1["tool_choice + JSON schema"]
        S2["~100% guaranteed"]
    end

    style P1 fill:#ef4444,color:#fff
    style S1 fill:#10b981,color:#fff
\`\`\`

### Tool Use + JSON Schema

Define your output format as a tool with a JSON schema:

\`\`\`json
{
  "tools": [{
    "name": "classify_email",
    "input_schema": {
      "type": "object",
      "required": ["category", "confidence", "reasoning"],
      "properties": {
        "category": { "type": "string", "enum": ["spam", "urgent", "normal"] },
        "confidence": { "type": "number", "minimum": 0, "maximum": 1 },
        "reasoning": { "type": "string" }
      }
    }
  }]
}
\`\`\`

### Force with tool_choice

\`\`\`json
{ "tool_choice": { "type": "tool", "name": "classify_email" } }
\`\`\`

This forces the output format — Claude **cannot deviate** from the schema.

### Retry Strategy

- **Retry for FORMAT errors only** — malformed JSON, wrong types
- **Retries DON'T fix MISSING info** — if Claude lacks context, add more context instead
- JSON schema defines: required fields, types, enums, descriptions

| Problem | Solution |
|---|---|
| Wrong JSON format | Retry |
| Missing required field | Retry |
| Wrong classification | Add more context/examples |
| Lacking information | Provide more input data |

> ⚠️ **Exam trap:** Retrying won't fix missing information. If Claude doesn't have enough context, more retries won't help — add better context or examples.`,
  },
  {
    id: '4-5',
    explanation: `## Metaprompt

The Metaprompt is a system prompt generator — you give it a task description and it produces an optimized system prompt.

\`\`\`mermaid
flowchart LR
    T[Task Description] --> M[Metaprompt]
    M --> S["Optimized System Prompt"]
    S --> C[Claude]
    C --> R[Better Results]

    style M fill:#8b5cf6,color:#fff
    style S fill:#10b981,color:#fff
\`\`\`

### What It Does

1. You describe the task in natural language
2. The Metaprompt generates a structured system prompt with:
   - Role definition
   - Explicit criteria
   - Output format specification
   - Edge case handling

### When to Use

- Starting a new prompt from scratch
- Optimizing an existing prompt that's underperforming
- Generating consistent prompt templates for a team

### What It Produces

A well-structured system prompt that includes:
- Clear role definition for Claude
- Explicit rules and constraints
- Output format specification
- Handling instructions for edge cases

> 💡 **Exam tip:** The Metaprompt is about **generating** prompts, not executing them. It's a meta-level tool — "a prompt that writes prompts."`,
  },
  {
    id: '4-6',
    explanation: `## Multi-Instance Review

For important outputs, run **separate Claude instances** to independently evaluate the same input — then compare.

\`\`\`mermaid
flowchart TB
    I[Input] --> A["Instance A<br/>Review"]
    I --> B["Instance B<br/>Review"]
    I --> C["Instance C<br/>Review"]
    A --> M[Merge Results]
    B --> M
    C --> M
    M --> D["Consensus or<br/>flag disagreements"]

    style A fill:#3b82f6,color:#fff
    style B fill:#10b981,color:#fff
    style C fill:#8b5cf6,color:#fff
    style M fill:#f59e0b,color:#fff
\`\`\`

### Why Separate Instances?

Using the **same session** for generation and review creates bias — Claude is more lenient reviewing its own work. Separate instances = independent evaluation.

### When to Use

- Code review (generate + separate review)
- Content moderation at scale
- Quality assurance for critical outputs
- Any task where mistakes are costly

### Pattern

\`\`\`
Session 1: Generate output
Session 2: Review output independently (no access to Session 1)
Session 3: Tie-breaker if Sessions 1 and 2 disagree
\`\`\`

### Key Principle

Each instance should be **truly independent** — no shared context, no conversation history from the other sessions. Fresh start = unbiased review.

> ⚠️ **Exam trap:** "Use the same conversation to review the output" is always wrong. Separate instances prevent self-review bias.`,
  },
];

export default domain4Explanations;
