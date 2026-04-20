/**
 * Question Bank — D4 Prompt Engineering for Agents (10 questions)
 */
import type { PoolQuestion } from './d1';

const d4New: PoolQuestion[] = [
  {
    poolId: 156, domain: 'd4', domainLabel: 'Prompts with Explicit Criteria',
    examTask: '4.1 Prompts with Explicit Criteria',
    scenario: 'A content moderation agent uses this system prompt: "You are a content moderator. Review posts and remove inappropriate content." The agent removes 23% of posts that community managers consider acceptable, while passing 8% of posts that violate guidelines. The ambiguity comes from terms like "inappropriate" without clear boundaries.',
    question: 'What prompt improvement would most effectively reduce both over-moderation and under-moderation?',
    options: [
      'A) Add a confidence scoring step where the agent rates each post 1-10 for violation severity, removing only posts scoring above 7.',
      'B) Replace vague instructions with explicit criteria: specific categories (hate speech, harassment, spam, violence, nudity), each with a clear definition, 2-3 examples of violations, 2-3 examples of borderline-but-acceptable content, and a decision flowchart for edge cases.',
      'C) Implement a two-pass review where the agent first flags suspicious content, then re-reviews each flagged post with additional context before removing.',
      'D) Add examples of acceptable and unacceptable posts as few-shot demonstrations, keeping the existing instruction text.',
    ],
    correct: 1,
    explanation: 'Explicit criteria with definitions, examples, and decision flowcharts eliminate the ambiguity that causes both over- and under-moderation. The agent has clear boundaries for each category rather than interpreting "inappropriate." A adds a scoring layer without defining what the scores mean. C adds processing overhead without fixing the underlying criteria problem. D helps but doesn\'t replace the need for clear definitional boundaries. [Task 4.1 — Explicit Criteria: replacing vague instructions with specific, structured criteria is the most effective prompt engineering improvement.]',
  },
  {
    poolId: 157, domain: 'd4', domainLabel: 'Few-Shot Prompting',
    examTask: '4.2 Few-Shot Prompting',
    scenario: 'A support ticket classifier uses zero-shot prompting and achieves 71% accuracy on 5 categories: billing, technical, account, sales, and other. You add 3 examples per category (15 examples total, ~2,400 tokens). Accuracy improves to 84%, but the system prompt grows from 800 to 3,200 tokens.',
    question: 'What is the most token-efficient way to improve accuracy further without significantly increasing prompt size?',
    options: [
      'A) Add 3 more examples per category (30 total), expecting diminishing but positive returns on accuracy.',
      'B) Analyze misclassified tickets, identify the 2-3 most common confusion patterns (e.g., billing vs. account), and add targeted examples that specifically demonstrate the distinction between these frequently confused categories.',
      'C) Replace the 15 examples with 15 different examples that cover more edge cases and unusual ticket formats.',
      'D) Keep the current examples but add a chain-of-thought instruction: "Before classifying, reason about the ticket\'s primary intent and the specific action the customer is requesting."',
    ],
    correct: 1,
    explanation: 'Targeted examples addressing specific confusion patterns are the most efficient improvement — they add minimal tokens (2-4 examples instead of 15) while directly addressing the remaining errors. A adds significant token overhead for diminishing returns. C replaces all examples without addressing the specific failure patterns. D adds reasoning overhead without providing the decision criteria the model is missing. [Task 4.2 — Few-Shot Prompting: targeted examples addressing specific confusion patterns are more efficient than adding more generic examples.]',
  },
  {
    poolId: 158, domain: 'd4', domainLabel: 'Structured Output',
    examTask: '4.3 Structured Output (tool_use + JSON Schema)',
    scenario: 'A data extraction agent processes invoices and must return structured JSON: vendor_name, invoice_date, line_items (array of description, quantity, unit_price), total_amount, and tax_amount. Free-text responses require a regex parsing step that fails on 15% of invoices due to format variations.',
    question: 'What is the most reliable approach to guarantee structured output?',
    options: [
      'A) Define a JSON schema as a tool with required fields, types, and descriptions, then use tool_choice to force the model to output via this tool, guaranteeing parseable structured output.',
      'B) Add a system prompt instruction: "You must respond with valid JSON matching this schema: {...}" and include the schema in the prompt.',
      'C) Use the model\'s JSON mode via response_format: {type: "json_object"} and include the schema in the system prompt.',
      'D) Post-process the free-text response with a second Claude call that extracts structured data from the unstructured output.',
    ],
    correct: 0,
    explanation: 'Using tool_use with a JSON schema and tool_choice provides the strongest guarantee of structured output — the model is constrained to produce valid JSON matching the schema. B and C rely on the model following formatting instructions, which can fail. C guarantees valid JSON but not the specific schema. D adds latency and cost with an additional API call. [Task 4.3 — Structured Output: tool_use with JSON Schema is the most reliable way to enforce structured output from Claude.]',
  },
  {
    poolId: 159, domain: 'd4', domainLabel: 'Validation & Retry',
    examTask: '4.4 Validation, Retry & Feedback Loops',
    scenario: 'An API response generator produces JSON that fails validation 12% of the time. Failures include: missing required fields (5%), wrong data types (4%), and enum values outside the allowed set (3%). Currently, you retry the entire generation on failure, which succeeds on the second attempt 80% of the time.',
    question: 'What retry strategy would maximize success rate while minimizing token waste?',
    options: [
      'A) Retry with the same prompt up to 3 times, accepting that some responses will fail validation.',
      'B) Include the validation error in the retry prompt: "Your previous response failed validation: the field \'status\' must be one of [active, inactive, pending] but you wrote \'processing\'. Fix this specific error while keeping the rest of the response."',
      'C) Add the full JSON schema to the system prompt to prevent validation failures from occurring in the first place.',
      'D) On failure, generate a completely new response with a different temperature setting to produce a distinct output.',
    ],
    correct: 1,
    explanation: 'Including the specific validation error in the retry prompt enables Claude to fix exactly what\'s wrong while preserving the correct parts — much more efficient than regenerating everything. A wastes tokens on blind retries. C is a good prevention measure but doesn\'t help when failures still occur. D discards working content and relies on randomness. [Task 4.4 — Validation & Retry: error-informed retries are more efficient and successful than blind retries.]',
  },
  {
    poolId: 160, domain: 'd4', domainLabel: 'Batch Processing',
    examTask: '4.5 Batch Processing Strategies',
    scenario: 'Your team has 200 customer feedback records that need sentiment analysis. Processing them individually with real-time API calls costs $0.004 each and takes 45 minutes total. The results are used in a weekly report — no real-time requirement.',
    question: 'What is the most cost-effective approach?',
    options: [
      'A) Continue real-time processing since $0.80 total cost is already minimal.',
      'B) Use the Message Batches API to submit all 200 analyses in a single batch, reducing cost by 50% ($0.40) while results are ready well before the weekly report deadline.',
      'C) Process records in groups of 20, including multiple records in each API call\'s prompt to reduce the total number of calls.',
      'D) Use a smaller, cheaper model for sentiment analysis since it\'s a simpler task.',
    ],
    correct: 1,
    explanation: 'Message Batches offer 50% cost savings for non-time-sensitive workloads. Since the results feed a weekly report, the batch processing time is well within acceptable bounds. A doesn\'t optimize cost. C risks cross-contamination between records and makes structured output harder. D may reduce accuracy and doesn\'t leverage the batch API\'s cost advantage. [Task 4.5 — Batch Processing: the Message Batches API provides significant cost savings for non-time-sensitive workloads.]',
  },
  {
    poolId: 161, domain: 'd4', domainLabel: 'Multi-Instance Review',
    examTask: '4.6 Multi-Instance & Multi-Pass Review',
    scenario: 'A code review agent misses 15% of bugs when reviewing PRs. You\'re considering running two independent review passes and combining results. Initial testing shows: running the same prompt twice catches 92% of bugs (the same model rarely misses the same bug twice), but also produces 30% duplicate comments that developers must filter through.',
    question: 'What multi-instance pattern would maximize bug detection while minimizing noise?',
    options: [
      'A) Run two passes and present all findings, letting developers filter duplicates.',
      'B) Run two passes with different prompt perspectives: one focused on correctness (bugs, logic errors, edge cases) and one focused on robustness (error handling, security, performance). Deduplicate findings by file and line number before presenting.',
      'C) Run a single pass with a longer, more detailed prompt instead of multiple passes.',
      'D) Run three passes and only surface findings that appear in at least two of the three.',
    ],
    correct: 1,
    explanation: 'Complementary perspectives ensure different types of issues are caught by different passes, and deduplication by file/line number eliminates noise. A pushes the filtering burden to developers. C doesn\'t benefit from the diversity of independent reviews. D suppresses real findings that only one pass catches, potentially missing unique bugs. [Task 4.6 — Multi-Instance Review: complementary perspectives with deduplication maximize coverage while minimizing noise.]',
  },
  {
    poolId: 162, domain: 'd4', domainLabel: 'Prompts with Explicit Criteria',
    examTask: '4.1 Prompts with Explicit Criteria',
    scenario: 'A hiring screening agent rates resumes on a 1-10 scale. The prompt says: "Rate candidates based on experience and skills." Two identical resumes scored 6 and 9 in separate runs, demonstrating high variance. The team needs consistent scoring within ±1 point.',
    question: 'What prompt change would most effectively reduce scoring variance?',
    options: [
      'A) Define explicit scoring rubrics: a detailed breakdown where each score range has specific criteria (e.g., "8-10: 7+ years experience with 3+ relevant certifications AND demonstrated leadership; 5-7: 3-6 years with 1-2 certifications; 1-4: less than 3 years or no certifications").',
      'B) Run the scoring 3 times and use the median score to reduce variance.',
      'C) Add examples of resumes at each score level so the agent can pattern-match.',
      'D) Switch to a pass/fail classification instead of a 10-point scale to reduce ambiguity.',
    ],
    correct: 0,
    explanation: 'Explicit scoring rubrics with detailed criteria for each range eliminate the subjectivity that causes variance. Every evaluation is anchored to specific, measurable criteria. B masks variance statistically but doesn\'t improve individual scoring consistency. C helps but is less comprehensive than a full rubric. D avoids the problem rather than solving it. [Task 4.1 — Explicit Criteria: scoring rubrics with detailed criteria per range dramatically reduce evaluation variance.]',
  },
  {
    poolId: 163, domain: 'd4', domainLabel: 'Few-Shot Prompting',
    examTask: '4.2 Few-Shot Prompting',
    scenario: 'A medical triage agent classifies patient symptoms into urgency levels (1-5). With 5 few-shot examples, accuracy is 78%. Adding 10 more examples (15 total) only improves accuracy to 80% while consuming 3,000 additional tokens per request.',
    question: 'What is the likely reason for the small improvement, and what alternative approach might be more effective?',
    options: [
      'A) The model has reached its capability ceiling — no prompt changes will improve accuracy further.',
      'B) The additional examples may overlap with existing ones in the patterns they teach. Instead of more examples, add chain-of-thought reasoning instructions: "Before classifying, identify the key symptoms, assess their severity individually, and explain your urgency reasoning."',
      'C) Replace the few-shot approach entirely with a fine-tuned model trained on historical triage data.',
      'D) Use a different model that supports a larger context window to accommodate more examples.',
    ],
    correct: 1,
    explanation: 'Diminishing returns from additional examples suggest the model has learned the basic pattern but struggles with reasoning about novel cases. Chain-of-thought instructions encourage explicit reasoning that improves accuracy on edge cases without adding token-heavy examples. A is premature — prompt improvements are still available. C is a heavy investment when prompt engineering hasn\'t been exhausted. D addresses capacity rather than reasoning quality. [Task 4.2 — Few-Shot Prompting: when adding more examples shows diminishing returns, switching to chain-of-thought reasoning is often more effective.]',
  },
  {
    poolId: 164, domain: 'd4', domainLabel: 'Validation & Retry',
    examTask: '4.4 Validation, Retry & Feedback Loops',
    scenario: 'A product description generator occasionally produces descriptions with hallucinated features not present in the product spec. This happens in 18% of generations. Each generation costs $0.008. Currently, you validate by checking if all claimed features exist in the spec, and regenerate if not.',
    question: 'What approach would most effectively reduce hallucinations at the source rather than catching them after generation?',
    options: [
      'A) Increase the retry budget from 2 to 5 attempts to ensure at least one clean generation.',
      'B) Restructure the prompt to explicitly constrain output: "Using ONLY the features listed in the product specification below, write a description. Do NOT mention any feature, capability, or specification that is not explicitly stated in the provided spec." Then include the complete product spec as context.',
      'C) Add a post-generation verification step where a second Claude call checks the description against the spec.',
      'D) Use a lower temperature (0.1) to reduce creative hallucinations.',
    ],
    correct: 1,
    explanation: 'Constraining the output to only referenced information in the prompt, combined with the complete spec as context, directly prevents hallucinations at the source. The key is the explicit instruction + source material. A catches failures after they occur. C adds cost and latency for verification. D reduces creativity but doesn\'t prevent hallucinations when the model doesn\'t have the correct information. [Task 4.4 — Validation & Retry: prevention through prompt constraints is more effective than post-generation validation.]',
  },
  {
    poolId: 165, domain: 'd4', domainLabel: 'Batch Processing',
    examTask: '4.5 Batch Processing Strategies',
    scenario: 'A document analysis system processes 50 contracts per day using real-time API calls at $0.02 each ($1.00/day). Your manager wants to reduce costs. The contracts are submitted throughout the day but results are only needed by 9 AM the next morning.',
    question: 'What is the optimal batch processing strategy?',
    options: [
      'A) Accumulate contracts throughout the day and submit them as a single Message Batch at 6 PM. Results arrive overnight, well before the 9 AM deadline, at 50% cost savings.',
      'B) Process contracts immediately as they arrive to maintain low latency, accepting the current cost.',
      'C) Process contracts in real-time but use a cheaper model for simple contracts and the full model only for complex ones.',
      'D) Submit contracts in batches of 10 throughout the day, balancing latency and cost.',
    ],
    correct: 0,
    explanation: 'Since results are only needed by 9 AM the next day, accumulating contracts and submitting as a single batch at 6 PM maximizes cost savings (50%) while comfortably meeting the deadline. B doesn\'t optimize for the actual latency requirement. C adds complexity without leveraging the batch API. D partially optimizes but doesn\'t maximize the batch benefit. [Task 4.5 — Batch Processing: align batch submission timing with actual result deadlines to maximize cost savings.]',
  },
];

export default d4New;
