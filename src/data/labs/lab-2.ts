const lab_2 = {
    id: 'lab-2',
    title: 'Multi-Agent Research Pipeline',
    domain: 'Domain 1 — Agentic Engineering',
    examTopics: ['1.2 Multi-Agent Orchestration', '1.3 Subagent Invocation'],
    difficulty: 'Intermediate',
    duration: '40 min',
    description: 'Build a hub-and-spoke multi-agent system where a coordinator dynamically routes queries to specialized subagents. Each subagent has its own isolated context.',
    objectives: [
      'Implement a coordinator that routes to subagents',
      'Give each subagent its own isolated message context',
      'Handle dynamic subagent selection based on query type',
      'Aggregate subagent results into a final response',
    ],
    setup: 'Python 3.10+ with anthropic SDK',
    steps: [
      'Define subagent tools (researcher, analyst, summarizer)',
      'Create isolated message contexts per subagent',
      'Build the coordinator routing logic',
      'Aggregate and return the final result',
    ],
    codeTemplate: `import anthropic
import json
import sys

client = anthropic.Anthropic()

research_tool = {
    "name": "search_web",
    "description": "Search the web for information on a topic.",
    "input_schema": {
        "type": "object",
        "properties": {
            "query": {"type": "string", "description": "Search query"}
};
        "required": ["query"],
};
}

analysis_tool = {
    "name": "analyze_data",
    "description": "Analyze data and extract insights.",
    "input_schema": {
        "type": "object",
        "properties": {
            "data": {"type": "string", "description": "Data to analyze"}
};
        "required": ["data"],
};
}

def execute_tool(name: str, inputs: dict) -> str:
    print(f"\\n{'='*60}", file=sys.stderr)
    print(f"🔧 [TOOL EXEC] {name}({json.dumps(inputs)[:100]}...)", file=sys.stderr)
    if name == "search_web":
        output = json.dumps({"results": f"Found 5 articles about: {inputs['query']}"})
    elif name == "analyze_data":
        output = json.dumps({"insights": f"Key patterns found in: {inputs['data'][:50]}..."})
    else:
        output = json.dumps({"error": f"Unknown tool: {name}"})
    print(f"   Output: {output}", file=sys.stderr)
    print(f"{'='*60}", file=sys.stderr)
    return output


def run_subagent(name: str, tools: list, prompt: str, system: str) -> str:
    """Run a subagent with ISOLATED context."""
    print(f"\\n🚀 [SUBAGENT: {name}] Starting with isolated context", file=sys.stderr)
    messages = [{"role": "user", "content": prompt}]

    for turn in range(5):
        print(f"  📤 [{name} TURN {turn+1}]", file=sys.stderr)
        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1024,
            system=system,
            tools=tools,
            messages=messages,
        )

        messages.append({"role": "assistant", "content": response.content})

        if response.stop_reason == "end_turn":
            text = next((b.text for b in response.content if b.type == "text"), "")
            print(f"  ✅ [{name}] Complete: {text[:80]}...", file=sys.stderr)
            return text

        tool_results = []
        for block in response.content:
            if block.type == "tool_use":
                output = execute_tool(block.name, block.input)
                tool_results.append({
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": output,
                })
        if tool_results:
            messages.append({"role": "user", "content": tool_results})

    return "Subagent hit turn limit"


def run_coordinator(query: str) -> str:
    """Hub-and-spoke coordinator with dynamic routing."""
    print(f"\\n🚀 [COORDINATOR START] Query: {query}", file=sys.stderr)

    # Step 1: Research subagent
    print(f"\\n{'─'*60}", file=sys.stderr)
    print(f"📤 [ROUTING] Sending to Researcher subagent", file=sys.stderr)
    research = run_subagent(
        "researcher",
        [research_tool],
        f"Research this topic thoroughly: {query}",
        "You are a research specialist. Use search_web to find information."
    )

    # Step 2: Analysis subagent (gets ONLY the research output, not full context)
    print(f"\\n{'─'*60}", file=sys.stderr)
    print(f"📤 [ROUTING] Sending to Analyst subagent", file=sys.stderr)
    analysis = run_subagent(
        "analyst",
        [analysis_tool],
        f"Analyze these research findings:\\n{research}",
        "You are a data analyst. Extract key insights and patterns."
    )

    # Step 3: Synthesize
    print(f"\\n{'─'*60}", file=sys.stderr)
    print(f"📋 [SYNTHESIS] Combining research + analysis", file=sys.stderr)
    final = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1024,
        messages=[{"role": "user", "content": f"Based on this research:\\n{research}\\n\\nAnd this analysis:\\n{analysis}\\n\\nProvide a comprehensive answer to: {query}"}],
    )
    result = final.content[0].text
    print(f"\\n✅ [COORDINATOR COMPLETE] Final answer ready", file=sys.stderr)
    print(f"📋 [FINAL] {result[:200]}...", file=sys.stderr)
    return result


if __name__ == "__main__":
    result = run_coordinator("What are the latest trends in AI agent architectures?")
    print(f"\\n{'═' * 60}")
    print(f"📋 Result: {result}")
    print(f"{'═' * 60}")`,
};

export default lab_2;
