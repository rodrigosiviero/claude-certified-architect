/**
 * Question Bank — D5 Agentic System Reliability (12 questions)
 */
import type { PoolQuestion } from './d1';

const d5New: PoolQuestion[] = [
  {
    poolId: 166, domain: 'd5', domainLabel: 'Context Management',
    scenario: 'Your research agent maintains a conversation with a user over 40 turns. By turn 30, the agent starts contradicting earlier statements — recommending a strategy in turn 28 that conflicts with constraints the user specified in turn 4. Analysis shows the agent\'s attention to turn 4 content has degraded significantly by turn 30.',
    question: 'What architectural pattern would most effectively maintain constraint consistency across long conversations?',
    options: [
      'A) Implement an explicit constraint tracker: extract user-specified constraints when first mentioned, store them in a structured format, and inject them as a persistent context block in every subsequent API call.',
      'B) Add a system prompt instruction: "Always remember all user constraints throughout the conversation."',
      'C) Limit conversations to 20 turns to prevent attention degradation.',
      'D) Repeat the user\'s constraints in every assistant response to reinforce them.',
    ],
    correct: 0,
    explanation: 'An explicit constraint tracker with persistent injection ensures constraints are always present in the context window at full attention weight, regardless of conversation length. This is deterministic — it doesn\'t rely on the model\'s ability to attend to earlier turns. Option B is advisory and contradicted by the observed data. Option C artificially limits functionality. Option D wastes tokens and still degrades over very long conversations.',
  },
  {
    poolId: 167, domain: 'd5', domainLabel: 'Context Management',
    scenario: 'A multi-turn coding assistant helps developers build features incrementally. By turn 15, the conversation contains: the original requirements (turn 1), three code iterations (turns 3, 7, 11), debug outputs (turns 5, 9), and user feedback (turns 2, 6, 10, 14). Total context: 85,000 tokens. The agent is approaching the 128K limit and future turns will overflow.',
    question: 'What context management strategy would most effectively handle this?',
    options: [
      'A) Implement conversation summarization: summarize turns 1-10 into a compressed context block preserving requirements, current code state, and resolved issues. Drop the raw content of summarized turns while keeping turns 11-15 intact.',
      'B) Truncate the oldest messages, keeping only the last 6 turns (turns 10-15).',
      'C) Start a new conversation every 10 turns, carrying forward only the latest code state.',
      'D) Increase the model\'s context window to 200K to accommodate longer conversations.',
    ],
    correct: 0,
    explanation: 'Summarization preserves the essential information (requirements, current state, resolved issues) while freeing context space for continued work. The key is preserving requirements and current state, not just recent messages. Option B loses the original requirements that were in turn 1. Option C loses conversation continuity. Option D delays rather than solves the problem and increases cost.',
  },
  {
    poolId: 168, domain: 'd5', domainLabel: 'Error Propagation',
    scenario: 'A multi-agent research system has three agents: SearchAgent, AnalysisAgent, and SynthesisAgent, coordinated by an Orchestrator. SearchAgent encounters an API rate limit and returns an empty result set marked as successful. AnalysisAgent processes the empty set and produces generic analysis. SynthesisAgent incorporates this into the final report, which contains vague statements unsupported by data.',
    question: 'What error propagation pattern would have prevented this silent failure chain?',
    options: [
      'A) SearchAgent should have returned a structured error to the Orchestrator with error type, attempted query, and partial results. The Orchestrator would then decide: retry with a modified query, proceed with partial data flagged as incomplete, or inform the user.',
      'B) AnalysisAgent should have detected the empty input and refused to produce analysis.',
      'C) SynthesisAgent should have validated all input data before incorporating it into the report.',
      'D) The Orchestrator should have set a longer timeout for SearchAgent to avoid rate limit errors.',
    ],
    correct: 0,
    explanation: 'The root cause is SearchAgent masking a failure as success. Proper error propagation means failures are surfaced with context at the earliest point, giving the Orchestrator the information to make intelligent recovery decisions. Option B and C are downstream mitigations that shouldn\'t be needed if the error is surfaced properly at the source. Option D addresses the symptom but not the error handling pattern.',
  },
  {
    poolId: 169, domain: 'd5', domainLabel: 'Escalation & Ambiguity',
    scenario: 'Your customer support agent handles 10,000 tickets/day. Current metrics: 72% first-contact resolution (target: 85%), 15% unnecessary escalations (simple questions routed to humans), and 5% dangerous autonomous actions (the agent proceeds on ambiguous requests where it shouldn\'t). The agent uses a single confidence threshold: escalate when confidence < 0.6.',
    question: 'What change would most improve both escalation accuracy and safety?',
    options: [
      'A) Lower the confidence threshold to 0.3 to reduce unnecessary escalations, allowing the agent to handle more questions autonomously.',
      'B) Replace the single threshold with a multi-tier system: high confidence (>0.8) = proceed autonomously; medium confidence (0.5-0.8) = proceed but flag for post-hoc review; low confidence (<0.5) with high-stakes actions = mandatory human approval; low confidence with routine actions = proceed with disclaimer.',
      'C) Raise the threshold to 0.8 to prevent all dangerous autonomous actions, accepting more escalations.',
      'D) Remove confidence-based escalation entirely and use keyword detection to identify ambiguous requests.',
    ],
    correct: 1,
    explanation: 'A multi-tier system with action-type awareness addresses both problems: it reduces unnecessary escalations for routine actions while enforcing human approval for high-stakes ambiguous situations. The key insight is that confidence alone is insufficient — the stakes of the action matter equally. Option A increases the dangerous autonomous action rate. Option C reduces dangerous actions but increases unnecessary escalations. Option D replaces nuanced reasoning with brittle pattern matching.',
  },
  {
    poolId: 170, domain: 'd5', domainLabel: 'Escalation & Ambiguity',
    scenario: 'Your financial advisory agent provides investment recommendations. In testing, it handles clear requests well ("What\'s the current APY on savings accounts?") but struggles with ambiguous ones ("Should I move my money?"). 40% of responses to ambiguous questions assume context the user didn\'t provide — for example, recommending stock investments when the user\'s money is in a locked retirement account.',
    question: 'What approach would most effectively handle ambiguous financial queries?',
    options: [
      'A) Add a system prompt instruction: "When in doubt, ask for clarification rather than making assumptions."',
      'B) Implement structured ambiguity detection: when a query could have multiple interpretations, the agent must (1) identify the ambiguity, (2) present the possible interpretations, and (3) ask the user to clarify before providing recommendations. This is enforced via a response schema that requires an ambiguity field.',
      'C) Always provide a generic recommendation that applies to most situations.',
      'D) Check the user\'s account type first and assume their question relates to that account.',
    ],
    correct: 1,
    explanation: 'Structured ambiguity detection with schema enforcement provides deterministic handling — the response schema requires the agent to surface ambiguities rather than silently resolving them. This is especially critical in financial contexts where wrong assumptions have real monetary consequences. Option A is advisory and doesn\'t prevent the 40% assumption rate. Option C provides unhelpful generic advice. Option D risks privacy violations and still makes assumptions.',
  },
  {
    poolId: 171, domain: 'd5', domainLabel: 'Error Propagation',
    scenario: 'Your e-commerce agent uses a payment processing tool that fails intermittently (2% of calls). When it fails, the error propagates up through three layers: PaymentTool → OrderManager → UserInterface. Currently, each layer wraps the error in its own error message, adding context but also obscuring the original failure reason. By the time it reaches the user, the message is: "An unexpected error occurred in the order processing subsystem. Please try again later."',
    question: 'What error propagation pattern would provide the most useful information at each layer?',
    options: [
      'A) Propagate raw errors directly to the user so they see the exact technical failure.',
      'B) Implement structured error chaining: PaymentTool returns {type: "gateway_timeout", original_error: "...", retryable: true, context: "Card charge attempted, result unknown"}. Each layer adds its context without obscuring the original, and the UI layer translates the chain into a user-friendly message that includes actionable information.',
      'C) Catch all errors at the OrderManager level and return a generic "Order processing failed" to prevent any technical details from reaching the user.',
      'D) Log the error internally and retry silently up to 3 times before notifying the user.',
    ],
    correct: 1,
    explanation: 'Structured error chaining preserves the original error context at each layer while adding relevant layer-specific information. The UI layer can then produce both user-friendly messages ("Your payment is processing — we\'ll confirm shortly") and developer-friendly logs with the full error chain. Option A exposes technical details that confuse users. Option C loses valuable debugging information. Option D risks silent double-charges on retry.',
  },
  {
    poolId: 172, domain: 'd5', domainLabel: 'Codebase Exploration',
    scenario: 'Your Claude Code agent needs to understand a 50-file Python codebase it has never seen before to fix a bug reported in the authentication module. The codebase has no CLAUDE.md file and no inline documentation. The agent\'s first action is to read all 50 files sequentially, consuming 80,000 tokens and taking 45 seconds.',
    question: 'What is a more efficient codebase exploration strategy?',
    options: [
      'A) Start by reading only the file mentioned in the bug report, then follow import statements and function calls to understand only the relevant code paths, expanding exploration incrementally based on what it finds.',
      'B) Read only the README.md file and infer the codebase structure from project documentation.',
      'C) Use grep/search tools to find all files containing "authentication" and read only those files.',
      'D) Ask the developer to provide a summary of the relevant code before starting.',
    ],
    correct: 0,
    explanation: 'Starting from the reported file and following the dependency graph (imports, calls, references) is the standard codebase exploration pattern — it\'s targeted, efficient, and discovers relevant context organically. Option B provides overview but not the detail needed for debugging. Option C is a good complement but may miss indirect dependencies. Option D shifts work to the developer that the agent should handle autonomously.',
  },
  {
    poolId: 173, domain: 'd5', domainLabel: 'Codebase Exploration',
    scenario: 'You want Claude Code to automatically apply your team\'s coding standards when generating or editing code. Your project has different standards for different file types: React components use functional style with named exports, API handlers use async/await with specific error handling patterns, and test files use a specific assertion library and mock structure.',
    question: 'Where should you configure these context-dependent coding standards?',
    options: [
      'A) In a single CLAUDE.md file at the project root with sections for each file type.',
      'B) In .claude/rules/ directory with YAML frontmatter specifying glob patterns — each rule file automatically applies when Claude edits files matching its pattern (e.g., **/*.test.tsx triggers test conventions; **/api/**/*.ts triggers API handler conventions).',
      'C) In each developer\'s ~/.claude/commands/ directory as personal preferences.',
      'D) In package.json under a "claude" configuration key.',
    ],
    correct: 1,
    explanation: 'Rules files with glob patterns automatically apply conventions based on file paths, regardless of directory structure. This is essential when test files are co-located with source files and different conventions apply to each. Option A relies on Claude inferring which section applies to which file — less reliable than explicit pattern matching. Option C makes standards per-developer rather than per-project. Option D uses a configuration mechanism that doesn\'t exist in Claude Code.',
  },
  {
    poolId: 174, domain: 'd5', domainLabel: 'Human Review & Confidence',
    scenario: 'Your automated code review agent processes pull requests. It flags a potential SQL injection vulnerability in a PR. The developer who wrote the code insists it\'s safe because the input is sanitized upstream. The agent\'s confidence score is 0.72 — moderately confident but not certain. The code deploys to a public-facing API that handles user data.',
    question: 'Should this finding be escalated, and what principle should guide the decision?',
    options: [
      'A) No escalation needed — the developer\'s justification is sufficient to dismiss the finding.',
      'B) Yes, escalate — when the potential impact is high (data breach via SQL injection on a public API) and confidence is moderate (0.72), the principle of "err on the side of caution for high-impact findings" warrants human security review regardless of the developer\'s assessment.',
      'C) Rerun the analysis with a higher temperature to get a more confident assessment.',
      'D) Only escalate if the confidence score exceeds 0.9.',
    ],
    correct: 1,
    explanation: 'The escalation decision should consider both confidence AND impact. A 0.72 confidence SQL injection finding on a public-facing API warrants human review because the cost of a false negative (missed vulnerability) is much higher than the cost of a false positive (unnecessary review). Option A trusts human judgment over systematic analysis. Option C misunderstands confidence scoring. Option D sets a threshold that would miss most real findings.',
  },
  {
    poolId: 175, domain: 'd5', domainLabel: 'Provenance & Attribution',
    scenario: 'Your research synthesis agent combines findings from 12 different sources into a market analysis report. The report includes specific claims like "Company X\'s revenue grew 34% YoY" and "The sector is projected to reach $50B by 2027." Stakeholders need to verify these claims, but the report doesn\'t indicate which source each claim came from.',
    question: 'What provenance pattern should you implement?',
    options: [
      'A) Add source citations inline: each factual claim includes a numbered reference [1] that maps to a source bibliography at the end of the report.',
      'B) List all 12 sources at the end of the report and let readers determine which source supports which claim.',
      'C) Include a confidence score for each claim to indicate how well-supported it is.',
      'D) Only include claims that appear in at least 2 sources, removing single-source claims.',
    ],
    correct: 0,
    explanation: 'Inline citations with a bibliography provide direct provenance — readers can immediately verify any claim by following its citation. This is the standard academic approach adapted for AI-generated reports. Option B provides sources but not the claim-source mapping. Option C adds quality assessment but doesn\'t help verification. Option D eliminates potentially valuable single-source findings.',
  },
  {
    poolId: 176, domain: 'd5', domainLabel: 'Provenance & Attribution',
    scenario: 'Your content generation agent produces blog posts that occasionally include statistics or facts that sound plausible but are fabricated. You implement a fact-checking pass that flags unverified claims. However, the agent has learned to hedge fabricated claims with phrases like "studies suggest" or "industry experts believe," making them harder to detect algorithmically.',
    question: 'What provenance approach would most effectively address fabricated claims?',
    options: [
      'A) Implement a mandatory citation requirement: every factual claim must include a verifiable source. Claims without sources are flagged for removal or human verification before publication.',
      'B) Add a system prompt instruction: "Never fabricate statistics or facts. Only include verifiable information."',
      'C) Lower the generation temperature to 0 to reduce creative fabrication.',
      'D) Run all output through a plagiarism checker to identify fabricated content.',
    ],
    correct: 0,
    explanation: 'Mandatory citation requirements create a structural constraint — if a claim cannot be attributed to a source, it doesn\'t publish. This is more reliable than instructing the model not to fabricate (Option B) when it has already learned to disguise fabrication. Option C doesn\'t prevent fabrication — temperature affects diversity, not factual accuracy. Option D checks for copying, not fabrication.',
  },
  {
    poolId: 177, domain: 'd5', domainLabel: 'Human Review & Confidence',
    scenario: 'Your medical information agent provides preliminary health information to patients. You implement a confidence-based routing system: responses with confidence > 0.85 go directly to patients, responses between 0.6-0.85 are reviewed by a nurse, and responses below 0.6 are escalated to a physician. After one month, 60% of responses go to nurses for review, creating a bottleneck — nurses spend 3 hours/day reviewing AI output.',
    question: 'What adjustment would most effectively balance safety with operational efficiency?',
    options: [
      'A) Lower the threshold for direct patient response to 0.7, reducing nurse review volume by an estimated 40%, while keeping physician escalation at 0.5.',
      'B) Keep the current thresholds and hire more nurses to handle the review volume.',
      'C) Send all responses directly to patients with a disclaimer: "This information was generated by AI and should be verified with a healthcare professional."',
      'D) Increase the confidence threshold for nurse review to 0.7 and send everything below 0.7 directly to patients with a warning.',
    ],
    correct: 0,
    explanation: 'Lowering the direct-response threshold to 0.7 is reasonable if the 0.7-0.85 range shows consistently safe output in review. The data-driven approach is: analyze what nurses actually change in reviewed responses. If they rarely modify responses in the 0.7-0.85 range, those can go directly to patients. Option B adds cost without optimizing. Option C compromises safety. Option D sends the lowest-confidence responses directly to patients — the opposite of what\'s safe.',
  },
];

export default d5New;
