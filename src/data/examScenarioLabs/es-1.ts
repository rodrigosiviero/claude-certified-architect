import type { ScenarioLab } from './types';

const es_1: ScenarioLab = {
    id: 'es-1',
    title: 'Loop Termination — stop_reason vs Iteration Count',
    domain: 'Domain 1 — Agentic Engineering',
    domainNum: 1,
    scenario: 'A junior engineer built an agentic loop that counts iterations to decide when to stop. Claude sometimes returns "end_turn" after 2 turns, sometimes after 8. The iteration counter is unreliable. Fix the termination logic.',
    examTopic: '1.1 Agentic Loops',
    difficulty: 'Medium',
    codeTemplate: `import anthropic
import json

client = anthropic.Anthropic()

# ============================================
# EXAM SCENARIO: Fix the termination logic
# ============================================
# The junior engineer's broken code used iteration count to stop.
# YOUR TASK: Rewrite using stop_reason as the ONLY termination signal.
# ============================================

calculator_tool = {
    "name": "calculator",
    "description": "Evaluates a math expression and returns the numeric result.",
    "input_schema": {
        "type": "object",
        "properties": {
            "expression": {"type": "string", "description": "Math expression to evaluate"}
        },
        "required": ["expression"],
    },
}

def execute_tool(name: str, inputs: dict) -> str:
    print(f"\\n{'='*60}")
    print(f"🔧 [TOOL EXEC] Executing tool: {name}")
    print(f"   Input: {json.dumps(inputs, indent=2)}")
    if name == "calculator":
        result = eval(inputs["expression"])
        output = json.dumps({"result": result})
    else:
        output = json.dumps({"error": f"Unknown tool: {name}"})
    print(f"   Output: {output}")
    print(f"{'='*60}")
    return output


def run_agent(prompt: str, max_turns: int = 10) -> str:
    """Agentic loop with CORRECT stop_reason termination."""
    messages = [{"role": "user", "content": prompt}]

    print(f"🚀 [AGENT START] User prompt: \\"{prompt}\\"")
    print(f"   Max turns (safety limit): {max_turns}")

    for turn in range(max_turns):
        print(f"\\n{'─'*60}")
        print(f"📤 [TURN {turn + 1}] Sending request to Claude...")
        print(f"   Messages in context: {len(messages)}")

        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1024,
            tools=[calculator_tool],
            messages=messages,
        )

        print(f"📥 [RESPONSE] stop_reason = {response.stop_reason}")
        print(f"   Content blocks: {len(response.content)}")
        for i, block in enumerate(response.content):
            print(f"   Block {i}: type={block.type}", end="")
            if block.type == "text":
                print(f", text=\\"{block.text[:80]}...\\"")
            elif block.type == "tool_use":
                print(f", tool={block.name}, input={json.dumps(block.input)}")

        # ✅ CORRECT: stop_reason is the ONLY termination signal
        messages.append({"role": "assistant", "content": response.content})

        if response.stop_reason == "end_turn":
            print(f"\\n✅ [TERMINATE] stop_reason=end_turn → Claude is done!")
            text = next((b.text for b in response.content if b.type == "text"), "")
            return text

        if response.stop_reason == "max_tokens":
            print(f"\\n⚠️  [CUTOFF] stop_reason=max_tokens → Claude was cut off!")

        # Process tool calls
        print(f"\\n🔄 [TOOL PROCESSING] Processing {sum(1 for b in response.content if b.type == 'tool_use')} tool calls...")
        tool_results = []
        for block in response.content:
            if block.type == "tool_use":
                print(f"   → Calling tool: {block.name}")
                output = execute_tool(block.name, block.input)
                tool_results.append({
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": output,
                })

        print(f"   → Appending {len(tool_results)} tool results to context")
        messages.append({"role": "user", "content": tool_results})

    print(f"\\n🛑 [SAFETY STOP] Max turns ({max_turns}) reached!")
    return "Max turns reached."


if __name__ == "__main__":
    result = run_agent("Calculate 15% of 847.50, then multiply by 3")
    print(f"\\n{'═'*60}")
    print(f"📋 [FINAL ANSWER]\\n{result}")
    print(f"{'═'*60}")`,
    expectedOutput: `🚀 [AGENT START] User prompt: "Calculate 15% of 847.50, then multiply by 3"
   Max turns (safety limit): 10

──────────────────────────────────────────────────────
📤 [TURN 1] Sending request to Claude...
   Messages in context: 1
📥 [RESPONSE] stop_reason = tool_use
   Content blocks: 2
   Block 0: type=text, text="I'll calculate this step by step..."
   Block 1: type=tool_use, tool=calculator, input={"expression": "847.50 * 0.15"}

🔄 [TOOL PROCESSING] Processing 1 tool calls...
   → Calling tool: calculator
============================================================
🔧 [TOOL EXEC] Executing tool: calculator
   Input: {"expression": "847.50 * 0.15"}
   Output: {"result": 127.125}
============================================================
   → Appending 1 tool results to context

──────────────────────────────────────────────────────
📤 [TURN 2] Sending request to Claude...
   Messages in context: 3
📥 [RESPONSE] stop_reason = tool_use
   Block 0: type=tool_use, tool=calculator, input={"expression": "127.125 * 3"}

🔄 [TOOL PROCESSING] Processing 1 tool calls...
   → Calling tool: calculator
============================================================
🔧 [TOOL EXEC] Executing tool: calculator
   Input: {"expression": "127.125 * 3"}
   Output: {"result": 381.375}
============================================================

──────────────────────────────────────────────────────
📤 [TURN 3] Sending request to Claude...
   Messages in context: 5
📥 [RESPONSE] stop_reason = end_turn
   Block 0: type=text, text="The answer is 381.375..."

✅ [TERMINATE] stop_reason=end_turn → Claude is done!

════════════════════════════════════════════════════════
📋 [FINAL ANSWER]
The answer is 381.375. Breaking it down: 15% of 847.50 = 127.125, × 3 = 381.375
════════════════════════════════════════════════════════`,
    brokenCode: `# ❌ BROKEN: Junior engineer's agentic loop
# 🐛 BUG 1: Hard-coded turn limit instead of checking stop_reason
# 🐛 BUG 2: Only processes FIRST tool_use block, ignores others
import anthropic
import json

client = anthropic.Anthropic()

calculator_tool = {
    "name": "calculator",
    "description": "Evaluates a math expression and returns the numeric result.",
    "input_schema": {
        "type": "object",
        "properties": {
            "expression": {"type": "string", "description": "Math expression to evaluate"}
        },
        "required": ["expression"],
    },
}

def execute_tool(name: str, inputs: dict) -> str:
    print(f"\\n{'='*60}")
    print(f"🔧 [TOOL EXEC] Executing tool: {name}")
    print(f"   Input: {json.dumps(inputs, indent=2)}")
    if name == "calculator":
        result = eval(inputs["expression"])
        output = json.dumps({"result": result})
    else:
        output = json.dumps({"error": f"Unknown tool: {name}"})
    print(f"   Output: {output}")
    print(f"{'='*60}")
    return output


def run_agent(prompt: str, max_turns: int = 10) -> str:
    """🐛 BROKEN agentic loop — uses iteration count instead of stop_reason."""
    messages = [{"role": "user", "content": prompt}]

    print(f"🚀 [AGENT START] User prompt: \\"{prompt}\\"")
    print(f"   Max turns (safety limit): {max_turns}")

    for turn in range(max_turns):
        print(f"\\n{'─'*60}")
        print(f"📤 [TURN {turn + 1}] Sending request to Claude...")
        print(f"   Messages in context: {len(messages)}")

        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1024,
            tools=[calculator_tool],
            messages=messages,
        )

        print(f"📥 [RESPONSE] stop_reason = {response.stop_reason}")
        print(f"   Content blocks: {len(response.content)}")

        messages.append({"role": "assistant", "content": response.content})

        # 🐛 BUG 1: Hard-coded turn limit instead of checking stop_reason
        if turn >= 3:  # "Claude usually finishes in 3 turns"
            print(f"\\n⚠️  [FORCED STOP] turn >= 3, but stop_reason={response.stop_reason}")
            break

        # Process tool calls
        tool_results = []
        for block in response.content:
            if block.type == "tool_use":
                print(f"\\n🔧 [TOOL CALL] {block.name}({json.dumps(block.input)})")
                output = execute_tool(block.name, block.input)
                tool_results.append({
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": output,
                })
                # 🐛 BUG 2: break after first tool — loses subsequent tool calls!
                break  # Only processes FIRST tool_use block!

        if tool_results:
            messages.append({"role": "user", "content": tool_results})

    # 🐛 Returns last text block even if Claude was cut off mid-tool
    text = ""
    for block in messages[-2]["content"] if isinstance(messages[-2].get("content"), list) else []:
        if hasattr(block, "text"):
            text += block.text
    print(f"\\n📋 [FINAL] Returned text: {text[:100]}...")
    return text


if __name__ == "__main__":
    # Run with a test prompt
    result = run_agent("What is 15 * 37 + 42?")
    print(f"\\n{'='*60}")
    print(f"Result: {result}")
`,
    hints: ["Claude signals completion via response.stop_reason, not a fixed turn count.", "What if Claude returns multiple tool_use blocks in a single response?", "The break after the first tool_use means subsequent tool calls are silently dropped."],
    fixes: ["Replace hard-coded turn limit with: if response.stop_reason == \"end_turn\": return", "Collect ALL tool results into a single array before appending to messages.", "Keep max_turns as a SAFETY limit only, not the primary termination signal."],
  };

export default es_1;
