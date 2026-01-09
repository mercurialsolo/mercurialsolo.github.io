---
title: "Model-Adjacent Products, Part 1: The Architecture"
date: 2026-01-09T10:00:00
author: mercurialsolo
tags: [ai, engineering, architecture, llm, infrastructure]
summary: "The foundation model is the CPU. Your product is the computer. Model-adjacent infrastructure turns stochastic text generation into shippable software."
series: ["Model-Adjacent Products"]
ShowToc: true
TocOpen: false
---

The teams shipping production AI aren't differentiated by model selection. They're differentiated by what they build around the model.

## The Mental Model

The foundation model is the CPU. Your product is the computer.

A CPU without memory, I/O, and an operating system is useless. Same for a foundation model without context management, tool orchestration, and verification.

Model-adjacent infrastructure turns stochastic text generation into shippable software: observable, testable, governable.

## The Stack

Every production system builds these layers:

```
┌─────────────────────────────────────────────┐
│  7. Alignment & Governance                  │
├─────────────────────────────────────────────┤
│  6. Observability & Evals                   │
├─────────────────────────────────────────────┤
│  5. Verification                            │
├─────────────────────────────────────────────┤
│  4. Memory                                  │
├─────────────────────────────────────────────┤
│  3. Tools & Action                          │
├─────────────────────────────────────────────┤
│  2. Retrieval & Context                     │
├─────────────────────────────────────────────┤
│  1. Latency & Interactivity                 │
├─────────────────────────────────────────────┤
│  ░░░░░░░░░░ Foundation Model ░░░░░░░░░░░░░  │
└─────────────────────────────────────────────┘
```

These layers interact. Optimizing one often breaks another.

## Latency Engineering

Classic SaaS tolerated 100-300ms response times. Model-adjacent products need 10-50ms perceived latency, or immediate streaming.

### Fast-Path / Slow-Path

Route most requests through a fast path. Reserve expensive reasoning for the tail.

```
Query → Router (30ms) → Fast Path (cache hit, small model)
                      → Slow Path (retrieval, large model, tools)
```

A small routing model or heuristic decides which path. Most requests should hit the fast path.

### Latency Budget

For a 500ms target:

| Stage | Budget |
|-------|--------|
| Routing | 30ms |
| Cache lookup | 10ms |
| Retrieval | 80ms |
| Model (TTFT) | 200ms |
| Safety check | 50ms |
| Tools | 100ms |
| Buffer | 30ms |

Track p50 and p99 separately. Tail latency is where users churn.

### Techniques

**Streaming:** Show partial tokens. Users tolerate longer waits when they see progress.

**Speculative decoding:** Draft model proposes, target model verifies batches. vLLM reports 2-3x throughput improvements.

**Two-pass generation:** Fast draft now, refinement later. Let users interrupt if the draft is sufficient.

**Async tools:** "Let me check that..." with a spinner beats blocking.

## Token Economics

Tokens represent compute, latency, cost, and environmental load. Manage them like CPU and memory budgets.

### Prompt Structure

Prompt caching rewards stable prefixes:

```
STABLE (cached):     System instructions, tool defs, examples
SEMI-STABLE:         Retrieved context, user preferences
VARIABLE:            Current conversation, query
```

Put stable content first. Cache hit rates go from 0% to 70%+.

### Cost Example

| Structure | Cache Rate | Cost/1K requests |
|-----------|------------|------------------|
| Bad (variable first) | 0% | $12.00 |
| Good | 70% | $4.80 |
| Optimal | 85% | $2.70 |

### Context Compaction

Long conversations accumulate tokens. After N turns:

1. Summarize into structured facts
2. Drop raw history
3. Keep last 2-3 turns

```
Before: [System] + [20 turns] = 12,000 tokens
After:  [System] + [Facts] + [3 turns] = 3,000 tokens
```

## What's Next

Part 2 covers retrieval systems, memory architecture, and tool ecosystems—the context and action layers.

---

*Part of a 4-part series on building production AI systems.*
