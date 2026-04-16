import type { ScenarioLab } from './types';

const es_18: ScenarioLab = {
    id: 'es-18',
    title: 'Structured Output — Tool + Schema vs "respond in JSON"',
    domain: 'Domain 4 — Prompt Engineering',
    domainNum: 4,
    scenario: 'You need guaranteed JSON output for downstream processing. Using "respond in JSON" in the prompt is unreliable — Claude sometimes adds markdown or commentary. Use tool use + JSON schema to force structure.',
    examTopic: '4.4 Structured Output',
    difficulty: 'Medium',
    codeTemplate: `import anthropic
import json

client = anthropic.Anthropic()

# ============================================
# EXAM SCENARIO: Guaranteed JSON output
# ============================================
# BROKEN: "respond in JSON" → Claude adds markdown, commentary, etc.
# FIXED: tool use + JSON schema → guaranteed structure
# ============================================

# ❌ BROKEN: Prompt-based JSON
def broken_json_extraction(text: str) -> dict:
    print(f"\\n❌ [BROKEN] Asking Claude to 'respond in JSON'...")
    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=256,
        messages=[{"role": "user", "content": f"Extract entities as JSON. Respond in JSON only.\\n\\nText: {text}"}],
    )
    result = next(b.text for b in response.content if b.type == "text")
    print(f"   Raw response: {result[:200]}")
    try:
        # Claude might add markdown fences, commentary, etc.
        clean = result.strip().replace(chr(96), '').strip()
        if clean.startswith('json'):
            clean = clean[4:]
        return json.loads(clean)
    except json.JSONDecodeError as e:
        print(f"   ⚠️  JSON parse FAILED: {e}")
        return {}


# ✅ FIXED: Tool use + JSON schema
extraction_tool = {
    "name": "extract_entities",
    "description": "Extracts named entities from text",
    "input_schema": {
        "type": "object",
        "properties": {
            "people": {"type": "array", "items": {"type": "string"}, "description": "Person names found"},
            "organizations": {"type": "array", "items": {"type": "string"}, "description": "Organization names"},
            "locations": {"type": "array", "items": {"type": "string"}, "description": "Location names"},
        },
        "required": ["people", "organizations", "locations"],
    },
}

def fixed_json_extraction(text: str) -> dict:
    print(f"\\n✅ [FIXED] Using tool use + JSON schema...")
    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=256,
        tools=[extraction_tool],
        tool_choice={"type": "tool", "name": "extract_entities"},  # FORCE this tool
        messages=[{"role": "user", "content": f"Extract entities from:\\n\\n{text}"}],
    )
    for block in response.content:
        if block.type == "tool_use":
            print(f"   ✅ Structured output: {json.dumps(block.input, indent=2)}")
            return block.input
    return {}


if __name__ == "__main__":
    text = "Tim Cook announced Apple's new headquarters in Cupertino. Elon Musk responded from Tesla's Austin office."

    print("=" * 60)
    broken_json_extraction(text)
    print(f"\\n{'='*60}")
    fixed_json_extraction(text)

    print(f"\\n{'═'*60}")
    print("EXAM KEY:")
    print("  'respond in JSON' → unreliable, may include markdown/commentary")
    print("  tool use + JSON schema → GUARANTEED structure")
    print("  tool_choice: {type: 'tool', name: '...'} → forces the tool")
    print("  Validation + retry for FORMAT errors only")
    print("  Retries DON'T fix MISSING info — add more context instead")
    print(f"{'═'*60}")`,
    expectedOutput: `BROKEN: May include triple-backtick json fences or commentary → parse fails
FIXED: Returns clean JSON object matching schema exactly`,
    brokenCode: `# ❌ BROKEN: "Respond in JSON" without schema
# 🐛 BUG: No schema, no example, no validation — unpredictable output
import anthropic
import json

client = anthropic.Anthropic()

# 🐛 BROKEN: Just asks for JSON without any structure
BROKEN_SYSTEM = "You are a data extractor. Respond in JSON."  # 🐛 No schema!

# ✅ CORRECT: Provides explicit schema
CORRECT_SYSTEM = """You are a data extractor. Respond with JSON matching this schema:
{
  "name": "string - person's full name",
  "email": "string - email address",
  "phone": "string or null - phone number",
  "address": {
    "street": "string",
    "city": "string",
    "state": "string",
    "zip": "string"
  }
}
Always include all fields. Use null for missing optional fields."""


def extract_with_broken(text: str) -> dict:
    """🐛 BROKEN: No schema validation."""
    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1024,
        system=BROKEN_SYSTEM,  # 🐛 "Respond in JSON" — but what structure?
        messages=[{"role": "user", "content": f"Extract contact info: {text}"}],
    )

    raw = response.content[0].text
    print(f"📥 Raw response: {raw[:200]}...")

    # 🐛 Parsing may fail — no guaranteed structure!
    try:
        data = json.loads(raw)
        # 🐛 No validation — missing fields? Wrong types? Who knows!
        return data
    except json.JSONDecodeError:
        print("❌ JSON parse failed! Unpredictable output format.")
        return {"error": "Could not parse"}


def extract_with_correct(text: str) -> dict:
    """✅ CORRECT: Schema-based extraction."""
    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1024,
        system=CORRECT_SYSTEM,
        messages=[{"role": "user", "content": f"Extract contact info: {text}"}],
    )

    raw = response.content[0].text
    data = json.loads(raw)

    # Validate required fields
    required = ["name", "email", "address"]
    for field in required:
        if field not in data:
            raise ValueError(f"Missing required field: {field}")

    return data


if __name__ == "__main__":
    test_text = "João Silva, joao@email.com, (11) 99999-0000, Rua das Flores 123, São Paulo, SP, 01234-567"

    print("🐛 BROKEN (no schema):")
    print("-" * 40)
    result = extract_with_broken(test_text)
    print(f"Result: {json.dumps(result, indent=2)}")
    print("🐛 No guaranteed fields, types, or nesting!")
`,
    hints: ["\"Respond in JSON\" is unreliable without an explicit schema.", "Use structured output with a JSON schema definition.", "Validate the response against the schema after parsing."],
    fixes: ["Provide an explicit JSON schema in the system prompt.", "Use tool use for structured extraction (guaranteed JSON).", "Add validation: try/except json.loads() + check required fields."],
  };

export default es_18;
