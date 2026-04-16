import type { QuizQuestion } from '../types';

const domain2Quiz: QuizQuestion[] = [
  {
    question: 'Your tool named "search" with description "Search for things" frequently causes Claude to pick the wrong tool. What is the root cause?',
    options: [
      'Claude doesn\'t support generic tool names',
      'The tool name and description are too vague — Claude can\'t distinguish it from other tools',
      'You need to add more parameters to the schema',
      'The tool needs to be registered differently in the API',
    ],
    correctIndex: 1,
    explanation: 'Effective tool interfaces require specific names and detailed descriptions. "search" could mean search_orders, search_products, or search_customers. Claude needs unambiguous names and rich descriptions to select correctly.',
    trap: 'Option A is vague — the issue isn\'t "generic" names per se, but ambiguous ones. Option C adds complexity without solving the core problem. The exam tests that you understand tool design principles.',
  },
  {
    question: 'A tool returns "Error: something went wrong" for every failure. Claude keeps retrying the same approach. What should you change?',
    options: [
      'Add retry logic with exponential backoff',
      'Return structured error responses with error type, details, and suggested recovery action',
      'Increase max_tokens so Claude can generate better error messages',
      'Wrap the tool call in a try-catch and suppress errors',
    ],
    correctIndex: 1,
    explanation: 'Structured error responses (with error type, HTTP status, human-readable message, and suggested fix) enable Claude to self-correct. A vague string error provides no actionable information.',
    trap: 'Option A (retry) is tempting but doesn\'t solve the root cause — Claude can\'t adapt its approach if it doesn\'t know WHAT went wrong. The exam tests structured error handling specifically.',
  },
  {
    question: 'You have 30 tools registered. Claude picks the wrong tool 40% of the time. What is the best solution?',
    options: [
      'Rename all tools with numbered prefixes',
      'Reduce to 5 tools maximum',
      'Dynamically load only relevant tools based on the current task context',
      'Add tool_choice: "auto" to every request',
    ],
    correctIndex: 2,
    explanation: 'Dynamic tool loading (also called tool filtering) exposes only the relevant subset of tools for each task. This dramatically improves tool selection accuracy.',
    trap: 'Option B is too extreme — you need more than 5 tools for complex systems. Option D is already the default and doesn\'t help with 30 tools. The exam tests understanding of tool distribution strategies.',
  },
  {
    question: 'Your .mcp.json contains hardcoded API keys and is committed to Git. What is the correct approach?',
    options: [
      'Add .mcp.json to .gitignore after the first commit',
      'Use environment variable references in .mcp.json and set values in your shell or CI environment',
      'Encrypt the API keys with a password',
      'Store the keys in a separate config.py file',
    ],
    correctIndex: 1,
    explanation: 'MCP configuration should reference environment variables (e.g., ${API_KEY}), with actual values set in the shell environment or CI secrets. This keeps credentials out of version control entirely.',
    trap: 'Option A doesn\'t remove the keys from git history. Option C adds unnecessary complexity. Option D still risks committing the file. The exam tests secure MCP configuration practices.',
  },
  {
    question: 'A user asks "Process my refund" but you set tool_choice to "none". What happens?',
    options: [
      'Claude processes the refund without using the tool',
      'Claude explains the refund process but cannot call the refund tool',
      'The API returns an error',
      'Claude ignores the tool_choice setting and calls the tool anyway',
    ],
    correctIndex: 1,
    explanation: 'tool_choice: "none" prevents Claude from calling ANY tools. It can only respond with text. For user requests that require tool actions, use "auto" or specify the exact tool with type: "tool".',
    trap: 'Option D is wrong — Claude strictly respects tool_choice. Option C is wrong — the API succeeds, but Claude simply can\'t use tools. The exam tests understanding of tool_choice configuration.',
  },
];

export default domain2Quiz;
