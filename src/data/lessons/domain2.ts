import type { LessonExplanation } from './types';

export const domain2Explanations: LessonExplanation[] = [
  {
    id: '2-1',
    explanation: `## Tool Use Definitions and Best Practices

A tool is a function you define with a **name**, **description**, and **input_schema**. Claude reads these definitions and decides which tool to call, with what parameters.

\`\`\`mermaid
flowchart LR
    D[Tool Definition] -->|name| N["get_weather"]
    D -->|description| DESC["Get current weather for a city"]
    D -->|input_schema| S["{city: string, unit: celsius|fahrenheit}"]
    N --> C[Claude reads + decides]
    DESC --> C
    S --> C
    C --> R["tool_use: get_weather(city=SF)"]

    style D fill:#3b82f6,color:#fff
    style C fill:#f59e0b,color:#fff
    style R fill:#10b981,color:#fff
\`\`\`

### Writing Effective Tool Descriptions

The description is what Claude reads to decide which tool to pick. Vague descriptions = wrong tool picks.

- ❌ \`"Gets customer data"\`
- ✅ \`"Retrieves full customer profile including name, email, and order history. Requires a valid customer ID string (format: CUS-XXXXX). Returns null if customer not found."\`

### Multiple Tools in One Response

Claude can request **several tools simultaneously**. If it needs the weather AND the calendar, it requests both at once. Execute ALL of them and return ALL results — do not pick just one.

### Tool Execution Is YOUR Job

Claude **never runs the tool**. Claude returns a structured request. Your code parses it, calls the actual function, and sends the result back. This separation means Claude cannot accidentally delete your database — you control what gets executed.

### Token Cost of Tool Definitions

Every tool definition is sent with every API request. More tools = more input tokens. Use MCP tool search to load tools on-demand instead of all at once.`,
  },
  {
    id: '2-2',
    explanation: `## Function Calling Mechanics and Error Handling

Function calling is the API mechanism that makes tool use work. Understanding the message format is essential for debugging.

\`\`\`mermaid
sequenceDiagram
    participant Your Code
    participant Claude API
    
    Your Code->>Claude API: messages + tools + system prompt
    Claude API-->>Your Code: response with tool_use block (stop_reason: "tool_use")
    Note over Your Code: Execute tool locally
    Your Code->>Claude API: messages + tool_result (matching tool_use_id)
    Claude API-->>Your Code: Final text response (stop_reason: "end_turn")
\`\`\`

### The Message Roles

| Role | What it contains |
|---|---|
| \`user\` | What the human says |
| \`assistant\` | Claude response (can contain text AND tool_use blocks) |
| \`user\` (tool_result) | The result of executing a tool (references tool_use ID) |

### Tool Use IDs Must Match

Each tool_use block has a unique ID (e.g., \`"toolu_abc123"\`). Your tool_result **MUST** reference this exact ID. Mismatched IDs cause errors.

### Error Handling

When a tool fails, still send a tool_result with \`is_error: true\`. Claude sees the error and tries a different approach. Tool errors are not fatal — they are information.

### Forcing Tool Use with tool_choice

| Value | Behavior |
|---|---|
| \`auto\` | Claude decides (default) |
| \`any\` | Claude MUST call at least one tool |
| \`tool\` | Claude MUST call a specific named tool |
| \`none\` | Claude must NOT call any tools |

Use \`tool\` when you know exactly what needs to happen. Use \`auto\` for most cases.`,
  },
  {
    id: '2-3',
    explanation: `## Prompt Caching for Performance

Every API call processes the ENTIRE conversation from scratch. Prompt caching lets the API **reuse unchanged content** — faster and cheaper.

\`\`\`mermaid
flowchart LR
    subgraph Without Caching
        A1[System Prompt 5K] --> P1[Process all]
        A2[Tools 3K] --> P1
        A3[History 20K] --> P1
        P1 --> C1[28K input tokens every call]
    end

    subgraph With Caching
        B1["System Prompt 5K ✅ cached"] --> P2[Process only new]
        B2["Tools 3K ✅ cached"] --> P2
        B3[New message 1K] --> P2
        P2 --> C2["1K fresh + 8K cached = much cheaper"]
    end

    style P1 fill:#ef4444,color:#fff
    style P2 fill:#10b981,color:#fff
\`\`\`

### What to Cache

- **System prompts**: Almost never change. Always cache.
- **Tool definitions**: Change rarely. Cache them.
- **Long reference documents**: Cache.
- **Recent conversation turns**: Do NOT cache — they change every turn.

### Cache Lifetime

Caches expire after **5 minutes** of no use. For high-frequency agents the cache stays warm. For agents with long pauses between turns, the cache may expire.

### The Breakeven

Caching costs slightly more on the first request (cache write). Subsequent requests with the same content cost about **90% less** for those tokens. If making more than 2 requests with the same system prompt, caching saves money.`,
  },
  {
    id: '2-4',
    explanation: `## MCP Server Integration

MCP (Model Context Protocol) standardizes how AI models connect to external tools and data. Think of it like **USB for AI** — one connector standard for everything.

\`\`\`mermaid
flowchart TB
    H[MCP Host<br/>Your AI App] --> C[MCP Client]
    C <-->|stdio| S1[GitHub MCP Server]
    C <-->|HTTP/SSE| S2[Database MCP Server]
    C <-->|stdio| S3[Filesystem MCP Server]
    
    S1 -->|tools| T1["create_issue, list_prs"]
    S2 -->|tools| T2["query, insert"]
    S3 -->|resources| T3["read_file, list_dir"]

    style H fill:#3b82f6,color:#fff
    style C fill:#f59e0b,color:#fff
\`\`\`

### MCP Architecture

- **Host**: The AI application (Claude Desktop, your custom app)
- **Client**: Built into the host, manages connections
- **Server**: Lightweight process exposing tools, resources, and prompts
- **Transport**: stdio (local) or HTTP/SSE (remote)

### What MCP Servers Expose

| Type | Purpose | Example |
|---|---|---|
| **Tools** | Actions — *do something* | search_files, query_database |
| **Resources** | Data — *read something* | file contents, DB records |
| **Prompts** | Templates — *reusable* | "Review this code for bugs" |

### Configuration

Configure MCP servers via \`.mcp.json\` with \`\${ENV_VAR}\` for secrets — **never hardcode** API keys or credentials.

\`\`\`json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": { "GITHUB_TOKEN": "\${GITHUB_TOKEN}" }
    }
  }
}
\`\`\`

### Transport Types

| Transport | Use case | Characteristics |
|---|---|---|
| **stdio** | Local dev, most common | Process on same machine, fast |
| **HTTP/SSE** | Remote/shared servers | Team-accessible, requires network |

### Key Behaviors

- **Runtime capability discovery** — Claude learns available tools at startup, no hardcoding needed
- **Server capabilities are advertised on connection** — Claude adapts dynamically
- **MCP servers are isolated** — they don't share state with each other
- **Multiple MCP servers can coexist** — each contributes its own tools/resources

> 💡 **Exam tip:** Know the difference between Tools (actions), Resources (data), and Prompts (templates). This is a common question pattern.`,
  },
  {
    id: '2-5',
    explanation: `## Built-in Tool Selection

Claude Code comes with built-in tools for file operations and command execution. Knowing when to use each is critical for the exam.

\`\`\`mermaid
flowchart LR
    Q[Task] --> R{What to do?}
    R -->|Read file| Read["Read tool<br/>✅ Always safe"]
    R -->|Search code| Grep["Grep/Glob<br/>✅ Zero side effects"]
    R -->|Modify file| Edit["Edit tool<br/>⚠️ Caution tier"]
    R -->|New file| Write["Write tool<br/>⚠️ Caution tier"]
    R -->|Run command| Bash["Bash tool<br/>🔴 Confirm tier"]

    style Read fill:#10b981,color:#fff
    style Grep fill:#10b981,color:#fff
    style Edit fill:#f59e0b,color:#fff
    style Write fill:#f59e0b,color:#fff
    style Bash fill:#ef4444,color:#fff
\`\`\`

### The Built-in Tools

| Tool | Purpose | Safety Tier |
|---|---|---|
| **Read** | View file contents | 🟢 Free — always allowed, no side effects |
| **Write** | Create new files or overwrite entirely | 🟡 Caution — use for fresh files |
| **Edit** | Surgical modifications to existing files | 🟡 Caution — requires search pattern |
| **Bash** | Run arbitrary shell commands | 🔴 Confirm — most powerful, most dangerous |
| **Grep** | Search file contents by pattern | 🟢 Free — zero side effects |
| **Glob** | Find files by name pattern | 🟢 Free — zero side effects |
| **LS** | List directory contents | 🟢 Free — read-only exploration |

### Critical Rules

1. **Always Read before Edit** — you need to know what's in the file first
2. **Edit for modifications, Write for new files** — don't overwrite entire files when you only need to change a line
3. **Bash is the nuclear option** — it can do anything, including destructive operations

### Safety Tiers in Practice

\`\`\`
Free tier:    Read, Grep, Glob, LS     →  No approval needed
Caution tier: Write, Edit              →  Requires review
Confirm tier: Bash                     →  Requires explicit approval
\`\`\`

> ⚠️ **Exam trap:** Questions will try to trick you into using Write when Edit is correct (or vice versa). Remember: **Edit = modify existing, Write = create new or full overwrite.**`,
  },
  {
    id: '2-6',
    explanation: `## Tool Search

When you have many tools available, Claude uses **embedding-based semantic selection** to pick the right ones — NOT keyword matching.

\`\`\`mermaid
flowchart LR
    Q[User Query] --> E[Embed query]
    T[Tool Catalog] --> TE[Embed tool descriptions]
    E --> S[Similarity comparison]
    TE --> S
    S --> Top["Select top 4-5 tools"]
    Top --> R["Re-rank by similarity × frequency"]

    style Q fill:#3b82f6,color:#fff
    style S fill:#8b5cf6,color:#fff
    style Top fill:#10b981,color:#fff
    style R fill:#f59e0b,color:#fff
\`\`\`

### How Tool Search Works

1. **Pre-compute tool embeddings** from tool descriptions — do this offline, not at query time
2. **Embed the user's query** in the same vector space
3. **Compare similarity** and select the top 4-5 tools per request
4. **Re-rank** by combining semantic similarity with usage frequency

### Why Embeddings, Not Keywords?

| Approach | Problem |
|---|---|
| Keyword search | Misses synonyms, context, and intent |
| Embedding search | Captures meaning, not just words |

**Example:** Query "delete my account" → keyword search might miss \`archive_user\` tool. Embeddings understand "delete" ≈ "archive" in this context.

### Key Guidelines

- **Tool descriptions feed the embeddings** — better descriptions = better search results
- **For small catalogs (<10 tools)**, search isn't needed — Claude handles them all
- **Monitor tool selection accuracy** to tune your embedding model over time
- **Pre-compute embeddings for speed** — computing at query time adds latency

> 💡 **Exam tip:** The exam emphasizes that tool selection is **semantic** (embedding-based), not **lexical** (keyword-based). This distinction comes up frequently.`,
  },
];

export default domain2Explanations;
