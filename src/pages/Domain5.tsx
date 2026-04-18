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
    title: 'Error Propagation Strategies',
    duration: '40 min',
    description: 'Design error propagation patterns for multi-agent systems. Understand structured error context, the difference between access failures and empty results, and why silent error suppression is an anti-pattern.',
    knowledge: [
      'Structured error context: when a subagent fails, propagate failure type (timeout, 404, rate limit), the attempted query/operation, any partial results obtained, and potential alternative approaches. This enables the coordinator to make intelligent recovery decisions.',
      'Access failures (timeout, 403) are NOT the same as valid empty results (0 matches). A search that timed out means "we don\'t know if results exist." A search that returned 0 results means "we know no results exist." These require different handling.',
      'Generic error messages ("search unavailable") hide valuable context from the coordinator. The coordinator needs specifics to decide: retry with backoff? Try an alternative source? Skip and continue? Propagate to human? Generic errors prevent intelligent recovery.',
      'Silently suppressing errors — returning empty results as if the call succeeded — is a critical anti-pattern. The coordinator treats empty as valid, makes decisions based on incomplete data, and the failure is invisible. Always surface errors.',
      'Terminating the entire workflow on a single subagent failure is another anti-pattern. One source being unavailable doesn\'t mean all findings are invalid. Design graceful degradation: continue with available sources and annotate coverage gaps.',
      'Subagent error handling: local recovery for transient errors (retry with backoff for timeouts, rate limits). Propagate only unresolvable errors (auth failures, data not found after all sources checked). This prevents unnecessary workflow interruption.',
      'Coverage annotations: when some sources succeed and others fail, annotate findings with coverage. "Revenue data from SEC filings (confirmed). Employee count from LinkedIn (unavailable — source timed out)." Future consumers know what\'s reliable.',
      'Include what was attempted in propagated errors: not just "search failed" but "searched SEC filings for 2024 Q4 revenue, timed out after 30s. Partial result: found Q3 revenue of $4.2M." Partial results are often still useful.',
      'Error context for retry decisions: include attempt count and history. "First attempt: timeout after 30s. Second attempt: timeout after 60s." This tells the coordinator that simple retry won\'t help — try an alternative source.',
      'Common exam scenario: "A subagent returns empty results when its search tool times out." Answer: Anti-pattern — access failure is being silently suppressed as empty result. Return structured error instead.',
    ],
    skills: [
      'Design structured error propagation for subagents',
      'Distinguish access failures from empty results',
      'Implement graceful degradation with coverage annotations',
      'Prevent silent error suppression anti-patterns',
    ],
    codeExample: `import anthropic

client = anthropic.Anthropic()

# SUBAGENT: Search with structured error reporting
def search_filings(company: str, source: str):
    try:
        # Simulate search call
        if source == "SEC":
            return {"status": "success", "data": {"revenue": "5.2M"}, "source": "SEC"}
        elif source == "LinkedIn":
            raise TimeoutError("LinkedIn API timed out after 30s")
    except TimeoutError as e:
        # STRUCTURED error — NOT empty result
        return {
            "status": "error",
            "error_type": "timeout",
            "source": source,
            "attempted": f"Searched {source} for {company} financials",
            "partial_results": None,
            "alternatives": ["Try SEC filings instead", "Retry with longer timeout"]
        }

# COORDINATOR: Handles errors intelligently
sources = ["SEC", "LinkedIn", "Crunchbase"]
results = []

for source in sources:
    result = search_filings("Acme Corp", source)
    if result["status"] == "success":
        results.append(result)
        print(f"[ok] {source}: {result['data']}")
    else:
        # Error is visible — coordinator can decide
        print(f"[error] {source}: {result['error_type']}")
        if result.get("alternatives"):
            print(f"  Alternatives: {result['alternatives']}")

# COORDINATOR makes informed decision
if not results:
    print("All sources failed — cannot produce reliable report")
else:
    print(f"Proceeding with {len(results)} source(s)")
    # Annotate coverage gaps in final output
    failed = [s for s in sources if s not in [r["source"] for r in results]]
    if failed:
        print(f"Note: data unavailable from {failed}")`,
  },
  {
    id: '5-4',
    title: 'Large Codebase Exploration',
    duration: '40 min',
    description: 'Navigate large codebases with Claude Code using scratchpad files, subagent delegation, state manifests for crash recovery, and context management techniques (/compact). Understand context degradation symptoms and mitigation strategies.',
    knowledge: [
      'Context degradation symptoms: after exploring many files, Claude gives inconsistent answers (contradicts earlier findings), references "typical patterns" instead of specific classes found, or loses track of previously identified relationships.',
      'Scratchpad files persist key findings across context boundaries. Write discovered APIs, class hierarchies, and important patterns to a scratchpad file. Later phases read the scratchpad instead of relying on conversation history that may have been compressed.',
      'Subagent delegation: spawn subagents for specific investigation tasks ("find all test files", "trace the data flow from API to database"). Each subagent works in its own context. Only structured findings return to the main agent. This prevents context pollution.',
      'State manifests for crash recovery: design agents to export structured state (files examined, findings so far, next steps). If context overflows or the session crashes, a new agent loads the manifest and continues from the checkpoint.',
      'Summarize findings before spawning next phase: after exploring 30 files, summarize key discoveries and inject the summary into the next phase\'s context. Fresh subagent gets the essence without the verbose exploration history.',
      '/compact command reduces context usage during extended sessions. Claude summarizes the conversation so far and continues with a compressed context. Use this proactively before context degradation symptoms appear.',
      'Phase-based exploration: Phase 1 = map the structure (directory layout, key files). Phase 2 = deep dive on relevant modules. Phase 3 = trace specific flows. Each phase produces a summary that feeds into the next.',
      'Anti-pattern: reading entire large files into context. Use targeted reads — specific functions, class definitions, import sections. Large files consume context unnecessarily when you often only need specific parts.',
      'Cross-reference tracking: maintain a list of discovered relationships (A imports B, C calls D, E extends F). This graph structure is more useful than linear file-by-file notes for understanding codebase architecture.',
      'Common exam scenario: "After exploring 100 files, Claude starts giving vague answers about class names it previously identified specifically." Answer: Context degradation. Use scratchpad files to persist key findings and subagent delegation for new exploration.',
    ],
    skills: [
      'Use scratchpad files to persist findings across context boundaries',
      'Delegate exploration tasks to subagents with isolated context',
      'Design state manifests for crash recovery',
      'Recognize and mitigate context degradation symptoms',
    ],
    codeExample: `import anthropic

client = anthropic.Anthropic()

# PHASE 1: Map codebase structure
phase1_prompt = """You are exploring a large Python codebase.
Map the directory structure and identify key modules.
Write findings to a scratchpad format."""

phase1 = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=2048,
    messages=[{"role": "user", "content": phase1_prompt}]
)

scratchpad = phase1.content[0].text

# PHASE 2: Deep dive with context from Phase 1
phase2_prompt = f"""Based on this codebase map, trace the authentication flow.
Focus on: middleware, decorators, session management.

Previous findings (scratchpad):
{scratchpad}

Summarize discoveries in the same scratchpad format."""

# This is a SEPARATE context — no context degradation
phase2 = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=2048,
    messages=[{"role": "user", "content": phase2_prompt}]
)

# Update scratchpad with Phase 2 findings
scratchpad += "\\n\\n## Authentication Flow\\n"
scratchpad += phase2.content[0].text

print(f"[scratchpad] {len(scratchpad)} chars accumulated")

# State manifest for crash recovery
manifest = {
    "phases_completed": ["structure_map", "auth_flow"],
    "scratchpad_size": len(scratchpad),
    "next_phase": "trace_api_endpoints",
    "files_examined": 47,
    "key_findings": scratchpad.count("##")
}
print(f"[manifest] {manifest}")

# If session crashes, new agent loads manifest + scratchpad
# and continues from "trace_api_endpoints" phase`,
  },
  {
    id: '5-5',
    title: 'Human Review & Confidence Calibration',
    duration: '35 min',
    description: 'Design review systems with stratified sampling, field-level confidence scores, and calibrated thresholds. Understand why aggregate accuracy masks segment problems and how to route outputs for human review efficiently.',
    knowledge: [
      'Aggregate accuracy is dangerous: 97% overall may hide 60% accuracy on a specific document type. A system that\'s 99% accurate on invoices but 60% on receipts looks great in aggregate. Always validate by segment.',
      'Stratified random sampling for error rates: instead of randomly sampling all outputs, sample per segment (document type, field type, complexity level). This reveals segment-specific problems that aggregate metrics miss.',
      'Field-level confidence scores: instead of one confidence per document, assign confidence per extracted field. "Vendor: 0.95, Total: 0.7, Date: 0.4." Low-confidence fields route to human review while high-confidence fields auto-approve.',
      'Calibrate confidence with labeled validation sets: run the model on documents with known ground truth. Compare model confidence to actual accuracy. If the model says 0.9 confidence but is only right 70% of the time, the confidence is miscalibrated.',
      'Different fields need different review thresholds: "vendor name" at 0.8 confidence might be reliable enough. "payment amount" at 0.8 might still need review because the cost of error is higher. Set thresholds per field based on error impact.',
      'Prioritize limited reviewer capacity: not all outputs deserve equal review attention. Route high-risk fields (amounts, account numbers) to mandatory review. Low-risk fields (categories, sentiment) can auto-approve at lower confidence.',
      'Detect novel error patterns through ongoing stratified sampling: even after deployment, continue sampling. New document formats, changed layouts, or updated terminology can introduce new failure modes. Ongoing sampling catches these before they compound.',
      'The review cost tradeoff: 100% human review is accurate but expensive. 0% human review is cheap but risky. Stratified confidence-based routing finds the sweet spot: auto-approve confident extractions, route uncertain ones to humans.',
      'Validation set design: your labeled dataset must represent all segments proportionally. If 60% of real documents are invoices but only 10% of your validation set is invoices, your calibration will be wrong for the majority of production data.',
      'Common exam scenario: "Your extraction system has 97% accuracy. The team wants to automate everything." Answer: Validate by document type AND field segment first. 97% overall may mask serious problems on specific types.',
    ],
    skills: [
      'Design stratified sampling for accuracy measurement',
      'Implement field-level confidence scoring',
      'Calibrate confidence thresholds with validation sets',
      'Route outputs to human review based on confidence and risk',
    ],
    codeExample: `import anthropic
import json

client = anthropic.Anthropic()

# EXTRACTION with field-level confidence
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

# Extract with confidence scores
response = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=1024,
    tools=tools,
    tool_choice={"type": "tool", "name": "extract_invoice"},
    messages=[{"role": "user", "content": "Invoice from Acme... Total: $1,250"}]
)

data = next(b.input for b in response.content if b.type == "tool_use")
conf = data.get("confidence", {})

# CALIBRATED thresholds per field
THRESHOLDS = {
    "vendor": 0.7,   # Low risk — moderate threshold
    "total": 0.9,    # High risk — strict threshold
    "date": 0.8,     # Medium risk
}

# ROUTE: auto-approve, human review, or investigate
for field, threshold in THRESHOLDS.items():
    score = conf.get(field, 0)
    if score >= threshold:
        print(f"  [auto] {field}: {score:.2f} >= {threshold}")
    else:
        print(f"  [review] {field}: {score:.2f} < {threshold} → HUMAN REVIEW")

# STRATIFIED SAMPLING: measure per document type
doc_type_accuracy = {
    "invoices": 0.99,
    "receipts": 0.62,   # ← Hidden problem!
    "contracts": 0.95,
}
overall = sum(doc_type_accuracy.values()) / len(doc_type_accuracy)
print(f"\\nOverall: {overall:.0%} (hides 62% receipt accuracy!)")
print(f"Receipts: {doc_type_accuracy['receipts']:.0%} ← Needs attention")`,
  },
  {
    id: '5-6',
    title: 'Information Provenance & Uncertainty',
    duration: '30 min',
    description: 'Preserve source attribution through synthesis, handle conflicting sources, and represent uncertainty in reports. Understand why claim-source mappings are critical and how summarization destroys provenance.',
    knowledge: [
      'Source attribution is lost during summarization unless you explicitly maintain claim-source mappings. A fact like "revenue grew 12%" needs to carry its source (which document, which page, which date) through every synthesis step.',
      'Structured claim-source mappings: for each claim, store the source URL/document name, relevant excerpt, publication date, and confidence. This lets downstream consumers verify claims and understand data lineage.',
      'Conflicting sources: when two credible sources report different values, annotate the conflict with source attribution. Include both values with their sources. Do NOT arbitrarily pick one or average them.',
      'Temporal data: require publication/collection dates in all structured outputs. Different reporting periods often explain apparent contradictions — a Q4 2024 report vs an annual 2023 filing may both be correct for their respective periods.',
      'Distinguish well-established findings from contested ones. Render contested claims in a separate section with source annotations. Readers need to know which findings are solid and which are disputed.',
      'Render by content type: financial data renders best as tables, news as prose, technical specs as structured lists. Match the presentation format to the data type for maximum clarity.',
      'Subagents must preserve claim-source mappings through synthesis. The coordinator should never receive a bare fact without its source. If a subagent summarizes, it must carry forward the source annotations.',
      'Let the coordinator reconcile conflicts — do NOT resolve at the subagent level. A subagent reporting two conflicting revenue figures should pass both up, not pick one. The coordinator has full context to decide.',
      'Anti-pattern: averaging conflicting statistics. "Source A says 5.2M, Source B says 4.8M, so I will report 5.0M." This hides the conflict and produces a fabricated number. Instead: report both with attribution.',
      'Common exam scenario: "After summarizing three analyst reports, your synthesis agent reports revenue as $5.0M but none of the sources say exactly $5.0M." Answer: Lost provenance through averaging. Use claim-source mappings.',
    ],
    skills: [
      'Design claim-source mapping structures for multi-source synthesis',
      'Handle conflicting sources with annotation instead of averaging',
      'Require temporal metadata in all structured outputs',
      'Render contested vs established findings separately',
    ],
    codeExample: `import anthropic

client = anthropic.Anthropic()

# EXTRACTION with source attribution
tools = [{
    "name": "extract_financial_data",
    "input_schema": {
        "type": "object",
        "properties": {
            "claims": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "metric": {"type": "string"},
                        "value": {"type": "string"},
                        "source": {"type": "string"},
                        "date": {"type": "string"},
                        "excerpt": {"type": "string"}
                    }
                }
            }
        },
        "required": ["claims"],
        "additionalProperties": False
    }
}]

# Extract from multiple sources with provenance
sources = [
    ("SEC Filing Q4 2024", "Revenue for Q4 was $5.2M, up 12% YoY"),
    ("Annual Report 2024", "Full year revenue reached $18.4M"),
    ("Analyst Note Jan 2025", "We estimate Q4 revenue at $4.8M based on channel checks"),
]

all_claims = []
for source_name, text in sources:
    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1024,
        tools=tools,
        tool_choice={"type": "tool", "name": "extract_financial_data"},
        messages=[{"role": "user", "content": f"Source: {source_name}\\n\\n{text}"}]
    )
    data = next(b.input for b in response.content if b.type == "tool_use")
    for claim in data["claims"]:
        claim["source"] = source_name  # Attach provenance
        all_claims.append(claim)

# Detect conflicts (same metric, different values)
print("=== Claims with Provenance ===")
for c in all_claims:
    print(f"  {c['metric']}: {c['value']} (from {c['source']})")

# NEVER average conflicting values
# Instead: annotate the conflict and let coordinator decide`,
  },
  {
    id: '5-quiz',
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