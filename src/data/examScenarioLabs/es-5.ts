import type { ScenarioLab } from './types';

const es_5: ScenarioLab = {
    id: 'es-5',
    title: 'Session State — Stale Tool Results After 50+ Turns',
    domain: 'Domain 1 — Agentic Engineering',
    domainNum: 1,
    scenario: 'After a long session (50+ turns), Claude starts hallucinating old tool results. The session context has grown too large and tool outputs from early turns have been truncated. Implement the correct recovery strategy.',
    examTopic: '1.7 Session State',
    difficulty: 'Advanced',
    codeTemplate: `import anthropic
import json

client = anthropic.Anthropic()

# ============================================
# EXAM SCENARIO: Stale tool results in long sessions
# ============================================
# PROBLEM: After 50+ turns, early tool results get truncated/lost.
# Claude starts making up (hallucinating) the old results.
# FIX: Fresh session + injected summary of key findings.
# ============================================

def summarize_findings(messages: list) -> str:
    """Extract key findings from conversation into a compact summary."""
    print(f"\\n📝 [SUMMARY] Compacting {len(messages)} messages into summary...")

    findings = []
    for msg in messages:
        if isinstance(msg.get("content"), str):
            findings.append(msg["content"][:200])
        elif isinstance(msg.get("content"), list):
            for block in msg["content"]:
                if isinstance(block, dict) and block.get("type") == "tool_result":
                    findings.append(f"[Tool Result] {str(block.get('content', ''))[:150]}")

    # Ask Claude to summarize the findings
    summary_prompt = f"Summarize these key findings in 3-4 bullet points. Be specific with numbers:\\n\\n" + "\\n".join(findings[-10:])

    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=256,
        messages=[{"role": "user", "content": summary_prompt}],
    )
    summary = next(b.text for b in response.content if b.type == "text")
    print(f"   ✅ Summary created ({len(summary)} chars)")
    print(f"   Preview: {summary[:150]}...")
    return summary


def run_session_with_recovery(prompt: str, turns_before_recovery: int = 3) -> str:
    """
    Demonstrates the 3 session strategies:
    1. --resume: for valid, recent context
    2. Fresh + summary: for stale/truncated tool results
    3. fork_session: for parallel exploration
    """
    messages = [{"role": "user", "content": prompt}]
    print(f"🚀 [SESSION START] \\"{prompt}\\"")
    print(f"   Recovery threshold: {turns_before_recovery} turns")

    for turn in range(turns_before_recovery + 2):
        print(f"\\n{'═'*60}")
        print(f"📤 [TURN {turn + 1}] Messages in context: {len(messages)}")

        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=256,
            messages=messages,
        )
        messages.append({"role": "assistant", "content": response.content})
        text = next((b.text for b in response.content if b.type == "text"), "")

        if response.stop_reason == "end_turn":
            print(f"📥 [RESPONSE] {text[:100]}")
            break

    # SIMULATE: Session is now "stale" — too many turns
    print(f"\\n{'═'*60}")
    print(f"⚠️  [STALE SESSION] {len(messages)} messages accumulated")
    print(f"   Early tool results may be truncated in context window")
    print(f"   Claude might hallucinate old data")

    # ✅ STRATEGY: Fresh session + injected summary
    print(f"\\n🔄 [RECOVERY] Starting FRESH session with summary...")
    summary = summarize_findings(messages)

    fresh_messages = [
        {"role": "user", "content": f"Previous session summary:\\n{summary}\\n\\nContinue from here. What's the next step?"}
    ]
    print(f"   Fresh context: {len(fresh_messages)} messages (vs {len(messages)} old)")

    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=256,
        messages=fresh_messages,
    )
    fresh_result = next(b.text for b in response.content if b.type == "text")

    print(f"\\n📋 [FRESH SESSION RESULT]\\n{fresh_result}")

    print(f"\\n{'═'*60}")
    print("SESSION STATE STRATEGIES (EXAM CHEAT SHEET):")
    print("  --resume         → Context is still valid and recent")
    print("  fresh + summary  → Tool results are stale/truncated")
    print("  fork_session     → Parallel exploration (doesn't pollute main)")
    print("  Pin critical data → Use immutable blocks at context edges")
    print(f"{'═'*60}")
    return fresh_result


if __name__ == "__main__":
    run_session_with_recovery(
        "Analyze the performance metrics for Q1, Q2, and Q3 of 2024",
        turns_before_recovery=3
    )`,
    expectedOutput: `⚠️  [STALE SESSION] 8 messages accumulated
🔄 [RECOVERY] Starting FRESH session with summary...
   ✅ Summary created (180 chars)
   Fresh context: 1 messages (vs 8 old)
📋 [FRESH SESSION RESULT]
Based on the Q1-Q3 analysis summary, I recommend focusing on...`,
    brokenCode: `# ❌ BROKEN: Unbounded session state
# 🐛 BUG: self.messages grows forever — no pruning, no summarization
import anthropic
import json

client = anthropic.Anthropic()

search_tool = {
    "name": "search",
    "description": "Search the knowledge base.",
    "input_schema": {
        "type": "object",
        "properties": {
            "query": {"type": "string", "description": "Search query"}
        },
        "required": ["query"],
    },
}

def execute_tool(name: str, inputs: dict) -> str:
    print(f"🔧 [TOOL EXEC] {name}({json.dumps(inputs)})")
    return json.dumps({"results": f"Found info about: {inputs['query']}"})


class BrokenSessionAgent:
    """🐛 BROKEN: Session state grows without bound."""
    def __init__(self):
        self.messages = []  # 🐛 Grows unbounded!
        self.turn_count = 0

    def chat(self, user_input: str) -> str:
        self.messages.append({"role": "user", "content": user_input})
        self.turn_count += 1

        print(f"\\n🚀 [TURN {self.turn_count}] Context size: {len(self.messages)} messages")
        print(f"   ⚠️  Estimated tokens: ~{len(json.dumps(self.messages)) // 4}")

        # 🐛 No pruning, no summarization, no context window management
        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1024,
            tools=[search_tool],
            messages=self.messages,  # 🐛 Full history every time!
        )

        self.messages.append({"role": "assistant", "content": response.content})

        if response.stop_reason == "end_turn":
            text = next((b.text for b in response.content if b.type == "text"), "")
            return text

        # Process tool calls
        tool_results = []
        for block in response.content:
            if block.type == "tool_use":
                output = execute_tool(block.name, block.input)
                tool_results.append({
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": output,
                })

        if tool_results:
            self.messages.append({"role": "user", "content": tool_results})

        # 🐛 After 50+ turns: stale tool results from hours ago still in context
        print(f"   ⚠️  Messages in history: {len(self.messages)}")
        print(f"   ⚠️  No pruning mechanism!")

        return "Tool call completed"


if __name__ == "__main__":
    agent = BrokenSessionAgent()

    # Simulate a long conversation
    queries = [
        "Search for Python best practices",
        "Now search for async patterns",
        "What about error handling?",
        "Search for testing strategies",
        "Now find deployment guides",
    ]

    for q in queries:
        print(f"\\n{'='*60}")
        print(f"User: {q}")
        result = agent.chat(q)
        print(f"Agent: {result[:100]}...")

    print(f"\\n{'='*60}")
    print(f"🐛 Final state: {len(agent.messages)} messages in history")
    print(f"🐛 No context window management — will eventually hit token limit!")
`,
    hints: ["Session state should be periodically pruned, not accumulated forever.", "Stale tool results from earlier turns can confuse Claude.", "Consider a recovery threshold: after N turns, summarize and reset."],
    fixes: ["Implement session recovery: summarize old messages after a threshold.", "After ~20 turns, compact history into a summary message.", "Store session state externally for persistence and resumption."],
};

export default es_5;
