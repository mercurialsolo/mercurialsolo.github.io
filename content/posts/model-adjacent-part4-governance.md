---
title: "Model-Adjacent Products, Part 4: Governance & Practice"
date: 2026-01-09T13:00:00
author: mercurialsolo
tags: [ai, engineering, governance, alignment, operations]
summary: "Alignment is a runtime product surface. Teams need new operational patterns. The model is the CPU. The product is the computer."
series: ["Model-Adjacent Products"]
ShowToc: true
TocOpen: false
---

Alignment is a runtime product surface. Teams need new operational patterns. This part covers both.

## Runtime Alignment

Alignment isn't just a training concern. Production systems need configurable policies, transparent enforcement, and prompt injection defense.

### Policy Configuration

Define what's blocked, flagged, or allowed without retraining:

```yaml
policies:
  - name: "no_financial_advice"
    trigger:
      categories: ["investment", "stock_pick"]
    action: "block"
    message: "I can't provide financial advice."

  - name: "pii_detection"
    trigger:
      patterns: ["ssn", "credit_card"]
    action: "flag_for_review"

  - name: "competitor_mentions"
    trigger:
      entities: ["CompetitorA", "CompetitorB"]
    action: "log"
```

### Transparent Enforcement

When content is blocked, explain why:

```
User: "Should I buy NVIDIA stock?"

System: "I can't provide investment recommendations.
        [Policy: no_financial_advice]

        I can help with:
        - Understanding stock research methods
        - Explaining financial concepts"
```

The bracketed policy name helps support teams debug issues.

### Explainability

For complex decisions, show reasoning:

```
User: "Why Product B over Product A?"

System: "Based on your priorities (durability, under $500):
        - Product A: $450, 2-year warranty, mixed reviews
        - Product B: $480, 5-year warranty, excellent durability

        Product B better matches your durability priority.
        Sources: [product-catalog.md]"
```

### Prompt Injection Defense

Treat it as a security problem.

**Layers:**
1. Input sanitization (control characters, unusual Unicode)
2. Instruction hierarchy (system prompts override user content)
3. Output validation (responses don't leak injected instructions)
4. Monitoring (alert on injection patterns)

```python
suspicious_patterns = [
    r"ignore (previous|above|all) instructions",
    r"you are now",
    r"new persona",
    r"system:\s*",
]
```

## Team Practices

### Product Managers

- Latency is a P0 feature. Budget it per stage.
- Token cost is product cost. Understand economics of prompt changes.
- Memory is a user promise. Define retention, control, and deletion.
- Evals gate shipping. No eval suite, no deploy.

### Engineers

- Prompts are code. Version, review, test.
- Caching is architecture. Design for hits from day one.
- Tools need schemas. Stringly-typed integrations don't scale.
- Traces are mandatory. Production debugging requires them.

### Infrastructure

- Model serving is the easy part. Everything else is harder.
- Freshness has SLAs. Re-indexing is a production system.
- New metrics: tokens, latency distributions, eval scores.

## Checklist

### P0: Table Stakes
- [ ] Streaming UX (never freeze on slow responses)
- [ ] Prompt caching enabled
- [ ] Request tracing (prompt → response → latency → cost)
- [ ] One eval set in CI
- [ ] Basic guardrails

### P1: Production Ready
- [ ] Latency budgets (TTFT, per-token, p99)
- [ ] Fast-path / slow-path routing
- [ ] Retrieval with freshness SLAs and provenance
- [ ] Tool schemas with validation and permissions
- [ ] Judge-based verification
- [ ] Memory with user visibility and deletion

### P2: Mature
- [ ] Multi-tier caching (prompt, embedding, retrieval, tool)
- [ ] Hybrid retrieval (vector + lexical + reranking)
- [ ] Memory compaction and conflict resolution
- [ ] Adversarial eval suite
- [ ] Policy UI for non-technical stakeholders
- [ ] Cost attribution per user/feature

## Closing

The model is the CPU. The product is the computer.

The teams shipping successfully are past the model selection conversation. They're building infrastructure: latency engineering, token economics, retrieval systems, tool ecosystems, memory architecture, verification pipelines, alignment surfaces.

This infrastructure isn't glamorous. It doesn't demo well. But it's where production systems succeed or fail.

These are systems problems, not research problems. The patterns are emerging. The playbooks exist. Build the computer.

## References

**Latency & Caching**
- [vLLM Speculative Decoding](https://blog.vllm.ai/2024/10/17/spec-decode.html) (Oct 2024)
- [OpenAI Prompt Caching](https://openai.com/index/api-prompt-caching/) (Oct 2024)
- [OpenAI Realtime API](https://openai.com/index/introducing-gpt-realtime/) (Aug 2025)

**Retrieval & Memory**
- [Zep Graphiti](https://graphrag.com/appendices/research/2501.13956/) (Jan 2025)
- [Zep Open Source](https://www.getzep.com/product/open-source)

**Tools & Protocols**
- [Model Context Protocol](https://techcrunch.com/2024/11/25/anthropic-proposes-a-way-to-connect-data-to-ai-chatbots/) (Nov 2024)
- [Anthropic Desktop Extensions](https://www.anthropic.com/engineering/desktop-extensions) (Jun 2025)
- [Cursor MCP Docs](https://docs.cursor.com/context/model-context-protocol)

**Verification & Observability**
- [Amazon Q Unit Tests](https://aws.amazon.com/about-aws/whats-new/2024/12/amazon-q-developer-automatic-unit-test-generation/) (Dec 2024)
- [OpenAI Agents SDK Tracing](https://openai.github.io/openai-agents-js/guides/tracing/)
- [LangSmith Evaluation](https://docs.langchain.com/langsmith/evaluation-quickstart)
- [Langfuse + OTel](https://langfuse.com/blog/2024-10-opentelemetry-for-llm-observability) (Oct 2024)
- [MLflow 3 Agent Eval](https://docs.databricks.com/aws/en/mlflow3/genai/agent-eval-migration) (Dec 2025)

**Alignment & Governance**
- [Cloudflare Guardrails](https://blog.cloudflare.com/guardrails-in-ai-gateway/) (Feb 2025)
- [Policy Maps (UIST 2025)](https://fredhohman.com/papers/policy-maps)
- [OpenAI AgentKit](https://openai.com/index/introducing-agentkit/)

---

*Part of a 4-part series on building production AI systems.*
