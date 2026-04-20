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
  examTask: string;
  scenario: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const d1New: PoolQuestion[] = [
  {
    poolId: 121, domain: 'd1', domainLabel: 'Agentic Loops',
    examTask: '1.1 Agentic Loops',
    scenario: 'A travel booking agent processes 2,000 requests/day using an agentic loop with a 128K context window. After 8-10 iterations on complex multi-city itineraries, the agent exceeds the context limit and the API returns an invalid_request_error. Analysis shows that 60% of the context is consumed by accumulated tool results from previous iterations.',
    question: 'What is the most effective strategy to prevent context overflow while preserving the agent\'s ability to handle multi-step bookings?',
    options: [
      'A) Implement a sliding context window that retains the system prompt, the last 4 conversation turns, and a compressed summary of earlier tool results, discarding raw outputs older than the summary threshold.',
      'B) Set max_iterations to 5 and instruct the agent to complete all bookings within that limit, restructuring complex itineraries into simplified single-city bookings when the limit is approached.',
      'C) Reduce the number of tools available to the agent from 8 to 4, consolidating overlapping tools like search_flights and search_hotels into a single search_travel tool to save context.',
      'D) Migrate to a model with a 200K context window and add a pre-processing step that estimates context usage before each API call, falling back to a simpler workflow when usage exceeds 150K.',
    ],
    correct: 0,
    explanation: 'A sliding context window with compression preserves the system prompt and recent interactions while summarizing older tool results — this directly addresses the 60% context consumption from accumulated results. B artificially constrains the agent, sacrificing functionality. C reduces agent capability by removing tool granularity. D delays the problem at higher cost rather than solving it. [Task 1.1 — Agentic Loops: managing context within the loop is essential for long-running agents.]',
  },
  {
    poolId: 122, domain: 'd1', domainLabel: 'Agentic Loops',
    examTask: '1.1 Agentic Loops',
    scenario: 'A customer support agent uses an agentic loop that checks stop_reason to decide whether to continue. The loop has max_iterations set to 30. In production, you observe that 15% of conversations terminate at the max_iterations limit without reaching end_turn. Review shows these are cases where the agent keeps calling tools but never produces a final response.',
    question: 'What loop modification would most effectively reduce premature max_iterations terminations?',
    options: [
      'A) Increase max_iterations to 50 to give the agent more room to complete its task.',
      'B) Add a convergence check: if the agent calls the same tool with overlapping parameters for 3 consecutive iterations, inject a system message instructing it to summarize findings and produce a final response.',
      'C) Replace stop_reason checking with a sentiment analysis pass on Claude\'s response text to detect when the agent considers the task complete.',
      'D) Remove the max_iterations limit entirely and rely solely on stop_reason for loop termination.',
    ],
    correct: 1,
    explanation: 'A convergence check detects repetitive tool usage (a common cause of max_iterations exhaustion) and proactively redirects the agent toward producing a final response. A merely hides the problem. C replaces a reliable mechanism (stop_reason) with an unreliable one (sentiment analysis). D creates a risk of infinite loops. [Task 1.1 — Agentic Loops: detecting and handling stuck loops is a core operational concern.]',
  },
  {
    poolId: 123, domain: 'd1', domainLabel: 'Multi-Agent Orchestration',
    examTask: '1.2 Multi-Agent Orchestration',
    scenario: 'A research system uses an orchestrator that decomposes user queries into subtasks assigned to specialist agents. After processing 500 queries, analysis shows that 22% of results contain contradictions between subagent outputs (e.g., the market agent reports "growth is accelerating" while the macro agent reports "sector is contracting"). The orchestrator synthesizes outputs without checking for consistency.',
    question: 'What orchestration change would most effectively reduce contradictory outputs in the final report?',
    options: [
      'A) Add a consistency validation step where the orchestrator compares key claims across subagent outputs before synthesis, flags contradictions, and requests clarification from the relevant agents before producing the final report.',
      'B) Reduce the number of specialist agents from 4 to 2, minimizing the chance of conflicting perspectives by having fewer independent analyses.',
      'C) Instruct each specialist agent to include a confidence score with every claim, then have the orchestrator select only the highest-confidence claims for the final report.',
      'D) Have the orchestrator assign overlapping subtasks to multiple agents and use majority voting to determine which claims appear in the final output.',
    ],
    correct: 0,
    explanation: 'A consistency validation step directly addresses the root cause: the orchestrator blindly synthesizes without checking for contradictions. By flagging and resolving conflicts before synthesis, the output quality improves. B reduces coverage. C selects claims by confidence but doesn\'t resolve factual contradictions — both agents may be confident in conflicting claims. D adds significant cost and latency without addressing the synthesis logic. [Task 1.2 — Multi-Agent Orchestration: cross-agent consistency is a key orchestration responsibility.]',
  },
  {
    poolId: 124, domain: 'd1', domainLabel: 'Subagent Invocation',
    examTask: '1.3 Subagent Invocation & Context Isolation',
    scenario: 'A code review system spawns a subagent for each file in a pull request. The parent agent passes the full PR context (diff, description, coding standards) to every subagent. A PR with 18 files generates 18 subagent calls, each receiving 4,200 tokens of shared context plus 800-2,500 tokens of file-specific context. Total token cost per PR review: ~95,000 tokens.',
    question: 'How can token cost be reduced while maintaining review quality?',
    options: [
      'A) Process all files in a single agent call instead of spawning subagents, eliminating the repeated shared context overhead.',
      'B) Pass only the file-specific diff and a condensed coding standards summary (~1,200 tokens) to each subagent, having the parent agent handle cross-file consistency in a separate integration pass.',
      'C) Reduce coding standards documentation to 500 tokens by removing examples and edge case guidance, cutting the shared context by approximately 60%.',
      'D) Spawn subagents only for files with more than 50 lines changed, processing smaller files in a single batch to reduce the number of subagent invocations.',
    ],
    correct: 1,
    explanation: 'Separating file-specific review (subagents with minimal context) from cross-file consistency (parent integration pass) dramatically reduces per-subagent context while preserving review coverage. A loses parallelism and may hit context limits. C sacrifices review quality by removing guidance. D skips review of smaller files, potentially missing issues. [Task 1.3 — Subagent Invocation: context isolation is key to efficient subagent usage.]',
  },
  {
    poolId: 125, domain: 'd1', domainLabel: 'Workflow Enforcement',
    examTask: '1.4 Workflow Enforcement & Structured Handoffs',
    scenario: 'A loan processing system requires agents to complete steps in strict order: credit_check → income_verification → risk_assessment → approval_decision. Production logs show that in 8% of cases, the agent skips income_verification and proceeds directly from credit_check to risk_assessment, creating compliance violations.',
    question: 'What approach would most reliably enforce the required step sequence?',
    options: [
      'A) Add explicit ordering instructions to the system prompt: "You must complete all four steps in order. Never skip income_verification."',
      'B) Implement a state machine in the orchestration layer where each step must return a success status before the next step\'s tools become available, making it impossible to invoke risk_assessment tools until income_verification reports completion.',
      'C) Add a post-processing validator that checks the conversation log for all required steps after the agent completes, rejecting responses that skip any step.',
      'D) Combine credit_check and income_verification into a single step so there is no opportunity to skip between them.',
    ],
    correct: 1,
    explanation: 'A state machine with tool gating provides deterministic enforcement — the agent physically cannot call risk_assessment tools until income_verification completes. A relies on probabilistic LLM compliance, which the data shows fails 8% of the time. C detects violations after they happen rather than preventing them. D may work for adjacent steps but doesn\'t generalize to multi-step enforcement. [Task 1.4 — Workflow Enforcement: programmatic gates are essential for compliance-critical sequences.]',
  },
  {
    poolId: 126, domain: 'd1', domainLabel: 'SDK Hooks',
    examTask: '1.5 SDK Hooks: PreToolUse & PostToolUse',
    scenario: 'A financial trading agent has a PreToolUse hook that logs all tool calls and a PostToolUse hook that validates response schemas. During a high-volume trading session, the agent makes 200 tool calls in 45 seconds. The hooks add 120ms of latency per tool call, increasing total processing time from 45s to 69s — a 53% increase that exceeds the 60-second SLA.',
    question: 'What optimization would best reduce hook overhead while maintaining observability and safety?',
    options: [
      'A) Remove both hooks and replace them with a single post-processing step that batch-logs all tool calls after the trading session completes.',
      'B) Move logging to an asynchronous queue (fire-and-forget) and apply schema validation only to write operations (execute_trade, modify_order), skipping validation on read-only operations (get_price, check_balance).',
      'C) Reduce the schema validation scope to check only the top-level response structure rather than validating every nested field.',
      'D) Implement the hooks in a compiled language (Rust/Go) as a sidecar process to reduce per-call latency from 120ms to approximately 15ms.',
    ],
    correct: 1,
    explanation: 'Asynchronous logging eliminates blocking I/O, and selective validation (write operations only) reduces unnecessary checks — read operations don\'t modify state and their response format is less critical. A removes real-time safety validation. C may miss important schema violations in nested data. D is over-engineering for what is fundamentally a scope problem, not a performance problem. [Task 1.5 — SDK Hooks: hook performance matters in high-frequency tool use scenarios.]',
  },
  {
    poolId: 127, domain: 'd1', domainLabel: 'Task Decomposition',
    examTask: '1.6 Task Decomposition Strategies',
    scenario: 'A document analysis system receives a 200-page technical specification. The orchestrator decomposes it into 20 subtasks of 10 pages each, assigning each to a subagent. The final synthesis misses cross-references between sections (e.g., Section 3 references requirements defined in Section 15). Users report that 35% of synthesized answers are incomplete due to missed dependencies.',
    question: 'What decomposition strategy would better handle cross-section dependencies?',
    options: [
      'A) Process the entire document in a single agent call, ensuring full context visibility for all cross-references.',
      'B) Decompose into overlapping chunks (pages 1-15, 11-25, 21-35, etc.) with a 5-page overlap, then have the orchestrator map cross-references during synthesis by correlating findings from overlapping regions.',
      'C) Use a two-pass approach: first pass extracts all cross-references and dependencies into a dependency graph, second pass assigns subtasks informed by the graph so related sections are analyzed together.',
      'D) Increase the chunk size to 30 pages per subagent, reducing the total number of subtasks to 7 and increasing the likelihood that related sections are in the same chunk.',
    ],
    correct: 2,
    explanation: 'A two-pass approach explicitly handles cross-section dependencies — the dependency graph ensures related sections are co-analyzed. A may hit context limits with 200 pages. B adds overlap but doesn\'t guarantee that sections 3 and 15 are covered together. D is a probabilistic improvement that doesn\'t address the fundamental decomposition problem. [Task 1.6 — Task Decomposition: dependency-aware decomposition prevents information loss across subtask boundaries.]',
  },
  {
    poolId: 128, domain: 'd1', domainLabel: 'Session State',
    examTask: '1.7 Session State, Persistence & Resumption',
    scenario: 'A legal research agent processes complex queries that average 12 agentic loop iterations. Sessions occasionally fail due to API timeouts after 8-10 iterations. When the user retries, the agent starts from scratch, repeating the first 8 iterations identically — wasting approximately $0.12 per retry and adding 90 seconds of redundant processing.',
    question: 'What session management approach would eliminate redundant work on retry?',
    options: [
      'A) Cache the final response from each session so that identical queries return the cached result without re-executing the agent loop.',
      'B) Implement checkpoint persistence: after each tool call iteration, save the conversation state (messages, tool results, current step). On retry, restore from the last checkpoint and resume the loop from that point rather than restarting.',
      'C) Pre-compute likely research paths for common legal topics and serve results from a lookup table instead of running the agent.',
      'D) Increase the API timeout threshold to 120 seconds to reduce the frequency of mid-session failures.',
    ],
    correct: 1,
    explanation: 'Checkpoint persistence enables resumption from the last successful iteration, eliminating redundant work. A only helps with identical queries, not retries of incomplete sessions. C replaces the agent with a static lookup, losing flexibility. D reduces failure frequency but doesn\'t handle the failures that still occur. [Task 1.7 — Session State: checkpoint-based resumption is essential for long-running agent sessions.]',
  },
  {
    poolId: 129, domain: 'd1', domainLabel: 'Agentic Loops',
    examTask: '1.1 Agentic Loops',
    scenario: 'A customer support agent handles 3,000 daily conversations. The agentic loop executes tool_use blocks in the order they appear in the response. In 12% of cases, the agent requests get_customer and lookup_order simultaneously, but the order lookup occasionally fails because it executes before the customer lookup returns the required customer_id parameter.',
    question: 'What change to the tool execution logic would most reliably resolve this dependency issue?',
    options: [
      'A) Execute all tool_use blocks in parallel but wrap each in a try/catch, retrying failed calls with the results from completed calls.',
      'B) Analyze tool_use blocks for parameter dependencies before execution: if one tool\'s input references the output of another, execute them sequentially in dependency order; otherwise execute in parallel.',
      'C) Add a system prompt instruction requiring the agent to always call tools one at a time, never requesting multiple tools in a single response.',
      'D) Add a validation layer that rejects any response containing multiple tool_use blocks, forcing the agent to make separate API calls.',
    ],
    correct: 1,
    explanation: 'Dependency-aware execution analyzes parameter references between tool calls and orders them accordingly. This preserves parallelism for independent calls while preventing the specific failure mode. A is reactive — it retries after failure rather than preventing it. C and D eliminate multi-tool parallelism entirely, unnecessarily degrading performance for the 88% of cases where it works correctly. [Task 1.1 — Agentic Loops: understanding tool_use execution semantics is critical for reliability.]',
  },
  {
    poolId: 130, domain: 'd1', domainLabel: 'Multi-Agent Orchestration',
    examTask: '1.2 Multi-Agent Orchestration',
    scenario: 'A content creation system has 3 specialist agents: ResearchAgent, WritingAgent, and ReviewAgent. The orchestrator assigns tasks sequentially. Analysis shows that ResearchAgent finishes in 30 seconds on average, but WritingAgent waits 45 seconds because the orchestrator polls for completion every 45 seconds rather than using event-driven notification.',
    question: 'What architectural change would minimize idle time between agent stages?',
    options: [
      'A) Reduce the polling interval from 45 seconds to 5 seconds to detect completion faster.',
      'B) Implement an event-driven architecture where ResearchAgent emits a completion event that immediately triggers WritingAgent, eliminating the polling delay entirely.',
      'C) Pre-load WritingAgent with predicted research results so it can begin drafting before ResearchAgent completes.',
      'D) Merge ResearchAgent and WritingAgent into a single agent to eliminate the handoff delay.',
    ],
    correct: 1,
    explanation: 'Event-driven notification eliminates the 15-second idle time (45s poll - 30s execution) by triggering the next stage immediately on completion. A reduces but doesn\'t eliminate idle time and increases overhead from frequent polling. C introduces speculative work that may be discarded. D loses the benefits of specialized agents. [Task 1.2 — Multi-Agent Orchestration: efficient inter-agent communication patterns reduce pipeline latency.]',
  },
  {
    poolId: 131, domain: 'd1', domainLabel: 'Agentic Loops',
    examTask: '1.1 Agentic Loops',
    scenario: 'Your e-commerce agent\'s agentic loop processes a return request. The loop executes 6 iterations: get_order → verify_return_policy → initiate_return → generate_shipping_label → send_confirmation → end_turn. Each iteration appends the full tool result (averaging 800 tokens) to the message history. By iteration 6, the conversation is 9,200 tokens.',
    question: 'What would reduce token consumption without losing critical information for decision-making?',
    options: [
      'A) After each tool result is processed in the next iteration, replace the raw result with a structured summary containing only the fields referenced by subsequent tool calls.',
      'B) Set max_tokens to 200 per response to force the agent to produce shorter reasoning and tool calls.',
      'C) Store tool results in an external database and reference them by ID, passing only the ID to the conversation history.',
      'D) Combine all 6 tool calls into a single iteration by having the agent call all tools at once in the first response.',
    ],
    correct: 0,
    explanation: 'Summarizing processed tool results preserves the information needed for subsequent decisions while reducing context size. This is a pragmatic balance between compression and preservation. B constrains the model\'s reasoning without reducing the actual context. C adds complexity and may lose important context for the model\'s decision-making. D assumes all tools can be called without dependencies between them, which is often not the case. [Task 1.1 — Agentic Loops: context management within the loop directly impacts token costs and performance.]',
  },
  {
    poolId: 132, domain: 'd1', domainLabel: 'Workflow Enforcement',
    examTask: '1.4 Workflow Enforcement & Structured Handoffs',
    scenario: 'A medical records system has two agents: TriageAgent (classifies symptoms, suggests tests) and DiagnosisAgent (interprets results, suggests treatment). Currently, TriageAgent passes its full conversation (averaging 4,500 tokens) to DiagnosisAgent, including speculative reasoning that was later discarded. DiagnosisAgent occasionally treats discarded speculation as confirmed fact.',
    question: 'What handoff mechanism would prevent discarded speculation from contaminating the diagnosis?',
    options: [
      'A) Define a structured handoff schema that TriageAgent must populate with only confirmed findings (symptoms, test results, vital signs), excluding all reasoning and speculative content from the handoff payload.',
      'B) Instruct DiagnosisAgent to ignore any content in the handoff that is not explicitly marked as "confirmed" using a tagging system.',
      'C) Add a post-processing step that removes sentences containing hedging language (might, could, possibly) from the handoff before passing it to DiagnosisAgent.',
      'D) Have TriageAgent include confidence scores for each statement, and instruct DiagnosisAgent to disregard statements with confidence below 0.7.',
    ],
    correct: 0,
    explanation: 'A structured handoff schema forces TriageAgent to output only confirmed, structured data — speculation never enters the handoff payload. B relies on DiagnosisAgent reliably filtering content, which is probabilistic. C uses brittle NLP heuristics that may remove legitimate findings expressed with hedging or miss speculation expressed confidently. D introduces a confidence threshold that may filter legitimate findings or admit confidently-stated speculation. [Task 1.4 — Workflow Enforcement: structured handoffs prevent context contamination between agent stages.]',
  },
  {
    poolId: 133, domain: 'd1', domainLabel: 'Subagent Invocation',
    examTask: '1.3 Subagent Invocation & Context Isolation',
    scenario: 'A data pipeline orchestrator spawns a subagent for each of 5 data sources (SQL, REST API, CSV files, NoSQL, Excel). Each subagent extracts data and passes results to a central AnalysisAgent. The SQL subagent occasionally includes raw connection strings and credentials in its output, which get logged in the AnalysisAgent\'s conversation history.',
    question: 'What context isolation mechanism would prevent credential leakage across subagent boundaries?',
    options: [
      'A) Implement an output sanitizer in the orchestration layer that strips patterns matching connection strings, API keys, and credentials from all subagent responses before passing them to other agents.',
      'B) Instruct each subagent not to include credentials in its output via a system prompt directive.',
      'C) Use environment variable substitution so credentials are injected at execution time and never appear in the agent\'s context.',
      'D) Store credentials in a secrets manager and pass only the secret reference ID to subagents, having them resolve the secret internally without exposing the value in output.',
    ],
    correct: 0,
    explanation: 'An orchestration-layer output sanitizer provides deterministic protection — it strips credential patterns regardless of whether subagents comply with instructions. B relies on probabilistic LLM compliance. C prevents credentials in the initial context but doesn\'t prevent subagents from echoing them. D is architecturally sound but doesn\'t prevent a subagent from including the resolved credential value in its output text. [Task 1.3 — Subagent Invocation: context isolation includes preventing sensitive data from crossing agent boundaries.]',
  },
];

export default d1New;
