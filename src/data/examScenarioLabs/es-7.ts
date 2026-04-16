import type { ScenarioLab } from './types';

const es_7: ScenarioLab = {
    id: 'es-7',
    title: 'Error Response — Empty Array on Database Timeout',
    domain: 'Domain 2 — Tool Design & MCP',
    domainNum: 2,
    scenario: 'Your agent returns [] with isError: false when the database times out. Users get "you have no orders" when they actually have 50 orders. Fix the error handling to distinguish "no results" from "operation failed".',
    examTopic: '2.2 Structured Error Responses',
    difficulty: 'Medium',
    codeTemplate: `import anthropic
import json
import random

client = anthropic.Anthropic()

# ============================================
# EXAM SCENARIO: [] on error = silent failure
# ============================================
# BROKEN: Returns [] with isError: false when DB times out
# FIXED: Returns isError: true with error details and recovery suggestions
# ============================================

search_tool = {
    "name": "search_orders",
    "description": "Search customer orders",
    "input_schema": {
        "type": "object",
        "properties": {"customer_id": {"type": "string"}},
        "required": ["customer_id"],
    },
}


def execute_tool_broken(name: str, inputs: dict) -> dict:
    """❌ BROKEN: Returns [] on database timeout."""
    print(f"\\n🔧 [TOOL EXEC] {name}({json.dumps(inputs)})")

    # Simulate: 50% chance of DB timeout
    if random.random() < 0.5:
        print(f"   ⚠️  DB TIMEOUT! But returning [] with isError: false...")
        return {"content": json.dumps([]), "is_error": False}  # BROKEN!
    else:
        orders = [{"id": "ORD-001", "total": 99.99}, {"id": "ORD-002", "total": 149.50}]
        print(f"   ✅ Found {len(orders)} orders")
        return {"content": json.dumps(orders), "is_error": False}


def execute_tool_fixed(name: str, inputs: dict) -> dict:
    """✅ FIXED: Returns proper error on database timeout."""
    print(f"\\n🔧 [TOOL EXEC] {name}({json.dumps(inputs)})")

    if random.random() < 0.5:
        print(f"   ❌ DB TIMEOUT! Returning isError: true with details...")
        return {
            "content": json.dumps({
                "error_type": "database_timeout",
                "message": "Order database did not respond within 5 seconds",
                "suggestion": "Please try again in a few seconds. Your orders are safe.",
            }),
            "is_error": True,  # ✅ CORRECT!
        }
    else:
        orders = [{"id": "ORD-001", "total": 99.99}, {"id": "ORD-002", "total": 149.50}]
        print(f"   ✅ Found {len(orders)} orders")
        return {"content": json.dumps(orders), "is_error": False}


def run_with_tool_result_handling(prompt: str, use_fixed: bool = True) -> str:
    """Agent loop demonstrating proper error handling."""
    messages = [{"role": "user", "content": prompt}]
    executor = execute_tool_fixed if use_fixed else execute_tool_broken
    label = "FIXED" if use_fixed else "BROKEN"

    print(f"\\n🚀 [AGENT - {label}] \\"{prompt}\\"")

    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=512,
        tools=[search_tool],
        messages=messages,
    )

    for block in response.content:
        if block.type == "tool_use":
            print(f"   Claude called: {block.name}")
            result = executor(block.name, block.input)

            tool_result = {
                "type": "tool_result",
                "tool_use_id": block.id,
                "content": result["content"],
            }
            if result.get("is_error"):
                tool_result["is_error"] = True
                print(f"   🚨 isError: true → Claude knows the operation FAILED")
            else:
                print(f"   ✅ isError: false → Claude knows the operation SUCCEEDED")

            messages.append({"role": "assistant", "content": response.content})
            messages.append({"role": "user", "content": [tool_result]})

            response2 = client.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=256,
                tools=[search_tool],
                messages=messages,
            )
            text = next((b.text for b in response2.content if b.type == "text"), "")
            print(f"\\n📋 Claude's response: {text[:200]}")
            return text

    return "No tool call"


if __name__ == "__main__":
    print("=" * 60)
    print("TEST 1: ❌ BROKEN — [] on timeout")
    print("=" * 60)
    run_with_tool_result_handling("Show me my recent orders", use_fixed=False)

    print(f"\\n\\n{'='*60}")
    print("TEST 2: ✅ FIXED — isError: true on timeout")
    print("=" * 60)
    run_with_tool_result_handling("Show me my recent orders", use_fixed=True)

    print(f"\\n{'═'*60}")
    print("EXAM KEY POINTS:")
    print("  isError: true is MANDATORY for all failures")
    print("  [] ≠ error. 'No results found' ≠ 'search failed'")
    print("  Include: error_type + message + recovery suggestion")
    print(f"{'═'*60}")`,
    expectedOutput: `BROKEN: Claude says "You have no orders" (WRONG — DB just timed out!)
FIXED:  Claude says "I had trouble fetching your orders, please try again" (CORRECT)`,
    brokenCode: `# ❌ BROKEN: Unstructured error response
# 🐛 BUG: Errors are plain strings — Claude cannot self-correct
import anthropic
import json

client = anthropic.Anthropic()

api_tool = {
    "name": "call_api",
    "description": "Call an external API endpoint.",
    "input_schema": {
        "type": "object",
        "properties": {
            "endpoint": {"type": "string", "description": "API endpoint"},
            "method": {"type": "string", "description": "HTTP method"},
            "params": {"type": "object", "description": "Query parameters"}
        },
        "required": ["endpoint", "method"],
    },
}

def execute_tool(name: str, inputs: dict) -> str:
    print(f"🔧 [TOOL EXEC] {name}({json.dumps(inputs)[:100]}...)")
    if name == "call_api":
        endpoint = inputs.get("endpoint", "")
        if "invalid" in endpoint:
            # 🐛 Plain string error — Claude cannot self-correct!
            return "Error: something went wrong"  # 🐛 Same vague error always!
        elif "notfound" in endpoint:
            # 🐛 Same vague error for different failure modes!
            return "Error: something went wrong"  # 🐛 Is it 404? 403? 500?
        else:
            return json.dumps({"status": "ok", "data": {"result": "success"}})
    return json.dumps({"error": f"Unknown tool: {name}"})


def run_agent(prompt: str) -> str:
    """🐛 BROKEN: Unstructured error responses prevent self-correction."""
    messages = [{"role": "user", "content": prompt}]

    print(f"🚀 [AGENT START] Prompt: \\"{prompt}\\"")

    for turn in range(10):
        print(f"\\n📤 [TURN {turn + 1}]")

        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1024,
            tools=[api_tool],
            messages=messages,
        )

        messages.append({"role": "assistant", "content": response.content})

        if response.stop_reason == "end_turn":
            text = next((b.text for b in response.content if b.type == "text"), "")
            return text

        tool_results = []
        for block in response.content:
            if block.type == "tool_use":
                output = execute_tool(block.name, block.input)
                # 🐛 No structured error — is_error is always False
                tool_results.append({
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": output,  # 🐛 "Error: something went wrong" as success!
                })

        if tool_results:
            messages.append({"role": "user", "content": tool_results})

    return "Agent hit turn limit"


if __name__ == "__main__":
    result = run_agent("Call the /api/v1/invalid endpoint and get the data")
    print(f"\\n📋 Result: {result}")
    print("\\n🐛 PROBLEM: Claude sees 'Error: something went wrong' as a successful response!")
    print("🐛 Should return structured error with is_error=True and actionable info")
`,
    hints: ["Error responses should be structured JSON with isError: true.", "Include hints about what went wrong and how to fix it.", "Different error types need different messages for recovery."],
    fixes: ["Return structured errors: {\"error\": \"...\", \"isError\": true, \"hint\": \"...\"}.", "Include retry_suggestion so Claude knows what to do next.", "Distinguish: not_found vs timeout vs rate_limited."],
  };

export default es_7;
