import { useState } from 'react';
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
    title: 'Extended Thinking',
    duration: '40 min',
    description: 'Extended thinking gives Claude a private scratchpad for complex reasoning. Understand when to enable it (multi-step logic, math, complex analysis), when NOT to (simple tasks, time-sensitive), and the tradeoffs (higher cost, higher latency, higher accuracy).',
    knowledge: [
      'Extended thinking gives Claude a private "scratchpad" where it works through problems step-by-step before producing the final answer. Think of it like a human working on scratch paper before showing their work.',
      'When to use extended thinking: multi-step mathematical reasoning, complex code analysis with many interdependencies, legal or compliance analysis requiring careful reasoning, tasks where getting the wrong answer is very costly.',
      'When NOT to use extended thinking: simple classification tasks, straightforward extraction, any task where the answer is obvious. Extended thinking adds latency and cost for tasks that Claude can handle well without it.',
      'The tradeoff triangle: Extended thinking increases accuracy AND cost AND latency. You gain reasoning depth at the expense of speed and token usage. Only enable when the accuracy gain justifies the cost.',
      'Extended thinking budget: you can set a thinking budget (token limit) to control how long Claude thinks. Higher budgets allow deeper reasoning but increase latency and cost. Find the right balance for your task complexity.',
      'The thinking is private: Claude\'s extended thinking content is NOT visible to tools or downstream systems. Only the final answer (after thinking) is returned. This means the thinking won\'t pollute tool inputs or structured outputs.',
      'Model support: extended thinking is available on Claude Sonnet 4 and Claude Opus 4. It is not available on all model variants. Check the docs for current support.',
      'The exam tests the "when to use" decision: if a question asks "should extended thinking be used for X?", evaluate based on task complexity. Simple tasks = no. Multi-step reasoning = yes.',
    ],
    skills: [
      'Evaluate when extended thinking improves accuracy',
      'Set appropriate thinking budgets for task complexity',
      'Understand the cost/latency/accuracy tradeoff',
      'Know which models support extended thinking',
    ],
    codeExample: `// Extended Thinking Configuration

// Basic extended thinking enablement
const response = await anthropic.messages.create({
  model: "claude-sonnet-4-20250514",
  max_tokens: 16000,
  thinking: {
    type: "enabled",
    budget_tokens: 10000  // How long Claude can think
  },
  messages: [{
    role: "user",
    content: "Analyze this financial model and identify any logical errors in the assumptions."
  }]
});

// Response structure with extended thinking
// {
//   content: [
//     { type: "thinking", thinking: "Let me work through this..." },
//     { type: "text", text: "The final answer after reasoning..." }
//   ]
// }

// WHEN TO USE — Good candidates for extended thinking

// 1. Complex multi-step math
// "Calculate the compound interest on $10,000 at 3.5% APR
//  compounded monthly for 15 years, then adjust for 2.1% annual inflation."
// → Multiple calculation steps, easy to make arithmetic errors

// 2. Complex code analysis
// "This function has a race condition. Identify all possible
//  interleavings of the concurrent operations and which ones cause bugs."
// → Requires systematic reasoning about many possible execution paths

// 3. Legal/compliance analysis
// "Compare this contract clause against GDPR Article 6(1) lawful bases
//  and identify potential compliance gaps."
// → Requires careful reading and comparison against legal standards

// WHEN NOT TO USE — Bad candidates for extended thinking

// 1. Simple classification
// "Is this email spam or not spam?" → No multi-step reasoning needed

// 2. Straightforward extraction
// "Extract the company name and date from this text" → Direct task

// 3. Simple formatting
// "Convert this JSON to a markdown table" → Mechanical transformation

// Setting the budget based on task complexity

// Light reasoning (simple multi-step)
thinking: { type: "enabled", budget_tokens: 5000 }

// Moderate reasoning (analysis with several factors)
thinking: { type: "enabled", budget_tokens: 10000 }

// Deep reasoning (complex math, legal analysis, many variables)
thinking: { type: "enabled", budget_tokens: 20000 }

// Tradeoff summary:
// More budget → More accurate + More expensive + Slower response
// Less budget → Less accurate + Cheaper + Faster response`,
    antiPatterns: [
      {
        pattern: 'Using extended thinking for simple tasks',
        problem: 'Adding 5-10 seconds of latency and 10K+ tokens for a classification task that Claude handles in milliseconds without thinking.',
      },
      {
        pattern: 'No budget limit',
        problem: 'Without budget_tokens, extended thinking can consume massive tokens for tasks that don\'t need it. Always set a budget.',
      },
    ],
    keyConcepts: [
      { concept: 'Private scratchpad', description: 'Claude reasons in a private thinking space. The reasoning is NOT visible to tools or downstream systems.' },
      { concept: 'Cost/latency/accuracy triangle', description: 'Extended thinking increases all three: more accurate, more expensive, slower response.' },
      { concept: 'Thinking budget', description: 'budget_tokens controls how long Claude thinks. Match budget to task complexity.' },
    ],
    resources: [
      { label: 'Extended Thinking (Official Docs)', url: 'https://docs.anthropic.com/en/docs/build-with-claude/extended-thinking' },
    ],
    examTips: [
      '"Should extended thinking be used?" → Evaluate task complexity. Multi-step reasoning = yes. Simple classification = no.',
      'The tradeoff: extended thinking improves accuracy but increases cost and latency.',
      'Budget tokens control thinking depth. Always set a budget appropriate to task complexity.',
    ],
  },
  {
    id: '4-4',
    title: 'Structured Output with JSON Schemas',
    duration: '40 min',
    description: 'Enforce reliable structured output using tool use with JSON schemas. Tool use is the recommended approach for structured extraction — more reliable than prompt-based formatting. Combine with validation and retry loops for production systems.',
    knowledge: [
      'Structured output means getting Claude to return data in a predictable format (like JSON) instead of free-text. This is essential for any system that needs to parse Claude\'s output programmatically.',
      'Tool use is the recommended approach for structured output. Instead of asking Claude to "respond in JSON," define a tool with the exact JSON schema you want. Claude fills in the tool parameters = your structured output.',
      'Why tool use > prompt-based JSON: when you say "respond in JSON," Claude might forget a field, use wrong types, or add markdown formatting around the JSON. Tool use enforces the schema — Claude MUST provide all required fields in the correct types.',
      'JSON schema defines the structure: required fields, field types, enums, descriptions. Example: { type: "object", properties: { sentiment: { type: "string", enum: ["positive", "negative", "neutral"] } }, required: ["sentiment"] }.',
      'The tool result trick: instead of actually executing the tool, you just parse the tool_use response as your structured output. Claude thinks it\'s calling a tool, but you\'re using the tool call as your data format.',
      'Validation + retry loop: even with schemas, Claude might return logically invalid data (e.g., a date in the future when you need past dates). Add a validation step that checks the output and retries with specific error feedback.',
      'Retries are effective for format/consistency errors but NOT when the information is simply absent from the input. If the document doesn\'t mention a founding date, retrying won\'t create one — Claude will hallucinate.',
      'Self-correction pattern: include a "confidence" field in the schema. Claude can rate its own confidence, and low-confidence fields can be flagged for human review. Don\'t trust self-reported confidence blindly, but it\'s a useful signal.',
    ],
    skills: [
      'Define JSON schemas for structured extraction',
      'Use tool use as the extraction mechanism',
      'Implement validation + retry loops with error feedback',
      'Distinguish effective retries (format errors) from ineffective (missing info)',
    ],
    codeExample: `// Structured Output via Tool Use

// Step 1: Define the schema as a tool
const extractionTool = {
  name: "extract_company_info",
  description: "Extract structured company information from text",
  input_schema: {
    type: "object",
    properties: {
      company_name: {
        type: "string",
        description: "The official company name"
      },
      founded_year: {
        type: "number",
        description: "Year the company was founded. null if not mentioned."
      },
      headquarters: {
        type: "string",
        description: "City and country of headquarters. null if not mentioned."
      },
      industry: {
        type: "string",
        enum: ["technology", "healthcare", "finance", "retail", "manufacturing", "other"],
        description: "Primary industry sector"
      },
      employee_count: {
        type: "number",
        description: "Approximate number of employees. null if not mentioned."
      },
      confidence: {
        type: "number",
        description: "Overall confidence in extraction (0.0 to 1.0)"
      }
    },
    required: ["company_name", "industry", "confidence"]
  }
};

// Step 2: Call Claude with the tool
const response = await anthropic.messages.create({
  model: "claude-sonnet-4-20250514",
  tools: [extractionTool],
  tool_choice: { type: "tool", name: "extract_company_info" },
  // Force this specific tool = guaranteed structured output
  messages: [{
    role: "user",
    content: "Acme Technologies was started in 2015 by former Google engineers in Austin, TX. They have about 200 employees."
  }]
});

// Step 3: Parse the tool call as your structured data
const toolCall = response.content.find(block => block.type === "tool_use");
const extractedData = toolCall.input;
// {
//   company_name: "Acme Technologies",
//   founded_year: 2015,
//   headquarters: "Austin, TX",
//   industry: "technology",
//   employee_count: 200,
//   confidence: 0.95
// }

// Step 4: Validation + Retry Loop
async function extractWithRetry(text, maxAttempts = 3) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const response = await callClaude(text);
    const data = parseToolCall(response);

    // Validate
    const errors = validate(data);
    if (errors.length === 0) return data;

    // Retry with specific error feedback
    if (attempt < maxAttempts) {
      text += \`\\n\\nPrevious extraction attempt had errors:
\${errors.join("\\n")}
Please fix these specific issues.\`;
    }
  }
  throw new Error("Max retries exceeded");
}

function validate(data) {
  const errors = [];
  if (data.founded_year && data.founded_year > new Date().getFullYear()) {
    errors.push("founded_year cannot be in the future");
  }
  if (data.employee_count && data.employee_count < 0) {
    errors.push("employee_count cannot be negative");
  }
  if (!data.company_name || data.company_name.length < 2) {
    errors.push("company_name is too short or missing");
  }
  return errors;
}

// IMPORTANT: Retries are effective for FORMAT errors
// Retries are INEFFECTIVE when info is simply absent
// If the text doesn't mention headquarters, retrying won't help
// — Claude will either return null (good) or hallucinate (bad)`,
    antiPatterns: [
      {
        pattern: 'Prompt-based JSON ("respond in JSON")',
        problem: 'Claude might forget fields, use wrong types, add markdown. Tool use with JSON schema enforces structure reliably.',
      },
      {
        pattern: 'Retrying when information is absent',
        problem: 'If the document doesn\'t contain a founding date, retrying won\'t create one. Retries fix format errors, not missing information.',
      },
      {
        pattern: 'Blind trust in self-reported confidence',
        problem: 'Claude\'s confidence scores are poorly calibrated. Use them as a signal, not ground truth. Flag low-confidence fields for human review.',
      },
    ],
    keyConcepts: [
      { concept: 'Tool use for extraction', description: 'Define the desired output as a tool schema. Force tool_choice to that tool. Parse tool call as structured data.' },
      { concept: 'JSON schema enforcement', description: 'Required fields, type constraints, enums. Claude MUST comply with the schema when using tool use.' },
      { concept: 'Validation + retry', description: 'Check extracted data for logical validity. Retry with specific error feedback for format errors. Don\'t retry for missing info.' },
    ],
    resources: [
      { label: 'Structured Output (Official Docs)', url: 'https://docs.anthropic.com/en/docs/build-with-claude/structured-output' },
    ],
    examTips: [
      '"Need reliable JSON output" → answer: use tool use with JSON schema, not prompt-based formatting.',
      '"Retry fails to find missing info" → retries fix format, not absence. Know when retries are effective vs ineffective.',
      'tool_choice: { type: "tool", name: "..." } forces structured output. This is the exam-tested pattern.',
    ],
  },
  {
    id: '4-5',
    title: 'Metaprompt for Prompt Optimization',
    duration: '30 min',
    description: 'Use the metaprompt technique to let Claude optimize your prompts. Feed Claude a prompt and its output, ask Claude to analyze what went wrong, and generate an improved version. This is a prompt engineering best practice for iterative improvement.',
    knowledge: [
      'The metaprompt pattern: (1) Give Claude your current prompt, (2) Show Claude the output it produced, (3) Ask Claude to analyze what went wrong, (4) Ask Claude to write an improved prompt. Claude is surprisingly good at debugging its own instructions.',
      'Why metaprompting works: Claude can analyze its own failure modes from an outside perspective. When you show it "you produced X but the expected output was Y," Claude can identify the specific instruction that led to the error and suggest a fix.',
      'Iterative metaprompting: run the improved prompt, check the output, metaprompt again. Each iteration refines the prompt. 2-3 iterations typically produce a high-quality prompt that handles edge cases well.',
      'The prompt feedback format: "Current prompt: [your prompt]. Output produced: [actual output]. Expected output: [desired output]. Analyze the gap and suggest prompt improvements." This structured format helps Claude give targeted feedback.',
      'Metaprompting for consistency: if a prompt produces inconsistent results across runs, use metaprompting to add specificity. Claude will identify which parts of the prompt are ambiguous and suggest concrete replacements.',
      'Production use: the Anthropic recommendation is to use metaprompting during development to craft high-quality prompts, then deploy the optimized prompts in production. Don\'t metaprompt in production (it\'s expensive and slow).',
    ],
    skills: [
      'Apply the metaprompt pattern to debug prompts',
      'Structure metaprompt requests with current prompt + output + expected output',
      'Iterate 2-3 times for optimal results',
      'Use metaprompting during development, deploy optimized prompts in production',
    ],
    codeExample: `// Metaprompt Pattern — Let Claude Optimize Your Prompts

// Step 1: Start with a draft prompt
const draftPrompt = \`
Review this code and find bugs.
\`;

// Step 2: Run it and check the output
const output = await callClaude(draftPrompt, codeSample);
// Output: "I found 8 issues: [lists style opinions, naming suggestions,
//          architectural thoughts, and 1 actual bug]"
// Problem: 7 out of 8 "findings" are opinions, not bugs

// Step 3: Metaprompt — ask Claude to improve the prompt
const metaPrompt = \`
I need your help improving a prompt.

Current prompt:
"\${draftPrompt}"

Output it produced:
"\${output}"

What went wrong:
- 7 out of 8 findings were style opinions, not bugs
- Only 1 actual bug was found
- The prompt is too vague about what constitutes a "bug"

Please analyze why the prompt failed and write an improved version
that:
1. Defines "bug" specifically (crashes, wrong output, security holes)
2. Explicitly excludes style opinions and architectural preferences
3. Includes severity classification with concrete examples
\`;

const improvedPrompt = await callClaude(metaPrompt);
// Claude generates a much better prompt with explicit criteria,
// categories, and examples — exactly what we needed!

// Step 4: Test the improved prompt
const betterOutput = await callClaude(improvedPrompt, codeSample);
// Output: "Found 2 bugs: [security vulnerability in input validation,
//          null pointer dereference in error handler]"
// Much better: specific, actionable, no false positives.

// Step 5 (optional): One more metaprompt iteration
// If the improved prompt still has issues, repeat steps 2-4.
// Typically 2-3 iterations produces excellent results.`,
    antiPatterns: [
      {
        pattern: 'Metaprompting in production',
        problem: 'Metaprompting is slow and expensive. Use it during development to craft optimized prompts, then deploy the static optimized prompts.',
      },
    ],
    keyConcepts: [
      { concept: 'Metaprompt pattern', description: 'Show Claude its prompt + output + expected output. Ask it to analyze the gap and suggest improvements.' },
      { concept: 'Iterative refinement', description: '2-3 metaprompt iterations typically produce high-quality prompts that handle edge cases.' },
      { concept: 'Development-time tool', description: 'Metaprompting is for crafting prompts. The optimized prompts are what you deploy to production.' },
    ],
    resources: [
      { label: 'Prompt Engineering Overview', url: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview' },
    ],
    examTips: [
      '"How to improve a prompt that produces poor output" → metaprompting: show Claude the prompt + output + expected output, ask for improvements.',
      'Metaprompting is for development, not production. The exam tests this distinction.',
    ],
  },
  {
    id: '4-6',
    title: 'Context Engineering & Multi-Instance Review',
    duration: '45 min',
    description: 'Design systems with validation feedback loops, multi-pass review architectures, and independent reviewer instances. The key insight: independent review catches issues that self-review misses, and multi-pass analysis catches cross-cutting concerns that single-pass misses.',
    knowledge: [
      'Validation feedback loops: when Claude\'s output doesn\'t match expectations, feed the error back into the next attempt. "Your previous extraction had these errors: [specific errors]. Fix them." Claude corrects specific issues much better than generic retry.',
      'Retries are effective when the information IS in the input but the FORMAT was wrong. Retries are INEFFECTIVE when the information is simply NOT in the input. Distinguish these cases before retrying.',
      'Multi-instance review architecture: use SEPARATE Claude instances for generation and review. The generator produces code. The reviewer (independent instance with no generation context) reviews it. This avoids confirmation bias.',
      'Why separate instances matter: the generation instance "knows" what it intended and is more likely to approve its own work. The review instance starts fresh and catches issues the generator would miss. The exam tests this directly.',
      'Multi-pass review: Pass 1 = per-file local analysis (syntax, types, bugs). Pass 2 = cross-file integration analysis (imports, interfaces, data flow). Pass 3 = architectural review (patterns, security, performance). Each pass catches different issues.',
      'Confidence calibration: Claude\'s self-reported confidence is poorly calibrated. A finding rated 0.95 confidence might be wrong, and one rated 0.6 might be right. Use confidence as a routing signal (auto-fix high, human-review medium, investigate low), not as ground truth.',
      'Batch processing patterns: for large-scale tasks (reviewing 100 files), process in batches. Include a summary of prior batch findings in each new batch to maintain consistency. Without this, Claude treats each batch independently and may give contradictory guidance.',
      'The "review the reviewer" pattern: periodically sample review outputs and have a human check them. If the reviewer is producing systematic false positives or missing a category of issues, adjust the review prompt. Don\'t trust automated review blindly.',
    ],
    skills: [
      'Implement retry with specific error feedback',
      'Design multi-pass review architectures',
      'Use separate instances for generation and review',
      'Route findings by confidence level',
    ],
    codeExample: `// Multi-Instance Review Architecture

// Step 1: Generator Instance (produces code)
const generatorInstance = {
  model: "claude-sonnet-4-20250514",
  systemPrompt: \`You are a senior developer implementing features.
Write clean, well-tested code following the project's conventions.\`
};

const generatedCode = await execute(generatorInstance, {
  task: "Implement user authentication with JWT tokens"
});

// Step 2: Reviewer Instance (INDEPENDENT — no generation context)
const reviewerInstance = {
  model: "claude-sonnet-4-20250514",
  // Different system prompt, different perspective
  systemPrompt: \`You are a security-focused code reviewer.
Assume the code has bugs. Question every decision.
You have NO context about how this code was written.\`
};

const reviewFindings = await execute(reviewerInstance, {
  task: \`Review this authentication code for:
1. Security vulnerabilities (SQL injection, XSS, token leaks)
2. Error handling gaps
3. Edge cases (expired tokens, malformed input, concurrent requests)
Code: \${generatedCode}\`
});

// Why separate instances:
// Generator "knows" it handled the null case and won't flag it
// Reviewer sees the code fresh and notices the null check is wrong
// Independent review catches what self-review misses

// Multi-Pass Review Architecture
async function multiPassReview(files) {
  const allFindings = [];

  // Pass 1: Per-file LOCAL analysis
  console.log("Pass 1: Local analysis...");
  const localFindings = await Promise.all(
    files.map(file => execute(reviewerInstance, {
      task: \`Analyze \${file.path} for local issues:
      - Syntax errors
      - Type errors
      - Missing null checks
      - Unhandled exceptions\`,
      context: { fileContent: file.content }
    }))
  );
  allFindings.push(...localFindings.flat());

  // Pass 2: Cross-file INTEGRATION analysis
  console.log("Pass 2: Integration analysis...");
  const integrationFindings = await execute(reviewerInstance, {
    task: \`Analyze cross-file integration issues:
    - Missing imports / broken exports
    - Interface mismatches between modules
    - Circular dependencies
    - Data flow inconsistencies\`,
    context: {
      files: files.map(f => ({ path: f.path, exports: f.exports, imports: f.imports })),
      localFindings: allFindings
    }
  });
  allFindings.push(...integrationFindings);

  // Pass 3: Architectural review (optional, for critical code)
  console.log("Pass 3: Architectural review...");
  const archFindings = await execute(reviewerInstance, {
    task: \`Review architecture and security:
    - Authentication flow vulnerabilities
    - Authorization bypass possibilities
    - Data exposure risks
    - Performance bottleneck patterns\`,
    context: { files, priorFindings: allFindings }
  });

  return { findings: allFindings, passes: 3 };
}

// Confidence-based routing
function routeByConfidence(findings) {
  return {
    autoFix: findings.filter(f => f.confidence >= 0.9),
    humanReview: findings.filter(f => f.confidence >= 0.7 && f.confidence < 0.9),
    investigate: findings.filter(f => f.confidence < 0.7)
  };
}

// Validation feedback loop
async function extractWithRetry(document, maxAttempts = 3) {
  let attempt = 1;
  let prompt = \`Extract company data from this document: \${document}\`;

  while (attempt <= maxAttempts) {
    const result = await callClaude(prompt);
    const errors = validate(result);

    if (errors.length === 0) return result;

    // Feed SPECIFIC errors back — not generic "try again"
    prompt = \`Previous extraction had these specific errors:
\${errors.map(e => "- " + e).join("\\n")}

Original document: \${document}

Fix ONLY the errors listed above.\`;

    attempt++;
  }
}`,
    antiPatterns: [
      {
        pattern: 'Self-review in the same session',
        problem: '"Generate code, then review it" in one session creates confirmation bias. Claude approves its own work. Use separate instances.',
      },
      {
        pattern: 'Single-pass review for complex systems',
        problem: 'One pass catches local issues but misses cross-file integration problems. Use multi-pass: local → integration → architectural.',
      },
      {
        pattern: 'Trusting self-reported confidence blindly',
        problem: 'Claude\'s confidence scores are poorly calibrated. Use as routing signal, not ground truth. High confidence ≠ correct.',
      },
    ],
    keyConcepts: [
      { concept: 'Independent reviewer', description: 'Separate Claude instance for review. No generation context. Catches what self-review misses.' },
      { concept: 'Multi-pass review', description: 'Pass 1: local issues. Pass 2: cross-file integration. Pass 3: architecture/security. Each catches different issues.' },
      { concept: 'Validation feedback loop', description: 'Retry with SPECIFIC error feedback, not generic "try again." Effective for format errors, not missing info.' },
      { concept: 'Confidence routing', description: 'Auto-fix high confidence, human-review medium, investigate low. Don\'t trust scores as absolute truth.' },
    ],
    resources: [
      { label: 'Prompt Engineering Overview', url: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview' },
    ],
    examTips: [
      '"Same session generates and reviews" → confirmation bias. Use separate instances.',
      '"Retries don\'t find missing info" → retries fix FORMAT, not absence. Know when they\'re effective.',
      'Multi-pass: local → integration → architecture. The exam tests why multiple passes are needed.',
      'Confidence calibration is POOR. The exam tests that you know not to trust self-reported confidence.',
    ],
  },
  {
    id: '4-exam',
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
          <span className="text-sm text-slate-500">{completedLessons.size}/{lessons.length} lessons completed</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2">
          <div
            className="bg-orange-500 h-2 rounded-full transition-all"
            style={{ width: `${(completedLessons.size / lessons.length) * 100}%` }}
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