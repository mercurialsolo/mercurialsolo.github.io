---
title: "Model-Adjacent Products, Part 3: Quality Gates"
date: 2026-01-09T12:00:00
author: mercurialsolo
tags: [ai, engineering, verification, observability, evals, testing]
summary: "Model outputs are hypotheses. Verification, observability, and evals determine whether those hypotheses survive contact with production."
series: ["Model-Adjacent Products"]
ShowToc: true
TocOpen: false
---

Model outputs are hypotheses. Verification, observability, and evals determine whether those hypotheses survive contact with production.

## Verification

Treat model outputs as proposals to be tested.

### Pipeline

```
Output → Syntax Check → Execution → Output Validation → Judge Review
```

Each stage can pass, fail, or escalate.

### Execution-Based Verification

For code, SQL, or executable output:

```python
def verify_code(code: str, tests: list) -> Result:
    # 1. Syntax
    try:
        ast.parse(code)
    except SyntaxError as e:
        return Result(passed=False, stage="syntax", error=str(e))

    # 2. Execute in sandbox
    sandbox = Sandbox(timeout=5, memory="256MB")
    try:
        sandbox.exec(code)
    except Exception as e:
        return Result(passed=False, stage="execution", error=str(e))

    # 3. Test cases
    for test in tests:
        result = sandbox.call(test.fn, test.input)
        if result != test.expected:
            return Result(passed=False, stage="test",
                         error=f"Expected {test.expected}, got {result}")

    return Result(passed=True)
```

### LLM-as-Judge

For subjective quality:

```
Evaluate this response on:
1. Accuracy (uses context correctly)
2. Completeness (addresses the question)
3. Clarity (well-structured)
4. Safety (no harmful content)

Score 1-5. Flag issues for scores below 3.
```

Use a separate model. The generating model shouldn't judge itself.

### Self-Consistency

For high-stakes decisions, sample multiple times:

```python
def verify_consistency(prompt: str, n: int = 3) -> Result:
    responses = [model.generate(prompt) for _ in range(n)]
    claims = [extract_claim(r) for r in responses]

    if all_equal(claims):
        return Result(confident=True, answer=claims[0])
    return Result(confident=False, candidates=claims)
```

Disagreement triggers review or voting.

## Observability

If you can't measure it, you can't improve it.

### Trace Structure

Every request produces a trace:

```json
{
  "trace_id": "tr_abc123",
  "stages": [
    {"name": "routing", "duration_ms": 25, "result": "fast_path"},
    {"name": "cache", "duration_ms": 8, "result": "hit"},
    {"name": "generation", "duration_ms": 180, "tokens": {"in": 1200, "out": 340, "cached": 950}},
    {"name": "safety", "duration_ms": 45, "result": "pass"}
  ],
  "total_ms": 258,
  "cost_usd": 0.0034
}
```

### What to Track

**Per-request:**
- Latency by stage
- Token counts (input, output, cached)
- Cost
- Cache hit/miss
- Tool calls and results
- Safety check outcomes

**Aggregate:**
- p50, p95, p99 latency
- Cache hit rates
- Error rates by type
- Cost per user/feature
- Eval scores over time

## Evals

Shipping without evals is like shipping without tests.

### Dataset Types

**Golden set:** Hand-curated examples with known-good answers. Run on every change.

**Regression set:** Previously failed cases. Prevents backsliding.

**Adversarial set:** Jailbreaks, prompt injections, edge cases. Security testing.

### Example Case

```yaml
- id: "refund_policy_001"
  category: "golden"
  input: "Can I get a refund after 60 days?"
  expected:
    - must_cite: "refund-policy.md"
    - must_mention: "30-day limit"
    - must_not: "promise refund"
  judge_criteria:
    accuracy: ">= 4"
```

### Evals as CI

```yaml
# .github/workflows/eval.yml
on:
  push:
    paths: ['prompts/**', 'config/models.yaml']

jobs:
  eval:
    steps:
      - run: python eval/run.py --suite golden --threshold 0.95
      - run: python eval/run.py --suite regression --threshold 1.0
      - run: python eval/run.py --suite adversarial --threshold 0.99
```

Prompt changes don't merge without passing evals.

## Failure Modes

### Verification
- Judge disagrees with users (calibrate on real feedback)
- False positives blocking good outputs (tune thresholds)
- Sandbox escapes (use proper isolation)

### Observability
- Missing stages in traces (instrument everything)
- Cost attribution gaps (tag by user/feature)
- Alert fatigue (prioritize actionable metrics)

### Evals
- Stale golden sets (refresh quarterly)
- Gaming the metrics (diverse test cases)
- Slow CI (parallelize, cache)

## What's Next

Part 4 covers alignment, governance, and operational practices—how teams actually run these systems.

---

*Part of a 4-part series on building production AI systems.*
