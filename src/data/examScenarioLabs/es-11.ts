import type { ScenarioLab } from './types';

const es_11: ScenarioLab = {
    id: 'es-11',
    title: 'CLAUDE.md Hierarchy — Team Standards Gone Missing',
    domain: 'Domain 3 — Claude Code Best Practices',
    domainNum: 3,
    scenario: 'A developer puts team coding standards in ~/.claude/CLAUDE.md. A new hire clones the repo but doesn\'t see the standards. The file is at the user level, not the project level.',
    examTopic: '3.1 CLAUDE.md Hierarchy',
    difficulty: 'Easy',
    codeTemplate: `import json

# ============================================
# EXAM SCENARIO: CLAUDE.md in wrong level
# ============================================
# BROKEN: Team standards in ~/.claude/CLAUDE.md (user level, not shared)
# FIXED: Team standards in .claude/CLAUDE.md (project level, Git-committed)
# ============================================

print("=" * 60)
print("CLAUDE.md HIERARCHY — Three Levels")
print("=" * 60)

hierarchy = {
    "Level 1 — User": {
        "path": "~/.claude/CLAUDE.md",
        "scope": "Personal preferences, NOT shared with team",
        "examples": [
            "I prefer TypeScript over JavaScript",
            "Use descriptive variable names",
            "My preferred testing framework is Jest",
        ],
        "shared": False,
        "git_committed": False,
    },
    "Level 2 — Project": {
        "path": ".claude/CLAUDE.md",
        "scope": "Team standards, shared with everyone who clones the repo",
        "examples": [
            "All API endpoints must have input validation",
            "Use dependency injection for services",
            "Error handling follows our custom error hierarchy",
            "Test coverage must be >80%",
        ],
        "shared": True,
        "git_committed": True,
    },
    "Level 3 — Directory": {
        "path": "src/api/CLAUDE.md",
        "scope": "Scoped to subdirectory only",
        "examples": [
            "API routes follow REST conventions",
            "All responses wrapped in ApiResponse<T>",
        ],
        "shared": True,
        "git_committed": True,
    },
}

for level, info in hierarchy.items():
    print(f"\\n📁 {level}")
    print(f"   Path: {info['path']}")
    print(f"   Scope: {info['scope']}")
    print(f"   Shared: {'✅ Yes' if info['shared'] else '❌ No — only on your machine!'}")
    print(f"   Git: {'✅ Committed' if info['git_committed'] else '❌ Not committed'}")
    print(f"   Examples:")
    for ex in info['examples']:
        print(f"      • {ex}")

print(f"\\n{'═'*60}")
print("❌ THE BUG: Team standards in ~/.claude/CLAUDE.md")
print("   → Only exists on the original dev's machine")
print("   → New hire clones repo → no standards → inconsistent code")
print()
print("✅ THE FIX: Move team standards to .claude/CLAUDE.md")
print("   → Committed to Git → everyone gets the same rules")
print("   → @import other files selectively by domain")
print()
print("EXAM ANSWER:")
print("  User level   = personal, NOT shared")
print("  Project level = team, Git-committed")
print("  Directory level = scoped, loaded when editing matching files")
print(f"{'═'*60}")`,
    expectedOutput: `Shows 3-level hierarchy with examples.
Key: ~/.claude/ = personal only, .claude/ = team shared.`,
    brokenCode: `# ❌ BROKEN: Personal prefs in project-level CLAUDE.md
# 🐛 BUG: Personal preferences in team-shared project config

# This is what the BROKEN CLAUDE.md looks like:

BROKEN_CLAUDE_MD = """
# Project: E-Commerce Platform

## Code Style
- Use TypeScript strict mode
- Prefer functional components with hooks
- Always run tests before committing (my personal rule)

## 🐛 Personal Preferences (should NOT be here!):
- I prefer dark theme for the IDE (team: use what you want)
- Always use single quotes (team: double quotes are fine)
- My favorite libraries: lodash, moment (team: use date-fns)
- I like 2-space indentation (team: project uses 4-space)
- My GitHub username: srxz (team: don't need this in config)

## Testing
- Run pytest before every commit (my machine setup)
- Use --verbose flag always (personal preference)
- Skip tests that take >5s (my impatience, not team policy)
"""

# ✅ CORRECT approach: personal prefs in ~/.claude/CLAUDE.md (user-level)
CORRECT_USER_CLAUDE_MD = """
# Personal Preferences
- I prefer dark theme
- Use single quotes
- Favorite: lodash, moment
- 2-space indentation
"""

# ✅ CORRECT: project-level CLAUDE.md should only have TEAM rules
CORRECT_PROJECT_CLAUDE_MD = """
# Project: E-Commerce Platform

## Code Style
- Use TypeScript strict mode
- Prefer functional components with hooks
- Run linter before committing (enforced in CI)

## Testing
- All tests must pass in CI
- Minimum 80% code coverage
"""


def demonstrate_issue():
    print("=" * 60)
    print("🐛 BROKEN CLAUDE.md (project-level):")
    print("=" * 60)
    print(BROKEN_CLAUDE_MD)
    print()
    print("✅ CORRECT user-level ~/.claude/CLAUDE.md:")
    print("-" * 40)
    print(CORRECT_USER_CLAUDE_MD)
    print()
    print("✅ CORRECT project-level ./CLAUDE.md:")
    print("-" * 40)
    print(CORRECT_PROJECT_CLAUDE_MD)


if __name__ == "__main__":
    demonstrate_issue()
`,
    hints: ["Project-level .claude/CLAUDE.md is shared with the whole team.", "Personal preferences go in ~/.claude/CLAUDE.md (not committed).", "Project-level should contain team conventions and architecture."],
    fixes: ["Move personal prefs to ~/.claude/CLAUDE.md (user-level).", "Keep .claude/CLAUDE.md for team standards only.", "Hierarchy: user (personal) < project (team) < directory (specific)."],
  };

export default es_11;
