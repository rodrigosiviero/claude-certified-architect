import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronRight, CheckCircle2, Circle, Code, BookOpen, FlaskConical, ArrowRight, AlertTriangle, Lightbulb, ExternalLink , Brain } from 'lucide-react';
import { useCourse } from '../context/CourseContext';
import DomainQuiz from '../components/DomainQuiz';
import MindMap from '../components/MindMap';
import { domain5MindMap } from '../data/mindMaps';
import domain5Quiz from '../data/quizzes/domain5';
import domain5QuickRef from '../data/quickRefs/domain5';
import QuickRef from '../components/QuickRef';
import { domain5Explanations } from '../data/lessons';
import LessonContent from '../components/LessonContent';
import NotesFab from '../components/NotesFab';

const lessons = [
  {
    id: '5-1',
    title: 'Conversation Context Management',
    duration: '45 min',
    description: 'Preserve critical information across long interactions and mitigate context degradation. As conversations grow, Claude loses track of early details. Learn strategies to maintain accuracy throughout multi-turn interactions.',
    knowledge: [
      'Progressive summarization risks: when Claude summarizes earlier conversation, it may condense numerical values, dates, and customer expectations into inaccurate approximations. "$1,299.99" might become "about $1,300" which changes the meaning for billing.',
      'The "lost in the middle" effect: Claude reliably processes information at the beginning and end of its context window but may overlook details in the middle. Place critical instructions at the start, summarize key facts at the end, and put supporting details in the middle.',
      'Tool results accumulate disproportionately. Every tool call adds to the context. After 15+ tool calls, earlier conversation context gets pushed toward the "middle" where it may be overlooked. Periodically summarize and restructure the context.',
      'Complete conversation history is required for conversational context — you can\'t selectively trim messages without losing the thread. Instead, use periodic summaries that consolidate key facts into a structured format.',
      'The context window is finite. Every message, tool result, and system prompt consumes tokens. Long conversations eventually hit the limit. Design your system to handle this gracefully — either by summarizing, or by starting fresh sessions with context restoration.',
      'Structured state tracking: instead of relying on Claude to remember facts from conversation history, maintain a structured state object (JSON) that gets passed explicitly with each turn. This is more reliable than hoping Claude remembers.',
      'The "scratchpad" pattern: for complex multi-step tasks, have Claude write intermediate findings to a scratchpad file (or structured state). This persists across context window resets and prevents loss of intermediate work.',
      'Anti-pattern: relying on Claude to "remember" details from 20 messages ago. It might, but it\'s unreliable. Explicitly pass critical context in each message instead of assuming it persists.',
    ],
    skills: [
      'Design conversation flows that minimize context degradation',
      'Implement structured state tracking instead of relying on memory',
      'Use scratchpad files for complex multi-step tasks',
      'Place critical information at context window boundaries',
    ],
    codeExample: `// Context Management Strategies

// ❌ BAD: Relying on conversation memory across many turns
// Turn 1: User says "My order ORD-12345 costs $1,299.99"
// Turn 5: Claude needs the order total...
// → Claude might remember, might not. Unreliable after 10+ turns.

// ✅ GOOD: Structured state tracking
interface ConversationState {
  customerName: string | null;
  orderId: string | null;
  orderTotal: number | null;
  issue: string | null;
  resolution: string | null;
}

async function handleConversationTurn(
  userMessage: string,
  state: ConversationState
) {
  // Pass state EXPLICITLY — don't rely on conversation history
  const prompt = \`
Current conversation state:
- Customer: \${state.customerName || "unknown"}
- Order: \${state.orderId || "unknown"}
- Total: \${state.orderTotal || "unknown"}
- Issue: \${state.issue || "unknown"}
- Resolution so far: \${state.resolution || "none"}

Customer says: "\${userMessage}"

Update the state based on this message, then respond.
Return your response AND the updated state as JSON.
\`;

  const response = await callClaude(prompt);

  // Update state from Claude's response
  return {
    reply: response.text,
    updatedState: response.state
  };
}

// The scratchpad pattern for complex tasks
async function complexAnalysisWithScratchpad(task: string) {
  // Initialize scratchpad
  await writeFile("scratchpad.md", "# Analysis Notes\\n\\n");

  // Phase 1: Discovery
  const discovery = await discoverAgent.execute({
    task: "Identify all authentication-related files",
    context: { project: "full codebase" }
  });

  // Write to scratchpad — persists even if context resets
  await appendFile("scratchpad.md", \`
## Discovery Phase
Files found: \${discovery.files.join(", ")}
Entry point: \${discovery.entryPoint}
\`);

  // Phase 2: Analysis (references scratchpad)
  const analysis = await analyzeAgent.execute({
    task: "Analyze the authentication flow",
    context: { scratchpad: await readFile("scratchpad.md") }
  });

  await appendFile("scratchpad.md", \`
## Analysis Phase
Flow: \${analysis.flow}
Vulnerabilities: \${analysis.vulnerabilities.join(", ")}
\`);

  // Phase 3: Report (references all prior work)
  const report = await reportAgent.execute({
    task: "Generate final security report",
    context: { scratchpad: await readFile("scratchpad.md") }
  });

  return report;
}

// The "lost in the middle" mitigation
// Structure your prompt to put critical info at edges:
const prompt = \`
// === CRITICAL (at the start — reliably processed) ===
Customer: John Smith (VIP)
Account: ACC-78901 (do NOT modify without confirmation)
Outstanding balance: $2,450.00

// === SUPPORTING DETAILS (in the middle — may be overlooked) ===
Previous interactions: 3 support tickets in last month
Preferred contact: email
Last order: laptop, 2 weeks ago

// === CRITICAL REMINDER (at the end — reliably processed) ===
IMPORTANT: This is a VIP customer. Priority handling required.
Account ACC-78901 has a $2,450 balance. Confirm before changes.
\`;`,
    antiPatterns: [
      {
        pattern: 'Relying on conversation memory for critical facts',
        problem: 'After 10+ turns, Claude may forget or distort earlier details. Pass critical context explicitly in each message instead.',
      },
      {
        pattern: 'Putting critical info in the middle of long prompts',
        problem: 'The "lost in the middle" effect means Claude processes start and end reliably, but may overlook middle content.',
      },
      {
        pattern: 'No state management for multi-turn workflows',
        problem: 'Without structured state tracking, each conversation turn risks losing information from earlier turns. Use explicit state objects.',
      },
    ],
    keyConcepts: [
      { concept: 'Lost in the middle', description: 'Claude reliably processes context at the beginning and end, may overlook the middle. Place critical info at edges.' },
      { concept: 'Structured state tracking', description: 'Pass a JSON state object explicitly with each turn. Don\'t rely on conversation history for critical facts.' },
      { concept: 'Scratchpad pattern', description: 'Write intermediate findings to files. Persists across context resets. Prevents loss of multi-step work.' },
      { concept: 'Progressive summarization risk', description: 'Summaries may distort numbers, dates, and specific values. Track these explicitly rather than relying on summaries.' },
    ],
    resources: [
      { label: 'Context Windows (Official Docs)', url: 'https://docs.anthropic.com/en/docs/build-with-claude/context-windows' },
    ],
    examTips: [
      '"Claude forgets details from earlier in conversation" → structured state tracking, not relying on memory.',
      '"Lost in the middle" effect → place critical info at start and end of prompts.',
      '"Numbers get distorted in long conversations" → pass values explicitly in state, don\'t rely on summarization.',
    ],
  },
  {
    id: '5-2',
    title: 'Escalation & Ambiguity Resolution',
    duration: '40 min',
    description: 'Design effective escalation patterns and handle ambiguous customer requests. Know when to escalate to humans immediately, when to try resolving first, and how to handle ambiguous inputs that could mean multiple things.',
    knowledge: [
      'Escalation triggers: (1) explicit human requests ("let me speak to a manager"), (2) policy exceptions or gaps (situation not covered by rules), (3) inability to progress after reasonable attempts.',
      'Honor explicit requests IMMEDIATELY. If a customer says "I want to talk to a human," escalate right away. Don\'t try to resolve their issue first. Don\'t ask if they\'re sure. Just escalate.',
      'Sentiment-based escalation is UNRELIABLE. A frustrated customer saying "this is ridiculous" might just want their issue fixed, not a human. But "let me speak to your supervisor" is an explicit escalation request. The exam tests this distinction.',
      'Ambiguity resolution: when a tool returns multiple matches (two John Smiths in the database), ask the user for additional identifiers instead of guessing. Never heuristically pick one — that leads to wrong-account access.',
      'The "attempt first, then escalate" pattern: for non-explicit requests, try to resolve. If the agent can\'t resolve after 2-3 attempts, then escalate. But for explicit human requests, escalate immediately.',
      'Self-reported confidence is NOT a reliable escalation trigger. Claude saying "I\'m not confident about this" doesn\'t mean a human would handle it better. Use explicit criteria (policy gaps, inability to progress) for escalation decisions.',
      'Policy exception handling: if the situation doesn\'t fit any defined policy, escalate to a human who can make a judgment call. Don\'t try to stretch an existing policy to cover an edge case it wasn\'t designed for.',
    ],
    skills: [
      'Define explicit escalation criteria in system prompts',
      'Distinguish explicit vs implicit escalation requests',
      'Ask for clarification when multiple matches are found',
      'Implement the "attempt first, then escalate" pattern',
    ],
    codeExample: `// Escalation & Ambiguity Resolution

// Escalation criteria in system prompt
const escalationPrompt = \`
## When to Escalate to Human (IMMEDIATELY)
- Customer explicitly asks for a human: "let me speak to a manager",
  "I want to talk to a real person", "connect me to support"
- Policy gap: the situation doesn't fit any defined policy
- Legal/compliance concern: anything involving legal threats or regulatory issues
- Security concern: suspected fraud, unauthorized access

## When to Attempt Resolution FIRST (then escalate if needed)
- Customer is frustrated but hasn't asked for a human
- Technical issue that might be resolvable
- Billing question that might have a clear answer

## When NOT to Escalate
- Customer is just expressing emotion ("this is frustrating")
- Issue is within your capability to resolve
- Customer hasn't explicitly requested escalation

## IMPORTANT:
- Sentiment alone is NOT an escalation trigger
- Claude's self-reported confidence is NOT an escalation trigger
- Only EXPLICIT requests and policy gaps trigger escalation
\`;

// Ambiguity resolution — multiple matches
// ❌ BAD: Picking the first match
async function handleCustomerLookup(email: string) {
  const matches = await searchCustomers(email);
  if (matches.length > 0) {
    return matches[0];  // WRONG! Could be wrong person
  }
}

// ✅ GOOD: Ask for clarification
async function handleCustomerLookup(email: string) {
  const matches = await searchCustomers(email);

  if (matches.length === 0) {
    return { error: "No customer found with that email" };
  }

  if (matches.length === 1) {
    return matches[0];  // Unambiguous — proceed
  }

  // Multiple matches — ask for clarification
  return {
    clarification_needed: true,
    message: \`I found \${matches.length} accounts with that email.
    Which one is yours?
    \${matches.map((m, i) =>
      \`\${i+1}. \${m.name} - Account ending in \${m.lastFourDigits}\`
    ).join("\\n")}\`,
    // NEVER auto-select. Always let the user disambiguate.
  };
}

// The "attempt first, then escalate" pattern
async function handleIssue(userMessage: string) {
  // Check for explicit escalation request FIRST
  if (isExplicitEscalationRequest(userMessage)) {
    return escalateToHuman("Customer requested human agent");
  }

  // Try to resolve
  const maxAttempts = 3;
  for (let i = 0; i < maxAttempts; i++) {
    const resolution = await attemptResolution(userMessage);
    if (resolution.success) return resolution;

    // Check if we've hit a policy gap
    if (resolution.reason === "policy_gap") {
      return escalateToHuman("Situation doesn't match any defined policy");
    }
  }

  // Couldn't resolve after attempts — escalate
  return escalateToHuman("Unable to resolve after " + maxAttempts + " attempts");
}`,
    antiPatterns: [
      {
        pattern: 'Escalating on sentiment alone',
        problem: '"This is frustrating" ≠ "I want to talk to a human." Sentiment is not a reliable escalation trigger. Only explicit requests and policy gaps trigger escalation.',
      },
      {
        pattern: 'Auto-selecting from multiple matches',
        problem: 'When search returns 2 John Smiths, picking the first one might access the wrong account. Always ask the user to disambiguate.',
      },
      {
        pattern: 'Trying to resolve before honoring explicit requests',
        problem: 'If the customer says "let me speak to a manager," escalate IMMEDIATELY. Don\'t try to fix their issue first.',
      },
    ],
    keyConcepts: [
      { concept: 'Explicit escalation triggers', description: 'Customer says "human", policy gaps, legal/security concerns. These trigger IMMEDIATE escalation.' },
      { concept: 'Attempt-first pattern', description: 'For non-explicit requests, try to resolve. Escalate only after 2-3 failed attempts or policy gaps.' },
      { concept: 'Ambiguity resolution', description: 'Multiple matches = ask for clarification. Never auto-select from ambiguous results.' },
      { concept: 'Sentiment ≠ escalation', description: 'Frustration is emotion, not an escalation request. The exam tests this distinction.' },
    ],
    resources: [
      { label: 'Building Customer Service Agents', url: 'https://docs.anthropic.com/en/docs/build-with-claude/agentic-systems' },
    ],
    examTips: [
      '"Customer says let me speak to a manager" → escalate IMMEDIATELY. Not "try to help first."',
      '"Search returns 2 John Smiths" → ask for clarification. Never auto-select.',
      'Sentiment and self-reported confidence are NOT reliable escalation triggers.',
    ],
  },
  {
    id: '5-3',
    title: 'PII & Privacy Protection',
    duration: '40 min',
    description: 'Protect personally identifiable information (PII) throughout the agentic workflow. Learn how to handle sensitive data in tool inputs, prevent PII leakage in logs, and design systems that maintain user privacy by default.',
    knowledge: [
      'PII includes: names, emails, phone numbers, SSNs, credit card numbers, addresses, dates of birth, health information, financial account numbers. Any data that could identify a specific person.',
      'PII must be protected at every stage: tool inputs, Claude\'s context, tool outputs, logs, and error messages. A single unredacted log entry can expose customer data.',
      'Redaction at tool boundaries: before sending tool results to Claude, strip or mask PII. Replace "John Smith, SSN 123-45-6789" with "[CUSTOMER], SSN [REDACTED]". Claude can work with the redacted version.',
      'The principle of least information: only pass the PII that\'s strictly necessary for the task. If Claude needs to know the customer\'s account status, pass the status — not the full customer record including SSN and address.',
      'Logging anti-pattern: logging full tool inputs/outputs including PII. Even debug logs should redact sensitive fields. Use structured logging with explicit field-level redaction.',
      'Claude does NOT need real PII to be helpful. For many tasks, "the customer\'s order" works just as well as "John Smith\'s order ORD-12345." Pass identifiers, not personal details.',
      'Error messages must not expose PII. "Validation failed for SSN 123-45-6789" should be "Validation failed for SSN [REDACTED]." Audit all error paths for PII exposure.',
      'Data retention: don\'t store PII in conversation history longer than needed. Implement automatic cleanup or session-based isolation that purges sensitive data when the session ends.',
    ],
    skills: [
      'Implement PII redaction at tool boundaries',
      'Apply the principle of least information',
      'Audit logging and error messages for PII exposure',
      'Design session-based data isolation',
    ],
    codeExample: `// PII Protection Patterns

// Pattern 1: Redaction at tool boundaries
interface PIIRedactor {
  redact(text: string): string;
  restore(text: string, original: string): string;
}

const redactor: PIIRedactor = {
  redact(text) {
    return text
      .replace(/\\b\\d{3}-\\d{2}-\\d{4}\\b/g, "[SSN_REDACTED]")
      .replace(/\\b[A-Z]\\d{3}\\s?\\d{4}\\s?\\d{4}\\s?\\d{4}\\b/g, "[CC_REDACTED]")
      .replace(/\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b/g, "[EMAIL_REDACTED]")
      .replace(/\\b\\d{3}[-.]?\\d{3}[-.]?\\d{4}\\b/g, "[PHONE_REDACTED]");
  },

  // Restore for actual tool execution (Claude sees redacted,
  // but the tool needs real data)
  restore(text, original) {
    // Map redacted tokens back to originals for tool execution
    // This mapping is stored server-side, never sent to Claude
    return original;
  }
};

// Pattern 2: Least information principle
// ❌ BAD: Passing full customer record
const badToolInput = {
  customer: {
    name: "John Smith",
    ssn: "123-45-6789",
    email: "john@example.com",
    phone: "555-123-4567",
    address: "123 Main St, Anytown, USA",
    creditCard: "4111111111111111",
    orderStatus: "shipped"
  }
};

// ✅ GOOD: Only pass what's needed
const goodToolInput = {
  customerRef: "CUST-789",
  orderStatus: "shipped",
  // Claude can answer "where is my order" with just this
  // No PII needed at all
};

// Pattern 3: Safe logging
function safeLog(level: string, message: string, data: any) {
  const sensitive = ['ssn', 'creditCard', 'email', 'phone',
                     'address', 'dateOfBirth', 'password'];

  const redactedData = Object.entries(data).reduce((acc, [key, value]) => {
    if (sensitive.includes(key)) {
      acc[key] = "[REDACTED]";
    } else {
      acc[key] = value;
    }
    return acc;
  }, {} as any);

  console.log(JSON.stringify({ level, message, data: redactedData }));
}

// Usage:
safeLog("info", "Order lookup", {
  orderId: "ORD-12345",      // Logged normally
  customerEmail: "john@...", // Logged as [REDACTED]
  orderStatus: "shipped"     // Logged normally
});
// Output: {"level":"info","message":"Order lookup",
//          "data":{"orderId":"ORD-12345",
//                  "customerEmail":"[REDACTED]",
//                  "orderStatus":"shipped"}}`,
    antiPatterns: [
      {
        pattern: 'Passing full customer records to Claude',
        problem: 'Claude rarely needs all PII. Pass only the fields needed for the task. "Order status" doesn\'t require SSN or credit card number.',
      },
      {
        pattern: 'Logging unredacted tool inputs/outputs',
        problem: 'Debug logs containing PII are a security risk. Implement field-level redaction for all logging.',
      },
      {
        pattern: 'Exposing PII in error messages',
        problem: '"Validation failed for john@example.com" leaks PII. Use "Validation failed for [EMAIL_REDACTED]" instead.',
      },
    ],
    keyConcepts: [
      { concept: 'PII redaction at boundaries', description: 'Strip/mask PII before sending to Claude. Restore real values only for tool execution, server-side only.' },
      { concept: 'Least information principle', description: 'Only pass the minimum data Claude needs. Often an ID and status is enough — no personal details.' },
      { concept: 'Safe logging', description: 'Field-level redaction in all logs. Explicit list of sensitive fields. Never log raw PII.' },
    ],
    resources: [
      { label: 'Claude Data Privacy', url: 'https://www.anthropic.com/privacy' },
      { label: 'Responsible Use Policy', url: 'https://www.anthropic.com/responsible-use' },
    ],
    examTips: [
      '"Customer data exposed in logs" → implement field-level PII redaction in all logging.',
      '"Claude receives unnecessary personal data" → apply least information principle. Only pass what\'s needed.',
      'PII must be protected at every stage: inputs, context, outputs, logs, errors.',
    ],
  },
  {
    id: '5-4',
    title: 'Tool Result Processing & Large-Scale Workflows',
    duration: '40 min',
    description: 'Handle massive tool outputs, process large codebase explorations, and manage subagent coordination for complex analysis tasks. Design crash recovery and quality monitoring for production systems.',
    knowledge: [
      'Large tool outputs consume context. A database query returning 10,000 rows will fill the context window and push out earlier conversation. Always paginate, summarize, or filter before passing results to Claude.',
      'The subagent isolation pattern: spawn subagents for specific investigation tasks. Each subagent works in its own context. Only the structured findings return to the main agent. This prevents context pollution from verbose exploration.',
      'Scratchpad files for multi-phase analysis: write intermediate findings to a file. Later phases read the scratchpad instead of relying on conversation history. This persists across context resets and enables crash recovery.',
      'Crash recovery: design agents to export structured state manifests. If an agent crashes mid-task, a new agent can pick up from the last checkpoint by reading the manifest. Without this, all progress is lost.',
      'Quality monitoring for automated systems: sample a percentage of automated outputs and evaluate against ground truth. If error rates increase, alert the team and revert to human review. Don\'t trust automation blindly.',
      'Stratified sampling for accuracy measurement: measure accuracy per document type or segment, not just overall. High overall accuracy can mask terrible performance on specific document types (e.g., 95% overall but 60% on invoices).',
      'Aggregate accuracy masks segment-specific issues. If your extraction system is 95% accurate overall but only 70% accurate on handwritten documents, the overall metric hides a real problem. Always measure per segment.',
      'Confidence-based routing: route high-confidence extractions to automation, medium-confidence to human review, and low-confidence to investigation. This maximizes throughput while catching errors.',
    ],
    skills: [
      'Paginate and summarize large tool outputs',
      'Design subagent isolation for codebase exploration',
      'Implement crash recovery with state manifests',
      'Design quality monitoring with stratified sampling',
    ],
    codeExample: `// Tool Result Processing Patterns

// Pattern 1: Paginated tool results
async function searchWithPagination(query: string) {
  // ❌ BAD: Return all results at once
  // const all = await db.query(query); // 10,000 rows
  // Claude's context fills up, earlier conversation is lost

  // ✅ GOOD: Paginate and summarize
  const firstPage = await db.query(query + " LIMIT 10");

  if (firstPage.length === 0) {
    return { total: 0, results: [], summary: "No results found" };
  }

  // Get count for context
  const count = await db.query("SELECT COUNT(*) FROM ...");

  return {
    total: count,
    showing: firstPage.length,
    results: firstPage,
    summary: \`Found \${count} results. Showing first \${firstPage.length}.\`,
    hasMore: count > 10
  };
}

// Pattern 2: Subagent isolation for exploration
async function exploreCodebase(topics: string[]) {
  const findings = {};

  // Each topic investigated in ISOLATION
  const investigations = await Promise.all(
    topics.map(topic =>
      subAgent.execute({
        task: \`Investigate: \${topic}
        Return structured findings with:
        - Key files
        - Main components
        - Dependencies
        - Issues found\`,
      })
    )
  );

  // Only structured summaries come back to main agent
  for (const result of investigations) {
    findings[result.topic] = result.summary;
  }

  return findings;
}

// Pattern 3: Crash recovery with state manifests
interface AgentState {
  version: string;
  timestamp: string;
  currentPhase: string;
  completedPhases: string[];
  findings: Record<string, any>;
  nextStep: string;
}

async function runWithRecovery(task: string) {
  // Check for existing state
  let state = await loadState();
  if (!state) {
    state = {
      version: "1.0",
      timestamp: new Date().toISOString(),
      currentPhase: "discovery",
      completedPhases: [],
      findings: {},
      nextStep: "start_discovery"
    };
  }

  // Execute from checkpoint
  const phases = ["discovery", "analysis", "review", "report"];
  const startIndex = phases.indexOf(state.currentPhase);

  for (let i = startIndex; i < phases.length; i++) {
    const phase = phases[i];

    try {
      const result = await executePhase(phase, state.findings);
      state.findings[phase] = result;
      state.completedPhases.push(phase);
      state.currentPhase = phases[i + 1] || "complete";
      state.timestamp = new Date().toISOString();

      // Save checkpoint after each phase
      await saveState(state);
    } catch (error) {
      // Crash! State is saved — next run picks up here
      console.error(\`Crashed in phase \${phase}. State saved.\`);
      throw error;
    }
  }

  return state.findings;
}

// Pattern 4: Quality monitoring
async function monitorExtractionQuality() {
  // Sample 5% of recent automated extractions
  const sample = await getRecentExtractions({
    filter: { automated: true },
    sampleRate: 0.05
  });

  // Evaluate against ground truth
  const evaluation = await evaluateAgainstGroundTruth(sample);

  // Check per-segment accuracy
  const byType = groupBy(evaluation, "documentType");
  for (const [type, results] of Object.entries(byType)) {
    const accuracy = results.filter(r => r.correct).length / results.length;
    if (accuracy < 0.85) {
      await alertTeam({
        type: "segment_accuracy_degradation",
        segment: type,
        accuracy,
        threshold: 0.85
      });
    }
  }

  return { overall: evaluation.accuracy, byType };
}`,
    antiPatterns: [
      {
        pattern: 'Returning massive tool outputs to Claude',
        problem: '10K rows fills the context window, pushing out earlier conversation. Always paginate, filter, or summarize before passing to Claude.',
      },
      {
        pattern: 'No crash recovery in long-running agents',
        problem: 'Without state persistence, a crash at 90% completion means starting over. Save checkpoints after each phase.',
      },
      {
        pattern: 'Measuring only overall accuracy',
        problem: '95% overall accuracy can hide 60% accuracy on specific document types. Always measure per-segment.',
      },
    ],
    keyConcepts: [
      { concept: 'Paginated results', description: 'Never return all rows. Use LIMIT, summarize counts, and let Claude request more if needed.' },
      { concept: 'Subagent isolation', description: 'Each subagent works in its own context. Only structured summaries return to main agent.' },
      { concept: 'Crash recovery', description: 'Save state manifests after each phase. New agent picks up from checkpoint on restart.' },
      { concept: 'Stratified quality monitoring', description: 'Measure accuracy per segment, not just overall. Catch segment-specific degradation early.' },
    ],
    resources: [
      { label: 'Agentic Systems Overview', url: 'https://docs.anthropic.com/en/docs/build-with-claude/agentic-systems' },
    ],
    examTips: [
      '"Large tool output fills context" → paginate and summarize. Don\'t pass raw results.',
      '"Agent crashes lose all progress" → crash recovery with state manifests. Save checkpoints.',
      '"95% accuracy overall" → might hide segment issues. Always measure per-segment.',
    ],
  },
  {
    id: '5-5',
    title: 'Multi-Turn Workflow Design',
    duration: '35 min',
    description: 'Design multi-turn agent workflows that handle complex tasks across multiple conversation turns. Coordinate subagents, maintain state, and produce reliable results through structured handoffs.',
    knowledge: [
      'Multi-turn workflows are needed when a single request requires multiple tool calls, verification steps, or user interactions. A refund workflow might need: (1) verify customer, (2) find order, (3) check return policy, (4) process refund, (5) send confirmation.',
      'State must be maintained between turns. Either through conversation history (short workflows) or structured state objects (long workflows). Don\'t rely on Claude remembering state from 10+ turns ago.',
      'Structured handoff packages between phases: instead of free-text handoffs, use a structured format that includes: findings, confidence level, caveats, and recommended next steps. This prevents information loss between phases.',
      'Subagent coordination for complex tasks: the main agent orchestrates, subagents execute specific tasks. The main agent never needs to see the verbose intermediate work — only the structured summaries.',
      'Human-in-the-loop patterns: for critical operations (refunds over $500, account deletions), insert a confirmation step. Claude presents what it\'s about to do, the human approves, then Claude executes.',
      'Error recovery in workflows: if a step fails, don\'t start over. Retry the failed step with error context. If retries fail, skip and continue or escalate based on the step\'s criticality.',
    ],
    skills: [
      'Design multi-turn workflows with structured state',
      'Create handoff packages between phases',
      'Implement human-in-the-loop confirmation',
      'Design error recovery for multi-step workflows',
    ],
    codeExample: `// Multi-Turn Workflow Design

// Example: Customer refund workflow
interface RefundWorkflowState {
  currentStep: string;
  customer: { id: string; name: string; verified: boolean } | null;
  order: { id: string; total: number; items: any[] } | null;
  returnPolicy: { eligible: boolean; reason: string } | null;
  refund: { amount: number; processed: boolean } | null;
}

// Structured handoff package between steps
interface HandoffPackage {
  step: string;
  findings: any;
  confidence: number;
  caveats: string[];
  nextStep: string;
}

async function executeRefundWorkflow(
  userMessage: string,
  state: RefundWorkflowState
) {
  switch (state.currentStep) {
    case "verify_customer": {
      const customer = await lookupCustomer(userMessage);
      return {
        state: { ...state, customer, currentStep: "find_order" },
        handoff: {
          step: "verify_customer",
          findings: customer,
          confidence: customer ? 0.95 : 0.3,
          caveats: customer ? [] : ["Customer not found in system"],
          nextStep: "find_order"
        }
      };
    }

    case "find_order": {
      const order = await searchOrders(state.customer!.id);
      return {
        state: { ...state, order, currentStep: "check_policy" },
        handoff: {
          step: "find_order",
          findings: order,
          confidence: order ? 0.9 : 0.2,
          caveats: order ? [] : ["No order found"],
          nextStep: "check_policy"
        }
      };
    }

    case "check_policy": {
      const policy = await checkReturnPolicy(state.order!);
      return {
        state: { ...state, returnPolicy: policy, currentStep: "confirm_refund" },
        handoff: {
          step: "check_policy",
          findings: policy,
          confidence: 0.85,
          caveats: policy.eligible ? [] : [policy.reason],
          nextStep: policy.eligible ? "confirm_refund" : "deny_refund"
        }
      };
    }

    case "confirm_refund": {
      // Human-in-the-loop: confirm before executing
      const refundAmount = state.order!.total;
      return {
        state,
        requiresConfirmation: true,
        confirmationMessage: \`Process refund of $\${refundAmount} for order $\${state.order!.id}?\`,
        nextStep: "execute_refund"
      };
    }

    case "execute_refund": {
      const refund = await processRefund(
        state.order!.id,
        state.order!.total
      );
      return {
        state: { ...state, refund, currentStep: "complete" },
        message: \`Refund of $\${state.order!.total} processed successfully.\`
      };
    }
  }
}`,
    antiPatterns: [
      {
        pattern: 'Free-text handoffs between workflow phases',
        problem: 'Without structured handoff packages, information gets lost between steps. Use structured format: findings + confidence + caveats + next step.',
      },
      {
        pattern: 'No human confirmation for critical operations',
        problem: 'Processing a $5,000 refund without confirmation is risky. Insert human-in-the-loop for operations above a threshold.',
      },
    ],
    keyConcepts: [
      { concept: 'Structured handoff packages', description: 'Findings + confidence + caveats + next step. Prevents information loss between workflow phases.' },
      { concept: 'Human-in-the-loop', description: 'Confirmation step before critical operations. Present action, human approves, then execute.' },
      { concept: 'State-driven workflow', description: 'Explicit state object tracks progress. Each step reads and updates state. No reliance on memory.' },
    ],
    examTips: [
      '"Information lost between workflow steps" → structured handoff packages with findings, confidence, caveats.',
      '"Need to prevent accidental large refunds" → human-in-the-loop confirmation for operations above threshold.',
    ],
  },
  {
    id: '5-6',
    title: 'Information Provenance & Uncertainty',
    duration: '35 min',
    description: 'Preserve source attribution through multi-source synthesis and handle conflicting information correctly. Never merge conflicting statistics — annotate with attribution instead.',
    knowledge: [
      'Source attribution is lost during summarization. When Claude summarizes findings from multiple sources, the link between a specific claim and its source disappears. Use structured claim-source mappings to preserve this.',
      'Claim-source mapping structure: each claim includes its source document, URL, date, and confidence level. { claim: "market will reach $407B", sources: [{ document: "McKinsey Report", date: "2024-01" }], confidence: 0.8 }.',
      'Conflicting statistics from different sources: DON\'T pick one. DON\'T average them. Instead, present both with attribution: "Source A reports $407B by 2027. Source B reports $390B by 2027. These estimates differ due to methodology."',
      'Require publication/collection dates in outputs. A statistic from 2020 shouldn\'t be presented as current. Every data point should include when it was collected or published.',
      'Structure reports to distinguish well-established findings from contested ones. "Established: X is true (3 sources agree). Contested: Y might be true (1 source claims it, 2 disagree)." This is more honest than presenting everything as fact.',
      'The synthesis anti-pattern: merging multiple reports into a single narrative that loses all attribution. "The market is growing rapidly" hides which source said what, their methodology, and their date. Instead, maintain structured claim-source mappings.',
    ],
    skills: [
      'Require structured claim-source mappings in outputs',
      'Present conflicting values with explicit annotation',
      'Include dates for all data points',
      'Distinguish established from contested findings',
    ],
    codeExample: `// Information Provenance Patterns

// Pattern 1: Claim-Source Mapping
interface ClaimSourceMapping {
  claim: string;
  sources: {
    document: string;
    url?: string;
    date: string;
    methodology?: string;
  }[];
  confidence: number;
  status: "established" | "contested" | "single_source";
}

// ✅ GOOD: Structured with attribution
const findings: ClaimSourceMapping[] = [
  {
    claim: "AI market will reach $407B by 2027",
    sources: [
      {
        document: "McKinsey Global AI Report 2024",
        url: "https://mckinsey.com/ai-report",
        date: "2024-01-15",
        methodology: "Bottom-up market sizing"
      }
    ],
    confidence: 0.8,
    status: "single_source"
  },
  {
    claim: "AI adoption doubled in 2024",
    sources: [
      {
        document: "Gartner AI Survey 2024",
        date: "2024-03-01"
      },
      {
        document: "McKinsey Global AI Report 2024",
        date: "2024-01-15"
      }
    ],
    confidence: 0.9,
    status: "established"
  }
];

// Pattern 2: Handling conflicting data
// ❌ BAD: Pick one or average
// "The market size is $398B" (averaged $407B and $390B)
// This invents a number neither source reported!

// ✅ GOOD: Present both with attribution
const conflictingFindings = {
  claim: "AI market size by 2027",
  values: [
    {
      value: "$407B",
      source: "McKinsey Global AI Report 2024",
      date: "2024-01-15",
      methodology: "Bottom-up market sizing"
    },
    {
      value: "$390B",
      source: "Grand View Research 2024",
      date: "2024-02-20",
      methodology: "Top-down economic modeling"
    }
  ],
  conflict_reason: "Different methodologies produce different estimates",
  recommendation: "Cite both sources when referencing market size"
};

// Pattern 3: Structured report with provenance
const report = {
  established_findings: [
    {
      claim: "AI adoption is increasing",
      sources: 3,
      date_range: "2023-2024",
      confidence: 0.95
    }
  ],
  contested_findings: [
    {
      claim: "AI market will reach $400B+ by 2027",
      supporting: 2,
      contradicting: 1,
      reason: "Methodology differences in market sizing"
    }
  ],
  single_source_findings: [
    {
      claim: "45% of companies use generative AI",
      source: "McKinsey 2024",
      note: "Not independently verified"
    }
  ]
};`,
    antiPatterns: [
      {
        pattern: 'Averaging conflicting statistics',
        problem: 'If Source A says $407B and Source B says $390B, averaging to $398.5B invents a number neither source reported. Present both with attribution.',
      },
      {
        pattern: 'Summarizing without source attribution',
        problem: '"The market is growing" loses all attribution. Which source? When? Based on what methodology? Maintain claim-source mappings.',
      },
      {
        pattern: 'Presenting contested findings as established fact',
        problem: 'If only 1 out of 3 sources makes a claim, it\'s not established. Structure reports to distinguish established from contested from single-source.',
      },
    ],
    keyConcepts: [
      { concept: 'Claim-source mapping', description: 'Each claim links to its source with document name, date, methodology. Preserves attribution through synthesis.' },
      { concept: 'Conflicting data handling', description: 'Present both values with attribution. Don\'t average, don\'t pick one. Explain why they differ.' },
      { concept: 'Established vs contested', description: 'Structure reports to distinguish: established (multiple sources agree) vs contested (sources disagree) vs single_source.' },
    ],
    examTips: [
      '"Two reports disagree on a statistic" → present both with attribution, don\'t average.',
      '"Source attribution lost in synthesis" → use structured claim-source mappings.',
      '"Single source claim presented as fact" → label as single_source, not established.',
    ],
  },
  {
    id: '5-exam',
    title: 'Domain 5 Exam Practice Quiz',
    duration: '15 min',
    description: 'Interactive quiz covering all 6 subdomains of context management and safety.',
    knowledge: [],
    skills: [],
    codeExample: '',
    quiz: domain5Quiz,
  },
  {
    id: '5-summary',
    title: 'Chapter Summary & Quick Reference',
    duration: '10 min',
    description: 'Visual cheat sheet for exam day — collapsible cards, anti-patterns, and 60-second scan.',
    knowledge: [],
    skills: [],
    codeExample: '',
    quickRef: domain5QuickRef,
  },
];

