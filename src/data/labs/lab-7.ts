const lab_7 = {
    id: 'lab-7',
    title: 'Structured Error Handling & Recovery',
    domain: 'Domain 2 — Tool Design',
    examTopics: ['2.2 Structured Error Responses'],
    difficulty: 'Advanced',
    duration: '35 min',
    description: 'Design error responses that enable Claude to recover intelligently — with isError flags, retry hints, and contextual guidance.',
    objectives: [
      'Return structured error objects with isError flag',
      'Include retry hints in error responses',
      'Design errors that enable Claude to self-correct',
      'Compare broken vs. fixed error handling patterns',
    ],
    setup: 'Python 3.10+ with anthropic SDK',
    steps: [
      'Define error response schemas',
      'Implement broken error handling (plain strings)',
      'Implement structured error handling (with isError)',
      'Compare Claude recovery behavior',
    ],
    codeTemplate: `import anthropic
import json
import sys
import time

client = anthropic.Anthropic()

print("=" * 60, file=sys.stderr)
print("🧪 LAB 7: Structured Error Handling & Recovery", file=sys.stderr)
print("=" * 60, file=sys.stderr)

# --- Tool Definitions ---
order_tool = {
    "name": "get_order",
    "description": "Look up an order by ID. Args: order_id (format: ORD-XXXX)",
    "input_schema": {
        "type": "object",
        "properties": {
            "order_id": {"type": "string", "description": "Order ID (e.g., ORD-1001)"},
};
        "required": ["order_id"],
};
}

ORDERS = {
    "ORD-1001": {"status": "shipped", "total": 149.99},
    "ORD-1002": {"status": "pending", "total": 59.50},
}

# --- BAD: Unstructured error (string only) ---
def get_order_broken(order_id: str) -> str:
    print(f"\\n🔧 [TOOL EXEC - BROKEN] get_order('{order_id}')", file=sys.stderr)
    if order_id not in ORDERS:
        error = "Error: not found"
        print(f"   ❌ BAD ERROR: '{error}' (no context, no hint)", file=sys.stderr)
        return error
    result = json.dumps(ORDERS[order_id])
    print(f"   ✅ Found: {result}", file=sys.stderr)
    return result


# --- GOOD: Structured error with recovery hints ---
def get_order_fixed(order_id: str) -> str:
    print(f"\\n🔧 [TOOL EXEC - FIXED] get_order('{order_id}')", file=sys.stderr)
    if order_id not in ORDERS:
        error = json.dumps({
            "error": f"Order '{order_id}' not found",
            "isError": True,
            "hint": "Check the order ID format (should be ORD-XXXX). Available: ORD-1001, ORD-1002",
            "retry_suggestion": "Ask the user to confirm their order ID",
        })
        print(f"   ⚠️  STRUCTURED ERROR with hint:", file=sys.stderr)
        print(f"      isError: True", file=sys.stderr)
        print(f"      hint: Available orders listed", file=sys.stderr)
        print(f"      retry: Ask user to confirm ID", file=sys.stderr)
        return error
    result = json.dumps(ORDERS[order_id])
    print(f"   ✅ Found: {result}", file=sys.stderr)
    return result


def run_with_errors(prompt: str, use_fixed: bool = True):
    mode = "FIXED (structured errors)" if use_fixed else "BROKEN (plain strings)"
    print(f"\\n{'═' * 60}", file=sys.stderr)
    print(f"🧪 [TEST] Using {mode}", file=sys.stderr)
    print(f"   📝 Prompt: \\"{prompt}\\"", file=sys.stderr)

    messages = [{"role": "user", "content": prompt}]

    for turn in range(5):
        print(f"\\n🔄 [LOOP TURN {turn + 1}/5]", file=sys.stderr)
        print(f"   📤 [REQUEST] Sending to API...", file=sys.stderr)

        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=512,
            tools=[order_tool],
            messages=messages,
        )

        print(f"   📥 [RESPONSE] stop_reason={response.stop_reason}", file=sys.stderr)
        messages.append({"role": "assistant", "content": response.content})

        if response.stop_reason == "end_turn":
            text = next((b.text for b in response.content if b.type == "text"), "")
            print(f"   🛑 Agent finished", file=sys.stderr)
            print(f"   📋 [FINAL] {text[:150]}...", file=sys.stderr)
            return text

        tool_results = []
        for block in response.content:
            if block.type == "tool_use":
                print(f"   🔧 Tool call: {block.name}({json.dumps(block.input)})", file=sys.stderr)
                if use_fixed:
                    output = get_order_fixed(block.input["order_id"])
                else:
                    output = get_order_broken(block.input["order_id"])
                tool_results.append({
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": output,
                })

        messages.append({"role": "user", "content": tool_results})

    return "Max turns reached."


if __name__ == "__main__":
    # Test with invalid order ID to see error recovery
    run_with_errors("What's the status of order ORD-9999?", use_fixed=True)

    print(f"\\n{'═' * 60}")
    print(f"📋 Compare: structured errors help Claude recover gracefully!")
    print(f"{'═' * 60}")`,
};

export default lab_7;
