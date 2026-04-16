import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronRight, CheckCircle2, Circle, Code, BookOpen, FlaskConical, ArrowRight, AlertTriangle, Lightbulb, ExternalLink, Brain } from 'lucide-react';
import { useCourse } from '../context/CourseContext';
import DomainQuiz from '../components/DomainQuiz';
import MindMap from '../components/MindMap';
import { domain1MindMap } from '../data/mindMaps';
import domain1Quiz from '../data/quizzes/domain1';
import domain1QuickRef from '../data/quickRefs/domain1';
import QuickRef from '../components/QuickRef';
import { domain1Explanations } from '../data/lessons';
import LessonContent from '../components/LessonContent';
import NotesFab from '../components/NotesFab';

const lessons = [
  {
    id: '1-1',
    title: 'Agentic Loops',
    duration: '45 min',
    description: 'The agentic loop is the foundational pattern for all Claude agent systems. It is the infinite loop of request → inspect → tool call → result → iterate that powers Claude to autonomously solve complex multi-step tasks.',
    knowledge: [
      'What it is: Claude sends a request → Claude responds → if Claude wants tools, you execute them and loop → if Claude is done, you stop.',
      'stop_reason is THE critical field: "tool_use" means Claude wants to call more tools; "end_turn" means Claude has finished its response.',
      'When stop_reason is "tool_use": extract ALL tool_use blocks from response, execute each tool, append ALL results, then loop again.',
      'When stop_reason is "end_turn": the conversation is complete — no more tool calls needed.',
      'Model-driven decision making: Claude decides WHICH tools to call, not you. This is the fundamental shift from rule-based to AI-driven architecture.',
      'Maximum iteration count is a safety net (20-50), not primary termination. Primary = stop_reason.',
      'Context window management: all tool results accumulate in conversation. Long sessions may need summarization.',
      'Tool results are appended as tool_result messages with role: "user", matching each tool_use by its tool_use_id.',
    ],
    skills: [
      'Implement the complete agentic loop: request → inspect stop_reason → execute tools → append results → repeat',
      'Handle tool_use blocks: extract tool name + input, execute tool, format result as tool_result',
      'Use end_turn to detect completion — do NOT retry on this signal',
      'Append ALL tool results before next iteration — never selectively omit results',
    ],
    codeExample: `// ═══════════════════════════════════════════════════════════════
// THE COMPLETE AGENTIC LOOP — Full Working Implementation
// ═════════════════════════════════════════════════════════════════════════════

import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

// Define tools the agent can use
const tools = [
  {
    name: 'lookup_customer',
    description: 'Look up a customer by email or phone',
    input_schema: {
      type: 'object',
      properties: {
        email: { type: 'string', description: 'Customer email' },
        phone: { type: 'string', description: 'Customer phone' },
      },
    },
  },
  {
    name: 'lookup_order',
    description: 'Look up order details by order ID',
    input_schema: {
      type: 'object',
      properties: {
        order_id: { type: 'string', description: 'Order ID (ORD-XXXXX)' },
      },
      required: ['order_id'],
    },
  },
  {
    name: 'process_refund',
    description: 'Process a refund for an order',
    input_schema: {
      type: 'object',
      properties: {
        order_id: { type: 'string' },
        amount: { type: 'number' },
        reason: { type: 'string' },
      },
      required: ['order_id', 'amount'],
    },
  },
];

// Agentic loop implementation
async function runAgent(userMessage: string) {
  const messages: any[] = [
    { role: 'user', content: userMessage }
  ];
  const MAX_ITERATIONS = 20; // Safety net, NOT primary termination

  for (let i = 0; i < MAX_ITERATIONS; i++) {
    console.log(\`--- Iteration \${i + 1} ---\`);

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: 'You are a customer support agent.',
      tools,
      messages,
    });

    // ═══ THE CRITICAL PART: Check stop_reason ═══
    if (response.stop_reason === 'end_turn') {
      // Claude is done — return final text response
      const textBlock = response.content.find(b => b.type === 'text');
      console.log('Agent completed:', textBlock?.text);
      return textBlock?.text;
    }

    // stop_reason === 'tool_use' — Claude wants to call tools
    // Append Claude's response to conversation
    messages.push({ role: 'assistant', content: response.content });

    // Execute ALL tool_use blocks and append results
    const toolUseBlocks = response.content.filter(
      b => b.type === 'tool_use'
    );

    const toolResults = [];
    for (const block of toolUseBlocks) {
      console.log(\`Executing tool: \${block.name}\`, block.input);
      const result = await executeTool(block.name, block.input);
      toolResults.push({
        type: 'tool_result',
        tool_use_id: block.id,  // MUST match the tool_use block ID
        content: JSON.stringify(result),
      });
    }

    // Append ALL results as a single user message
    messages.push({ role: 'user', content: toolResults });
  }

  console.log('Safety net reached — max iterations exceeded');
}

// Example execution
await runAgent(
  'I ordered a laptop last week but it arrived damaged. ' +
  'My email is john@example.com. Order ORD-12345. I want a refund.'
);

// Console output:
// --- Iteration 1 ---
// Executing tool: lookup_customer { email: 'john@example.com' }
// --- Iteration 2 ---
// Executing tool: lookup_order { order_id: 'ORD-12345' }
// --- Iteration 3 ---
// Executing tool: process_refund { order_id: 'ORD-12345', amount: 1299.99 }
// --- Iteration 4 ---
// Agent completed: I've found your order and processed a refund...`,
    antiPatterns: [
      {
        pattern: 'Parsing natural language for termination',
        problem: 'Instead of checking stop_reason, some implementations try to detect "done" or "complete" in Claude\'s text. This is fragile — Claude might say "I think we\'re done" but still have stop_reason="tool_use" because it wants to call one more tool. Always use stop_reason.',
      },
      {
        pattern: 'Only appending "relevant" tool results',
        problem: 'If Claude calls 3 tools and you only append 2 results (thinking the 3rd "isn\'t important"), the next iteration will fail with a mismatch. Claude sees tool_use IDs with no matching tool_result. ALWAYS append all results.',
      },
      {
        pattern: 'Using iteration count as primary termination',
        problem: 'Setting maxIterations=5 and stopping there regardless of stop_reason. For complex tasks, Claude may legitimately need 8+ iterations. Use iteration count as a safety net only (set to 20-50), with stop_reason as primary.',
      },
    ],
    keyConcepts: [
      { concept: 'stop_reason', description: 'THE termination signal. "tool_use" =loop again, "end_turn"=done. No other signal is reliable.' },
      { concept: 'tool_result', description: 'Must include tool_use_id matching the tool_use block. Append ALL results.' },
      { concept: 'Safety Net', description: 'Max iterations (20-50) prevents infinite loops. Not primary termination.' },
      { concept: 'Model-Driven', description: 'Claude decides which tools to call. No pre-configured routing needed.' },
    ],
    resources: [
      { label: 'Tool Use Documentation', url: 'https://docs.anthropic.com/en/docs/build-with-claude/tool-use' },
      { label: 'Agentic Patterns Guide', url: 'https://docs.anthropic.com/en/docs/build-with-claude/agentic-patterns' },
      { label: 'Messages API Reference', url: 'https://docs.anthropic.com/en/api/messages' },
    ],
    examTips: [
      'stop_reason is the ONLY reliable termination signal — not text parsing, not iteration count',
      'Append ALL tool results — never selectively omit results',
      'Iteration count =20-50 is safety net, stop_reason=primary.',
      'Tool results need tool_use_id matching the original tool_use block',
    ],
  },
  {
    id: '1-2',
    title: 'Multi-Agent Orchestration Patterns',
    duration: '45 min',
    description: 'Design multi-agent systems using hub-and-spoke, handoff chains, and parallel fan-out patterns. The coordinator dynamically selects which subagents to invoke based on the query.',
    knowledge: [
      'Hub-and-spoke: central coordinator routes requests to specialist subagents. Coordinator reads query → decides which subagent(s) to invoke.',
      'Handoff chain: Agent A completes work → passes structured context to Agent B → Agent B continues. Good for ordered pipelines.',
      'Parallel fan-out: Coordinator invokes multiple subagents simultaneously. Good for independent research tasks that feed into a synthesis step.',
      'Coordinator does NOT do domain work itself — it only delegates and synthesizes.',
      'Dynamic selection: Claude (as coordinator) decides which subagents to invoke based on the query content. No pre-configured keyword routing.',
      'Subagents have ISOLATED context — they don\'t see each other\'s conversations. Only what the coordinator explicitly passes.',
      'Anti-pattern: keyword-based routing to subagents (e.g., "if query contains \'refund\' → route to refund_agent"). Claude handles this dynamically.',
    ],
    skills: [
      'Design coordinator prompts that clearly define available subagents and when to use each',
      'Choose between hub-and-spoke, handoff chain, and parallel fan-out based on task structure',
      'Pass structured context between agents — not raw conversation history',
    ],
    codeExample: `// ═══════════════════════════════════════════════════════════════
// PATTERN 1: HUB-AND-SPOKE (most common)
// ═════════════════════════════════════════════════════════════════════════════
// Coordinator agent system prompt:
const coordinatorPrompt = \\\\
You are a customer service coordinator.
You have access to these specialist agents via the Task tool:

1. billing_agent: Handles refunds, payment issues, billing questions
2. technical_agent: Handles bug reports, feature requests. technical troubleshooting
3. account_agent: Handles password resets. profile changes. subscription management

Analyze the user's request and delegate to the appropriate specialist.
If multiple issues are delegate to the first relevant specialist,
then pass context to the next if needed.
You never answer directly — always delegate.\`;

// What happens at runtime:
// User: "I was charged twice for order ORD-123 and I can't log into my account"
// Coordinator → invokes billing_agent (double charge issue)
// billing_agent returns findings
// Coordinator →invokes account_agent (login issue)
// Synthesizes final response

// ═════════════════════════════════════════════════════════════════════════════
// PATTERN 2: HANDOFF CHAIN
// ═════════════════════════════════════════════════════════════════════════════
// Agent A completes → passes structured context to Agent B
// Good for ordered pipelines where each step depends on the previous

const researchResult = await invokeAgent('research_agent', {
  task: 'Research competitors to Product X',
  outputFormat: 'structured findings with URLs, features, pricing',
});

// Handoff: structured context passed to next agent
const analysisResult = await invokeAgent('analysis_agent', {
  task: 'Analyze competitive landscape based on research findings',
  context: researchResult,structuredOutput,  // Explicit context
  outputFormat: 'SWOT analysis with recommendations',
});

// ═════════════════════════════════════════════════════════════════════════════
// PATTERN 3: PARALLEL FAN-OUT
// ═════════════════════════════════════════════════════════════════════════════
// Multiple independent subagents invoked simultaneously
const [research, competitors, trends] = await Promise.all([
  invokeAgent('research_agent', { task: 'Search for latest AI frameworks' }),
  invokeAgent('research_agent', { task: 'Find top 5 competitors in AI space' }),
  invokeAgent('research_agent', { task: 'Analyze AI trends for 2025' }),
]);

// All results feed into synthesis
const synthesis = await invokeAgent('synthesis_agent', {
  task: 'Combine research findings into strategic recommendation',
  context: { research, competitors, trends },
});`,
    antiPatterns: [
      {
        pattern: 'Keyword-based subagent routing',
        problem: 'if query.contains("refund") → route to refund_agent" is fragile. What if the user says "my money back" or "credit reversal"? Claude handles dynamic routing —let it decide based on semantics, Pre-configured rules are an anti-pattern the exam specifically tests this.',
      },
      {
        pattern: 'Sharing full conversation history between subagents',
        problem: 'Subagents should receive only the specific context they need, not the entire conversation. Passing full history wastes tokens and may leak information between contexts.',
      },
      {
        pattern: 'Coordinator doing domain work',
        problem: 'The coordinator should ONLY delegate and synthesize. If the coordinator starts answering billing questions directly, it defeats the purpose of specialist agents.',
      },
    ],
    keyConcepts: [
      { concept: 'Hub-and-Spoke', description: 'Central coordinator delegates to specialists. Most common pattern.' },
      { concept: 'Handoff Chain', description: 'Sequential A→B→C pipeline. Good for ordered dependencies.' },
      { concept: 'Parallel Fan-out', description: 'Simultaneous independent tasks. Good for speed.' },
      { concept: 'Context Isolation', description: 'Subagents only see what coordinator explicitly passes.' },
    ],
    resources: [
      { label: 'Multi-Agent Patterns', url: 'https://docs.anthropic.com/en/docs/build-with-claude/agentic-patterns#multi-agent-systems' },
      { label: 'Subagent Best Practices', url: 'https://docs.anthropic.com/en/docs/build-with-claude/agentic-patterns#subagent-patterns' },
    ],
    examTips: [
      'Dynamic routing > keyword routing. Claude decides which subagent to invoke.',
      'Context isolation: subagents only see explicitly passed context.',
      'Coordinator only delegates — never does domain work itself.',
    ],
  },
  {
    id: '1-3',
    title: 'Subagent Invocation & Context Isolation',
    duration: '40 min',
    description: 'Understand the Task tool for context isolation, and how to properly pass information between agents. Getting this wrong causes broken agent communication and wasted tokens.',
    knowledge: [
      'The "Task" tool is how Claude invokes subagents. It MUST be in allowedTools for subagent invocation to work.',
      'allowedTools must include "Task" — forgetting this is the #1 reason subagents fail silently.',
      'Subagents start with a BLANK slate —no conversation history from the parent. Only what you explicitly pass in the Task tool input.',
      'Goal-oriented prompts: tell the subagent exactly what to produce, Include outputFormat in the task description.',
      'Result attribution: when a subagent returns results, the coordinator should track which subagent produced which findings.',
      'Context trimming: for large contexts, pass summaries rather than full conversation history. Subagent context windows are limited.',
      'Never assume subagents share context — they don\'t. Each invocation is a fresh start.',
    ],
    skills: [
      'Invoke subagents via Task tool with explicit task, context, and expected outputFormat',
      'Structure subagent prompts with clear task boundaries and success criteria',
      'Track result attribution across subagent invocations',
    ],
    codeExample: `// ═══════════════════════════════════════════════════════════════
// HOW TO INVOKE A SUBAGENT VIA THE TASK TOOL
// ═════════════════════════════════════════════════════════════════════════════

// Step 1: Define the Task tool in coordinator's allowedTools
const coordinatorTools = [
  {
    name: 'Task',
    description: \`Delegate a subtask to a specialized subagent.
    The subagent operates with isolated context —pass all
    necessary information explicitly.\`,
    input_schema: {
      type: 'object',
      properties: {
        task: {
          type: 'string',
          description: 'The specific subtask to delegate',
        },
        context: {
          type: 'string',
          description: 'All relevant context for the subtask',
        },
        outputFormat: {
          type: 'string',
          description: 'Expected output format',
        },
      },
      required: ['task'],
    },
  },
  // ← "Task" MUST be here. Without it, subagent calls fail.

    lookup_customer,
  lookup_order,
  process_refund,
];

// Step 2: Coordinator invokes subagent
const response = await client.messages.create({
  model: 'claude-sonnet-4-20250514',
  system: coordinatorPrompt,
  tools: coordinatorTools,
  messages: [{
    role: 'user',
    content: 'Customer john@example.com wants a refund for order ORD-456. Amount was $1299. They said the item arrived damaged.',
  }],
});

// Claude responds with a tool_use for Task:
// {
//   type: 'tool_use',
//   name: 'Task',
//   input: {
//     task: 'Look up customer john@example.com and verify their order ORD-456. Check refund eligibility and process a refund for $129 if eligible.',
//     context: 'Customer email: john@example.com, Order ID: ORD-456. Requested refund amount: $129. Reason: item arrived damaged.',
//     outputFormat: 'JSON with { customer_found: bool, order_status: string, refund_eligible: bool, refund_amount: number, refund_processed: bool }'
//   }
// }

// Step 3: Your code executes the Task
 executing the subagent
// The subagent runs with ONLY the context passed above
// It has NO access to the parent conversation.

// Step 4: Subagent result returns to coordinator
// {
//   type: 'tool_result',
//   tool_use_id: 'toolu_xxx',
//   content: JSON.stringify({
//     customer_found: true,
//     order_status: 'delivered',
//     refund_eligible: true,
//     refund_amount: 129.00,
//     refund_processed: true,
//   })
// }

// COMMON MISTAKE: Forimportant context not explicitly passed in Task input,
// Subagent won't know customer email or order ID or amount.
// It starts BLIND.`,
    antiPatterns: [
      {
        pattern: 'Forimportant context not explicitly passed to subagent',
        problem: 'If you pass task: "Process a refund" but omit the order ID, amount. and reason. the subagent has to ask for clarification or guess. Pass EVERYTHING the subagent needs in the context parameter.',
      },
      {
        pattern: 'Assuming subagents see parent conversation',
        problem: 'Each Task invocation starts FRESH. The subagent has zero memory of previous turns in the parent conversation. This is by design — context isolation prevents information leakage.',
      },
      {
        pattern: 'Missing "Task" in allowedTools',
        problem: 'If allowedTools: [lookup_customer, lookup_order] (no "Task"). the subagent call fails silently. The coordinator tries to use Task but it\'s not in the allowed list. This is the #1 subagent bug.',
      },
    ],
    keyConcepts: [
      { concept: '"Task" Tool', description: 'Required in allowedTools. Without it. subagent invocation fails.' },
      { concept: 'Blank Slate', description: 'Each subagent invocation starts fresh—no parent history.' },
      { concept: 'Explicit Context', description: 'Pass EVERYTHING the subagent needs. It has no other source of information.' },
      { concept: 'outputFormat', description: 'Tell subagent exactly what format to produce. Reduces ambiguity.' },
    ],
    resources: [
      { label: 'Tool Use Overview', url: 'https://docs.anthropic.com/en/docs/build-with-claude/tool-use' },
      { label: 'Agentic Patterns', url: 'https://docs.anthropic.com/en/docs/build-with-claude/agentic-patterns' },
    ],
    examTips: [
      '"Task" MUST be in allowedTools — this is tested directly on the exam',
      'Subagents start blank — pass ALL needed context explicitly',
      'Include outputFormat in task descriptions for structured results',
    ],
  },
  {
    id: '1-4',
    title: 'Workflow Enforcement & Structured Handoffs',
    duration: '40 min',
    description: 'Use programmatic prerequisites and structured handoff packages to enforce workflow reliability. When prompts say "always verify first" but Claude skips it 5% of the time, hooks and state machines are the answer.',
    knowledge: [
      'The problem with prompt-only enforcement: "Always call get_customer before process_refund" works ~95% of the time. For financial systems, 95% is not enough —every missed verification risks a wrong refund.',
      'Programmatic prerequisites: code-level checks that BLOCK a tool call until prerequisites are met. E.g., block process_refund until get_customer has returned a verified customer ID.',
      'Structured handoff packages: when passing work to humans or other agents, include: what was tried. what worked. what failed. confidence level. caveats. recommended next steps.',
      'State machines for workflow enforcement: define valid states and transitions. E.g., IDLE → CUSTOMER_VERIFIED → ORDER_FOUND → REFUND_CHECKED → REFUND_PROCESSED.',
      'Deterministic enforcement (hooks/state machines) vs probabilistic enforcement (prompts): use hooks for "must never fail" rules; prompts for "nice to have" guidance.',
      'Anti-pattern: relying on system prompt for critical business rules. Use code-level enforcement instead.',
    ],
    skills: [
      'Implement programmatic prerequisites that block tool calls until conditions are met',
      'Design structured handoff packages with findings. confidence. caveats. next steps',
      'Build state machines for multi-step workflows with valid state transitions',
    ],
    codeExample: `// ═══════════════════════════════════════════════════════════════
// PROBLEM: Claude skips get_customer 5% of the time in production
// ═════════════════════════════════════════════════════════════════════════════

// ❌ Prompt-only enforcement (works 95% of the time):
const systemPrompt = \\\\
You are a refund agent. ALWAYS call get_customer to verify the customer
identity before calling process_refund. This is MANDATORY.\`;
// Claude follows this ~95% of the time. That 5% failure rate
// means thousands of unverified refunds in production.

// ✅ Programmatic enforcement (works 100% of the time):
// PostToolUse hook that tracks state
const state = { verified: false, customerId: null };

async function postToolUseHook(toolName, toolInput, toolResult) {
  if (toolName === 'get_customer' && toolResult.status === 'success') {
    state.verified = true;
    state.customerId = toolResult.customer.id;
  }
  return toolResult; // Pass through normally
}

// PreToolUse hook that BLOCKS process_refund until verified
async function preToolUseHook(toolName, toolInput) {
  if (toolName === 'process_refund') {
    if (!state.verified) {
      // BLOCK the call and redirect Claude
      return {
        decision: 'block',
        reason: 'Customer not verified. Call get_customer first.',
        redirect: 'get_customer',
      };
    }
    // Additional rule: refunds > $500 need human approval
    if (toolInput.amount > 500) {
      return {
        decision: 'redirect',
        redirect: 'escalate_to_human',
        reason: 'Refunds over $500 require human approval',
        partialResult: {
          status: 'pending_approval',
          amount: toolInput.amount,
          awaiting: 'human_review',
        },
      };
    }
  }
  return { decision: 'allow' };
}

// ═════════════════════════════════════════════════════════════════════════════
// STRUCTURED HANDOFF PACKAGE (for human or next agent)
// ═════════════════════════════════════════════════════════════════════════════
const handoff = {
  sourceAgent: 'refund_agent',
  timestamp: new Date().toISOString(),
  findings: {
    customerVerified: true,
    customerId: 'CUST-789',
    orderStatus: 'delivered',
    refundEligible: true,
    damageConfirmed: true,
  },
  confidence: 0.92,
  caveats: [
    'Damage photos not yet uploaded by customer',
    'Policy document version 2.3 applied — verify no updates',
  ],
  recommendedNextSteps: [
    'Wait for damage photo upload (24h window)',
    'If photos confirm damage → approve refund',
    'If photos are missing → send reminder email',
  ],
};

// ═════════════════════════════════════════════════════════════════════════════
// STATE MACHINE (valid transitions only)
// ═════════════════════════════════════════════════════════════════════════════
const VALID_TRANSITIONS = {
  idle:              ['customer_verified'],
  customer_verified: ['order_found', 'escalate'],
  order_found:       ['refund_checked'],
  refund_checked:    ['refund_processed', 'escalate'],
  refund_processed:  [],  // Terminal state
};
// Any transition not in this map is BLOCKED`,
    antiPatterns: [
      {
        pattern: 'Relying on system prompts for critical rules',
        problem: '"ALWAYS verify before refund" in a prompt achieves ~95% compliance. For financial systems. the 5% failure rate means real money lost. Use hooks/state machines for deterministic enforcement.',
      },
      {
        pattern: 'Handing off with just "here are the results"',
        problem: 'Without structured context (findings. confidence. caveats). the receiving agent or human doesn\'t know what\'s reliable and what needs verification. Structured handoffs prevent miscommunication.',
      },
    ],
    keyConcepts: [
      { concept: 'Programmatic Prerequisite', description: 'Code-level check that BLOCKS a tool call until condition is met. 100% reliable.' },
      { concept: 'Structured Handoff', description: 'Package: source + findings + confidence + caveats + next steps.' },
      { concept: 'State Machine', description: 'Defines valid transitions. Invalid transitions are blocked.' },
      { concept: 'Hooks vs Prompts', description: 'Hooks=100% enforcement. Prompts=~95% guidance. Use hooks for "must never break."' },
    ],
    resources: [
      { label: 'SDK Hooks Documentation', url: 'https://docs.anthropic.com/en/docs/build-with-claude/tool-use#hooks' },
      { label: 'Agentic Patterns', url: 'https://docs.anthropic.com/en/docs/build-with-claude/agentic-patterns' },
    ],
    examTips: [
      'Programmatic enforcement > prompt instructions for critical workflows',
      'Structured handoffs include: findings. confidence. caveats. recommended next steps',
      'State machines define valid transitions — invalid ones are blocked',
      'The 95% vs 100% distinction is a key exam concept',
    ],
  },
  {
    id: '1-5',
    title: 'SDK Hooks: PreToolUse & PostToolUse',
    duration: '40 min',
    description: 'Hooks are your deterministic enforcement layer. PreToolUse runs before tool execution (gate/block/modify). PostToolUse runs after execution (transform/filter/validate). Together they give you 100% control over tool behavior.',
    knowledge: [
      'PreToolUse hook: fires BEFORE a tool executes. Can BLOCK the call. REDIRECT to a different tool. or MODIFY the input parameters.',
      'PostToolUse hook: fires AFTER a tool executes. Can TRANSFORM the result. FILTER sensitive data. or VALIDATE the output format.',
      'Hooks run on EVERY tool call — no exceptions. This is what makes them deterministic vs probabilistic prompt instructions.',
      'Use PreToolUse for: blocking dangerous operations. rate limiting. input validation. routing decisions.',
      'Use PostToolUse for: PII masking in results. output normalization. format validation. logging/audit.',
      'Combine hooks with prompts: prompts guide Claude\'s behavior. hooks enforce the boundaries. This is the recommended pattern.',
      'Anti-pattern: using hooks for everything. Hooks add complexity. Use them only for rules that MUST never be broken.',
    ],
    skills: [
      'Implement PreToolUse hooks to block. redirect. or modify tool calls',
      'Implement PostToolUse hooks to transform or filter tool results',
      'Choose between prompt-based and hook-based enforcement based on criticality',
    ],
    codeExample: `// ═══════════════════════════════════════════════════════════════
// PreToolUse Hook: Gate dangerous SQL operations
// ═════════════════════════════════════════════════════════════════════════════
async function preToolUseSafetyGuard(toolName, toolInput) {
  if (toolName === 'execute_sql') {
    const dangerousKeywords = ['DROP', 'DELETE', 'TRUNCATE', 'ALTER'];
    const sql = toolInput.query.toUpperCase();

    for (const keyword of dangerousKeywords) {
      if (sql.includes(keyword)) {
        // BLOCK the call entirely
        return {
          decision: 'block',
          reason: \`Forbidden SQL operation: \${keyword}. This could cause data loss.\`,
          suggestion: 'Use read-only queries or escalate to DBA.',
        };
      }
    }
  }
  return { decision: 'allow' }; // Let safe queries through
}

// ═════════════════════════════════════════════════════════════════════════════
// PreToolUse Hook: Rate limiting
// ═════════════════════════════════════════════════════════════════════════════
const callCounts = {};
async function preToolUseRateLimit(toolName) {
  const key = \`\${toolName}_\${Math.floor(Date.now() / 60000)}\`; // per minute
  callCounts[key] = (callCounts[key] || 0) + 1;

  if (callCounts[key] > 10) {
    return {
      decision: 'block',
      reason: \`Rate limit exceeded for \${toolName}. Try again in 1 minute.\`,
    };
  }
  return { decision: 'allow' };
}

// ═════════════════════════════════════════════════════════════════════════════
// PostToolUse Hook: Mask PII in tool results
// ═════════════════════════════════════════════════════════════════════════════
async function postToolUsePIIFilter(toolName, toolInput, toolResult) {
  if (toolName === 'get_customer' || toolName === 'get_employee') {
    let masked = JSON.stringify(toolResult);

    // Mask SSN: XXX-XX-1234 → XXX-XX-****
    masked = masked.replace(/\\d{3}-\\d{2}-\\d{4}/g. 'XXX-XX-****');

    // Mask credit card: 4111...1234 → ****...****
    masked = masked.replace(/\\d{4}[ \\d]{4}\\d{4}\\d{4}/g. '****-****-****-****');

    // Mask email in some contexts
    masked = masked.replace(
      /[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,}/g. '[EMAIL REDACTED]'
    );

    return JSON.parse(masked);
  }
  return toolResult;
}
// This hook prevents PII from ever entering Claude's context window`,
    antiPatterns: [
      {
        pattern: 'Using PostToolUse to block tool calls',
        problem: 'PostToolUse fires AFTER the tool has already executed. If you want to PREVENT execution. use PreToolUse. By the time PostToolUse runs. the database query has already been sent.',
      },
      {
        pattern: 'Over-using hooks for simple guidance',
        problem: 'Not every rule needs a hook. "Prefer short answers" → prompt. "Block refunds without verification" → hook. Hooks add complexity. Reserve for deterministic requirements.',
      },
    ],
    keyConcepts: [
      { concept: 'PreToolUse', description: 'Runs BEFORE execution. Can block. redirect. or modify.' },
      { concept: 'PostToolUse', description: 'Runs AFTER execution. Can transform or filter results.' },
      { concept: 'Deterministic', description: 'Runs on EVERY call. No exceptions. 100% enforcement.' },
      { concept: 'Prompts + Hooks', description: 'Prompts guide behavior. Hooks enforce boundaries. Use both.' },
    ],
    resources: [
      { label: 'SDK Hooks', url: 'https://docs.anthropic.com/en/docs/build-with-claude/tool-use#hooks' },
      { label: 'Tool Use Overview', url: 'https://docs.anthropic.com/en/docs/build-with-claude/tool-use' },
    ],
    examTips: [
      'Pre=gating/blocking (before execution). Post=filtering (after execution). Know the difference.',
      'Hooks are deterministic (100%). Prompts are probabilistic (~95%).',
      'Combine both: prompts for guidance. hooks for enforcement.',
    ],
  },
  {
    id: '1-6',
    title: 'Task Decomposition Strategies',
    duration: '35 min',
    description: 'Choose the right decomposition strategy for each task. Prompt chaining for predictable pipelines. dynamic adaptive for open-ended exploration. per-file passes for code refactors.',
    knowledge: [
      'Prompt chaining: sequential steps where each output feeds the next. Best for pipelines with clear input/output boundaries (research → analyze → draft → review).',
      'Dynamic adaptive: Claude explores the plans. and adjusts based on findings. Best for open-ended tasks where the path is unclear ("improve the architecture").',
      'Per-file passes: complete one file at a time. verify. then move to next. Best for predictable refactors across multiple files.',
      'Cross-file passes: after per-file passes. do a cross-file consistency check to Catch import errors. mismatched types.',
      'Choosing wrong strategy is prompt chaining for open-ended tasks leads to rigid output. Dynamic adaptive for predictable tasks leads to wasted exploration turns.',
      'Decomposition granularity: too fine (one function per call) = coordination overhead. Too coarse (everything in one call) = losing agentic benefits.',
    ],
    skills: [
      'Select decomposition strategy based on task type',
      'Implement per-file passes with verification between files',
      'Add cross-file consistency checks after per-file workpass',
    ],
    codeExample: `// ═══════════════════════════════════════════════════════════════
// STRATEGY 1: PROMPT CHAINING (sequential pipeline)
// ═════════════════════════════════════════════════════════════════════════════
// Best for: tasks with clear steps and known boundaries

// Step 1: Research
const research = await claude(\`Find the top 5 competitors to Product X.
  Return: company name. key feature. pricing. market share.\`);

// Step 2: Analyze (uses Step 1 output)
const analysis = await claude(\`Analyze competitive positioning based on:
\${research}
Return: SWOT analysis. threats. opportunities.\`);

// Step 3: Recommend (uses Step 2 output)
const recommendation = await claude(\`Based on this analysis:
\${analysis}
Recommend: enter/exit/expand decision with timeline.\`);

// ═════════════════════════════════════════════════════════════════════════════
// STRATEGY 2: DYNAMIC ADAPTIVE (exploration + adjustment)
// ═════════════════════════════════════════════════════════════════════════════
// Best for: open-ended tasks where path is unclear

// Claude explores the identifies issues. adjusts plan dynamically
// "Explore the codebase and identify architectural improvements"
// → Claude reads files. finds coupling issues. proposes a plan
// → Plan changes as Claude discovers more context

// ═════════════════════════════════════════════════════════════════════════════
// STRATEGY 3: PER-FILE PASSES (predictable refactors)
// ═════════════════════════════════════════════════════════════════════════════
// Best for: well-defined changes across multiple files

// Pass 1: Refactor UserService.ts
await claude(\`Refactor UserService.ts: extract validateEmail(). formatPhoneNumber(). and calculateDiscount() into separate utility functions. Keep same public API.\`);
// VERIFY: run tests for UserService.ts

// Pass 2: Refactor OrderService.ts
await claude(\`Refactor OrderService.ts: use the new utility functions from UserService.ts.\`);
// VERIFY: run tests for OrderService.ts

// Pass 3: Cross-file consistency check
await claude(\`Check all imports across UserService.ts and OrderService.ts. Verify no broken references.\`);
// VERIFY: run full test suite`,
    antiPatterns: [
      {
        pattern: 'One-shot for complex multi-file tasks',
        problem: '"Refactor the entire codebase" in one prompt. Claude tries to do everything at once and misses dependencies between files. Per-file passes catch these.',
      },
      {
        pattern: 'Prompt chaining for open-ended tasks',
        problem: 'If you don\'t know the steps in advance. prompt chaining creates a rigid pipeline that can\'t adapt. Dynamic adaptive lets Claude explore and adjust.',
      },
    ],
    keyConcepts: [
      { concept: 'Prompt Chaining', description: 'Sequential A→B→C. Best for clear pipelines.' },
      { concept: 'Dynamic Adaptive', description: 'Explore + adjust. Best for open-ended tasks.' },
      { concept: 'Per-file Passes', description: 'One file at a time with verification. Best for refactors.' },
      { concept: 'Cross-file Check', description: 'After per-file. verify consistency across files.' },
    ],
    resources: [
      { label: 'Prompt Chaining', url: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering#prompt-chaining' },
      { label: 'Agentic Patterns', url: 'https://docs.anthropic.com/en/docs/build-with-claude/agentic-patterns' },
    ],
    examTips: [
      'Per-file passes for predictable refactors; dynamic adaptive for open-ended tasks',
      'Always add cross-file consistency check after per-file..pass',
      'Prompt chaining =sequential pipeline. not for exploration.',
    ],
  },
  {
    id: '1-7',
    title: 'Session State, Persistence & Resumption',
    duration: '35 min',
    description: 'Manage conversation state across long sessions. Understand when to resume. when to start fresh. and how to pin critical data that must never be summarized away.',
    knowledge: [
      'Session resumption (--resume): continues an existing conversation. All context is preserved. Use when the session is still valid (no external changes. <24 hours old).',
      'Fresh session + summary injection: start new. inject a summary of previous work. Use when context is stale (tool results outdated. external files changed. session >24 hours).',
      'Session forking: create a branch from a specific message index. Useful for exploring alternatives without losing the original conversation.',
      'Progressive summarization: as conversations grow. older turns are compressed. Summarized tool results become unreliable — numbers change. details get lost.',
      'Immutable case facts: pin critical data (customer IDs. order amounts. refund status) in a block that is NEVER summarized. This is essential for long sessions.',
      'When to use --resume vs fresh: --resume if context still valid and no external changes. Fresh + summary if stale or files changed since last session.',
      'Session forking for parallel exploration: explore multiple approaches from the same conversation point. Each fork is independent.',
    ],
    skills: [
      'Use --resume for valid session continuation',
      'Inject structured summaries into fresh sessions for stale contexts',
      'Pin critical data in immutable blocks that survive summarization',
      'Fork sessions to explore alternatives',
    ],
    codeExample: `// ═══════════════════════════════════════════════════════════════
// SESSION RESUMPTION (context still valid)
// ═════════════════════════════════════════════════════════════════════════════
// CLI: continue where you left off
// $ claude --resume sess_abc123
// All conversation history is preserved. Claude remembers everything.

// ═════════════════════════════════════════════════════════════════════════════
// FRESH SESSION + SUMMARY INJECTION (context is stale)
// ═════════════════════════════════════════════════════════════════════════════
// When: tool results are outdated. external files changed. or >24 hours passed

// Build a structured summary of previous work
const summary = \\\\
Previous session findings:
- Customer CUST-789 verified. email: john@example.com
- Order ORD-456 found. status: delivered. amount: $129.99
- Refund eligibility: CONFIRMED (physical damage)
- Damage photos: uploaded (3 images reviewed)
- Refund amount: $129.00 (pending approval)
- Next step: approve refund after manager review

IMPORTANT: The above findings are from the previous session.
Do NOT re-investigate these facts — proceed from here.\`;

// Start new session with summary
await claude(summary + '\\n\\nNow: approve the refund for order ORD-456.');

// ═════════════════════════════════════════════════════════════════════════════
// IMMUTABLE CASE FACTS (never summarized)
// ═════════════════════════════════════════════════════════════════════════════
// Pin critical data that must survive summarization
function buildPrompt(caseFacts, summarizedHistory, currentMessage) {
  return \\\\
## Case Facts [IMMUTABLE — DO NOT SUMMARIZE]
Customer ID:   \${caseFacts.customer_id}
Order ID:      \${caseFacts.order_id}
Refund Amount: $\$\${caseFacts.refund_amount.toFixed(2)}
Issue Type:    \${caseFacts.issue_type}
Refund Status: \${caseFacts.refund_status}

## Conversation Summary
\${summarizedHistory}

## Current Message
\${currentMessage}
\`;
}
// The "Case Facts" block is preserved verbatim during summarization.
// "Refund Amount: $129.99" will NEVER become "a refund request".

// ═════════════════════════════════════════════════════════════════════════════
// SESSION FORKING (parallel exploration)
// ═════════════════════════════════════════════════════════════════════════════
// Fork from message 15 to explore approach A
const forkA = await client.sessions.fork('sess_abc123', {
  fromMessageIndex: 15,
});
// Fork from message 15 to explore approach B
const forkB = await client.sessions.fork('sess_abc123', {
  fromMessageIndex: 15,
});
// Original session preserved. Both forks explore independently.`,
    antiPatterns: [
      {
        pattern: 'Resuming a stale session (>24 hours)',
        problem: 'Old sessions have outdated tool results. If get_customer returned customer data 6 hours ago. that data may no longer be accurate. Start fresh with a summary instead.',
      },
      {
        pattern: 'Summarizing critical transactional data',
        problem: 'Progressive summarization can compress "Order ORD-45678. refund $89.99" into "a refund request for When the happens. Claude may use wrong order ID or wrong amount. Pin critical data in immutable blocks.',
      },
      {
        pattern: 'Starting fresh without context',
        problem: 'If you start a completely new session without injecting any summary. Claude has no idea what was already done. You may repeat work or miss context. or approach.',
      },
    ],
    keyConcepts: [
      { concept: '--resume', description: 'Continue valid session. All context preserved.' },
      { concept: 'Fresh + Summary', description: 'Start new with summary injection. For stale contexts.' },
      { concept: 'Fork', description: 'Branch from a point. Explore alternatives independently.' },
      { concept: 'Immutable Blocks', description: 'Pin critical data. Never summarized. Survives context compression.' },
      { concept: 'Progressive Summarization', description: 'Old turns get compressed. Tool results become unreliable.' },
    ],
    resources: [
      { label: 'Session Management', url: 'https://docs.anthropic.com/en/docs/build-with-claude/agentic-patterns#session-management' },
      { label: 'Context Windows', url: 'https://docs.anthropic.com/en/docs/build-with-claude/context-windows' },
    ],
    examTips: [
      '--resume for valid context; fresh + summary for stale (>24 hrs or external file changes)',
      'Pin critical data in immutable blocks — never rely on summarization',
      'Fork sessions for parallel exploration without losing original',
      'Summarized tool results are unreliable —this is why fresh sessions are needed',
    ],
  },
  {
    id: '1-exam',
    title: 'Exam Practice Quiz',
    duration: '15 min',
    description: 'Test your understanding of all 7 subdomains with interactive exam-style questions. Answer each question and get instant feedback explaining why answers are correct or wrong.',
    knowledge: [],
    skills: [],
    codeExample: '',
    quiz: domain1Quiz,
  },
  {
    id: '1-summary',
    title: 'Chapter Summary & Quick Reference',
    duration: '10 min',
    description: 'Visual cheat sheet with collapsible subdomain cards, anti-patterns, and a 60-second scan for exam day.',
    knowledge: [],
    skills: [],
    codeExample: '',
    quickRef: domain1QuickRef,
  },
];

export default function Domain1() {
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
      completeLesson('domain1', id);
    }
    setCompletedLessons(newCompleted);
  };

  return (
    <div className="space-y-8">
      {/* Domain Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-8 text-white">
        <div className="flex items-center gap-3 mb-2">
          <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">Domain 1</span>
          <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">27% Exam Weight</span>
        </div>
        <h1 className="text-3xl font-bold mb-2">Agentic Architecture & Orchestration</h1>
        <p className="text-blue-100 max-w-2xl">Master the design and implementation of autonomous AI agents. multi-agent orchestration patterns. and sophisticated workflow systems.</p>
        <div className="flex items-center gap-6 mt-4 text-sm text-blue-100">
          <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" /> 9 Lessons</span>
          <span className="flex items-center gap-1"><FlaskConical className="w-4 h-4" /> Full Code Examples</span>
          <span className="flex items-center gap-1"><Lightbulb className="w-4 h-4" /> Exam Tips</span>
        </div>
      </div>

      {/* Mind Map */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
          <Brain className="w-5 h-5 text-blue-500" />
          Mind Map — Key Concepts
        </h2>
        <MindMap data={domain1MindMap.root} />
      </div>

      {/* Progress */}
      <div className="bg-white rounded-xl border p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-700">Progress</span>
          <span className="text-sm text-slate-500">{completedLessons.size}/{lessons.length} lessons completed</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all"
            style={{ width: `${(completedLessons.size / lessons.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Lessons */}
      <div className="space-y-3">
        {lessons.map((lesson) => {
          const isExpanded = expandedLesson === lesson.id;
          const isCompleted = completedLessons.has(lesson.id) || isLessonCompleted('domain1', lesson.id);

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
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{lesson.id}</span>
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
                    const expl = domain1Explanations.find(e => e.id === lesson.id);
                    return expl ? (
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                          <Lightbulb className="w-4 h-4 text-amber-500" />
                          Learn
                        </h4>
                        <LessonContent content={expl.explanation} domainColor="blue" />
                      </div>
                    ) : null;
                  })()}

                  {/* Knowledge */}
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-blue-500" />
                      Key Knowledge
                    </h4>
                    <ul className="space-y-2">
                      {lesson.knowledge.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Skills */}
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

                  {/* Code Example */}
                  {'quiz' in lesson && (lesson as any).quiz ? (
                    <DomainQuiz questions={(lesson as any).quiz} domainColor="blue" domainId="domain1" />
                  ) : 'quickRef' in lesson && (lesson as any).quickRef ? (
                    <QuickRef {...(lesson as any).quickRef} domainColor="blue" />
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

                  {/* Anti-patterns */}
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

                  {/* Key Concepts */}
                  {'keyConcepts' in lesson && lesson.keyConcepts && lesson.keyConcepts.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Key Concepts</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {lesson.keyConcepts.map((concept, i) => (
                          <div key={i} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <p className="font-medium text-blue-900 text-sm">{concept.concept}</p>
                            <p className="text-blue-700 text-xs">{concept.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Resources */}
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

                  {/* Exam Tips */}
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

                  {/* Mark Complete */}
                  <div className="flex justify-end pt-4 border-t border-slate-100">
                    <button
                      onClick={() => markComplete(lesson.id)}
                      className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
                        isCompleted
                          ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          : 'bg-blue-500 text-white hover:bg-blue-600'
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

      {/* Notes */}
      <NotesFab lessonId={expandedLesson || '1-1'} />

      {/* Navigation */}
      <div className="flex justify-end pt-8 border-t border-slate-200 dark:border-slate-800">
        <Link
          to="/domain/2"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors"
        >
          Next: Tool Design & MCP
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}