export default function Domain5() {
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
      completeLesson('domain5', id);
    }
    setCompletedLessons(newCompleted);
  };

  return (
    <div className="space-y-8">
      {/* Domain Header */}
      <div className="bg-gradient-to-r from-rose-500 to-rose-600 rounded-2xl p-8 text-white">
        <div className="flex items-center gap-3 mb-2">
          <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">Domain 5</span>
          <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">~15% Exam Weight</span>
        </div>
        <h1 className="text-3xl font-bold mb-2">Context Management &amp; Safety</h1>
        <p className="text-rose-100 max-w-2xl">Master conversation context preservation, escalation patterns, PII protection, large-scale tool processing, multi-turn workflow design, and information provenance.</p>
        <div className="flex items-center gap-6 mt-4 text-sm text-rose-100">
          <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" /> 8 Lessons</span>
          <span className="flex items-center gap-1"><FlaskConical className="w-4 h-4" /> Full Code Examples</span>
          <span className="flex items-center gap-1"><Lightbulb className="w-4 h-4" /> Exam Tips</span>
        </div>
      </div>

      {/** Mind Map **/}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
          <Brain className="w-5 h-5 text-red-500" />
          Mind Map — Key Concepts
        </h2>
        <MindMap data={domain5MindMap.root} />
      </div>

      {/* Progress */}
      <div className="bg-white rounded-xl border p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-700">Progress</span>
          <span className="text-sm text-slate-500">{completedLessons.size}/{lessons.length} lessons completed</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2">
          <div
            className="bg-rose-500 h-2 rounded-full transition-all"
            style={{ width: `${(completedLessons.size / lessons.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Lessons */}
      <div className="space-y-3">
        {lessons.map((lesson) => {
          const isExpanded = expandedLesson === lesson.id;
          const isCompleted = completedLessons.has(lesson.id) || isLessonCompleted('domain5', lesson.id);

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
                    <span className="text-xs font-medium text-rose-600 bg-rose-50 px-2 py-0.5 rounded">{lesson.id}</span>
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
                    const expl = domain5Explanations.find(e => e.id === lesson.id);
                    return expl ? (
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                          <Lightbulb className="w-4 h-4 text-amber-500" />
                          Learn
                        </h4>
                        <LessonContent content={expl.explanation} domainColor="rose" />
                      </div>
                    ) : null;
                  })()}

                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-rose-500" />
                      Key Knowledge
                    </h4>
                    <ul className="space-y-2">
                      {lesson.knowledge.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                          <span className="w-1.5 h-1.5 bg-rose-500 rounded-full mt-2 flex-shrink-0" />
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
                    <DomainQuiz questions={(lesson as any).quiz} domainColor="rose" domainId="domain5" />
                  ) : 'quickRef' in lesson && (lesson as any).quickRef ? (
                    <QuickRef {...(lesson as any).quickRef} domainColor="rose" />
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
                          <div key={i} className="bg-rose-50 border border-rose-200 rounded-lg p-3">
                            <p className="font-medium text-rose-900 text-sm">{concept.concept}</p>
                            <p className="text-rose-700 text-xs">{concept.description}</p>
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
                          : 'bg-rose-500 text-white hover:bg-rose-600'
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

      <NotesFab lessonId={expandedLesson || '5-1'} />

      {/* Navigation */}
      <div className="flex justify-between pt-8 border-t border-slate-200 dark:border-slate-800">
        <Link
          to="/domain/4"
          className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors"
        >
          Previous: Prompt Engineering
        </Link>
        <Link
          to="/practice-exam"
          className="inline-flex items-center gap-2 px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-xl transition-colors"
        >
          Take Practice Exam
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}