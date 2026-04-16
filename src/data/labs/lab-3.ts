const lab_3 = {
    id: 'lab-3',
    title: 'SDK Hooks & Session Management',
    domain: 'Domain 1 — Agentic Engineering',
    examTopics: ['1.5 SDK Hooks', '1.7 Session State & Resumption'],
    difficulty: 'Intermediate',
    duration: '35 min',
    description: 'Implement SDK hooks for logging and guardrails, plus session persistence that allows resuming interrupted agentic loops.',
    objectives: [
      'Register pre-tool-use and post-tool-use hooks',
      'Implement guardrail logic inside hooks',
      'Serialize and persist session state',
      'Resume an interrupted agentic loop from saved state',
    ],
    setup: 'Python 3.10+ with anthropic SDK',
    steps: [
      'Define hook callbacks for pre and post tool execution',
      'Implement a simple guardrail (PII redaction)',
      'Build session state serialization',
      'Test loop interruption and resumption',
    ],
    codeTemplate: `import anthropic
import json
import re
import sys

client = anthropic.Anthropic()

print("=" * 60, file=sys.stderr)
print("🧪 LAB 3: SDK Hooks & Session Management", file=sys.stderr)
print("=" * 60, file=sys.stderr)

# --- Simulated Hooks (SDK-level callbacks) ---
print("\\n📦 [SETUP] Registering SDK hooks...", file=sys.stderr)

def pre_tool_use_hook(tool_name: str, tool_input: dict) -> dict:
    """Hook: runs BEFORE each tool call. Can modify inputs or block the call."""
    print(f"\\n🪝 [PRE-TOOL-HOOK] Triggered for '{tool_name}'", file=sys.stderr)
    print(f"   📥 Raw input: {json.dumps(tool_input, indent=2)}", file=sys.stderr)

    # Guardrail: redact PII from inputs
    for key, value in tool_input.items():
        if isinstance(value, str):
            redacted, count = redact_pii(value)
            if count > 0:
                tool_input[key] = redacted
                print(f"   🔒 Redacted {count} PII item(s) in '{key}'", file=sys.stderr)

    print(f"   ✅ Pre-hook complete — tool call ALLOWED", file=sys.stderr)
    return tool_input


def post_tool_use_hook(tool_name: str, tool_output: str) -> str:
    """Hook: runs AFTER each tool call. Can modify or filter output."""
    print(f"\\n🪝 [POST-TOOL-HOOK] Triggered for '{tool_name}'", file=sys.stderr)

    # Guardrail: redact PII from outputs
    redacted, count = redact_pii(tool_output)
    if count > 0:
        print(f"   🔒 Redacted {count} PII item(s) from output", file=sys.stderr)
        return redacted

    print(f"   ✅ Post-hook complete — output unchanged", file=sys.stderr)
    return tool_output


PII_PATTERNS = {
    "email": r"[\\w.-]+@[\\w.-]+\\.\\w+",
    "phone": r"\\b\\d{3}[-.]?\\d{3}[-.]?\\d{4}\\b",
    "ssn": r"\\b\\d{3}-\\d{2}-\\d{4}\\b",
}

def redact_pii(text: str) -> tuple[str, int]:
    total = 0
    for pii_type, pattern in PII_PATTERNS.items():
        matches = re.findall(pattern, text)
        if matches:
            total += len(matches)
            text = re.sub(pattern, f"[REDACTED_{pii_type.upper()}]", text)
    return text, total


print("   ✅ pre_tool_use_hook registered", file=sys.stderr)
print("   ✅ post_tool_use_hook registered", file=sys.stderr)
print("   ✅ PII patterns loaded: email, phone, ssn", file=sys.stderr)


# --- Session State Management ---
class SessionManager:
    def __init__(self):
        self.sessions = {}
        print("\\n💾 [SESSION] SessionManager initialized", file=sys.stderr)

    def save(self, session_id: str, messages: list, turn: int):
        self.sessions[session_id] = {
            "messages": messages,
            "turn": turn,
        }
        print(f"\\n💾 [SESSION SAVE] session_id={session_id}", file=sys.stderr)
        print(f"   📊 State: {len(messages)} messages, turn={turn}", file=sys.stderr)

    def load(self, session_id: str) -> dict | None:
        state = self.sessions.get(session_id)
        if state:
            print(f"\\n💾 [SESSION LOAD] session_id={session_id}", file=sys.stderr)
            print(f"   📊 State: {len(state['messages'])} messages, turn={state['turn']}", file=sys.stderr)
        else:
            print(f"\\n💾 [SESSION LOAD] session_id={session_id} — NOT FOUND", file=sys.stderr)
        return state

session_mgr = SessionManager()


# --- Tool Definitions ---
customer_tool = {
    "name": "lookup_customer",
    "description": "Look up customer by email or ID",
    "input_schema": {
        "type": "object",
        "properties": {
            "query": {"type": "string", "description": "Customer email or ID"},
};
        "required": ["query"],
};
}

MOCK_CUSTOMERS = {
    "alice@example.com": {"name": "Alice", "email": "alice@example.com", "phone": "555-123-4567", "ssn": "123-45-6789"},
}


def execute_tool(name: str, inputs: dict) -> str:
    print(f"\\n🔧 [TOOL EXEC] {name}({json.dumps(inputs)})", file=sys.stderr)
    if name == "lookup_customer":
        query = inputs.get("query", "")
        for key, data in MOCK_CUSTOMERS.items():
            if query in key or query in str(data):
                output = json.dumps(data)
                print(f"   ✅ Found customer: {data['name']}", file=sys.stderr)
                return output
    print(f"   ❌ No customer found", file=sys.stderr)
    return json.dumps({"error": "Customer not found"})


# --- Agentic Loop with Hooks ---
def run_agent(prompt: str, session_id: str = "s1", max_turns: int = 5) -> str:
    print(f"\\n🚀 [AGENT START] session_id={session_id}", file=sys.stderr)
    print(f"   📝 Prompt: \\"{prompt}\\"", file=sys.stderr)

    messages = [{"role": "user", "content": prompt}]

    for turn in range(max_turns):
        print(f"\\n{'─' * 60}", file=sys.stderr)
        print(f"🔄 [LOOP TURN {turn + 1}/{max_turns}]", file=sys.stderr)
        print(f"📤 [REQUEST] Sending to API (context: {len(messages)} msgs)", file=sys.stderr)

        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1024,
            tools=[customer_tool],
            messages=messages,
        )

        print(f"📥 [RESPONSE] stop_reason={response.stop_reason},`,
};

export default lab_3;
