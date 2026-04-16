import type { LessonExplanation } from './types';

export const domain5Explanations: LessonExplanation[] = [
  {
    id: '5-1',
    explanation: `## Testing AI Systems: Behavioral Over Exact Match

Traditional tests assume deterministic output. AI systems are probabilistic — the same input can produce different valid outputs.

\`\`\`mermaid
flowchart LR
    subgraph "Traditional Test ❌"
        A1[Input X] --> B1[Assert output == "Y"]
    end

    subgraph "AI Behavioral Test ✅"
        A2[Input X] --> B2[Assert output mentions refund policy]
        A2 --> C2[Assert output < 200 words]
        A2 --> D2[Assert no PII in output]
        A2 --> E2[Assert valid JSON structure]
    end

    style B1 fill:#ef4444,color:#fff
    style B2 fill:#10b981,color:#fff
\`\`\`

### Property-Based Testing

Instead of checking exact strings, verify **properties** of the output:

| Property | Example assertion |
|---|---|
| Contains topic | Response mentions "refund policy" |
| Length constraint | Response is under 200 words |
| Safety | Response contains no PII |
| Format | Response is valid JSON |
| Completeness | All required fields are present |

### Test Set Composition

- **Golden set**: 20-50 curated input-output pairs (domain expert curated)
- **Production sample**: Real user queries, sampled periodically
- **Adversarial set**: Edge cases and deliberate attack attempts

### Distribution Testing

Match your test set to real usage. If 80% of queries are simple and 20% complex, your test set should reflect that ratio.`,
  },
  {
    id: '5-2',
    explanation: `## Evaluation Frameworks and LLM-as-Judge

\`\`\`mermaid
flowchart TD
    G[Golden Test Set] --> R[Run prompt against all inputs]
    R --> S[Score with rubric]
    S --> J["LLM-as-Judge<br/>(cheaper model grades output)"]
    J --> D[Dashboard: accuracy, completeness, safety]
    D -->|Below threshold| A[Alert + block deployment]
    D -->|Above threshold| M[Merge + deploy]

    style J fill:#8b5cf6,color:#fff
    style D fill:#3b82f6,color:#fff
    style A fill:#ef4444,color:#fff
    style M fill:#10b981,color:#fff
\`\`\`

### Automated Evaluation with LLM-as-Judge

Use a smaller, cheaper model to grade outputs against a rubric. Fast and cheap enough to run on every change. Periodically validate with human reviewers to catch nuanced issues.

### Scoring Rubric

| Dimension | Scale | Example question |
|---|---|---|
| Accuracy | 1-5 | Is the information correct? |
| Completeness | 1-5 | Are all required aspects covered? |
| Safety | Pass/Fail | Any harmful content? |
| Tone | 1-5 | Is communication style appropriate? |

### Iteration Loop

1. Run evaluation → identify weakest areas
2. Improve prompt for those areas
3. Re-run → check for regressions elsewhere
4. Deploy only when all scores are above threshold`,
  },
  {
    id: '5-3',
    explanation: `## CI/CD for AI: Deploying Prompts Safely

\`\`\`mermaid
flowchart LR
    P[Prompt Change] --> CI[CI: Run eval suite]
    CI -->|Scores drop| X[Block merge]
    CI -->|Scores pass| ST[Staging: adversarial tests]
    ST --> CA[Canary: 5% traffic]
    CA -->|Metrics degrade| RB[Auto-rollback]
    CA -->|Metrics stable| PR[Production: 100%]

    style X fill:#ef4444,color:#fff
    style RB fill:#ef4444,color:#fff
    style PR fill:#10b981,color:#fff
\`\`\`

### Pipeline Stages

1. **Pre-commit**: Lint prompts, validate tool schemas
2. **CI**: Run evaluation suite, compare to baseline, block if scores drop
3. **Staging**: Deploy to staging, run adversarial tests, human review
4. **Canary**: Deploy to 5% of traffic, monitor real metrics
5. **Production**: Gradually increase to 100%

### Version Control for Prompts

Treat prompts like code: git, tags, changelogs. When something breaks, diff the prompt versions.

### Model Version Pinning

Anthropic updates models. The same prompt may produce different results on a new version. **Pin your model version** in production and test before upgrading.`,
  },
  {
    id: '5-4',
    explanation: `## Debugging AI Systems

\`\`\`mermaid
flowchart TD
    BUG[Reported Issue] --> REP[Reproduce with exact input]
    REP --> ISO{Isolate cause}
    ISO -->|Prompt| P[Check prompt for ambiguity]
    ISO -->|Tool| T[Check tool result quality]
    ISO -->|Context| C[Check conversation history]
    ISO -->|Model| M[Try different model]
    
    P --> FIX[Fix + regression test]
    T --> FIX
    C --> FIX
    M --> FIX

    style BUG fill:#ef4444,color:#fff
    style FIX fill:#10b981,color:#fff
\`\`\`

### Common Bug Patterns

| Bug | Cause | Fix |
|---|---|---|
| **Hallucination** | Insufficient context | Add "only use provided context" instruction |
| **Wrong tool** | Vague tool descriptions | Improve descriptions with examples |
| **Infinite loop** | Tool results lack info for Claude to answer | Improve result quality + max turn limit |
| **Context confusion** | Long history with conflicting info | Summarize or prune old context |

### Reproduction Is Everything

Capture the **full message array** (system prompt, all messages, tool definitions). Without exact reproduction, you are guessing at the fix.`,
  },
  {
    id: '5-5',
    explanation: `## Performance Optimization

\`\`\`mermaid
flowchart LR
    subgraph "Where time is spent"
        A["API call: 2-30s"]
        B["Tool execution: 0.1-10s"]
        C["Network: 0.05-0.5s"]
    end

    subgraph "Optimizations"
        D["✅ Prompt caching"]
        E["✅ Streaming"]
        F["✅ Parallel tool execution"]
        G["✅ Model tiering"]
    end

    style D fill:#10b981,color:#fff
\`\`\`

### Key Strategies

1. **Streaming**: Return tokens as they are generated. User sees first word in 1-2s instead of waiting for the full response.
2. **Parallel tools**: If Claude requests multiple independent tools, execute them simultaneously.
3. **Predictive pre-fetch**: Start fetching data before Claude requests it (application-level logic).
4. **Model tiering**: Use the smallest model that meets quality requirements.
5. **Application caching**: Cache frequent Q&A pairs.

### Latency Targets

Track p50 (median), p90, and p99. Optimize for **p99** — the slowest 1% is where users notice lag.`,
  },
  {
    id: '5-6',
    explanation: `## Production Deployment Patterns

\`\`\`mermaid
flowchart TD
    U[User Request] --> LB[Load Balancer]
    LB --> W1[Worker 1]
    LB --> W2[Worker 2]
    LB --> W3[Worker N]
    
    W1 --> Q[Request Queue]
    W2 --> Q
    W3 --> Q
    
    Q --> API[Claude API]
    
    API -->|Error| RET[Retry with backoff]
    RET -->|3x fail| FB[Fallback: cached / smaller model]
    API -->|Success| RES[Return response]

    style LB fill:#3b82f6,color:#fff
    style FB fill:#f59e0b,color:#fff
    style RES fill:#10b981,color:#fff
\`\`\`

### Reliability Patterns

| Pattern | How it works |
|---|---|
| **Retry with backoff** | Wait 1s → 2s → 4s → 8s. Most transient errors resolve quickly. |
| **Graceful degradation** | Fallback to cached response or smaller model when Claude is unavailable |
| **Health checks** | Regularly verify Claude API is reachable and fast |
| **Circuit breaker** | Stop sending requests during error spikes, retry after cooldown |

### Scalability

- **Queue-based processing**: Smooth out traffic spikes
- **Horizontal scaling**: Add more workers as traffic grows
- **Load balancing**: Distribute across multiple API keys

### Observability

Dashboards (request volume, latency, error rate, cost), distributed tracing (track one request through the full pipeline), and error tracking (group and alert on new error types).`,
  },
];

export default domain5Explanations;
