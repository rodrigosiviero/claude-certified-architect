import type { ScenarioLab } from './types';

const es_20: ScenarioLab = {
    id: 'es-20',
    title: 'Retry Loop — Missing Info Can\'t Be Fixed by Retries',
    domain: 'Domain 4 — Prompt Engineering',
    domainNum: 4,
    scenario: 'A retry loop keeps failing to extract a date that simply isn\'t in the document. Retrying 5 times won\'t create information that doesn\'t exist. Distinguish format errors (retry) from missing info (provide context).',
    examTopic: '4.4 Structured Output',
    difficulty: 'Easy',
    codeTemplate: `import anthropic
import json

client = anthropic.Anthropic()

# ============================================
# EXAM SCENARIO: Retry vs missing info
# ============================================
# Format error → retry (Claude returned wrong format)
# Missing info → DON'T retry (info doesn't exist in the document)
# Add context instead of retrying
# ============================================

extraction_tool = {
    "name": "extract_info",
    "description": "Extracts information from a document",
    "input_schema": {
        "type": "object",
        "properties": {
            "title": {"type": "string"},
            "author": {"type": "string"},
            "date": {"type": "string"},
        },
        "required": ["title", "author", "date"],
    },
}

# Document WITHOUT a date
document = """
Quarterly Business Report
Prepared by: Sarah Chen, VP of Strategy
This report covers our Q3 performance metrics and strategic initiatives.
"""

def smart_extract(doc: str, max_retries: int = 3) -> dict:
    """Smart extraction: retry format errors, handle missing info."""
    print(f"📄 Document: {doc.strip()[:80]}...")
    print(f"   Note: This document has NO date field!")

    for attempt in range(max_retries):
        print(f"\\n{'─'*40}")
        print(f"🔄 Attempt {attempt + 1}/{max_retries}")

        prompt = f"Extract the title, author, and date from this document:\\n\\n{doc}"
        if attempt > 0:
            prompt += "\\n\\nIMPORTANT: The date field is REQUIRED. If no date is found, use 'Not specified'."

        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=256,
            tools=[extraction_tool],
            tool_choice={"type": "tool", "name": "extract_info"},
            messages=[{"role": "user", "content": prompt}],
        )

        for block in response.content:
            if block.type == "tool_use":
                data = block.input
                print(f"   Extracted: {json.dumps(data, indent=2)}")

                # Validate
                if data.get("date") and data["date"] not in ["", "unknown", "N/A"]:
                    print(f"   ✅ All fields extracted!")
                    return data
                else:
                    if attempt < max_retries - 1:
                        print(f"   ⚠️  Date missing — this is a FORMAT issue, retrying...")
                    else:
                        print(f"   ❌ Date genuinely doesn't exist in document")
                        print(f"   💡 Retries don't fix MISSING info — add it to the prompt!")
                        return data
    return {}


if __name__ == "__main__":
    smart_extract(document)

    print(f"\\n{'═'*60}")
    print("EXAM KEY:")
    print("  Retries fix FORMAT errors (wrong structure, bad JSON)")
    print("  Retries DON'T fix MISSING info (data doesn't exist)")
    print("  If info is missing, ADD it to the prompt")
    print("  Validate first, then decide: retry or enhance prompt")
    print(f"{'═'*60}")`,
    expectedOutput: `Attempt 1: date="" → retry
Attempt 2: date="Not specified" → still missing
❌ Date genuinely doesn't exist — retries won't help`,
    brokenCode: `# ❌ BROKEN: Blind retry without analyzing errors
# 🐛 BUG: Retries the same failing request 5 times without adaptation
import anthropic
import json
import time

client = anthropic.Anthropic()

api_tool = {
    "name": "call_api",
    "description": "Call an external API.",
    "input_schema": {
        "type": "object",
        "properties": {
            "endpoint": {"type": "string", "description": "API endpoint"},
            "params": {"type": "object", "description": "Parameters"}
        },
        "required": ["endpoint"],
    },
}

def execute_tool(name: str, inputs: dict) -> str:
    if name == "call_api":
        endpoint = inputs.get("endpoint", "")
        if "invalid" in endpoint:
            return json.dumps({"error": "404 Not Found", "status": 404})
        return json.dumps({"data": "success"})
    return json.dumps({"error": "Unknown tool"})


def run_agent_broken(prompt: str) -> str:
    """🐛 BROKEN: Blind retry — same request 5 times."""
    messages = [{"role": "user", "content": prompt}]

    print(f"🚀 [AGENT START] Prompt: \\"{prompt}\\"")

    for turn in range(15):
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
                result = json.loads(output)

                # 🐛 BUG: Blind retry — if "not found", retrying changes nothing!
                if "error" in result:
                    print(f"   ❌ Error: {result['error']}")
                    print(f"   🐛 Retrying the same request...")
                    # 🐛 Appends error as success, Claude retries same approach
                    tool_results.append({
                        "type": "tool_result",
                        "tool_use_id": block.id,
                        "content": output,  # 🐛 Same error, no is_error flag!
                    })
                else:
                    tool_results.append({
                        "type": "tool_result",
                        "tool_use_id": block.id,
                        "content": output,
                    })

        if tool_results:
            messages.append({"role": "user", "content": tool_results})

    return "Agent exhausted retries with same failing approach"


if __name__ == "__main__":
    result = run_agent_broken("Fetch data from /api/v1/invalid-endpoint")
    print(f"\\n📋 Result: {result}")
    print("\\n🐛 Problem: If 'not found', retrying 5x changes nothing!")
    print("🐛 Should analyze error type and adapt strategy")
`,
    hints: ["Retrying without changing inputs is pointless.", "Analyze: is it retryable (timeout) or permanent (not found)?", "Only retry when the failure is transient AND you can change something."],
    fixes: ["Check error type: permanent errors should not be retried.", "For transient errors (timeout), add exponential backoff.", "If info is missing, ask the user — do not retry blindly."],
  };

export default es_20;
