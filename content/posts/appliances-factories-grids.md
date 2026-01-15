---
title: "Appliances, Factories, Grids"
date: 2026-01-15T00:00:00
author: mercurialsolo
tags: [ai, infrastructure, investing, startups, vertical-ai, barbell-thesis]
summary: "Most misunderstand which barbells matter. Value concentrates at atoms (chips) and relationships (vertical apps). Everything else gets squeezed."
ShowToc: true
TocOpen: false
---

> ***Own the chips or the customers; everything else is a footnote.***

---

## The Great Compression

The AI infrastructure buildout is $400B annually. Revenue across all AI companies is maybe $20B. Either we're in a historic bubble, or we're funding something we can't yet articulate.

I think it's the second. But not for the reasons most people cite.

**A scope note:** I don't have board seats at the labs or access to their internal roadmaps. What I do have is six months of running dual-source experiments in production, conversations with infrastructure teams at three fintechs and two enterprise SaaS companies, and a front-row seat to how the consensus narrative diverges from what practitioners actually ship. That's the lens here.

The consensus view: models will commoditize, value will shift to applications. Every VC newsletter in my inbox makes this argument. And yet, those same VCs keep funding orchestration middleware, model routers, and evaluation platforms. LangChain just raised $125M at a $1.25B valuation in October 2025; Cursor hit $29B after five funding rounds in 18 months. Companies in the layer that, by their own thesis, should get squeezed.

> The contradiction reveals something. Either the consensus is wrong, or the consensus believers don't believe their own consensus.

Here's where I landed: the barbell thesis is correct, but most people misunderstand *which* barbells matter.

---

## The Three-Layer Stack

The AI economy operates in three distinct layers:

![Diagram showing the three-layer AI stack as horizontal bars. Top layer: Appliance (Interface Layer) showing Cursor, v0, Replit, Harvey with $5-25K ACV, data flywheels and workflow embedding, projecting 15B to 120B by 2030. Middle layer: Factory (Orchestration Layer) showing OpenAI, Anthropic, vLLM, Anyscale with API pricing war 140-90% per year and swappability imperative, projecting 30B to 120B by 2030. Bottom layer: Grid (Infrastructure Layer) showing NVIDIA, TSMC, Equinix, utilities with 75%+ gross margins and 10+ year moats from physical scarcity, projecting 200B to 400B by 2030. Y-axis shows value creation from low to high as you move up, and capital intensity from low to high as you move down.](/images/appliances-factories-grids/three_layers_stack.png)

| Layer | What It Is | Examples |
|-------|------------|----------|
| **Grid** | Physical infrastructure | Data centers, chips, cloud compute, power |
| **Factory** | Orchestration | Model routing, observability, vector DBs, eval pipelines |
| **Appliance** | Interface | ChatGPT, Copilot, Harvey, vertical tools |

Value doesn't distribute evenly. It concentrates at the extremes.

> *"The AI stack is hardening. Economic power shifts to those who own the rails OR own the interface. Everything else gets squeezed."* — Lo Toney, Plexo Capital

![Barbell diagram illustrating value concentration. Left weight (dark green circle) labeled ATOMS - Own the Rails, containing Chips (NVIDIA, TSMC) with 75% margins, Foundries with 10+ year moats, and Power Infrastructure with physical scarcity. Right weight (dark blue circle) labeled RELATIONSHIPS - Own the Interface, containing Vertical Apps with data flywheels, Workflow Embedding with behavioral lock-in, and Regulatory Moats with 5-10 year durability. The bar between them shows the Squeeze Zone with margin compression from Cloud IaaS, Model APIs, and Horizontal Wrappers. Quote at bottom: Own the atoms, or own the relationship. Everything else gets squeezed.](/images/appliances-factories-grids/barbell_effect.png)

**The barbell effect:** Value accumulates at two poles:
- **Atoms** (chips, power, silicon, physical infrastructure)
- **Relationships** (user habits, workflow embedding, behavioral defaults)

The middle layers face margin compression from both directions. Cloud becomes a utility. Model APIs become commodities. The squeeze is structural.

---

### The Grid: Atoms Win

Chip makers (NVIDIA, TSMC) maintain 73% gross margins through manufacturing complexity and ecosystem lock-in.

**The January 2025 reality check:** When DeepSeek released V3 on December 26, 2024, claiming $5.5M training cost using export-restricted H800s, NVIDIA shed $600B in market cap in a single day (the largest single-day loss in U.S. stock market history). The market briefly questioned whether the "expensive compute" thesis still held. A week later, NVIDIA recovered half those losses. The consensus recalibrated: cheap training doesn't mean cheap inference at scale; the atoms still matter, but the margin story got more complicated.

Hyperscalers face erosion: a friend running ML at a large fintech told me they're "actively planning our exit from single-cloud." The Gartner data backs this up: 92% of large enterprises now run multi-cloud, up from 76% in 2022. Training stays sticky; inference commoditizes. Neoclouds chip away at the edges.

**Defensible:** Chips, foundries (5-10 year moats)
**Eroding:** Cloud IaaS (multi-cloud tooling, model convergence)

---

### Factories: The Squeeze Zone

