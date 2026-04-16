import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronRight, CheckCircle2, Circle, Code, BookOpen, FlaskConical, ArrowRight, AlertTriangle, Lightbulb, ExternalLink , Brain } from 'lucide-react';
import { useCourse } from '../context/CourseContext';
import DomainQuiz from '../components/DomainQuiz';
import MindMap from '../components/MindMap';
import { domain2MindMap } from '../data/mindMaps';
import domain2Quiz from '../data/quizzes/domain2';
import domain2QuickRef from '../data/quickRefs/domain2';
import QuickRef from '../components/QuickRef';
import { domain2Explanations } from '../data/lessons';
import LessonContent from '../components/LessonContent';
import NotesFab from '../components/NotesFab';

const lessons = [
  {
    id: '2-1',
    title: 'Effective Tool Interfaces',
    duration: '45 min',
    description: 'Design tool descriptions that Claude can reliably select. Tool descriptions are the #1 lever for accurate tool use — more impactful than few-shot examples or system prompt instructions. This is the foundation of everything in Domain 2.',
    knowledge: [
      'Tool descriptions are the PRIMARY mechanism for tool selection. Claude reads them to decide which tool to call. If your descriptions are vague, Claude will call the wrong tool — period.',
      'Effective descriptions include: (1) clear purpose statement, (2) input format with examples, (3) edge cases and what happens, (4) differentiation from similar tools, and (5) "when NOT to use" guidance.',
      'Vague descriptions cause misrouted calls. Example: "Searches for things" is useless. "Searches customer orders by order ID (ORD-XXXXX format) or email. Returns order details including items, status, and tracking. Use this — not search_products — when a customer mentions an order." is excellent.',
      'The Anthropic recommendation: invest 60% of your tool design time on descriptions. This is not an exaggeration — description quality has a larger impact on accuracy than any other factor.',
      'Input schemas should include description fields with examples. Claude reads the schema description to understand what format to use. A date field should say: Accepted formats: ISO 8601 ("2025-03-15"), relative ("today", "yesterday"), or natural language ("March 15th"). Defaults to today.',
      'The "when NOT to use" pattern: explicitly tell Claude which situations call for a DIFFERENT tool. This prevents the most common tool routing error — calling search_orders when the user wants to search_products.',
      'Edge cases in descriptions: what happens if no results are found? What if the input is ambiguous? What if the service is down? Claude handles these much better when the description explains expected behavior.',
      'Natural language descriptions outperform terse technical ones. "Processes a full refund for an order. The amount must match or be less than the original order total. For partial refunds, use partial_refund instead." teaches Claude more than "Refunds an order."',
    ],
    skills: [
      'Write tool descriptions that a newcomer could understand',
      'Include "when NOT to use" guidance in every tool description',
      'Add examples to input schema descriptions',
      'Differentiate similar tools explicitly in descriptions',
    ],
    codeExample: `// ❌ BAD: Vague descriptions cause wrong tool calls
const badTools = [
  {
    name: "search",
    description: "Search for things",
    input_schema: {
      type: "object",
      properties: {
        query: { type: "string" }
      }
    }
  },
  {
    name: "get_info",
    description: "Get information",
    input_schema: {
      type: "object",
      properties: {
        id: { type: "string" }
      }
    }
  }
];
// Claude has NO idea which one to call for "find my order"

// ✅ GOOD: Rich descriptions enable reliable selection
const goodTools = [
  {
    name: "search_orders",
    description: \`Search customer orders. Returns order details including
items purchased, current status, and tracking number.

Use this when the customer mentions: order, tracking, delivery,
"where is my package", refund status, or anything order-related.

Do NOT use for: product searches (use search_products),
customer lookups (use lookup_customer), or inventory checks.

Supports filtering by:
- order_id: exact match (format: ORD-XXXXX)
- email: customer email (partial match supported)
- status: pending | shipped | delivered | cancelled
- date_range: last 7 days, last 30 days, or custom range\`,
    input_schema: {
      type: "object",
      properties: {
        order_id: {
          type: "string",
          description: \`Order ID in ORD-XXXXX format.
Example: "ORD-12345". Use for exact order lookup.\`
        },
        email: {
          type: "string",
          description: \`Customer email for order search.
Example: "john@example.com". Returns all orders for this customer.\`
        },
        status: {
          type: "string",
          enum: ["pending", "shipped", "delivered", "cancelled"],
          description: "Filter by order status. Omit to return all statuses."
        },
        date_range: {
          type: "string",
          description: \`Date range for search.
Accepted values: "last_7_days", "last_30_days",
or custom format "YYYY-MM-DD:YYYY-MM-DD".
Defaults to "last_30_days" if omitted.\`
        }
      }
    }
  },
  {
    name: "search_products",
    description: \`Search product catalog. Returns product name, price,
availability, and specifications.

Use this when the customer asks about: product features,
pricing, availability, comparisons, or recommendations.

Do NOT use for: order lookups (use search_orders),
customer info (use lookup_customer).\`,
    input_schema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: \`Product search query. Supports natural language.
Examples: "wireless headphones under 50",
"laptop with 16GB RAM", "running shoes size 10"\`
        },
        category: {
          type: "string",
          description: "Product category filter (optional)"
        }
      },
      required: ["query"]
    }
  }
];

// The difference in practice:
// User: "Where is my order?"
// Bad tools: Claude guesses "search" or "get_info" — 50/50
// Good tools: Claude confidently calls search_orders — 99%+

// Real exam scenario: You have 3 tools for a customer service bot.
// How do you ensure Claude picks the right one?
// Answer: Rich descriptions with "use this when..." and "do NOT use for..."
// This is MORE effective than adding few-shot examples to the system prompt.`,
    antiPatterns: [
      {
        pattern: 'Sparse one-liner descriptions',
        problem: '"Search for things" gives Claude zero signal for routing. Claude will guess, and guesses wrong ~40% of the time with vague descriptions.',
      },
      {
        pattern: 'No differentiation between similar tools',
        problem: 'When two tools overlap (search_orders vs search_products), without explicit "Do NOT use for..." guidance, Claude picks randomly between them.',
      },
      {
        pattern: 'Terse schema descriptions',
        problem: 'A date field described as just "Date string" forces Claude to guess the format. Include accepted formats, examples, and defaults.',
      },
    ],
    keyConcepts: [
      { concept: 'Description-first design', description: 'Spend 60% of tool design time on descriptions. This single investment has the highest ROI for tool selection accuracy.' },
      { concept: '"When NOT to use" pattern', description: 'Explicitly listing what a tool does NOT handle prevents the most common routing errors.' },
      { concept: 'Schema descriptions', description: 'Each property in input_schema should have a description field with format hints and examples.' },
      { concept: 'Natural language > technical', description: '"Processes a full refund for an order" beats "Executes refund operation on order entity" for Claude comprehension.' },
    ],
    resources: [
      { label: 'Tool Use Best Practices (Official Docs)', url: 'https://docs.anthropic.com/en/docs/build-with-claude/tool-use' },
      { label: 'Tool Choice Documentation', url: 'https://docs.anthropic.com/en/docs/build-with-claude/tool-use#controlling-claudes-tool-use' },
    ],
    examTips: [
      'If an exam question asks "how to improve tool selection accuracy", the answer is almost always "improve tool descriptions" — not system prompts, not few-shot examples.',
      'The "when NOT to use" pattern is specifically tested. Know that it prevents routing confusion.',
      'Schema description fields with examples are a key differentiator between good and bad tool design.',
    ],
  },
  {
    id: '2-2',
    title: 'Structured Error Responses',
    duration: '40 min',
    description: 'Design error responses that enable Claude to recover intelligently instead of giving up or making wrong assumptions. The difference between "error: something went wrong" and a structured error with recovery hints is the difference between a working agent and a broken one.',
    knowledge: [
      'Silent failures are the #1 reliability killer in agent systems. Returning [] on error makes Claude think "no results found" instead of "the search failed" — these are completely different situations that demand completely different responses.',
      'The MCP isError flag: when a tool fails, it should return { content: [{ type: "text", text: "error description" }], isError: true }. This signals Claude that something went wrong, not that the operation succeeded with empty results.',
      'Without isError, Claude sees a normal tool result and may draw wrong conclusions. For example, if search_orders returns [] on a database timeout, Claude might tell the customer "you have no orders" — which is incorrect.',
      'Error categories guide recovery: "transient" (retry after a delay), "validation" (fix the input), "permission" (auth issue), "not_found" (resource doesn\'t exist), "rate_limit" (back off and retry). Claude can use these to decide what to do next.',
      'Include recovery suggestions: "The database timed out. Try again in 2 seconds." is actionable. "Error" is not. Claude can relay recovery suggestions to the user or automatically retry with the suggested approach.',
      'Anti-pattern: returning empty results on error. This is the most common and dangerous mistake. An empty array looks like success to Claude. Always use isError: true for actual failures.',
      'Anti-pattern: generic error messages. "Something went wrong" gives Claude zero information for recovery. Be specific: "Database connection timed out after 5 seconds. The customer record may exist but could not be retrieved."',
      'The structured error pattern: { isError: true, errorType: "transient", message: "specific description", suggestion: "what to try next" }. This gives Claude everything it needs to recover or inform the user.',
    ],
    skills: [
      'Return isError: true with error category for all tool failures',
      'Distinguish "no results" from "search failed" in every tool',
      'Include recovery suggestions in error responses',
      'Never return empty results when the operation actually failed',
    ],
    codeExample: `// ❌ BAD: Silent failure — Claude can't tell success from error
async function searchOrders(params) {
  try {
    const results = await db.query('SELECT * FROM orders WHERE ...');
    return results;  // Returns [] if no results OR if query is slow
  } catch (error) {
    return [];  // Claude thinks "no orders found" — WRONG!
  }
}

// ❌ BAD: Generic error — no recovery possible
async function searchOrders(params) {
  try {
    return await db.query('SELECT * FROM orders WHERE ...');
  } catch (error) {
    return { error: "Something went wrong" };
    // Claude has no idea what to do. Tell user? Retry? Give up?
  }
}

// ✅ GOOD: Structured error with recovery guidance
async function searchOrders(params) {
  try {
    const results = await db.query('SELECT * FROM orders WHERE ...');

    if (results.length === 0) {
      // SUCCESS: query worked, no results
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            status: "success",
            orders: [],
            message: "No orders found matching your criteria."
          })
        }],
        isError: false  // The operation succeeded — just no results
      };
    }

    return {
      content: [{
        type: "text",
        text: JSON.stringify({ status: "success", orders: results })
      }],
      isError: false
    };
  } catch (error) {
    // FAILURE: something broke
    if (error.code === 'ETIMEDOUT') {
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            status: "error",
            errorType: "transient",
            message: "Database connection timed out after 5 seconds",
            suggestion: "Wait 2 seconds and retry the same query"
          })
        }],
        isError: true  // ← THIS is the critical flag
      };
    }

    if (error.code === 'INVALID_INPUT') {
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            status: "error",
            errorType: "validation",
            message: \`Invalid order ID format: \${params.order_id}\`,
            suggestion: "Order ID must be in ORD-XXXXX format"
          })
        }],
        isError: true
      };
    }

    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          status: "error",
          errorType: "unknown",
          message: error.message,
          suggestion: "Try a different search approach"
        })
      }],
      isError: true
    };
  }
}

// How Claude handles each case:
// isError: false + empty results → "You don't have any matching orders"
// isError: true + transient     → "Let me try that again..." (retries)
// isError: true + validation    → "Could you double-check the order ID?"
// isError: true + unknown       → "I'm having trouble searching. Try again?"`,
    antiPatterns: [
      {
        pattern: 'Returning [] on error',
        problem: 'Claude interprets empty arrays as "no results found" (success), not "search failed" (error). This leads to wrong conclusions being shared with users.',
      },
      {
        pattern: 'Generic "Something went wrong" errors',
        problem: 'Without specifics, Claude cannot recover. It doesn\'t know if it should retry, ask the user, or try a different approach.',
      },
      {
        pattern: 'Missing isError flag',
        problem: 'Even with descriptive error text, without isError: true, Claude treats it as a successful tool result and may act on incorrect assumptions.',
      },
    ],
    keyConcepts: [
      { concept: 'isError flag', description: 'MCP standard for signaling tool failure. Always true for failures, always false for success (even if results are empty).' },
      { concept: 'Error categories', description: 'transient, validation, permission, not_found, rate_limit — each guides a different recovery strategy.' },
      { concept: 'Recovery suggestions', description: 'Actionable guidance embedded in errors. "Retry in 2 seconds" vs just "Error".' },
      { concept: 'Success vs Empty', description: '"No results found" is success (isError: false). "Database timeout" is failure (isError: true). These are fundamentally different.' },
    ],
    resources: [
      { label: 'Tool Use Error Handling (Official Docs)', url: 'https://docs.anthropic.com/en/docs/build-with-claude/tool-use#handling-tool-use-errors' },
      { label: 'MCP Specification — isError', url: 'https://modelcontextprotocol.io/specification/2025-03-26/server/tools' },
    ],
    examTips: [
      'The exam WILL test the difference between "no results" and "error". Know that isError: false + empty = success, isError: true = failure.',
      'Error categories (transient, validation, permission) are tested. Know what each one means for recovery strategy.',
      'The #1 anti-pattern: returning empty arrays on error. This is a guaranteed exam question.',
    ],
  },
  {
    id: '2-3',
    title: 'Tool Distribution & tool_choice',
    duration: '40 min',
    description: 'Strategic placement and selection control for tools. When to pass all tools vs. a subset, how to use tool_choice to force or prevent tool use, and the sweet spot for tool count per agent.',
    knowledge: [
      'The 4-5 tool sweet spot: Claude performs best with 4-5 tools per agent. With 10+ tools, accuracy degrades noticeably. With 20+, it becomes unreliable. This is the single most important number in tool design.',
      'tool_choice controls Claude\'s behavior: "auto" (Claude decides — default), "any" (Claude MUST use a tool but picks which), "tool" (Claude MUST use a specific named tool), and "none" (Claude must NOT use any tool — text only).',
      'When to use tool_choice: "auto" for most cases, "none" when you want Claude to just answer from its training data, "any" when you know a tool call is needed but don\'t know which, "tool" for forcing a specific tool.',
      'Tool distribution strategies: (1) Group by user intent — all order-related tools in one agent, all product tools in another. (2) Route first, then invoke the right tool subset. (3) For 20+ tools, use a semantic search layer to dynamically select 4-5 relevant tools per query.',
      'Anti-pattern: passing 20+ tools to a single agent. Claude gets confused about which tool to use and may call the wrong one. Instead, use a router agent or semantic search to narrow down to 4-5 relevant tools.',
      'The "tool router" pattern: a lightweight agent with ONLY tool descriptions (no implementations) that decides which subset of tools the main agent should use. This keeps the main agent focused on 4-5 tools.',
      'Why 4-5 matters: Claude reads ALL tool descriptions on every turn. With 20 tools, that\'s 20 descriptions competing for attention. Claude starts confusing similar tools, missing edge cases in descriptions, and making routing errors.',
      'Parallel tool calls: Claude can call multiple tools in a single response when they\'re independent. This is automatic — you don\'t configure it. But with too many tools, Claude may call wrong tools in parallel.',
    ],
    skills: [
      'Design tool subsets for different agent roles',
      'Use tool_choice strategically for different interaction patterns',
      'Implement a tool router for large catalogs',
      'Keep per-agent tool count in the 4-5 range',
    ],
    codeExample: `// tool_choice options and when to use each
const toolChoiceExamples = {
  // AUTO: Claude decides whether to use tools (DEFAULT)
  auto: {
    tool_choice: { type: "auto" },
    when: "Most interactions. Claude chooses wisely when descriptions are good."
  },

  // ANY: Claude MUST use at least one tool (but picks which)
  any: {
    tool_choice: { type: "any" },
    when: "When you KNOW the user needs a tool but don't know which. "
            + "Example: 'find my order' definitely needs search_orders."
  },

  // TOOL: Force a specific tool
  tool: {
    tool_choice: { type: "tool", name: "search_orders" },
    when: "When you're certain which tool is needed. "
           + "Example: post-processing pipeline that must call process_refund."
  },

  // NONE: No tools allowed — text only
  none: {
    tool_choice: { type: "none" },
    when: "General Q&A, greetings, or when you want Claude to answer "
           + "from training data only. Example: 'What is your return policy?'"
  }
};

// Tool distribution strategy for a customer service system
// ❌ BAD: All 15 tools in one agent
const badDesign = {
  agent: "customer_service",
  tools: [
    "search_orders", "search_products", "lookup_customer",
    "process_refund", "process_exchange", "create_ticket",
    "update_shipping", "cancel_order", "apply_discount",
    "check_inventory", "get_recommendations", "search_faq",
    "escalate_to_human", "send_email", "log_interaction"
  ]
  // Claude will confuse search_orders with search_products
  // Will call wrong tools ~30% of the time
};

// ✅ GOOD: Tools grouped by intent, 4-5 per agent
const goodDesign = {
  // Router: decides which specialist to use
  router: {
    tools: [],  // No tools — just routes to specialists
    prompt: "Classify: is this about orders, products, or account?"
  },

  // Order specialist
  orderAgent: {
    tools: ["search_orders", "process_refund", "cancel_order", "update_shipping", "create_ticket"],
    // 5 tools — in the sweet spot
  },

  // Product specialist
  productAgent: {
    tools: ["search_products", "check_inventory", "get_recommendations", "search_faq"],
    // 4 tools — in the sweet spot
  },

  // Account specialist
  accountAgent: {
    tools: ["lookup_customer", "apply_discount", "send_email", "escalate_to_human"],
    // 4 tools — in the sweet spot
  }
};

// Dynamic tool selection for large catalogs (50+ tools)
async function selectTools(userQuery: string, allTools: Tool[]) {
  // Step 1: Embed the user query
  const queryEmbedding = await embed(userQuery);

  // Step 2: Score each tool by similarity
  const scored = allTools.map(tool => ({
    tool,
    score: cosineSimilarity(queryEmbedding, tool.embedding)
  }));

  // Step 3: Keep top 4-5 tools
  const selected = scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map(s => s.tool);

  return selected;
}

// Exam trap: "How many tools should a single agent have?"
// Answer: 4-5 for optimal performance. NOT "as many as needed."
// This is a frequently tested concept.`,
    antiPatterns: [
      {
        pattern: 'Passing all available tools to every agent',
        problem: 'With 15+ tools, Claude\'s selection accuracy drops to ~60%. At 20+ tools, it\'s below 50%. Keep to 4-5 per agent.',
      },
      {
        pattern: 'Using tool_choice: "tool" when you\'re not certain',
        problem: 'Forcing a specific tool when another would be better. Only use "tool" when you\'re 100% certain which tool is needed.',
      },
      {
        pattern: 'No routing strategy for large tool catalogs',
        problem: 'Without routing or semantic selection, you\'re forced to pass all tools — which kills accuracy. Invest in a routing layer.',
      },
    ],
    keyConcepts: [
      { concept: '4-5 tool sweet spot', description: 'Claude\'s tool selection accuracy is highest with 4-5 tools per agent. This is the #1 design constraint.' },
      { concept: 'tool_choice modes', description: 'auto (default), any (must use a tool), tool (must use specific tool), none (no tools). Know when to use each.' },
      { concept: 'Tool router pattern', description: 'Lightweight agent that classifies intent and selects the right tool subset. Essential for 15+ tools.' },
      { concept: 'Semantic tool search', description: 'Embedding-based selection for 50+ tool catalogs. Dynamically picks the most relevant 4-5 tools per query.' },
    ],
    resources: [
      { label: 'tool_choice Documentation', url: 'https://docs.anthropic.com/en/docs/build-with-claude/tool-use#controlling-claudes-tool-use' },
      { label: 'Forcing Tool Use', url: 'https://docs.anthropic.com/en/docs/build-with-claude/tool-use#forcing-tool-use' },
    ],
    examTips: [
      'The 4-5 tool count is tested. Know this number cold.',
      'tool_choice: "none" is for text-only responses. "any" forces a tool call. Know the difference.',
      'If a question asks about "many tools" or "large tool catalog", the answer involves a routing or semantic search layer.',
    ],
  },
  {
    id: '2-4',
    title: 'MCP Server Integration',
    duration: '50 min',
    description: 'The Model Context Protocol (MCP) is the standardized way to connect external tools and data sources to Claude. Understand the client-server architecture, configuration, and the critical distinction between MCP tools, resources, and prompts.',
    knowledge: [
      'MCP is a protocol — not a product. It defines a standard communication format between an MCP client (your application) and MCP servers (external services that provide tools, resources, and prompts).',
      'The architecture: Claude ↔ MCP Client (your app) ↔ MCP Server (external service). The client speaks the MCP protocol. The server provides capabilities (tools, resources, prompts) at runtime.',
      'MCP Tools: Actions Claude can perform. "create_issue", "search_database", "send_email". Claude decides when to call them based on user requests. Tools have side effects.',
      'MCP Resources: Data Claude can READ. "file://config.yaml", "docs://api-reference". Resources are read-only. Claude reads them for context, not to take action. Resources have NO side effects.',
      'MCP Prompts: Reusable prompt templates provided by the server. These are pre-built instructions that the server offers. Less commonly used than tools and resources.',
      'Configuration via .mcp.json: MCP servers are configured in a JSON file that specifies the command to run, arguments, and environment variables. Example: { "mcpServers": { "github": { "command": "npx", "args": ["-y", "@modelcontextprotocol/server-github"], "env": { "GITHUB_TOKEN": "..." } } } }',
      'Server transport: MCP servers communicate via stdio (standard input/output) by default. The client launches the server process and communicates through stdin/stdout. Some servers also support SSE (Server-Sent Events) for remote connections.',
      'Environment variables in MCP config: Use \${VAR_NAME} syntax to reference env vars. NEVER hardcode secrets in .mcp.json. Always use environment variable substitution for tokens and credentials.',
      'Anthropic provides pre-built MCP servers: GitHub, PostgreSQL, filesystem, Brave Search, and more. You can also build custom servers using the MCP SDK (Python or TypeScript).',
      'MCP capabilities are discovered at runtime. The client connects to the server and asks "what tools/resources/prompts do you provide?" This means you can add new capabilities without changing the client code.',
    ],
    skills: [
      'Configure MCP servers in .mcp.json',
      'Distinguish MCP tools from MCP resources from MCP prompts',
      'Use environment variable substitution for secrets',
      'Understand stdio vs SSE transport',
    ],
    codeExample: `// .mcp.json — MCP server configuration
{
  "mcpServers": {
    // Pre-built GitHub server
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "\${GITHUB_TOKEN}"
      }
    },

    // Database server
    "postgres": {
      "command": "uvx",
      "args": ["mcp-postgres"],
      "env": {
        "DATABASE_URL": "\${DATABASE_URL}"
      }
    },

    // Custom server for your company's API
    "custom-jira": {
      "command": "python",
      "args": ["/path/to/jira_server.py"],
      "env": {
        "JIRA_URL": "https://company.atlassian.net",
        "JIRA_TOKEN": "\${JIRA_API_TOKEN}"
      }
    }
  }
}

// Building a custom MCP server (Python)
from mcp.server import Server
from mcp.types import Tool, TextContent

server = Server("my-tools")

// MCP TOOL: Claude calls this to DO something (has side effects)
@server.tool("create_issue")
async def create_issue(title: str, body: str) -> list[TextContent]:
    """Create a Jira issue. Use when user wants to file a bug or feature request."""
    result = await jira.create_issue(title, body)
    return [TextContent(type="text", text=f"Created issue {result.key}")]

// MCP RESOURCE: Claude reads this to KNOW something (no side effects)
@server.resource("jira://project/{project_key}/backlog")
async def get_backlog(project_key: str) -> str:
    """Get the current backlog for a Jira project."""
    issues = await jira.get_backlog(project_key)
    return json.dumps(issues)

// MCP PROMPT: Reusable prompt template
@server.prompt("triage_issue")
async def triage_issue(issue_text: str) -> str:
    """Template for triaging a new issue."""
    return f"""Analyze this issue and classify it:
    Priority (P0-P3), Type (bug/feature/improvement), Component.
    Issue: {issue_text}"""

// Key differences:
// TOOL → Action, side effects, Claude decides when to call
// RESOURCE → Data, read-only, Claude reads for context
// PROMPT → Template, reusable, server provides structure

// MCP client connecting to servers
async def connect_mcp():
    client = MCPClient()

    // Discover capabilities at runtime
    github = await client.connect("github")
    tools = await github.list_tools()
    // Returns: [Tool(name="create_issue", ...), Tool(name="search_issues", ...)]

    resources = await github.list_resources()
    // Returns: [Resource(uri="github://repo/owner/name", ...)]

    // Claude can now use these tools and resources
    // Client automatically translates between MCP and Claude API format`,
    antiPatterns: [
      {
        pattern: 'Hardcoding secrets in .mcp.json',
        problem: 'Never put API tokens directly in config files. Use environment variable substitution: \${MY_TOKEN}. Otherwise secrets leak into version control.',
      },
      {
        pattern: 'Confusing tools with resources',
        problem: 'Tools are actions (create, update, delete). Resources are data (read, list, get). Using a tool for read-only data access bypasses the MCP design pattern.',
      },
      {
        pattern: 'Treating MCP as just another API',
        problem: 'MCP is a protocol for runtime capability discovery. The client doesn\'t need to know what tools exist at build time — they\'re discovered when the server connects.',
      },
    ],
    keyConcepts: [
      { concept: 'MCP Protocol', description: 'Standardized communication format between clients and servers. Defines how tools, resources, and prompts are discovered and invoked.' },
      { concept: 'Tools vs Resources vs Prompts', description: 'Tools = actions with side effects. Resources = read-only data. Prompts = reusable templates. Know the distinction.' },
      { concept: 'Runtime discovery', description: 'MCP capabilities are discovered when the client connects. No hardcoding needed — the server tells the client what it can do.' },
      { concept: 'stdio transport', description: 'Default communication method. Client launches server process and communicates via stdin/stdout.' },
    ],
    resources: [
      { label: 'MCP Specification', url: 'https://modelcontextprotocol.io/specification/2025-03-26' },
      { label: 'MCP Server Configuration', url: 'https://modelcontextprotocol.io/quickstart' },
      { label: 'Building Custom MCP Servers', url: 'https://modelcontextprotocol.io/quickstart/server' },
    ],
    examTips: [
      'Tools vs Resources vs Prompts is a guaranteed question. Tools = actions, Resources = data, Prompts = templates.',
      '\${VAR_NAME} syntax for secrets in .mcp.json — NEVER hardcode tokens.',
      'MCP is about runtime discovery. The exam tests whether you understand that tools are discovered dynamically, not hardcoded.',
    ],
  },
  {
    id: '2-5',
    title: 'Built-in Tool Selection',
    duration: '35 min',
    description: 'Claude Code comes with built-in tools (Read, Write, Edit, Bash, Grep, Glob). Understanding when and how Claude selects these tools — and the safety principles that govern their use — is essential for the exam.',
    knowledge: [
      'Claude Code\'s built-in tools: Read (read file contents), Write (create new files), Edit (modify existing files), Bash (execute shell commands), Grep (search file contents), Glob (find files by pattern), LS (list directory contents). These are the tools Claude uses to interact with your codebase.',
      'Tool selection is Claude-driven: Claude decides which built-in tool to use based on the task. You don\'t specify "use Bash to run tests." You say "run the tests" and Claude selects Bash. This is the agentic pattern from Domain 1 applied to a specific context.',
      'Safety tiers for Bash commands: Read-only commands (git status, ls, cat) execute freely. Reversible commands (git commit, npm install) usually execute without confirmation. Destructive commands (rm -rf, git push --force, DROP TABLE) require explicit user confirmation.',
      'The Edit tool vs Write tool: Edit makes targeted changes to existing files (find and replace). Write creates new files or completely overwrites existing ones. For modifications, Edit is preferred — it\'s more precise and less likely to accidentally lose content.',
      'Grep for content search, Glob for file search: Grep searches within files for patterns (like grep -r). Glob finds files matching a pattern (like find . -name "*.ts"). Claude uses Grep when it needs to find WHERE something is defined and Glob when it needs to find which files exist.',
      'Read before Edit: Claude almost always reads a file before editing it. This ensures Claude understands the current content and makes changes in the right location. You should follow this pattern in your own implementations too.',
      'Tool selection anti-pattern: using Bash for everything. "cat file.txt | grep pattern" when you could use the Grep tool directly. The built-in tools are more reliable and have better error handling than raw Bash commands.',
      'Permission system: Claude Code asks for permission before executing potentially dangerous operations. You can configure this with --allowedTools flags or by granting blanket permission for specific tools.',
    ],
    skills: [
      'Know all 7 built-in tools and when Claude selects each',
      'Understand the safety tier system for Bash commands',
      'Distinguish Edit from Write and Grep from Glob',
      'Apply the "Read before Edit" pattern',
    ],
    codeExample: `// Claude Code's built-in tools and when Claude picks each one:

// 1. READ — "show me the auth module"
// Claude selects: Read("src/auth.ts")
// Returns: file contents as text

// 2. WRITE — "create a new config file"
// Claude selects: Write("config/production.json", '{ ... }')
// Creates: new file with specified content

// 3. EDIT — "change the port from 3000 to 8080"
// Claude selects: Edit("server.ts", "port = 3000", "port = 8080")
// Modifies: existing file with targeted replacement

// 4. BASH — "run the tests"
// Claude selects: Bash("npm test")
// Executes: shell command, returns stdout/stderr

// 5. GREP — "where is authenticate defined?"
// Claude selects: Grep("function authenticate", path="src/")
// Returns: file paths and matching lines

// 6. GLOB — "find all test files"
// Claude selects: Glob("**/*.test.ts")
// Returns: list of file paths matching pattern

// 7. LS — "what's in the components folder?"
// Claude selects: LS("src/components/")
// Returns: directory listing

// Safety tiers in practice:

// ✅ FREE — Read-only, no risk
Bash("git status")          // just looking
Bash("ls -la")             // just listing
Bash("npm test")           // runs tests, no side effects on code

// ⚠️ CAUTION — Reversible but has effects
Bash("git commit -m 'fix'")  // creates a commit
Bash("npm install lodash")   // modifies node_modules

// 🔴 CONFIRM — Destructive or irreversible
Bash("rm -rf /important/directory")   // irreversible deletion
Bash("git push --force origin main")  // force push
Bash("DROP TABLE orders;")            // database destruction

// Exam scenario: Claude is asked to "fix the failing test"
// Correct tool sequence:
// 1. Bash("npm test")           → See which test fails
// 2. Read("tests/auth.test.ts") → Read the failing test
// 3. Read("src/auth.ts")        → Read the source code
// 4. Edit("src/auth.ts", ...)   → Fix the bug
// 5. Bash("npm test")           → Verify the fix
// This is the "Read before Edit" pattern + "verify after Edit" pattern`,
    antiPatterns: [
      {
        pattern: 'Using Bash for everything',
        problem: '"cat file.txt" instead of Read, "grep -r pattern" instead of Grep. Built-in tools are more reliable and have better error handling.',
      },
      {
        pattern: 'Write when Edit would work',
        problem: 'Write overwrites the entire file. Edit makes targeted changes. Using Write for modifications risks losing content outside the change area.',
      },
      {
        pattern: 'Skipping Read before Edit',
        problem: 'Editing without reading first means Claude doesn\'t know the current file state. This leads to incorrect line numbers and broken changes.',
      },
    ],
    keyConcepts: [
      { concept: '7 built-in tools', description: 'Read, Write, Edit, Bash, Grep, Glob, LS. Know what each does and when Claude selects it.' },
      { concept: 'Safety tiers', description: 'Free (read-only), Caution (reversible), Confirm (destructive). Claude applies human-like judgment.' },
      { concept: 'Read before Edit', description: 'Claude always reads a file before editing it. Follow this pattern in your own implementations.' },
      { concept: 'Edit vs Write', description: 'Edit = targeted modification. Write = full file creation/overwrite. Prefer Edit for changes.' },
    ],
    resources: [
      { label: 'Claude Code Tools Overview', url: 'https://docs.anthropic.com/en/docs/claude-code/overview' },
      { label: 'Claude Code Safety', url: 'https://docs.anthropic.com/en/docs/claude-code/security' },
    ],
    examTips: [
      'Know all 7 built-in tools. The exam will ask which tool Claude selects for a given task.',
      'Edit vs Write is tested: Edit for modifications, Write for new files. Don\'t mix them up.',
      'Safety tiers: read-only commands execute freely, destructive ones need confirmation. This maps to how a cautious engineer works.',
    ],
  },
  {
    id: '2-6',
    title: 'Tool Search for Large Catalogs',
    duration: '35 min',
    description: 'When your system has 50+ tools, passing all of them to Claude on every request is impractical. The solution is semantic tool search — embedding-based selection that keeps the per-request tool count within the optimal 4-5 range.',
    knowledge: [
      'The problem: with 50+ tools, sending all descriptions in every request would consume massive token budgets and confuse Claude. Tool descriptions alone might be 10K+ tokens.',
      'Semantic tool search solves this: embed each tool\'s description into a vector, embed the user\'s query, and find the top 4-5 most similar tools by cosine similarity. Only those tools get sent to Claude.',
      'This is NOT keyword matching — it\'s embedding similarity. "I want to cancel my order" matches process_cancellation even though "cancel" and "process_cancellation" don\'t share keywords. The embedding captures semantic meaning.',
      'Implementation pattern: (1) Pre-compute embeddings for all tool descriptions at startup, (2) On each request, embed the user query, (3) Compute cosine similarity against all tool embeddings, (4) Select top 4-5, (5) Send only those tools to Claude.',
      'Tool search vs tool router: Tool search uses embeddings and works well for 50-500 tools. Tool router uses an LLM to classify intent and works well for 5-15 categories. For very large catalogs (500+), combine both: router narrows to a category, then search within that category.',
      'Performance considerations: embedding search is fast (~10ms for 1000 tools). The bottleneck is embedding the user query, but modern embedding models do this in under 50ms. Total overhead: ~60ms per request.',
      'The exam frames this as "how to handle many tools" — the answer is always some form of dynamic selection, not "send all tools" or "manually pick tools".',
    ],
    skills: [
      'Implement embedding-based tool selection',
      'Pre-compute tool embeddings for performance',
      'Combine router + search for very large catalogs',
      'Keep per-request tool count at 4-5 regardless of total catalog size',
    ],
    codeExample: `// Semantic tool search implementation
import { embed, cosineSimilarity } from './embeddings';

// Step 1: Pre-compute embeddings at startup
interface ToolEntry {
  name: string;
  definition: any;
  embedding: number[];
}

const toolCatalog: ToolEntry[] = [];

async function indexTools(tools: any[]) {
  for (const tool of tools) {
    // Create rich text from tool metadata for embedding
    const searchText = \`\${tool.name}: \${tool.description}\`;
    const embedding = await embed(searchText);
    toolCatalog.push({
      name: tool.name,
      definition: tool,
      embedding
    });
  }
  console.log(\`Indexed \${toolCatalog.length} tools\`);
}

// Step 2: Search at query time
async function selectTools(userQuery: string, topK = 4): Promise<any[]> {
  // Embed the user's query
  const queryEmbedding = await embed(userQuery);

  // Score every tool by semantic similarity
  const scored = toolCatalog.map(entry => ({
    tool: entry.definition,
    score: cosineSimilarity(queryEmbedding, entry.embedding)
  }));

  // Return top-K tools
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map(s => s.tool);
}

// Step 3: Use in agentic loop
async function handleRequest(userMessage: string) {
  // Dynamically select relevant tools
  const relevantTools = await selectTools(userMessage, 4);

  // Send ONLY relevant tools to Claude
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    tools: relevantTools,  // 4 tools instead of 50+
    messages: [{ role: "user", content: userMessage }]
  });

  return response;
}

// Example: 100-tool customer service system
// User: "I want to return my laptop"
//
// Tool search finds:
// 1. process_return (score: 0.92) — "Process product returns..."
// 2. lookup_order (score: 0.87) — "Find order by ID or email..."
// 3. check_return_policy (score: 0.85) — "Check if item is returnable..."
// 4. generate_return_label (score: 0.82) — "Create shipping label..."
//
// Only these 4 tools are sent to Claude.
// The other 96 tools stay in the catalog, invisible to Claude.

// Performance: ~60ms total overhead
// - Query embedding: ~40ms
// - Similarity search: ~10ms (dot products)
// - Sort and select: ~10ms`,
    antiPatterns: [
      {
        pattern: 'Keyword-based tool selection',
        problem: 'Matching "cancel" keyword to "process_cancellation" misses semantic matches like "I want to undo my order". Use embeddings, not keywords.',
      },
      {
        pattern: 'Sending all tools "just in case"',
        problem: 'With 50+ tools, this consumes massive tokens and degrades Claude\'s selection accuracy to below 50%.',
      },
      {
        pattern: 'Re-computing embeddings on every request',
        problem: 'Tool embeddings don\'t change between requests. Compute once at startup and cache. Only the user query needs fresh embedding.',
      },
    ],
    keyConcepts: [
      { concept: 'Semantic search', description: 'Embedding-based similarity matching. Captures meaning, not just keywords.' },
      { concept: 'Pre-computed embeddings', description: 'Tool descriptions are embedded once at startup. Only the user query needs a fresh embedding per request.' },
      { concept: 'Top-K selection', description: 'Always select top 4-5 tools by similarity score. Keeps Claude in the sweet spot regardless of catalog size.' },
      { concept: 'Router + Search combo', description: 'For 500+ tools: LLM router narrows to category, then semantic search within that category.' },
    ],
    resources: [
      { label: 'Tool Use with Many Tools', url: 'https://docs.anthropic.com/en/docs/build-with-claude/tool-use' },
      { label: 'Embeddings Overview', url: 'https://docs.anthropic.com/en/docs/build-with-claude/embeddings' },
    ],
    examTips: [
      'For "large tool catalog" questions, the answer is semantic tool search with embedding similarity.',
      'The target is always 4-5 tools per request, regardless of total catalog size.',
      'Tool search is embedding-based, NOT keyword-based. This distinction is tested.',
    ],
  },
  {
    id: '2-exam',
    title: 'Domain 2 Exam Practice Quiz',
    duration: '15 min',
    description: 'Interactive quiz covering all 5 subdomains. Answer each question and get instant feedback.',
    knowledge: [],
    skills: [],
    codeExample: '',
    quiz: domain2Quiz,
  },
  {
    id: '2-summary',
    title: 'Chapter Summary & Quick Reference',
    duration: '10 min',
    description: 'Visual cheat sheet for exam day — collapsible cards, anti-patterns, and 60-second scan.',
    knowledge: [],
    skills: [],
    codeExample: '',
    quickRef: domain2QuickRef,
  },
];

