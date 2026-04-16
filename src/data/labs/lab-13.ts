const lab_13 = {
    id: 'lab-13',
    title: 'Evaluation & Monitoring System',
    domain: 'Domain 5 — Safety & Evaluation',
    examTopics: ['5.3 Evaluation Methods', '5.5 Monitoring & Observability'],
    difficulty: 'Advanced',
    duration: '45 min',
    description: 'Build a comprehensive evaluation framework that measures agent quality across multiple dimensions, plus a monitoring system.',
    objectives: [
      'Implement multi-dimensional evaluation',
      'Create golden test sets',
      'Build automated quality scoring',
      'Design monitoring with alerting',
    ],
    setup: 'Python 3.10+ with anthropic SDK',
    steps: [
      'Define evaluation dimensions',
      'Create golden test set',
      'Build evaluation runner',
      'Design monitoring dashboard',
    ],
    codeTemplate: `import anthropic
import json
import time
import sys
from dataclasses import dataclass, field
from enum import Enum

client = anthropic.Anthropic()

print("=" * 60, file=sys.stderr)
print("🧪 LAB 13: Evaluation & Monitoring System", file=sys.stderr)
print("=" * 60, file=sys.stderr)


class EvalDimension(str, Enum):
    ACCURACY = "accuracy"
    RELEVANCE = "relevance"
    SAFETY = "safety"
    TOOL_SELECTION = "tool_selection"
    COMPLETENESS = "completeness"

print(f"\\n📦 [SETUP] Eval dimensions: {[d.value for d in EvalDimension]}", file=sys.stderr)


@dataclass
class TestCase:
    input: str
    expected_tool: str | None = None
    expected_keywords: list[str] = field(default_factory=list)
    must_not_contain: list[str] = field(default_factory=list)
    category: str = ""


@dataclass
class EvalResult:
    test_case: TestCase
    actual_output: str
    tools_used: list[str]
    scores: dict[str, float] = field(default_factory=dict)
    latency_ms: float = 0


GOLDEN_TESTS = [
    TestCase(
        input="Where is my order ORD-12345?",
        expected_tool="search_orders",
        expected_keywords=["ORD-12345", "status"],
        must_not_contain=["SSN", "credit card"],
        category="order_lookup",
    ),
    TestCase(
        input="I want a refund for my last purchase",
        expected_tool="process_refund",
        expected_keywords=["refund"],
        must_not_contain=["cannot", "impossible"],
        category="refund",
    ),
    TestCase(
        input="What products do you have under $50?",
        expected_tool="search_products",
        expected_keywords=["product", "$50"],
        category="product_search",
    ),
]

print(f"\\n📦 [SETUP] Golden test set: {len(GOLDEN_TESTS)} cases", file=sys.stderr)
for tc in GOLDEN_TESTS:
    print(f"   📋 [{tc.category}] \\"{tc.input[:40]}...\\"", file=sys.stderr)


def llm_judge(question: str, answer: str, dimension: EvalDimension) -> float:
    print(f"   🤖 [LLM JUDGE] Rating {dimension.value}...", file=sys.stderr)
    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=64,
        system=f"Rate the {dimension.value} of the answer on 0.0-1.0. ONLY the number.",
        messages=[{
            "role": "user",
            "content": f"Question: {question}\\nAnswer: {answer}\\n\\nRate {dimension.value}:",
        }],
    )
    text = next(b.text for b in response.content if b.type == "text").strip()
    try:
        score = max(0.0, min(1.0, float(text)))
        print(f"      Score: {score}", file=sys.stderr)
        return score
    except ValueError:
        print(f"      Parse failed, default 0.5", file=sys.stderr)
        return 0.5


def run_evaluation(tests: list[TestCase]) -> list[EvalResult]:
    print(f"\\n🚀 [EVAL START] Running {len(tests)} test cases...", file=sys.stderr)
    results = []

    for i, tc in enumerate(tests):
        print(f"\\n{'═' * 60}", file=sys.stderr)
        print(f"📋 [TEST {i+1}/{len(tests)}] Category: {tc.category}", file=sys.stderr)
        print(f"   📝 Input: \\"{tc.input}\\"", file=sys.stderr)
        print(f"   🎯 Expected tool: {tc.expected_tool}", file=sys.stderr)
        print(f"   📤 [REQUEST] Sending to agent...", file=sys.stderr)

        start = time.time()
        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=512,
            messages=[{"role": "user", "content": tc.input}],
        )
        output = next(b.text for b in response.content if b.type == "text")
        latency = (time.time() - start) * 1000

        print(f"   📥 [RESPONSE] stop_reason={response.stop_reason}", file=sys.stderr)
        print(f"   ⏱️  Latency: {latency:.0f}ms", file=sys.stderr)
        print(f"   📊 Output: {output[:80]}...", file=sys.stderr)

        # Score dimensions
        print(f"   \\n📊 [SCORING] Computing quality scores...", file=sys.stderr)
        scores = {}
        scores["accuracy"] = llm_judge(tc.input, output, EvalDimension.ACCURACY)
        scores["relevance"] = llm_judge(tc.input, output, EvalDimension.RELEVANCE)

        has_bad = any(bad in output for bad in tc.must_not_contain)
        scores["safety"] = 0.0 if has_bad else 1.0
        print(f"   🛡️  Safety: {'❌ UNSAFE' if has_bad else '✅ Safe'}", file=sys.stderr)

        kw_hits = sum(1 for kw in tc.expected_keywords if kw.lower() in output.lower())
        scores["completeness"] = kw_hits / max(len(tc.expected_keywords), 1)
        print(f"   📋 Completeness: {kw_hits}/{len(tc.expected_keywords)} keywords", file=sys.stderr)

        results.append(EvalResult(
            test_case=tc, actual_output=output,
            tools_used=[], scores=scores, latency_ms=latency,
        ))
        print(f"   ✅ Test complete", file=sys.stderr)

    return results


def print_dashboard(results: list[EvalResult]):
    print(f"\\n{'═' * 60}", file=sys.stderr)
    print(f"📊 [DASHBOARD] Agent Quality Report", file=sys.stderr)
    print(f"{'═' * 60}", file=sys.stderr)

    all_dims = set()
    for r in results:
        all_dims.update(r.scores.keys())

    for dim in sorted(all_dims):
        scores = [r.scores.get(dim, 0) for r in results]
        avg = sum(scores) / len(scores)
        status = "✅" if avg >= 0.8 else "⚠️" if avg >= 0.6 else "❌"
        print(f"  {status} {dim:20s} {avg:.2f} (avg)", file=sys.stderr)

    avg_latency = sum(r.latency_ms for r in results) / len(results)
    print(f"\\n  ⏱️  Avg latency: {avg_latency:.0f}ms", file=sys.stderr)
    print(f"{'═' * 60}", file=sys.stderr)


if __name__ == "__main__":
    results = run_evaluation(GOLDEN_TESTS)
    print_dashboard(results)
    print(f"\\n{'═' * 60}")
    print(f"📋 Evaluation complete — see dashboard above")
    print(f"{'═' * 60}")`,
};

export default lab_13;
