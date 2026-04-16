import type { ScenarioLab } from './types';

const es_2: ScenarioLab = {
    id: 'es-2',
    title: 'Hub-and-Spoke Coordinator — Dynamic Subagent Routing',
    domain: 'Domain 1 — Agentic Engineering',
    domainNum: 1,
    scenario: 'Your research coordinator routes EVERY request through all three subagents regardless of query type. Users asking for a quick fact still wait for the full pipeline. Implement dynamic routing where the coordinator selects only relevant subagents.',
    examTopic: '1.2 Multi-Agent Orchestration',
    difficulty: 'Advanced',
    codeTemplate: `import anthropic
import json

client = anthropic.Anthropic()

# ============================================
# EXAM SCENARIO: Dynamic subagent routing
# ============================================
# PROBLEM: Coordinator sends everything through all subagents.
# FIX: Let the coordinator dynamically select which subagents to invoke.
# ============================================

SUBAGENTS = {
    "researcher": {
        "system": "You are a research specialist. Find factual information on the given topic.",
        "description": "Finds factual information — use for 'what is', 'explain', factual queries",
    },
    "analyst": {
        "system": "You are a data analyst. Analyze data, find patterns, compute statistics.",
        "description": "Analyzes numerical data — use for 'calculate', 'analyze', 'compare' queries",
    },
    "writer": {
        "system": "You are a professional writer. Compose polished reports and summaries.",
        "description": "Writes polished outputs — use when user wants a report or summary",
    },
}

def call_subagent(key: str, task: str) -> str:
    """Invoke subagent with isolated context."""
    agent = SUBAGENTS[key]
    print(f"   🤖 [SUBAGENT] Invoking {key}...")
    print(f"      Task: {task[:80]}...")
    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1024,
        system=agent["system"],
        messages=[{"role": "user", "content": task}],
    )
    result = next(b.text for b in response.content if b.type == "text")
    print(f"      Result: {result[:100]}...")
    return result


ROUTER_PROMPT = """You are a task router. Given a user query, decide which specialists to invoke.
Available specialists:
{descriptions}

Return a JSON object with:
- "subagents": list of specialist names to invoke (in order)
- "tasks": dict mapping each specialist name to its specific task

IMPORTANT: Only invoke specialists that are actually needed. Don't invoke all of them by default.

User query: {query}"""


def run_coordinator(query: str) -> str:
    print(f"\\n🚀 [COORDINATOR] Received query: \\"{query}\\"")

    # Step 1: Route — decide which subagents to use
    print(f"\\n📡 [ROUTING] Asking coordinator to select subagents...")
    descriptions = "\\n".join(f"- {k}: {v['description']}" for k, v in SUBAGENTS.items())

    route_response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=512,
        system=ROUTER_PROMPT.format(descriptions=descriptions, query=query),
        messages=[{"role": "user", "content": query}],
    )
    route_text = next(b.text for b in route_response.content if b.type == "text")
    print(f"   📋 Router response: {route_text}")

    try:
        plan = json.loads(route_text)
    except json.JSONDecodeError:
        print("   ⚠️  Router didn't return valid JSON, defaulting to all subagents")
        plan = {"subagents": list(SUBAGENTS.keys()), "tasks": {k: query for k in SUBAGENTS}}

    selected = plan.get("subagents", [])
    tasks = plan.get("tasks", {})
    print(f"\\n🎯 [SELECTED] {len(selected)} subagent(s): {selected}")

    # Step 2: Execute selected subagents
    results = {}
    for agent_key in selected:
        task = tasks.get(agent_key, query)
        print(f"\\n{'─'*40}")
        results[agent_key] = call_subagent(agent_key, task)

    # Step 3: Synthesize
    print(f"\\n{'─'*40}")
    print(f"📝 [SYNTHESIS] Combining results from {len(results)} subagent(s)...")
    combined = "\\n\\n".join(f"## {k.title()}\\n{v}" for k, v in results.items())
    final = call_subagent("writer", f"Synthesize this into a clear answer:\\n\\n{combined}")

    print(f"\\n{'═'*60}")
    print(f"📋 [FINAL ANSWER]\\n{final}")
    return final


if __name__ == "__main__":
    # Test 1: Quick fact — should only need researcher
    print("=" * 60)
    print("TEST 1: Quick factual question")
    run_coordinator("What is the capital of France?")

    # Test 2: Analysis — should need researcher + analyst
    print("\\n\\n" + "=" * 60)
    print("TEST 2: Analysis question")
    run_coordinator("Compare the GDP of Brazil and Argentina over the last 5 years")
`,
    expectedOutput: `🚀 [COORDINATOR] Received query: "What is the capital of France?"
📡 [ROUTING] Asking coordinator to select subagents...
   📋 Router response: {"subagents": ["researcher"], "tasks": {"researcher": "What is the capital of France?"}}
🎯 [SELECTED] 1 subagent(s): ['researcher']
────────────────────────────────────────
   🤖 [SUBAGENT] Invoking researcher...
      Task: What is the capital of France?...
      Result: The capital of France is Paris...
📝 [SYNTHESIS] Combining results from 1 subagent(s)...`,
    brokenCode: `# ❌ BROKEN: "Coordinator" that shares context between subagents
# 🐛 BUG: Single shared message history for ALL subagents
import anthropic
import json

client = anthropic.Anthropic()

research_tool = {
    "name": "search_web",
    "description": "Search the web for information.",
    "input_schema": {
        "type": "object",
        "properties": {
            "query": {"type": "string", "description": "Search query"}
        },
        "required": ["query"],
    },
}

summary_tool = {
    "name": "summarize",
    "description": "Summarize text content.",
    "input_schema": {
        "type": "object",
        "properties": {
            "text": {"type": "string", "description": "Text to summarize"}
        },
        "required": ["text"],
    },
}

def execute_tool(name: str, inputs: dict) -> str:
    print(f"🔧 [TOOL EXEC] {name}({json.dumps(inputs)})")
    if name == "search_web":
        return json.dumps({"results": f"Search results for: {inputs['query']}"})
    elif name == "summarize":
        return json.dumps({"summary": f"Summary of: {inputs['text'][:50]}..."})
    return json.dumps({"error": f"Unknown tool: {name}"})


class BrokenCoordinator:
    """🐛 BROKEN: All subagents share ONE message history."""
    def __init__(self):
        self.messages = []  # 🐛 Single shared context!
        self.system = "You are a research coordinator with subagents."

    def call_subagent(self, agent_name: str, tools: list, prompt: str) -> str:
        """🐛 BUG: All agents read/write the same self.messages."""
        print(f"\\n🚀 [SUBAGENT: {agent_name}] Starting...")

        # 🐛 BUG: Appending to SHARED history
        self.messages.append({"role": "user", "content": prompt})

        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1024,
            system=self.system,
            tools=tools,
            messages=self.messages,  # 🐛 Shared context!
        )

        self.messages.append({"role": "assistant", "content": response.content})

        # Process tool calls
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
            self.messages.append({"role": "user", "content": tool_results})
            # 🐛 Gets second response with shared context from ALL previous agents!
            response2 = client.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=1024,
                system=self.system,
                tools=tools,
                messages=self.messages,  # 🐛 Everything from previous agents!
            )
            self.messages.append({"role": "assistant", "content": response2.content})

        text = ""
        for block in response.content:
            if hasattr(block, "text") and block.type == "text":
                text += block.text
        print(f"   📋 {agent_name} result: {text[:80]}...")
        return text

    def research(self, query: str) -> str:
        """Route query through all subagents."""
        print(f"🚀 [COORDINATOR] Research query: {query}")

        # Subagent 1: Researcher
        research_result = self.call_subagent(
            "researcher",
            [research_tool],
            f"Research: {query}"
        )

        # 🐛 Subagent 2 sees Subagent 1's entire conversation!
        summary_result = self.call_subagent(
            "summarizer",
            [summary_tool],
            f"Summarize the research findings"
        )

        return summary_result


if __name__ == "__main__":
    coordinator = BrokenCoordinator()
    result = coordinator.research("Impact of AI on software engineering")
    print(f"\\nFinal: {result}")
`,
    hints: ["Subagents should have ISOLATED contexts — no shared message history.", "Each subagent gets its own fresh messages array with only its task.", "The coordinator collects and synthesizes results, not shares raw context."],
    fixes: ["Each call_subagent() creates its own messages, not reuse self.messages.", "Pass only the relevant task/context as the user message to each subagent.", "The coordinator synthesizes results after all subagents return."],
  };

export default es_2;
