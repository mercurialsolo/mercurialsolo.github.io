---
title: "Model-Adjacent Products, Part 5: The Implementation Path"
date: 2026-01-09T14:00:00
author: mercurialsolo
tags: [ai, engineering, implementation, roadmap, production]
summary: "The build manifest: 90 days from foundation to production-ready autonomy. What to ship in what sequence."
series: ["Model-Adjacent Products"]
ShowToc: true
TocOpen: false
---

## From Blueprint to Build

You've learned:
- **The physics** (Part 1) — latency and token economics
- **The memory** (Part 2) — context and tools
- **The proof** (Part 3) — verification and observability
- **The guardrails** (Part 4) — governance and practice

Now: the build order. What to ship in what sequence.

The wrong order wastes effort. You can't tune latency without observability. You can't verify outputs without golden sets. You can't increase autonomy without governance.

This roadmap sequences infrastructure investments for maximum leverage.

---

## 90-Day Path to Production

### Days 1-15: Foundation

**Goal:** See what's happening. Establish baselines.

- [ ] **Deploy observability stack**
  - Traces for all LLM calls ([Part 3: Observability](/posts/model-adjacent-part3-quality/#observability))
  - Capture: prompt, response, latency, tokens, cost
  - You can't improve what you can't measure

- [ ] **Establish golden set**
  - 50-100 hand-curated QA pairs for core use case
  - Known-good answers you can test against ([Part 3: Evals](/posts/model-adjacent-part3-quality/#evals))
  - Run on every change

- [ ] **Implement L1 autonomy with tool use**
  - MCP server with typed schemas ([Part 2: Tools](/posts/model-adjacent-part2-context-tools/#tool-ecosystems))
  - User drives, AI suggests
  - Log every tool call

- [ ] **Enable prompt caching**
  - Structure prompts: stable → semi-stable → variable ([Part 1: Token Economics](/posts/model-adjacent-part1-architecture/#token-economics))
  - Verify hit rates >60%
  - If lower, restructure prompts

**Exit criteria:** You have traces, tests, and cache hit rate >60%.

---

### Days 16-45: Optimization

**Goal:** Make it fast, cheap, and verified.

- [ ] **Enable speculative decoding**
  - Draft model proposes, target model verifies ([Part 1: Latency](/posts/model-adjacent-part1-architecture/#latency-engineering))
  - Tune draft lengths for your workload
  - Expect 1.5-2.5x speedup in memory-bound scenarios

- [ ] **Implement CI/CD quality gates**
  - Block deploys that fail faithfulness checks ([Part 3: Evals as CI](/posts/model-adjacent-part3-quality/#evals-as-ci))
  - Block deploys that regress latency SLOs
  - No exceptions

- [ ] **Adopt context compaction**
  - For sessions >10 turns: summarize to structured facts ([Part 1: Context Compaction](/posts/model-adjacent-part1-architecture/#context-compaction))
  - Drop raw history, keep last 2-3 turns
  - Target: 75% token reduction for long sessions

- [ ] **Add hybrid retrieval**
  - Vector search + BM25 + reranker ([Part 2: Hybrid Retrieval](/posts/model-adjacent-part2-context-tools/#hybrid-retrieval))
  - The reranker is where quality is won or lost
  - Set freshness SLAs per source type

**Exit criteria:** p95 latency <500ms, quality gates in CI, hybrid retrieval live.

---

### Days 46-90: Advanced Architecture

**Goal:** Scale safely. Increase autonomy.

- [ ] **Decouple retrieval**
  - Search stage: small chunks (100-256 tokens) for recall ([Part 2: Decoupled Retrieval](/posts/model-adjacent-part2-context-tools/#decoupled-retrieval-2025-pattern))
  - Retrieve stage: large spans (1024+ tokens) for comprehension
  - Mirrors human research: scan many, read deeply

- [ ] **Implement GraphRAG or tool retrieval index**
  - If entity/relationship queries dominate: GraphRAG
  - If agent tool selection at scale: tool retrieval index
  - Only if needed; adds governance overhead

- [ ] **Add memory tiers with governance**
  - Working memory, episodic memory, semantic memory ([Part 2: Memory Governance](/posts/model-adjacent-part2-context-tools/#memory-governance-layer))
  - Define: who owns memory, how it updates, when it must be forgotten
  - User controls: view, correct, delete, export

- [ ] **Promote to L2/L3 autonomy**
  - Only after runtime guardrails are verified ([Part 4: Runtime Alignment](/posts/model-adjacent-part4-governance/#runtime-alignment))
  - Policy configuration for what's blocked/flagged/allowed
  - Prompt injection defense layers

- [ ] **Establish cost attribution**
  - Per user, per feature
  - Token SLOs with automated fallbacks ([Part 1: Token SLOs](/posts/model-adjacent-part1-architecture/#token-slos))
  - Breaches trigger alerts or model downgrades

**Exit criteria:** Memory governance live, L2/L3 autonomy with guardrails, cost attribution per feature.

---

## The Sequencing Principle

Notice the order:

1. **Observability first** — you can't optimize blind
2. **Testing second** — you can't ship without verification
3. **Speed third** — fast failures are still failures
4. **Autonomy last** — capability without governance is chaos

Teams that invert this order ship fast, break things, and spend months in triage. The sequencing isn't arbitrary; it's load-bearing.

---

## The Computer is Built

You now have:

- **Physics** (latency, tokens) that keep humans in the loop
- **Memory and tools** that don't hallucinate or break things
- **Verification** that catches errors before users
- **Governance** that enforces policy without retraining
- **A roadmap** that sequences investments correctly

The foundation model is the CPU. You've built the computer.

Now ship it.

---

## Navigation

[← Part 4: Governance](/posts/model-adjacent-part4-governance/) | [Series Index](/posts/model-adjacent-series/)

---

*Part of a 6-part series on building production AI systems.*
