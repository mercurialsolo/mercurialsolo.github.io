---
title: "Appliances, Factories, Grids"
date: 2026-01-14T00:00:00
lastmod: 2026-01-15T11:00:00
author: mercurialsolo
tags: [ai, infrastructure, investing, startups, vertical-ai, barbell-thesis]
summary: "Own the chips or the customers. Everything else is a footnote."
ShowToc: true
TocOpen: false
glossary:
  barbell-thesis: "The theory that AI value concentrates at two extremes: infrastructure (chips, compute) and applications (user relationships), while the middle layer gets squeezed."
  data-gravity: "The tendency for applications and services to be pulled toward where data resides, making migration increasingly costly over time."
  vertical-integration: "When a company controls multiple layers of the stack (infrastructure, platform, and application) rather than specializing in one."
  acqui-hire: "An acquisition made primarily to recruit a company's employees rather than to obtain its products or services."
---

> ***Own the chips or the customers. Everything else is a footnote.***

---

## The Consensus Is Wrong

The AI infrastructure buildout is $400B annually. Revenue across all AI companies is maybe $20B. Either we're in a historic bubble, or we're funding something we can't yet articulate.

Every VC newsletter makes the same argument: models will commoditize, value shifts to applications. The {{< term "barbell-thesis" >}}. And yet those same VCs keep funding orchestration middleware, model routers, and evaluation platforms. LangChain raised $125M at $1.25B in October 2025. Cursor hit $29B after five rounds in 18 months.

The contradiction reveals something: **the barbell thesis assumes the two ends stay separate.** They don't.

**Scope note:** I don't have board seats at the labs. What I have is six months of dual-source experiments in production, conversations with infrastructure teams at three fintechs and two enterprise SaaS companies, and a front-row seat to how the consensus diverges from what practitioners ship.

---

## The Three Layers

The AI economy operates in three layers:

![Diagram showing the three-layer AI stack as horizontal bars. Top layer: Appliance (Interface Layer) showing Cursor, v0, Replit, Harvey with $5-25K ACV, data flywheels and workflow embedding, projecting 15B to 120B by 2030. Middle layer: Factory (Orchestration Layer) showing OpenAI, Anthropic, vLLM, Anyscale with API pricing war 140-90% per year and swappability imperative, projecting 30B to 120B by 2030. Bottom layer: Grid (Infrastructure Layer) showing NVIDIA, TSMC, Equinix, utilities with 75%+ gross margins and 10+ year moats from physical scarcity, projecting 200B to 400B by 2030.](/images/appliances-factories-grids/three_layers_stack.png)

| Layer | What It Is | Examples |
|-------|------------|----------|
| **Grid** | Physical infrastructure | Data centers, chips, cloud, power |
| **Factory** | Orchestration | Model routing, observability, vector DBs, eval |
| **Appliance** | Interface | ChatGPT, Copilot, Harvey, vertical tools |

The barbell thesis says value concentrates at extremes: **Atoms** (chips, silicon) and **Relationships** (user habits, workflow embedding). The middle gets squeezed.

This is correct as a static snapshot. It's wrong as a prediction.

---

## Vertical Integration Collapses the Stack

The labs aren't subject to the barbell squeeze because they're playing all three layers simultaneously—{{< term "vertical-integration" >}} in action. And they're getting better at appliances faster than startups are getting better at factories.

**The API cannibalization problem:** OpenAI cut its API revenue forecast by $5B over five years. ChatGPT Pro ($200/month) loses money due to "higher than expected usage." The pattern: appliance success eats infrastructure revenue. Labs compete with their own API customers. This isn't an aberration; it's the strategy.

- Anthropic builds Claude Code ($500M ARR in late 2025, 10x growth in three months) and competes directly with Cursor
- OpenAI builds Canvas and competes with every Artifacts wrapper
- Google embeds Gemini everywhere and competes with its own Vertex AI customers

**The middle layer absorption:**

| Company | Fate | Signal |
|---------|------|--------|
| Weights & Biases | Acquired ($1.7B) by CoreWeave | Infrastructure absorbs factory |
| Humanloop | {{< term "acqui-hire" >}}d by Anthropic | Labs absorb factory |
| Pinecone | CEO change (Sept 2025) | Struggling for relevance |
| LangChain | Independent | $16M revenue on $1.25B valuation (78x multiple) |