Orchestration is the emerging battleground, but margins get compressed from above (cloud bundling) and below (open source).

I've been running dual-source experiments for six months: the switching cost isn't accuracy, it's the 200 hours your team spent tuning prompts for one model's specific quirks. The GPT-4 → GPT-5 transition in late 2025 broke half our production prompts; teams that had built model-agnostic abstractions recovered in days, single-model shops took weeks. Post-Llama 3.3 (December 2024) and post-Claude 3.5 Sonnet (June 2024), the capability gap narrowed enough that multi-model became viable. By Q4 2025, most teams I talk to run at least two frontier models in production.

**The vector database correction:** In 2023, dedicated vector DBs (Pinecone, Weaviate, Qdrant) looked like essential infrastructure. By late 2025, the story shifted. Pinecone lost Notion as a customer; pgvector and native Postgres extensions absorbed the simple use cases. The VentureBeat postmortem called it "the classic hype cycle followed by introspection and maturation." Vector search became a checkbox feature in cloud platforms, not a standalone moat. Most teams I talk to run pgvector unless they're past 50M vectors.

**Emerging:** Orchestration platforms, evaluation infrastructure
**At risk:** Standalone vector DBs (getting absorbed), single-model dependencies

---

### Appliances: Relationships Win

Vertical specialists with data flywheels (Harvey's legal precedent, medical AI's diagnostic patterns) and regulatory moats build durable value.

**The Harvey trajectory tells the story:** $1.5B valuation in July 2024 → $3B in February 2025 → $5B in June 2025 → $8B in December 2025. Four funding rounds in 18 months, now serving majority of top 10 U.S. law firms. That's what vertical embedding looks like when it works.

Horizontal wrappers face platform absorption: Cursor vs. Claude Code, Grammarly vs. Office Editor. A product lead at a leading coding assistant told me bluntly: "We're not competing on capability anymore; we're competing on addiction."

**The Cursor paradox:** $400M valuation in August 2024 → $2.6B in December 2024 → $9.9B in April 2025 → $29.3B in November 2025. Fastest B2B scaling in SaaS history, $1B ARR in 24 months. And yet: Claude Code ships, Copilot improves, the labs keep getting better at appliances. Is Cursor building a defensible relationship layer, or riding a temporary capability gap? I genuinely don't know. That uncertainty is the point.

**Defensible:** Vertical apps with workflow embedding (5-10 year moats)
**At risk:** Horizontal tools, "better prompt" plays

---

## Value Accrual: 2026-2030

![Bar chart comparing AI stack market sizes by layer with 2025 and 2030 projections. Grid (Infrastructure): $525B in 2025 growing 2.2x to $1150B by 2030, shown as tallest bars. Factory (Orchestration): $14B in 2025 growing 4.6x to $67B by 2030, shown as smallest bars. Appliance (Interface): $55B in 2025 growing 4.4x to $240B by 2030. Note indicates Grid is 9x larger than Factory plus Appliance combined. Sources listed as Sequoia, Goldman Sachs, McKinsey.](/images/appliances-factories-grids/market_size_by_layer.png)

![Defensibility matrix showing moat strength across AI stack layers. Columns represent moat types: Physical Scarcity, Data Flywheel, Workflow Embedding, Switching Costs, Regulatory Moat. Rows show layers: Grid has HIGH physical scarcity, LOW data flywheel, LOW workflow embedding, MED switching costs, HIGH regulatory moat. Factory has LOW physical scarcity, MED data flywheel, LOW workflow embedding, LOW switching costs, MED regulatory moat. Appliance has LOW physical scarcity, HIGH data flywheel, HIGH workflow embedding, HIGH switching costs, MED regulatory moat. Color coding: GREEN for strong moat, YELLOW for moderate, RED for weak. Key insight: Moat Mismatch equals Strategic Error. Moat durability ranges from 10+ years for Grid to 6-18 months for Factory to 3-7 years for Appliance.](/images/appliances-factories-grids/defensibility_matrix.png)

| Layer | Current Margin | 2030 Outlook | Why |
|-------|----------------|--------------|-----|
| **Chips (NVIDIA, TSMC)** | 73% | HIGH | Manufacturing complexity, capital intensity |
| **Cloud IaaS** | 30-40% | MEDIUM → LOW | Training sticky, inference commoditizing |
| **Models / APIs** | Variable | LOW → MEDIUM | Open weights pressure (Llama 3, DeepSeek), frontier access has value |
| **Orchestration** | Emerging | HIGH | New control point, winner unclear |
| **Vertical Apps** | 30%+ | HIGH | Data moats, regulatory moats, behavioral lock-in |
| **Horizontal Apps** | Variable | MEDIUM | Platform absorption risk |

**Forecast:** Durable rents accrue to **Atoms** (chips) and **Relationships** (vertical apps). Cloud and model APIs face highest commoditization. Orchestration is the wildcard.

---

## The Quick Playbook

| If You're... | Bet On | Avoid |
|--------------|--------|-------|
| **Investor** | Chips + vertical apps with data flywheels | Cloud capacity, horizontal wrappers |
| **Builder** | Narrow vertical, model-agnostic, workflow embedding | "Better ChatGPT" plays, single-model lock-in |
| **Operator** | Multi-cloud, dual-source workflows, buy vertical tools | Single provider lock-in, building horizontal internally |

