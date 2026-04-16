import type { ScenarioLab } from './types';

const es_22: ScenarioLab = {
    id: 'es-22',
    title: 'Escalation — "This is Ridiculous, Let Me Talk to Your Manager"',
    domain: 'Domain 5 — Safety & Production',
    domainNum: 5,
    scenario: 'Customer says "this is ridiculous, let me talk to your manager." Is this an escalation trigger? YES — "let me talk to your manager" is an EXPLICIT escalation request, even though it includes frustration sentiment.',
    examTopic: '5.2 Escalation Triggers',
    difficulty: 'Easy',
    codeTemplate: `import anthropic
import json

client = anthropic.Anthropic()

# ============================================
# EXAM SCENARIO: Escalation trigger detection
# ============================================
# "This is ridiculous" = sentiment (alone ≠ trigger)
# "Let me talk to your manager" = EXPLICIT request (= trigger!)
# The full sentence is an explicit escalation request.
# ============================================

ESCALATION_SYSTEM = """You are a customer service agent. Determine if the user's message requires IMMEDIATE escalation to a human.

Rules:
- EXPLICIT request for human/manager/supervisor → IMMEDIATE escalation
- "Talk to a human", "let me speak to your manager", "connect me to a real person" = explicit
- Frustration/sentiment alone ("this is frustrating", "ugh") = NOT a trigger
- Multiple ambiguous matches → ask for clarification

Return JSON:
{
  "escalate": true/false,
  "reason": "explicit_request" | "sentiment_only" | "unclear",
  "action": "immediate_escalation" | "attempt_help" | "clarify"
}"""

test_messages = [
    ("This is ridiculous, let me talk to your manager", True, "Explicit 'talk to manager'"),
    ("I'm so frustrated with this service", False, "Sentiment only, no explicit request"),
    ("Connect me to a human right now", True, "Explicit 'human' request"),
    ("Ugh, this is the worst experience ever", False, "Sentiment only"),
    ("I want to speak to your supervisor about this charge", True, "Explicit 'supervisor' request"),
    ("Can you try to fix it first?", False, "Asking agent to help, not escalate"),
]


def test_escalation(message: str, expected: bool, note: str):
    print(f"\\n{'─'*50}")
    print(f"💬 \\"{message}\\"")
    print(f"   Expected: {'ESCALATE' if expected else 'NO escalate'} ({note})")

    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=128,
        system=ESCALATION_SYSTEM,
        messages=[{"role": "user", "content": message}],
    )
    result = next(b.text for b in response.content if b.type == "text")
    print(f"   Claude says: {result[:150]}")

    # Check if it matches expected
    escalate_in_result = '"escalate": true' in result or "'escalate': true" in result
    match = "✅" if escalate_in_result == expected else "❌"
    print(f"   {match} {'Correct' if escalate_in_result == expected else 'WRONG'}!")


if __name__ == "__main__":
    for msg, expected, note in test_messages:
        test_escalation(msg, expected, note)

    print(f"\\n{'═'*60}")
    print("EXAM KEY:")
    print("  Explicit request → IMMEDIATE escalation (no 'let me try first')")
    print("  Sentiment alone → NOT a trigger (frustration ≠ escalation)")
    print("  'This is ridiculous + let me talk to manager' = EXPLICIT")
    print("  Multiple ambiguous → ask for clarification")
    print(f"{'═'*60}")`,
    expectedOutput: `"let me talk to your manager" → escalate: true (explicit)
"I'm so frustrated" → escalate: false (sentiment only)
"Connect me to a human" → escalate: true (explicit)`,
    brokenCode: `# ❌ BROKEN: No escalation for frustrated users
# 🐛 BUG: Agent keeps trying to help even when user is clearly frustrated
import anthropic
import json

client = anthropic.Anthropic()

ticket_tool = {
    "name": "create_ticket",
    "description": "Create a support ticket for human review.",
    "input_schema": {
        "type": "object",
        "properties": {
            "issue": {"type": "string", "description": "Issue description"},
            "priority": {"type": "string", "description": "Priority level"}
        },
        "required": ["issue"],
    },
}

def execute_tool(name: str, inputs: dict) -> str:
    print(f"🔧 [TOOL EXEC] {name}({json.dumps(inputs)[:100]}...)")
    if name == "create_ticket":
        return json.dumps({"ticket_id": "SUP-12345", "status": "escalated"})
    return json.dumps({"error": "Unknown tool"})


# 🐛 BROKEN: No escalation awareness in system prompt
BROKEN_SYSTEM = "You are a helpful customer support agent. Answer all questions."


def detect_frustration(message: str) -> bool:
    """Simple frustration detection."""
    signals = ["ridiculous", "manager", "unacceptable", "terrible", "worst",
               "hate", "angry", "furious", "done with this", "joke"]
    return any(s in message.lower() for s in signals)


def run_agent_broken(conversation: list[str]) -> str:
    """🐛 BROKEN: No escalation path for frustrated users."""
    messages = []

    for user_msg in conversation:
        messages.append({"role": "user", "content": user_msg})

        # 🐛 Even if frustrated, agent keeps trying to help
        if detect_frustration(user_msg):
            print(f"   ⚠️  Frustration detected: \\"{user_msg}\\"")
            print(f"   🐛 But agent keeps responding, never escalates!")

        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1024,
            system=BROKEN_SYSTEM,  # 🐛 No escalation instructions!
            tools=[ticket_tool],
            messages=messages,
        )

        messages.append({"role": "assistant", "content": response.content})
        text = next((b.text for b in response.content if b.type == "text"), "")
        print(f"   User: {user_msg[:60]}...")
        print(f"   Agent: {text[:100]}...")

    return text


if __name__ == "__main__":
    # Simulated frustrated user conversation
    conversation = [
        "My order hasn't arrived after 2 weeks",
        "I already tried tracking it, that doesn't work",
        "This is ridiculous, I want to speak to a manager!",  # 🐛 Frustration!
        "Are you even listening? TRANSFER ME NOW!",  # 🐛 ESCALATION NEEDED!
    ]

    print("🐛 BROKEN: Agent never escalates to human support")
    print("=" * 60)
    run_agent_broken(conversation)
    print("\\n🐛 Problem: User explicitly asked for manager, agent keeps auto-responding")
`,
    hints: ["Detect escalation: frustration keywords, repeated complaints.", "Implement classification before each response.", "Route to human when escalation is detected."],
    fixes: ["Add escalation detection for keywords like \"manager\", \"ridiculous\".", "When triggered, transfer to human with conversation summary.", "Set frustration counter: after N negative interactions, auto-escalate."],
  };

export default es_22;
