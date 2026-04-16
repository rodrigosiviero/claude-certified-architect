import type { ScenarioLab } from './types';

const es_24: ScenarioLab = {
    id: 'es-24',
    title: 'Large Workflow — Pagination for 10,000 Row Results',
    domain: 'Domain 5 — Safety & Production',
    domainNum: 5,
    scenario: 'A tool returns 10,000 rows from a database query. Claude\'s context fills up and can\'t process the data. Implement pagination: return first 10 rows with a count, let Claude request more if needed.',
    examTopic: '5.4 Large Workflows',
    difficulty: 'Medium',
    codeTemplate: `import anthropic
import json

client = anthropic.Anthropic()

# ============================================
# EXAM SCENARIO: 10,000 rows → context overflow
# ============================================
# BROKEN: Dump all 10,000 rows → context fills up → Claude breaks
# FIXED: Paginate — first 10 rows + total count + has_more flag
# ============================================

# Simulated database
def query_orders(limit: int = 10, offset: int = 0) -> dict:
    """Simulated paginated database query."""
    total = 10000
    orders = [
        {"id": f"ORD-{offset + i + 1:05d}", "total": 50.0 + i * 10, "status": "delivered" if i % 3 != 0 else "pending"}
        for i in range(min(limit, total - offset))
    ]
    return {
        "orders": orders,
        "pagination": {
            "total": total,
            "offset": offset,
            "limit": limit,
            "has_more": offset + limit < total,
            "returned": len(orders),
        },
        "summary": f"Showing {len(orders)} of {total} orders. Total value: \${sum(o['total'] for o in orders):,.2f} (this page only)",
    }


search_orders_tool = {
    "name": "search_orders",
    "description": "Search orders with pagination. Returns max 10 per page. Use offset to get more.",
    "input_schema": {
        "type": "object",
        "properties": {
            "limit": {"type": "integer", "description": "Results per page (max 10)"},
            "offset": {"type": "integer", "description": "Skip this many results"},
        },
    },
}


def run_paginated_agent(query: str):
    """Agent that handles paginated results properly."""
    messages = [{"role": "user", "content": query}]
    print(f"🚀 [AGENT] \\"{query}\\"")

    for turn in range(5):
        print(f"\\n{'═'*60}")
        print(f"📤 [TURN {turn + 1}] Messages in context: {len(messages)}")

        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=256,
            tools=[search_orders_tool],
            messages=messages,
        )
        messages.append({"role": "assistant", "content": response.content})

        if response.stop_reason == "end_turn":
            text = next((b.text for b in response.content if b.type == "text"), "")
            print(f"\\n✅ [DONE]\\n{text[:300]}")
            break

        tool_results = []
        for block in response.content:
            if block.type == "tool_use":
                print(f"\\n🔧 [TOOL] {block.name}({json.dumps(block.input)})")
                result = query_orders(
                    limit=block.input.get("limit", 10),
                    offset=block.input.get("offset", 0),
                )
                print(f"   Returned: {result['pagination']['returned']} rows")
                print(f"   Total in DB: {result['pagination']['total']}")
                print(f"   Has more: {result['pagination']['has_more']}")
                tool_results.append({
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": json.dumps(result),
                })

        messages.append({"role": "user", "content": tool_results})

    print(f"\\n{'═'*60}")
    print("EXAM KEY:")
    print("  NEVER dump all results — paginate with LIMIT + count + summary")
    print("  Let Claude request more pages if needed")
    print("  Subagent isolation for verbose exploration")
    print("  Crash recovery with state manifests")
    print(f"{'═'*60}")


if __name__ == "__main__":
    run_paginated_agent("How many orders do we have? Show me the first few and the total count.")`,
    expectedOutput: `Tool returns 10 rows + "total: 10000, has_more: true"
Claude can summarize without seeing all 10,000 rows`,
    brokenCode: `# ❌ BROKEN: Loading all 10,000 rows at once
# 🐛 BUG: 10,000 rows x ~200 chars = ~2MB of text in context!
import anthropic
import json

client = anthropic.Anthropic()

db_tool = {
    "name": "query_database",
    "description": "Query the database.",
    "input_schema": {
        "type": "object",
        "properties": {
            "sql": {"type": "string", "description": "SQL query"}
        },
        "required": ["sql"],
    },
}

def execute_tool(name: str, inputs: dict) -> str:
    if name == "query_database":
        # 🐛 Simulates returning ALL 10,000 rows
        fake_rows = [{"id": i, "name": f"Item {i}", "value": i * 10} for i in range(10000)]
        output = json.dumps({"rows": fake_rows, "count": len(fake_rows)})
        print(f"   ⚠️  Returned {len(fake_rows)} rows ({len(output)} chars)")
        return output
    return json.dumps({"error": "Unknown tool"})


def run_agent_broken(prompt: str) -> str:
    """🐛 BROKEN: Loads all data into context — no pagination."""
    messages = [{"role": "user", "content": prompt}]

    print(f"🚀 [AGENT START] Prompt: \\"{prompt}\\"")

    for turn in range(5):
        print(f"\\n📤 [TURN {turn + 1}]")
        context_size = len(json.dumps(messages))
        print(f"   Context: ~{context_size // 4} tokens ({context_size} chars)")

        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1024,
            tools=[db_tool],
            messages=messages,
        )

        messages.append({"role": "assistant", "content": response.content})

        if response.stop_reason == "end_turn":
            text = next((b.text for b in response.content if b.type == "text"), "")
            return text

        tool_results = []
        for block in response.content:
            if block.type == "tool_use":
                # 🐛 10,000 rows x ~200 chars = ~2MB of text!
                output = execute_tool(block.name, block.input)
                tool_results.append({
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": output,  # 🐛 2MB in context!
                })

        if tool_results:
            messages.append({"role": "user", "content": tool_results})

    return "Agent hit turn limit"


if __name__ == "__main__":
    result = run_agent_broken("Show me all sales data from last month")
    print(f"\\n📋 Result: {result[:200]}...")
    print("\\n🐛 Problem: 10,000 rows loaded into context at once!")
    print("🐛 Should use: LIMIT, pagination, or aggregation queries")
`,
    hints: ["Large datasets need pagination — never return all rows.", "Provide page size limits and offset parameters.", "Return summaries for large datasets, details on demand."],
    fixes: ["Add pagination: get_orders(customer_id, page=1, limit=20).", "Return summary: \"Showing 20 of 10,000 orders. Total: $X\".", "Let user request more pages or filter by date/status."],
  };

export default es_24;