---

## The Bet

In 1900, electricity was astonishing. By 1950, it was invisible. The fortunes went to GE (appliances), Westinghouse (factories), and the utilities that became regulated monopolies with compressed margins.

In 2024, AI is astonishing. By 2035, it will be invisible. The fortunes will go to chip makers who control atoms, vertical appliances that become behavioral defaults, and orchestration platforms that become the enterprise control plane.

But here's what keeps me uncertain: the labs are playing all three layers simultaneously. OpenAI, Anthropic, Google aren't subject to the barbell squeeze because they own the whole stack. And they're getting better at appliances faster than startups are getting better at factories.

The market may not bifurcate cleanly into atoms vs. relationships. It may consolidate around 3-4 vertically integrated giants, with everyone else fighting over scraps.

> **The tension I can't resolve:** If the barbell thesis is right, why are the barbell ends (chip makers and vertical apps) still lagging the giants in market cap growth? **Partial answer:** The giants aren't subject to the barbell squeeze because they're playing all three layers simultaneously. OpenAI's $5B API forecast cut reveals the mechanism: their appliances are cannibalizing their own infrastructure revenue. The barbell is lopsided because one end is eating the other.

**What changed my thinking:** The pre-2024 consensus assumed inference costs would stay high, making compute-heavy operations a durable moat. DeepSeek V3's efficiency claims and the subsequent NVIDIA correction suggest the inference cost curve is steeper than expected. The atoms still matter, but the *which* atoms question is more open than it was a year ago.

---

## The Lopsided Barbell

The barbell thesis is correct, but the weights aren't balanced. Infrastructure is eating everything above it.

![Diagram showing the lopsided barbell where infrastructure dominates. Left side: massive dark circle labeled INFRASTRUCTURE plus LABS (OpenAI, Anthropic, Google) with smaller text showing absorbed companies (W&B, Humanloop, Vector DBs). An arrow points right labeled value flows here. Along the bar: three green circles representing surviving domain specialists - Harvey (Legal), Abridge (Healthcare), and ElevenLabs (Voice). Right side: faded dashed circle labeled APPLIANCES (being absorbed). Caption reads: The barbell is not two equal weights anymore. Infrastructure absorbed the middle; only vertical specialists survive.](/images/appliances-factories-grids/lopsided_barbell_iconic.png)

**The API cannibalization problem:** OpenAI cut its API revenue forecast by $5 billion over five years. ChatGPT Pro ($200/month) is losing money due to "higher than expected usage." The pattern is clear: appliance success eats infrastructure revenue. Labs are competing with their own API customers. This isn't an aberration; it's the strategy now.

![Text excerpt discussing AI startup challenges. Key points: Companies like OpenAI trying to build business software face the same challenge as every tech giant before them - creating entire business systems from scratch. Code is now relatively easy. What is hard is decades of industry knowledge, thousands of existing connections to other software, deep understanding of industry-specific regulations, and built-up trust of large enterprises. The math is against AI startups: they need to deliver gains large enough to justify the work and risk of managing a separate tool. Established software companies will win by integrating innovation rather than fragmenting it.](/images/appliances-factories-grids/revenue_cannibalization.png)

Anthropic builds Claude Code ($500M ARR in late 2025, 10x growth in three months) and competes directly with Cursor. OpenAI builds Canvas and competes with every Artifacts wrapper. Google embeds Gemini everywhere and competes with its own Vertex AI customers.

**The middle layer absorption:**

| Company | Fate | Acquirer | Signal |
|---------|------|----------|--------|
| Weights & Biases | Acquired ($1.7B) | CoreWeave | Infrastructure absorbs factory |
| Humanloop | Acqui-hired | Anthropic | Labs absorb factory |
| Pinecone | CEO change (Sept 2025) | TBD | Struggling |
| LangChain | Independent | N/A | $16M revenue on $1.25B valuation (78x) |

The Factory layer is bifurcating. **Winners** embed themselves as data platforms with gravity (Databricks at $62B, Observe with 180% NRR). **Losers** remain point solutions waiting to be absorbed or commoditized (vector DBs becoming pgvector features, single-purpose observability tools).

**What survives the squeeze:**
1. **Embedded platforms with data gravity** (Databricks model): Once your data lives there, switching costs compound
2. **Vertical specialists with domain moats** (Harvey, Cursor): Behavioral lock-in trumps infrastructure ownership
3. **Infrastructure suppliers** (NVIDIA, TSMC): The only ones with real pricing power

**The consolidation trajectory:** By 2028, the market consolidates around 3-4 vertically integrated giants (OpenAI, Anthropic, Google, possibly xAI), with everyone else fighting for scraps in the surviving niches.

> The barbell isn't two weights on opposite ends anymore. It's one giant weight (infrastructure) with a long thin bar that occasionally bulges where domain specialists survive.

---

*Last updated: January 2026. This analysis reflects field conditions through Q4 2025 and will need revision as the orchestration layer shakes out.*
