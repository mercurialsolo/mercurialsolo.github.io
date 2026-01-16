---
title: "Every Inch Matters"
date: 2026-01-18T08:00:00
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

Yesterday, Cursor CEO Michael Truell posted a tweet that should terrify every software founder:

> "We built a browser with GPT-5.2 in Cursor. It ran uninterrupted for one week. It's 3M+ lines of code across thousands of files. The rendering engine is from-scratch in Rust with HTML parsing, CSS cascade, layout, text shaping, paint, and a custom JS VM. It *kind of* works!" — [Michael Truell (@mntruell)](https://x.com/mntruell/status/2011562190286045552)

A browser from scratch in one week: 3 million lines of code. This isn't an anomaly; it's the new baseline.

When building becomes trivially easy, every software market becomes a red ocean. And in red oceans, every inch matters.

---

## There's no barrier to entry

A founder I spoke with last month put it bluntly: "We used to worry about whether we could build it. Now we worry about whether we can survive the twelve competitors who'll ship the same thing next week."

| Before AI Coding | After AI Coding |
|------------------|-----------------|
| Building is hard | Building is trivial |
| Code is our moat | Code is commodity |
| 10x engineers rare | 10x tools ubiquitous |
| Features used to be defensible | Every feature gets copied in days |
| There's an advantage to being first-mover | The first-mover is now the target |

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
A16z and OpenRouter's [100 trillion token study](https://a16z.com/the-cinderella-glass-slipper-effect-retention-rules-in-the-ai-era/) reveals the physics of AI stickiness.

They call it the "Glass Slipper Effect": Only the foundational cohort survives. Users who adopt when a model is perceived as "frontier" integrate deeply into workflows, develop tacit knowledge about the model's specific strengths, and face real switching costs from workflow reengineering.

All subsequent cohorts show identical churn patterns. They "cluster at the bottom" because they see the model as "good enough" but not irreplaceable.

Stickiness depends on the underlying model capabilities, not your product's UI or features. When a better model arrives, even sticky users evaluate alternatives.

A16z puts it plainly: "The limited switching observed is due to user preference and habit rather than technical barriers." One bad experience, one price increase, one better model, and exodus begins.
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

### When density is perceptual: escape the board

The remaining 30% splits between dimension shifts, perception plays, and ground-up rebuilds. The winning plays are often counter-intuitive.

**5. Shift dimensions**

In 2006, Amazon's retail margins were compressing against Walmart and Target. Instead of operational efficiency, Bezos bet that the same infrastructure powering Amazon could power everyone else. AWS now runs at [$107B annual revenue](https://www.aboutamazon.com/news/company-news/amazon-q4-2024-earnings).

When this works: you have asymmetric capabilities transferable to adjacent markets while competitors build the wrong defenses.

**6. Rebuild from scratch**

Technology transitions temporarily reopen closed markets. Incumbents who integrate new tech into existing products lose to challengers who rebuild from scratch.

[Instagram](https://about.fb.com/news/2012/04/facebook-to-acquire-instagram/) (mobile-only, no desktop) sold for $1B; Flickr (desktop-first, mobile-adapted) [sold for ~$35M](https://www.vox.com/2017/6/15/15782200/how-yahoo-killed-flickr-marissa-mayer). Adding "AI features" to existing SaaS will lose to those rebuilding workflows with AI at the core.

**7. See what others miss**

AlphaGo's [Move 37](https://en.wikipedia.org/wiki/AlphaGo_versus_Lee_Sedol) looked wrong but exploited patterns humans missed. Seeing the market with a different lens rather than the consensus reveals openings others miss.

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

**Case Studies**
- Netflix. "[Completing the Netflix Cloud Migration](https://about.netflix.com/en/news/completing-the-netflix-cloud-migration)." 2016. Seven-year rebuild from monolith to microservices.
- Quartr. "[The Dilemma That Brought Down Kodak](https://quartr.com/insights/edge/the-dilemma-that-brought-down-kodak)." On Kodak's 80% film margins and digital denial.
- Vox. "[How Yahoo Killed Flickr](https://www.vox.com/2017/6/15/15782200/how-yahoo-killed-flickr-marissa-mayer)." 2017.

**Historical & Technical**
- "[AlphaGo versus Lee Sedol](https://en.wikipedia.org/wiki/AlphaGo_versus_Lee_Sedol)." Wikipedia. On Move 37.
- "[1990 Kasparov-Karpov World Championship](https://www.chessgames.com/perl/chess.pl?tid=55223)." ChessGames.com.
- Weeks, Mark. "[1990 World Championship Prize Fund](https://www.mark-weeks.com/chess/90kk$$.htm)." $3M total, 5/8 winner split.
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
- "[AWS Q4 2024 Earnings](https://www.aboutamazon.com/news/company-news/amazon-q4-2024-earnings)." Amazon, 2025.
- "[Cursor ARR $500M](https://techcrunch.com/2025/06/05/cursors-anysphere-nabs-9-9b-valuation-soars-past-500m-arr/)." TechCrunch, 2025.
