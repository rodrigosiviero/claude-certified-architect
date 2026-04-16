import type { ScenarioLab } from './types';

const es_16: ScenarioLab = {
    id: 'es-16',
    title: 'Explicit Criteria — Vague Review Bot Flags Everything',
    domain: 'Domain 4 — Prompt Engineering',
    domainNum: 4,
    scenario: 'A code review bot flags 50 issues per file, 45 are style opinions. The system prompt says "be conservative" and "flag potential issues." Rewrite with explicit categorical criteria.',
    examTopic: '4.1 Explicit Criteria',
    difficulty: 'Medium',
    codeTemplate: `import anthropic
import json

client = anthropic.Anthropic()

# ============================================
# EXAM SCENARIO: Vague → explicit criteria
# ============================================
# BROKEN: "be conservative, flag potential issues" → flags everything
# FIXED: CRITICAL/WARNING/INFO with concrete definitions
# ============================================

# ❌ BROKEN: Vague instructions
VAGUE_SYSTEM = """You are a code reviewer. Be conservative and flag potential issues.
Review the code carefully and report any problems you find."""

# ✅ FIXED: Explicit categorical criteria
EXPLICIT_SYSTEM = """You are a code reviewer. Categorize every finding as:

CRITICAL — Must fix before merge:
- SQL injection, XSS, or any security vulnerability
- Authentication/authorization bypass
- Data loss or corruption risk
- Race conditions in concurrent code

WARNING — Should fix soon:
- Missing error handling (try/catch, .catch())
- Resource leaks (unclosed connections, file handles)
- Hardcoded configuration values
- Missing input validation

INFO — Consider for improvement:
- Naming could be clearer
- Code could be more DRY
- Performance optimization opportunity

Do NOT flag:
- Style preferences (semicolons, quotes, etc.)
- Personal naming conventions
- Formatting choices handled by Prettier/ESLint
- Hypothetical future requirements"""

sample_code = """
app.post('/api/users', (req, res) => {
  const query = "SELECT * FROM users WHERE email = '" + req.body.email + "'";
  db.query(query, (err, results) => {
    if (results.length > 0) {
      res.json(results[0]);
    }
  });
});
"""

def review_with(system: str, label: str):
    print(f"\\n{'='*60}")
    print(f"🧪 Review with {label} system prompt:")
    print("=" * 60)
    print(f"\\nCode to review:")
    print(sample_code)

    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=512,
        system=system,
        messages=[{"role": "user", "content": f"Review this code:\\n---javascript---\\n{sample_code}\\n---"}],
    )
    result = next(b.text for b in response.content if b.type == "text")
    print(f"\\n📋 Review result:")
    print(f"   {result[:400]}...")


if __name__ == "__main__":
    review_with(VAGUE_SYSTEM, "❌ VAGUE")
    review_with(EXPLICIT_SYSTEM, "✅ EXPLICIT")

    print(f"\\n{'═'*60}")
    print("EXAM KEY:")
    print("  Vague instructions → over-flagging → noisy alerts → ignored")
    print("  Explicit criteria → precise flagging → actionable alerts")
    print("  'When NOT to flag' is as important as 'what to flag'")
    print(f"{'═'*60}")`,
    expectedOutput: `VAGUE: Flags 10+ issues including style opinions
EXPLICIT: Flags 2 CRITICAL (SQL injection, missing error handling) + 1 WARNING`,
    brokenCode: `# ❌ BROKEN: Vague system prompt flags everything
# 🐛 BUG: No criteria, no rules, no guidance — flags everything!
import anthropic
import json

client = anthropic.Anthropic()

code_read_tool = {
    "name": "read_file",
    "description": "Read a file.",
    "input_schema": {
        "type": "object",
        "properties": {
            "path": {"type": "string", "description": "File path"}
        },
        "required": ["path"],
    },
}

def execute_tool(name: str, inputs: dict) -> str:
    return json.dumps({"content": "def hello(): print('hello')"});


def run_agent(code_path: str) -> str:
    """🐛 BROKEN: Vague system prompt flags everything."""
    messages = [{"role": "user", "content": f"Review {code_path} for issues"}]

    # 🐛 BUG: No criteria, no rules, no guidance!
    SYSTEM_PROMPT = "You are a code reviewer. Flag all problems."  # Too vague!

    print(f"🚀 [AGENT START] Reviewing: {code_path}")
    print(f"   System: {SYSTEM_PROMPT}")

    for turn in range(5):
        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1024,
            system=SYSTEM_PROMPT,  # 🐛 "Flag all problems" — no specificity!
            tools=[code_read_tool],
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
    result = run_agent("src/utils.py")
    print(f"\\n📋 Result: {result}")
    print("\\n🐛 Result: Flags naming, tests, style... false positives everywhere!")
    print("🐛 Should have specific criteria: security, performance, bugs")
`,
    hints: ["System prompts need EXPLICIT classification criteria.", "Include rules for what NOT to flag (reduce false positives).", "Vague prompts lead to over-flagging and developer fatigue."],
    fixes: ["Define categories: CRITICAL (security), WARNING (bugs), INFO (style).", "Add: \"Do NOT flag missing tests or naming conventions.\"", "Include: \"When in doubt, do NOT flag.\""],
  };

export default es_16;
