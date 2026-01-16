---
title: "Every Inch Matters"
date: 2026-01-16T00:00:00
lastmod: 2026-01-16T08:00:00
author: mercurialsolo
tags: [strategy, ai, startups, competition, moats, density]
summary: "When building becomes trivially easy, every software market becomes a red ocean. A browser from scratch in one week. 3 million lines of code. This isn't an anomaly; it's the new baseline."
ShowToc: true
TocOpen: false
glossary:
  PMF: "Product-Market Fit - when a product satisfies strong market demand."
  ARR: "Annual Recurring Revenue - yearly value of recurring subscriptions."
  GRR: "Gross Revenue Retention - percentage of revenue retained from existing customers."
---
> "We built a browser with GPT-5.2 in Cursor. It ran uninterrupted for one week. It's 3M+ lines of code across thousands of files. The rendering engine is from-scratch in Rust with HTML parsing, CSS cascade, layout, text shaping, paint, and a custom JS VM. It *kind of* works!" — [Michael Truell (@mntruell)](https://x.com/mntruell/status/2011562190286045552)

A browser from scratch in one week: 3 million lines of code. This isn't an anomaly; it's the new baseline. When building becomes trivially easy, every software market becomes a red ocean. And in red oceans, every inch matters.

---

## There's no barrier to entry

A founder I spoke with last month put it bluntly: "We used to worry about whether we could build it. Now we worry about whether we can survive the twelve competitors who'll ship the same thing next week."

![The Inversion: Before AI Coding vs After AI Coding - Building is hard becomes trivial, code moats become commodity, 10x engineers become 10x tools, defensible features get copied in days, first-mover advantage becomes first-mover as target](/images/every-inch-matters/before-after-coding.png)

This is what military strategists call "density": when maneuver space collapses and every position is contested. At Thermopylae, 300 Spartans held a narrow pass against 100,000 Persians because geography negated numerical advantage. Software markets have reached their Thermopylae. The pass has narrowed; flanking is impossible.

---

## PMF is dead

Brian Balfour (at Reforge) documented what he calls "[Product-Market Fit Collapse](https://www.reforge.com/blog/product-market-fit-collapse)": customer expectations spike nearly instantly rather than rising gradually. ChatGPT reached 1 million users in 5 days. When the threshold for "good enough" is faster than the rate that companies innovate, moats dissolve.

Stack Overflow illustrated the collapse in real time. Monthly visits dropped from 110 million (2022) to 55 million (2024); new questions fell 75% from peak. By February 2025, [the site received only 29,693 new questions](https://www.ericholscher.com/blog/2025/jan/21/stack-overflows-decline/), the lowest monthly total since 2010.

Elena Verna's insight: "Features are easy to copy. Trust isn't." When capabilities commoditize, customers retain products they trust rather than constantly switching. The referral is the ultimate trust signal; discovery through someone you trust beats any ad.

---

## Stickiness is a myth now

Traditional product stickiness mechanisms don't work in AI. AI-native products under $50/month show [23% gross revenue retention](https://www.growthunhinged.com/p/the-ai-churn-wave) versus 43% for traditional SaaS. That's a 20-point gap.

- Character.AI → 60% user base collapse in 12 months
- Jasper AI → 53% collapse in revenue

There's now literally zero switching costs with vLLM, SGLang, and dozens of inference backends providing [OpenAI-compatible endpoints out of the box](https://bentoml.com/llm/llm-inference-basics/openai-compatible-api). OpenRouter normalizes the schema across 100+ models, letting teams ["switch between hundreds of models without changing your code."](https://openrouter.ai/docs/guides/overview/models)

Claude and ChatGPT now score within percentage points on benchmarks. Inference costs collapsed 280x: from $20 per million tokens (2022) to [$0.07 per million tokens](https://www.baytechconsulting.com/blog/the-state-of-artificial-intelligence-in-2025/) (2024). When quality is indistinguishable and price is negligible, what's left to defend?

{{< highlight-box title="The Glass Slipper Effect" >}}
a16z and OpenRouter's [100 trillion token study](https://a16z.com/the-cinderella-glass-slipper-effect-retention-rules-in-the-ai-era/) reveals the physics of AI stickiness.

They call it the "Glass Slipper Effect": Only the foundational cohort survives. Users who adopt when a model is perceived as "frontier" integrate deeply into workflows, develop tacit knowledge about the model's specific strengths, and face real switching costs from workflow reengineering.

All subsequent cohorts show identical churn patterns. They "cluster at the bottom" because they see the model as "good enough" but not irreplaceable.

Stickiness depends on the underlying model capabilities, not your product's UI or features. When a better model arrives, even sticky users evaluate alternatives.

a16z puts it plainly: "The limited switching observed is due to user preference and habit rather than technical barriers." One bad experience, one price increase, one better model, and exodus begins.
{{< /highlight-box >}}

---

## Playing the board

85-95% of AI wrappers fail. Only 2-5% reach $10K monthly revenue. Sam Altman warned generic GPT wrappers directly: "We're just going to steamroll you."

Generic advice won't save you. The 2-5% who survive read one thing correctly: which game they're actually playing.

### When density is real: optimize every inch

About 70% of the time, density is real. The market is crowded, switching costs are near-zero, and the winners are those who compound small advantages.

**1. Win the abandonment war, not the feature war**

Users don't switch to competitors; they return to spreadsheets. [Fewer than 10% of ChatGPT weekly users visit another AI provider](https://a16z.com/state-of-consumer-ai-2025-product-hits-misses-and-whats-next/) despite zero switching costs. Your enemy isn't Gemini; it's the workflow they used before you.

**2. Own the memory**

If your vendor holds indexed documents and embeddings, switching costs become astronomical. If the enterprise holds its own memory, you're a swappable utility. Hold the context graph. Make replacement feel like firing your best employee.

**3. Design for dormancy**

AI users exhibit "smiling" retention curves; they leave and return when capabilities improve. Don't optimize for DAU; optimize for re-engagement friction. One-click return beats daily engagement metrics.

**4. Manufacture foundational moments**

Only foundational cohorts survive (Glass Slipper). Gradual improvement = commodity. Discrete perception shifts = loyalty. Each release needs a "this changes everything" moment, not incremental feature updates.

Trust compounds with foundational cohorts. As Elena Verna observes, "[broken trust is nearly impossible to recover from](https://www.elenaverna.com/p/growth-is-now-a-trust-problem)." Move fast, but bring users along. The referral is the ultimate trust signal; customers retained through trust don't comparison-shop when capabilities commoditize.

### When density is perceptual: escape the board

The remaining 30% splits between dimension shifts, perception plays, and ground-up rebuilds. The winning plays are often counter-intuitive.

**5. Shift dimensions**

In 2024, Anthropic's revenue was $100M. By July 2025, it hit [$4B ARR](https://www.saastr.com/anthropics-4b-arr-the-enterprise-ai-growth-playbook-thats-rewriting-saas-economics/). The move: while OpenAI and Google fought for consumer attention, Anthropic focused on enterprise API infrastructure. 70-75% of revenue comes from API calls, not subscriptions. When you have asymmetric capabilities transferable to adjacent markets while competitors optimize the wrong game.

**6. Rebuild from scratch**

Technology transitions temporarily reopen closed markets. Cursor built an entirely new IDE achieving [$500M ARR in 18 months](https://techcrunch.com/2025/06/05/cursors-anysphere-nabs-9-9b-valuation-soars-past-500m-arr/) while VS Code plugin competitors added features. Harvey rebuilt legal workflows AI-first and reached [$100M ARR in 3 years](https://www.cnbc.com/2025/08/04/legal-ai-startup-harvey-revenue.html), capturing 42% of AmLaw 100 firms while legacy legal tech retrofitted. Adding "AI features" to existing products loses to those rebuilding workflows with AI at the core.

**7. See what others miss**

In 2022, ["no VCs wanted to back ElevenLabs"](https://www.cnbc.com/2025/10/25/vc-bet-on-3-billion-ai-firm-elevenlabs-after-one-meeting-with-founder.html) because voice AI wasn't getting attention. Everyone was building text chatbots. Result: [$330M ARR](https://techcrunch.com/2026/01/13/elevenlabs-ceo-says-the-voice-ai-startup-crossed-330-million-arr-last-year/) and a $6.6B valuation by betting on voice when everyone else bet on text.

NotebookLM started as a 20% project inside Google Labs with 4-5 people. While everyone else built general-purpose chatbots, they built a document grounding tool. The breakthrough? Audio Overviews (AI-generated podcasts) wasn't even the original vision; it emerged later and went viral. Result: [371% traffic growth](https://www.similarweb.com/blog/insights/ai-news/notebooklm-growth/) in September 2024, [31.5M monthly visits](https://www.similarweb.com/blog/insights/ai-news/notebooklm-growth/) by October, and Google calling it "one of our breakout AI successes."

Counterintuitive positioning works at any scale: a startup rejected by VCs, a 20% project inside Google. When density is perceptual rather than physical, seeing differently reveals openings.

---

{{< highlight-box >}}
The skill is being able to read which zone you're in, then playing that game with full commitment while others hedge across both. Pick your game. Then play it like every inch matters.
{{< /highlight-box >}}

---

## References

**Frameworks & Strategy**
- Verna, Elena. "[Growth Is Now a Trust Problem](https://www.elenaverna.com/p/growth-is-now-a-trust-problem)." 2025. On trust as the new moat when traditional growth channels collapse.
- Balfour, Brian. "[Product-Market Fit Collapse](https://www.reforge.com/blog/product-market-fit-collapse)." Reforge, 2024.
- Mehta, Ravi. "[AI Disruption Risk Framework](https://blog.ravi-mehta.com/p/ai-risk-disruption-framework)." 2024.
- Christensen, Clayton. *[The Innovator's Dilemma](https://www.hbs.edu/faculty/Pages/item.aspx?num=46)*. Harvard Business School Press, 1997.
- Thompson, Ben. "[AI Integration and Modularization](https://stratechery.com/2024/ai-integration-and-modularization/)." Stratechery, 2024.

**AI-Era Case Studies**
- SaaStr. "[How Anthropic Rocketed to $4B ARR](https://www.saastr.com/anthropics-4b-arr-the-enterprise-ai-growth-playbook-thats-rewriting-saas-economics/)." 2025. On Anthropic's enterprise API strategy.
- TechCrunch. "[Cursor's Anysphere nabs $9.9B valuation, soars past $500M ARR](https://techcrunch.com/2025/06/05/cursors-anysphere-nabs-9-9b-valuation-soars-past-500m-arr/)." 2025.
- CNBC. "[Legal AI startup Harvey hits $100 million in annual recurring revenue](https://www.cnbc.com/2025/08/04/legal-ai-startup-harvey-revenue.html)." 2025.
- SimilarWeb. "[NotebookLM Growth Analysis](https://www.similarweb.com/blog/insights/ai-news/notebooklm-growth/)." 2024. On Audio Overviews viral growth.
- TechCrunch. "[ElevenLabs reaches $330M ARR](https://techcrunch.com/2026/01/13/elevenlabs-ceo-says-the-voice-ai-startup-crossed-330-million-arr-last-year/)." 2026.
- DemandSage. "[Midjourney Statistics 2026](https://www.demandsage.com/midjourney-statistics/)." On Discord-first distribution strategy.
- Sacra. "[Perplexity Revenue, Valuation & Funding](https://sacra.com/c/perplexity/)." 2025.
- Fortune. "[Glean hits $200 million ARR](https://fortune.com/2025/12/08/exclusive-glean-hits-200-million-arr-up-from-100-million-nine-months-back/)." 2025.

**Historical & Technical**
- Holscher, Eric. "[Stack Overflow's Decline](https://www.ericholscher.com/blog/2025/jan/21/stack-overflows-decline/)." 2025.

**AI Stickiness & Retention**
- A16z. "[The Cinderella Glass Slipper Effect: Retention Rules in the AI Era](https://a16z.com/the-cinderella-glass-slipper-effect-retention-rules-in-the-ai-era/)." 2025. On the foundational cohort phenomenon.
- A16z. "[State of Consumer AI 2025](https://a16z.com/state-of-consumer-ai-2025-product-hits-misses-and-whats-next/)." On switching behavior and retention benchmarks.
- Growth Unhinged. "[The AI Churn Wave](https://www.growthunhinged.com/p/the-ai-churn-wave)." 2025. On 23% GRR for AI products vs 43% SaaS.
- Lambert, Nathan. "[Model Commoditization and Product Moats](https://www.interconnects.ai/p/gpt4-commoditization-and-moats)." Interconnects, 2024.
- OpenRouter. "[State of AI 2025: 100 Trillion Token Study](https://openrouter.ai/state-of-ai)." 2025.
- Business of Apps. "[Lensa AI Statistics](https://www.businessofapps.com/data/lensa-ai-statistics/)." 2025.
- DemandSage. "[Character AI Statistics 2026](https://www.demandsage.com/character-ai-statistics/)." 2025.
- Electroiq. "[Jasper AI Statistics](https://electroiq.com/stats/jasper-ai-statistics/)." 2025.
- Context Pack. "[Transfer ChatGPT to Claude](https://www.context-pack.com/docs/transfer-chatgpt-to-claude)." On one-click conversation migration.
- Bay Tech Consulting. "[The State of Artificial Intelligence in 2025](https://www.baytechconsulting.com/blog/the-state-of-artificial-intelligence-in-2025/)." On inference cost collapse.