export default function Domain2() {
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const { completeLesson, isLessonCompleted } = useCourse();

  const toggleLesson = (id: string) => {
    setExpandedLesson(expandedLesson === id ? null : id);
  };

  const markComplete = (id: string) => {
    const newCompleted = new Set(completedLessons);
    if (newCompleted.has(id)) {
      newCompleted.delete(id);
    } else {
      newCompleted.add(id);
      completeLesson('domain2', id);
    }
    setCompletedLessons(newCompleted);
  };

  return (
    <div className="space-y-8">
      {/* Domain Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl p-8 text-white">
        <div className="flex items-center gap-3 mb-2">
          <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">Domain 2</span>
          <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">18% Exam Weight</span>
        </div>
        <h1 className="text-3xl font-bold mb-2">Tool Design &amp; MCP Integration</h1>
        <p className="text-emerald-100 max-w-2xl">Master the design of tool interfaces that Claude can reliably select, structured error handling, tool distribution strategies, and the Model Context Protocol.</p>
        <div className="flex items-center gap-6 mt-4 text-sm text-emerald-100">
          <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" /> 8 Lessons</span>
          <span className="flex items-center gap-1"><FlaskConical className="w-4 h-4" /> Full Code Examples</span>
          <span className="flex items-center gap-1"><Lightbulb className="w-4 h-4" /> Exam Tips</span>
        </div>
      </div>

      {/** Mind Map **/}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
          <Brain className="w-5 h-5 text-cyan-500" />
          Mind Map — Key Concepts
        </h2>
        <MindMap data={domain2MindMap.root} />
      </div>

      {/* Progress */}
      <div className="bg-white rounded-xl border p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-700">Progress</span>
          <span className="text-sm text-slate-500">{completedLessons.size}/{lessons.length} lessons completed</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2">
          <div
            className="bg-emerald-500 h-2 rounded-full transition-all"
            style={{ width: `${(completedLessons.size / lessons.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Lessons */}
      <div className="space-y-3">
        {lessons.map((lesson) => {
          const isExpanded = expandedLesson === lesson.id;
          const isCompleted = completedLessons.has(lesson.id) || isLessonCompleted('domain2', lesson.id);

          return (
            <div key={lesson.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <button
                onClick={() => toggleLesson(lesson.id)}
                className="w-full flex items-center gap-4 p-5 text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${isCompleted ? 'bg-green-500' : 'bg-slate-100'}`}>
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">{lesson.id}</span>
                    <h3 className="font-semibold text-slate-900">{lesson.title}</h3>
                  </div>
                  <p className="text-sm text-slate-500 mt-1 truncate">{lesson.description}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-xs text-slate-400">{lesson.duration}</span>
                  {isExpanded ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
                </div>
              </button>

              {isExpanded && (
                <div className="border-t p-6 space-y-6">
                  {/* Deep Explanation */}
                  {(() => {
                    const expl = domain2Explanations.find(e => e.id === lesson.id);
                    return expl ? (
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                          <Lightbulb className="w-4 h-4 text-amber-500" />
                          Learn
                        </h4>
                        <LessonContent content={expl.explanation} domainColor="emerald" />
                      </div>
                    ) : null;
                  })()}

                  {/* Knowledge */}
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-emerald-500" />
                      Key Knowledge
                    </h4>
                    <ul className="space-y-2">
                      {lesson.knowledge.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Skills */}
                  {'skills' in lesson && lesson.skills && lesson.skills.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                        <FlaskConical className="w-4 h-4 text-green-500" />
                        Practical Skills
                      </h4>
                      <ul className="space-y-2">
                        {lesson.skills.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Code Example */}
                  {'quiz' in lesson && (lesson as any).quiz ? (
                    <DomainQuiz questions={(lesson as any).quiz} domainColor="emerald" domainId="domain2" />
                  ) : 'quickRef' in lesson && (lesson as any).quickRef ? (
                    <QuickRef {...(lesson as any).quickRef} domainColor="emerald" />
                  ) : (
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                        <Code className="w-4 h-4 text-amber-500" />
                        Full Working Example
                      </h4>
                      <pre className="bg-slate-900 text-slate-100 rounded-lg p-4 text-sm overflow-x-auto max-h-[600px]">
                        <code>{lesson.codeExample}</code>
                      </pre>
                    </div>
                  )}

                  {/* Anti-patterns */}
                  {'antiPatterns' in lesson && lesson.antiPatterns && lesson.antiPatterns.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                        Anti-Patterns to Avoid
                      </h4>
                      <div className="space-y-2">
                        {lesson.antiPatterns.map((pattern, i) => (
                          <div key={i} className="bg-red-50 border border-red-200 rounded-lg p-3">
                            <p className="font-medium text-red-900 text-sm">{pattern.pattern}</p>
                            <p className="text-red-700 text-sm">{pattern.problem}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Key Concepts */}
                  {'keyConcepts' in lesson && lesson.keyConcepts && lesson.keyConcepts.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Key Concepts</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {lesson.keyConcepts.map((concept, i) => (
                          <div key={i} className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                            <p className="font-medium text-emerald-900 text-sm">{concept.concept}</p>
                            <p className="text-emerald-700 text-xs">{concept.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Resources */}
                  {'resources' in lesson && lesson.resources && lesson.resources.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                        <ExternalLink className="w-4 h-4 text-indigo-500" />
                        Official Documentation
                      </h4>
                      <div className="space-y-2">
                        {lesson.resources.map((resource, i) => (
                          <a
                            key={i}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 hover:underline"
                          >
                            <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                            {resource.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Exam Tips */}
                  {lesson.examTips && lesson.examTips.length > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <h4 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4" />
                      Exam Tips
                    </h4>
                    <ul className="space-y-1">
                      {lesson.examTips.map((tip, i) => (
                        <li key={i} className="text-sm text-amber-800 flex items-start gap-2">
                          <span className="text-amber-600">→</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                  )}

                  {/* Mark Complete */}
                  <div className="flex justify-end pt-4 border-t border-slate-100">
                    <button
                      onClick={() => markComplete(lesson.id)}
                      className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
                        isCompleted
                          ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          : 'bg-emerald-500 text-white hover:bg-emerald-600'
                      }`}
                    >
                      {isCompleted ? 'Mark as Incomplete' : 'Mark as Complete'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <NotesFab lessonId={expandedLesson || '2-1'} />

      {/* Navigation */}
      <div className="flex justify-between pt-8 border-t border-slate-200 dark:border-slate-800">
        <Link
          to="/domain/1"
          className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors"
        >
          Previous: Agentic Architecture
        </Link>
        <Link
          to="/domain/3"
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors"
        >
          Next: Claude Code &amp; Extended Thinking
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}