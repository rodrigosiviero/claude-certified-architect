/**
 * Question Bank — D1 Agentic Architecture (13 questions)
 *
 * Style: Official exam PDF — detailed scenarios with metrics,
 * architectural decision questions, options A-D with prefixes,
 * explanations that reference each alternative.
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
}

const d1New: PoolQuestion[] = [
  {
    poolId: 121, domain: 'd1', domainLabel: 'Agentic Loops',
    scenario: 'A travel booking agent processes 2,000 requests/day using an agentic loop with a 128K context window. After 8-10 iterations on complex multi-city itineraries, the agent exceeds the context limit and the API returns an invalid_request_error. Analysis shows that 60% of the context is consumed by accumulated tool results from previous iterations.',
    question: 'What is the most effective strategy to prevent context overflow while preserving the agent\'s ability to handle multi-step bookings?',
    options: [
      'A) Implement a sliding context window that retains the system prompt, the last 4 conversation turns, and a compressed summary of earlier tool results, discarding raw outputs older than the summary threshold.',
      'B) Set max_iterations to 5 and force the agent to complete all bookings within that limit, even for complex multi-city itineraries.',
      'C) Reduce the number of tools available to the agent from 8 to 4, eliminating less frequently used tools to save context space.',
      'D) Migrate to a model with a 200K context window and accept the higher per-request cost as a necessary trade-off for complex bookings.',
    ],
    correct: 0,
    explanation: 'A sliding context window with summarization directly addresses the root cause — accumulated tool results consuming 60% of context — while preserving the system prompt\'s instructions and recent conversational context. Option B constrains capability and would fail on genuinely complex itineraries. Option C reduces functionality without addressing the accumulation pattern. Option D delays the problem rather than solving it and increases cost for all requests, not just the edge cases.',
  },
  {
    poolId: 122, domain: 'd1', domainLabel: 'Agentic Loops',
    scenario: 'Your logistics agent has max_iterations=12. On iteration 12, Claude has called check_warehouse_availability and received results, but needs one more turn to formulate the final delivery recommendation. The loop terminates and returns Claude\'s last complete text response, which says "Let me check warehouse availability for you..." — a partial response from iteration 10.',
    question: 'What change would most effectively handle this edge case?',
    options: [
      'A) Increase max_iterations to 20 to ensure the agent always has enough room to complete its reasoning.',
      'B) Return a graceful fallback message acknowledging the incomplete processing and offer to retry, rather than surfacing an outdated partial response from a previous iteration.',
      'C) On the final iteration, inject a message instructing Claude to summarize whatever it has so far into a coherent response.',
      'D) Cache the last tool result and automatically restart the agentic loop with only that result as context.',
    ],
    correct: 2,
    explanation: 'Injecting a final-iteration instruction on the last allowed turn gives Claude the opportunity to produce a coherent synthesis of available information. Option A masks the problem with a larger limit but doesn\'t handle the boundary condition. Option B is a reasonable fallback but discards useful work already done. Option D risks infinite restart loops if the task genuinely requires more iterations than allowed.',
  },
  {
    poolId: 123, domain: 'd1', domainLabel: 'Tool Use Flow',
    scenario: 'Your insurance claims agent calls three tools in parallel: verify_policy, check_coverage, and get_claim_history. Tool A returns in 200ms, Tool B returns an error immediately (policy number not found), and Tool C returns in 3 seconds with full results. The agent code currently waits for all three to complete before sending results back to Claude.',
    question: 'What is the most effective approach for handling the mixed success/failure result?',
    options: [
      'A) Return only the successful results to Claude and silently omit the failed tool, allowing Claude to proceed with available information.',
      'B) Return all three results together — the two successful ones as normal tool_result messages and the failed one with is_error: true and the error details, allowing Claude to reason about the failure and adjust its approach.',
      'C) Retry the failed tool three times with exponential backoff before returning any results to Claude, ensuring complete data for its next reasoning step.',
      'D) Discard all results when any tool fails and ask the user to resubmit their claim with the correct policy number.',
    ],
    correct: 1,
    explanation: 'Returning all results with is_error: true for failures gives Claude the complete picture — it can use the successful data, inform the user about the policy error, and suggest corrective action. Option A silently hides the failure, preventing Claude from addressing it. Option C adds latency that may not be necessary — the error is definitive (policy not found), not transient. Option D is unnecessarily destructive, discarding valid results from the other two tools.',
  },
  {
    poolId: 124, domain: 'd1', domainLabel: 'Multi-Agent Orchestration',
    scenario: 'A research system uses three specialist agents: WebSearchAgent, DataAnalyst, and ReportWriter. The user submits "Analyze Q4 revenue trends." WebSearchAgent returns raw HTML tables and JSON from financial APIs. DataAnalyst receives this data but its system prompt specifies "Accepts CSV or structured JSON with typed fields" — the raw HTML causes it to produce malformed analysis that ReportWriter then incorporates into the final report.',
    question: 'What is the root architectural issue and the most effective fix?',
    options: [
      'A) The DataAnalyst agent is not capable enough to handle diverse data formats. Upgrade to a more capable model for the analyst role.',
      'B) The system lacks a shared context layer or data normalization step between agents. Add an intermediary that transforms WebSearchAgent output into the structured format DataAnalyst expects before routing.',
      'C) The user\'s query was too vague, causing WebSearchAgent to return unstructured data. Add a query refinement step before dispatching to agents.',
      'D) Merge WebSearchAgent and DataAnalyst into a single agent that handles both searching and analysis, eliminating the data format mismatch.',
    ],
    correct: 1,
    explanation: 'The root cause is an architectural gap — no data contract between agents. Each agent works in isolation with different input expectations. An intermediary normalization layer enforces a data contract between pipeline stages. Option A blames the model rather than the architecture. Option C misdiagnoses the issue — the query is specific enough; the problem is format mismatch. Option D creates a monolithic agent that loses the benefits of specialization.',
  },
  {
    poolId: 125, domain: 'd1', domainLabel: 'Agentic Loops',
    scenario: 'Your coding agent follows this workflow: read the failing test, analyze the error, write a fix, run the test again. On average, it takes 3.2 iterations to fix a bug, but 15% of cases loop 8+ times as Claude oscillates between two incorrect approaches without converging.',
    question: 'This iterative pattern is best described as what, and what would most effectively address the oscillation?',
    options: [
      'A) A MapReduce pattern. Address oscillation by having Claude generate three independent fix attempts and selecting the one that passes tests.',
      'B) An Observe-Orient-Decide-Act (OODA) loop. Address oscillation by injecting a message after 4 failed attempts noting the repeated approaches and asking Claude to try a fundamentally different strategy.',
      'C) A chain-of-thought reasoning pattern. Address oscillation by increasing temperature to encourage more diverse solution attempts.',
      'D) A state machine pattern. Address oscillation by hard-coding the fix strategy so Claude follows a deterministic path.',
    ],
    correct: 1,
    explanation: 'The observe-orient-decide-act pattern describes the iterative debugging loop perfectly. The oscillation — repeating failed approaches — is a known failure mode where the loop gets stuck. Injecting a meta-observation ("you\'ve tried X twice and it failed both times, try a different approach") breaks the cycle. Option A is the wrong pattern for sequential debugging. Option C misidentifies the pattern and increasing temperature introduces randomness rather than strategic redirection. Option D eliminates the agentic flexibility that makes the loop valuable.',
  },
  {
    poolId: 126, domain: 'd1', domainLabel: 'Multi-Agent Orchestration',
    scenario: 'A document processing pipeline uses four agents in sequence: IngestAgent → ClassifyAgent → ExtractAgent → ValidateAgent. Each agent is a separate Claude API call costing $0.03 per request. For a batch of 100 documents, total cost is $12. The ValidateAgent rejects 20% of documents and sends them back to IngestAgent for reprocessing, which means those 20 documents run through all 4 agents again at full cost.',
    question: 'What architectural change would most reduce costs while maintaining quality?',
    options: [
      'A) Have the orchestrator send rejected documents back only to the specific agent that produced the problematic output, with the validation error as context, rather than restarting the full pipeline.',
      'B) Remove the ValidateAgent and trust the ExtractAgent to produce accurate output, eliminating one API call per document.',
      'C) Process all documents twice preemptively and keep the version with fewer validation errors.',
      'D) Consolidate all four agents into a single Claude call that handles ingestion, classification, extraction, and validation in one prompt.',
    ],
    correct: 0,
    explanation: 'Targeted retry to the failing agent avoids redundant reprocessing of stages that already passed validation. The orchestrator passes the validation error as context so the specific agent can correct its output. Option B sacrifices quality control. Option C doubles cost for all documents, not just the 20% that fail. Option D creates a complex monolithic prompt that loses the benefits of specialization and is harder to debug.',
  },
  {
    poolId: 127, domain: 'd1', domainLabel: 'Tool Use Flow',
    scenario: 'Your e-commerce agent receives the message: "I want to return the blue shoes I bought last week and also check if you have the same model in red in size 10." This is a multi-intent request requiring both a return processing flow and an inventory check. The agent\'s current architecture processes only the first detected intent per conversation turn.',
    question: 'What architectural change would best handle multi-intent requests?',
    options: [
      'A) Decompose the request within the agentic loop — let Claude identify both intents and handle them sequentially within the same loop, calling the appropriate tools for each intent before responding.',
      'B) Route the request to two separate agents in parallel — one for returns and one for inventory — and merge their responses before sending to the user.',
      'C) Ask the user to submit each request separately to avoid confusing the agent.',
      'D) Combine the return and inventory tools into a single multi-purpose tool that handles both operations.',
    ],
    correct: 0,
    explanation: 'Claude can decompose multi-intent requests and handle each within the same agentic loop, calling tools for each intent in sequence. This is more natural and efficient than spawning multiple agents for a single conversation turn. Option B introduces orchestration complexity for what Claude can handle natively. Option C degrades user experience. Option D creates a poorly scoped tool that violates single-responsibility principles.',
  },
  {
    poolId: 128, domain: 'd1', domainLabel: 'Tool Use Flow',
    scenario: 'Your agent handles customer support. In the same API response, Claude produces both a text block saying "I\'ll look up your order now" and a tool_use block requesting lookup_order. Your code currently checks: if there\'s a tool_use, execute the tool; if there\'s text, display it. It handles one or the other but not both.',
    question: 'How should you handle responses that contain both text and tool_use content blocks?',
    options: [
      'A) Ignore the text block and only process the tool_use block, since tool execution takes priority over user-facing messages.',
      'B) Process both — display the text block to the user immediately and execute the tool_use block, then continue the agentic loop with the tool result.',
      'C) Strip the text block before processing to avoid showing premature messages that may not match the final outcome.',
      'D) Return an error to the API and retry the request, requesting Claude to respond with either text or tool_use but not both.',
    ],
    correct: 1,
    explanation: 'Claude can return mixed content blocks (text + tool_use) in a single response — this is by design. The text block provides immediate user feedback while the tool executes, improving perceived responsiveness. Option A discards useful user-facing context. Option C prevents transparent communication. Option D is incorrect — mixed content is valid API behavior, not an error condition.',
  },
  {
    poolId: 129, domain: 'd1', domainLabel: 'Multi-Agent Orchestration',
    scenario: 'A content moderation pipeline has three agents: DetectionAgent (flags potential violations), AnalysisAgent (evaluates severity and context), and ActionAgent (applies moderation decisions). The ActionAgent occasionally needs to request additional context — for example, checking the user\'s post history before deciding on a ban. Currently, it returns control to the orchestrator, which calls DetectionAgent again to gather this context, even though DetectionAgent\'s purpose is violation detection, not context gathering.',
    question: 'What is the most effective architectural improvement?',
    options: [
      'A) Give the ActionAgent a scoped tool to query user history directly, avoiding unnecessary round-trips through DetectionAgent for context it doesn\'t need.',
      'B) Have the ActionAgent always request the full user history upfront at the start of every moderation decision.',
      'C) Remove the orchestrator and have the three agents communicate directly with each other.',
      'D) Merge the AnalysisAgent and ActionAgent since their responsibilities overlap when context gathering is needed.',
    ],
    correct: 0,
    explanation: 'Giving ActionAgent a scoped tool for user history queries follows the principle of least privilege — it gets exactly the capability it needs without routing through an irrelevant agent. Option B over-fetches data for every case when only 15-20% need history context. Option C removes the coordination layer that prevents circular dependencies. Option D conflates two distinct responsibilities (evaluating severity vs. taking action) that benefit from separation.',
  },
  {
    poolId: 130, domain: 'd1', domainLabel: 'Agentic Loops',
    scenario: 'An e-commerce agent\'s production logs show that 8% of conversations exceed 15 agentic loop iterations. Analysis reveals two patterns: (1) Claude calls the same search tool with nearly identical queries 4-5 times, and (2) when no results are found, Claude retries with minor query variations instead of informing the user.',
    question: 'What combination of changes would most effectively reduce unnecessary iterations?',
    options: [
      'A) Increase max_iterations to 25 to accommodate complex queries, and add a system prompt instruction to "always find a result."',
      'B) Implement tool-call deduplication that detects repeated calls with the same parameters and injects the previous result with a note, plus add explicit instructions for handling empty result sets (e.g., "If search returns no results after 2 attempts, inform the user and suggest alternatives").',
      'C) Remove the search tool and pre-load all product data into the system prompt to eliminate the need for search iterations entirely.',
      'D) Add a separate classifier that pre-processes user queries and directly maps them to product IDs, bypassing the agentic loop for search operations.',
    ],
    correct: 1,
    explanation: 'Tool-call deduplication addresses pattern (1) by short-circuiting repeated identical calls, and explicit empty-result handling addresses pattern (2) by giving Claude a clear exit strategy. Option A worsens both problems — more iterations and an unrealistic instruction. Option C is impractical for any real product catalog. Option D adds infrastructure for what should be a prompt engineering fix.',
  },
  {
    poolId: 131, domain: 'd1', domainLabel: 'Tool Use Flow',
    scenario: 'You deploy a send_email tool for your customer service agent. During the first week, 3% of sent emails contain incorrect order numbers or address wrong customers. The tool executes immediately on Claude\'s call with no intermediate step.',
    question: 'What is the most appropriate safeguard for this high-stakes tool?',
    options: [
      'A) Add a system prompt instruction: "Always verify email content before sending" and trust Claude to self-review.',
      'B) Implement a human-in-the-loop pattern: the tool queues the email draft for human approval, returns a "pending approval" status to Claude, and only sends after explicit human confirmation.',
      'C) Add a second Claude call after the email is drafted to review it for accuracy before sending.',
      'D) Remove the send_email tool entirely and handle all email communications through a separate non-AI system.',
    ],
    correct: 1,
    explanation: 'Human-in-the-loop is the standard pattern for high-stakes irreversible actions. The tool queues for approval rather than executing immediately, combining automation efficiency with human judgment on critical outputs. Option A relies on probabilistic self-correction, which is insufficient when errors have real customer impact. Option C adds cost and latency but still lacks the judgment of a human reviewer. Option D eliminates automation benefits entirely.',
  },
  {
    poolId: 132, domain: 'd1', domainLabel: 'Agentic Loops',
    scenario: 'A knowledge base search tool returns 50 results for a typical query. Claude calls it 6 times per conversation on average, each time refining the search query slightly. Total tool result content per conversation averages 15,000 tokens — consuming significant context window space with largely redundant information.',
    question: 'What is the most effective optimization to reduce context consumption from search results?',
    options: [
      'A) Implement result caching — if a similar query was already executed, return a cached summary instead of re-executing the search, and compress all search results to top-3 relevant items before returning to Claude.',
      'B) Increase the search tool\'s relevance threshold so it returns fewer results per query, even if this means occasionally missing relevant documents.',
      'C) Remove the search tool and embed all knowledge base content in the system prompt as static context.',
      'D) Add a system prompt instruction: "Only search once per conversation to minimize token usage."',
    ],
    correct: 0,
    explanation: 'Caching similar queries prevents redundant tool calls, while compressing results to top-3 items reduces per-call token consumption. Together these address both the call frequency and result size problems. Option B trades recall for efficiency without addressing the redundancy pattern. Option C is impractical for any knowledge base larger than a few pages. Option D is a blanket restriction that prevents Claude from refining searches when initial queries are genuinely unproductive.',
  },
  {
    poolId: 133, domain: 'd1', domainLabel: 'Multi-Agent Orchestration',
    scenario: 'A customer support system uses a Coordinator agent that classifies incoming requests and routes to one of four specialist agents: BillingAgent, TechnicalAgent, AccountAgent, or EscalationAgent. Currently, the Coordinator makes a single classification decision. When users send ambiguous messages like "my account is broken" (could be billing issue, technical problem, or account settings), the Coordinator routes to the wrong specialist 35% of the time, requiring a costly handoff to the correct agent mid-conversation.',
    question: 'What is the most effective improvement to the Coordinator\'s routing accuracy?',
    options: [
      'A) Have the Coordinator ask a clarifying question when confidence is low, rather than committing to a single route immediately. Define a confidence threshold and explicit clarification prompts for ambiguous cases.',
      'B) Route all ambiguous requests to EscalationAgent as a safe default, since human escalation handles all request types.',
      'C) Merge all four specialist agents into a single generalist agent that can handle any request type without routing.',
      'D) Always route requests to two specialist agents in parallel and use whichever agent\'s response scores higher on a relevance metric.',
    ],
    correct: 0,
    explanation: 'Clarifying questions resolve ambiguity before committing to a route, eliminating the 35% misclassification rate at the source. This is more efficient than mid-conversation handoffs. Option B overloads the escalation path with routine requests that specialists should handle. Option C loses the depth of specialized knowledge. Option D doubles processing cost and introduces complexity for what should be a classification improvement.',
  },
];

export default d1New;
