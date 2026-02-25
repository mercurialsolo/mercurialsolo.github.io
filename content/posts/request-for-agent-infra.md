---
title: "Why It's Hard to Claw the Enterprise"
date: 2026-02-24T00:00:00
author: mercurialsolo
tags: [ai, agents, enterprise, infrastructure, startups]
description: "Inspite of all the hype around personal assistants, personal agency still feels far from reality. It feels like we are the ones grinding for the agents today - constantly reviewing plans, uploading context and providing agents access to tools."
ShowToc: true
TocOpen: false
---

I've been running OpenClaw for personal use and the first reaction: it works as a basic personal assistant. Browser as the universal tool, Slack and WhatsApp and email as the comms layer and the event stream, the filesystem as the memory layer. They come together well when we own everything the agent touches. Authentication, authorization, data governance: no-problem, especially when the user and the admin are the same person.

The harness looks straightforward: let's now bolt on SSO, add an admin panel, and start selling it to teams. Not so easy, because the failure modes run deeper than what is evident at the surface.

Agents should ideally be doing useful work at 2am; research, briefings, competitive analysis ready before the team logs in Monday. The agents we have today can't sustain that. Run one autonomously for four hours and the reasoning frays; by step 12 of a 20-step plan, it's optimizing for something adjacent to what you asked. Models don't stick to plans over long task horizons the way a human with a checklist does.

Once the context window is exhausted, each run starts cold. An agent that spent Tuesday learning which Salesforce filters return garbage and which Slack channels carry real decisions has none of that on Wednesday. There's no persistent memory across multiple agents, and no fleet-wide learning loop; when one agent discovers a data source is stale, no other agent in the org benefits. The same lessons get relearned independently, at the same token cost, across every team. Agents may have their internal memory but no shared org wiki.

Tool access at personal scale is like your apartment key; at org scale it's like a contractor badge scoped per floor, per hour, per task, re-evaluated on every action. OAuth handles per-app grants, not per-agent, per-task grants at runtime. IAM policies don't model "this agent is on Q3 planning, so it reads the finance channel but not HR."

Your personal subscription cap is a safety net, but 50+ agents running overnight spin up costs that no finance team can predict. SaaS budgeting assumes per-seat pricing; agent costs scale with task complexity and parallelism, varying 10x by scope.

Context provisioning (dynamically granting need-to-know access with audit trails compliance will accept) is possibly the hardest of the lot, because agents ingest data continuously rather than requesting it once, and they don't know what they don't know they need. It's a continuous token stream.

The enterprise claw needs abstractions that don't exist in polished form for agents:

- a tool policy layer for runtime interaction scoping
- a budget-aware scheduler that enforces spend envelopes per project and team
- a context provisioning engine for dynamic need-to-know access with audit trails

This bring to me my personal RFS for agents. 

## Request for Agent Infrastructure

### Wiki for Agents

There's no persistent memory across runs, no fleet-wide learning loop. When one agent discovers a data source is stale, no other agent in the org benefits. Same lessons relearned independently, at the same token cost, across every team. Multi-agent pipelines consume 15x more tokens than single-agent chats because every agent starts from zero context.

Every cloud provider offers some memory primitive; none solve fleet-wide knowledge sharing with tenant isolation. The opportunity is the organizational memory layer between agent runtime and knowledge store. You'd start single-team, prove token savings, then expand to cross-team sharing. Usage grows with agent adoption; the data flywheel makes it hard to rip out.

---

### IAM for Agents

OAuth handles per-app grants, not per-agent per-task grants at runtime. IAM policies don't model "this agent is on Q3 planning, so it reads the finance channel but not HR." Agents are non-deterministic, autonomous, and act through toolchains at machine speed.

The incidents are everywhere around us. Supabase MCP exfiltrated integration tokens via prompt injection (June 2025). Stolen OAuth tokens from Salesloft's Drift accessed hundreds of Salesforce instances (August 2025). Amazon's Kiro deleted an entire AWS environment, 13-hour outage.Pretty much every incident was an over-broad credentials on autonomous systems.

You'd build intent-based authorization: agents declare what they need, the system generates minimum-viable permissions, monitors drift, flags violations. Start with one SaaS surface, expand connector coverage. Integration breadth is the moat.

---

### Ramp for Agents

Agent costs scale with task complexity and parallelism, varying 10x by scope. A research agent can burn $47 in a single unsupervised session. 92% of businesses implementing agentic AI experience cost overruns (IDC). Gartner predicts over 40% of agentic AI projects cancelled by 2027 due to runaway costs.

Traditional FinOps tools track spend by resource tag. They don't understand agent semantics: which task triggered which inference call, whether the agent is productive or spiraling. Portkey raised $15M managing 500B+ tokens/day across 24,000 organizations ($180M annualized managed spend).

You'd build a budget-aware runtime layer: hard spend caps per session, circuit breakers for recursive loops, per-agent cost attribution by team and project. Percentage of managed spend as the business model; revenue scales with enterprise AI adoption.

---

Identity, memory, and money: the building blocks that defined enterprise SaaS (Okta, Confluence, Ramp) rebuilt for agents. 2026 - a year of building for agents.
