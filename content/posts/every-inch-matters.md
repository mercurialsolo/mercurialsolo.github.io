---
title: "Every Inch Matters"
date: 2026-01-18T08:00:00
lastmod: 2026-01-15T22:30:00
author: mercurialsolo
tags: [strategy, ai, startups, competition, moats, density]
summary: "When building becomes trivially easy, every software market becomes a red ocean. A browser from scratch in one week. 3 million lines of code. This isn't an anomaly; it's the new baseline."
ShowToc: true
TocOpen: false
glossary:
  PMF: "Product-Market Fit - when a product satisfies strong market demand."
  ARR: "Annual Recurring Revenue - yearly value of recurring subscriptions."
  GRR: "Gross Revenue Retention - percentage of revenue retained from existing customers."
  CAC: "Customer Acquisition Cost - total cost to acquire a new customer."
  LTV: "Lifetime Value - total revenue expected from a customer over their lifetime."
---

In January 2026, Cursor CEO Michael Truell posted a tweet that should terrify every software founder:

> "We built a browser with GPT-5.2 in Cursor. It ran uninterrupted for one week. It's 3M+ lines of code across thousands of files. The rendering engine is from-scratch in Rust with HTML parsing, CSS cascade, layout, text shaping, paint, and a custom JS VM. It *kind of* works!"

A browser from scratch in one week: 3 million lines of code. This isn't an anomaly; it's the new baseline.

When building becomes trivially easy, every software market becomes a red ocean. And in red oceans, every inch matters.

---

## There's no barrier to entry

A founder I spoke with recently put it bluntly: "We used to worry about whether we could build it. Now we worry about whether we can survive the twelve competitors who'll ship the same thing next week."

| Before AI Coding | After AI Coding |
|------------------|-----------------|
| Building is hard | Building is trivial |
| Code is the moat | Code is commodity |
| 10x engineers rare | 10x tools ubiquitous |
| Features differentiate | Features get copied in days |
| First-mover advantage | First-mover target |

This is what military strategists call "density": when maneuver space collapses and every position is contested. At Thermopylae, 300 Spartans held a narrow pass against 100,000 Persians because geography negated numerical advantage. Software markets have reached their Thermopylae. The pass has narrowed; flanking is impossible.

---

## PMF is dead

Brian Balfour at Reforge has documented what he calls "[Product-Market Fit Collapse](https://www.reforge.com/blog/product-market-fit-collapse)": customer expectations spike nearly instantly rather than rising gradually. ChatGPT reached 1 million users in 5 days. When the threshold for "good enough" accelerates faster than companies can innovate, moats dissolve.

