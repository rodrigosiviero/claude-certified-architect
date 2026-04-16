import type { ScenarioLab } from './types';

const es_17: ScenarioLab = {
    id: 'es-17',
    title: 'Few-Shot — Claude Confuses Similar Tools',
    domain: 'Domain 4 — Prompt Engineering',
    domainNum: 4,
    scenario: 'Claude confuses two similar tools (archive_user vs delete_user). Adding descriptions didn\'t fully help. Add 2-4 few-shot examples showing the ambiguous cases with reasoning.',
    examTopic: '4.2 Few-Shot Examples',
    difficulty: 'Medium',
    codeTemplate: `import anthropic
import json

client = anthropic.Anthropic()

# ============================================
# EXAM SCENARIO: Few-shot for tool disambiguation
# ============================================
# Descriptions alone aren't enough for similar tools.
# Add 2-4 examples focusing on AMBIGUOUS cases with reasoning.
# ============================================

tools = [
    {
        "name": "archive_user",
        "description": "Soft-delete: marks user as inactive, preserves data. Reversible within 30 days.",
        "input_schema": {"type": "object", "properties": {"user_id": {"type": "string"}}, "required": ["user_id"]},
    },
    {
        "name": "delete_user",
        "description": "Hard-delete: permanently removes user and all associated data. Irreversible.",
        "input_schema": {"type": "object", "properties": {"user_id": {"type": "string"}, "confirm": {"type": "boolean"}}, "required": ["user_id", "confirm"]},
    },
]

# ✅ Few-shot examples in system prompt — focus on AMBIGUOUS cases
FEW_SHOT_SYSTEM = """You manage user accounts with two tools: archive_user and delete_user.

Examples of CORRECT choices:

User: "Remove john@example.com, he left the company"
→ archive_user
Reasoning: "Left the company" is standard offboarding → archive preserves data for compliance.
The user might need access to records later.

User: "Permanently delete all data for user@example.com per GDPR request"
→ delete_user with confirm=true
Reasoning: "Permanently" + "GDPR request" = explicit request for data destruction.
GDPR right-to-erasure requires permanent deletion.

User: "Deactivate test@test.com, they haven't logged in for a year"
→ archive_user
Reasoning: "Deactivate" = soft action, and inactivity is not a deletion reason.

User: "I want ALL traces of user123 gone from the system NOW"
→ delete_user with confirm=true
Reasoning: "ALL traces" + "gone" + urgency = clear intent for permanent removal.

Always explain your reasoning before calling the tool."""


def test_disambiguation(query: str):
    print(f"\\n{'─'*50}")
    print(f"🧪 Query: \\"{query}\\"")

    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=256,
        system=FEW_SHOT_SYSTEM,
        tools=tools,
        tool_choice={"type": "any"},
        messages=[{"role": "user", "content": query}],
    )

    for block in response.content:
        if block.type == "text":
            print(f"   Reasoning: {block.text[:150]}")
        elif block.type == "tool_use":
            print(f"   → Called: {block.name}({json.dumps(block.input)})")


if __name__ == "__main__":
    test_disambiguation("Remove bob@company.com, he was fired")
    test_disambiguation("Permanently erase jane@test.com under GDPR")
    test_disambiguation("Clean up old account: test@demo.com")

    print(f"\\n{'═'*60}")
    print("EXAM KEY: Few-shot examples")
    print("  2-4 examples, not 20 — focus on AMBIGUOUS cases")
    print("  Include reasoning: 'Thought... Reason...'")
    print("  Positive AND negative examples")
    print("  Teaches understanding, not just pattern matching")
    print(f"{'═'*60}")`,
    expectedOutput: `"he was fired" → archive_user (standard offboarding)
"Permanently erase under GDPR" → delete_user (explicit permanent)
"Clean up old account" → archive_user (soft action)`,
    brokenCode: `# ❌ BROKEN: Ambiguous few-shot examples
# 🐛 BUG: "my stuff" and "tracking" create ambiguous signals
import anthropic
import json

client = anthropic.Anthropic()

search_orders_tool = {
    "name": "search_orders",
    "description": "Search customer orders.",
    "input_schema": {
        "type": "object",
        "properties": {
            "query": {"type": "string", "description": "Search terms"}
        },
        "required": ["query"],
    },
}

search_products_tool = {
    "name": "search_products",
    "description": "Search product catalog.",
    "input_schema": {
        "type": "object",
        "properties": {
            "query": {"type": "string", "description": "Search terms"}
        },
        "required": ["query"],
    },
}

def execute_tool(name: str, inputs: dict) -> str:
    print(f"🔧 [TOOL EXEC] {name}({json.dumps(inputs)})")
    return json.dumps({"results": f"Results from {name}"})


# 🐛 BROKEN: Ambiguous few-shot examples in system prompt
BROKEN_SYSTEM = """You are a shopping assistant. Examples:
User: "my stuff" -> search_orders  # 🐛 Ambiguous! Could mean products!
User: "tracking" -> search_orders  # 🐛 Could mean package tracking!
User: "cheap" -> search_products
User: "buy" -> search_products
"""

# ✅ CORRECT: Clear, unambiguous examples
CORRECT_SYSTEM = """You are a shopping assistant. Route requests based on intent:

ORDER-related (past purchases, tracking, returns):
User: "where is my order" -> search_orders(query="order status")
User: "track my package" -> search_orders(query="tracking")
User: "return item" -> search_orders(query="return")

PRODUCT-related (browsing, buying, comparing):
User: "find cheap headphones" -> search_products(query="affordable headphones")
User: "compare laptops" -> search_products(query="laptop comparison")
"""


def run_agent(prompt: str, system: str) -> str:
    """Run agent with the given system prompt."""
    messages = [{"role": "user", "content": prompt}]

    for turn in range(5):
        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1024,
            system=system,
            tools=[search_orders_tool, search_products_tool],
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
                tool_results.append({
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": output,
                })
        if tool_results:
            messages.append({"role": "user", "content": tool_results})

    return "Agent hit turn limit"


if __name__ == "__main__":
    print("🐛 BROKEN system prompt with ambiguous examples:")
    print(BROKEN_SYSTEM)
    result = run_agent("I want to see my stuff", BROKEN_SYSTEM)
    print(f"Result: {result}")
    print("\\n🐛 'my stuff' is ambiguous — orders or products?")
`,
    hints: ["Few-shot examples should cover AMBIGUOUS cases with clear reasoning.", "Avoid ambiguous examples that could match multiple tools.", "Each example should demonstrate the DECISION BOUNDARY."],
    fixes: ["Use few-shot for edge cases with explicit reasoning.", "Show the thought process: \"user asks about X, not Y, so tool Z\".", "Include negative examples to clarify boundaries."],
  };

export default es_17;
