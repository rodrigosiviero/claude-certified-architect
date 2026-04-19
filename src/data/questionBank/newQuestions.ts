/**
 * Question Bank — unified pool for random exam generation.
 *
 * Each question has a unique `poolId` to avoid duplication.
 * Existing scenario exam questions (1-120) are referenced by their scenario files.
 * New questions (121+) are defined here.
 */
export interface PoolQuestion {
  poolId: number;
  domain: 'd1' | 'd2' | 'd3' | 'd4' | 'd5';
  domainLabel: string;
  scenario: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  trap?: string;
}

// ─── D1 — Agentic Architecture (16 new) ──────────────────────────────────
const d1New: PoolQuestion[] = [
  {
    poolId: 121, domain: 'd1', domainLabel: 'Agentic Loops',
    scenario: 'A travel booking agent uses an agentic loop. After 8 iterations, the token count exceeds the model\'s context window and the API returns an error.',
    question: 'What is the best strategy to prevent this?',
    options: [
      'Truncate the conversation history at each iteration, keeping only the last 3 messages',
      'Implement a sliding context window that keeps the system prompt, the last N messages, and a running summary of earlier turns',
      'Reduce the number of tools available to the agent',
      'Switch to a model with a larger context window',
    ],
    correct: 1,
    explanation: 'A sliding context window with summarization preserves the system prompt\'s instructions while keeping the conversation manageable. Truncation (A) loses important context. Reducing tools (C) limits capability. A bigger model (D) only delays the problem.',
  },
  {
    poolId: 122, domain: 'd1', domainLabel: 'Agentic Loops',
    scenario: 'An agent\'s agentic loop has max_iterations=10. On iteration 10, Claude is mid-task — it has called a tool and needs one more turn to complete the response.',
    question: 'What should happen?',
    options: [
      'Return an error to the user',
      'Return whatever partial response Claude has so far, with a note that the task may be incomplete',
      'Automatically restart the loop with a fresh context',
      'Force Claude to respond immediately by setting stop_reason to "end_turn"',
    ],
    correct: 1,
    explanation: 'Graceful degradation is the best approach — return partial results with a disclaimer. Errors (A) are jarring. Restarting (C) loses progress. Forcing stop (D) may produce incoherent output.',
  },
  {
    poolId: 123, domain: 'd1', domainLabel: 'Tool Use Flow',
    scenario: 'Claude calls a tool that takes 30 seconds to respond (a complex database query). The user sees no activity during this time.',
    question: 'What is the best UX improvement?',
    options: [
      'Show a loading spinner with a message like "Searching the database..."',
      'Reduce the query timeout to 5 seconds',
      'Pre-fetch all possible query results at conversation start',
      'Remove the slow tool from the agent\'s capabilities',
    ],
    correct: 0,
    explanation: 'A loading indicator with contextual messaging manages user expectations. Reducing timeout (B) may cause failures. Pre-fetching (C) is impractical. Removing tools (D) limits functionality.',
  },
  {
    poolId: 124, domain: 'd1', domainLabel: 'Multi-Agent Orchestration',
    scenario: 'A research system has 3 specialist agents: WebSearch, DataAnalyst, and ReportWriter. The user asks "Analyze Tesla stock performance." WebSearch returns data, but DataAnalyst says it can\'t process the raw format.',
    question: 'What is the root architectural issue?',
    options: [
      'The agents need a shared context or a coordinator that normalizes data between agents',
      'DataAnalyst is not capable enough',
      'The user\'s question was too vague',
      'WebSearch should format data before passing it along',
    ],
    correct: 0,
    explanation: 'Multi-agent systems need a shared context layer or a coordinator that handles data normalization between agents. The issue is architectural — each agent works in isolation with no contract for data exchange.',
  },
  {
    poolId: 125, domain: 'd1', domainLabel: 'Agentic Loops',
    scenario: 'You\'re building a coding agent. Claude writes code, then tests it. The test fails. Claude reads the error, fixes the code, tests again — repeating until tests pass or it gives up after 5 attempts.',
    question: 'This is an example of what pattern?',
    options: [
      'MapReduce pattern',
      'Observe-Orient-Decide-Act (OODA) loop with feedback',
      'Single-pass generation',
      'Chain-of-thought reasoning without tools',
    ],
    correct: 1,
    explanation: 'The OODA loop: observe (read error) → orient (understand failure) → decide (plan fix) → act (write code) → repeat. This is the core pattern of agentic loops — iterative refinement based on environmental feedback.',
  },
  {
    poolId: 126, domain: 'd1', domainLabel: 'Multi-Agent Orchestration',
    scenario: 'A customer service system uses an orchestrator agent that spawns subagents. Each subagent creates its own API connection to Claude, costing $0.01 per message. With 10 subagents each sending 5 messages, costs explode.',
    question: 'What is the most cost-effective architectural change?',
    options: [
      'Use a single agent with all tools instead of multiple subagents',
      'Have the orchestrator pass a consolidated context to one subagent at a time, reusing the connection, and aggregate results',
      'Reduce the number of tools each subagent can access',
      'Cache all API responses to avoid redundant calls',
    ],
    correct: 1,
    explanation: 'Sequential subagent execution with connection reuse is more cost-effective than parallel spawning. A monolithic agent (A) becomes too complex. Caching (D) helps but doesn\'t solve the core cost structure.',
  },
  {
    poolId: 127, domain: 'd1', domainLabel: 'Tool Use Flow',
    scenario: 'Your agent calls three tools in parallel. Tool A returns in 1s, Tool B in 3s, Tool C returns an error immediately. Claude receives all three results simultaneously.',
    question: 'How should Claude handle the error from Tool C?',
    options: [
      'Ignore the error and proceed with results from A and B only',
      'Acknowledge the error, attempt a retry or alternative approach for Tool C, and combine all available information before responding',
      'Immediately report the error to the user and stop processing',
      'Re-run all three tools to ensure consistency',
    ],
    correct: 1,
    explanation: 'Best practice is to gracefully handle the error — retry if possible, use available data from A and B, and inform the user about any limitations. Ignoring errors (A) hides problems. Stopping entirely (C) wastes successful results. Re-running all (D) is wasteful.',
  },
  {
    poolId: 128, domain: 'd1', domainLabel: 'Agentic Loops',
    scenario: 'A dev team builds an agent with tool_use. They notice Claude sometimes produces text AND tool calls in the same response. The code only handles pure tool_use or pure text responses.',
    question: 'What should they do?',
    options: [
      'Add a system prompt instruction to never mix text and tool calls',
      'Handle both content types in the same response — text blocks and tool_use blocks can coexist and both should be processed',
      'Discard the text and only process the tool calls',
      'Split into two API calls — one for text, one for tools',
    ],
    correct: 1,
    explanation: 'Claude can return mixed content blocks (text + tool_use) in a single response. Both should be processed — display the text to the user and execute the tool calls. The API natively supports this pattern.',
  },
  {
    poolId: 129, domain: 'd1', domainLabel: 'Multi-Agent Orchestration',
    scenario: 'A complex analysis pipeline has: DataFetcher → DataCleaner → Analyst → Reviewer. Each agent is a separate Claude call. The Reviewer finds issues that require re-fetching data.',
    question: 'How should the system handle going back to a previous stage?',
    options: [
      'Restart the entire pipeline from DataFetcher',
      'The orchestrator should loop back to DataFetcher with the Reviewer\'s feedback as additional context, then continue forward through the pipeline',
      'The Reviewer should fix the issues itself',
      'End the pipeline and report failure',
    ],
    correct: 1,
    explanation: 'Orchestrator-controlled looping with feedback context allows targeted re-execution. The orchestrator passes the Reviewer\'s feedback to DataFetcher, then continues through the pipeline with richer context.',
  },
  {
    poolId: 130, domain: 'd1', domainLabel: 'Agentic Loops',
    scenario: 'An e-commerce agent receives: "I want to return my blue shoes and also check if the red ones are in stock." This requires two different tool operations.',
    question: 'What is the best approach for handling multi-intent requests?',
    options: [
      'Process only the first intent and ask the user to submit the second as a separate request',
      'Let Claude decompose the request and handle both intents within the same agentic loop, calling tools for each intent',
      'Route to two separate agents in parallel',
      'Combine both intents into a single tool call',
    ],
    correct: 1,
    explanation: 'Claude can decompose multi-intent requests and handle each within the same agentic loop. This is more natural than forcing separate requests or spawning multiple agents for a single conversation.',
  },
  {
    poolId: 131, domain: 'd1', domainLabel: 'Tool Use Flow',
    scenario: 'You design a tool called "send_email" that Claude uses in an automated workflow. During testing, Claude calls send_email with a poorly written draft full of errors.',
    question: 'What is the best way to ensure email quality before sending?',
    options: [
      'Add a tool_result that says "Email sent!" even if you don\'t actually send it, then review later',
      'Implement a human-in-the-loop step: the tool queues the draft for human approval before actually sending, and returns a confirmation request to Claude',
      'Add a system prompt saying "Always write perfect emails"',
      'Remove the send_email tool and handle emails manually',
    ],
    correct: 1,
    explanation: 'Human-in-the-loop for high-stakes actions is a core safety pattern. The tool queues for approval rather than executing immediately. This balances automation with quality control.',
  },
  {
    poolId: 132, domain: 'd1', domainLabel: 'Agentic Loops',
    scenario: 'A support agent uses tool_use with a knowledge base search tool. Claude calls the tool 15 times for a simple question, each time refining the search query slightly.',
    question: 'How can you optimize this behavior?',
    options: [
      'Reduce max_iterations to 3',
      'Add a caching layer — if a similar search was already done, return the cached result with a note to Claude to use the existing information',
      'Remove the search tool and give Claude all knowledge base content in the system prompt',
      'Add a system prompt: "Only search once per conversation"',
    ],
    correct: 1,
    explanation: 'Caching similar queries prevents redundant tool calls while preserving search flexibility. Hard limits (A, D) may prevent finding the right answer. Embedding everything (C) is impractical for large knowledge bases.',
  },
];