Stack Overflow illustrated the collapse in real time. Monthly visits dropped from 110 million (2022) to 55 million (2024); new questions fell 75% from peak. By February 2025, [the site received only 29,693 new questions](https://www.ericholscher.com/blog/2025/jan/21/stack-overflows-decline/), the lowest monthly total since 2010.

Elena Verna's insight: "Features are easy to copy. Trust isn't." When capabilities commoditize, customers retain products they trust rather than constantly switching. The referral is the ultimate trust signal; discovery through someone you trust beats any ad.

---

## Stickiness is a myth

Traditional product stickiness mechanisms don't work in AI. AI-native products under $50/month show [23% gross revenue retention](https://www.growthunhinged.com/p/the-ai-churn-wave) versus 43% for traditional SaaS. That's a 20-point gap.

- Character.AI → 60% user base collapse in 12 months
- Jasper AI → 53% collapse in revenue

### Zero switching costs

vLLM, SGLang, and dozens of inference backends provide [OpenAI-compatible endpoints out of the box](https://bentoml.com/llm/llm-inference-basics/openai-compatible-api). OpenRouter normalizes the schema across 100+ models, letting teams ["switch between hundreds of models without changing your code."](https://openrouter.ai/docs/guides/overview/models)

Claude and ChatGPT now score within percentage points on benchmarks. Inference costs collapsed 280x: from $20 per million tokens (2022) to [$0.07 per million tokens](https://www.baytechconsulting.com/blog/the-state-of-artificial-intelligence-in-2025/) (2024). When quality is indistinguishable and price is negligible, what's left to defend?

{{< highlight-box title="The Glass Slipper Effect" >}}
A16z and OpenRouter's [100 trillion token study](https://a16z.com/the-cinderella-glass-slipper-effect-retention-rules-in-the-ai-era/) reveals the physics of AI stickiness.

**Only the foundational cohort survives.** Users who adopt when a model is perceived as "frontier" integrate deeply into workflows, develop tacit knowledge about the model's specific strengths, and face real switching costs from workflow reengineering.

**All subsequent cohorts show identical churn patterns.** They "cluster at the bottom" because they see the model as "good enough" but not irreplaceable.

Stickiness depends on the underlying model capabilities, not your product's UI or features. When a better model arrives, even sticky users evaluate alternatives.

As Nathan Lambert [wrote](https://www.interconnects.ai/p/gpt4-commoditization-and-moats): "The early idea that models could be moats has been resoundingly defeated."
{{< /highlight-box >}}

---

## Winning in Density

When the board fills with competitors who can all build the same features, bold product moves become liabilities. A flashy new feature gets copied in days.

**1. Distribution is the product**

Traditional growth channels are collapsing. [Elena Verna documents the shift](https://www.elenaverna.com/p/growth-is-now-a-trust-problem): SEO undermined by AI-generated content, paid search economics deteriorating, corporate social hostile to external links. When features commoditize, distribution becomes the moat.

[Cursor reached $500M {{< term "ARR" >}}](https://techcrunch.com/2025/06/05/cursors-anysphere-nabs-9-9b-valuation-soars-past-500m-arr/) through pure bottom-up virality. GitHub Copilot ships embedded in the workflow. Gemini dropped itself into Gmail - a single integration gets 100mn customers on launch. The product that's already there wins.

**2. Retain through distillation**

Every user interaction should make the product better for all users. This is harder to replicate than algorithms or workflows. When users collectively improve the product, switching means starting over.

**3. Embed into workflows**

Become infrastructure, not application. Products embedded in workflows survive; adjacent tools get absorbed.

**4. Domain expertise isn't synthetic**

Harvey for legal. Abridge for clinical. Vertical specialization with regulatory moats. The closer to "human judgment required," the safer.

**5. Compound marginal gains**

When building features becomes table stakes, victory goes to whoever compounds improvements fastest. The rate of learning matters.

British Cycling coach Dave Brailsford [proved this](https://jamesclear.com/marginal-gains): "If you broke down everything you could think of that goes into riding a bike, and then improve it by 1%, you will get a significant increase when you put them all together."

The math: **(1.01)^365 = 37.78**

They went from [a single Olympic gold in 76 years to dominating three consecutive Olympics](https://hbr.org/2015/10/how-1-performance-improvements-led-to-olympic-gold) (2008-2016) by optimizing everything from saddle position to tire temperature. None revolutionary. Together, decisive.

### The Tactical Shift

| Growth Mode | Density Mode |
|-------------|--------------|
| Cross-functional product teams | Centers of excellence for optimization |
| Move fast, ship features | Data science, operations research, industrial engineering |

Amazon's transition from "get big fast" (1995-2005) to "operational excellence" (2005+) is the template.

---

## When to Escape

But if density always rewards optimization, why did Bezos launch AWS instead of squeezing more margin from retail?

The winning plays are often counter-intuitive:

**Shift dimensions**

In 2006, Amazon's retail margins were compressing against Walmart and Target. Instead of operational efficiency, Bezos bet that the same infrastructure powering Amazon could power everyone else. AWS now runs at [$107B annual revenue](https://www.aboutamazon.com/news/company-news/amazon-q4-2024-earnings).

When this works: you have asymmetric capabilities transferable to adjacent markets while competitors build the wrong defenses.

**Rebuild from scratch**

Technology transitions temporarily reopen closed markets. Incumbents who integrate new tech into existing products lose to challengers who rebuild from scratch.

[Instagram](https://about.fb.com/news/2012/04/facebook-to-acquire-instagram/) (mobile-only, no desktop) sold for $1B; Flickr (desktop-first, mobile-adapted) [sold for ~$35M](https://www.vox.com/2017/6/15/15782200/how-yahoo-killed-flickr-marissa-mayer). [Kodak invented the digital camera in 1975](https://en.wikipedia.org/wiki/Kodak) but protected [80% film margins](https://quartr.com/insights/edge/the-dilemma-that-brought-down-kodak); bankruptcy followed.

The pattern is Clayton Christensen's [Innovator's Dilemma](https://www.hbs.edu/faculty/Pages/item.aspx?num=46): legacy architecture constrains, cannibalization fears paralyze, organizational antibodies attack. For AI, this window is open now. Companies adding "AI features" to existing SaaS will lose to those rebuilding workflows with AI at the core.

**Reframe the game**

AlphaGo's [Move 37](https://en.wikipedia.org/wiki/AlphaGo_versus_Lee_Sedol) looked wrong but exploited patterns humans missed. When density is perceptual rather than physical, seeing the market differently than consensus reveals openings others miss.

{{< highlight-box >}}
About 70% of the time, density is real and optimization wins. The remaining 30% splits between dimension shifts (transferable assets), perception plays (seeing what others miss), and ground-up rebuilds (during technology transitions).
{{< /highlight-box >}}

---

## Coda: Finding Alpha

Finding alpha isn't a strategy by itself. It's the outcome, the gap between your clarity and everyone else's confusion. Most players are hedging, debating, preserving optionality. The alpha is in reading the game correctly while others misdiagnose it.

> Buffett on Amazon: "The problem is when I think something will be a miracle, I tend not to bet on it." He [missed a 44,000% return](https://www.cnbc.com/2018/05/05/buffett-i-was-wrong-on-google-and-amazon-bezos-achieved-a-business-miracle.html) waiting for complete certainty. Preserving optionality meant winning nothing.

In density, the temptation is to chase shiny things. In transitions, the temptation is to "wait and see." Both are hedging. Both kill alpha.

Kasparov didn't beat Karpov in their [1990 World Championship](https://www.chessgames.com/perl/chess.pl?tid=55223) endgame by waiting for clarity. He moved his king to the critical square one tempo before Karpov reached his. [That single move separated the championship](https://www.mark-weeks.com/chess/90kk$$.htm). In contested positions, the cost of hesitation exceeds the cost of imperfect execution.

The AI transition window is open. Some markets within it are already densifying (basic chatbots, simple automations). Others are still wide open (agentic workflows, vertical AI, AI-native interfaces). The skill is reading which zone you're in, then playing that game with full commitment while others hedge across both.

Pick your game. Then play it like every inch matters.

---

## References

**Frameworks & Strategy**
- Verna, Elena. "[Growth Is Now a Trust Problem](https://www.elenaverna.com/p/growth-is-now-a-trust-problem)." 2025. On trust as the new moat when traditional growth channels collapse.
- Balfour, Brian. "[Product-Market Fit Collapse](https://www.reforge.com/blog/product-market-fit-collapse)." Reforge, 2024.
- Mehta, Ravi. "[AI Disruption Risk Framework](https://blog.ravi-mehta.com/p/ai-risk-disruption-framework)." 2024.
- Christensen, Clayton. *[The Innovator's Dilemma](https://www.hbs.edu/faculty/Pages/item.aspx?num=46)*. Harvard Business School Press, 1997.
- Thompson, Ben. "[AI Integration and Modularization](https://stratechery.com/2024/ai-integration-and-modularization/)." Stratechery, 2024.

**Case Studies**
- Clear, James. "[How 1% Improvements Led to Olympic Gold](https://jamesclear.com/marginal-gains)." On British Cycling's marginal gains philosophy.
- "[How 1% Performance Improvements Led to Olympic Gold](https://hbr.org/2015/10/how-1-performance-improvements-led-to-olympic-gold)." Harvard Business Review, 2015.
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
