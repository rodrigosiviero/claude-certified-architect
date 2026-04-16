import type { LessonExplanation } from './types';

export const domain4Explanations: LessonExplanation[] = [
  {
    id: '4-1',
    explanation: `## Guardrails: Defense in Depth

Guardrails prevent Claude from going off the rails — hallucinating, leaking PII, executing harmful actions, or going off-topic.

\`\`\`mermaid
flowchart TD
    U[User Message] --> I{Input Guardrail}
    I -->|Block| X1["Return: policy violation"]
    I -->|Allow| C[Claude API]
    C --> O{Output Guardrail}
    O -->|PII found| R[Redact sensitive data]
    O -->|Harmful| X2["Block response"]
    O -->|Safe| F[Show to user]
    
    C -->|tool_use| T{Tool Guardrail / Hook}
    T -->|Dangerous| X3["Block execution"]
    T -->|Safe| E[Execute tool]

    style I fill:#ef4444,color:#fff
    style O fill:#f59e0b,color:#fff
    style T fill:#8b5cf6,color:#fff
    style F fill:#10b981,color:#fff
\`\`\`

### Three Layers of Guardrails

| Layer | When | What it catches |
|---|---|---|
| **Input** | Before Claude sees the message | Off-topic requests, policy violations, prompt injection |
| **Output** | After Claude responds, before user sees | PII leakage, harmful content, hallucinations |
| **Tool** (Hooks) | Before/after tool execution | Dangerous operations, sensitive data in results |

### Implementation Approaches

- **Regex-based**: Fast, cheap, catches obvious patterns. Easy to bypass.
- **Classifier-based**: Lightweight model classifies content. More nuanced.
- **Claude-based**: Use a smaller Claude call to check safety. Most accurate, most expensive.

### Defense in Depth

No single guardrail is perfect. Layer them: input catches 80%, output catches 15% more, tool hooks catch the remaining 5%. **Fail-safe defaults** — when a guardrail triggers, block and explain, never silently allow.`,
  },
  {
    id: '4-2',
    explanation: `## Content Filtering Strategies

Content filtering is a specific output guardrail focused on preventing inappropriate content.

### What to Filter

| Category | Examples |
|---|---|
| **PII** | SSN, credit cards, email addresses |
| **Harmful content** | Violence, self-harm, illegal activities |
| **Confidential** | Trade secrets, internal APIs |
| **Off-topic** | Medical advice from a cooking bot |

### Redaction vs Blocking vs Regeneration

| Strategy | When to use |
|---|---|
| **Redaction** | Replace PII with [REDACTED], show rest. Most of response is fine. |
| **Blocking** | Do not show response at all. Entire response is problematic. |
| **Regeneration** | Ask Claude to try again with filter feedback. Issue is minor. |

### Prompt Injection Prevention

The biggest threat. An attacker includes malicious instructions in user input that Claude follows instead of your system prompt.

**Prevention:**
- Separate user input from instructions (distinct message roles)
- Never put user input in the system prompt
- Validate and sanitize all user input
- Use output guardrails to detect leaked system information`,
  },
  {
    id: '4-3',
    explanation: `## Rate Limiting and Circuit Breakers

\`\`\`mermaid
flowchart TD
    R[Incoming Request] --> L{Rate Limit Check}
    L -->|Under limit| P[Process normally]
    L -->|Over limit| Q{Circuit Breaker State}
    Q -->|Closed| C[Queue request]
    Q -->|Open| X[Return 429 + Retry-After]
    Q -->|Half-Open| T[Try one request]
    T -->|Success| P
    T -->|Fail| X

    style L fill:#f59e0b,color:#fff
    style X fill:#ef4444,color:#fff
    style P fill:#10b981,color:#fff
\`\`\`

### Types of Limits

| Limit Type | Scope | Example |
|---|---|---|
| **Per-user** | X requests/minute per user | Prevents one user from hogging |
| **Per-session** | X turns per conversation | Prevents infinite loops |
| **Global** | Total QPM for your app | Prevents API key suspension |
| **Token-based** | X tokens per time window | More precise than request count |

### Circuit Breaker Pattern

If error rate spikes, **stop sending requests temporarily**. After cooldown, try again. Prevents cascade failures.

### Graceful Degradation

When limits are hit: queue the request, return cached response, or downgrade to a cheaper model. Never just show an error.`,
  },
  {
    id: '4-4',
    explanation: `## Cost Optimization Strategies

\`\`\`mermaid
flowchart LR
    subgraph "Token Cost Formula"
        I[Input Tokens x Price] --> T[Total Cost]
        O[Output Tokens x Price] --> T
    end

    subgraph "Biggest Savings"
        S1["✅ Prompt caching"]
        S2["✅ Tiered models"]
        S3["✅ Context pruning"]
        S4["✅ App-level caching"]
    end

    style S1 fill:#10b981,color:#fff
    style S2 fill:#10b981,color:#fff
\`\`\`

### Tiered Model Selection

Not every task needs the best model:

| Task type | Model tier |
|---|---|
| Complex reasoning, multi-step agents | Best (Sonnet/Opus) |
| Classification, extraction, Q&A | Light (Haiku) |
| Guardrails, content filtering | Cheapest that meets accuracy |

### Application-Level Caching

If multiple users ask "What is your return policy?", answer from cache, not from a new API call every time.`,
  },
  {
    id: '4-5',
    explanation: `## Security Best Practices

\`\`\`mermaid
flowchart TD
    A[Attacker] -->|Prompt injection| B{Input Validation}
    A -->|Data extraction| C{Access Controls}
    A -->|Tool misuse| D{PreToolUse Hooks}
    
    B -->|Block| E[Blocked + logged]
    C -->|Deny| E
    D -->|Block| E

    B -->|Pass| F[Claude + sanitized input]
    C -->|Allow| F
    D -->|Allow| G[Execute with least privilege]

    style E fill:#ef4444,color:#fff
    style F fill:#3b82f6,color:#fff
    style G fill:#10b981,color:#fff
\`\`\`

### Three Main Threats

1. **Prompt injection** — Malicious instructions in user input. Prevent: input validation, output guardrails.
2. **Data exfiltration** — Tricking Claude into extracting sensitive data. Prevent: least privilege, access controls.
3. **Tool misuse** — Tricking Claude into executing harmful actions. Prevent: hooks, human confirmation.

### Principle of Least Privilege

Give Claude access to only what it needs. If it only reads customer names, do not give it access to the entire customer table including SSNs.`,
  },
  {
    id: '4-6',
    explanation: `## Logging and Monitoring

\`\`\`mermaid
flowchart LR
    subgraph What to Log
        A[API calls: tokens, latency, cost]
        B[Tool executions: params, results]
        C[User interactions: messages, feedback]
    end

    subgraph Metrics
        D[Quality: hallucination rate, completion rate]
        E[Performance: response time, turns/session]
        F[Cost: per session, per user, total]
    end

    A --> G[Dashboard + Alerts]
    B --> G
    C --> G
    D --> G
    E --> G
    F --> G

    style G fill:#3b82f6,color:#fff
\`\`\`

### Alert On Anomalies

- Sudden token spike → possible attack or bug
- Error rate increase → API or downstream issues
- Hallucination rate increase → prompt or model problem

### Privacy in Logs

Logs contain user data. Encrypt at rest, control access, define retention policies (auto-delete after 90 days).`,
  },
];

export default domain4Explanations;
