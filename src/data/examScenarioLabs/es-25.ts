import type { ScenarioLab } from './types';

const es_25: ScenarioLab = {
    id: 'es-25',
    title: 'Provenance — Don\'t Average Conflicting Statistics',
    domain: 'Domain 5 — Safety & Production',
    domainNum: 5,
    scenario: 'Two reports give different market sizes ($407B vs $390B). The agent should present both with attribution, not average them. Averaging conflicts hides uncertainty and misleads.',
    examTopic: '5.6 Provenance & Attribution',
    difficulty: 'Easy',
    codeTemplate: `import anthropic
import json

client = anthropic.Anthropic()

# ============================================
# EXAM SCENARIO: Conflicting sources
# ============================================
# BROKEN: Average them → "$398.5B" (hides the conflict)
# FIXED: Present both with attribution → let the reader decide
# ============================================

SOURCES = [
    {
        "claim": "Global AI market size",
        "value": "$407 billion",
        "source": "Grand View Research, 2024",
        "methodology": "Bottom-up: revenue of 500+ AI companies",
    },
    {
        "claim": "Global AI market size",
        "value": "$390 billion",
        "source": "Statista, 2024",
        "methodology": "Top-down: total tech spend × AI adoption rate",
    },
]

PROVENANCE_PROMPT = """You are a research analyst. You have two conflicting data points about the same metric.

RULES:
1. Present BOTH values with full attribution
2. Explain the methodology difference
3. Classify as: established, contested, or single-source
4. NEVER average conflicting values
5. Include dates/sources for every claim

Format your response as:
- Value A: $X (source, methodology)
- Value B: $Y (source, methodology)
- Classification: contested
- Explanation: why they differ
- Recommendation: which to use and when"""


def analyze_with_provenance():
    """Correct approach: preserve provenance, present both."""
    print("=" * 60)
    print("✅ CORRECT: Present both with attribution")
    print("=" * 60)

    sources_text = json.dumps(SOURCES, indent=2)
    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=256,
        system=PROVENANCE_PROMPT,
        messages=[{"role": "user", "content": f"Analyze these conflicting data points:\\n\\n{sources_text}"}],
    )
    result = next(b.text for b in response.content if b.type == "text")
    print(f"\\n{result}")

    print(f"\\n\\n{'═'*60}")
    print("❌ WRONG (what NOT to do):")
    print("   'The AI market is $398.5B' (averaged 407 + 390)")
    print("   This hides the $17B discrepancy and the methodology difference!")
    print()
    print("✅ CORRECT:")
    print("   Present both: $407B (Grand View) vs $390B (Statista)")
    print("   Explain: bottom-up vs top-down methodology")
    print("   Classify: contested (two reputable sources disagree)")
    print("   Let the reader decide which methodology they trust")
    print()
    print("EXAM KEY:")
    print("  Never average conflicting statistics")
    print("  Present both with attribution (source + date + methodology)")
    print("  Classify: established vs contested vs single-source")
    print("  Include dates — stale info is unreliable info")
    print(f"{'═'*60}")


if __name__ == "__main__":
    analyze_with_provenance()`,
    expectedOutput: `Presents both values with source attribution.
Explains methodology difference.
Does NOT average or pick one.`,
    brokenCode: `# ❌ BROKEN: Averaging conflicting statistics
# 🐛 BUG: Averaging hides the discrepancy and methodology!
import anthropic
import json

client = anthropic.Anthropic()

# Simulated data from two research sources
SOURCE_A = {
    "study": "Nielsen 2024",
    "method": "Survey of 1,000 online shoppers",
    "result": "65% prefer mobile shopping",
    "confidence": "±3%"
}

SOURCE_B = {
    "study": "McKinsey 2024",
    "method": "Analysis of transaction data from 50 retailers",
    "result": "38% prefer mobile shopping",
    "confidence": "±2%"
}


# 🐛 BROKEN: Agent averages the numbers without analyzing WHY they differ
def broken_analysis(query: str) -> str:
    """🐛 Averages conflicting stats — loses methodology differences."""
    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1024,
        messages=[{
            "role": "user",
            "content": f"""{query}

Here are the sources:
Source A: {json.dumps(SOURCE_A)}
Source B: {json.dumps(SOURCE_B)}

Give me the average percentage."""  # 🐛 Just averages!
        }],
    )
    return response.content[0].text


# ✅ CORRECT: Analyze WHY the numbers differ
def correct_analysis(query: str) -> str:
    """✅ Compares methodologies and explains discrepancies."""
    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1024,
        messages=[{
            "role": "user",
            "content": f"""{query}

Here are the sources:
Source A: {json.dumps(SOURCE_A)}
Source B: {json.dumps(SOURCE_B)}

IMPORTANT: Do NOT simply average these numbers. Instead:
1. Compare the methodologies (survey vs transaction data)
2. Explain WHY the numbers differ
3. Identify which is more reliable for our use case
4. Provide a nuanced conclusion, not a single number"""
        }],
    )
    return response.content[0].text


if __name__ == "__main__":
    query = "What percentage of consumers prefer mobile shopping?"

    print("🐛 BROKEN analysis (blind averaging):")
    print("=" * 60)
    result = broken_analysis(query)
    print(result)
    print()
    print("🐛 Problem: (65% + 38%) / 2 = 51.5% — meaningless!")
    print("🐛 Averaging hides that Nielsen surveyed people while McKinsey analyzed transactions")
    print()
    print("✅ CORRECT analysis (methodology comparison):")
    print("=" * 60)
    result = correct_analysis(query)
    print(result)
`,
    hints: ["Never average conflicting statistics from different sources.", "Present both values with full attribution.", "Classify: established vs contested vs single-source."],
    fixes: ["Present both: \"$407B (Grand View) vs $390B (Statista)\".", "Explain WHY they differ: different methodologies.", "Let the reader decide which they trust."],
  };

export default es_25;
