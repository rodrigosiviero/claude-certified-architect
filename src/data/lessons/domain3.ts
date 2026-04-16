import type { LessonExplanation } from './types';

export const domain3Explanations: LessonExplanation[] = [
  {
    id: '3-1',
    explanation: `## Prompt Engineering Best Practices

Prompt engineering is clear communication with Claude. Vague instructions = vague output. Precise instructions = precise output.

\`\`\`mermaid
flowchart LR
    subgraph Bad Prompt
        A1["Fix this code"] --> R1[Unclear what to fix]
    end
    subgraph Good Prompt
        A2["Fix this Python function<br/>so it handles None inputs<br/>without changing return type<br/>Keep under 20 lines<br/>Include docstrings"] --> R2[Exact output needed]
    end

    style A1 fill:#ef4444,color:#fff
    style A2 fill:#10b981,color:#fff
\`\`\`

### Five Principles

1. **Be specific** — "Summarize in 3 bullet points, each under 20 words, focusing on financial metrics"
2. **Provide context** — "Fix this function so it handles None inputs gracefully without changing the return type"
3. **Show examples** — One example is worth a thousand words of instruction
4. **Define output format** — If you need JSON, say so. If you need numbered list, say so
5. **Set constraints** — "Under 20 lines, standard library only, include docstrings"

### System Prompt vs User Message

| | System prompt | User message |
|---|---|---|
| **Purpose** | Who Claude is, permanent rules | The specific task for this turn |
| **Analogy** | Job description | Daily assignment |
| **Persists** | Every turn in the session | Only this turn |

### Common Anti-Patterns

- "Act as an expert" — unnecessary role-play. Be direct about the task.
- Very long system prompts with conflicting instructions — Claude gets confused.
- Burying important constraints in a wall of text — put critical instructions first and last.

### CLAUDE.md Files

CLAUDE.md is a special file that provides project context. It is loaded at session start and included in every request (but prompt-cached, so only the first request pays full cost). Use it for project-specific instructions, coding conventions, and architectural decisions.`,
  },
  {
    id: '3-2',
    explanation: `## RAG: Retrieval-Augmented Generation

Claude does not know about your company documents, codebase, or recent events. RAG finds relevant information and injects it into the conversation.

\`\`\`mermaid
flowchart LR
    D[Documents] -->|Split & embed| V[Vector DB]
    Q[User Query] -->|Embed| S[Similarity Search]
    V --> S
    S -->|Top K chunks| C[Claude + retrieved context]
    C --> A[Grounded answer]

    style V fill:#8b5cf6,color:#fff
    style S fill:#f59e0b,color:#fff
    style C fill:#3b82f6,color:#fff
\`\`\`

### Why Not Dump Everything Into the Prompt?

A large codebase might be 10M tokens. Claude context window is 200K. Even if it all fit, Claude would waste attention on irrelevant information. RAG is a **librarian** that finds the right book chapters before Claude starts reading.

### Chunking Strategies

| Strategy | How | Trade-off |
|---|---|---|
| **Fixed-size** | Split every 500 tokens | Simple, might cut mid-sentence |
| **Semantic** | Split at natural boundaries | Better quality, more complex |
| **Overlapping** | Each chunk overlaps by 50-100 tokens | Prevents losing context at boundaries |

### Relevance Threshold

Not every retrieved chunk is actually relevant. Set a similarity score threshold (e.g., 0.7) and only include chunks above it. Irrelevant context confuses Claude and wastes tokens.`,
  },
  {
    id: '3-3',
    explanation: `## Context Window Management

The context window is Claude's short-term memory — the maximum text processed in a single request.

\`\`\`mermaid
graph LR
    subgraph "Context Budget (200K tokens)"
        SP["System Prompt<br/>1-5K"]
        TD["Tool Defs<br/>1-10K"]
        RC["RAG Context<br/>10-50K"]
        CH["Conversation History<br/>GROWS every turn"]
        CR["Claude Response<br/>1-4K"]
    end

    CH -->|Turn 50| OVER["⚠️ 100K+ tokens!"]

    style SP fill:#3b82f6,color:#fff
    style CH fill:#f59e0b,color:#fff
    style OVER fill:#ef4444,color:#fff
\`\`\`

### Token Math

1 token ≈ 4 characters ≈ 0.75 words. Tool results are often the biggest consumers — a single API response can be 10K+ tokens.

### When Context Gets Too Long

- **Summarize old turns** — Replace history with a compact summary
- **Prune tool results** — Truncate large results before adding to conversation
- **Selective retention** — Keep system prompt + last K messages, drop the middle
- **External state** — Store data in a database, pass only IDs in conversation

### Automatic Compaction

The Agent SDK automatically compacts context when it grows too large. The PreCompact hook lets you archive the full transcript before summarization happens.`,
  },
  {
    id: '3-4',
    explanation: `## Document Processing for RAG

Raw documents are messy. Before Claude can use them, you need to clean, structure, and chunk them properly.

\`\`\`mermaid
flowchart LR
    R[Raw Document] --> E[Extract text]
    E --> C[Clean boilerplate]
    C --> S[Structure: headings, tables, lists]
    S --> K[Chunk for embedding]
    K --> M[Add metadata: source, page, section]
    M --> V[Vector DB]

    style R fill:#ef4444,color:#fff
    style V fill:#10b981,color:#fff
\`\`\`

### Why Cleaning Matters

A raw HTML page might be 50% navigation links and ads. After cleaning, the useful content is 5x more concentrated. Claude wastes fewer tokens on noise.

### Table and Image Handling

- Tables: Extract to markdown or CSV format, keep headers visible
- Images: Keep figure captions close to their text references
- Multi-document: Include source metadata so Claude knows where each chunk came from`,
  },
  {
    id: '3-5',
    explanation: `## Prompt Evaluation Frameworks

You cannot improve what you cannot measure. Systematic evaluation quantifies prompt quality.

\`\`\`mermaid
flowchart TD
    T[Test Set: 20-50 examples] --> R[Run current prompt]
    R --> S[Score against rubric]
    S --> I[Identify weak areas]
    I --> P[Improve prompt for weak areas]
    P --> R2[Re-run evaluation]
    R2 --> C{Regressions?}
    C -->|Yes| X[Revert + try different approach]
    C -->|No| D[Deploy new prompt]

    style T fill:#3b82f6,color:#fff
    style S fill:#f59e0b,color:#fff
    style D fill:#10b981,color:#fff
\`\`\`

### Test Dataset Types

| Dataset | Size | Purpose |
|---|---|---|
| **Golden set** | 20-50 | Curated by domain experts, high quality |
| **Production sample** | 1000+ | Real user queries, shows real performance |
| **Adversarial set** | 10-20 | Edge cases and attack attempts |

### Key Metrics

- **Accuracy**: Is the information correct?
- **Relevance**: Does it address the actual question?
- **Completeness**: Does it cover all required aspects?
- **Safety**: Does it avoid harmful content?
- **Consistency**: Same input → similar quality output?

### A/B Testing

Change one thing at a time. Run both versions against the same test set. Measure the difference. Never change multiple things simultaneously.`,
  },
  {
    id: '3-6',
    explanation: `## Chain of Thought and Extended Thinking

CoT asks Claude to reason step-by-step before giving a final answer. This improves accuracy on complex tasks and makes reasoning transparent.

\`\`\`mermaid
flowchart LR
    Q[Complex Question] --> C[Think step by step]
    C --> S1["Step 1: Identify relevant facts"]
    S1 --> S2["Step 2: Apply rules"]
    S2 --> S3["Step 3: Calculate"]
    S3 --> A[Final Answer]

    Q2[Same Question] --> D[Direct answer]
    D --> A2[Often wrong on complex tasks]

    style A fill:#10b981,color:#fff
    style A2 fill:#ef4444,color:#fff
\`\`\`

### When CoT Is Essential vs Unnecessary

| Use CoT | Skip CoT |
|---|---|
| Multi-step reasoning (math, legal) | Simple classification (sentiment) |
| Tasks where process matters | Creative tasks (writing) |
| Debugging (see where Claude went wrong) | Speed-critical responses |

### Extended Thinking

Claude has built-in **extended thinking** mode — a hidden chain of thought before responding. More powerful than prompting for CoT because Claude can think longer without visible token limits. Use for complex reasoning tasks.

### Budget Tokens

Extended thinking uses \`budget_tokens\` — the maximum tokens Claude can spend on internal reasoning. Higher budget = better reasoning on hard problems, but costs more and takes longer.`,
  },
];

export default domain3Explanations;
