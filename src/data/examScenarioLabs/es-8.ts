import type { ScenarioLab } from './types';

const es_8: ScenarioLab = {
    id: 'es-8',
    title: 'Tool Distribution — 30 Tools, 40% Wrong Calls',
    domain: 'Domain 2 — Tool Design & MCP',
    domainNum: 2,
    scenario: 'You have 30 tools for an enterprise system. Claude calls the wrong tool ~40% of the time. Adding a semantic tool router with top-5 selection fixes it.',
    examTopic: '2.3 Tool Distribution',
    difficulty: 'Advanced',
    codeTemplate: `import anthropic
import json

client = anthropic.Anthropic()

# ============================================
# EXAM SCENARIO: Too many tools → wrong selection
# ============================================
# 30 tools → 40% wrong calls
# Fix: Add a router that selects top 4-5 tools per request
# ============================================

# Simulate 30 tools (abbreviated for clarity)
ALL_TOOLS = [
    {"name": f"tool_{i}", "description": f"Enterprise tool #{i} for {cat}"}
    for i, cat in enumerate([
        "user management", "order processing", "inventory tracking",
        "payment processing", "shipping logistics", "customer support",
        "reporting", "analytics", "notifications", "authentication",
        "billing", "refunds", "coupons", "reviews", "catalog",
        "search", "recommendations", "cart", "wishlist", "comparison",
        "loyalty", "returns", "exchanges", "warranty", "installation",
        "subscriptions", "gift cards", "tax calculation", "address validation", "fraud detection",
    ], 1)
]

ROUTER_PROMPT = """You are a tool router. Given a user request, select the 4-5 most relevant tools from the available list.

Available tools:
{tool_list}

User request: {request}

Return ONLY a JSON array of tool names, e.g. ["tool_1", "tool_5", "tool_12"]"""


def route_tools(request: str, all_tools: list) -> list:
    """Route: select top 4-5 tools per request using semantic selection."""
    print(f"\\n🧭 [ROUTER] Selecting relevant tools for: \\"{request}\\"")
    print(f"   Total tools available: {len(all_tools)}")

    tool_list = "\\n".join(f"- {t['name']}: {t['description']}" for t in all_tools)

    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=256,
        system=ROUTER_PROMPT.format(tool_list=tool_list, request=request),
        messages=[{"role": "user", "content": request}],
    )
    text = next(b.text for b in response.content if b.type == "text")
    try:
        selected = json.loads(text)
    except:
        selected = [t["name"] for t in all_tools[:5]]

    selected_tools = [t for t in all_tools if t["name"] in selected]
    print(f"   ✅ Selected {len(selected_tools)} tools: {[t['name'] for t in selected_tools]}")
    return selected_tools


def test_routing(request: str):
    """Test the routing approach."""
    print(f"\\n{'='*60}")
    print(f"TEST: \\"{request}\\"")
    selected = route_tools(request, ALL_TOOLS)

    # With 4-5 tools → much higher accuracy
    print(f"   Claude gets only {len(selected)} tools instead of {len(ALL_TOOLS)}")
    print(f"   Expected accuracy improvement: ~40% → ~90%+")


if __name__ == "__main__":
    test_routing("I need to process a refund for order #12345")
    test_routing("What's the tax on a $99 purchase shipped to California?")
    test_routing("Add this item to my wishlist and notify me when it's back in stock")

    print(f"\\n{'═'*60}")
    print("EXAM KEY POINTS:")
    print("  4-5 tools per agent = sweet spot")
    print("  15+ tools → add a router layer")
    print("  50+ tools → add semantic search")
    print("  Router selects top 4-5 per request based on query similarity")
    print(f"{'═'*60}")`,
    expectedOutput: `🧭 [ROUTER] "Process a refund for order #12345"
   Selected 5 tools: ['tool_2', 'tool_4', 'tool_12', 'tool_22', 'tool_24']
   Claude gets only 5 tools instead of 30 → ~90%+ accuracy`,
    brokenCode: `# ❌ BROKEN: 30 tools all available at once
# 🐛 BUG: All 30 tools exposed — Claude picks wrong tool 40% of the time
import anthropic
import json

client = anthropic.Anthropic()

# 🐛 30 tools all available at once — overwhelms the model!
def make_tool(name, desc):
    return {
        "name": name,
        "description": desc,
        "input_schema": {
            "type": "object",
            "properties": {"input": {"type": "string"}},
            "required": ["input"],
        },
    }

# All 30 tools — no grouping, no dynamic loading
ALL_30_TOOLS = [
    make_tool("search_orders", "Search customer orders"),
    make_tool("search_products", "Search product catalog"),
    make_tool("search_customers", "Search customer database"),
    make_tool("search_inventory", "Search inventory levels"),
    make_tool("search_shipments", "Search shipment tracking"),
    make_tool("get_order", "Get order details"),
    make_tool("get_product", "Get product details"),
    make_tool("get_customer", "Get customer profile"),
    make_tool("get_inventory", "Get inventory count"),
    make_tool("get_shipment", "Get shipment status"),
    make_tool("update_order", "Update order status"),
    make_tool("update_inventory", "Update inventory count"),
    make_tool("cancel_order", "Cancel an order"),
    make_tool("refund_order", "Process a refund"),
    make_tool("create_order", "Create new order"),
    make_tool("create_customer", "Create customer account"),
    make_tool("delete_customer", "Remove customer"),
    make_tool("send_email", "Send email notification"),
    make_tool("send_sms", "Send SMS notification"),
    make_tool("generate_report", "Generate business report"),
    make_tool("export_data", "Export data to CSV"),
    make_tool("import_data", "Import data from file"),
    make_tool("calculate_shipping", "Calculate shipping cost"),
    make_tool("apply_discount", "Apply discount code"),
    make_tool("check_promo", "Check promo code validity"),
    make_tool("get_analytics", "Get analytics data"),
    make_tool("manage_returns", "Process product returns"),
    make_tool("update_pricing", "Update product pricing"),
    make_tool("manage_reviews", "Moderate product reviews"),
    make_tool("system_status", "Check system health"),
]
# 🐛 ... all 30 tools visible at once!

def execute_tool(name: str, inputs: dict) -> str:
    print(f"🔧 [TOOL EXEC] {name}({json.dumps(inputs)})")
    return json.dumps({"result": f"{name} executed successfully"})


def run_agent(prompt: str) -> str:
    """🐛 BROKEN: 30 tools all loaded — model confusion."""
    messages = [{"role": "user", "content": prompt}]

    # 🐛 All 30 tools passed every time!
    tools = ALL_30_TOOLS

    print(f"🚀 [AGENT START] Prompt: \\"{prompt}\\"")
    print(f"   ⚠️  Available tools: {len(tools)} (all of them!)")

    for turn in range(10):
        print(f"\\n📤 [TURN {turn + 1}]")

        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1024,
            tools=tools,  # 🐛 All 30 tools!
            messages=messages,
        )

        messages.append({"role": "assistant", "content": response.content})

        if response.stop_reason == "end_turn":
            text = next((b.text for b in response.content if b.type == "text"), "")
            return text

        tool_results = []
        for block in response.content:
            if block.type == "tool_use":
                print(f"   🐛 Claude chose: {block.name} — correct tool?")
                output = execute_tool(block.name, block.input)
                tool_results.append({
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": output,
                })

        if tool_results:
            messages.append({"role": "user", "content": tool_results})

    return "Agent hit turn limit"


if __name__ == "__main__":
    result = run_agent("Check the status of order #12345")
    print(f"\\n📋 Result: {result}")
    print("\\n🐛 Result: Claude picks wrong tool 40% of the time!")
    print("🐛 Should dynamically load only order-related tools")
`,
    hints: ["Tool accuracy degrades significantly with 20+ tools.", "Route tools based on user intent BEFORE calling Claude.", "Use a lightweight classifier to determine relevant tool subset."],
    fixes: ["Implement tool routing: classify intent, expose only 5-7 relevant tools.", "This dramatically improves accuracy (90%+ with 5 tools vs 60% with 30).", "The router can be a simple keyword match or small LLM call."],
  };

export default es_8;
