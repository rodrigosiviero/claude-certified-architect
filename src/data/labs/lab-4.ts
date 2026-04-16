const lab_4 = {
    id: 'lab-4',
    title: 'Task Decomposition & Workflow Enforcement',
    domain: 'Domain 1 — Agentic Engineering',
    examTopics: ['1.4 Workflow Enforcement', '1.6 Task Decomposition'],
    difficulty: 'Intermediate',
    duration: '40 min',
    description: 'Implement task decomposition with workflow enforcement — break complex tasks into ordered steps with dependencies and validation gates.',
    objectives: [
      'Decompose a complex request into ordered subtasks',
      'Implement dependency tracking between subtasks',
      'Add validation gates between workflow steps',
      'Handle partial failures with rollback logic',
    ],
    setup: 'Python 3.10+ with anthropic SDK',
    steps: [
      'Define the task decomposition schema',
      'Build dependency resolution logic',
      'Add validation gates between steps',
      'Implement failure handling and rollback',
    ],
    codeTemplate: `import anthropic
import json
import sys

client = anthropic.Anthropic()

def decompose_task(prompt: str) -> list:
    """Decompose a complex task into ordered subtasks."""
    print("\\n🚀 [DECOMPOSE] Breaking down task...", file=sys.stderr)
    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1024,
        messages=[{"role": "user", "content": f"Break this task into 3-5 ordered steps: {prompt}"}],
    )
    steps = response.content[0].text.split("\\n")
    steps = [s.strip().lstrip("0123456789.-) ") for s in steps if s.strip()]
    print(f"   📋 Generated {len(steps)} steps", file=sys.stderr)
    for i, s in enumerate(steps):
        print(f"   Step {i+1}: {s[:60]}...", file=sys.stderr)
    return steps


def run_workflow(prompt: str) -> str:
    """Execute a decomposed workflow with enforcement."""
    steps = decompose_task(prompt)
    messages = [{"role": "user", "content": prompt}]

    for i, step in enumerate(steps):
        print(f"\\n{'─'*60}", file=sys.stderr)
        print(f"📤 [STEP {i+1}/{len(steps)}] {step[:60]}...", file=sys.stderr)

        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1024,
            messages=messages,
        )
        messages.append({"role": "assistant", "content": response.content})

        result = next((b.text for b in response.content if b.type == "text"), "")
        print(f"   ✅ Result: {result[:100]}...", file=sys.stderr)

    print(f"\\n✅ [WORKFLOW COMPLETE] All {len(steps)} steps done", file=sys.stderr)
    return result


if __name__ == "__main__":
    result = run_workflow("Research AI agent architectures and write a summary")
    print(f"\\n{'='*60}")
    print(f"Result: {result}")
    print(f"{'='*60}")`,
};

export default lab_4;
