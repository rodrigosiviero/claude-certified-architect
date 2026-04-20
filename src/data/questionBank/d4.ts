/**
 * Question Bank — D4 Output Structuring & Validation (10 questions)
 */
import type { PoolQuestion } from './d1';

const d4New: PoolQuestion[] = [
  {
    poolId: 156, domain: 'd4', domainLabel: 'System Prompt Architecture',
    scenario: 'Your financial reporting agent generates quarterly summaries. You\'ve structured the system prompt into three sections: Role Definition ("You are a financial analyst..."), Output Format (JSON schema with required fields), and Analysis Guidelines (methodology and constraints). When the prompt exceeds 2,500 tokens, the agent occasionally ignores the output format section and returns prose instead of JSON.',
    question: 'What is the most effective way to ensure consistent JSON output formatting?',
    options: [
      'A) Add stronger language: "You MUST return JSON. NEVER return prose. This is ABSOLUTELY REQUIRED."',
      'B) Use the JSON mode feature (or --json-schema if using Claude Code) which programmatically enforces JSON output, rather than relying on natural language instructions in the system prompt.',
      'C) Move the output format section to the beginning of the system prompt so it receives more attention.',
      'D) Add a post-processing step that converts prose responses to JSON by extracting key information.',
    ],
    correct: 1,
    explanation: 'Programmatic enforcement via JSON mode provides deterministic guarantees that natural language instructions cannot. When the output format is critical infrastructure, not a preference, it should be enforced structurally. Option A relies on emphasis that doesn\'t change capability. Option C may help marginally but doesn\'t provide guarantees. Option D adds a fragile processing step that may lose or misinterpret information.',
  },
  {
    poolId: 157, domain: 'd4', domainLabel: 'Structured Output Patterns',
    scenario: 'Your product catalog agent extracts product information from supplier emails into a structured format. You define a schema with required fields: name, price, category, and description. Supplier emails vary wildly in format — some have prices in tables, some in running text, some in attachments. When a price isn\'t clearly stated, the agent either hallucinates a price or leaves the field empty.',
    question: 'What schema design approach best handles variable input quality?',
    options: [
      'A) Make all fields optional in the schema and add a confidence_score field for each extracted value, allowing downstream systems to filter based on extraction confidence.',
      'B) Make price required and add a system prompt instruction: "If the price is not explicitly stated, estimate it based on the product category and description."',
      'C) Add a validation step that rejects any extraction where required fields are missing, forcing the agent to re-read the email.',
      'D) Use a two-pass approach: first extract raw values with annotations (explicit/stated/inferred/missing), then validate and fill gaps in a second pass.',
    ],
    correct: 3,
    explanation: 'A two-pass approach with explicit provenance annotations separates extraction from validation. The first pass honestly labels what it found (and how), and the second pass makes informed decisions about gaps. Option A pushes the uncertainty downstream without resolution. Option B explicitly encourages hallucination. Option C creates an infinite retry loop for emails that genuinely don\'t contain certain fields.',
  },
  {
    poolId: 158, domain: 'd4', domainLabel: 'Validation & Retry Strategies',
    scenario: 'Your legal document analyzer extracts contract terms into structured JSON. Validation shows that 8% of extractions have at least one incorrect field — for example, extracting "24 months" as the contract duration when the document says "36 months with option to terminate at 24 months." These errors are subtle and could have legal consequences.',
    question: 'What validation strategy would most effectively catch these subtle extraction errors?',
    options: [
      'A) Add regex-based validators that check each field against expected formats (e.g., duration must be a number followed by "months").',
      'B) Implement a verification pass — send the extracted JSON back to Claude with the original document and ask: "Verify each extracted value against the source document. Flag any discrepancies." This catches errors at the cost of one additional API call.',
      'C) Increase the model temperature to 0 and add few-shot examples showing correct extraction patterns.',
      'D) Run the extraction three times and use majority voting to determine the correct value for each field.',
    ],
    correct: 1,
    explanation: 'A verification pass explicitly cross-references extracted values against the source, catching subtle misinterpretations like the "24 vs. 36 months" confusion. The additional API call cost is justified for high-stakes legal data. Option A validates format, not accuracy — "24 months" passes format validation but is factually wrong. Option C is already best practice (temperature 0) and doesn\'t prevent these errors. Option D triples cost and majority voting doesn\'t help when the error is systematic (the model consistently misreads the passage).',
  },
  {
    poolId: 159, domain: 'd4', domainLabel: 'Batch Processing',
    scenario: 'Your content moderation agent processes user-generated content in batches of 50 items. Each item needs: toxicity classification, spam detection, and policy compliance check. Currently, you send each item as a separate API call, resulting in 50 calls per batch. At $0.003 per call, this costs $0.15 per batch. You process 1,000 batches/day, totaling $150/day.',
    question: 'What is the most cost-effective approach while maintaining accuracy?',
    options: [
      'A) Use the Message Batches API for all 50 items, accepting up to 24-hour processing time for the 50% cost savings.',
      'B) Group related items into fewer API calls — send 10 items per call (5 calls per batch) with clear separators, requesting classification for each item individually within the response.',
      'C) Continue with 50 individual calls but switch to a cheaper model.',
      'D) Process all 50 items in a single API call by concatenating them into one long prompt.',
    ],
    correct: 0,
    explanation: 'For content moderation, latency is often less critical than throughput — flagged content can be quarantined pending batch results. The 50% cost savings from the Message Batches API significantly reduces the $150/day cost. Option B risks cross-contamination between items in the same call. Option C trades quality for cost savings. Option D would likely exceed context limits and severely degrade per-item accuracy due to attention dilution.',
  },
  {
    poolId: 160, domain: 'd4', domainLabel: 'Multi-Instance Review',
    scenario: 'Your medical diagnosis assistant provides preliminary assessments from patient symptoms. You implement a multi-instance review pattern: three independent Claude calls analyze the same symptoms, and you take the majority diagnosis. You notice that all three instances frequently produce the same incorrect diagnosis — they share the same reasoning failure pattern.',
    question: 'What does this reveal about the multi-instance review pattern, and what would be more effective?',
    options: [
      'A) Increase to 5 instances to improve majority voting accuracy.',
      'B) The identical failures indicate systematic bias in the prompt or training data. Fix the root cause — improve the system prompt with better diagnostic criteria, differential diagnosis frameworks, and explicit instructions to consider alternative diagnoses.',
      'C) Use different temperature settings for each instance to encourage diverse reasoning paths.',
      'D) Use different models for each instance to ensure independent reasoning.',
    ],
    correct: 1,
    explanation: 'Multi-instance review only catches random errors, not systematic ones. When all instances share the same prompt and model, they share the same biases and failure patterns. The fix must address the root cause — the prompt\'s diagnostic framework — not the review pattern. Option A wastes compute on redundant failures. Option C adds randomness but doesn\'t fix systematic reasoning errors. Option D increases cost and complexity without guaranteeing independence if the issue is in the prompt design.',
  },
  {
    poolId: 161, domain: 'd4', domainLabel: 'System Prompt Architecture',
    scenario: 'You are building a customer-facing chatbot that represents your company. The system prompt needs to include: company policies, product information, brand voice guidelines, conversation flow rules, and escalation criteria. The total is 5,000 tokens. Your users\' conversations average 20 turns, consuming about 40,000 tokens. The system prompt consumes 12.5% of the context window on every single API call.',
    question: 'How should you evaluate whether this 5,000-token system prompt is justified?',
    options: [
      'A) 5,000 tokens is always too large for a system prompt. Move as much content as possible to tool descriptions that are only loaded when relevant tools are called.',
      'B) Evaluate the cost-benefit: if the system prompt content is used in more than 50% of turns (policies, voice guidelines), keeping it in the system prompt is justified. Move infrequently-used content (detailed product specs) to tool-accessible references.',
      'C) 5,000 tokens is negligible. No optimization needed.',
      'D) Split the system prompt across multiple API calls — load policies on the first turn, product info on the second, etc.',
    ],
    correct: 1,
    explanation: 'The key metric is utilization frequency. Content used in most turns (brand voice, policies, escalation rules) belongs in the system prompt. Content needed only occasionally (detailed product specs for specific questions) should be tool-accessible to save context on turns where it\'s not needed. Option A is too rigid — some system prompt content is essential on every turn. Option C ignores the compounding cost across thousands of API calls. Option D creates inconsistency and complexity.',
  },
  {
    poolId: 162, domain: 'd4', domainLabel: 'Structured Output Patterns',
    scenario: 'Your data extraction agent processes invoices from 50 different vendors, each with unique layouts. You use a JSON schema to extract: vendor_name, invoice_number, line_items, total_amount, and due_date. Accuracy varies by vendor: 95% for vendors with clean layouts, but drops to 70% for vendors with complex table layouts or multi-page invoices.',
    question: 'What approach would most improve accuracy on challenging vendor formats?',
    options: [
      'A) Create vendor-specific extraction schemas that capture each vendor\'s unique layout patterns, selected dynamically based on vendor identification.',
      'B) Add a layout normalization pre-processing step that converts all invoice formats to a standard visual layout before extraction, reducing format variability.',
      'C) Increase the schema complexity with additional fields, nested objects, and validation rules to force more careful extraction.',
      'D) Accept the accuracy variance and add a manual review step for vendors known to have complex layouts.',
    ],
    correct: 0,
    explanation: 'Vendor-specific schemas capture the unique patterns of each format — for example, Vendor A puts totals on page 1 while Vendor B puts them on the last page. Dynamic schema selection based on vendor identification tailors the extraction logic to the specific format. Option B is promising but harder to implement reliably. Option C adds complexity without addressing the root cause (format variability). Option D accepts poor automation rather than improving it.',
  },
  {
    poolId: 163, domain: 'd4', domainLabel: 'Validation & Retry Strategies',
    scenario: 'Your agent generates SQL queries from natural language. 92% of generated queries execute successfully. Of the 8% that fail, 5% are syntax errors and 3% are semantic errors (query runs but returns wrong results). You implement retry logic: on failure, feed the error back to Claude and ask it to fix the query. After 3 retries, 80% of initially failing queries succeed.',
    question: 'Is this retry approach sufficient, and what is the remaining risk?',
    options: [
      'A) Yes — 80% recovery means only 1.6% of queries ultimately fail, which is acceptable.',
      'B) No — the 3% semantic errors that run successfully but return wrong results are the real risk. These pass validation (no syntax errors) but produce incorrect data that downstream systems consume as truth. Add a verification step that cross-checks query results against expected patterns or sample data.',
      'C) No — increase retries to 5 to recover more of the remaining failures.',
      'D) Yes — add a log warning for queries that required retries so developers can review them later.',
    ],
    correct: 1,
    explanation: 'Semantic errors are the critical risk — they produce plausible-looking but wrong results that silently corrupt downstream data. Syntax errors are caught by the database, but semantic errors require explicit verification logic. Option A ignores the dangerous silent failures. Option C doesn\'t address semantic errors at all. Option D is reactive rather than preventive.',
  },
  {
    poolId: 164, domain: 'd4', domainLabel: 'Batch Processing',
    scenario: 'Your email classification agent processes incoming support emails into categories: billing, technical, account, feedback, and spam. Each email is classified independently. You receive 500 emails/hour during peak times, and individual API calls cost $0.003 each. Your manager asks you to reduce the $36/day classification cost.',
    question: 'Using the Message Batches API, what is the most appropriate implementation?',
    options: [
      'A) Accumulate emails in 50-item batches, submit each batch via the Message Batches API, and process results when ready. Classification results are not time-sensitive — emails can wait up to 30 minutes for routing.',
      'B) Continue individual real-time calls but negotiate a volume discount with the API provider.',
      'C) Use the Message Batches API for spam detection only (highest volume) and keep real-time calls for business categories.',
      'D) Process all 500 emails in a single batch API call by concatenating email contents.',
    ],
    correct: 0,
    explanation: 'Email classification for routing purposes can tolerate 30-minute latency — emails don\'t need instant routing. Accumulating into batches of 50 and submitting via the Batches API leverages the 50% cost savings effectively. Option B is outside your control as an architectural solution. Option C creates a mixed architecture with no clear benefit. Option D would exceed context limits and degrade accuracy.',
  },
  {
    poolId: 165, domain: 'd4', domainLabel: 'Multi-Instance Review',
    scenario: 'Your code generation agent produces Python functions from specifications. You implement a review pattern where a second Claude instance reviews the generated code for bugs and style issues. The reviewer catches 40% of bugs but also flags 25% false positives — identifying valid code as problematic. This wastes developer time on unnecessary reviews.',
    question: 'What adjustment would most improve the review signal-to-noise ratio?',
    options: [
      'A) Increase the reviewer\'s temperature to 0.3 to encourage more nuanced analysis.',
      'B) Refine the reviewer\'s system prompt with specific code quality criteria, explicit examples of valid patterns that should NOT be flagged, and a structured review checklist that focuses on known bug patterns rather than general code quality.',
      'C) Run a third instance as a tiebreaker when the reviewer flags an issue.',
      'D) Remove the reviewer and rely solely on automated tests to catch bugs.',
    ],
    correct: 1,
    explanation: 'Refining the reviewer\'s prompt with explicit negative examples ("do not flag X as an issue") directly reduces false positives. A structured checklist focused on known bug patterns narrows the reviewer\'s scope to high-value checks. Option A adds randomness that could increase false positives. Option C triples cost and still doesn\'t address the root cause (imprecise review criteria). Option D eliminates a valuable safety layer that catches bugs tests miss.',
  },
];

export default d4New;
