import type { ScenarioLab } from './types';

const es_13: ScenarioLab = {
    id: 'es-13',
    title: 'Path Rules — Scattered Test Files Across 40+ Dirs',
    domain: 'Domain 3 — Claude Code Best Practices',
    domainNum: 3,
    scenario: 'Test files are scattered across 40+ directories. You want consistent testing rules (mock external APIs, use fixtures, etc.) without adding rules to every single directory. Use .claude/rules/ with glob patterns.',
    examTopic: '3.3 Path-Specific Rules',
    difficulty: 'Easy',
    codeTemplate: `# ============================================
# EXAM SCENARIO: Consistent rules for scattered files
# ============================================
# Problem: 40+ directories, each with test files
# Solution: One rule file with glob pattern covers all of them
# ============================================

import json

print("=" * 60)
print("PROBLEM: Test files scattered across 40+ directories")
print("=" * 60)

directories = [
    "src/auth/", "src/users/", "src/orders/", "src/products/",
    "src/payments/", "src/shipping/", "src/notifications/",
    "src/analytics/", "src/reports/", "src/admin/",
    # ... 30+ more directories
]

print(f"Directories with tests: {len(directories)}")
print("Each has files like: user.test.ts, order.test.ts, etc.")
print()
print("❌ WITHOUT path rules:")
print("   → Add testing instructions to CLAUDE.md for EACH directory")
print("   → 40+ CLAUDE.md files to maintain")
print("   → Context bloat: ALL rules load even when editing non-test files")

print(f"\\n{'='*60}")
print("SOLUTION: .claude/rules/ with glob patterns")
print("=" * 60)

rule_file = {
    "path": ".claude/rules/testing.md",
    "glob": "**/*.test.ts",
    "content": """# Testing Rules
- Always mock external API calls (no real HTTP requests in tests)
- Use factory functions from test/utils/factories.ts for test data
- Each test file should have: unit tests + integration tests
- Run with: pnpm test -- --coverage
- Minimum coverage: 80%
""",
}

print(f"\\n📁 Rule file: {rule_file['path']}")
print(f"🎯 Matches: {rule_file['glob']}")
print(f"📝 Content preview:")
print(rule_file['content'][:200])

print(f"\\n✅ Benefits:")
print(f"   1. ONE file covers ALL {len(directories)} directories")
print(f"   2. Only loads when editing matching files (*.test.ts)")
print(f"   3. Zero context cost when editing non-test files")
print(f"   4. Easy to update — change one file, all tests follow")

print(f"\\n{'═'*60}")
print("EXAM KEY: Path-specific rules")
print("  .claude/rules/ with glob patterns")
print("  One file covers scattered file types across directories")
print("  Lazy-loaded: only when editing matching files")
print("  Zero cost when not triggered")
print(f"{'═'*60}")`,
    expectedOutput: `Shows how one .claude/rules/testing.md with glob **/*.test.ts covers all 40+ directories.`,
    brokenCode: `# ❌ BROKEN: Test rules in CLAUDE.md apply to ALL files
# 🐛 BUG: The test rule applies to ALL files, not just test_*.py

# BROKEN: Rules in CLAUDE.md that are too broad
BROKEN_CLAUDE_MD = """
# Project Rules

## Code Style
- Use type hints on all functions
- Follow PEP 8

## Testing 🐛
- ALWAYS mock external API calls in EVERY function
- Write unit tests for every new function
- Use pytest fixtures for database connections
- Maintain 90%+ test coverage

## The Problem:
The test rules above apply to ALL files, including:
- src/models/user.py (should NOT need test mocks)
- src/utils/helpers.py (doesn't need pytest fixtures)
- scripts/deploy.py (not even testable with pytest)
"""

# ✅ CORRECT: Use path-specific rules in .claude/rules/
CORRECT_RULES = {
    ".claude/rules/test-files.md": """
# Rules for test files only
- Always mock external API calls
- Use pytest fixtures for database connections
- Maintain 90%+ test coverage
""",
    ".claude/rules/src-files.md": """
# Rules for src/ files
- Use type hints on all functions
- Follow PEP 8
- Keep functions pure when possible
""",
    ".claude/rules/scripts.md": """
# Rules for scripts/
- Add error handling for missing env vars
- Use argparse for CLI arguments
- Log progress for long-running operations
""",
}


def demonstrate_issue():
    print("=" * 60)
    print("🐛 BROKEN: Broad rules in CLAUDE.md:")
    print("=" * 60)
    print(BROKEN_CLAUDE_MD)
    print()
    print("✅ CORRECT: Path-specific rules in .claude/rules/:")
    print("=" * 60)
    for path, content in CORRECT_RULES.items():
        print(f"\\n📄 {path}:")
        print(content)


if __name__ == "__main__":
    demonstrate_issue()
    print("\\n🐛 The test rule 'mock external API calls' applies to ALL files!")
    print("🐛 Should be a PATH-SPECIFIC rule in .claude/rules/test-files.md")
`,
    hints: ["Path-specific rules in .claude/rules/*.py only activate for matching files.", "Glob patterns like **/test_*.py target rules to specific file types.", "Rules in CLAUDE.md apply to EVERYTHING — too broad for test rules."],
    fixes: ["Create .claude/rules/tests.py with glob: **/test_*.py.", "Move test-specific rules out of CLAUDE.md into the path-specific file.", "Keep CLAUDE.md for universal project rules only."],
  };

export default es_13;