// ─── D2 — Tool Design & MCP (16 new) ─────────────────────────────────────
const d2New: PoolQuestion[] = [
  {
    poolId: 133, domain: 'd2', domainLabel: 'Tool Definition',
    scenario: 'You define a tool "search_products" with parameters: query (string), category (string), min_price (number), max_price (number). Claude always fills all 4 parameters even when the user only mentions a product name.',
    question: 'How should you fix this?',
    options: [
      'Mark query as required and the other parameters as optional in the JSON Schema',
      'Remove the optional parameters entirely',
      'Add a system prompt: "Only fill parameters the user explicitly mentions"',
      'Use a different model that handles optional parameters better',
    ],
    correct: 0,
    explanation: 'JSON Schema\'s "required" array controls which parameters Claude must fill. Making non-essential parameters optional prevents Claude from hallucinating values the user didn\'t specify.',
  },
  {
    poolId: 134, domain: 'd2', domainLabel: 'Tool Result Processing',
    scenario: 'A tool returns 500 lines of JSON data. Claude tries to process it all but the response gets truncated due to output length limits.',
    question: 'What is the best architectural fix?',
    options: [
      'Increase Claude\'s max output tokens to 8192',
      'Process and summarize the data in the tool itself before returning it to Claude — return only the relevant subset',
      'Split the data into multiple tool results',
      'Ask the user to narrow their request',
    ],
    correct: 1,
    explanation: 'Tools should do their own data processing — filter, summarize, and return only relevant results. This is the "fat tool, thin agent" pattern. Pushing data processing into the model is inefficient and error-prone.',
  },
  {
    poolId: 135, domain: 'd2', domainLabel: 'MCP Integration',
    scenario: 'Your team wants to connect Claude to your company\'s internal APIs (CRM, billing, inventory). Each API has different auth methods and data formats.',
    question: 'What is the most maintainable approach?',
    options: [
      'Write custom tool definitions for each API directly in the agent code',
      'Build an MCP server that standardizes access to all internal APIs behind a consistent interface, with unified auth and error handling',
      'Use web scraping to access the API data',
      'Give Claude direct database access instead',
    ],
    correct: 1,
    explanation: 'MCP servers provide a standardized interface layer — unified auth, consistent error handling, and a single integration point. This is more maintainable than scattered tool definitions and more secure than direct DB access.',
  },
  {
    poolId: 136, domain: 'd2', domainLabel: 'Tool Error Handling',
    scenario: 'A tool called "get_customer" returns {"error": "Customer not found"} with HTTP 404. The agent code passes this raw JSON to Claude as a tool_result.',
    question: 'What is wrong?',
    options: [
      'Nothing — Claude will understand the error',
      'The tool_result should include an is_error: true flag so Claude knows the tool failed and can react appropriately (retry, ask user, etc.)',
      'The agent should retry the tool call automatically without telling Claude',
      'The tool should return a fake customer record instead of an error',
    ],
    correct: 1,
    explanation: 'Setting is_error: true in the tool_result tells Claude this is a failure, not a successful response. Claude can then reason about the error and decide how to handle it — retry, ask the user for clarification, or try an alternative approach.',
  },
  {
    poolId: 137, domain: 'd2', domainLabel: 'Tool Design',
    scenario: 'You define a calculator tool that takes "expression" as a string parameter. Claude sends "2+2" but the tool expects JavaScript syntax and the user wrote "2 plus 2".',
    question: 'What is the best fix?',
    options: [
      'Add a natural language parser to the tool',
      'Include a description in the tool definition specifying the expected format, with examples like "expression must be valid JavaScript: \'2+2\', \'3*4+(5-1)\'"',
      'Have Claude translate natural language to math before calling the tool',
      'Remove the calculator tool and let Claude do math natively',
    ],
    correct: 1,
    explanation: 'Clear tool descriptions with format specifications and examples guide Claude to send correctly formatted parameters. This is proactive design — define the contract clearly rather than handling failures reactively.',
  },
  {
    poolId: 138, domain: 'd2', domainLabel: 'MCP Integration',
    scenario: 'An MCP server exposes 50 tools. The agent\'s system prompt lists all 50 tools for Claude to choose from. Claude often picks the wrong tool or gets confused between similar tools.',
    question: 'What is the best optimization?',
    options: [
      'Remove tools until only 10 remain',
      'Group tools by domain/category and implement a two-stage selection — first route to a category, then select from that category\'s tools',
      'Rename all tools to be more descriptive',
      'Let the user choose which tool to use',
    ],
    correct: 1,
    explanation: 'Two-stage tool selection (routing then choosing) reduces the decision space at each step. This is the same principle as the multi-agent orchestration pattern — decompose a complex decision into simpler ones.',
  },
  {
    poolId: 139, domain: 'd2', domainLabel: 'Tool Result Processing',
    scenario: 'A database query tool returns results with columns: id, name, email, ssn, phone, address. Claude uses this data to generate a customer report.',
    question: 'What security concern should you address?',
    options: [
      'Ensure the report uses the correct formatting',
      'The tool should filter out PII (SSN) before returning results to Claude, or mask sensitive fields — never expose raw PII in tool results',
      'Encrypt the entire tool result',
      'Store the results in a temporary file instead',
    ],
    correct: 1,
    explanation: 'PII should never flow through tool results to the model. Filter or mask sensitive fields at the tool level before returning data. This is a fundamental security principle for tool design.',
  },
  {
    poolId: 140, domain: 'd2', domainLabel: 'Tool Definition',
    scenario: 'You build a tool "book_flight" that accepts origin, destination, date, airline, seat_class, meal_preference, and baggage_type. Most parameters are rarely used.',
    question: 'What design principle are you violating?',
    options: [
      'Tools should have no more than 3 parameters',
      'Keep tool interfaces minimal — only require essential parameters (origin, destination, date) and make everything else optional with sensible defaults',
      'Each tool should accept exactly one parameter',
      'Tools should never have optional parameters',
    ],
    correct: 1,
    explanation: 'Minimal required parameters with optional extras is the best practice. Claude performs better with focused tool interfaces — it fills required params reliably and only adds optional ones when the user specifically mentions them.',
  },
  {
    poolId: 141, domain: 'd2', domainLabel: 'MCP Integration',
    scenario: 'Your MCP server needs to handle 100 concurrent requests. Currently it processes everything sequentially and requests queue up during peak hours.',
    question: 'What is the best scaling strategy?',
    options: [
      'Add more CPU to the MCP server',
      'Implement request queuing with async processing, connection pooling for downstream services, and horizontal scaling of MCP server instances',
      'Cache all MCP responses permanently',
      'Reduce the number of tools to decrease processing time',
    ],
    correct: 1,
    explanation: 'Horizontal scaling with async processing and connection pooling is the standard approach for MCP server scaling. More CPU (A) has limits. Permanent caching (C) serves stale data. Fewer tools (D) limits functionality.',
  },
  {
    poolId: 142, domain: 'd2', domainLabel: 'Tool Error Handling',
    scenario: 'A payment processing tool returns {"status": "declined", "reason": "insufficient_funds"}. The agent code passes this to Claude as a plain string tool_result.',
    question: 'What is the issue?',
    options: [
      'The tool should not return decline reasons for security',
      'Passing structured error data as a plain string loses information — return it as structured JSON so Claude can reason about the specific error and suggest alternatives',
      'The agent should retry the payment automatically',
      'The tool should return "success" and handle the decline internally',
    ],
    correct: 1,
    explanation: 'Structured error data (JSON) allows Claude to understand the specific failure reason and offer relevant alternatives (different payment method, lower amount). Converting to string loses semantic information.',
  },
  {
    poolId: 143, domain: 'd2', domainLabel: 'Tool Definition',
    scenario: 'You notice Claude sometimes passes string values for a tool parameter defined as integer (e.g., "5" instead of 5).',
    question: 'How should you handle type coercion in tool parameters?',
    options: [
      'Reject the call and return an error',
      'Add type coercion in the tool execution layer — attempt to parse strings as numbers, and if it fails, return an error via is_error: true',
      'Change all parameters to string type to avoid the issue',
      'Add a system prompt: "Always use correct types"',
    ],
    correct: 1,
    explanation: 'Defensive type coercion at the execution layer handles edge cases gracefully. If coercion fails, the is_error flag lets Claude know and self-correct. This is more robust than rejection or avoiding the issue.',
  },
  {
    poolId: 144, domain: 'd2', domainLabel: 'Tool Result Processing',
    scenario: 'A weather API tool returns temperature in Kelvin. Claude presents it to users in Brazil who expect Celsius.',
    question: 'Where should the unit conversion happen?',
    options: [
      'In the system prompt, instruct Claude to convert Kelvin to Celsius',
      'In the tool itself — convert to the user\'s expected unit before returning the result',
      'In the frontend display layer',
      'Ask the API provider to return Celsius',
    ],
    correct: 1,
    explanation: 'Tools should return data in the most useful format for the agent and end user. Doing conversion in the tool (B) is more reliable than asking the model to do math (A), which can introduce errors.',
  },
];

