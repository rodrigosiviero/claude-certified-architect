import type { QuizQuestion } from '../types';

const domain5Quiz: QuizQuestion[] = [
  {
    question: 'After 20+ turns, your agent\'s context has 50K+ tokens and loses track of earlier messages. What is the solution?',
    options: [
      'Use a model with a larger context window',
      'Implement context window management: summarize old turns, prune stale tool results, use sliding window',
      'Reduce the number of tools available',
      'Split the conversation into multiple API calls',
    ],
    correctIndex: 1,
    explanation: 'Context window management includes summarizing older turns, pruning stale tool results, and implementing a sliding window. This keeps the most relevant context while staying within limits.',
    trap: 'Option A doesn\'t solve the underlying design issue. Option C is unrelated. Option D fragments the conversation. The exam tests context management strategies for long-running agents.',
  },
  {
    question: 'A user says "This is ridiculous, I want to speak to a manager!" but the agent keeps trying to help automatically. What is missing?',
    options: [
      'A more empathetic system prompt',
      'Escalation triggers — the agent should detect frustration signals and offer human handoff',
      'A satisfaction survey after each response',
      'Faster response times',
    ],
    correctIndex: 1,
    explanation: 'Agents need escalation triggers that detect frustration, repeated failures, or explicit requests for human help. When triggered, the agent should offer a smooth handoff to human support.',
    trap: 'Option A might help prevent frustration but doesn\'t handle the escalation moment. The exam tests escalation trigger implementation in production agents.',
  },
  {
    question: 'A tool returns customer data with raw email, phone, and SSN. This data enters Claude\'s context. What is the risk?',
    options: [
      'Claude might refuse to process the data',
      'PII leaks into the conversation context and potentially into Claude\'s responses to the user',
      'The API call will be rejected',
      'The tool will stop working',
    ],
    correctIndex: 1,
    explanation: 'PII in tool outputs enters the conversation context and can appear in Claude\'s responses. Tool outputs should be filtered/redacted for PII before being added to the message history.',
    trap: 'Option A is false — Claude processes PII normally. Option C is false — the API doesn\'t reject PII. The exam tests PII protection in tool output handling.',
  },
  {
    question: 'An agent loads 10,000 rows from a database in a single tool result. What design principle was violated?',
    options: [
      'Database queries should not be used with AI agents',
      'Efficient data handling — use pagination, LIMIT clauses, or aggregation instead of loading entire datasets',
      'The tool schema should prevent large results',
      'Use streaming for large datasets',
    ],
    correctIndex: 1,
    explanation: 'Loading massive datasets into context is inefficient and can exceed token limits. Use SQL LIMIT, pagination, or aggregate queries to return only relevant summaries.',
    trap: 'Option A is false — databases are common tool targets. Option C is reasonable but doesn\'t address the query pattern. The exam tests efficient data handling in agentic workflows.',
  },
  {
    question: 'Two sources report 65% and 38% for the same metric. The agent averages them to 51.5%. What is wrong?',
    options: [
      'Averaging is always wrong with AI',
      'The agent didn\'t analyze WHY the numbers differ — different methodologies (survey vs transaction data) explain the gap',
      'The agent should use the higher number',
      'The agent should use the more recent source',
    ],
    correctIndex: 1,
    explanation: 'Blind averaging hides methodology differences. The agent should compare methodologies, explain the discrepancy, identify which is more reliable, and provide a nuanced conclusion.',
    trap: 'Option C and D are arbitrary choices. Option A is too extreme. The exam tests provenance awareness and attribution — understanding source methodology matters more than the numbers.',
  },
];

export default domain5Quiz;
