import type { ScenarioLab } from './types';

const es_4: ScenarioLab = {
    id: 'es-4',
    title: 'SDK Hooks — Pre vs Post (PII Masking Scenario)',
    domain: 'Domain 1 — Agentic Engineering',
    domainNum: 1,
    scenario: 'You need to mask PII in tool results BEFORE Claude sees them. A junior dev suggests using PreToolUse. Explain why that\'s wrong and implement the correct PostToolUse hook.',
    examTopic: '1.5 SDK Hooks',
    difficulty: 'Medium',
    codeTemplate: `import anthropic
import json
import re

client = anthropic.Anthropic()

# ============================================
# EXAM SCENARIO: Pre vs Post hook for PII masking
# ============================================
# WRONG: PreToolUse for filtering results (results don't exist yet!)
# RIGHT: PostToolUse for filtering results AFTER execution
# ============================================

PII_PATTERNS = {
    "email": (r'[\\w.-]+@[\\w.-]+\\.\\w+', '[EMAIL_REDACTED]'),
    "ssn": (r'\\d{3}-\\d{2}-\\d{4}', '[SSN_REDACTED]'),
    "phone": (r'\\d{3}[-.]?\\d{3}[-.]?\\d{4}', '[PHONE_REDACTED]'),
}


def redact_pii(text: str) -> tuple[str, list[str]]:
    """Redact PII from text, returning cleaned text and list of redactions."""
    redactions = []
    for pii_type, (pattern, replacement) in PII_PATTERNS.items():
        matches = re.findall(pattern, text)
        for match in matches:
            redactions.append(f"{pii_type}: {match}")
        text = re.sub(pattern, replacement, text)
    return text, redactions


# ✅ CORRECT: PostToolUse hook — runs AFTER tool execution, BEFORE Claude sees results
def post_tool_use_hook(tool_name: str, tool_result: str) -> str:
    """PostToolUse: Transform/filter results AFTER execution."""
    print(f"\\n{'─'*40}")
    print(f"🪝 [POST-TOOL-USE HOOK] Triggered after '{tool_name}' executed")
    print(f"   Raw result (may contain PII):")
    print(f"   {tool_result[:200]}")

    cleaned, redactions = redact_pii(tool_result)

    if redactions:
        print(f"   🔒 Redacted {len(redactions)} PII item(s): {redactions}")
    else:
        print(f"   ✅ No PII detected")

    print(f"   Cleaned result sent to Claude:")
    print(f"   {cleaned[:200]}")
    return cleaned


# Demonstrate the difference
lookup_tool = {
    "name": "lookup_customer",
    "description": "Looks up customer record by ID",
    "input_schema": {
        "type": "object",
        "properties": {"customer_id": {"type": "string"}},
        "required": ["customer_id"],
    },
}

def execute_tool(name: str, inputs: dict) -> str:
    """Simulated tool that returns data with PII."""
    print(f"\\n🔧 [TOOL EXEC] {name}({json.dumps(inputs)})")
    if name == "lookup_customer":
        # Simulated DB result with PII
        return json.dumps({
            "name": "Jane Smith",
            "email": "jane.smith@company.com",
            "phone": "555-123-4567",
            "ssn": "123-45-6789",
            "orders": 15,
        })
    return json.dumps({"error": "Unknown tool"})


def run_agent_with_hooks(prompt: str) -> str:
    """Agent loop with PostToolUse PII hook."""
    messages = [{"role": "user", "content": prompt}]
    print(f"🚀 [AGENT START] \\"{prompt}\\"")

    for turn in range(5):
        print(f"\\n{'═'*60}")
        print(f"📤 [TURN {turn + 1}] Sending to Claude...")

        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=512,
            tools=[lookup_tool],
            messages=messages,
        )
        messages.append({"role": "assistant", "content": response.content})

        print(f"📥 [RESPONSE] stop_reason={response.stop_reason}")

        if response.stop_reason == "end_turn":
            text = next((b.text for b in response.content if b.type == "text"), "")
            print(f"\\n✅ [DONE] Claude finished.")
            return text

        tool_results = []
        for block in response.content:
            if block.type == "tool_use":
                raw_output = execute_tool(block.name, block.input)
                # ✅ POST-TOOL-USE HOOK: Redact PII before Claude sees it
                clean_output = post_tool_use_hook(block.name, raw_output)
                tool_results.append({
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": clean_output,
                })

        messages.append({"role": "user", "content": tool_results})

    return "Max turns."


if __name__ == "__main__":
    result = run_agent_with_hooks("Look up customer C-1001 and tell me their contact info")
    print(f"\\n📋 [FINAL ANSWER]\\n{result}")

    print(f"\\n{'═'*60}")
    print("KEY EXAM POINTS:")
    print("  PreToolUse  → runs BEFORE tool executes → use for GATING (should this run?)")
    print("  PostToolUse → runs AFTER tool executes  → use for FILTERING (clean the result)")
    print("  PII masking is a PostToolUse concern — the data must exist first!")
    print(f"{'═'*60}")`,
    expectedOutput: `🪝 [POST-TOOL-USE HOOK] Triggered after 'lookup_customer' executed
   Raw result (may contain PII):
   {"name": "Jane Smith", "email": "jane.smith@company.com", "phone": "555-123-4567", ...}
   🔒 Redacted 3 PII item(s): ['email: jane.smith@company.com', 'phone: 555-123-4567', 'ssn: 123-45-6789']
   Cleaned result: {"name": "Jane Smith", "email": "[EMAIL_REDACTED]", ...}`,
    brokenCode: `# ❌ BROKEN: PII check AFTER tool execution
# 🐛 BUG: PII is redacted AFTER the tool runs — data already leaked!
import anthropic
import json
import re

client = anthropic.Anthropic()

db_query_tool = {
    "name": "query_database",
    "description": "Query the customer database.",
    "input_schema": {
        "type": "object",
        "properties": {
            "sql": {"type": "string", "description": "SQL query to execute"}
        },
        "required": ["sql"],
    },
}

def execute_tool(name: str, inputs: dict) -> str:
    print(f"🔧 [TOOL EXEC] {name}({json.dumps(inputs)[:100]}...)")
    if name == "query_database":
        # Simulated database response with PII
        fake_data = [
            {"name": "João Silva", "email": "joao@email.com", "ssn": "123-45-6789"},
            {"name": "Maria Santos", "email": "maria@email.com", "ssn": "987-65-4321"},
        ]
        return json.dumps({"rows": fake_data})
    return json.dumps({"error": f"Unknown tool: {name}"})


def redact_pii(text: str) -> str:
    """Redact PII from text."""
    text = re.sub(r'\\b[\\w.-]+@[\\w.-]+\\.\\w+\\b', '[EMAIL REDACTED]', text)
    text = re.sub(r'\\b\\d{3}-\\d{2}-\\d{4}\\b', '[SSN REDACTED]', text)
    return text


def run_agent(prompt: str) -> str:
    """🐛 BROKEN: PII check happens AFTER tool execution."""
    messages = [{"role": "user", "content": prompt}]

    print(f"🚀 [AGENT START] Prompt: \\"{prompt}\\"")

    for turn in range(10):
        print(f"\\n📤 [TURN {turn + 1}]")

        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1024,
            tools=[db_query_tool],
            messages=messages,
        )

        messages.append({"role": "assistant", "content": response.content})

        if response.stop_reason == "end_turn":
            text = next((b.text for b in response.content if b.type == "text"), "")
            return text

        # Process tool calls
        tool_results = []
        for block in response.content:
            if block.type == "tool_use":
                # 🐛 BUG: Tool executes FIRST with raw PII
                output = execute_tool(block.name, block.input)
                print(f"   ⚠️  Raw output contains PII: {output[:100]}...")
                # 🐛 BUG: PII check happens AFTER execution!
                output = redact_pii(output)  # Too late! Data already accessed!
                tool_results.append({
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": output,
                })

        if tool_results:
            messages.append({"role": "user", "content": tool_results})

    return "Agent hit turn limit"


if __name__ == "__main__":
    result = run_agent("Show me all customers from São Paulo")
    print(f"\\n📋 Result: {result}")
    print("\\n🐛 PROBLEM: Tool already received and processed raw PII before redaction!")
`,
    hints: ["Pre-tool-use hooks must run BEFORE execute_tool(), not after.", "PII in tool inputs must be redacted before the tool sees them.", "Post-tool hooks are for filtering OUTPUTS, not inputs."],
    fixes: ["Move PII redaction to a pre-tool-use hook before execute_tool().", "Use post-tool hook to redact PII from outputs before returning to Claude.", "Hooks form a pipeline: pre-hook -> execute -> post-hook."],
  };

export default es_4;
