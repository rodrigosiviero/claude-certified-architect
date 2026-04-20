/**
 * Question Bank — D3 Tool Design & Integration (10 questions)
 */
import type { PoolQuestion } from './d1';

const d3New: PoolQuestion[] = [
  {
    poolId: 146, domain: 'd3', domainLabel: 'Tool Selection & Design',
    scenario: 'Your medical triage agent has two tools: lookup_symptoms (accepts a symptom description string) and find_conditions (accepts a symptom description string). Both return overlapping information — lookup_symptoms returns general symptom details while find_conditions returns possible diagnoses. Claude calls the wrong tool 28% of the time, using find_conditions when it should look up symptom specifics and vice versa.',
    question: 'What is the most effective first step to improve tool selection accuracy?',
    options: [
      'A) Enhance each tool\'s description with specific guidance about input formats it handles, example queries that should route to it, and explicit boundaries explaining when to use it versus the other tool.',
      'B) Add 8 few-shot examples to the system prompt demonstrating correct tool selection for various symptom descriptions.',
      'C) Merge both tools into a single triage_lookup tool that returns both symptom details and possible diagnoses.',
      'D) Implement a routing classifier that analyzes the user\'s message and pre-selects the appropriate tool before sending to Claude.',
    ],
    correct: 0,
    explanation: 'Tool descriptions are the primary mechanism Claude uses for tool selection. When two tools accept similar inputs but serve different purposes, detailed descriptions with explicit boundaries and example queries are the most direct fix. This is a low-effort, high-leverage intervention. Option B adds token overhead without fixing the root cause. Option C is a valid architectural choice but isn\'t the "first step" — it requires more refactoring. Option D over-engineers a solution that Claude can handle natively with better descriptions.',
  },
  {
    poolId: 147, domain: 'd3', domainLabel: 'Tool Selection & Design',
    scenario: 'Your agent has a search_products tool that accepts a query string and returns matching products. Currently it returns all matching fields (name, description, price, availability, reviews, specifications, related products) — averaging 4,200 tokens per result for popular items. Claude typically only needs the name, price, and availability to answer user questions.',
    question: 'What tool design change would most optimize token usage?',
    options: [
      'A) Add a fields parameter to the tool definition that lets Claude specify which fields it needs, defaulting to a minimal set (name, price, availability).',
      'B) Remove all fields except name, price, and availability from the tool\'s response schema.',
      'C) Add a system prompt instruction: "Only request the search_products tool when you need basic product info, not detailed specifications."',
      'D) Create two separate tools: search_products_basic (name, price, availability) and search_products_detailed (all fields).',
    ],
    correct: 0,
    explanation: 'A fields parameter gives Claude control over response granularity while maintaining a single tool. The default returns the minimal set needed for most queries, and Claude can request additional fields when needed. Option B removes capability that some queries genuinely need. Option C doesn\'t address token consumption — it only limits when the tool is called. Option D creates unnecessary tool proliferation when a single parameterized tool suffices.',
  },
  {
    poolId: 148, domain: 'd3', domainLabel: 'API Integration Patterns',
    scenario: 'Your inventory management agent needs real-time stock data from a warehouse API. The API has a rate limit of 100 requests/minute. During peak hours, the agent handles 30+ concurrent conversations, each making 3-4 stock queries. You\'re hitting the rate limit 15% of the time, causing tool failures that leave users without stock information.',
    question: 'What is the most effective integration pattern to handle rate limiting?',
    options: [
      'A) Implement request queuing with token-bucket rate limiting in your tool execution layer, so tool calls wait for available capacity rather than failing. Return a "checking inventory..." status to Claude while waiting.',
      'B) Cache stock data with a 5-minute TTL. If cached data exists, return it instead of making a new API call. Only call the API for cache misses.',
      'C) Negotiate a higher rate limit with the warehouse API provider.',
      'D) Batch all stock queries from all conversations and execute them in a single API call every 30 seconds.',
    ],
    correct: 0,
    explanation: 'Request queuing with token-bucket rate limiting ensures tool calls never fail due to rate limits — they wait for available capacity. Combined with user-facing status messages, this maintains responsiveness. Option B is a good complement but alone risks serving stale data during rapid inventory changes. Option C is outside your control as an architectural solution. Option D introduces a 30-second latency that degrades real-time responsiveness.',
  },
  {
    poolId: 149, domain: 'd3', domainLabel: 'Tool Error Handling',
    scenario: 'Your booking agent calls a payment_gateway tool to process credit card charges. The tool returns three types of responses: success (transaction completed), declined (card was declined with reason code), and timeout (no response within 10 seconds). Currently, your agent treats timeouts the same as declines, telling users "your card was declined" — but 60% of timeouts are actually successful transactions that just didn\'t return in time.',
    question: 'How should you handle payment gateway timeouts to avoid misleading users?',
    options: [
      'A) On timeout, return a structured result to Claude indicating "payment status unknown — transaction may have succeeded" with a reconciliation tool to check the transaction status, allowing Claude to inform the user accurately and offer to verify.',
      'B) Increase the timeout threshold to 30 seconds to capture more successful responses.',
      'C) On timeout, automatically retry the payment to ensure it goes through.',
      'D) Switch to a synchronous payment processing model where the user waits until the transaction definitively completes or fails.',
    ],
    correct: 0,
    explanation: 'Structured error context with a reconciliation path lets Claude communicate honestly with the user ("your payment is processing, let me check the status") rather than giving incorrect information. This handles the 60% false-negative rate without guessing. Option B increases latency for all transactions. Option C risks double-charging the 60% that actually succeeded. Option D may not be feasible with the existing payment gateway API.',
  },
  {
    poolId: 150, domain: 'd3', domainLabel: 'Tool Error Handling',
    scenario: 'Your data pipeline agent calls an external data source tool that returns JSON. Occasionally (about 5% of calls), the API returns malformed JSON with truncated responses. When Claude receives the malformed data, it attempts to reason about incomplete information and produces outputs with hallucinated values filling the gaps.',
    question: 'What is the most effective error handling strategy?',
    options: [
      'A) Add a JSON validation layer in your tool execution code. If validation fails, return a structured error to Claude: is_error: true with the message "External data source returned malformed response. Do not attempt to infer the missing data. Inform the user and suggest retrying."',
      'B) Add a system prompt instruction: "Never trust external data. Always validate response integrity before using it."',
      'C) Retry the API call up to 3 times on malformed responses before reporting an error.',
      'D) Have Claude attempt to reconstruct the missing data by inferring it from the partial response.',
    ],
    correct: 0,
    explanation: 'Programmatic validation with explicit error instructions prevents Claude from reasoning about incomplete data. The is_error: true flag combined with "do not infer" instructions gives Claude clear guidance. Option B relies on probabilistic compliance — Claude may still attempt to use partial data. Option C is reasonable as a complement but shouldn\'t be the sole strategy — persistent failures still need handling. Option D is exactly the behavior that causes hallucinated outputs.',
  },
  {
    poolId: 151, domain: 'd3', domainLabel: 'API Integration Patterns',
    scenario: 'Your support agent integrates with three external systems: CRM (REST API, 2s avg response), Knowledge Base (GraphQL, 500ms avg), and Ticketing System (SOAP/XML, 4s avg). When a user asks a complex question requiring data from all three systems, the agent calls them sequentially, resulting in 6.5 seconds total tool execution time per complex query.',
    question: 'What architectural change would most reduce latency for complex queries?',
    options: [
      'A) Execute independent tool calls in parallel — if Claude requests multiple tools in one turn, execute them concurrently rather than sequentially, reducing total execution time to the longest individual call (~4 seconds).',
      'B) Pre-fetch data from all three systems at the start of every conversation, regardless of whether it will be needed.',
      'C) Consolidate all three systems behind a single API gateway that handles routing internally.',
      'D) Cache all CRM and Knowledge Base responses indefinitely to eliminate repeated calls.',
    ],
    correct: 0,
    explanation: 'Parallel execution of independent tool calls is the most direct latency optimization. When Claude requests multiple tools in one turn, executing them concurrently reduces total wait time to the slowest call rather than the sum of all calls. This is a fundamental API integration pattern. Option B wastes resources on data that may never be needed. Option C adds infrastructure complexity without reducing the underlying latency. Option D serves stale data for systems where real-time accuracy matters.',
  },
  {
    poolId: 152, domain: 'd3', domainLabel: 'Tool Selection & Design',
    scenario: 'Your agent has 15 tools available. Production analysis shows Claude frequently selects a suboptimal tool for edge cases — for example, using search_knowledge_base when the user\'s question is about account settings that should use get_account_preferences. The tools have one-line descriptions like "Searches the knowledge base" and "Gets account preferences."',
    question: 'What is the most impactful improvement to tool selection for edge cases?',
    options: [
      'A) Add a routing classifier that maps user intents to specific tools, bypassing Claude\'s tool selection for known patterns.',
      'B) Enhance tool descriptions with detailed use cases, example queries each tool handles, and explicit notes about when NOT to use it. For example: "Searches the knowledge base for product documentation, troubleshooting guides, and feature explanations. NOT for account-specific settings or personal preferences — use get_account_preferences for those."',
      'C) Remove rarely-used tools to reduce the selection space Claude must navigate.',
      'D) Add a two-step tool selection process: first Claude selects a tool category, then selects the specific tool within that category.',
    ],
    correct: 1,
    explanation: 'Detailed descriptions with positive and negative examples directly address the selection confusion. Claude uses tool descriptions as its primary selection mechanism — when descriptions are minimal, edge cases fall through. Negative examples ("NOT for account-specific settings") are especially powerful for disambiguating similar tools. Option A adds infrastructure for what better descriptions can solve. Option C removes functionality. Option D adds unnecessary complexity to the tool selection process.',
  },
  {
    poolId: 153, domain: 'd3', domainLabel: 'API Integration Patterns',
    scenario: 'Your logistics agent calls a shipment tracking API that returns data in a proprietary XML format. Your current implementation parses the XML in the tool execution layer, extracts relevant fields, and returns a clean JSON object to Claude. This parsing adds 150ms per call and requires maintenance whenever the API changes its XML schema.',
    question: 'Is this parsing layer well-designed, and what principle does it follow?',
    options: [
      'A) No — pass the raw XML to Claude and let it parse the response directly, eliminating the maintenance burden.',
      'B) Yes — this follows the adapter pattern, translating between the external API\'s format and the format your agent expects. This isolates Claude from external API changes and provides a clean interface.',
      'C) No — switch the external API to return JSON instead of XML.',
      'D) Yes — but the parsing should be moved to Claude\'s system prompt as format conversion instructions to save server-side processing time.',
    ],
    correct: 1,
    explanation: 'The adapter pattern isolates the agent from external API details. When the XML schema changes, only the adapter layer needs updating — Claude continues receiving the same JSON format. This separation of concerns is a fundamental integration best practice. Option A pushes complexity to Claude, wasting context tokens on parsing. Option C may not be within your control. Option D moves deterministic logic to probabilistic processing, which is less reliable.',
  },
  {
    poolId: 154, domain: 'd3', domainLabel: 'Tool Error Handling',
    scenario: 'Your e-commerce agent\'s place_order tool fails 3% of the time due to inventory race conditions — the item was in stock when checked but sold out by the time the order is placed. The current error handling returns a generic "Order failed" message, and Claude responds: "I\'m sorry, your order could not be processed. Please try again." — which frustrates users who don\'t understand why.',
    question: 'What error handling improvement would provide the best user experience?',
    options: [
      'A) Return a structured error with specific context: { is_error: true, error_type: "inventory_conflict", item: "Blue Running Shoes, Size 10", suggested_alternatives: [...] }. Claude can then explain the specific issue and offer alternatives.',
      'B) Retry the order automatically 3 times before reporting failure, since inventory may become available.',
      'C) Remove the place_order tool and require users to order through the website to avoid inventory conflicts.',
      'D) Add a system prompt instruction: "When orders fail, apologize and ask the user to contact support."',
    ],
    correct: 0,
    explanation: 'Structured error context with specific details (item name, error type, alternatives) enables Claude to provide an informative, actionable response rather than a generic apology. This transforms a frustrating experience into a helpful one. Option B wastes time on retries that are unlikely to succeed. Option C eliminates automation benefits. Option D produces a generic response that doesn\'t help the user understand or resolve the issue.',
  },
  {
    poolId: 155, domain: 'd3', domainLabel: 'Tool Selection & Design',
    scenario: 'You are designing tools for a financial advisory agent. You need tools for: checking account balances, transferring funds, viewing transaction history, and setting up recurring payments. You\'re deciding between two designs: (A) four individual tools, each with a focused purpose and clear description, or (B) one financial_actions tool with an action parameter that routes to different operations internally.',
    question: 'Which design approach is recommended and why?',
    options: [
      'A) Design B (single tool with action parameter) — it reduces tool count, simplifies the tool list Claude navigates, and centralizes error handling.',
      'B) Design A (four individual tools) — each tool has a focused description that gives Claude clear selection signals. Claude selects tools based on name and description, and distinct names like check_balance vs. transfer_funds provide stronger selection cues than a generic financial_actions tool with an action parameter.',
      'C) Both designs are equivalent — Claude handles both approaches with equal accuracy.',
      'D) Use Design A for read operations (balance, history) and Design B for write operations (transfer, recurring payments) to optimize for safety.',
    ],
    correct: 1,
    explanation: 'Individual tools with focused names and descriptions give Claude the strongest selection signals. Tool selection is the first step in tool use — if Claude can\'t reliably select the right tool, downstream parameters don\'t matter. Distinct tool names are immediately clear: check_balance vs. transfer_funds needs no interpretation. Option A concentrates complexity in one tool, making parameter selection harder. Option C doesn\'t account for the empirically better selection accuracy with distinct tools. Option D adds unnecessary design inconsistency.',
  },
];

export default d3New;
