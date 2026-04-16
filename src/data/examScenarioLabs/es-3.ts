import type { ScenarioLab } from './types';

const es_3: ScenarioLab = {
    id: 'es-3',
    title: 'Subagent Context — The Missing "Task" in allowedTools',
    domain: 'Domain 1 — Agentic Engineering',
    domainNum: 1,
    scenario: 'A subagent is supposed to invoke a Task tool for nested research, but the invocation silently fails. The developer forgot to include "Task" in the allowedTools list. Demonstrate the fix.',
    examTopic: '1.3 Subagent Context',
    difficulty: 'Medium',
    codeTemplate: `import anthropic
import json

client = anthropic.Anthropic()

# ============================================
# EXAM SCENARIO: Missing "Task" in allowedTools
# ============================================
# PROBLEM: Subagent can't invoke Task tool — it's not in allowedTools.
# FIX: Always include "Task" in allowedTools when subagent needs to spawn tasks.
# ============================================

def run_subagent(task_description: str, allow_task: bool = True) -> str:
    """
    Demonstrates the difference between having "Task" in allowedTools vs not.
    """
    print(f"\\n🚀 [SUBAGENT] Starting subagent...")
    print(f"   Task: {task_description[:80]}")
    print(f"   'Task' in allowedTools: {allow_task}")

    # ❌ BROKEN: If allow_task=False, subagent CAN'T invoke Task
    # ✅ FIXED: If allow_task=True, subagent CAN invoke Task
    allowed_tools = ["Read", "Grep"]
    if allow_task:
        allowed_tools.append("Task")

    print(f"   allowedTools: {allowed_tools}")

    # Simulate what happens
    if not allow_task:
        print(f"\\n   ❌ [ERROR] Subagent tries to invoke Task tool but it's not in allowedTools!")
        print(f"   → Silent failure — subagent falls back to incomplete answer")
        print(f"   → This is the #1 mistake in subagent configuration")
    else:
        print(f"\\n   ✅ [SUCCESS] Subagent can invoke Task tool for nested research")
        print(f"   → Subagent can spawn child tasks for multi-step work")

    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=512,
        system="You are a research subagent. Complete the given task.",
        messages=[{"role": "user", "content": task_description}],
    )
    return next(b.text for b in response.content if b.type == "text")


if __name__ == "__main__":
    print("=" * 60)
    print("DEMO: allowedTools with and without 'Task'")
    print("=" * 60)

    # ❌ Without "Task" — broken
    print("\\n--- Test 1: WITHOUT 'Task' in allowedTools ---")
    run_subagent(
        "Research the latest Python 3.13 features and create a summary",
        allow_task=False
    )

    # ✅ With "Task" — correct
    print("\\n\\n--- Test 2: WITH 'Task' in allowedTools ---")
    run_subagent(
        "Research the latest Python 3.13 features and create a summary",
        allow_task=True
    )

    print(f"\\n{'═'*60}")
    print("KEY TAKEAWAY:")
    print("  allowedTools MUST include 'Task' if the subagent needs to:")
    print("  - Spawn child subagents")
    print("  - Delegate sub-tasks")
    print("  - Do multi-step research")
    print("  Without it, the invocation SILENTLY FAILS.")
    print(f"{'═'*60}")`,
    expectedOutput: `--- Test 1: WITHOUT 'Task' in allowedTools ---
   ❌ [ERROR] Subagent tries to invoke Task tool but it's not in allowedTools!
   → Silent failure — subagent falls back to incomplete answer

--- Test 2: WITH 'Task' in allowedTools ---
   ✅ [SUCCESS] Subagent can invoke Task tool for nested research`,
    brokenCode: `# ❌ BROKEN: Missing Task tool in allowedTools
# 🐛 BUG: "Task" tool not included in allowedTools — Claude cannot delegate
import anthropic
import json

client = anthropic.Anthropic()

# 🐛 BUG: Only a code tool — no Task/delegation tool available!
code_tool = {
    "name": "execute_code",
    "description": "Execute Python code and return the output.",
    "input_schema": {
        "type": "object",
        "properties": {
            "code": {"type": "string", "description": "Python code to execute"}
        },
        "required": ["code"],
    },
}

# 🐛 BUG: No system prompt telling Claude it can delegate!
SYSTEM_PROMPT = "You are a helpful assistant."  # Too vague!

def execute_tool(name: str, inputs: dict) -> str:
    print(f"🔧 [TOOL EXEC] {name}({json.dumps(inputs)[:100]}...)")
    if name == "execute_code":
        try:
            result = eval(inputs["code"])
            return json.dumps({"result": str(result)})
        except Exception as e:
            return json.dumps({"error": str(e)})
    return json.dumps({"error": f"Unknown tool: {name}"})


def run_agent(prompt: str) -> str:
    """🐛 BROKEN: Claude tries to do everything itself — no delegation."""
    messages = [{"role": "user", "content": prompt}]

    print(f"🚀 [AGENT START] Prompt: \\"{prompt}\\"")

    # 🐛 BUG: "Task" not in allowedTools!
    # Claude is asked to do complex multi-step work but has no way to delegate
    allowed_tools = [code_tool]  # Missing Task tool!

    for turn in range(10):
        print(f"\\n📤 [TURN {turn + 1}]")

        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1024,
            system=SYSTEM_PROMPT,
            tools=allowed_tools,  # 🐛 No Task tool!
            messages=messages,
        )

        messages.append({"role": "assistant", "content": response.content})

        if response.stop_reason == "end_turn":
            text = next((b.text for b in response.content if b.type == "text"), "")
            print(f"✅ [DONE] {text[:100]}...")
            return text

        # Process tool calls
        tool_results = []
        for block in response.content:
            if block.type == "tool_use":
                print(f"🔧 Claude tries to do it all: {block.name}()")
                output = execute_tool(block.name, block.input)
                tool_results.append({
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": output,
                })

        if tool_results:
            messages.append({"role": "user", "content": tool_results})

    return "Agent hit turn limit — could not delegate subtasks!"


if __name__ == "__main__":
    # Complex request that SHOULD be delegated to subagents
    result = run_agent(
        "Analyze the sales data, generate a report, and email it to the team. "
        "Also create a summary dashboard."
    )
    print(f"\\n📋 Result: {result}")
    print("\\n🐛 PROBLEM: Claude tries to write code for everything instead of delegating!")
`,
    hints: ["Claude Code uses a built-in \"Task\" tool for spawning subagents.", "If \"Task\" is not in allowedTools, Claude cannot delegate work.", "Without Task, Claude handles complex tasks alone instead of delegating."],
    fixes: ["Add \"Task\" to allowedTools for the parent agent.", "Provide a system prompt that tells Claude when to delegate vs do itself.", "Test with and without Task to see the behavioral difference."],
  };

export default es_3;
