import type { QuizQuestion } from '../types';

const domain4Quiz: QuizQuestion[] = [
  // 4.1 System Prompt Design
  {
    question: 'A system prompt for a code reviewer says "Review this code." Claude returns generic, unfocused feedback. What is the root cause?',
    options: [
      'Claude needs a higher temperature for code review',
      'The system prompt is too long and dilutes the instructions',
      'The prompt lacks explicit criteria — it should specify what to check (security, performance, readability) and how to prioritize findings',
      'System prompts do not work for code review tasks',
    ],
    correctIndex: 2,
    explanation: 'Effective system prompts include explicit criteria, priorities, and rules. "Review this code" gives no guidance on what constitutes a problem or how severe issues should be ranked.',
    trap: 'Option B misidentifies the issue — it\'s not about length but specificity. Option A is wrong because temperature controls randomness, not focus. The exam tests system prompt engineering with explicit evaluation criteria.',
  },
  {
    question: 'You write a system prompt with role, context, task, and output format. Claude still ignores the format instructions. What is the most likely fix?',
    options: [
      'Move the output format to the user message instead',
      'Add few-shot examples showing the exact expected output structure',
      'Remove the role description to simplify the prompt',
      'Use a higher temperature to increase format compliance',
    ],
    correctIndex: 1,
    explanation: 'Few-shot examples are the most effective way to enforce output format. They provide concrete demonstrations of the expected structure, which Claude follows more reliably than abstract instructions alone.',
    trap: 'Option A works against best practices — format belongs in the system prompt. Option C removes useful context. The exam tests combining system prompt structure with few-shot examples for reliable outputs.',
  },
  {
    question: 'A customer support agent\'s system prompt says "Be helpful." Users complain the agent gives medical advice. What should you add?',
    options: [
      'A longer prompt with more details about the company',
      'Explicit boundaries — "Only answer questions about product features, billing, and shipping. For medical, legal, or financial questions, say you cannot help and suggest contacting a professional."',
      'A temperature of 0 to prevent creative responses',
      'Instructions to always say "I\'m not a doctor" before every response',
    ],
    correctIndex: 1,
    explanation: 'System prompts need explicit boundaries and scope constraints. "Be helpful" is too vague and allows dangerous scope creep. Specific boundaries prevent the agent from operating outside its intended domain.',
    trap: 'Option A adds detail but not constraints. Option C doesn\'t prevent out-of-scope answers. Option D is a band-aid that doesn\'t solve the root problem. The exam tests designing system prompts with clear scope boundaries.',
  },

  // 4.2 Structured Output
  {
    question: 'You need Claude to always return a JSON object with fields "summary" (string) and "sentiment" (one of: positive, negative, neutral). Which approach is most reliable?',
    options: [
      'Ask Claude to "respond in JSON" and describe the format in plain English',
      'Use the tool_use feature with a JSON Schema that defines the required properties, types, and enum values',
      'Post-process the response to extract JSON with regex',
      'Use a system prompt that says "always return valid JSON"',
    ],
    correctIndex: 1,
    explanation: 'The tool_use feature with JSON Schema provides the strongest contract — Claude must conform to the schema, including field types and enum constraints. This is more reliable than natural language format instructions.',
    trap: 'Option A produces inconsistent results — "respond in JSON" without a schema leaves structure ambiguous. Option C is fragile and reactive. Option D is a soft instruction with no enforcement. The exam tests structured output via tool_use + JSON Schema.',
  },
  {
    question: 'Your JSON schema defines "age" as an integer with minimum 0, but Claude returns age: -5. What should you do?',
    options: [
      'Switch to a different model that follows schemas better',
      'Add Pydantic-style validation in your code — reject invalid outputs and retry with the validation error as feedback',
      'Remove the minimum constraint from the schema since Claude ignores it anyway',
      'Set temperature to 0 to prevent negative numbers',
    ],
    correctIndex: 1,
    explanation: 'Claude may occasionally violate schema constraints. The best practice is to validate outputs programmatically (e.g., Pydantic) and feed validation errors back as retry context. This creates a robust validation-retry-feedback loop.',
    trap: 'Option A is overreaction — schema violations are rare and fixable with retry loops. Option C weakens the contract. Option D doesn\'t address schema compliance. The exam tests validation and retry strategies for structured output.',
  },
  {
    question: 'You define a JSON schema with a field "category" that has an enum of 5 values. Sometimes Claude returns a 6th value not in the enum. What is the recommended fix?',
    options: [
      'Add the 6th value to the enum to accommodate Claude\'s behavior',
      'Use Pydantic validation to catch invalid enum values, then retry with the error message explaining which values are valid',
      'Remove the enum constraint and use a free-text string instead',
      'Increase the system prompt length to emphasize the allowed values',
    ],
    correctIndex: 1,
    explanation: 'When Claude produces values outside the schema enum, validate programmatically and retry with the specific error. This "validation → feedback → retry" loop is the recommended pattern for enforcing structured output contracts.',
    trap: 'Option A expands the schema incorrectly. Option C removes the constraint entirely. Option D is a soft approach that doesn\'t guarantee compliance. The exam tests the validation-retry-feedback pattern for structured outputs.',
  },

  // 4.3 Validation, Retry & Feedback Loops
  {
    question: 'An agentic workflow calls an API that returns a 429 rate limit error. The agent retries 5 times immediately. What is wrong?',
    options: [
      '429 errors mean the API is down permanently',
      'The agent should give up after any error',
      'The agent needs exponential backoff — wait with increasing delays between retries (e.g., 2s, 4s, 8s, 16s)',
      'The agent should switch to a different API endpoint',
    ],
    correctIndex: 2,
    explanation: 'Rate limit errors (429) require exponential backoff, not immediate retries. Retrying instantly compounds the problem. Backoff gives the API time to recover quota, and the increasing delay pattern is the industry-standard approach.',
    trap: 'Option A is false — 429 is temporary. Option B is overly conservative. Option D doesn\'t address rate limiting. The exam tests retry strategies with proper backoff for different error types.',
  },
  {
    question: 'A content generation pipeline produces outputs that sometimes miss required sections. What is the most effective validation strategy?',
    options: [
      'Add more examples to the system prompt',
      'Use Pydantic models to validate the output structure, and on failure, retry with the specific validation error included in the prompt',
      'Generate multiple outputs and pick the longest one',
      'Manually review every output before accepting it',
    ],
    correctIndex: 1,
    explanation: 'Pydantic validation + retry with error feedback is the gold standard. It catches structural issues programmatically and gives Claude specific feedback about what was wrong, so the retry can fix exactly the problem.',
    trap: 'Option A helps prevention but doesn\'t validate. Option C has no quality guarantee. Option D doesn\'t scale. The exam tests automated validation pipelines with feedback loops.',
  },

  // 4.4 Batch Processing
  {
    question: 'You need to process 500 documents through Claude for summarization. Each document is independent. What is the most efficient approach?',
    options: [
      'Process them sequentially one at a time to avoid rate limits',
      'Batch them — send groups of documents in parallel API calls, with retry logic for rate limits and validation for each response',
      'Combine all 500 documents into one massive prompt for a single API call',
      'Use a single streaming call that processes all documents',
    ],
    correctIndex: 1,
    explanation: 'Batch processing with parallel API calls maximizes throughput while respecting rate limits. Group documents, process in parallel, validate each response, and retry failures individually. This balances speed, cost, and reliability.',
    trap: 'Option A is correct but slow — no parallelism. Option C exceeds context limits and produces poor results. Option D is impractical for 500 independent documents. The exam tests batch processing strategies for scale.',
  },

  // 4.5 Multi-Instance & Multi-Pass Review
  {
    question: 'Claude generates a legal contract. You need to ensure it has no errors. What is the most thorough review strategy?',
    options: [
      'Ask Claude to review its own work in a follow-up message',
      'Use multiple independent Claude instances — one generates, another reviews for legal accuracy, another checks for consistency, and a final one resolves any conflicts found',
      'Run the contract through a grammar checker',
      'Use a single instance with a very long system prompt covering all review criteria',
    ],
    correctIndex: 1,
    explanation: 'Multi-instance review (generator → specialist reviewers → resolver) is the most thorough approach. Each instance focuses on one aspect, avoiding the blind spots that a single reviewer (or self-review) would have. The resolver synthesizes all feedback.',
    trap: 'Option A is self-review, which has known blind spots. Option C only catches grammar, not legal issues. Option D tries to do everything in one pass but loses depth. The exam tests multi-instance and multi-pass review architectures.',
  },
];

export default domain4Quiz;
