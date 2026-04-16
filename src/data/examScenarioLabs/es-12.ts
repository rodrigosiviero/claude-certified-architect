import type { ScenarioLab } from './types';

const es_12: ScenarioLab = {
    id: 'es-12',
    title: 'context: fork — Verbose Exploration Without Pollution',
    domain: 'Domain 3 — Claude Code Best Practices',
    domainNum: 3,
    scenario: 'A deep codebase exploration command floods the main session with 500 lines of output, making it impossible to have a clean conversation afterward. Use context: fork to isolate the verbose work.',
    examTopic: '3.2 Commands & Skills',
    difficulty: 'Medium',
    codeTemplate: `import anthropic

client = anthropic.Anthropic()

# ============================================
# EXAM SCENARIO: Verbose output polluting main session
# ============================================
# BROKEN: Running exploration in main session → 500 lines of output
# FIXED: Use context: fork → isolated subagent → clean main session
# ============================================

print("=" * 60)
print("PROBLEM: Exploring codebase in main session")
print("=" * 60)
print()
print("❌ Without fork:")
print("   You: 'Explore the authentication module'")
print("   Claude: [500 lines of file contents, function signatures, etc.]")
print("   You: 'Now fix the bug in login()'")
print("   Claude: 'What bug? I lost track because of the 500 lines above'")
print()
print("   Context window is now full of exploration output.")
print("   Main conversation is polluted and hard to follow.")

print(f"\\n{'='*60}")
print("SOLUTION: context: fork for isolated exploration")
print("=" * 60)
print()
print("✅ With fork:")
print("   You: 'Explore the authentication module'")
print("   Claude: [spawns isolated subagent via context: fork]")
print("          [subagent reads 50 files in its OWN context]")
print("          [subagent returns summary: 'Found 12 auth functions, 3 potential issues']")
print("   Main session: Still clean, only has the summary")
print("   You: 'Now fix the bug in login()'")
print("   Claude: 'Based on the exploration summary, the bug is in...'")
print()

# Demonstrate with actual API calls
print(f"\\n{'─'*60}")
print("DEMO: Fork pattern in action")
print("─" * 60)

# Simulate the fork: isolated subagent with its own context
explore_prompt = """You are an isolated exploration agent. Your job:
1. List what you'd explore in an authentication module
2. Return a COMPACT summary (max 5 bullet points)
Do NOT dump file contents. Return a summary."""

print("\\n🌳 [FORK] Spawning isolated exploration subagent...")
response = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=256,
    system=explore_prompt,
    messages=[{"role": "user", "content": "Explore a typical auth module structure"}],
)
summary = next(b.text for b in response.content if b.type == "text")
print(f"   📋 Summary returned ({len(summary)} chars):")
print(f"   {summary[:200]}...")

print(f"\\n🧹 [MAIN SESSION] Clean! Only has the summary, not the raw exploration.")

print(f"\\n{'═'*60}")
print("EXAM KEY: context: fork")
print("  fork = isolated subagent with its OWN context window")
print("  Use for: verbose exploration, deep analysis, long-running tasks")
print("  Main session stays clean — only gets the summary")
print("  Changes in fork DON'T affect parent session")
print("  Commands = quick in-session tasks")
print("  Skills + fork = isolated verbose tasks")
print(f"{'═'*60}")`,
    expectedOutput: `Shows how context:fork creates isolated subagent.
Main session stays clean with only a summary.`,
    brokenCode: `# ❌ BROKEN: All exploration content pollutes main context
# 🐛 BUG: Sends 500KB of code as a single message — no Task tool isolation
import anthropic
import json

client = anthropic.Anthropic()

file_read_tool = {
    "name": "read_file",
    "description": "Read a file from the filesystem.",
    "input_schema": {
        "type": "object",
        "properties": {
            "path": {"type": "string", "description": "File path to read"}
        },
        "required": ["path"],
    },
}

def execute_tool(name: str, inputs: dict) -> str:
    print(f"🔧 [TOOL EXEC] {name}({json.dumps(inputs)})")
    if name == "read_file":
        # 🐛 Simulates reading a HUGE file — 500KB of code
        huge_content = "# " + "x" * 500000 + "\\n"  # 500KB of content!
        return json.dumps({"content": huge_content})
    return json.dumps({"error": f"Unknown tool: {name}"})


def run_agent(prompt: str) -> str:
    """🐛 BROKEN: All file reads go into main context — no isolation."""
    messages = [{"role": "user", "content": prompt}]

    print(f"🚀 [AGENT START] Prompt: \\"{prompt}\\"")

    for turn in range(10):
        print(f"\\n📤 [TURN {turn + 1}]")
        print(f"   Context size: ~{len(json.dumps(messages)) // 4} tokens")

        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1024,
            tools=[file_read_tool],
            messages=messages,
        )

        messages.append({"role": "assistant", "content": response.content})

        if response.stop_reason == "end_turn":
            text = next((b.text for b in response.content if b.type == "text"), "")
            return text

        # Process tool calls
        tool_results = []
        for block in response.content:
            if block.type == "tool_use":
                # 🐛 Sends 500KB of code as a single message
                output = execute_tool(block.name, block.input)
                tool_results.append({
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": output,  # 🐛 500KB in main context!
                })

        if tool_results:
            messages.append({"role": "user", "content": tool_results})

    return "Agent hit turn limit"


if __name__ == "__main__":
    result = run_agent("Read the file src/main.py and summarize it")
    print(f"\\n📋 Result: {result[:200]}...")
    print("\\n🐛 PROBLEM: 500KB file content is now permanently in the conversation!")
    print("🐛 Should use Task tool for exploration in isolated subagent context")
`,
    hints: ["Use \"context: fork\" to explore without polluting main conversation.", "Large explorations should happen in isolated subagent contexts.", "Only bring back summaries, not raw file contents."],
    fixes: ["Use the Task tool with context:fork for isolated exploration.", "Subagent explores in its own context, returns only a summary.", "Main conversation stays clean and focused."],
  };

export default es_12;
