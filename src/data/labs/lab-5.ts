const lab_5 = {
    id: 'lab-5',
    title: 'Effective Tool Design & tool_choice',
    domain: 'Domain 2 — Tool Design',
    examTopics: ['2.1 Tool Interfaces', '2.3 tool_choice'],
    difficulty: 'Intermediate',
    duration: '35 min',
    description: 'Design tools with clear descriptions, proper schemas, and learn how tool_choice controls when and how Claude invokes tools.',
    objectives: [
      'Write tool schemas with clear descriptions and examples',
      'Understand tool_choice: auto, any, tool, none',
      'See how tool descriptions affect Claude tool selection',
      'Test tool_choice modes with different prompts',
    ],
    setup: 'Python 3.10+ with anthropic SDK',
    steps: [
      'Define tools with rich descriptions and examples',
      'Test tool_choice="auto" (default)',
      'Test tool_choice={"type": "tool", "name": "X"} (force specific)',
      'Test tool_choice="none" (text only)',
    ],
    codeTemplate: `import anthropic
import json
import sys

client = anthropic.Anthropic()

print("=" * 60, file=sys.stderr)
print("🧪 LAB 5: Effective Tool Design & tool_choice", file=sys.stderr)
print("=" * 60, file=sys.stderr)

# --- Tool Definitions (GOOD vs BAD descriptions) ---

# BAD: Vague description
bad_search_tool = {
    "name": "search",
    "description": "Search for things",
    "input_schema": {
        "type": "object",
        "properties": {
            "query": {"type": "string"},
};
        "required": ["query"],
};
}

# GOOD: Clear description with when-to-use guidance
good_search_tool = {
    "name": "search_orders",
    "description": (
        "Search customer orders by various criteria. "
        "Use when: user asks about order status, tracking, history, or past purchases. "
        "Do NOT use for: product search (use search_products instead)."
    ),
    "input_schema": {
        "type": "object",
        "properties": {
            "customer_id": {
                "type": "string",
                "description": "Customer ID in format C00X (e.g., C001)",
};
            "status": {
                "type": "string",
                "description": "Filter by status: pending, shipped, delivered, cancelled",
                "enum": ["pending", "shipped", "delivered", "cancelled"],
};
};
        "required": ["customer_id"],
};
}

print("\\n📦 [SETUP] Tools defined:", file=sys.stderr)
print("   🔴 bad_search_tool: vague description", file=sys.stderr)
print("   🟢 good_search_tool: rich description with when-to-use guidance", file=sys.stderr)

ORDERS = {
    "C001": [{"id": "ORD-1001", "status": "shipped", "total": 149.99}],
}

def execute_tool(name: str, inputs: dict) -> str:
    print(f"\\n🔧 [TOOL EXEC] {name}({json.dumps(inputs)})", file=sys.stderr)
    if name == "search_orders":
        cid = inputs.get("customer_id", "")
        if cid in ORDERS:
            result = json.dumps(ORDERS[cid])
            print(f"   ✅ Found {len(ORDERS[cid])} order(s)", file=sys.stderr)
            return result
    print(f"   ❌ No results", file=sys.stderr)
    return json.dumps([])


def test_tool_choice(prompt: str, tool_choice_mode: str | dict, tools: list):
    """Test a specific tool_choice configuration."""
    mode_str = json.dumps(tool_choice_mode) if isinstance(tool_choice_mode, dict) else tool_choice_mode
    print(f"\\n{'═' * 60}", file=sys.stderr)
    print(f"🧪 [TEST] tool_choice={mode_str}", file=sys.stderr)
    print(f"   📝 Prompt: \\"{prompt}\\"", file=sys.stderr)

    print(f"   📤 [REQUEST] Sending to API...", file=sys.stderr)
    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=512,
        tools=tools,
        tool_choice=tool_choice_mode,
        messages=[{"role": "user", "content": prompt}],
    )

    print(f"   📥 [RESPONSE] stop_reason={response.stop_reason}", file=sys.stderr)
    for i, block in enumerate(response.content):
        if block.type == "text":
            print(f"   📝 Text: {block.text[:100]}...", file=sys.stderr)
        elif block.type == "tool_use":
            print(f"   🔧 Tool call: {block.name}({json.dumps(block.input)})", file=sys.stderr)
            result = execute_tool(block.name, block.input)
            print(f"   📋 Tool result: {result[:100]}", file=sys.stderr)


# --- Test different tool_choice modes ---
if __name__ == "__main__":
    print("\\n" + "🎯" * 20, file=sys.stderr)
    print("Testing tool_choice modes with GOOD tool descriptions", file=sys.stderr)
    print("🎯" * 20, file=sys.stderr)

    # Mode 1: auto (default — Claude decides)
    test_tool_choice(
        "Where is my order? My customer ID is C001",
        "auto",
        [good_search_tool],
    )

    # Mode 2: any (must use a tool, any tool)
    test_tool_choice(
        "Tell me about the weather",
        "any",
        [good_search_tool],
    )

    # Mode 3: none (text only, no tools)
    test_tool_choice(
        "Where is my order? My customer ID is C001",
        "none",
        [good_search_tool],
    )

    # Mode 4: forced specific tool
    test_tool_choice(
        "Tell me about the weather",
        {"type": "tool", "name": "search_orders"},`,
};

export default lab_5;
