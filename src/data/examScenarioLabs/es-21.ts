import type { ScenarioLab } from './types';

const es_21: ScenarioLab = {
    id: 'es-21',
    title: 'Context Edges — Lost in the Middle After 20 Turns',
    domain: 'Domain 5 — Safety & Production',
    domainNum: 5,
    scenario: 'After 20 turns, Claude forgets the customer\'s original order total ($847.50). The critical data was mentioned in turn 3 — buried in the middle of context. Fix by pinning critical data at context edges.',
    examTopic: '5.1 Context Management',
    difficulty: 'Medium',
    codeTemplate: `import anthropic
import json

client = anthropic.Anthropic()

# ============================================
# EXAM SCENARIO: Lost in the middle
# ============================================
# After 20 turns, data from turn 3 gets "lost in the middle"
# FIX: Pin critical data at START and END of context
# ============================================

def simulate_lost_in_middle():
    """Demonstrate the lost-in-the-middle effect and the fix."""
    print("=" * 60)
    print("PROBLEM: 'Lost in the Middle' Effect")
    print("=" * 60)
    print()
    print("Context window after 20 turns:")
    print()
    print("  [START] ← Claude attends strongly here")
    print("  Turn 1:  Greeting")
    print("  Turn 2:  'I need help with order #123'")
    print("  Turn 3:  'The total was $847.50'        ← CRITICAL DATA")
    print("  Turn 4:  Discussion about shipping")
    print("  Turn 5:  'Can you check the delivery date?'")
    print("  ...")
    print("  Turn 18: More questions")
    print("  Turn 19: More questions")
    print("  Turn 20: 'What was my original total again?'")
    print("  [END]   ← Claude attends strongly here")
    print()
    print("  ⚠️  Turn 3 ($847.50) is BURIED in the middle")
    print("  Claude might say $847 or $850 — approximation error!")

    print(f"\\n\\n{'='*60}")
    print("FIX 1: State tracking (files > conversation memory)")
    print("=" * 60)
    print()
    print("  Instead of relying on conversation memory:")
    print("  → Write critical data to a STATE FILE after each step")
    print("  → Reference the state file when needed")
    print()
    print("  state = {")
    print('    "order_id": "#123",')
    print('    "total": 847.50,')
    print('    "customer": "john@email.com",')
    print('    "status": "shipped"')
    print("  }")

    print(f"\\n{'='*60}")
    print("FIX 2: Pin critical data at context EDGES")
    print("=" * 60)

    # Demonstrate with actual API call
    CRITICAL_DATA = "ORDER SUMMARY: Order #123, Total: $847.50, Customer: john@email.com"

    prompt = f"""{CRITICAL_DATA}

The customer has been chatting for 20 turns about shipping, delivery dates, and product details.

Based on the pinned order summary above, what was the customer's original order total?"""

    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=100,
        messages=[{"role": "user", "content": prompt}],
    )
    result = next(b.text for b in response.content if b.type == "text")
    print(f"\\n  With pinned data at context START:")
    print(f"  Claude says: {result}")
    print(f"  ✅ Correct — data is at the edge, not buried")

    print(f"\\n{'═'*60}")
    print("EXAM KEY:")
    print("  'Lost in middle' = Claude attends less to middle content")
    print("  Pin critical data at START and END of context")
    print("  State tracking (files) > conversation memory")
    print("  Scratchpad files for multi-phase work")
    print(f"{'═'*60}")


if __name__ == "__main__":
    simulate_lost_in_middle()`,
    expectedOutput: `Without pinning: Claude might say ~$850 (approximation)
With pinning: Claude says $847.50 (exact)`,
    brokenCode: `# ❌ BROKEN: Context grows forever
# 🐛 BUG: After 20+ turns: 50K+ tokens, loses middle messages
import anthropic
import json

client = anthropic.Anthropic()

search_tool = {
    "name": "search",
    "description": "Search the knowledge base.",
    "input_schema": {
        "type": "object",
        "properties": {"query": {"type": "string"}},
        "required": ["query"],
    },
}

def execute_tool(name: str, inputs: dict) -> str:
    return json.dumps({"results": f"Info about: {inputs['query']}"})


def run_agent_broken(prompt: str) -> str:
    """🐛 BROKEN: Context grows without summarization or pruning."""
    messages = [{"role": "user", "content": prompt}]

    print(f"🚀 [AGENT START] Long conversation simulation")

    for turn in range(25):  # 🐛 25 turns — no context management!
        context_tokens = len(json.dumps(messages)) // 4
        print(f"\\n📤 [TURN {turn + 1}] ~{context_tokens} tokens in context")

        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1024,
            tools=[search_tool],
            messages=messages,  # 🐛 Full history — grows every turn!
        )

        messages.append({"role": "assistant", "content": response.content})

        if response.stop_reason == "end_turn":
            text = next((b.text for b in response.content if b.type == "text"), "")
            # 🐛 After 20+ turns: 50K+ tokens, loses middle messages
            return text

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
            messages.append({"role": "user", "content": tool_results})

        # 🐛 No summarization step
        # 🐛 No message pruning
        # 🐛 No sliding window
        if context_tokens > 100000:
            print("   ⚠️  Context exceeds 100K tokens!")

    return "Agent hit turn limit"


if __name__ == "__main__":
    result = run_agent_broken("Help me research Python web frameworks")
    print(f"\\n📋 Result: {result[:200]}...")
    print("\\n🐛 After 20+ turns: 50K+ tokens, loses middle messages")
    print("🐛 Should implement: message pruning, summarization, or sliding window")
`,
    hints: ["\"Lost in the middle\": LLMs recall start/end, forget the middle.", "Summarize old messages instead of keeping them all.", "Consider a sliding window or periodic context compaction."],
    fixes: ["Implement compaction: summarize messages older than N turns.", "Keep recent turns verbatim, compress older into summary.", "Monitor token count and trigger compaction before limits."],
  };

export default es_21;
