import type { ScenarioLab } from './types';

const es_14: ScenarioLab = {
    id: 'es-14',
    title: 'CI/CD — Missing -p Flag Hangs Pipeline',
    domain: 'Domain 3 — Claude Code Best Practices',
    domainNum: 3,
    scenario: 'A GitHub Actions pipeline with Claude Code hangs indefinitely. The -p flag is missing, so Claude enters interactive mode waiting for user input that never comes.',
    examTopic: '3.6 CI/CD Integration',
    difficulty: 'Easy',
    codeTemplate: `# ============================================
# EXAM SCENARIO: CI pipeline hangs without -p flag
# ============================================
# BROKEN: claude "review this PR" → enters interactive mode → hangs forever
# FIXED: claude -p "review this PR" → non-interactive → completes
# ============================================

print("=" * 60)
print("BROKEN GitHub Actions workflow:")
print("=" * 60)

broken_workflow = """
name: Code Review
on: [pull_request]
jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Review with Claude
        run: |
          npm install -g @anthropic-ai/claude-code
          claude "Review this PR and find bugs"  # ❌ HANGS!
        # Without -p, Claude enters interactive mode
        # It waits for user input... which never comes in CI
        # GitHub Actions kills it after 6 hours (default timeout)
"""

print(broken_workflow)
print("⚠️  Pipeline hangs because Claude enters INTERACTIVE mode")
print("   No user to respond → waits forever → CI times out")

print(f"\\n{'='*60}")
print("FIXED GitHub Actions workflow:")
print("=" * 60)

fixed_workflow = """
name: Code Review
on: [pull_request]
jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Generate review with Claude
        run: |
          claude -p "Review the changes in this PR. List any bugs or issues." \\
            > review_output.md 2>&1  # ✅ -p flag = non-interactive
        env:
          ANTHROPIC_API_KEY: \\$\\{\\{ secrets.ANTHROPIC_API_KEY \\}\\}

      - name: Upload review
        uses: actions/upload-artifact@v4
        with:
          name: claude-review
          path: review_output.md
"""

print(fixed_workflow)
print("✅ -p flag makes Claude run in non-interactive (print) mode")
print("   Output goes to stdout → can be captured and uploaded")

print(f"\\n{'═'*60}")
print("EXAM KEY: CI/CD with Claude Code")
print("  -p flag is MANDATORY in CI/CD (no interactive mode)")
print("  Every CI session is stateless — no memory between runs")
print("  Separate sessions for generation and review")
print("  Include prior findings + test context in the prompt")
print("  Document fixtures and setup in CLAUDE.md")
print(f"{'═'*60}")`,
    expectedOutput: `Shows broken vs fixed GitHub Actions workflow.
Key: -p flag is mandatory for non-interactive CI mode.`,
    brokenCode: `# ❌ BROKEN: Interactive mode in CI pipeline
# 🐛 BUG: No -p flag! Claude prompts for input forever in CI
import subprocess
import json

# BROKEN CI pipeline command:
def broken_ci_review():
    """🐛 No -p flag — Claude waits for interactive input."""
    print("🚀 Running Claude code review in CI...")
    print("=" * 60)

    # 🐛 BUG: Missing --print (-p) flag!
    # In CI, there's no terminal for interactive input
    cmd = [
        "claude",
        "Review this PR and suggest fixes"  # 🐛 No -p flag!
    ]

    print(f"Command: {' '.join(cmd)}")
    print()
    print("🐛 What happens:")
    print("   1. Claude starts in interactive mode")
    print("   2. Prompts: 'Do you want me to proceed?'")
    print("   3. CI has no stdin → hangs forever")
    print("   4. CI timeout kills the job after 30 minutes")
    print()

    # ✅ CORRECT approach:
    correct_cmd = [
        "claude",
        "-p",  # ✅ Print mode — no interactive prompts!
        "--output-format", "json",  # ✅ Machine-readable output
        "Review this PR and suggest fixes"
    ]

    print("✅ CORRECT command:")
    print(f"   {' '.join(correct_cmd)}")
    print()
    print("Key flags for CI usage:")
    print("   -p / --print         → Non-interactive mode")
    print("   --output-format json → Machine-readable output")
    print("   --max-turns 5        → Limit agentic turns")
    print("   --allowedTools       → Restrict tool access")


def broken_ci_tests():
    """Another common mistake: running tests interactively."""
    print("\\n" + "=" * 60)
    print("🐛 Another broken CI pattern:")
    print("=" * 60)

    broken_cmd = 'claude "Run all tests and fix failures"'
    print(f"   Command: {broken_cmd}")
    print("   🐛 No -p flag! Claude will ask 'Should I fix this test?'")
    print()

    correct_cmd = 'claude -p --max-turns 10 "Run all tests and fix failures"'
    print(f"   ✅ Correct: {correct_cmd}")


if __name__ == "__main__":
    broken_ci_review()
    broken_ci_tests()
`,
    hints: ["The -p flag runs Claude in non-interactive (print) mode — required for CI.", "Without -p, Claude prompts the user and the pipeline hangs.", "CI environments have no terminal for interactive input."],
    fixes: ["Always use: claude -p \"your prompt\" in CI/CD.", "Set ANTHROPIC_API_KEY via GitHub Secrets.", "The -p flag outputs to stdout, perfect for CI artifacts."],
  };

export default es_14;