// ─── D3 — Claude Code Configuration (16 new) ─────────────────────────────
const d3New: PoolQuestion[] = [
  {
    poolId: 145, domain: 'd3', domainLabel: 'CLAUDE.md Configuration',
    scenario: 'A team has a monorepo with a shared CLAUDE.md at root and project-specific CLAUDE.md files in subdirectories. Claude is reading both but applying conflicting rules.',
    question: 'How should CLAUDE.md files be structured in a monorepo?',
    options: [
      'Use only one CLAUDE.md at the root level',
      'Place shared conventions in the root CLAUDE.md and project-specific rules in subdirectory CLAUDE.md files — Claude reads the nearest ancestor files and merges them',
      'Delete all CLAUDE.md files and use system prompts instead',
      'Combine everything into a single large CLAUDE.md in each subdirectory',
    ],
    correct: 1,
    explanation: 'CLAUDE.md follows a hierarchical merge pattern — root defines shared conventions, subdirectories define specific overrides. Claude merges them with closer files taking precedence for conflicts.',
  },
  {
    poolId: 146, domain: 'd3', domainLabel: 'CLAUDE.md Configuration',
    scenario: 'You add "@import ./docs/api-rules.md" to CLAUDE.md but Claude doesn\'t follow the imported rules.',
    question: 'What is the most likely issue?',
    options: [
      '@import is not supported in CLAUDE.md',
      'The imported file may exceed context limits when combined with CLAUDE.md, or the path may be incorrect — verify the file exists and the combined content fits within Claude\'s context window',
      'Imported rules have lower priority than direct rules',
      'The file needs to be in JSON format',
    ],
    correct: 1,
    explanation: '@import works in CLAUDE.md but the combined content must fit within context limits. A large imported file may be truncated or excluded. Always verify file paths and total content size.',
  },
  {
    poolId: 147, domain: 'd3', domainLabel: 'Claude Code CLI',
    scenario: 'You run: claude --output-format json "List all Python files" but get plain text output.',
    question: 'What is wrong?',
    options: [
      '--output-format is not a valid flag',
      'The flag name may differ — check if the correct flag is --output-format json or --json, and ensure the CLI version supports structured output mode',
      'Claude Code doesn\'t support JSON output',
      'You need to also add --structured flag',
    ],
    correct: 1,
    explanation: 'CLI flags may vary between versions. Always verify the correct flag name and version compatibility. The exam tests knowledge of Claude Code CLI configuration options including output format control.',
  },
  {
    poolId: 148, domain: 'd3', domainLabel: 'Prompt Caching',
    scenario: 'A system prompt is 4000 tokens and is sent with every API call in an agentic loop (10 iterations). Your API costs are high.',
    question: 'How can you reduce costs?',
    options: [
      'Shorten the system prompt',
      'Use prompt caching — mark the system prompt with cache_control so it\'s cached after the first call and reused in subsequent iterations at reduced cost',
      'Remove the system prompt after the first iteration',
      'Use a cheaper model for iterations after the first',
    ],
    correct: 1,
    explanation: 'Prompt caching stores large, reused content (like system prompts) and charges less for subsequent uses. This is ideal for agentic loops where the system prompt doesn\'t change between iterations.',
  },
  {
    poolId: 149, domain: 'd3', domainLabel: 'Claude Code CLI',
    scenario: 'You want Claude Code to always use Python 3.12 conventions and follow PEP 8 strictly in a project.',
    question: 'Where should you configure this?',
    options: [
      'In a .claude-config.json file in the project root',
      'In the project\'s CLAUDE.md file with clear instructions about Python version, style guide, and coding conventions',
      'As command-line arguments every time you invoke Claude',
      'In a separate Python configuration file that Claude might read',
    ],
    correct: 1,
    explanation: 'CLAUDE.md is the standard way to configure project-specific coding conventions. Claude reads it automatically when working in the project directory. It\'s more reliable than CLI args or hoping Claude finds a config file.',
  },
  {
    poolId: 150, domain: 'd3', domainLabel: 'Extended Thinking',
    scenario: 'You enable extended thinking (budget_tokens=10000) for a complex code generation task. Claude spends 8000 tokens thinking but the final answer is only 200 tokens of code.',
    question: 'Is this a problem?',
    options: [
      'Yes — extended thinking should never use more tokens than the output',
      'No — extended thinking uses tokens for internal reasoning that improves output quality. The thinking tokens are the cost of better reasoning, not waste',
      'Yes — you should set budget_tokens to match expected output length',
      'Only if the final answer is wrong',
    ],
    correct: 1,
    explanation: 'Extended thinking allocates a budget for internal reasoning. More thinking tokens often produce better outputs. The budget is a ceiling, not a target — Claude uses what it needs up to the limit.',
  },
  {
    poolId: 151, domain: 'd3', domainLabel: 'Prompt Caching',
    scenario: 'You cache a system prompt, but after 3 hours the cache expires and costs spike on the next request.',
    question: 'What is the best mitigation?',
    options: [
      'Send a keepalive request every 2 hours to maintain the cache',
      'Design for cache misses — optimize the system prompt size and structure so that even uncached calls are affordable, and rely on caching as a cost bonus',
      'Store the system prompt in a database instead',
      'Never cache prompts — it\'s unreliable',
    ],
    correct: 1,
    explanation: 'Caching is an optimization, not a guarantee. Design for the uncached case to be affordable, and treat caching as a cost bonus. Keepalive requests (A) add complexity for marginal savings.',
  },
  {
    poolId: 152, domain: 'd3', domainLabel: 'Claude Code CLI',
    scenario: 'You use --json-schema to force structured output from Claude Code. The schema requires a "confidence" field with values 0.0-1.0.',
    question: 'What happens if Claude\'s confidence is ambiguous?',
    options: [
      'Claude returns an error',
      'Claude will still produce a value within the schema constraints, but the confidence number may not be well-calibrated — it\'s Claude\'s estimate, not a true probability',
      'Claude leaves the field empty',
      'Claude always returns 0.5 for ambiguous cases',
    ],
    correct: 1,
    explanation: 'Claude produces values matching the schema, but numeric confidence scores are estimates, not calibrated probabilities. Don\'t treat them as precise measurements — use them as directional signals.',
  },
  {
    poolId: 153, domain: 'd3', domainLabel: 'CLAUDE.md Configuration',
    scenario: 'Your CLAUDE.md has grown to 2000 lines with code style, testing rules, API conventions, deployment instructions, and team contacts.',
    question: 'What is the best way to organize it?',
    options: [
      'Keep it as-is — Claude handles long files well',
      'Split into focused sections with clear headers, and use @import for detailed sub-documents so the main CLAUDE.md stays concise with only essential rules',
      'Delete sections that seem less important',
      'Create separate CLAUDE.md files for each rule',
    ],
    correct: 1,
    explanation: 'A concise main CLAUDE.md with @import for detailed docs keeps the active context clean. Claude focuses better on a well-organized, essential ruleset than a massive undifferentiated document.',
  },
  {
    poolId: 154, domain: 'd3', domainLabel: 'Extended Thinking',
    scenario: 'You\'re comparing two approaches: (A) extended thinking with budget_tokens=5000, and (B) asking Claude to "think step by step" in the prompt without extended thinking.',
    question: 'What is the key difference?',
    options: [
      'They are functionally identical',
      'Extended thinking uses a separate hidden reasoning space that doesn\'t count toward output tokens and can\'t leak sensitive reasoning, while "think step by step" includes reasoning in the visible output',
      'Extended thinking is always better than step-by-step prompting',
      '"Think step by step" is deprecated in favor of extended thinking',
    ],
    correct: 1,
    explanation: 'Extended thinking is architecturally different — it\'s a dedicated reasoning budget separate from output. The reasoning is hidden, which prevents information leakage and doesn\'t consume output token budget.',
  },
];

