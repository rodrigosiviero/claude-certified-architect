const lab_1 = {
    id: 'lab-1',
    title: 'Building Your First Agentic Loop',
    domain: 'Domain 1 — Agentic Engineering',
    examTopics: ['1.1 Agentic Loops'],
    difficulty: 'Beginner',
    duration: '30 min',
    description: 'Build a minimal agentic loop from scratch — the foundational pattern that powers all Claude agent systems. You will implement the request → inspect → tool call → result → iterate cycle with proper stop_reason handling.',
    objectives: [
      'Implement the core agentic loop pattern',
      'Handle stop_reason correctly (tool_use vs end_turn)',
      'Process ALL tool_use blocks in a single response',
      'Use iteration count as a safety limit only',
    ],
    setup: 'Python 3.10+ with anthropic SDK (pip install anthropic)',
    steps: [
      'Define a simple calculator tool schema',
      'Build the loop: send message → check stop_reason → execute tools → append results',
      'Handle end_turn (done) vs tool_use (more work needed)',
      'Test with a multi-step math problem',
    ],
    codeTemplate: `import anthropic
import json

client = anthropic.Anthropic()

calculator_tool = {
    "name": "calculator",
    "description": "Performs basic arithmetic calculations",
    "input_schema": {
        "type": "object",
        "properties": {
            "expression": {
                "type": "string",
                "description": 'Mathematical expression to evaluate (e.g., "2 + 2")',
            }
};
        "required": ["expression"],
};
}

def execute_tool(name: str, inputs: dict) -> str:
    print(f"\\n{'='*60}", file=sys.stderr)
    print(f"🔧 [TOOL EXEC] Executing tool: {name}", file=sys.stderr)
    print(f"   Input: {json.dumps(inputs, indent=2)}", file=sys.stderr)
    if name == "calculator":
        result = eval(inputs["expression"])
        output = json.dumps({"result": result})
    else:
        output = json.dumps({"error": f"Unknown tool: {name}"})
    print(f"   Output: {output}", file=sys.stderr)
    print(f"{'='*60}", file=sys.stderr)
    return output


def run_agent(prompt: str, max_turns: int = 10) -> str:
    """🚀 Agentic loop with CORRECT stop_reason termination."""
    messages = [{"role": "user", "content": prompt}]

    print(f"\\n🚀 [AGENT START] User prompt: \\"{prompt}\\"", file=sys.stderr)
    print(f"   Max turns (safety limit): {max_turns}", file=sys.stderr)

    for turn in range(max_turns):
        print(f"\\n{'─'*60}", file=sys.stderr)
        print(f"📤 [TURN {turn + 1}] Sending request to Claude...", file=sys.stderr)
        print(f"   Messages in context: {len(messages)}", file=sys.stderr)

        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1024,
            tools=[calculator_tool],
            messages=messages,
        )

        print(f"📥 [RESPONSE] stop_reason = {response.stop_reason}", file=sys.stderr)
        print(f"   Content blocks: {len(response.content)}", file=sys.stderr)
        for i, block in enumerate(response.content):
            print(f"   Block {i}: type={block.type}", end="", file=sys.stderr)
            if block.type == "text":
                print(f", text=\\"{block.text[:80]}...\\"", file=sys.stderr)
            elif block.type == "tool_use":
                print(f", tool={block.name}, input={json.dumps(block.input)}", file=sys.stderr)

        # ✅ CORRECT: stop_reason is the ONLY termination signal
        messages.append({"role": "assistant", "content": response.content})

        if response.stop_reason == "end_turn":
            print(f"\\n✅ [TERMINATE] stop_reason=end_turn → Claude is done!", file=sys.stderr)
            text = next((b.text for b in response.content if b.type == "text"), "")
            print(f"📋 [FINAL] Result: {text[:200]}", file=sys.stderr)
            return text

        if response.stop_reason == "max_tokens":
            print(f"\\n⚠️  [CUTOFF] stop_reason=max_tokens → Claude was cut off!", file=sys.stderr)

        # Process ALL tool calls
        tool_results = []
        tool_count = sum(1 for b in response.content if b.type == "tool_use")
        print(f"\\n🔄 [TOOL PROCESSING] Processing {tool_count} tool call(s)...", file=sys.stderr)

        for block in response.content:
            if block.type == "tool_use":
                print(f"🔧 [TOOL CALL] {block.name}({json.dumps(block.input)})", file=sys.stderr)
                output = execute_tool(block.name, block.input)
                tool_results.append({
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": output,
                })
                print(f"✅ [RESULT] Tool {block.name} completed", file=sys.stderr)

        if tool_results:
            messages.append({"role": "user", "content": tool_results})
            print(f"📤 [APPEND] Added {len(tool_results)} tool result(s) to context", file=sys.stderr)

    print(f"\\n🛑 [STOP] Reached max_turns={max_turns} safety limit", file=sys.stderr)
    return "Agent reached maximum turns"


if __name__ == "__main__":
    import sys
    result = run_agent("What is (15 + 27) * 3 - 42?")
    print(f"\\n{'═' * 60}")
    print(f"📋 Final Answer: {result}")
    print(f"{'═' * 60}")`,
};

export default lab_1;
