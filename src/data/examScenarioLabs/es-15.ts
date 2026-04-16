import type { ScenarioLab } from './types';

const es_15: ScenarioLab = {
    id: 'es-15',
    title: 'Plan → Execute — 45-File Framework Migration',
    domain: 'Domain 3 — Claude Code Best Practices',
    domainNum: 3,
    scenario: 'You need to migrate Express to Fastify across 45 files. The canonical approach is plan first (investigate, no changes), then execute (implement). Doing it in one shot leads to inconsistent patterns.',
    examTopic: '3.4 Plan vs Execute',
    difficulty: 'Advanced',
    codeTemplate: `import anthropic
import json

client = anthropic.Anthropic()

# ============================================
# EXAM SCENARIO: Plan → Execute for large migration
# ============================================
# Step 1: PLAN mode — investigate, list changes, NO modifications
# Step 2: EXECUTE mode — implement changes per the plan
# ============================================

PLAN_PROMPT = """You are in PLAN mode. Your job is to INVESTIGATE and plan a migration.
DO NOT make any changes. Only analyze and report.

Task: Migrate an Express.js codebase to Fastify.
Analyze what needs to change:
1. Routing syntax differences
2. Middleware → hooks conversion
3. Request/response object differences
4. Plugin system differences

Return a JSON migration plan with:
- "phases": list of migration phases
- "files_per_phase": estimated files to change per phase
- "risks": potential breaking changes
- "test_strategy": how to verify each phase
"""

EXECUTE_PROMPT = """You are in EXECUTE mode. Implement the changes described in the migration plan.

Migration plan:
{plan}

For the given file, apply the Express → Fastify migration:
1. Convert route handlers (app.get → fastify.get)
2. Convert middleware (req, res, next → request, reply)
3. Convert error handlers
4. Preserve all business logic exactly

Return the migrated code.
"""


def run_plan_then_execute():
    """Canonical pattern: plan first, then execute."""
    print("=" * 60)
    print("PHASE 1: PLAN MODE (investigate, NO changes)")
    print("=" * 60)

    print("\\n📡 [PLAN] Asking Claude to investigate the migration...")
    plan_response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=512,
        system=PLAN_PROMPT,
        messages=[{"role": "user", "content": "Plan the Express → Fastify migration for a 45-file project"}],
    )
    plan = next(b.text for b in plan_response.content if b.type == "text")
    print(f"\\n📋 Migration Plan:")
    print(f"   {plan[:300]}...")

    print(f"\\n\\n{'='*60}")
    print("PHASE 2: EXECUTE MODE (implement changes)")
    print("=" * 60)

    print("\\n🔨 [EXECUTE] Implementing per the plan...")
    execute_response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=512,
        system=EXECUTE_PROMPT.format(plan=plan),
        messages=[{"role": "user", "content": "Migrate src/routes/users.ts from Express to Fastify"}],
    )
    result = next(b.text for b in execute_response.content if b.type == "text")
    print(f"\\n✅ Migration result:")
    print(f"   {result[:300]}...")

    print(f"\\n{'═'*60}")
    print("EXAM KEY: Plan → Execute pattern")
    print("  Plan mode: investigate, NO changes (read-only)")
    print("  Execute mode: implement changes per plan")
    print("  For 45-file migration: plan ALL → execute per-file")
    print("  Per-file + cross-file passes for consistency")
    print("  NEVER one-shot large migrations — always plan first")
    print(f"{'═'*60}")


if __name__ == "__main__":
    run_plan_then_execute()`,
    expectedOutput: `PHASE 1 generates migration plan (no changes).
PHASE 2 executes changes per the plan.`,
    brokenCode: `# ❌ BROKEN: Agent modifies 45 files without a plan
# 🐛 BUG: Immediately starts rewriting — no plan, no review, no rollback
import anthropic
import json

client = anthropic.Anthropic()

file_write_tool = {
    "name": "write_file",
    "description": "Write content to a file.",
    "input_schema": {
        "type": "object",
        "properties": {
            "path": {"type": "string", "description": "File path"},
            "content": {"type": "string", "description": "File content"}
        },
        "required": ["path", "content"],
    },
}

def execute_tool(name: str, inputs: dict) -> str:
    print(f"🔧 [TOOL EXEC] {name}({inputs.get('path', '???')})")
    return json.dumps({"status": "written"})


def run_agent(prompt: str) -> str:
    """🐛 BROKEN: Agent starts modifying files immediately."""
    messages = [{"role": "user", "content": prompt}]

    print(f"🚀 [AGENT START] Prompt: \\"{prompt}\\"")

    for turn in range(20):  # 🐛 20 turns — no limit awareness!
        print(f"\\n📤 [TURN {turn + 1}]")

        # 🐛 No system prompt about planning first!
        # 🐛 No instruction to create a plan before making changes!
        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=4096,
            tools=[file_write_tool],
            messages=messages,
        )

        messages.append({"role": "assistant", "content": response.content})

        if response.stop_reason == "end_turn":
            text = next((b.text for b in response.content if b.type == "text"), "")
            return text

        # 🐛 Immediately starts rewriting 45 files
        tool_results = []
        for block in response.content:
            if block.type == "tool_use":
                print(f"   🐛 Directly writing: {block.input.get('path', '???')}")
                output = execute_tool(block.name, block.input)
                tool_results.append({
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": output,
                })

        if tool_results:
            messages.append({"role": "user", "content": tool_results})

    return "Agent hit turn limit — may have modified files inconsistently!"


if __name__ == "__main__":
    result = run_agent(
        "Migrate our entire API from REST to GraphQL. "
        "Update all 45 endpoint files."
    )
    print(f"\\n📋 Result: {result}")
    print("\\n🐛 PROBLEM:")
    print("   - No plan was created before starting")
    print("   - No review step before modifications")
    print("   - No rollback capability")
    print("   - 45 files modified inconsistently across 20 turns")
`,
    hints: ["Plan mode (--plan) generates a plan WITHOUT executing changes.", "For large migrations: plan first, review, then execute incrementally.", "Without a plan, a 45-file migration can break things unpredictably."],
    fixes: ["Run claude --plan first to get a detailed migration plan.", "Review the plan before executing any changes.", "Execute in small batches: migrate one module, test, proceed."],
  };

export default es_15;
