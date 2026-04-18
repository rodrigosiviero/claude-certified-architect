import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronRight, CheckCircle2, Circle, Code, BookOpen, FlaskConical, ArrowRight, AlertTriangle, Lightbulb, ExternalLink , Brain } from 'lucide-react';
import { useCourse } from '../context/CourseContext';
import DomainQuiz from '../components/DomainQuiz';
import MindMap from '../components/MindMap';
import { domain4MindMap } from '../data/mindMaps';
import domain4Quiz from '../data/quizzes/domain4';
import domain4QuickRef from '../data/quickRefs/domain4';
import QuickRef from '../components/QuickRef';
import { domain4Explanations } from '../data/lessons';
import LessonContent from '../components/LessonContent';
import NotesFab from '../components/NotesFab';

const lessons = [
  {
    id: '4-1',
    title: 'Prompts with Explicit Criteria',
    duration: '40 min',
    description: 'Design prompts that reduce false positives through specific, categorical criteria. Vague instructions like "be conservative" fail — Claude needs concrete definitions of what to flag, what to ignore, and how to classify severity.',
    knowledge: [
      'Explicit criteria vs vague instructions: "flag only when the answer directly contradicts the source text" is explicit and actionable. "Check accuracy carefully" is vague and produces inconsistent results. The exam tests this distinction directly.',
      'General instructions like "be conservative" or "only flag high-confidence findings" fail to improve precision because Claude interprets these subjectively. One session\'s "conservative" is another session\'s "moderate." Replace with categorical rules.',
      'The categorical approach: define specific categories with inclusion/exclusion criteria. Instead of "check for issues," define: "CRITICAL: syntax errors, security vulnerabilities, data loss. WARNING: performance regressions, missing error handling. INFO: style issues, naming conventions."',
      'False positive rates impact developer trust. If a code review bot flags 50 issues per file and 45 are false positives, developers start ignoring ALL findings — including the 5 real ones. Explicit criteria keep the signal-to-noise ratio high.',
      'Severity criteria with concrete examples enable consistent classification. "HIGH: any issue that could cause data loss or security breach. MEDIUM: issues that degrade performance or user experience. LOW: style or maintainability concerns." Each level has a concrete definition.',
      'The "when in doubt, don\'t flag" pattern: for classification tasks, explicitly state that ambiguous cases should be excluded rather than included. This dramatically reduces false positives at the cost of potentially missing some true positives — which is usually the right tradeoff.',
      'Testing your criteria: run the same prompt against 10 example inputs. If results are inconsistent across runs, your criteria are too vague. Add more specific conditions until Claude produces consistent outputs.',
    ],
    skills: [
      'Write categorical criteria with concrete definitions',
      'Include severity levels with examples for each',
      'Add explicit "when NOT to flag" conditions',
      'Test prompt consistency across multiple runs',
    ],
    codeExample: `// ❌ BAD: Vague instructions produce inconsistent results
const badPrompt = \`
Review this code and flag any issues you find.
Be conservative and only report real problems.
Focus on accuracy.
\`;
// "Conservative" is subjective. Claude flags different issues each run.

// ✅ GOOD: Explicit criteria with categories and examples
const goodPrompt = \`
Review the code for the following SPECIFIC issue categories.
Only flag issues that match these EXACT definitions.

## CRITICAL — Flag if present:
- SQL injection: user input concatenated into SQL strings
  Example: \`query("SELECT * FROM users WHERE id = " + userId)\`
- Hardcoded secrets: API keys, passwords, tokens in source code
  Example: \`const API_KEY = "sk-abc123..."\`
- Unbounded queries: database queries without LIMIT or pagination
  Example: \`SELECT * FROM orders\` (no LIMIT clause)

## WARNING — Flag if present:
- Missing error handling: try/catch without specific error types
  Example: \`catch (e) { console.log(e) }\` (swallows errors)
- N+1 queries: database queries inside loops
  Example: \`for (const user of users) { db.query("...", user.id) }\`

## DO NOT FLAG:
- Code style preferences (naming, formatting)
- Missing comments or documentation
- Performance optimizations without measured bottleneck
- Abstract architectural concerns without concrete evidence

For each finding, include:
- Category: CRITICAL | WARNING
- Line number
- Exact code snippet
- Why it matches the specific criterion (quote the criterion)
- Suggested fix

When in doubt about whether something matches a criterion,
DO NOT flag it. False negatives are acceptable; false positives are not.
\`;

// The difference in practice:
// Bad prompt on a 200-line file: 15 findings, 12 false positives (80%)
// Good prompt on the same file:  3 findings, 0 false positives (100%)
// Developers trust and act on the good prompt's output.`,
    antiPatterns: [
      {
        pattern: 'Vague instructions like "be conservative"',
        problem: '"Conservative" is subjective. Claude\'s interpretation varies between sessions. Replace with specific categorical rules.',
      },
      {
        pattern: 'Open-ended "flag any issues" prompts',
        problem: 'Without boundaries, Claude flags everything — style issues, opinions, non-issues. Define exact categories with concrete inclusion/exclusion criteria.',
      },
      {
        pattern: 'No "when NOT to flag" guidance',
        problem: 'Without negative examples, Claude doesn\'t know what to skip. Explicitly list what should NOT be flagged to keep the signal-to-noise ratio high.',
      },
    ],
    keyConcepts: [
      { concept: 'Categorical criteria', description: 'Specific categories with concrete definitions: CRITICAL, WARNING, INFO. Each with examples of what IS and ISN\'T included.' },
      { concept: 'False positive cost', description: 'High false positive rates destroy developer trust. Better to miss some issues than flood with noise.' },
      { concept: 'When in doubt, don\'t flag', description: 'Explicitly instruct Claude to skip ambiguous cases. Reduces false positives at acceptable cost.' },
      { concept: 'Consistency testing', description: 'Run prompts against 10 examples. Inconsistent results = vague criteria. Add specificity until consistent.' },
    ],
    resources: [
      { label: 'Prompt Engineering Guide (Official)', url: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview' },
      { label: 'Be Clear and Direct', url: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/be-clear-and-direct' },
    ],
    examTips: [
      '"Code review flags too many false positives" → answer: replace vague instructions with explicit categorical criteria.',
      '"Be conservative" is NOT a valid instruction. The exam tests this.',
      'Explicit "when NOT to flag" conditions are as important as "what to flag."',
    ],
  },
  {
    id: '4-2',
    title: 'Few-Shot Prompting',
    duration: '40 min',
    description: 'Use 2-4 targeted examples to demonstrate desired behavior for edge cases, tool selection, and output formatting. Examples are more effective than descriptions for teaching Claude how to handle ambiguous situations.',
    knowledge: [
      'Few-shot = providing examples of input/output pairs in the prompt so Claude can learn the pattern. 2-4 examples is the sweet spot. More than 6 examples rarely improves results and wastes tokens.',
      'Examples demonstrate ambiguous-case handling. This is where few-shot shines. "When the user says \'cancel my order\', call cancel_order NOT search_orders" is a teaching example that prevents a real routing error.',
      'Targeted examples beat comprehensive lists. Don\'t provide 20 examples covering every possible input. Instead, provide 2-4 examples that cover the AMBIGUOUS cases — the situations where Claude would most likely make a mistake.',
      'Show the reasoning, not just the answer. "User: cancel my order. Thought: User explicitly wants to cancel, not search. Tool: cancel_order. Input: {order_id: extract from context}" teaches Claude the reasoning chain.',
      'Examples enable generalization to novel patterns. Claude doesn\'t just memorize the examples — it learns the underlying pattern and applies it to new situations it hasn\'t seen before. This is why 2-4 examples can handle thousands of inputs.',
      'Examples reduce hallucination in extraction tasks. When extracting structured data from documents, showing 2-3 examples of the expected output format dramatically reduces formatting errors and invented fields.',
      'Include negative examples: "User: what\'s the weather? Tool: get_weather (NOT search_orders). Reason: weather query is unrelated to orders." Explicitly showing what NOT to do is as valuable as showing what TO do.',
      'The format: for each example, show (1) input, (2) reasoning/thought process, (3) output/tool call. The reasoning teaches Claude WHY the output is correct, enabling it to handle cases not in the examples.',
    ],
    skills: [
      'Create 2-4 examples covering the most ambiguous cases',
      'Include reasoning in each example, not just input/output',
      'Add negative examples showing what NOT to do',
      'Use examples to demonstrate output format',
    ],
    codeExample: `// Few-Shot Examples for Tool Selection

// Problem: Claude confuses search_orders and search_products
// Both involve "searching" — the descriptions alone aren't enough

const prompt = \`
You are a customer service agent with these tools:
- search_orders: Find customer orders by ID, email, or status
- search_products: Search product catalog by name or category
- process_refund: Refund an order by ID and amount

Select the correct tool for each user request.

## Example 1 (CLEAR ORDER CASE)
User: "Where is my order ORD-12345?"
Thought: User mentions specific order ID (ORD-12345). This is an order lookup.
Tool: search_orders
Input: { order_id: "ORD-12345" }

## Example 2 (CLEAR PRODUCT CASE)
User: "Do you have wireless headphones under $50?"
Thought: User asks about product availability and price. This is a product search.
Tool: search_products
Input: { query: "wireless headphones under $50" }

## Example 3 (AMBIGUOUS — KEY EXAMPLE)
User: "I bought a laptop last week and want to return it."
Thought: User mentions a past purchase ("bought") and wants to return it.
This involves an ORDER, not a product search. They need to find the order first.
Tool: search_orders
Input: { query: "laptop purchased last week" }
Reason: Even though "laptop" sounds like a product, the intent is order-related.

## Example 4 (NEGATIVE EXAMPLE)
User: "What's the price of the blue widget?"
Tool: search_products (NOT search_orders)
Reason: Price inquiry is about the product catalog, not order history.

## Example 5 (REFUND — DIFFERENT FROM SEARCH)
User: "I want to cancel my order and get my money back."
Thought: User explicitly wants a refund — this is an action, not a search.
Tool: process_refund
Input: { order_id: extract from context }
Reason: Refund is an action (process_refund), not a search (search_orders).
\`;

// Why these 5 examples work:
// 1-2: Clear cases establish the basic pattern
// 3: The AMBIGUOUS case — the one Claude would get wrong without help
// 4: Negative example — what NOT to do
// 5: Shows that similar-sounding requests need different tools

// Few-shot for extraction tasks
const extractionPrompt = \`
Extract company information from text.

## Example 1
Text: "Acme Corp was founded in 2010 by Jane Smith in San Francisco."
Output: {
  "company": "Acme Corp",
  "founded": 2010,
  "founder": "Jane Smith",
  "location": "San Francisco"
}

## Example 2 (AMBIGUOUS — multiple founders)
Text: "TechStart was created by the duo of Alice Chen and Bob Lee in 2020."
Output: {
  "company": "TechStart",
  "founded": 2020,
  "founder": "Alice Chen and Bob Lee",
  "location": null
}

## Example 3 (MISSING INFO — don't hallucinate)
Text: "GlobalCo is a leading provider of cloud services."
Output: {
  "company": "GlobalCo",
  "founded": null,
  "founder": null,
  "location": null
}
Note: null for missing fields — never invent values.

Now extract from: "\${inputText}"
\`;`,
    antiPatterns: [
      {
        pattern: 'Providing 20+ examples covering every case',
        problem: 'More examples don\'t help after 4-6. They waste tokens and can actually confuse Claude. Focus on the ambiguous edge cases.',
      },
      {
        pattern: 'Examples without reasoning',
        problem: '"Input: X, Output: Y" teaches pattern matching. "Input: X, Thought: reason, Output: Y" teaches understanding. The reasoning is where the learning happens.',
      },
      {
        pattern: 'Only positive examples',
        problem: 'Without negative examples, Claude doesn\'t know what NOT to do. "Use get_weather (NOT search_orders)" is as valuable as the positive case.',
      },
    ],
    keyConcepts: [
      { concept: '2-4 targeted examples', description: 'The sweet spot. Enough to learn the pattern, not so many that they waste tokens or confuse.' },
      { concept: 'Ambiguous case focus', description: 'Don\'t waste examples on clear cases. Target the situations where Claude would most likely make a mistake.' },
      { concept: 'Reasoning in examples', description: 'Show the thought process: "Thought: ... Reason: ..." This teaches understanding, not just pattern matching.' },
      { concept: 'Negative examples', description: 'Explicitly show what NOT to do. As valuable as positive examples for preventing errors.' },
    ],
    resources: [
      { label: 'Few-Shot Prompting (Official)', url: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/few-shot-prompting' },
    ],
    examTips: [
      '"Claude picks wrong tool for ambiguous requests" → answer: add 2-4 few-shot examples covering the ambiguous cases with reasoning.',
      'The exam tests the number: 2-4 examples is optimal. Not 1, not 20.',
      'Examples must include reasoning/thought process, not just input/output pairs.',
    ],
  },
  {
    id: '4-3',
    title: 'Structured Output (tool_use + JSON Schema)',
    duration: '40 min',
    description: 'Use tool_use with JSON schemas to enforce guaranteed structured output. Understand tool_choice modes (auto, any, forced), strict mode with additionalProperties: false, and the difference between syntax errors (eliminated by tool_use) and semantic errors (still possible).',
    knowledge: [
      'tool_use with JSON schemas is the most reliable approach for guaranteed schema-compliant structured output. Instead of prompting "respond in JSON," define a tool with the exact JSON schema. Claude fills in the tool parameters = your structured output.',
      'Why tool_use > prompt-based JSON: prompting "respond in JSON" has ~90% valid JSON rate. Claude may forget fields, use wrong types, or wrap in markdown. Tool_use with strict mode has ~100% valid JSON rate because the schema is enforced mechanically.',
      'tool_choice modes: "auto" = model decides whether to use a tool or respond as text (good for flexible agents). "any" = model MUST use a tool but picks which one. {"type": "tool", "name": "extract_x"} = forces a specific tool (guaranteed structured output).',
      'For guaranteed structured extraction, use tool_choice: {"type": "tool", "name": "your_tool"} — this forces Claude to call that specific tool with schema-compliant parameters. No text responses possible.',
      'Strict mode: set additionalProperties: false in your JSON schema. This enables strict mode where Claude MUST provide exactly the fields you specified, no extra fields allowed. Combined with forced tool_choice, this gives the strongest output guarantee.',
      'Syntax errors (malformed JSON, missing brackets) are ELIMINATED by tool_use. The schema enforcement prevents these entirely. This is the key advantage over prompt-based approaches.',
      'Semantic errors (wrong values, hallucinated data) are NOT eliminated by tool_use. The JSON will be valid but the content may be wrong. A schema ensures structure, not truth. You still need validation logic for content accuracy.',
      'Schema design best practices: use "enum" for fixed-value fields (sentiment: ["positive", "negative", "neutral"]), "description" on each property for clarity, required array for mandatory fields, and nested objects for complex structures.',
      'Common exam trap: "I need structured output so I\'ll prompt Claude to respond in JSON." Wrong — use tool_use. "I need guaranteed valid JSON." Use tool_use with strict mode. "I need guaranteed correct content." Schema can\'t help — that needs validation + retry.',
      'The extraction pattern: (1) Define tool with JSON schema matching your desired output. (2) Send messages with tool available. (3) Force tool_choice to that tool. (4) Parse tool_use block content as your structured data. ~100% schema compliance.',
    ],
    codeExample: `import anthropic

client = anthropic.Anthropic()

# Step 1: Define your tool with JSON schema
tools = [{
    "name": "extract_customer_info",
    "description": "Extract structured customer information",
    "input_schema": {
        "type": "object",
        "properties": {
            "name": {"type": "string", "description": "Customer full name"},
            "sentiment": {
                "type": "string",
                "enum": ["positive", "negative", "neutral"],
                "description": "Overall sentiment"
            },
            "issues": {
                "type": "array",
                "items": {"type": "string"},
                "description": "List of mentioned issues"
            }
        },
        "required": ["name", "sentiment"],
        # Strict mode: no extra fields allowed
        "additionalProperties": False
    }
}]

# Step 2: Call with forced tool choice
response = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=1024,
    tools=tools,
    tool_choice={"type": "tool", "name": "extract_customer_info"},
    messages=[{
        "role": "user",
        "content": "I'm Maria Silva. Your app crashed again! I lost my work!"
    }]
)

# Step 3: Extract structured data from tool_use block
for block in response.content:
    if block.type == "tool_use":
        data = block.input  # Guaranteed valid JSON!
        print(f"Customer: {data['name']}")
        print(f"Sentiment: {data['sentiment']}")  # enum: positive/negative/neutral
        print(f"Issues: {data.get('issues', [])}")`,
  },
  {
    id: '4-4',
    title: 'Validation, Retry & Feedback Loops',
    duration: '40 min',
    description: 'Build production-grade extraction pipelines with validation, retry-with-error-feedback loops, and self-correction fields. Understand when retries help (info exists but format wrong) vs when they don\'t (info not in input).',
    knowledge: [
      'Validation feedback loops: when Claude\'s output doesn\'t match expectations, feed the specific error back into the next attempt. "Your previous extraction had these errors: [specific errors]. Fix them." Claude corrects specific issues much better than generic retry.',
      'Retries are effective when the information IS in the input but the FORMAT was wrong (wrong type, missing field, hallucinated value). Retries are INEFFECTIVE when the information is simply NOT in the input. Distinguish these cases before retrying.',
      'The retry-with-error-feedback pattern: (1) Make initial call. (2) Validate output against schema + business rules. (3) If invalid, include the specific error in the next message. (4) Claude sees "you got X wrong, fix it" and corrects. Much more effective than blind retry.',
      'Self-correction fields: add a "correction_notes" or "confidence_per_field" to your schema. Claude fills in confidence scores for each extracted field. Low-confidence fields = flag for human review or additional validation.',
      'Schema validation catches syntax errors (missing fields, wrong types). Business rule validation catches semantic errors (negative age, future dates, impossible values). Both layers are needed for production systems.',
      'Maximum retry limits: set a hard limit (typically 2-3 retries). After max retries, either accept the best attempt or escalate to human. Infinite retry loops are an anti-pattern — they waste tokens without convergence guarantees.',
      'The validation chain: schema validation (JSON valid?) → type validation (string is string?) → range validation (age > 0?) → business logic validation (start_date < end_date?) → cross-field validation (consistent values across fields).',
      'Error messages for retries should be specific: NOT "try again" but "field \'amount\' was missing. Look for currency values in the input and extract them." Specific feedback = specific correction.',
      'Self-correction design: include an explicit "review your extraction" step in the prompt. "Extract the data, then review each field for accuracy before returning." This catches obvious errors before they reach validation.',
      'Common exam trap: "Retries always improve accuracy." Wrong — retries only help when the information exists in the input. If Claude genuinely can\'t find the info, retrying won\'t help. Add "not found" as a valid option in your schema.',
    ],
    codeExample: `import anthropic
import json

client = anthropic.Anthropic()

tools = [{
    "name": "extract_invoice",
    "input_schema": {
        "type": "object",
        "properties": {
            "vendor": {"type": "string"},
            "total": {"type": "number"},
            "date": {"type": "string"},
            "confidence": {
                "type": "object",
                "properties": {
                    "vendor": {"type": "number"},
                    "total": {"type": "number"},
                    "date": {"type": "number"}
                }
            }
        },
        "required": ["vendor", "total", "date"],
        "additionalProperties": False
    }
}]

def extract_with_retry(document: str, max_retries: int = 3):
    messages = [{"role": "user", "content": document}]
    
    for attempt in range(max_retries):
        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1024,
            tools=tools,
            tool_choice={"type": "tool", "name": "extract_invoice"},
            messages=messages
        )
        
        data = next(b.input for b in response.content if b.type == "tool_use")
        errors = validate(data)
        
        if not errors:
            print(f"[attempt {attempt+1}] Extraction valid!")
            return data
        
        # Feed specific errors back for retry
        print(f"[attempt {attempt+1}] Errors: {errors}")
        error_msg = f"Your extraction had these errors:\\n"
        for err in errors:
            error_msg += f"  - {err}\\n"
        error_msg += "\\nPlease fix these specific issues."
        
        messages.append({"role": "assistant", "content": json.dumps(data)})
        messages.append({"role": "user", "content": error_msg})
    
    print("[max retries] Returning best attempt")
    return data

def validate(data):
    errors = []
    if data.get("total", 0) < 0:
        errors.append("total cannot be negative")
    if data.get("vendor") == "":
        errors.append("vendor name is empty — look for company name")
    return errors`,
  },
  {
    id: '4-5',
    title: 'Batch Processing Strategies',
    duration: '30 min',
    description: 'Use the Message Batches API for cost-effective bulk processing. Understand 50% cost savings, custom_id for tracking, and when to use batch vs real-time processing. Design batch pipelines for large-scale extraction tasks.',
    knowledge: [
      'The Message Batches API: submit up to 10,000 requests in a single batch. Claude processes them asynchronously. Results available within 24 hours (usually much faster). Cost: 50% less than standard API calls.',
      'When to use batch: large-scale extraction (thousands of documents), bulk classification, mass summarization, data enrichment pipelines. When NOT to use batch: real-time user-facing requests, interactive chat, time-sensitive operations.',
      'Each request in a batch has a custom_id — your unique identifier for tracking. When results come back, match them by custom_id. This is essential because batch results may return in different order than submitted.',
      'Batch lifecycle: (1) Create batch with array of requests. (2) Poll for completion or use webhooks. (3) Retrieve results. (4) Match results to original requests via custom_id. (5) Handle errors per-request (some succeed, some fail independently).',
      'Error handling in batches: each request is independent. Request #1 succeeding doesn\'t mean request #2 will. Check the result status for each custom_id individually. Failed requests can be resubmitted in a new batch.',
      'Batch processing patterns for consistency: include shared context in each request\'s system prompt. Without this, Claude treats each request independently and may give inconsistent results across the batch.',
      'Cost comparison: Standard API = $X per token. Batch API = $0.5X per token (50% savings). At scale (10,000+ documents), this is significant. Tradeoff: latency (hours vs seconds).',
      'Rate limits: batches have separate rate limits from standard API. You can submit batches while also making real-time calls. They don\'t compete for the same rate limit quota.',
      'Common exam scenario: "You need to process 5,000 customer feedback forms for sentiment analysis. Budget is limited. Time is not critical." Answer: Use Message Batches API for 50% cost savings.',
      'Anti-pattern: using batch for real-time requests to save money. The 24-hour processing window makes this unusable for interactive applications. Use batch only for asynchronous, bulk workloads.',
    ],
    codeExample: `import anthropic

client = anthropic.Anthropic()

# Step 1: Create a batch with multiple requests
batch = client.messages.batches.create(
    requests=[
        {
            "custom_id": "invoice-001",
            "params": {
                "model": "claude-sonnet-4-20250514",
                "max_tokens": 1024,
                "messages": [{
                    "role": "user",
                    "content": "Extract vendor and total from: Acme Corp Invoice #1234, Total: $1,250.00"
                }]
            }
        },
        {
            "custom_id": "invoice-002",
            "params": {
                "model": "claude-sonnet-4-20250514",
                "max_tokens": 1024,
                "messages": [{
                    "role": "user",
                    "content": "Extract vendor and total from: Beta LLC Invoice #5678, Total: $3,400.00"
                }]
            }
        },
    ]
)

print(f"Batch created: {batch.id}")
print(f"Status: {batch.processing_status}")
# 50% cost savings vs individual API calls!

# Step 2: Poll for completion (or use webhooks)
import time
while True:
    result = client.messages.batches.retrieve(batch.id)
    if result.processing_status == "ended":
        break
    print(f"Processing... {result.request_counts}")
    time.sleep(10)

# Step 3: Retrieve and match results by custom_id
for entry in client.messages.batches.results(batch.id):
    print(f"\\n[{entry.custom_id}]")
    if entry.result.type == "succeeded":
        content = entry.result.message.content[0].text
        print(f"  Result: {content}")
    elif entry.result.type == "errored":
        print(f"  Error: {entry.result.error}")
        # Can resubmit this specific request in a new batch`,
  },
  {
    id: '4-6',
    title: 'Multi-Instance & Multi-Pass Review',
    duration: '45 min',
    description: 'Design systems with independent reviewer instances and multi-pass analysis. Understand self-review bias, confidence routing, and why separate Claude instances catch issues that self-review misses.',
    knowledge: [
      'Self-review bias: a model that generates output retains reasoning context, making it less likely to question its own decisions. It "knows" what it intended and approves its own work. Independent instances (without prior reasoning context) are more effective at catching subtle issues.',
      'Multi-instance review architecture: use SEPARATE Claude instances for generation and review. The generator produces content. The reviewer (independent instance with no generation context) reviews it. This avoids confirmation bias.',
      'Why separate instances matter: the generation instance "knows" what it intended and is more likely to approve its own work. The review instance starts fresh and catches issues the generator would miss. The exam tests this distinction directly.',
      'Multi-pass review: Pass 1 = per-file local analysis (syntax, types, bugs). Pass 2 = cross-file integration analysis (imports, interfaces, data flow). Pass 3 = architectural review (patterns, security, performance). Each pass catches different issues.',
      'Confidence routing: use model confidence scores as routing signals, NOT as ground truth. High confidence → auto-approve. Medium confidence → human review. Low confidence → investigate or reject. Confidence is poorly calibrated but useful for relative prioritization.',
      'The "review the reviewer" pattern: periodically sample review outputs and have a human check them. If the reviewer is producing systematic false positives or missing a category of issues, adjust the review prompt. Don\'t trust automated review blindly.',
      'Batch review patterns: for large-scale tasks (reviewing 100 files), process in batches. Include a summary of prior batch findings in each new batch to maintain consistency. Without this, Claude treats each batch independently and may give contradictory guidance.',
      'Cross-cutting concerns: single-pass review misses issues that span multiple files or components. Security vulnerabilities in the interaction between two components, data flow issues across API boundaries — these require multi-pass or integration-level review.',
      'Cost vs coverage tradeoff: every additional review pass costs tokens. Not every output needs 3 passes. Route complexity: simple outputs → single pass, complex outputs → multi-pass, high-stakes outputs → human + multi-pass.',
      'Common exam trap: "Use Claude to review its own output for errors." This is self-review. The correct pattern is "Use a separate Claude instance to review the output." The distinction matters — independent review catches more issues.',
    ],
    codeExample: `import anthropic

client = anthropic.Anthropic()

# GENERATOR: Separate instance produces code
gen_response = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=1024,
    messages=[{"role": "user",
        "content": "Write a Python function that validates email addresses."}]
)
generated_code = gen_response.content[0].text
print(f"[generator] Produced {len(generated_code)} chars of code")

# REVIEWER: INDEPENDENT instance (no generation context!)
# This is NOT self-review — it's a fresh Claude instance
review_prompt = (
    "You are a code reviewer. Review this code for bugs, "
    "security issues, and edge cases. Be critical.\\n\\n"
    f"Code to review:\\n{generated_code}\\n\\n"
    "List specific issues found. Do NOT be lenient."
)
review_response = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=1024,
    messages=[{"role": "user", "content": review_prompt}]
)
review = review_response.content[0].text
print(f"[reviewer] Found issues:\\n{review}")

# MULTI-PASS: Pass 2 = integration / cross-cutting concerns
pass2_prompt = (
    "Review for cross-cutting concerns:\\n"
    "- Error handling completeness\\n"
    "- User-friendly error messages\\n"
    f"- International email formats\\n\\n"
    f"Original code:\\n{generated_code}\\n\\n"
    f"Pass 1 findings:\\n{review}"
)
pass2 = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=1024,
    messages=[{"role": "user", "content": pass2_prompt}]
)
print(f"[pass-2] Integration review:\\n{pass2.content[0].text}")`,
  },
  {
    id: '4-quiz',
    title: 'Domain 4 Exam Practice Quiz',
    duration: '15 min',
    description: 'Interactive quiz covering all 6 subdomains of prompt engineering and structured output.',
    knowledge: [],
    skills: [],
    codeExample: '',
    quiz: domain4Quiz,
  },
  {
    id: '4-summary',
    title: 'Chapter Summary & Quick Reference',
    duration: '10 min',
    description: 'Visual cheat sheet for exam day — collapsible cards, anti-patterns, and 60-second scan.',
    knowledge: [],
    skills: [],
    codeExample: '',
    quickRef: domain4QuickRef,
  },
];

export default function Domain4() {
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const { completeLesson, isLessonCompleted } = useCourse();

  const contextCompletedCount = useMemo(() =>
    lessons.filter(l => isLessonCompleted('domain4', l.id)).length,
    [isLessonCompleted, lessons]
  );
  const displayCompleted = Math.max(contextCompletedCount, completedLessons.size);

  const toggleLesson = (id: string) => {
    setExpandedLesson(expandedLesson === id ? null : id);
  };

  const markComplete = (id: string) => {
    const newCompleted = new Set(completedLessons);
    if (newCompleted.has(id)) {
      newCompleted.delete(id);
    } else {
      newCompleted.add(id);
      completeLesson('domain4', id);
    }
    setCompletedLessons(newCompleted);
  };

  return (
    <div className="space-y-8">
      {/* Domain Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 text-white">
        <div className="flex items-center gap-3 mb-2">
          <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">Domain 4</span>
          <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">20% Exam Weight</span>
        </div>
        <h1 className="text-3xl font-bold mb-2">Prompt Engineering &amp; Structured Output</h1>
        <p className="text-orange-100 max-w-2xl">Design prompts with explicit criteria, implement few-shot prompting, enforce structured output with JSON schemas, build validation loops, and design multi-instance review architectures.</p>
        <div className="flex items-center gap-6 mt-4 text-sm text-orange-100">
          <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" /> 8 Lessons</span>
          <span className="flex items-center gap-1"><FlaskConical className="w-4 h-4" /> Full Code Examples</span>
          <span className="flex items-center gap-1"><Lightbulb className="w-4 h-4" /> Exam Tips</span>
        </div>
      </div>

      {/** Mind Map **/}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
          <Brain className="w-5 h-5 text-amber-500" />
          Mind Map — Key Concepts
        </h2>
        <MindMap data={domain4MindMap.root} />
      </div>

      {/* Progress */}
      <div className="bg-white rounded-xl border p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-700">Progress</span>
          <span className="text-sm text-slate-500">{displayCompleted}/{lessons.length} lessons completed</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2">
          <div
            className="bg-orange-500 h-2 rounded-full transition-all"
            style={{ width: `${(displayCompleted / lessons.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Lessons */}
      <div className="space-y-3">
        {lessons.map((lesson) => {
          const isExpanded = expandedLesson === lesson.id;
          const isCompleted = completedLessons.has(lesson.id) || isLessonCompleted('domain4', lesson.id);

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
                    <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-0.5 rounded">{lesson.id}</span>
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
                    const expl = domain4Explanations.find(e => e.id === lesson.id);
                    return expl ? (
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                          <Lightbulb className="w-4 h-4 text-amber-500" />
                          Learn
                        </h4>
                        <LessonContent content={expl.explanation} domainColor="orange" />
                      </div>
                    ) : null;
                  })()}

                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-orange-500" />
                      Key Knowledge
                    </h4>
                    <ul className="space-y-2">
                      {lesson.knowledge.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                          <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

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

                  {'quiz' in lesson && (lesson as any).quiz ? (
                    <DomainQuiz questions={(lesson as any).quiz} domainColor="violet" domainId="domain4" />
                  ) : 'quickRef' in lesson && (lesson as any).quickRef ? (
                    <QuickRef {...(lesson as any).quickRef} domainColor="violet" />
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

                  {'keyConcepts' in lesson && lesson.keyConcepts && lesson.keyConcepts.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Key Concepts</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {lesson.keyConcepts.map((concept, i) => (
                          <div key={i} className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                            <p className="font-medium text-orange-900 text-sm">{concept.concept}</p>
                            <p className="text-orange-700 text-xs">{concept.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

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

                  <div className="flex justify-end pt-4 border-t border-slate-100">
                    <button
                      onClick={() => markComplete(lesson.id)}
                      className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
                        isCompleted
                          ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          : 'bg-orange-500 text-white hover:bg-orange-600'
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

      <NotesFab lessonId={expandedLesson || '4-1'} />

      {/* Navigation */}
      <div className="flex justify-between pt-8 border-t border-slate-200 dark:border-slate-800">
        <Link
          to="/domain/3"
          className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors"
        >
          Previous: Claude Code Configuration
        </Link>
        <Link
          to="/domain/5"
          className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors"
        >
          Next: Context Management &amp; Safety
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}