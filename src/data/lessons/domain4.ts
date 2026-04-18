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
    explanation: `## Structured Output with Tool Use & JSON Schemas

\`tool_use\` with JSON schemas is the **most reliable approach** for guaranteed schema-compliant structured output — it eliminates JSON syntax errors entirely.

\`\`\`mermaid
flowchart LR
    D[Document] --> C[Claude]
    C -->|tool_use| T["Extraction Tool<br/>with JSON Schema"]
    T --> S["Guaranteed valid JSON<br/>matching your schema"]

    style C fill:#3b82f6,color:#fff
    style T fill:#10b981,color:#fff
\`\`\`

### tool_choice Options

| Value | Behavior | Use When |
|---|---|---|
| \`"auto"\` | Model **may** return text OR call a tool | Flexible — model decides |
| \`"any"\` | Model **must** call a tool, can choose which | Multiple extraction schemas, unknown doc type |
| \`{"type": "tool", "name": "extract_metadata"}\` | Model **must** call a **specific** named tool | Force a particular extraction before enrichment |

### Schema Design Considerations

\`\`\`json
{
  "name": "extract_invoice",
  "input_schema": {
    "type": "object",
    "required": ["vendor", "total", "line_items"],
    "properties": {
      "vendor": { "type": "string" },
      "total": { "type": "number" },
      "line_items": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "description": { "type": "string" },
            "amount": { "type": "number" }
          }
        }
      },
      "category": {
        "type": "string",
        "enum": ["utilities", "services", "hardware", "other"]
      },
      "other_category_detail": { "type": "string" }
    }
  }
}
\`\`\`

### Key Design Patterns

- **Optional (nullable) fields** when source documents may not contain the info → prevents fabrication
- **Enum with "other" + detail string** for extensible categories
- **Enum with "unclear"** for ambiguous cases
- **Format normalization rules** in prompts alongside schemas for inconsistent source formatting

### Syntax vs Semantic Errors

| Type | Fixed by schema? | Example |
|---|---|---|
| **Syntax errors** | ✅ Yes — invalid JSON | Missing bracket, wrong type |
| **Semantic errors** | ❌ No — valid but wrong | Line items don't sum to total, value in wrong field |

> ⚠️ **Exam trap:** JSON schemas eliminate SYNTAX errors but NOT semantic errors. Line items not summing to total is a semantic error — the schema can't catch that.`,
  },
  {
    id: '4-4',
    explanation: `## Validation, Retry & Feedback Loops

When extraction fails, use **retry-with-error-feedback** — but know when retries won't help.

\`\`\`mermaid
flowchart LR
    E["Extraction attempt"] --> V{Validation}
    V -->|Pass| D["✅ Done"]
    V -->|"Syntax/format error"| R["Retry with<br/>specific error feedback"]
    R --> E
    V -->|"Info absent"| X["❌ Retry won't help<br/>Provide more context"]

    style V fill:#f59e0b,color:#fff
    style R fill:#3b82f6,color:#fff
    style X fill:#ef4444,color:#fff
\`\`\`

### Retry-with-Error-Feedback

Append **specific validation errors** to the prompt on retry:

\`\`\`
Original prompt: "Extract invoice data from this document"
Retry prompt: "Extract invoice data. Previous attempt failed:
  - line_items total ($450) does not match stated total ($500)
  - category 'unclear' for item 3 — please classify"
\`\`\`

### The Limits of Retry

| Retry WILL fix | Retry WON'T fix |
|---|---|
| Format mismatches | Information absent from source document |
| Structural output errors | Data only exists in an external doc not provided |
| Missing required fields (Claude can infer) | Information simply doesn't exist |
| Wrong enum values | Fundamentally insufficient context |

### Self-Correction Validation Patterns

Design flows where Claude cross-checks its own output:

\`\`\`json
{
  "calculated_total": 450,
  "stated_total": 500,
  "conflict_detected": true,
  "line_items": [...]
}
\`\`\`

Extract \`calculated_total\` alongside \`stated_total\` to flag discrepancies. Add \`conflict_detected\` booleans for inconsistent source data.

### detected_pattern Fields

Add \`detected_pattern\` to structured findings to track which code constructs trigger findings. This enables systematic analysis of false positive patterns when developers dismiss findings.

> ⚠️ **Exam trap:** "Retry when the source document doesn't contain the information" is wrong. Retries fix FORMAT, not ABSENCE.`,
  },
  {
    id: '4-5',
    explanation: `## Batch Processing Strategies

The **Message Batches API** provides 50% cost savings for latency-tolerant workloads — but it's not for everything.

\`\`\`mermaid
flowchart LR
    subgraph "Synchronous API"
        S1["Real-time"]
        S2["Pre-merge checks"]
        S3["Full cost"]
    end
    subgraph "Batch API"
        B1["50% cheaper"]
        B2["Up to 24h window"]
        B3["No latency SLA"]
    end

    style S1 fill:#3b82f6,color:#fff
    style B1 fill:#10b981,color:#fff
\`\`\`

### When to Use Batch vs Synchronous

| Use Batch API | Use Synchronous API |
|---|---|
| Overnight reports | Pre-merge checks (blocking) |
| Weekly audits | Real-time chat responses |
| Nightly test generation | Interactive tool use |
| Non-blocking workloads | Latency-sensitive operations |

### Key Constraints

- **No multi-turn tool calling** within a single batch request — cannot execute tools mid-request and return results
- **Up to 24-hour processing window** — no guaranteed latency SLA
- **\`custom_id\` fields** for correlating batch request/response pairs

### Submission Frequency

Calculate batch submission frequency based on SLA constraints:
- Example: Submit batches every 4 hours to guarantee completion within 30-hour SLA with 24-hour batch processing window

### Handling Batch Failures

1. Identify failed documents by \`custom_id\`
2. Resubmit **only** failed documents with appropriate modifications
3. Example: chunk documents that exceeded context limits before resubmitting

### Prompt Refinement Before Batch

Refine prompts on a **sample set** before batch-processing large volumes. This maximizes first-pass success rates and reduces iterative resubmission costs.

> ⚠️ **Exam trap:** Using batch API for pre-merge checks is wrong — those are blocking workflows that need the synchronous API.`,
  },
  {
    id: '4-6',
    explanation: `## Multi-Instance & Multi-Pass Review

A model reviewing its own work in the same session is biased — it retains reasoning context from generation and is less likely to question its own decisions.

\`\`\`mermaid
flowchart TB
    I[Input] --> G["Instance 1<br/>Generate"]
    G --> R1["Instance 2<br/>Independent Review<br/>(no prior context)"]
    R1 --> |"Low confidence"| H["Route to human"]
    R1 --> |"Issues found"| R2["Instance 3<br/>Tie-breaker / Fix"]
    R1 --> |"All good"| M["✅ Approve"]

    style G fill:#3b82f6,color:#fff
    style R1 fill:#10b981,color:#fff
    style R2 fill:#8b5cf6,color:#fff
\`\`\`

### Self-Review Limitations

- A model **retains reasoning context** from generation
- Less likely to question its own decisions in the same session
- Self-review instructions or extended thinking don't fix this bias
- **Independent instances** (without prior reasoning context) are more effective

### Multi-Pass Review for Large Codebases

Split large reviews into focused passes to avoid **attention dilution**:

| Pass | Focus | Scope |
|---|---|---|
| **Local pass** | Individual function/method correctness | Per-file |
| **Integration pass** | Cross-component data flow | Cross-file |
| **Architecture pass** | Overall design, performance, security | System-wide |

### Confidence-Based Routing

Run verification passes where the model **self-reports confidence** alongside each finding:

\`\`\`json
{
  "finding": "SQL injection in auth handler",
  "confidence": 0.65,
  "severity": "CRITICAL"
}
\`\`\`

Route by confidence — NOT blind trust:
- **Low confidence** → human review
- **Medium confidence** → senior dev review
- **High confidence** → auto-merge (but high ≠ correct)

> ⚠️ **Exam trap:** "Use the same session for generation and review" is always wrong. Separate instances without shared context = unbiased review.`,
  },
];

export default domain4Explanations;
