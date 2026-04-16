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
    explanation: `## JSON Mode and Structured Output

Claude naturally responds in free-form text. JSON mode guarantees the output is always valid JSON — essential for programmatic use.

\`\`\`mermaid
flowchart LR
    U[User Input] --> C[Claude + JSON mode]
    C --> P{Valid JSON?}
    P -->|Yes| D[Parse and use]
    P -->|No - rare| R[Retry with validation error]
    R --> C

    style C fill:#3b82f6,color:#fff
    style D fill:#10b981,color:#fff
\`\`\`

### How to Use JSON Mode

1. Set \`response_format\` to \`type: "json_object"\` in the API request
2. Instruct Claude in the prompt to produce JSON with specific fields
3. Claude always responds with valid JSON — no markdown wrappers, no extra text

> 💡 **The catch:** You MUST instruct Claude to produce JSON in your prompt. Without this instruction, Claude might produce an empty JSON object.

### JSON Mode vs Prompting for JSON

| Approach | Reliability |
|---|---|
| "Respond in JSON" (no mode) | ~90% — may wrap in markdown or add commentary |
| JSON mode enabled | ~100% — guaranteed valid JSON |

### Schema Enforcement

JSON mode guarantees valid JSON but does **not** guarantee a specific schema. Describe the expected structure in the prompt. For critical applications, add post-processing validation.`,
  },
  {
    id: '2-5',
    explanation: `## Computer Use Tool

Computer use lets Claude interact with graphical interfaces — clicking buttons, typing text, reading screenshots. For systems without APIs.

\`\`\`mermaid
flowchart LR
    S["Capture screen"] --> A["Claude analyzes image"]
    A --> D["Decide action: click/type/scroll"]
    D --> E["Execute action"]
    E --> L["Take new screenshot"]
    L --> S

    style S fill:#3b82f6,color:#fff
    style A fill:#8b5cf6,color:#fff
    style D fill:#f59e0b,color:#fff
    style E fill:#10b981,color:#fff
    style L fill:#64748b,color:#fff
\`\`\`

### Tools Available

| Tool | What it does |
|---|---|
| \`computer\` | Screenshot, mouse move, click, type, scroll |
| \`text_editor\` | Read and edit text files |
| \`bash\` | Run shell commands |

### Use Cases and Limitations

- ✅ Automating legacy systems without APIs
- ✅ UI testing across browsers
- ⚠️ Slow — every action requires a screenshot and API call
- ⚠️ Expensive — image processing costs more tokens
- ⚠️ Not real-time — delay between decision and execution

> 💡 Always run computer use in a **sandboxed environment** (VM or container). Claude might click the wrong button or navigate to unexpected places.

### Multi-Step UI Automation

For multi-step workflows (fill form → submit → verify), maintain a **state tracker** that records which step you are on. If Claude makes a mistake, the tracker lets you retry from the last successful step instead of starting over.`,
  },
  {
    id: '2-6',
    explanation: `## MCP: Model Context Protocol

MCP standardizes how AI models connect to external tools and data. Think of it like **USB for AI** — one connector standard for everything.

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

| Type | Description | Example |
|---|---|---|
| **Tools** | Functions the AI can call | search_files, query_database |
| **Resources** | Data the AI can read | file contents, DB records |
| **Prompts** | Pre-written prompt templates | "Review this code for bugs" |

### Tool Search (Dynamic Loading)

Instead of loading ALL tools at once, use **ToolSearch** to find relevant tools on-demand. This reduces the token cost of tool definitions in every request.

### Creating Custom MCP Servers

Define tools with clear names and descriptions, implement execution logic, and the MCP framework handles the communication protocol. Any AI that supports MCP can immediately use your tools.`,
  },
];

export default domain2Explanations;