The barbell isn't two weights on opposite ends anymore. It's one giant weight (infrastructure + labs) with a long thin bar that occasionally bulges where domain specialists survive.

![Diagram showing the lopsided barbell where infrastructure dominates. Left side: massive dark circle labeled INFRASTRUCTURE plus LABS (OpenAI, Anthropic, Google) with smaller text showing absorbed companies (W&B, Humanloop, Vector DBs). Along the bar: three green circles representing surviving domain specialists - Harvey (Legal), Abridge (Healthcare), and ElevenLabs (Voice). Right side: faded dashed circle labeled APPLIANCES (being absorbed).](/images/appliances-factories-grids/lopsided_barbell_iconic.png)

---

## What Survives the Collapse

**Three categories maintain pricing power:**

**1. Infrastructure suppliers with manufacturing moats**

NVIDIA and TSMC maintain 73% gross margins through complexity and ecosystem lock-in. The January 2025 DeepSeek moment (NVIDIA shed $600B in a single day when DeepSeek claimed $5.5M training costs) briefly questioned this. A week later, NVIDIA recovered half the losses. Cheap training doesn't mean cheap {{< term "inference" >}} at scale.

**2. Vertical specialists with domain moats**

Harvey: $1.5B → $3B → $5B → $8B valuation in 18 months. Four rounds, majority of top 10 U.S. law firms. Abridge in clinical AI. ElevenLabs in voice. Regulatory complexity and proprietary data create barriers labs can't easily cross.

**3. Embedded platforms with {{< term "data-gravity" >}}**

Databricks at $62B. Once your data lives there, switching costs compound. The difference between point solutions (absorbed) and platforms (survive) is whether you become the system of record.

**What doesn't survive:**

- Horizontal wrappers (Cursor vs. Claude Code, Grammarly vs. Office Editor)
- Standalone {{< term name="vector DBs" def="Databases optimized for storing and querying high-dimensional vectors (embeddings), enabling semantic search and similarity matching." >}} (Pinecone lost Notion; pgvector absorbed simple use cases)
- "Better ChatGPT" plays
- Single-model dependencies

{{< highlight-box title="The Survival Test" >}}
Ask yourself three questions before building:

1. **Do you have a manufacturing moat?** Physical complexity that takes years to replicate (NVIDIA, TSMC).

2. **Do you have a regulatory moat?** Domain expertise in healthcare, legal, or finance where compliance is the product.

3. **Do you have data gravity?** Are you the system of record where switching costs compound over time?

If you can't answer yes to at least one, you're building a feature—not a company.
{{< /highlight-box >}}

---

## The Consolidation Trajectory

In 1900, electricity was astonishing. By 1950, it was invisible. The fortunes went to GE (appliances), Westinghouse (factories), and utilities that became regulated monopolies.

In 2024, AI is astonishing. By 2035, it will be invisible.

But the electricity analogy breaks down in one critical way: the AI labs control generation, transmission, AND appliances. Standard Oil before the breakup, except the regulators haven't caught up.

**The forecast:** By 2028, the market consolidates around 3-4 vertically integrated giants (OpenAI, Anthropic, Google, possibly xAI). Everyone else fights for scraps in surviving niches: regulated verticals, data-gravity platforms, and chip suppliers.

---

## The Playbook

| If You're... | Bet On | Avoid |
|--------------|--------|-------|
| **Investor** | Chips + vertical apps with regulatory moats | Cloud capacity, horizontal wrappers, middleware without data gravity |
| **Builder** | Narrow vertical, model-agnostic, workflow embedding | "Better ChatGPT" plays, single-model lock-in, features labs will ship |
| **Operator** | Multi-cloud, dual-source workflows, buy vertical tools | Single provider lock-in, building horizontal internally |

---

## The Uncertainty

The Cursor paradox: $400M → $2.6B → $9.9B → $29.3B in 15 months. Fastest B2B scaling in SaaS history. And yet Claude Code ships, Copilot improves, the labs keep getting better at appliances.

Is Cursor building a defensible relationship layer, or riding a temporary capability gap?

I genuinely don't know. How long is the party gonna last? Will it get scooped up by the labs? 

The barbell thesis gives false confidence. Vertical integration means the rules keep changing.

---

*Last updated: January 2026. This analysis reflects field conditions through Q4 2025.*
