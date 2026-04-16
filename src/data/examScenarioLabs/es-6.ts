import type { ScenarioLab } from './types';

const es_6: ScenarioLab = {
    id: 'es-6',
    title: 'Tool Description Fix — Claude Calls Wrong Tool',
    domain: 'Domain 2 — Tool Design & MCP',
    domainNum: 2,
    scenario: 'A customer service bot has search_orders and search_products tools. Claude calls search_products when users ask about orders. The tool descriptions are too vague. Fix them so Claude selects the right tool.',
    examTopic: '2.1 Effective Tool Interfaces',
    difficulty: 'Medium',
    codeTemplate: `import anthropic
import json

client = anthropic.Anthropic()

# ============================================
# EXAM SCENARIO: Vague descriptions → wrong tool
# ============================================
# BROKEN descriptions → Claude picks the wrong tool
# FIXED descriptions → Claude picks the right tool every time
# ============================================

# ❌ BROKEN descriptions
broken_tools = [
    {
        "name": "search_orders",
        "description": "Search for things",  # VAGUE!
        "input_schema": {"type": "object", "properties": {"q": {"type": "string"}}, "required": ["q"]},
    },
    {
        "name": "search_products",
        "description": "Search for items",  # VAGUE!
        "input_schema": {"type": "object", "properties": {"q": {"type": "string"}}, "required": ["q"]},
    },
]

# ✅ FIXED descriptions (invest 60% of design time here!)
fixed_tools = [
    {
        "name": "search_orders",
        "description": (
            "Searches CUSTOMER ORDER records in the order management system. "
            "Use when the user asks about: order status, delivery dates, tracking numbers, "
            "purchase history, refunds, or anything related to orders they've placed. "
            "Input should be an order ID, customer email, or search keyword. "
            "Do NOT use for product catalog searches."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "query": {"type": "string", "description": "Order ID, customer email, or search keyword"},
            },
            "required": ["query"],
        },
    },
    {
        "name": "search_products",
        "description": (
            "Searches the PRODUCT CATALOG for items available for purchase. "
            "Use when the user asks about: product features, pricing, availability, "
            "comparisons between products, or anything related to items they might buy. "
            "Input should be a product name or category. "
            "Do NOT use for order lookups."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "query": {"type": "string", "description": "Product name, category, or feature keyword"},
            },
            "required": ["query"],
        },
    },
]


def test_tool_selection(tools, query: str) -> str:
    """Test which tool Claude selects for a given query."""
    print(f"\\n{'─'*50}")
    print(f"🧪 Query: \\"{query}\\"")

    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=256,
        tools=tools,
        tool_choice={"type": "any"},  # Force a tool call
        messages=[{"role": "user", "content": query}],
    )

    for block in response.content:
        if block.type == "tool_use":
            print(f"   → Claude called: {block.name}({json.dumps(block.input)})")
            return block.name
    return "none"


if __name__ == "__main__":
    queries = [
        "Where is my order #12345?",
        "Do you have wireless headphones under $50?",
        "I want a refund for my purchase last week",
        "What's the difference between iPhone 15 and 16?",
    ]

    print("=" * 60)
    print("TEST 1: ❌ BROKEN descriptions (vague)")
    print("=" * 60)
    for q in queries:
        test_tool_selection(broken_tools, q)

    print(f"\\n\\n{'='*60}")
    print("TEST 2: ✅ FIXED descriptions (specific + when NOT to use)")
    print("=" * 60)
    for q in queries:
        test_tool_selection(fixed_tools, q)

    print(f"\\n{'═'*60}")
    print("EXAM KEY POINT:")
    print("  Tool descriptions are the #1 lever for correct tool selection.")
    print("  Include: purpose + format + examples + 'when NOT to use'")
    print("  Invest 60% of tool design time on descriptions.")
    print(f"{'═'*60}")`,
    expectedOutput: `TEST 1: ❌ BROKEN — "Where is my order?" → search_products (WRONG!)
TEST 2: ✅ FIXED  — "Where is my order?" → search_orders (CORRECT!)`,
    brokenCode: `# ❌ BROKEN: Vague tool descriptions
# 🐛 BUG: Tool names/descriptions are ambiguous — Claude picks wrong tool
import anthropic
import json

client = anthropic.Anthropic()

# 🐛 BUG: "search" could mean anything!
vague_search = {
    "name": "search",  # 🐛 Too generic!
    "description": "Search for things.",  # 🐛 No specifics!
    "input_schema": {
        "type": "object",
        "properties": {
            "q": {"type": "string"}  # 🐛 No description!
        },
        "required": ["q"],
    },
}

# 🐛 Also vague — "get" could mean anything
vague_get = {
    "name": "get",
    "description": "Get information.",  # 🐛 What kind of information?
    "input_schema": {
        "type": "object",
        "properties": {
            "id": {"type": "string"}  # 🐛 What ID? Customer? Order? Product?
        },
        "required": ["id"],
    },
}

# 🐛 Another vague tool
vague_update = {
    "name": "update",
    "description": "Update something.",  # 🐛 Update what?!
    "input_schema": {
        "type": "object",
        "properties": {
            "data": {"type": "string"}  # 🐛 No structure!
        },
        "required": ["data"],
    },
}

def execute_tool(name: str, inputs: dict) -> str:
    print(f"🔧 [TOOL EXEC] {name}({json.dumps(inputs)})")
    if name == "search":
        return json.dumps({"results": "Found 10 items"})
    elif name == "get":
        return json.dumps({"item": "Some data"})
    elif name == "update":
        return json.dumps({"status": "updated"})
    return json.dumps({"error": f"Unknown tool: {name}"})


def run_agent(prompt: str) -> str:
    """🐛 BROKEN: Vague tools lead to wrong tool selection."""
    messages = [{"role": "user", "content": prompt}]

    # 🐛 All three tools are vague — Claude has to guess
    tools = [vague_search, vague_get, vague_update]

    print(f"🚀 [AGENT START] Prompt: \\"{prompt}\\"")

    for turn in range(10):
        print(f"\\n📤 [TURN {turn + 1}]")

        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1024,
            tools=tools,
            messages=messages,
        )

        messages.append({"role": "assistant", "content": response.content})

        if response.stop_reason == "end_turn":
            text = next((b.text for b in response.content if b.type == "text"), "")
            return text

        tool_results = []
        for block in response.content:
            if block.type == "tool_use":
                print(f"   🐛 Claude picked: {block.name} — is this the right tool?")
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
    result = run_agent("Find customer C001's recent orders")
    print(f"\\n📋 Result: {result}")
    print("\\n🐛 PROBLEM: 'search' might search orders, customers, or products!")
    print("🐛 Should be: search_orders(customer_id='C001')")
`,
    hints: ["Tool descriptions must include WHEN to use them (and when NOT to).", "Separate tools for separate concerns: search_orders vs search_products.", "Input schemas should specify formats and examples."],
    fixes: ["Rename \"search\" to specific names: \"search_orders\", \"search_products\".", "Add \"Use when: user asks about order status\" to descriptions.", "Add \"Do NOT use for: product search\" to prevent misrouting."],
  };

export default es_6;
