import type { ScenarioLab } from './types';

const es_19: ScenarioLab = {
    id: 'es-19',
    title: 'Multi-Instance Review — Self-Review Bias',
    domain: 'Domain 4 — Prompt Engineering',
    domainNum: 4,
    scenario: 'Same Claude instance generates and reviews code. Review misses obvious bugs because Claude is biased toward its own output. Use separate instances with independent context.',
    examTopic: '4.6 Multi-Instance Review',
    difficulty: 'Medium',
    codeTemplate: `import anthropic
import json

client = anthropic.Anthropic()

# ============================================
# EXAM SCENARIO: Self-review bias
# ============================================
# BROKEN: Same instance generates and reviews → misses own bugs
# FIXED: Separate instances with independent context
# ============================================

CODE_TASK = "Write a Python function that validates email addresses"
REVIEW_TASK = """Review this code for bugs. List every issue you find.
Be thorough — check for edge cases, error handling, and correctness."""


def generate_code() -> str:
    """Instance 1: Generate code."""
    print("🔨 [INSTANCE 1 — GENERATOR] Writing code...")
    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=256,
        messages=[{"role": "user", "content": CODE_TASK}],
    )
    code = next(b.text for b in response.content if b.type == "text")
    print(f"   Generated {len(code)} chars of code")
    return code


def review_same_instance(code: str) -> str:
    """❌ BROKEN: Review in same conversation → biased."""
    print("\\n❌ [SAME INSTANCE] Reviewing own code...")
    print("   Problem: Claude just wrote this code → it's biased")
    print("   It will likely say 'looks good' or find fewer issues")
    # Simulated — in real use, this would be in the same message chain
    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=256,
        system="You just wrote this code. Review it for any issues.",
        messages=[{"role": "user", "content": f"Review this code you wrote:\\n\\n{code}"}],
    )
    review = next(b.text for b in response.content if b.type == "text")
    issues = review.count("-") + review.count("1.") + review.count("2.")
    print(f"   Issues found: ~{issues} (likely fewer due to bias)")
    return review


def review_separate_instance(code: str) -> str:
    """✅ FIXED: Review in separate instance → unbiased."""
    print("\\n✅ [SEPARATE INSTANCE] Independent review...")
    print("   Fresh instance → no bias from code generation")
    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=256,
        system=REVIEW_TASK,
        messages=[{"role": "user", "content": f"Review this code thoroughly:\\n\\n{code}"}],
    )
    review = next(b.text for b in response.content if b.type == "text")
    issues = review.count("-") + review.count("1.") + review.count("2.")
    print(f"   Issues found: ~{issues} (likely more — unbiased)")
    return review


if __name__ == "__main__":
    code = generate_code()
    review_same_instance(code)
    review_separate_instance(code)

    print(f"\\n{'═'*60}")
    print("EXAM KEY:")
    print("  Same instance = biased review (Claude trusts its own code)")
    print("  Separate instances = independent, thorough review")
    print("  Multi-pass: local → integration → architecture")
    print("  Confidence for ROUTING, not TRUST")
    print(f"{'═'*60}")`,
    expectedOutput: `SAME instance: finds 1-2 minor issues
SEPARATE instance: finds 4-5 issues including edge cases`,
    brokenCode: `# ❌ BROKEN: Same model reviews its own code
# 🐛 BUG: Same model reviews its own code — blind spots!
import anthropic
import json

client = anthropic.Anthropic()

# 🐛 BROKEN: Same model generates AND reviews
def generate_and_review_broken(task: str) -> dict:
    """🐛 Same model writes and reviews — confirms its own mistakes."""
    # Step 1: Generate code
    gen_response = client.messages.create(
        model="claude-sonnet-4-20250514",  # 🐛 Model A generates
        max_tokens=2048,
        messages=[{"role": "user", "content": f"Write Python code: {task}"}],
    )
    generated_code = gen_response.content[0].text

    print(f"📝 Generated code ({len(generated_code)} chars)")

    # Step 2: Review — SAME model! 🐛
    review_response = client.messages.create(
        model="claude-sonnet-4-20250514",  # 🐛 SAME model reviews!
        max_tokens=1024,
        messages=[{"role": "user", "content": f"Review this code for bugs:\\n{generated_code}"}],
    )
    review = review_response.content[0].text

    print(f"🔍 Review: {review[:200]}...")
    return {"code": generated_code, "review": review}


# ✅ CORRECT: Different model reviews
def generate_and_review_correct(task: str) -> dict:
    """✅ Different model reviews — catches more issues."""
    # Step 1: Generate with one model
    gen_response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=2048,
        messages=[{"role": "user", "content": f"Write Python code: {task}"}],
    )
    generated_code = gen_response.content[0].text

    # Step 2: Review with a DIFFERENT model
    review_response = client.messages.create(
        model="claude-opus-4-20250514",  # ✅ Different, stronger model reviews!
        max_tokens=1024,
        messages=[{"role": "user", "content": f"Review this code for bugs:\\n{generated_code}"}],
    )
    review = review_response.content[0].text

    return {"code": generated_code, "review": review}


if __name__ == "__main__":
    task = "A function that calculates the average of a list of numbers"
    print("🐛 BROKEN: Same model reviews its own code")
    print("=" * 60)
    result = generate_and_review_broken(task)
    print()
    print("🐛 Problem: Model tends to approve its own patterns and miss its own blind spots")
    print("✅ Fix: Use a different (ideally stronger) model for review")
`,
    hints: ["Self-review bias: models tend to approve their own output.", "Use different models or sessions for writing vs reviewing.", "Multi-instance evaluation catches more issues."],
    fixes: ["Use a DIFFERENT model or temperature for review vs generation.", "Run multiple independent reviews and aggregate findings.", "Add a \"devil advocate\" prompt specifically looking for flaws."],
  };

export default es_19;
