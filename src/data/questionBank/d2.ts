/**
 * Question Bank — D2 Prompt Engineering & Context Design (12 questions)
 *
 * Style: Official exam PDF — detailed scenarios with metrics,
 * architectural decision questions, options A-D with prefixes,
 * explanations that reference each alternative.
 */
import type { PoolQuestion } from './d1';

const d2New: PoolQuestion[] = [
  {
    poolId: 134, domain: 'd2', domainLabel: 'System Prompt Design',
    scenario: 'Your customer support agent handles returns, exchanges, and order inquiries. The system prompt is 2,400 tokens and includes 12 few-shot examples. Despite this, the agent frequently gives refund amounts that don\'t match your published return policy — for example, offering full refunds on items clearly marked "final sale" or applying the wrong restocking fee percentage.',
    question: 'What is the most effective change to improve policy compliance?',
    options: [
      'A) Move the return policy details into a structured reference document that Claude retrieves via a tool when handling return requests, rather than embedding policy rules in natural language within the system prompt.',
      'B) Double the number of few-shot examples to 24, covering every edge case in the return policy.',
      'C) Add stronger language to the system prompt: "NEVER deviate from the return policy. This is CRITICAL and MANDATORY."',
      'D) Post-process Claude\'s responses with a regex filter that corrects any refund amounts that don\'t match policy.',
    ],
    correct: 0,
    explanation: 'Structured reference data retrieved via tool is more reliable than natural language instructions for policy enforcement. Claude can parse specific policy rules (restocking percentages, final sale flags) from structured data with higher fidelity than from prose descriptions in the system prompt. Option B increases token cost without addressing the root cause — natural language policy interpretation. Option C uses emphasis that doesn\'t improve comprehension. Option D is a brittle band-aid that doesn\'t scale across policy variations.',
  },
  {
    poolId: 135, domain: 'd2', domainLabel: 'System Prompt Design',
    scenario: 'A content generation agent produces marketing copy for three distinct brand voices: professional (financial services), casual (lifestyle brand), and technical (SaaS product). The agent uses a single system prompt with instructions for all three voices. Output quality scores show: professional voice averages 4.2/5, casual averages 3.1/5, and technical averages 3.8/5. The casual voice frequently sounds forced or inconsistent.',
    question: 'What is the most likely cause and the most effective fix?',
    options: [
      'A) The model is inherently worse at casual writing styles. Switch to a different model specifically for casual content generation.',
      'B) The single system prompt creates cross-contamination between voice profiles. Separate the voice definitions into distinct system prompts or use dynamic prompt assembly that injects only the relevant voice profile based on the target brand.',
      'C) Add more few-shot examples for the casual voice to compensate for the quality gap.',
      'D) Have the agent generate content in a neutral voice and post-process it to match the target brand style.',
    ],
    correct: 1,
    explanation: 'A single system prompt containing multiple voice profiles causes cross-contamination — instructions for professional and technical voices bleed into casual output. Dynamic prompt assembly ensures only the relevant voice profile is active. Option A misdiagnoses the problem as a model limitation. Option C adds examples but doesn\'t fix the conflicting instructions. Option D introduces an unnecessary pipeline stage when the generation step itself can be fixed.',
  },
  {
    poolId: 136, domain: 'd2', domainLabel: 'Context Window Management',
    scenario: 'A legal document analysis agent processes contracts up to 200 pages. The system prompt is 3,000 tokens and includes analysis instructions, output format requirements, and risk categories. For documents over 80 pages, the agent begins omitting sections from its analysis — production audits show it covers only 65% of document sections on average for long contracts.',
    question: 'What is the most effective approach to ensure complete coverage of long documents?',
    options: [
      'A) Compress the system prompt to under 500 tokens to free up context space for the document content.',
      'B) Split long documents into chunks, process each chunk independently with a focused sub-prompt, then synthesize the chunk analyses into a final report with a dedicated synthesis pass.',
      'C) Increase the model\'s temperature to 0.7 to encourage the agent to address more sections.',
      'D) Accept the 65% coverage as a practical limitation and add a disclaimer to reports stating that not all sections may be covered.',
    ],
    correct: 1,
    explanation: 'Chunk-and-synthesize is the standard pattern for documents exceeding effective context utilization. Each chunk gets full attention, and the synthesis pass combines findings. Option A sacrifices important instructions for marginal context savings. Option C is irrelevant — temperature affects creativity, not coverage completeness. Option D accepts poor quality rather than fixing the architectural limitation.',
  },
  {
    poolId: 137, domain: 'd2', domainLabel: 'Context Window Management',
    scenario: 'Your research agent maintains a conversation history of up to 50 turns. By turn 30, the agent starts losing track of constraints specified in turns 3-5 (e.g., "exclude companies with revenue under $10M"). A/B testing shows that placing these constraints in the system prompt instead of the conversation improves compliance from 62% to 94%, but the system prompt is now 4,500 tokens.',
    question: 'What does this data tell you about system prompt placement, and is 4,500 tokens a concern?',
    options: [
      'A) The improvement confirms that critical constraints should be in the system prompt, not conversation history. 4,500 tokens is well within acceptable limits and is a worthwhile trade-off for 94% compliance.',
      'B) 4,500 tokens is too large and will degrade output quality. Move constraints back to conversation history but repeat them every 10 turns as a reminder.',
      'C) The system prompt should only contain role definition. Constraints should be injected as a tool result at each turn to maintain relevance.',
      'D) Store constraints in a separate API parameter (metadata field) rather than in the system prompt to avoid token consumption.',
    ],
    correct: 0,
    explanation: 'The A/B data clearly shows system prompt placement dramatically improves constraint compliance (62% → 94%). System prompts maintain consistent attention across all turns, unlike conversation history where earlier messages receive diminishing attention. 4,500 tokens is well within typical budgets — even a 128K window can accommodate this with ample room for conversation and tool results. Option B repeats constraints inelegantly and reintroduces the original problem. Option C adds unnecessary per-turn token overhead. Option D references a mechanism that doesn\'t exist in the API.',
  },
  {
    poolId: 138, domain: 'd2', domainLabel: 'Prompt Chaining',
    scenario: 'A report generation pipeline chains three Claude calls: (1) DataExtractor extracts key metrics from raw data, (2) Analyst interprets trends and generates insights, (3) Formatter produces the final formatted report. The DataExtractor\'s output is 2,000 tokens of structured JSON. The Analyst receives this JSON plus a 1,500-token analysis prompt. You notice the Analyst occasionally hallucinates metrics not present in the DataExtractor\'s output.',
    question: 'What is the most effective approach to prevent hallucinated metrics in the Analyst stage?',
    options: [
      'A) Add a system prompt instruction to the Analyst: "Only reference metrics that appear verbatim in the provided data. Do not infer or calculate metrics not explicitly present."',
      'B) Have the Formatter stage cross-reference the Analyst\'s output against the DataExtractor\'s JSON and flag any discrepancies.',
      'C) Increase the Analyst\'s temperature to 0 to eliminate creative generation that might produce hallucinated metrics.',
      'D) Merge DataExtractor and Analyst into a single Claude call to eliminate the handoff where hallucination occurs.',
    ],
    correct: 0,
    explanation: 'Explicit constraints in the Analyst\'s system prompt — specifying that only verbatim metrics from the input are permissible — directly addresses the hallucination pattern. This is a targeted fix at the stage where the problem occurs. Option B catches errors after the fact but doesn\'t prevent them. Option C is already the default and doesn\'t address the root cause (the model filling gaps in its understanding). Option D removes the benefits of specialization and makes debugging harder.',
  },
  {
    poolId: 139, domain: 'd2', domainLabel: 'Prompt Chaining',
    scenario: 'Your content pipeline chains four steps: OutlineGenerator → SectionWriter → Editor → FinalReviewer. Each step is an independent Claude API call. The pipeline processes 50 articles/day with an average cost of $0.12 per article. The FinalReviewer rejects 30% of articles and sends them back to SectionWriter with feedback. These rejections add an average of 2 extra API calls per rejected article, increasing total daily cost by 22%.',
    question: 'What change would most effectively reduce rejection-related costs?',
    options: [
      'A) Remove the FinalReviewer stage to eliminate rejections entirely and accept that some articles may need manual review.',
      'B) Feed the FinalReviewer\'s common rejection criteria back into the SectionWriter\'s prompt as explicit guidelines, reducing the initial rejection rate from 30% to an estimated 10-15%.',
      'C) Run the pipeline twice for every article and automatically select the version with fewer editor comments.',
      'D) Consolidate the four steps into two: one call for outline + drafting, and one call for editing + review.',
    ],
    correct: 1,
    explanation: 'Feeding rejection criteria upstream addresses the root cause — the SectionWriter produces content that doesn\'t meet FinalReviewer standards because it lacks those standards. This is the feedforward pattern: propagate quality criteria from downstream validators to upstream generators. Option A eliminates quality control. Option C doubles cost for all articles. Option D loses specialization benefits and makes the pipeline harder to debug.',
  },
  {
    poolId: 140, domain: 'd2', domainLabel: 'System Prompt Design',
    scenario: 'Your technical documentation agent writes API docs for 3 different products: a REST API, a GraphQL API, and a WebSocket API. Each product has different documentation conventions (endpoint format, authentication method, error handling patterns). The agent uses a single system prompt with all three convention sets. When documenting REST endpoints, 20% of the output incorrectly uses GraphQL conventions like query/mutation terminology.',
    question: 'What is the most effective fix for this cross-contamination problem?',
    options: [
      'A) Add few-shot examples for each API type showing the correct conventions, totaling 15 examples in the system prompt.',
      'B) Use dynamic prompt assembly — inject only the documentation conventions relevant to the specific API type being documented, rather than including all three convention sets simultaneously.',
      'C) Add explicit delimiters in the system prompt: "=== REST CONVENTIONS === ... === GRAPHQL CONVENTIONS ===" to help Claude distinguish between them.',
      'D) Train a separate fine-tuned model for each API type to eliminate convention confusion.',
    ],
    correct: 1,
    explanation: 'Dynamic prompt assembly eliminates cross-contamination at the source by only including relevant conventions. This is more token-efficient and eliminates the possibility of convention bleeding. Option A adds token overhead and doesn\'t prevent confusion when all conventions are present simultaneously. Option C is a reasonable mitigation but less effective than simply removing irrelevant conventions. Option D is massive over-engineering when prompt engineering solves the problem.',
  },
  {
    poolId: 141, domain: 'd2', domainLabel: 'Context Window Management',
    scenario: 'A code review agent processes pull requests. For small PRs (1-3 files), it provides detailed, accurate feedback. For large PRs (15+ files), feedback quality degrades — it misses obvious bugs and provides superficial comments for files later in the diff. Context window analysis shows that 15-file PRs consume approximately 95% of the 128K context window.',
    question: 'What architectural change would most improve review quality for large PRs?',
    options: [
      'A) Split large PRs into file-group batches, review each batch independently with full context attention, then run a final integration pass to catch cross-file issues.',
      'B) Use a model with a 200K context window to ensure all files fit with room for detailed analysis.',
      'C) Summarize each file\'s changes into a one-line description before review to reduce token consumption.',
      'D) Only review the first 10 files and flag the PR as "too large for comprehensive automated review."',
    ],
    correct: 0,
    explanation: 'Batching files into focused reviews ensures each file receives full attention, and the integration pass catches cross-file dependencies. This mirrors how human reviewers handle large PRs — they don\'t try to hold everything in working memory simultaneously. Option B delays the problem at higher cost. Option C loses the detail needed for effective review. Option D provides incomplete coverage and shifts the problem to developers.',
  },
  {
    poolId: 142, domain: 'd2', domainLabel: 'Prompt Chaining',
    scenario: 'A data processing pipeline extracts structured information from unstructured medical records using this chain: (1) Preprocessor cleans and normalizes text, (2) EntityExtractor identifies medical entities (conditions, medications, procedures), (3) RelationshipMapper establishes connections between entities, (4) Validator checks output against a medical ontology. Step 2 occasionally extracts invalid entities — for example, extracting "patient expressed frustration" as a medical condition.',
    question: 'At which step should the entity extraction quality be enforced, and what is the most effective approach?',
    options: [
      'A) At Step 4 (Validator) — add stricter validation rules that reject entities not found in the medical ontology.',
      'B) At Step 2 (EntityExtractor) — enhance the system prompt with explicit entity type definitions, inclusion/exclusion criteria, and 3-5 examples of invalid extractions to avoid.',
      'C) Add a new Step 2.5 that uses a second model to re-validate entities before passing to RelationshipMapper.',
      'D) At Step 1 (Preprocessor) — strip out all non-clinical language so EntityExtractor has cleaner input.',
    ],
    correct: 1,
    explanation: 'Fixing quality at the generation stage (Step 2) is more effective than catching errors downstream. Enhanced prompts with explicit definitions and negative examples prevent the invalid extraction pattern at the source. Option A catches errors after they propagate to downstream processing. Option C adds cost and latency for what is fundamentally a prompt quality issue. Option D risks removing clinically relevant context that may include important patient-reported symptoms.',
  },
  {
    poolId: 143, domain: 'd2', domainLabel: 'Few-Shot Examples',
    scenario: 'Your agent classifies customer feedback into 8 sentiment categories. You provide 16 few-shot examples (2 per category) in the system prompt. Accuracy on a test set of 500 examples is 78%. When you add 16 more examples (4 per category), accuracy drops to 72% — the model starts over-indexing on the specific phrasing in examples rather than understanding the underlying sentiment patterns.',
    question: 'What does this indicate about your few-shot strategy, and what is the best adjustment?',
    options: [
      'A) The additional examples introduced noise. Reduce to 8 well-chosen examples (1 per category) that are maximally diverse in phrasing and tone, and add explicit classification criteria to the system prompt.',
      'B) The model is underfitting. Increase to 32 examples (4 per category) and add more epochs of training.',
      'C) Few-shot examples are counterproductive. Remove all examples and rely solely on the category definitions.',
      'D) The 16 original examples were optimal. Revert to the original set and accept 78% as the ceiling for this approach.',
    ],
    correct: 0,
    explanation: 'The accuracy drop when adding examples indicates overfitting to example phrasing rather than learning classification criteria. Fewer, more diverse examples with explicit criteria define the decision boundaries without anchoring the model to specific phrasings. Option B misunderstands the problem — this isn\'t underfitting but over-anchoring. Option C is an overreaction — few-shot examples are valuable when used judiciously. Option D accepts a suboptimal result without trying the most promising intervention.',
  },
  {
    poolId: 144, domain: 'd2', domainLabel: 'System Prompt Design',
    scenario: 'You have a system prompt of 1,800 tokens for your agent. You need to add detailed output formatting instructions (another 1,200 tokens), domain-specific constraints (800 tokens), and 6 few-shot examples (2,400 tokens). Your total system prompt would be 6,200 tokens, leaving 121,800 tokens for conversation and tool results in a 128K window.',
    question: 'Is this system prompt size a concern, and what optimization should you consider?',
    options: [
      'A) 6,200 tokens is under 5% of the context window — this is fine. No optimization needed.',
      'B) This is a concern. Replace the 6 few-shot examples (2,400 tokens) with explicit output format schemas and validation rules that achieve the same formatting consistency for fewer tokens.',
      'C) This is a concern. Move all formatting instructions and constraints into the conversation history on the first user message to avoid consuming system prompt tokens.',
      'D) This is a concern. Use a larger model (200K context) to ensure the system prompt doesn\'t crowd conversation space.',
    ],
    correct: 1,
    explanation: 'While 6,200 tokens fits in a 128K window, few-shot examples are often the least token-efficient way to establish formatting patterns. Explicit schemas (JSON format, validation rules) can achieve similar or better compliance for a fraction of the token cost. Option A ignores the compounding effect — this 6,200 tokens is consumed on every single API call, including follow-up turns. Option C moves instructions to a less prominent position in the context. Option D increases cost without addressing the inefficiency.',
  },
  {
    poolId: 145, domain: 'd2', domainLabel: 'Context Window Management',
    scenario: 'A financial analysis agent maintains long conversations with portfolio managers. By turn 20, the agent begins referencing incorrect figures from earlier in the conversation — stating a portfolio returned 12% when the actual figure discussed in turn 3 was 8.2%. Testing shows this hallucination rate for earlier-turn figures is 18% by turn 25.',
    question: 'What is the most effective approach to maintain factual accuracy across long conversations?',
    options: [
      'A) Implement a periodic summarization step — every 10 turns, summarize the key figures and decisions, then prepend the summary to subsequent context. This trades granularity for accuracy on critical figures.',
      'B) Increase the model\'s temperature to improve attention to earlier context.',
      'C) Require the user to restate key figures every 5 turns.',
      'D) Store all figures in a structured database accessed via tool, and instruct the agent to always verify figures from the database rather than relying on conversation memory.',
    ],
    correct: 3,
    explanation: 'Storing critical data in a structured tool-accessed database provides deterministic accuracy — the agent retrieves exact figures rather than relying on increasingly unreliable attention to earlier conversation turns. This is the principle of using tools as external memory for high-stakes data. Option A reduces but doesn\'t eliminate hallucination risk. Option B is irrelevant to attention accuracy. Option C imposes an unreasonable burden on the user.',
  },
];

export default d2New;
