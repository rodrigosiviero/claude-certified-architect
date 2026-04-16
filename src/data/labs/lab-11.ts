const lab_11 = {
    id: 'lab-11',
    title: 'Structured Extraction Pipeline',
    domain: 'Domain 4 — Prompt Engineering',
    examTopics: ['4.4 Structured Output', '4.5 Prompt Chaining', '4.6 Prompt Evaluation'],
    difficulty: 'Advanced',
    duration: '45 min',
    description: 'Build a multi-step extraction pipeline that chains prompts together, enforces structured output, and evaluates results quality.',
    objectives: [
      'Chain prompts into a multi-step pipeline',
      'Enforce JSON output schema validation',
      'Implement prompt evaluation metrics',
      'Handle extraction failures gracefully',
    ],
    setup: 'Python 3.10+ with anthropic SDK',
    steps: [
      'Define the extraction schema',
      'Build prompt chain: extract → validate → enrich',
      'Add evaluation metrics',
      'Test with sample documents',
    ],
    codeTemplate: `import anthropic
import json
import sys
import re

client = anthropic.Anthropic()

print("=" * 60, file=sys.stderr)
print("🧪 LAB 11: Structured Extraction Pipeline", file=sys.stderr)
print("=" * 60, file=sys.stderr)

# --- Extraction Schema ---
PERSON_SCHEMA = {
    "type": "object",
    "properties": {
        "name": {"type": "string"},
        "email": {"type": "string"},
        "company": {"type": "string"},
        "role": {"type": "string"},
};
    "required": ["name", "email"],
}

print(f"\\n📦 [SETUP] Schema defined: {list(PERSON_SCHEMA['properties'].keys())}", file=sys.stderr)
print(f"   Required fields: {PERSON_SCHEMA['required']}", file=sys.stderr)


# --- Step 1: Extract ---
def extract_info(document: str) -> dict:
    print(f"\\n{'─' * 60}", file=sys.stderr)
    print(f"📋 [STEP 1/3] EXTRACT", file=sys.stderr)
    print(f"   📄 Document length: {len(document)} chars", file=sys.stderr)
    print(f"   📤 [REQUEST] Sending to Claude...", file=sys.stderr)

    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=512,
        system=(
            "Extract person information from the text. "
            "Return ONLY valid JSON matching this schema: "
            f"{json.dumps(PERSON_SCHEMA)}. "
            "Use null for missing fields. No markdown fences."
        ),
        messages=[{"role": "user", "content": document}],
    )

    print(f"   📥 [RESPONSE] stop_reason={response.stop_reason}", file=sys.stderr)
    text = next(b.text for b in response.content if b.type == "text").strip()
    print(f"   📊 Raw output: {text[:100]}...", file=sys.stderr)

    try:
        data = json.loads(text)
        print(f"   ✅ JSON parsed: {list(data.keys())}", file=sys.stderr)
        return data
    except json.JSONDecodeError as e:
        print(f"   ❌ JSON parse error: {e}", file=sys.stderr)
        return {"error": f"Parse failed: {e}"}


# --- Step 2: Validate ---
def validate_extraction(data: dict) -> dict:
    print(f"\\n{'─' * 60}", file=sys.stderr)
    print(f"📋 [STEP 2/3] VALIDATE", file=sys.stderr)

    missing = [f for f in PERSON_SCHEMA["required"] if f not in data or data[f] is None]
    if missing:
        print(f"   ❌ Missing required fields: {missing}", file=sys.stderr)
        return {"valid": False, "missing": missing, "data": data}

    # Type checks
    type_errors = []
    for field, spec in PERSON_SCHEMA["properties"].items():
        if field in data and data[field] is not None:
            if spec["type"] == "string" and not isinstance(data[field], str):
                type_errors.append(f"{field}: expected string, got {type(data[field]).__name__}")

    if type_errors:
        print(f"   ❌ Type errors: {type_errors}", file=sys.stderr)
        return {"valid": False, "type_errors": type_errors, "data": data}

    print(f"   ✅ Validation passed!", file=sys.stderr)
    return {"valid": True, "data": data}


# --- Step 3: Enrich ---
def enrich_data(data: dict) -> dict:
    print(f"\\n{'─' * 60}", file=sys.stderr)
    print(f"📋 [STEP 3/3] ENRICH", file=sys.stderr)
    print(f"   📤 [REQUEST] Asking Claude to infer missing fields...", file=sys.stderr)

    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=256,
        system="Given partial person data, infer likely company and role. Return JSON with 'company' and 'role'.",
        messages=[{"role": "user", "content": json.dumps(data)}],
    )

    print(f"   📥 [RESPONSE] stop_reason={response.stop_reason}", file=sys.stderr)
    text = next(b.text for b in response.content if b.type == "text").strip()
    try:
        enrichment = json.loads(text)
        print(f"   ✅ Enrichment: {enrichment}", file=sys.stderr)
        return {**data, **enrichment}
    except json.JSONDecodeError:
        print(f"   ⚠️  Enrichment parse failed, returning original", file=sys.stderr)
        return data


# --- Pipeline ---
def run_pipeline(document: str) -> dict:
    print(f"\\n🚀 [PIPELINE START]", file=sys.stderr)
    print(f"   📄 Input: \\"{document[:60]}...\\"", file=sys.stderr)

    extracted = extract_info(document)
    validation = validate_extraction(extracted)

    if not validation.get("valid"):
        print(f"\\n⚠️  [PIPELINE] Extraction incomplete, attempting enrich...", file=sys.stderr)
        result = enrich_data(extracted)
    else:
        result = validation["data"]

    print(f"\\n{'═' * 60}", file=sys.stderr)
    print(f"📋 [PIPELINE COMPLETE] Result:", file=sys.stderr)
    print(f"   {json.dumps(result, indent=2)}", file=sys.stderr)
    return result


if __name__ == "__main__":
    doc = "John Smith (john@acmecorp.com) is the VP of Engineering at Acme Corp."
    result = run_pipeline(doc)
    print(f"\\n{'═' * 60}")
    print(f"📋 Final: {json.dumps(result, indent=2)}")
    print(f"{'═' * 60}")`,
};

export default lab_11;
