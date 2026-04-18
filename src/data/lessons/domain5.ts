import type { LessonExplanation } from './types';

export const domain5Explanations: LessonExplanation[] = [
  {
    id: '5-1',
    explanation: `## Context Management Across Long Interactions

As conversations grow, context degrades. Critical information gets lost, tool results bloat token usage, and summarization distorts facts.

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

Models reliably process information at the **beginning and end** of long inputs but may omit findings from **middle sections**. Put key findings summaries at the beginning of aggregated inputs.

### Tool Result Accumulation

Tool results accumulate in context and consume tokens **disproportionately to their relevance**. Example: 40+ fields per order lookup when only 5 are relevant.

**Solution:** Trim verbose tool outputs to only relevant fields before they accumulate in context. Keep only return-relevant fields from order lookups.

### Progressive Summarization Risks

Condensing numerical values, percentages, dates, and customer-stated expectations into vague summaries loses critical detail. Specific amounts become "some amount", dates become "recently".

### "Case Facts" Block

Extract transactional facts (amounts, dates, order numbers, statuses) into a persistent **"case facts" block** included in each prompt, outside summarized history:

\`\`\`json
{
  "case_facts": {
    "order_id": "ORD-78923",
    "amount": "$149.99",
    "order_date": "2025-01-15",
    "status": "returned",
    "issue": "wrong size"
  }
}
\`\`\`

### Subagent Metadata

Require subagents to include **metadata** (dates, source locations, methodological context) in structured outputs to support accurate downstream synthesis. Modify upstream agents to return structured data instead of verbose reasoning chains.

> 💡 **Exam tip:** Know the difference between trimming tool outputs (proactive) vs summarizing history (lossy). Case facts blocks persist exact values.`,
  },
  {
    id: '5-2',
    explanation: `## Escalation & Ambiguity Resolution

Knowing when to escalate, when to resolve, and when to ask for clarification.

\`\`\`mermaid
flowchart LR
    M[Customer Message] --> E{Explicit request<br/>for human?}
    E -->|"I want to talk<br/>to a person"| ESC["⚡ IMMEDIATE<br/>escalation"]
    E -->|Not explicit| R{Can agent<br/>resolve?}
    R -->|Yes, straightforward| H["Offer to resolve<br/>Acknowledge frustration"]
    R -->|Policy gap/ambiguous| P["Escalate —<br/>policy silent on request"]
    R -->|Multiple matches| C["Ask for<br/>clarification"]

    style ESC fill:#ef4444,color:#fff
    style H fill:#10b981,color:#fff
    style P fill:#f59e0b,color:#fff
    style C fill:#8b5cf6,color:#fff
\`\`\`

### Explicit = IMMEDIATE

\`\`\`
"I want to talk to a human"        → Escalate NOW
"Connect me to a real person"       → Escalate NOW
\`\`\`

Honor explicit requests immediately. No "let me try first" when the customer explicitly demands a human.

### Sentiment ≠ Trigger

Frustration is NOT an escalation trigger. "This is ridiculous" → acknowledge frustration + offer resolution. Only escalate if the customer **reiterates** their preference for a human.

### Sentiment and Self-Reported Confidence Are Unreliable

Sentiment-based escalation and self-reported confidence scores are **unreliable proxies** for actual case complexity. A frustrated customer with a simple issue doesn't need escalation.

### Policy Gaps = Escalation

Escalate when policy is **ambiguous or silent** on the customer's specific request. Example: competitor price matching when policy only addresses own-site adjustments.

### Multiple Matches → Clarification

When tool results return multiple customer matches, **ask for additional identifiers** rather than selecting based on heuristics. Never guess.

\`\`\`
❌ Picked first match by default
✅ "I found 3 accounts. Could you provide your order number or zip code?"
\`\`\`

> ⚠️ **Exam trap:** Escalating on "this is frustrating" is wrong. Selecting the first match from multiple results is wrong.`,
  },
  {
    id: '5-3',
    explanation: `## Error Propagation Across Multi-Agent Systems

In multi-agent architectures, how errors flow between agents determines whether the system recovers gracefully or cascades into failure.

\`\`\`mermaid
flowchart LR
    S[Subagent] -->|"Structured error:<br/>type, attempted, partial,<br/>alternatives"| C[Coordinator]
    C --> R{"Recovery possible?"}
    R -->|Yes, transient| RT["Retry with<br/>alternatives"]
    R -->|No, propagate| E["Escalate with<br/>full context"]

    style S fill:#3b82f6,color:#fff
    style C fill:#10b981,color:#fff
    style E fill:#ef4444,color:#fff
\`\`\`

### Structured Error Context

Return structured errors that enable **intelligent coordinator recovery**:

\`\`\`json
{
  "error_type": "timeout",
  "attempted_query": "SELECT * FROM orders WHERE customer_id = 123",
  "partial_results": [{"order_id": "ORD-1", "status": "pending"}],
  "alternatives": ["query by date range", "query by status only"]
}
\`\`\`

### Access Failures vs Valid Empty Results

| Type | Meaning | Coordinator Action |
|---|---|---|
| **Access failure** (timeout, 500) | System couldn't reach data | Retry decision |
| **Valid empty result** (0 matches) | System reached data, nothing found | No retry needed |

Generic errors like "search unavailable" **hide valuable context** from the coordinator.

### Two Anti-Patterns

1. **Silently suppressing errors** — returning empty results as success hides failures
2. **Terminating on single failure** — one subagent failing shouldn't kill the entire workflow

### Subagent Local Recovery

Subagents should implement **local recovery** for transient failures and only propagate errors they cannot resolve, including what was attempted and partial results.

### Coverage Annotations

Structure synthesis output with **coverage annotations** indicating which findings are well-supported versus which topic areas have gaps due to unavailable sources.

> ⚠️ **Exam trap:** "Return empty results when a tool fails" and "terminate the whole pipeline on any error" are both anti-patterns.`,
  },
  {
    id: '5-4',
    explanation: `## Large Codebase Exploration

Extended exploration sessions degrade context quality. Agents start giving inconsistent answers and referencing "typical patterns" rather than specific classes discovered earlier.

\`\`\`mermaid
flowchart TB
    M[Main Agent<br/>High-level coordination] --> S1["Subagent 1:<br/>Find all test files"]
    M --> S2["Subagent 2:<br/>Trace refund flow"]
    M --> S3["Subagent 3:<br/>Map API endpoints"]
    S1 --> |"Structured findings"| M
    S2 --> |"Structured findings"| M
    S3 --> |"Structured findings"| M
    M --> SP["Scratchpad files<br/>Persist key findings"]

    style M fill:#3b82f6,color:#fff
    style SP fill:#10b981,color:#fff
\`\`\`

### Context Degradation in Extended Sessions

After exploring many files, models start:
- Giving **inconsistent answers** (contradicting earlier findings)
- Referencing "typical patterns" instead of **specific classes** discovered earlier
- Losing track of which files were already examined

### Scratchpad Files

Agents maintain **scratchpad files** recording key findings. Reference them for subsequent questions to counteract context degradation.

\`\`\`markdown
# exploration-findings.md
## Refund Flow
- Entry point: RefundController.ts
- Validates via RefundValidator.ts
- Calls PaymentGateway.processRefund()
- Tests: tests/refund/*.test.ts (12 files)
\`\`\`

### Subagent Delegation

Spawn subagents to investigate **specific questions** while the main agent preserves high-level coordination:
- "Find all test files related to refunds"
- "Trace the authentication middleware chain"

Verbose exploration output stays in the subagent — main agent gets only structured findings.

### Crash Recovery with State Manifests

Each agent exports state to a known location. Coordinator loads a manifest on resume:

\`\`\`json
{
  "phase": "api_exploration",
  "files_examined": 47,
  "key_findings": ["..."],
  "pending_queries": ["trace webhooks", "map cron jobs"]
}
\`\`\`

### /compact Command

Use \`/compact\` to reduce context usage during extended exploration sessions when context fills with verbose discovery output.

> 💡 **Exam tip:** Scratchpad files + subagent delegation + state manifests = the three pillars of large codebase exploration.`,
  },
  {
    id: '5-5',
    explanation: `## Human Review Workflows & Confidence Calibration

Aggregate accuracy metrics can be dangerously misleading. 97% overall accuracy might hide 60% accuracy on a specific document type.

\`\`\`mermaid
flowchart LR
    E[Extractions] --> S{"Confidence?"}
    S -->|"High (>0.9)"| SR["Stratified random<br/>sampling audit"]
    S -->|"Medium"| R["Human review<br/>with priority queue"]
    S -->|"Low / ambiguous"| H["Immediate human<br/>review"]
    SR --> |"Error rate > threshold"| A["Add to review queue"]
    SR --> |"Error rate OK"| AUTO["Auto-approve"]

    style S fill:#f59e0b,color:#fff
    style H fill:#ef4444,color:#fff
    style AUTO fill:#10b981,color:#fff
\`\`\`

### Aggregate Metrics Mask Problems

97% overall accuracy is meaningless if it's 99% on invoices but 70% on receipts. **Validate accuracy by document type and field segment** before automating high-confidence extractions.

### Stratified Random Sampling

Measure error rates in high-confidence extractions using **stratified random sampling**:
1. Divide extractions into segments (by doc type, field, complexity)
2. Sample from each segment
3. Measure error rate per segment
4. Detect **novel error patterns** before they spread

### Field-Level Confidence Scores

Have models output **field-level confidence scores**, then calibrate review thresholds using labeled validation sets:

\`\`\`json
{
  "vendor": {"value": "Acme Corp", "confidence": 0.95},
  "total": {"value": 1499.99, "confidence": 0.72},
  "category": {"value": "other", "confidence": 0.45}
}
\`\`\`

Route extractions with low confidence or ambiguous/contradictory source documents to human review. **Prioritize limited reviewer capacity** — not everything gets reviewed equally.

### Calibration Process

1. Run model on **labeled validation set**
2. Compare confidence scores to actual accuracy
3. Set review thresholds per field
4. Monitor drift over time

> ⚠️ **Exam trap:** Trusting aggregate accuracy without segmenting by document type/field is wrong. 97% overall can hide segment-specific failures.`,
  },
  {
    id: '5-6',
    explanation: `## Provenance & Uncertainty in Multi-Source Synthesis

When combining findings from multiple sources, source attribution is easily lost during summarization steps.

\`\`\`mermaid
flowchart LR
    S1["Source A<br/>Revenue: $5.2M<br/>(Q4 report)"] --> M["Synthesis Agent"]
    S2["Source B<br/>Revenue: $4.8M<br/>(annual filing)"] --> M
    M --> R["Report with:<br/>✅ Claim-source mappings<br/>✅ Conflict annotations<br/>✅ Temporal dates"]

    style M fill:#8b5cf6,color:#fff
    style R fill:#10b981,color:#fff
\`\`\`

### Source Attribution Lost During Summarization

When findings are compressed without preserving **claim-source mappings**, you lose traceability. "Revenue grew 8%" — according to whom?

### Structured Claim-Source Mappings

Require subagents to output structured mappings that downstream agents **preserve through synthesis**:

\`\`\`json
{
  "claim": "Revenue grew 8% YoY",
  "sources": [
    {"url": "q4-report.pdf", "excerpt": "Total revenue $5.2M, up 8% from $4.8M", "date": "2025-01-15"},
    {"url": "annual-filing.pdf", "excerpt": "Revenue $4.8M for fiscal year", "date": "2024-03-20"}
  ],
  "confidence": "high",
  "conflicts": []
}
\`\`\`

### Handling Conflicting Sources

When credible sources disagree:
- **Annotate conflicts with source attribution** — don't arbitrarily pick one value
- Include both values with their sources
- Let the coordinator decide how to reconcile

\`\`\`
❌ Average the values: ($5.2M + $4.8M) / 2 = $5.0M
✅ "Source A reports $5.2M (Q4 report, Jan 2025). Source B reports $4.8M (annual filing, Mar 2024). Difference may reflect different reporting periods."
\`\`\`

### Temporal Data

Require **publication/collection dates** in structured outputs. Different dates often explain apparent contradictions — not actual data conflicts.

### Content Type Rendering

Render different content types appropriately in synthesis outputs:
- **Financial data** → tables
- **News** → prose
- **Technical findings** → structured lists

Don't convert everything to a uniform format.

### Report Structure

Distinguish **well-established findings** from **contested ones** in explicit sections. Preserve original source characterizations and methodological context.

> ⚠️ **Exam trap:** Averaging conflicting values without source attribution is always wrong. Annotate conflicts, don't resolve them silently.`,
  },
];

export default domain5Explanations;
