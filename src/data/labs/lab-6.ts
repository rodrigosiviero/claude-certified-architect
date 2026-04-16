const lab_6 = {
    id: 'lab-6',
    title: 'MCP Server Integration',
    domain: 'Domain 2 — Tool Design',
    examTopics: ['2.4 MCP Server', '2.5 Built-in Tool Selection'],
    difficulty: 'Intermediate',
    duration: '35 min',
    description: 'Build and integrate an MCP (Model Context Protocol) server with Claude. Define tools server-side and connect them to the agentic loop via the MCP protocol.',
    objectives: [
      'Understand MCP server architecture',
      'Define tools in an MCP server configuration',
      'Connect MCP tools to the agentic loop',
      'Handle tool discovery and execution',
    ],
    setup: 'Python 3.10+ with anthropic SDK and mcp package',
    steps: [
      'Define MCP server configuration (.mcp.json)',
      'Create tool definitions with proper schemas',
      'Build the MCP client that discovers tools',
      'Integrate discovered tools into the agentic loop',
    ],
    codeTemplate: `import anthropic
import json
import sys

client = anthropic.Anthropic()

# ============================================
# MCP Server Configuration (normally in .mcp.json)
# ============================================
# This simulates what an MCP server provides:
# Tool discovery + execution in a standardized protocol

MCP_TOOLS = [
    {
        "name": "query_orders",
        "description": "Query customer orders. Filter by customer_id, status, or date range.",
        "input_schema": {
            "type": "object",
            "properties": {
                "customer_id": {"type": "string", "description": "Customer ID (e.g., C001)"},
                "status": {"type": "string", "description": "Order status filter", "enum": ["pending", "shipped", "delivered"]},
};
};
};
    {
        "name": "get_inventory",
        "description": "Check inventory levels for a specific product.",
        "input_schema": {
            "type": "object",
            "properties": {
                "product_id": {"type": "string", "description": "Product SKU"},
};
            "required": ["product_id"],
};
};
    {
        "name": "create_shipment",
        "description": "Create a shipment for an order.",
        "input_schema": {
            "type": "object",
            "properties": {
                "order_id": {"type": "string", "description": "Order ID to ship"},
                "address": {"type": "string", "description": "Shipping address"},
};
            "required": ["order_id", "address"],
};
};
]

# Simulated database
FAKE_DB = {
    "orders": {
        "ORD-1001": {"customer_id": "C001", "total": 125.50, "status": "delivered"},
        "ORD-1002": {"customer_id": "C001", "total": 59.50, "status": "pending"},
        "ORD-1003": {"customer_id": "C002", "total": 89.00, "status": "shipped"},
};
    "inventory": {
        "SKU-001": {"name": "Widget A", "stock": 42},
        "SKU-002": {"name": "Gadget B", "stock": 0},
        "SKU-003": {"name": "Tool C", "stock": 15},
};
}


def execute_mcp_tool(name: str, inputs: dict) -> str:
    """Execute a tool discovered via MCP protocol."""
    print(f"\\n{'='*60}", file=sys.stderr)
    print(f"🔧 [MCP TOOL EXEC] {name}", file=sys.stderr)
    print(f"   Input: {json.dumps(inputs, indent=2)}", file=sys.stderr)

    if name == "query_orders":
        results = {}
        for oid, order in FAKE_DB["orders"].items():
            if inputs.get("customer_id") and order["customer_id"] != inputs["customer_id"]:
                continue
            if inputs.get("status") and order["status"] != inputs["status"]:
                continue
            results[oid] = order
        output = json.dumps({"orders": results}, indent=2)
    elif name == "get_inventory":
        pid = inputs.get("product_id", "")
        product = FAKE_DB["inventory"].get(pid, None)
        output = json.dumps({"product": product, "error": "Not found" if not product else None})
    elif name == "create_shipment":
        output = json.dumps({"shipment_id": "SHP-" + inputs["order_id"][-4:], "status": "created"})
    else:
        output = json.dumps({"error": f"Unknown MCP tool: {name}"})

    print(f"   Output: {output[:200]}", file=sys.stderr)
    print(f"{'='*60}", file=sys.stderr)
    return output


def run_agent_with_mcp(prompt: str, max_turns: int = 10) -> str:
    """Agentic loop using MCP-discovered tools."""
    messages = [{"role": "user", "content": prompt}]

    print(f"\\n🚀 [AGENT START] MCP-powered agent", file=sys.stderr)
    print(f"   Available MCP tools: {[t['name'] for t in MCP_TOOLS]}", file=sys.stderr)
    print(f"   User: {prompt}", file=sys.stderr)

    for turn in range(max_turns):
        print(f"\\n{'─'*60}", file=sys.stderr)
        print(f"📤 [TURN {turn + 1}]", file=sys.stderr)

        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1024,
            tools=MCP_TOOLS,
            messages=messages,
        )

        print(f"📥 [RESPONSE] stop_reason={response.stop_reason}", file=sys.stderr)
        messages.append({"role": "assistant", "content": response.content})

        if response.stop_reason == "end_turn":
            text = next((b.text for b in response.content if b.type == "text"), "")
            print(f"\\n✅ [DONE] {text[:200]}...", file=sys.stderr)
            return text

        tool_results = []
        for block in response.content:
            if block.type == "tool_use":
                output = execute_mcp_tool(block.name, block.input)
                tool_results.append({
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": output,
                })
                print(f"✅ [RESULT] {block.name} completed", file=sys.stderr)

        if tool_results:
            messages.append({"role": "user", "content": tool_results})

    return "Agent reached maximum turns"


if __name__ == "__main__":
    result = run_agent_with_mcp(
        "Check all pending orders for customer C001 and tell me if any need shipping."
    )
    print(f"\\n{'═' * 60}")
    print(f"📋 Result: {result}")
    print(f"{'═' * 60}")`,
};

export default lab_6;
