import type { ScenarioLab } from './types';

const es_23: ScenarioLab = {
    id: 'es-23',
    title: 'PII Redaction — Tool Boundary Protection',
    domain: 'Domain 5 — Safety & Production',
    domainNum: 5,
    scenario: 'A tool returns customer data with SSN, email, and phone. This data crosses into Claude\'s context unredacted. Implement PII redaction at the tool boundary — before data enters the agent\'s context.',
    examTopic: '5.3 PII Protection',
    difficulty: 'Medium',
    codeTemplate: `import anthropic
import json
import re

client = anthropic.Anthropic()

# ============================================
# EXAM SCENARIO: PII redaction at tool boundaries
# ============================================
# Data crosses trust boundaries at the TOOL LAYER
# Redact BEFORE passing results back to Claude
# ============================================

PII_REDACTIONS = {
    "ssn": (r'\\d{3}-\\d{2}-\\d{4}', '[SSN_REDACTED]'),
    "email": (r'[\\w.-]+@[\\w.-]+\\.\\w+', '[EMAIL_REDACTED]'),
    "phone": (r'\\b\\d{3}[-.]?\\d{3}[-.]?\\d{4}\\b', '[PHONE_REDACTED]'),
    "credit_card": (r'\\d{4}[-\\s]?\\d{4}[-\\s]?\\d{4}[-\\s]?\\d{4}', '[CC_REDACTED]'),
}


def redact_pii(text: str) -> tuple[str, list]:
    """Redact PII from text at the tool boundary."""
    redactions = []
    for pii_type, (pattern, replacement) in PII_REDACTIONS.items():
        matches = re.findall(pattern, text)
        for m in matches:
            redactions.append({"type": pii_type, "original": m})
        text = re.sub(pattern, replacement, text)
    return text, redactions


def tool_with_redaction(tool_name: str, raw_result: str) -> str:
    """Simulates a tool that redacts PII at the boundary."""
    print(f"\\n🔧 [TOOL] {tool_name} executed")
    print(f"   Raw result (contains PII!):")
    print(f"   {raw_result[:200]}")

    # ✅ REDACT at tool boundary — BEFORE Claude sees it
    cleaned, redactions = redact_pii(raw_result)

    if redactions:
        print(f"\\n   🔒 Redacted {len(redactions)} PII item(s):")
        for r in redactions:
            print(f"      - {r['type']}: {r['original'][:3]}...{r['original'][-2:]} → {PII_REDACTIONS[r['type']][1]}")
    else:
        print(f"   ✅ No PII detected")

    print(f"\\n   Cleaned result (safe for Claude):")
    print(f"   {cleaned[:200]}")

    return cleaned


if __name__ == "__main__":
    # Simulated database query result with PII
    raw_customer_data = json.dumps({
        "name": "Jane Smith",
        "email": "jane.smith@company.com",
        "phone": "555-123-4567",
        "ssn": "123-45-6789",
        "credit_card": "4111-1111-1111-1111",
        "order_count": 15,
        "last_order": "2024-12-01",
    }, indent=2)

    print("=" * 60)
    print("PII REDACTION AT TOOL BOUNDARIES")
    print("=" * 60)

    cleaned = tool_with_redaction("lookup_customer", raw_customer_data)

    # Verify Claude only sees redacted data
    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=128,
        messages=[{"role": "user", "content": f"Summarize this customer record:\\n{cleaned}"}],
    )
    result = next(b.text for b in response.content if b.type == "text")
    print(f"\\n📋 Claude's summary (no PII visible):")
    print(f"   {result[:200]}")

    print(f"\\n{'═'*60}")
    print("EXAM KEY:")
    print("  Redact at TOOL BOUNDARIES (not at Claude level)")
    print("  Least information principle: only pass what's needed")
    print("  Safe logging with field-level redaction")
    print("  Error messages must NOT expose PII")
    print(f"{'═'*60}")`,
    expectedOutput: `Raw: email, phone, SSN, credit card visible
Redacted: all PII replaced with [TYPE_REDACTED]
Claude summary: mentions order count and name only`,
    brokenCode: `# ❌ BROKEN: PII leaks through tool outputs
# 🐛 BUG: Tool returns raw PII (email, phone, SSN) — no filtering
import anthropic
import json
import re

client = anthropic.Anthropic()

customer_tool = {
    "name": "get_customer",
    "description": "Get customer information.",
    "input_schema": {
        "type": "object",
        "properties": {
            "customer_id": {"type": "string", "description": "Customer ID"}
        },
        "required": ["customer_id"],
    },
}

def execute_tool(name: str, inputs: dict) -> str:
    if name == "get_customer":
        # 🐛 Tool returns raw PII (email, phone, SSN)
        return json.dumps({
            "name": "João Silva",
            "email": "joao.silva@email.com",  # 🐛 Raw PII!
            "phone": "+55-11-99999-1234",  # 🐛 Raw PII!
            "ssn": "123.456.789-00",  # 🐛 Raw SSN!
            "address": "Rua Secreta 123, São Paulo"
        })
    return json.dumps({"error": "Unknown tool"})


def redact_pii(text: str) -> str:
    """Redact PII from text."""
    text = re.sub(r'[\\w.-]+@[\\w.-]+\\.[\\w]+', '[EMAIL]', text)
    text = re.sub(r'\\+?\\d{1,3}[- ]?\\d{2,5}[- ]?\\d{4}[- ]?\\d{4}', '[PHONE]', text)
    text = re.sub(r'\\d{3}\\.?\\d{3}\\.?\\d{3}-?\\d{2}', '[SSN]', text)
    return text


def run_agent_broken(prompt: str) -> str:
    """🐛 BROKEN: No PII filtering on tool outputs."""
    messages = [{"role": "user", "content": prompt}]

    print(f"🚀 [AGENT START] Prompt: \\"{prompt}\\"")

    for turn in range(5):
        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1024,
            tools=[customer_tool],
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
                print(f"   🐛 Raw output: {output[:100]}...")
                # 🐛 No PII filtering! Raw data goes straight to context!
                tool_results.append({
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": output,  # 🐛 No PII filtering!
                })

        if tool_results:
            messages.append({"role": "user", "content": tool_results})

    return "Agent hit turn limit"


if __name__ == "__main__":
    result = run_agent_broken("Show me customer C001's contact info")
    print(f"\\n📋 Result: {result}")
    print("\\n🐛 PII (email, phone, SSN) leaked through tool output into response!")
    print("🐛 Should filter/redact PII before adding tool result to context")
`,
    hints: ["PII can leak through tool outputs into conversation context.", "Filter tool outputs BEFORE appending to message history.", "Use post-tool-use hooks for automated PII redaction."],
    fixes: ["Add post-tool hook that scans outputs for PII patterns.", "Redact email, phone, SSN, credit card before returning.", "Apply redaction at the tool boundary, not just edges."],
  };

export default es_23;