// ─── D4 — Prompt Engineering (16 new) ─────────────────────────────────────
const d4New: PoolQuestion[] = [
  {
    poolId: 155, domain: 'd4', domainLabel: 'System Prompt Design',
    scenario: 'You write a system prompt that says "You are a helpful assistant. Be concise. Be accurate. Be professional. Be friendly. Be thorough. Be efficient." Claude\'s responses are inconsistent.',
    question: 'What is wrong?',
    options: [
      'The prompt needs more adjectives',
      'The instructions are contradictory — "concise" conflicts with "thorough," and "professional" may conflict with "friendly." Prioritize and rank instructions instead',
      'System prompts don\'t support adjectives',
      'Each instruction needs its own system prompt',
    ],
    correct: 1,
    explanation: 'Contradictory instructions cause inconsistent behavior. Claude tries to satisfy all constraints and oscillates. Prioritize: "Primary: Be accurate and concise. Secondary: Maintain a professional but approachable tone."',
  },
  {
    poolId: 156, domain: 'd4', domainLabel: 'Structured Output',
    scenario: 'You use tool_use with a JSON Schema that has a "tags" field defined as {"type": "array", "items": {"type": "string"}}. Claude returns tags: null instead of an empty array.',
    question: 'How should you fix the schema?',
    options: [
      'Change the type to "string" and join tags with commas',
      'Add "nullable": false or handle it in validation code, and add a description: "Always return an array, even if empty: []"',
      'Remove the tags field entirely',
      'Add a default value in the schema',
    ],
    correct: 1,
    explanation: 'Nullable fields can cause null instead of empty arrays. Adding "nullable": false and a description enforcing array format prevents this. Validate with Pydantic on the receiving end for extra safety.',
  },
  {
    poolId: 157, domain: 'd4', domainLabel: 'Validation & Retry',
    scenario: 'A content generation pipeline has 3 retries. On each retry, Claude makes the same mistake. The retry just re-sends the same prompt.',
    question: 'What is missing from the retry loop?',
    options: [
      'A higher temperature for retries',
      'The specific validation error should be included in the retry prompt so Claude knows what to fix — "Your previous response was missing the \'conclusion\' section. Please include it."',
      'More retries (increase from 3 to 10)',
      'A different model for each retry',
    ],
    correct: 1,
    explanation: 'Retries without feedback repeat the same mistake. The validation-retry-feedback pattern requires telling Claude exactly what was wrong so it can correct course. This is fundamental to robust agentic systems.',
  },
  {
    poolId: 158, domain: 'd4', domainLabel: 'Batch Processing',
    scenario: 'You batch process 100 documents. 5 fail validation. You need to retry only the failed ones.',
    question: 'What is the most efficient retry strategy?',
    options: [
      'Reprocess all 100 documents',
      'Track which documents failed and why, then retry only those with specific error feedback added to their prompts',
      'Skip the failed documents and move on',
      'Retry all documents with a stronger model',
    ],
    correct: 1,
    explanation: 'Selective retry with error context is the most efficient approach. Only failed documents are retried, and the error feedback helps Claude correct the specific issue. This saves tokens and time.',
  },
  {
    poolId: 159, domain: 'd4', domainLabel: 'Multi-Instance Review',
    scenario: 'You use Claude Opus to write marketing copy and Claude Sonnet to review it. The reviewer suggests changes that contradict the original creative brief.',
    question: 'How should you resolve this conflict?',
    options: [
      'Always trust the reviewer',
      'Include the creative brief in both instances\' context so the reviewer evaluates against the same criteria, and use a resolver step that weighs adherence to the brief',
      'Always trust the writer',
      'Use the same model for both writing and reviewing',
    ],
    correct: 1,
    explanation: 'Both instances need the full context (creative brief) to evaluate consistently. A resolver step that checks adherence to the brief breaks ties. Without shared context, the reviewer lacks the criteria to judge properly.',
  },
  {
    poolId: 160, domain: 'd4', domainLabel: 'System Prompt Design',
    scenario: 'A system prompt says "Never mention competitors." When a user asks "How does your product compare to CompetitorX?", Claude says "I cannot answer that."',
    question: 'How should you redesign the system prompt?',
    options: [
      'Keep the rule — avoiding competitors is correct',
      'Replace the absolute rule with a redirection strategy: "When users ask about competitors, redirect to our product\'s strengths without naming or disparaging competitors. Focus on our unique value propositions."',
      'Remove all restrictions on mentioning competitors',
      'Have Claude lie about the competitor\'s product',
    ],
    correct: 1,
    explanation: 'Absolute prohibitions create unhelpful dead ends. A redirection strategy handles the user\'s underlying need (comparison) while maintaining the business constraint (no competitor mentions).',
  },
  {
    poolId: 161, domain: 'd4', domainLabel: 'Structured Output',
    scenario: 'Your JSON schema has an enum field for "priority": ["low", "medium", "high"]. Claude sometimes adds a "critical" value that\'s not in the enum.',
    question: 'Besides adding Pydantic validation, what proactive step can reduce this?',
    options: [
      'Add "critical" to the enum to accommodate Claude',
      'Add a description to the field: "Must be exactly one of: low, medium, high. Do NOT use any other values including \'critical\' or \'urgent\'."',
      'Remove the enum and let Claude decide freely',
      'Use a numeric scale instead of strings',
    ],
    correct: 1,
    explanation: 'Explicitly naming the forbidden values in the description ("Do NOT use \'critical\' or \'urgent\'") is a proactive technique. Combined with Pydantic validation for enforcement, this reduces schema violations significantly.',
  },
  {
    poolId: 162, domain: 'd4', domainLabel: 'Validation & Retry',
    scenario: 'You validate Claude\'s output with Pydantic and get: "field \'summary\' is required but missing." You retry with this error. Claude now includes summary but drops the \'action_items\' field.',
    question: 'What pattern does this reveal and how to fix it?',
    options: [
      'Claude is not capable of producing all fields',
      'Single-field retry feedback causes Claude to over-focus on the reported error and forget others — include ALL validation errors in the retry, not just the first one',
      'Increase temperature so Claude explores more',
      'Split the output into separate API calls per field',
    ],
    correct: 1,
    explanation: 'When you report only one error, Claude focuses exclusively on fixing that error, potentially introducing new ones. Report ALL validation errors at once so Claude can fix everything in a single retry.',
  },
  {
    poolId: 163, domain: 'd4', domainLabel: 'Batch Processing',
    scenario: 'You process 1000 customer feedback items through Claude for sentiment analysis. Cost is $50/run. You need to reduce costs.',
    question: 'What is the most effective cost optimization?',
    options: [
      'Use a cheaper, less capable model for all items',
      'Use a two-tier approach: a cheaper model classifies into easy/hard, then Claude processes only the hard/ambiguous items. Easy items use the cheaper model\'s classification directly',
      'Process fewer items',
      'Reduce the system prompt to save input tokens',
    ],
    correct: 1,
    explanation: 'Two-tier routing (cheap model for easy, Claude for hard) is the standard cost optimization pattern. You get Claude\'s quality where it matters and save costs on straightforward cases.',
  },
  {
    poolId: 164, domain: 'd4', domainLabel: 'Multi-Instance Review',
    scenario: 'A legal document review uses 3 Claude instances: one for contract compliance, one for risk assessment, one for formatting. The risk assessor flags a clause that the compliance checker approved.',
    question: 'How should you handle disagreements between review instances?',
    options: [
      'Trust the compliance checker — it\'s the authority on contracts',
      'Implement a resolver/aggregator that reviews all flags, weighs them by reviewer specialty, and produces a final recommendation with rationale',
      'Flag everything and let the human decide',
      'Average the scores from all reviewers',
    ],
    correct: 1,
    explanation: 'A resolver/aggregator that weighs input by specialty is the correct pattern. Compliance may approve the clause language, but risk assessment may correctly identify a business risk. Both perspectives are valid — the resolver synthesizes them.',
  },
];

