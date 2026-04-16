const lab_9 = {
    id: 'lab-9',
    title: 'CI/CD Integration',
    domain: 'Domain 3 — Context Engineering',
    examTopics: ['3.4 Plan Mode', '3.5 Iterative Refinement', '3.6 CI/CD'],
    difficulty: 'Advanced',
    duration: '40 min',
    description: 'Integrate Claude Code into CI/CD pipelines for automated code review, testing, and deployment with proper error handling.',
    objectives: [
      'Configure GitHub Actions with Claude Code',
      'Use -p flag for non-interactive mode',
      'Implement automated PR review',
      'Set up plan mode for complex changes',
    ],
    setup: 'GitHub repository with Actions enabled, Claude Code CLI',
    steps: [
      'Create GitHub Actions workflow',
      'Configure non-interactive mode (-p flag)',
      'Add PR review automation',
      'Test the pipeline end-to-end',
    ],
    codeTemplate: `# ============================================================
# .github/workflows/claude-review.yml
# ============================================================
name: Claude Code Review

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Claude Code
        run: |
          curl -fsSL https://claude.ai/install.sh | sh
          echo "Claude Code installed: \$(claude --version)"

      - name: Automated PR Review
        env:
          ANTHROPIC_API_KEY: \\\${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          echo "🔍 [CI] Starting automated review..."
          echo "📊 [CI] PR: #\${{ github.event.pull_request.number }}"
          echo "📂 [CI] Branch: \${{ github.head_ref }}"

          # -p flag = non-interactive (print mode)
          # Reads from stdin, outputs to stdout
          claude -p "Review the changes in this PR. List any bugs or issues." \\
            > review_output.md 2>&1

          echo "✅ [CI] Review complete"

      - name: Upload review
        uses: actions/upload-artifact@v4
        with:
          name: claude-review
          path: review_output.md


# ============================================================
# .github/workflows/claude-plan.yml — Plan Mode for Complex Changes
# ============================================================
name: Claude Plan

on:
  issues:
    types: [labeled]

jobs:
  plan:
    if: contains(github.event.label.name, 'claude-plan')
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Generate Implementation Plan
        env:
          ANTHROPIC_API_KEY: \\\${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          echo "📋 [CI] Generating implementation plan..."
          echo "📊 [CI] Issue: #\${{ github.event.issue.number }}"

          # Plan mode: Claude reads codebase, creates plan, does NOT execute
          claude --plan "Implement the feature described in issue #\${{ github.event.issue.number }}" \\
            > plan_output.md 2>&1

          echo "✅ [CI] Plan generated"


# ============================================================
# Key Exam Concepts:
# ============================================================
# 1. -p flag = non-interactive (required for CI/CD)
# 2. --plan = plan mode (reads codebase, outputs plan, no changes)
# 3. ANTHROPIC_API_KEY via GitHub Secrets (NEVER hardcoded)
# 4. claude --allowedTools = restrict what Claude can do in CI
# 5. Iterative refinement: Claude runs tests, fixes, repeats`,
};

export default lab_9;
