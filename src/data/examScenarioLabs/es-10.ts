import type { ScenarioLab } from './types';

const es_10: ScenarioLab = {
    id: 'es-10',
    title: 'tool_choice — Force Refund Tool Usage',
    domain: 'Domain 2 — Tool Design & MCP',
    domainNum: 2,
    scenario: 'Claude needs to ALWAYS use a tool when processing refund requests, but you want it to pick the right refund tool (partial vs full). Which tool_choice setting forces tool usage while letting Claude pick which one?',
    examTopic: '2.3 Tool Distribution & tool_choice',
    difficulty: 'Easy',
    codeTemplate: `import anthropic
import json

client = anthropic.Anthropic()

# ============================================
# EXAM SCENARIO: tool_choice modes demo
# ============================================
# Force tool usage but let Claude pick WHICH tool → tool_choice: "any"
# ============================================

refund_tools = [
    {
        "name": "process_full_refund",
        "description": "Process a FULL refund for an order. Use when customer wants to return everything.",
        "input_schema": {
            "type": "object",
            "properties": {
                "order_id": {"type": "string"},
                "reason": {"type": "string"},
            },
            "required": ["order_id", "reason"],
        },
    },
    {
        "name": "process_partial_refund",
        "description": "Process a PARTIAL refund for specific items. Use when customer wants to return some items.",
        "input_schema": {
            "type": "object",
            "properties": {
                "order_id": {"type": "string"},
                "items": {"type": "array", "items": {"type": "string"}},
                "reason": {"type": "string"},
            },
            "required": ["order_id", "items", "reason"],
        },
    },
]

MODES = {
    "auto": {"type": "auto"},          # Claude decides — may or may not call a tool
    "any": {"type": "any"},            # MUST call at least one tool — Claude picks which
    "tool": {"type": "tool", "name": "process_full_refund"},  # MUST call this specific tool
    "none": {"type": "none"},          # Must NOT call any tools
}


def test_mode(mode_name: str, query: str) -> str:
    """Test each tool_choice mode."""
    print(f"\\n{'─'*50}")
    print(f"🧪 tool_choice: {mode_name}")
    print(f"   Query: \\"{query}\\"")

    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=256,
        tools=refund_tools,
        tool_choice=MODES[mode_name],
        messages=[{"role": "user", "content": query}],
    )

    tool_calls = [b for b in response.content if b.type == "tool_use"]
    text_blocks = [b for b in response.content if b.type == "text"]

    if tool_calls:
        for tc in tool_calls:
            print(f"   ✅ Tool called: {tc.name}({json.dumps(tc.input)})")
    else:
        print(f"   📝 Text response: {text_blocks[0].text[:100] if text_blocks else 'none'}")

    return "tool" if tool_calls else "text"


if __name__ == "__main__":
    query = "I want to return the blue shirt from order ORD-100 but keep the pants"

    print("=" * 60)
    print(f"QUERY: \\"{query}\\"")
    print("Expected: partial refund (keeping pants, returning shirt)")
    print("=" * 60)

    test_mode("auto", query)   # Might call tool, might not
    test_mode("any", query)    # MUST call a tool → picks the right one
    test_mode("tool", query)   # FORCED to call full_refund (wrong tool!)
    test_mode("none", query)   # Can't call any tool → text only

    print(f"\\n{'═'*60}")
    print("EXAM KEY: tool_choice modes")
    print("  auto  → Claude decides (may skip tools)")
    print("  any   → MUST use a tool, Claude picks which ← ANSWER for this scenario")
    print("  tool  → MUST use a SPECIFIC tool (forced)")
    print("  none  → Must NOT use tools")
    print(f"{'═'*60}")`,
    expectedOutput: `auto  → calls process_partial_refund ✅ (or might not call anything)
any   → calls process_partial_refund ✅ (forced to use a tool, picks correctly)
tool  → calls process_full_refund ❌ (forced wrong tool!)
none  → text response only (no tool)`,
    brokenCode: `# ❌ BROKEN: tool_choice="none" when user wants a tool action
# 🐛 BUG: "none" means Claude CANNOT call any tool!
import anthropic
import json

client = anthropic.Anthropic()

refund_tool = {
    "name": "process_refund",
    "description": "Process a customer refund.",
    "input_schema": {
        "type": "object",
        "properties": {
            "order_id": {"type": "string", "description": "Order ID"},
            "amount": {"type": "number", "description": "Refund amount"},
            "reason": {"type": "string", "description": "Refund reason"}
        },
        "required": ["order_id", "amount", "reason"],
    },
}

def execute_tool(name: str, inputs: dict) -> str:
    print(f"🔧 [TOOL EXEC] {name}({json.dumps(inputs)})")
    if name == "process_refund":
        return json.dumps({"status": "refunded", "refund_id": "REF-12345"})
    return json.dumps({"error": f"Unknown tool: {name}"})


def run_agent(prompt: str) -> str:
    """🐛 BROKEN: tool_choice='none' blocks all tool usage."""
    messages = [{"role": "user", "content": prompt}]

    print(f"🚀 [AGENT START] Prompt: \\"{prompt}\\"")

    for turn in range(5):
        print(f"\\n📤 [TURN {turn + 1}]")

        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1024,
            tools=[refund_tool],
            tool_choice={"type": "none"},  # 🐛 BUG: "none" = Claude CANNOT call tools!
            messages=messages,
        )

        messages.append({"role": "assistant", "content": response.content})

        if response.stop_reason == "end_turn":
            text = next((b.text for b in response.content if b.type == "text"), "")
            print(f"✅ [DONE] {text[:200]}...")
            return text

        # This code is never reached because tool_choice="none"!
        print(f"   🐛 This line is unreachable!")

    return "Agent hit turn limit"


if __name__ == "__main__":
    # User explicitly wants a refund (tool action), but tool_choice="none" blocks it!
    result = run_agent("I want a refund for order ORD-789. Amount is R$150. Reason: defective product.")
    print(f"\\n📋 Result: {result}")
    print("\\n🐛 Result: Claude explains refunds but never processes one!")
    print("🐛 Should use tool_choice='auto' or tool_choice=dict(type="tool", name="process_refund")")
`,
    hints: ["tool_choice=\"none\" disables ALL tool usage.", "Use \"auto\" (default) for normal behavior.", "Use {\"type\": \"tool\", \"name\": \"X\"} to force a specific tool."],
    fixes: ["Use tool_choice=\"auto\" to let Claude decide when to use tools.", "Use forced tool choice only when you want to guarantee a specific tool.", "Never use \"none\" when user intent clearly requires a tool action."],
  };

export default es_10;