// ─── D5 — Safety & Evaluation (16 new) ────────────────────────────────────
const d5New: PoolQuestion[] = [
  {
    poolId: 165, domain: 'd5', domainLabel: 'Error Propagation',
    scenario: 'A three-agent pipeline (Fetcher → Processor → Reporter) runs. The Fetcher encounters an API error but returns a partial result. The Processor doesn\'t know the data is incomplete and produces wrong analysis.',
    question: 'What error propagation strategy should you implement?',
    options: [
      'Always stop the pipeline on any error',
      'Attach error metadata to results — the Fetcher should flag the result as "partial" with details about what\'s missing, so downstream agents can adjust their behavior accordingly',
      'Have each agent independently verify the data',
      'Log the error but don\'t pass it to downstream agents',
    ],
    correct: 1,
    explanation: 'Rich error propagation with metadata allows downstream agents to make informed decisions about incomplete data. Binary stop/go (A) is too rigid. Independent verification (C) is redundant. Silent logging (D) hides critical context.',
  },
  {
    poolId: 166, domain: 'd5', domainLabel: 'Human Review',
    scenario: 'A medical advice agent provides recommendations. You need a human doctor to review before sending to patients, but the review queue has 1000 pending items.',
    question: 'What is the most practical approach?',
    options: [
      'Send all recommendations immediately and review later',
      'Implement confidence-based routing — auto-approve high-confidence responses for common conditions, and route only low-confidence or novel cases to human review',
      'Have Claude review its own work',
      'Stop the agent until all reviews are complete',
    ],
    correct: 1,
    explanation: 'Confidence-based routing balances automation with safety. High-confidence cases flow through, while uncertain or complex cases get human oversight. This is scalable and safe.',
  },
  {
    poolId: 167, domain: 'd5', domainLabel: 'Provenance & Attribution',
    scenario: 'A research agent produces a report citing 15 sources. A user wants to verify the claims but the agent doesn\'t track which claims came from which sources.',
    question: 'What should you add to the agent?',
    options: [
      'A bibliography at the end of the report',
      'Inline provenance tracking — each claim should reference its source, with confidence level and retrieval timestamp',
      'Links to all sources without connecting them to specific claims',
      'A disclaimer saying "sources may not be accurate"',
    ],
    correct: 1,
    explanation: 'Inline provenance connects each claim to its source, enabling verification. A simple bibliography (A) doesn\'t connect claims to sources. Disclaimers (D) don\'t help verification.',
  },
  {
    poolId: 168, domain: 'd5', domainLabel: 'Codebase Exploration',
    scenario: 'Claude is exploring a large codebase (100k+ lines) to answer "Where is user authentication handled?" It tries to read the entire codebase and runs out of context.',
    question: 'What is the correct approach?',
    options: [
      'Increase Claude\'s context window size',
      'Use targeted exploration — start with directory structure, then relevant files, using search tools and grep to narrow down before reading specific files',
      'Split the codebase into smaller projects',
      'Summarize the codebase first, then ask questions',
    ],
    correct: 1,
    explanation: 'Progressive narrowing (structure → search → targeted reads) is the efficient approach for large codebases. Claude should use exploration tools strategically rather than trying to read everything.',
  },
  {
    poolId: 169, domain: 'd5', domainLabel: 'Error Propagation',
    scenario: 'A tool returns an unexpected format: {"data": null, "status": "ok"}. Claude interprets this as successful because status is "ok", but the null data causes downstream errors.',
    question: 'How should error detection work?',
    options: [
      'Check only the status field',
      'Validate the full response structure — check both the status AND the data field. Implement schema validation for tool results, not just status codes',
      'Treat any null value as an error',
      'Let downstream agents handle it',
    ],
    correct: 1,
    explanation: 'Full structural validation catches misleading status codes. A "ok" status with null data is a logical error that partial validation misses. Schema validation for tool results is a safety best practice.',
  },
  {
    poolId: 170, domain: 'd5', domainLabel: 'Human Review',
    scenario: 'An AI writing assistant generates blog posts. Sometimes it includes plausible but fabricated statistics (e.g., "73% of companies use AI").',
    question: 'What is the best mitigation strategy?',
    options: [
      'Add a system prompt: "Never use statistics"',
      'Implement a fact-checking step that flags statistical claims, routes them for verification, and adds "unverified" markers when confidence is low',
      'Only allow pre-approved statistics from a whitelist',
      'Remove all numbers from the output',
    ],
    correct: 1,
    explanation: 'Targeted fact-checking with confidence flags is the practical approach. Complete removal of statistics (A, D) limits the output quality. Whitelisting (C) is too rigid for dynamic content.',
  },
  {
    poolId: 171, domain: 'd5', domainLabel: 'Provenance & Attribution',
    scenario: 'A summarization agent produces summaries of news articles. Users share these summaries on social media. Later, the original articles are found to contain errors.',
    question: 'How should the agent handle source reliability?',
    options: [
      'Always trust the source articles',
      'Track provenance metadata including source URL, retrieval date, and source reliability score. Flag summaries when underlying sources are updated or corrected',
      'Never summarize news articles',
      'Add a permanent disclaimer to all summaries',
    ],
    correct: 1,
    explanation: 'Provenance tracking with source metadata enables downstream corrections. When sources are updated, affected summaries can be flagged for re-review. This is essential for information integrity.',
  },
  {
    poolId: 172, domain: 'd5', domainLabel: 'Context Management',
    scenario: 'A customer service conversation runs for 50 turns. The context window is almost full. Claude starts "forgetting" earlier conversation details.',
    question: 'What is the best context management strategy?',
    options: [
      'Start a new conversation every 20 turns',
      'Implement progressive summarization — periodically summarize older turns while keeping recent ones verbatim, maintaining key facts and decisions from the full conversation',
      'Remove all older messages',
      'Increase the max context window parameter',
    ],
    correct: 1,
    explanation: 'Progressive summarization preserves important information from older turns in compressed form while keeping recent turns in full detail. This balances context completeness with window limits.',
  },
  {
    poolId: 173, domain: 'd5', domainLabel: 'Context Management',
    scenario: 'An agent has a system prompt (2000 tokens), conversation history (5000 tokens), and tool results (3000 tokens). Claude\'s response quality degrades with the large context.',
    question: 'What optimization should you apply first?',
    options: [
      'Reduce the system prompt to essentials',
      'Compress tool results — summarize or filter tool outputs before adding them to context, keeping only information relevant to the current task',
      'Delete conversation history',
      'Use a model with a larger context window',
    ],
    correct: 1,
    explanation: 'Tool results often contain the most bloat. Compressing them (summarization, filtering) has the highest impact on context quality while preserving the system prompt\'s instructions and conversation flow.',
  },
  {
    poolId: 174, domain: 'd5', domainLabel: 'Escalation & Ambiguity',
    scenario: 'A customer asks "Can you help me with my account?" The agent can handle billing, technical support, and account settings. It picks billing and starts processing.',
    question: 'What went wrong?',
    options: [
      'The agent should handle all three areas simultaneously',
      'The agent resolved ambiguity incorrectly — it should have asked a clarifying question first: "I can help with billing, technical support, or account settings. Which do you need?"',
      'The agent should always default to technical support',
      'The agent needs more tools to handle all cases',
    ],
    correct: 1,
    explanation: 'When multiple interpretations are equally valid, the correct behavior is to ask a clarifying question rather than guess. Premature commitment to one interpretation can send the conversation down the wrong path.',
  },
  {
    poolId: 175, domain: 'd5', domainLabel: 'Escalation & Ambiguity',
    scenario: 'A support agent handles 95% of queries automatically. The remaining 5% are complex cases that Claude tries to handle but sometimes provides wrong answers.',
    question: 'When should the agent escalate to a human?',
    options: [
      'Never — Claude should handle everything',
      'When confidence is low, when multiple tools fail, when the user expresses frustration, or when the query involves high-stakes decisions (financial, legal, medical)',
      'After every 10 queries as a random check',
      'Only when the user explicitly asks for a human',
    ],
    correct: 1,
    explanation: 'Multi-signal escalation (confidence + tool failures + user sentiment + stakes) catches the cases Claude can\'t handle reliably. This is more robust than any single trigger.',
  },
  {
    poolId: 176, domain: 'd5', domainLabel: 'Codebase Exploration',
    scenario: 'Claude is asked to find a bug in a microservices codebase. It starts reading random files hoping to find the issue.',
    question: 'What structured approach should Claude follow?',
    options: [
      'Read every file in the repository systematically',
      'Follow the error stack trace, identify the failing service, read relevant configuration and code, trace the data flow from input to error point',
      'Ask the user which file has the bug',
      'Search for "bug" or "error" keywords in all files',
    ],
    correct: 1,
    explanation: 'Following the stack trace and tracing data flow is the systematic debugging approach. It\'s targeted, efficient, and mirrors how experienced developers debug. Random reading (A, D) wastes context.',
  },
];

export const questionBank: PoolQuestion[] = [
  ...d1New, ...d2New, ...d3New, ...d4New, ...d5New,
];

export const bankByDomain: Record<string, PoolQuestion[]> = {
  d1: d1New,
  d2: d2New,
  d3: d3New,
  d4: d4New,
  d5: d5New,
};
