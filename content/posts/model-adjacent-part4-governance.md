---
title: "Model-Adjacent Products, Part 4: Governance & Practice"
date: 2026-01-09T13:00:00
author: mercurialsolo
tags: [ai, engineering, governance, alignment, operations, security]
summary: "Alignment as a runtime surface, policy enforcement without retraining. Team practices that ship."
series: ["Model-Adjacent Products"]
ShowToc: true
TocOpen: false
---

## The Alignment Gap

Your model is fast (Part 1), remembers (Part 2), and self-verifies (Part 3). It's capable and accurate.

Yet, it still might:
- Give out financial advice you're not licensed to provide
- Leak PII from its context window
- Execute a prompt that hijacks its goals

Adding capability without proper governance is setting up for chaos. We cover alignment as a runtime surface for the computer; not a training-time prayer add-on.

---

Alignment is a runtime product surface. Teams need new operational patterns.

---

## Runtime Alignment

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
```

### Transparent Enforcement

When content is blocked, explain why. The bracketed policy name helps support debug:

```
User: "Should I buy NVIDIA stock?"

System: "I can't provide investment recommendations.
        [Policy: no_financial_advice]"
```

### Prompt Injection Defense

Treat it as a security problem with layers:

1. **Input sanitization** — Control characters, unusual Unicode
2. **Instruction hierarchy** — System prompts override user content
3. **Output validation** — Responses don't leak injected instructions
4. **Monitoring** — Alert on injection patterns

### OWASP Agentic Risks (2026)

The OWASP Top 10 for Agentic Applications identifies new attack surfaces:

- **Agent Goal Hijack** — Adversarial inputs redirecting agent objectives
- **Tool Misuse** — Agents invoking tools in unintended ways
- **Memory & Context Poisoning** — Hallucinations entering context, compounding over time
- **Cascading Failures** — Multi-agent systems amplifying errors across boundaries

### Context Poisoning Defense

Multi-agent systems need "isolation" strategies:

- Give sub-agents their own context windows
- Validate outputs before they enter shared memory
- Implement "context distraction" detection (model over-focusing on long history)

### Guardrails vs Evals

Different purposes, both required:

- **Guardrails (Runtime):** Enforce policy boundaries in real-time. Capture verdict (pass/fail), category (PII, toxicity), trigger fallback action.
- **Evaluations (Batch):** Measure quality on scheduled test sets. Detect regression over time.

Guardrails stop bad outputs *now*. Evals catch drift *before* it reaches users.

### Products

| Product | Why Model-Adjacent |
|---------|-------------------|
| **Cloudflare AI Gateway** | Policy enforcement at inference time |
| **Llama Guard 3** | Model-based content filtering |
| **Lakera Guard** | Real-time protection against prompt attacks |

---

## Team Practices

### Product Managers

- Latency is P0. Budget it per stage.
- Token cost is product cost.
- Evals gate shipping. No eval suite, no deploy.

### Engineers

- Prompts are code. Version, review, test.
- Caching is architecture. Design for hits from day one.
- Traces are mandatory.

### Infrastructure

- Model serving is the easy part. Everything else is harder.
- Freshness has SLAs. Re-indexing is a production system.

---

## Priority Checklist

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

- [ ] Multi-tier caching
- [ ] Hybrid retrieval (vector + lexical + reranking)
- [ ] Memory compaction and conflict resolution
- [ ] Adversarial eval suite
- [ ] Policy UI for non-technical stakeholders
- [ ] Cost attribution per user/feature

---

## The Computer is Built

> Think of the base model as the CPU for the computer (your product). The teams shipping successfully are well past just model routing & selection. They're stitching the model-adjacent infrastructure: latency engineering, token economics, retrieval, tools, memory, verification, alignment. **We have a new CPU, now let's build our computers.**

You now have:

- **Physics** (latency, tokens) that keep humans in the loop
- **Memory and tools** that don't hallucinate or break things
- **Verification** that catches errors before users
- **Governance** that enforces policy without retraining

The foundation model is the CPU. You've built the computer.

**Part 5** gives you the build order: 90 days from foundation to production-ready autonomy.

---

## Sources

**Alignment**
- [Constitutional AI](https://arxiv.org/abs/2212.08073) (Anthropic)
- [Llama Guard](https://arxiv.org/abs/2312.06674)
- [Animals vs Ghosts](https://karpathy.bearblog.dev/animals-vs-ghosts/) (Karpathy)

**Prompt Security**
- [HackAPrompt](https://arxiv.org/abs/2311.16119) — Injection taxonomy
- [Indirect Prompt Injection](https://arxiv.org/abs/2302.12173)
- [Lakera Guide](https://www.lakera.ai/blog/guide-to-prompt-injection)

**2025-2026 Updates**
- [OWASP Top 10 for Agentic Applications 2026](https://www.giskard.ai/knowledge/owasp-top-10-for-agentic-application-2026) (Giskard) — Context poisoning, tool misuse
- [AI Agent Landscape 2025-2026](https://tao-hpu.medium.com/ai-agent-landscape-2025-2026-a-technical-deep-dive-abda86db7ae2) (Tao An) — Multi-agent architecture risks
- [7 Agentic AI Trends to Watch in 2026](https://machinelearningmastery.com/7-agentic-ai-trends-to-watch-in-2026/) — Bounded autonomy patterns

**Practices**
- [The State of LLMs 2025](https://magazine.sebastianraschka.com/p/the-state-of-llms-2025) (Raschka)
- [Levels of Autonomy](https://knightcolumbia.org/content/levels-of-autonomy-for-ai-agents-1) (Knight Institute)

---

## Navigation

[← Part 3: Quality Gates](/posts/model-adjacent-part3-quality/) | [Series Index](/posts/model-adjacent-series/) | [Part 5: Implementation Path →](/posts/model-adjacent-part5-implementation/)

---

*Part of a 6-part series on building production AI systems.*
