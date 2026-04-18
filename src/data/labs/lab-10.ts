const lab_10 = {
    id: 'lab-10',
    title: 'Prompt Engineering Masterclass',
    domain: 'Domain 4 — Prompt Engineering',
    examTopics: ['4.1 Explicit Criteria', '4.2 Few-Shot Examples', '4.3 Structured Output'],
    difficulty: 'Intermediate',
    duration: '40 min',
    description: 'Master the three pillars of prompt engineering: explicit system prompts, few-shot examples, and extended thinking for complex reasoning.',
    objectives: [
      'Write explicit system prompts with classification criteria',
      'Craft few-shot examples for ambiguous cases',
      'Use extended thinking (thinking budget) for complex analysis',
      'Compare prompt engineering approaches side by side',
    ],
    setup: 'Python 3.10+ with anthropic SDK',
    steps: [
      'Write a naive system prompt (common mistake)',
      'Upgrade to explicit criteria system prompt',
      'Add few-shot examples for edge cases',
      'Enable extended thinking for deep analysis',
    ],
    codeTemplate: `import anthropic
import json
import sys

client = anthropic.Anthropic()

print("=" * 60, file=sys.stderr)
print("🧪 LAB 10: Prompt Engineering Masterclass", file=sys.stderr)
print("=" * 60, file=sys.stderr)

# --- Approach 1: NAIVE system prompt (common mistake) ---
NAIVE_SYSTEM = "You are a code reviewer. Find bugs and issues in the code."

# --- Approach 2: EXPLICIT CRITERIA (exam best practice) ---
EXPLICIT_SYSTEM = """You are a security-focused code reviewer.

## Classification Categories
- CRITICAL: SQL injection, auth bypass, hardcoded secrets, RCE vulnerabilities
- WARNING: Missing error handling, potential race conditions, unvalidated inputs
- INFO: Style issues, missing docs, non-idiomatic patterns

## Rules
- When in doubt, do NOT flag. False positives destroy developer trust.
- Each finding MUST include: line number, category, explanation, fix suggestion.
- Do NOT flag: missing tests, performance optimizations, naming conventions.
- ONLY flag actual bugs and security issues.
"""

# --- Approach 3: Few-Shot Examples (targeted at ambiguous cases) ---
FEWSHOT_USER = """Review this code for security issues.

<example>
Input: query = f"SELECT * FROM users WHERE id = {user_id}"
Thought: Direct string interpolation in SQL = SQL injection vulnerability.
Output: [{{"line": 1, "category": "CRITICAL", "issue": "SQL injection via f-string interpolation", "fix": "Use parameterized queries: cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))"}}]

Input: result = requests.get(url)
Thought: Simple GET request, no user input in URL, no security issue.
Output: []  # No findings — this is safe code
</example>

Now review:
{code}
"""


def review_naive(code: str) -> str:
    print(f"\\n{'═' * 60}", file=sys.stderr)
    print(f"🧪 [APPROACH 1] NAIVE system prompt", file=sys.stderr)
    print(f"   System: '{NAIVE_SYSTEM}'", file=sys.stderr)
    print(f"   📤 [REQUEST] Sending...", file=sys.stderr)

    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=2048,
        system=NAIVE_SYSTEM,
        messages=[{"role": "user", "content": f"Review this code:\\n{code}"}],
    )

    print(f"   📥 [RESPONSE] stop_reason={response.stop_reason}", file=sys.stderr)
    text = next(b.text for b in response.content if b.type == "text")
    print(f"   📊 Result: {len(text)} chars", file=sys.stderr)
    return text


def review_explicit(code: str) -> str:
    print(f"\\n{'═' * 60}", file=sys.stderr)
    print(f"🧪 [APPROACH 2] EXPLICIT CRITERIA system prompt", file=sys.stderr)
    print(f"   System: structured with categories + rules", file=sys.stderr)
    print(f"   📤 [REQUEST] Sending...", file=sys.stderr)

    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=2048,
        system=EXPLICIT_SYSTEM,
        messages=[{"role": "user", "content": f"Review this code:\\n{code}"}],
    )

    print(f"   📥 [RESPONSE] stop_reason={response.stop_reason}", file=sys.stderr)
    text = next(b.text for b in response.content if b.type == "text")
    print(f"   📊 Result: {len(text)} chars", file=sys.stderr)
    return text


def review_with_thinking(code: str) -> str:
    print(f"\\n{'═' * 60}", file=sys.stderr)
    print(f"🧪 [APPROACH 3] EXTENDED THINKING + Few-Shot", file=sys.stderr)
    print(f"   System: explicit criteria", file=sys.stderr)
    print(f"   Thinking budget: 5000 tokens", file=sys.stderr)
    print(f"   Few-shot: 2 examples provided", file=sys.stderr)
    print(f"   📤 [REQUEST] Sending...", file=sys.stderr)

    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=4096,
        system=EXPLICIT_SYSTEM,
        thinking={
            "type": "enabled",
            "budget_tokens": 5000,
        },`,
};

export default lab_10;
