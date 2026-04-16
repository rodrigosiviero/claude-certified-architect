const lab_8 = {
    id: 'lab-8',
    title: 'CLAUDE.md Configuration',
    domain: 'Domain 3 — Context Engineering',
    examTopics: ['3.1 Hierarchy', '3.2 Commands', '3.3 Rules'],
    difficulty: 'Intermediate',
    duration: '30 min',
    description: 'Master the CLAUDE.md hierarchy: user-level, project-level, and directory-level configs, plus custom slash commands and modular rules.',
    objectives: [
      'Understand the 3-level CLAUDE.md hierarchy',
      'Write project-level CLAUDE.md with @import',
      'Create custom slash commands',
      'Use path-specific rules with glob patterns',
    ],
    setup: 'Claude Code CLI (no Python needed — this is config-only)',
    steps: [
      'Create user-level CLAUDE.md in ~/.claude/',
      'Create project-level CLAUDE.md in .claude/',
      'Add modular rule files with @import',
      'Define custom slash commands',
    ],
    codeTemplate: `# ============================================================
# CLAUDE.md Hierarchy — No Python code, these are CONFIG FILES
# ============================================================
#
# The hierarchy (from highest to lowest priority):
#   1. .claude/CLAUDE.md (project-level, committed to Git)
#   2. ~/.claude/CLAUDE.md (user-level, personal, NOT committed)
#   3. Directory-level .claude/CLAUDE.md (applies to subdirectory)
#
# Key: More specific = higher priority
# ============================================================

# --- ~/.claude/CLAUDE.md (User-level, PERSONAL) ---
# This is YOUR personal preferences. Never commit to Git.
# Priority: LOWEST (overridden by project-level)

# - I prefer concise explanations over verbose ones
# - Always use type hints in Python
# - My timezone is America/Sao_Paulo
# - Default to pytest for testing


# --- .claude/CLAUDE.md (Project-level, SHARED) ---
# Project: E-Commerce Platform
# Tech Stack:
#   - Python 3.12 with FastAPI
#   - PostgreSQL 15
#   - Redis for caching
#   - pytest + httpx for testing

## Code Standards
@import ./rules/python.md      # <-- Modular rule import
@import ./rules/database.md
@import ./rules/api-design.md

## Project Conventions
@import ./rules/naming.md
@import ./rules/git.md

## Architecture
# - API routes go in src/api/
# - Business logic in src/services/
# - Database models in src/models/
# - Never import from src/api/ in src/services/ (no circular deps)


# --- .claude/rules/python.md (Modular rule file) ---
## Python Rules
# - Use type hints for all function signatures
# - Prefer dataclasses or Pydantic models over raw dicts
# - Use async/await for all I/O operations
# - Maximum function length: 30 lines
# - Use f-strings, never % or .format()


# --- .claude/rules/api-design.md ---
## API Design Rules
# - All endpoints return TypedDict or Pydantic response models
# - Use HTTP status codes correctly (201 for creation, 204 for deletion)
# - Include pagination headers for list endpoints
# - API versioning via URL prefix: /api/v1/


# --- .claude/rules/tests.py (Path-specific rule, glob pattern) ---
# Activates ONLY when editing test files matching **/test_*.py
## Test Rules (applies to **/test_*.py and **/*_test.py)
# - Each test must be independent
# - Use fixtures for common setup
# - Test file mirrors source structure
# - Always test both success and error cases


# --- .claude/commands/explore.md (Custom Slash Command) ---
# Usage in Claude Code: /explore src/api/orders.py
#
# description: "Deep codebase exploration with structured output"
# ---
# Analyze the file or directory at $ARGUMENTS:
# 1. List all public functions/classes with their signatures
# 2. Identify external dependencies and internal imports
# 3. Flag any potential issues (circular deps, missing types)
# 4. Suggest refactoring opportunities`,
};

export default lab_8;
