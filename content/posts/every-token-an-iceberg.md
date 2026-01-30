---
title: "Every Token an Iceberg"
date: 2026-01-30T00:00:00-08:00
author: mercurialsolo
tags: ["ai", "reasoning", "economics", "verification"]
summary: "Inference workloads now account for 80% of AI compute spending. The hierarchy in tokens is no longer about information density—it's what happens when the token leads somewhere wrong."
ShowToc: true
TocOpen: false
---

**Version 2.0** — Rewritten with Q4 2025/early 2026 case studies, verified sources, practitioner voices.

---

> 📈 **The Economic Shift**
>
> Inference workloads now account for [80% of AI compute spending](https://www.computerworld.com/article/4114579/ces-2026-ai-compute-sees-a-shift-from-training-to-inference.html), with [test-time compute emerging as the third scaling law](https://fourweekmba.com/the-three-scaling-laws-of-ai-pre-training-post-training-and-test-time/) alongside pre-training and post-training. The economic pattern mirrors human work: pre-training builds world models (school), inference creates value (work).

The token production has exploded in our face. Humans are not the only token producers, models now have exploded this production of tokens by over a 100x. And each token hides an exponential amount of compute underneath.

---

## "I've Never Felt This Much Behind"

On December 26, 2025, [Karpathy tweeted](https://x.com/karpathy/status/2004607146781278521):

> "I've never felt this much behind as a programmer. The profession is being dramatically refactored as the bits contributed by the programmer are increasingly sparse and between."

The new vocabulary he listed: agents, subagents, prompts, contexts, memory, modes, permissions, tools, plugins, skills, hooks, MCP, LSP, slash commands, workflows, IDE integrations. He described it as a ["magnitude 9 earthquake rocking the profession"](https://eu.36kr.com/en/p/3638410115976320):

> "some powerful alien tool was handed around except it comes with no manual and everyone has to figure out how to hold it and operate it."

Karpathy described these systems as "stochastic, fallible, unintelligible and changing entities suddenly intermingled with what used to be good old fashioned engineering." The compute cost keeps dropping while what it produces (structured thought, working code) gets more valuable.

> [Schools need to rebuild curriculum around framing and knowledge distillation](https://www.eschoolnews.com/innovative-teaching/2026/01/01/draft-2026-predictions/) rather than knowledge storage. The question should shift from "do you remember this" to "when would you use this" and "why does this make sense?"

---

## Not All Tokens Are Made the Same

The hierarchy in tokens is no longer about information density - rather, what happens when the token leads to somewhere wrong.

**Content tokens:** ChatGPT generates a mediocre product description? Reader skips it, tries another. **Blast radius: seconds.** Few minutes lost.

**Code tokens:** [85% of developers use AI coding tools](https://blockchain.news/news/ai-coding-assistants-85-percent-adoption-vibe-coding-mainstream-2026), [programming consumes 50%+ of token volume](https://openrouter.ai/state-of-ai), [single code reviews generate 700k+ tokens](https://www.theregister.com/2026/01/05/claude_devs_usage_limits/). Verification gates catch errors before they compound: hallucinated APIs fail at compile time, bad logic fails in tests. **Blast radius: hours.** A few hours debugging, then fixed.

With AI assisting or generating research reports, consulting analysis, or policy documents, the output looks correct (proper formatting, citation style, grammatical prose) while containing fabricated sources or flawed logic that's hard to reason through without the proper framing and expensive verification. **The blast radius here balloons - from months to years.** Errors can compound through organizations undetected, leading to financial loss (A$440K, CA$1.6M) and credibility losses - hard to recover from.

---

## The Cost of Wrong Reasoning

### Government Policy

In late September 2025, [Dr. Chris Rudge discovered](https://fortune.com/2025/10/07/deloitte-ai-australia-government-report-hallucinations-technology-290000-refund/) that a A$440,000 report Deloitte submitted to the Australian government contained fake academic sources and a fabricated federal court quote. One citation referenced a non-existent book supposedly written by a real University of Sydney professor. [Deloitte had used GPT-4o](https://www.business-standard.com/technology/tech-news/deloitte-ai-hallucination-report-australia-gpt4o-fabricated-references-125100800915_1.html) to build this - no verification loop as the scale of information generation grew.

A few months later, [The Independent newspaper discovered](https://theindependent.ca/news/lji/major-n-l-healthcare-report-contains-errors-likely-generated-by-a-i/) that Deloitte's CA$1.6 million Health Human Resources Plan for Newfoundland and Labrador contained at least four false citations. The 526-page report was commissioned in March 2023, delivered March 2025, and released May 2025. [Deloitte stood by the conclusions despite acknowledging the fabricated sources](https://www.cbc.ca/news/canada/newfoundland-labrador/nl-deloitte-citations-9.6990216).

The classic error cascade pattern: models generates confident fabrications, that pass human review (citations look plausible), gets embedded in official government policy documents, propagates for months. Wrong assumption at token generation, zero verification at multiple checkpoints, and detection and verification only after public scrutiny.

### Scientific Research Integrity

In January 2026, [GPTZero analyzed 4,000+ papers from NeurIPS 2025](https://fortune.com/2026/01/21/neurips-ai-conferences-research-papers-hallucinations/) and uncovered 100+ AI-hallucinated citations spanning at least 53 papers. These were "the first documented cases of hallucinated citations entering the official record of the top machine learning conference" with a 24.52% acceptance rate. [GPTZero found 50 additional hallucinated citations](https://betakit.com/start-up-investigation-reveals-50-peer-reviewed-papers-contained-hallucinated-citations/) in papers under review for ICLR 2026.

The fabrications took multiple forms: fully invented citations with nonexistent authors, AI blending elements from multiple real papers with believable-sounding titles, and real papers with subtle alterations (expanding author initials, dropping coauthors, paraphrasing titles). [Recent studies show](https://www.psypost.org/study-finds-nearly-two-thirds-of-ai-generated-citations-are-fabricated-or-contain-errors/) only 26.5% of AI-generated references were entirely correct, while nearly 40% were erroneous or fabricated.

**Peer review failed:** Reviewers, handling 3+ papers each under tight deadlines, assumed authors verified references and didn't spot-check citations. [Up to 17% of peer reviews at major computer science conferences are now AI-written](https://www.rollingstone.com/culture/culture-features/ai-chatbot-journal-research-fake-citations-1235485484/), creating a double-AI failure loop.

**Trust cascade:** When fabricated citations enter the scientific record, subsequent researchers cite these papers, build experiments on flawed foundations, and compound errors across entire research branches. The cost isn't just retractions; it's years of derivative research questioning whether their foundational references were real.

---

## The Reasoning Frontier

Reasoning models cost more than standard inference ([o3 at $0.10 per thousand tokens](https://research.aimultiple.com/llm-scaling-laws/) versus GPT-4o). The premium isn't for raw compute; it's for deeper reasoning. Reasoning models run parallel chains that check each other, explore multiple solution paths, and synthesize across approaches before generating output.

But reasoning in models has a ceiling. Models operate within fixed context windows, applying pattern matching at scale. They don't compress knowledge into abstractions the way humans do.

{{< highlight-box title="The Reasoning Gap" >}}
AI reasoning operates by expanding context (more tokens, longer chains, parallel exploration). Human reasoning operates by abstracting context (compressing knowledge into mental models, distilling principles, synthesizing across domains). When you compress "100 papers on X" into "the core insight is Y," you've done reasoning work that doesn't scale with purely more tokens.
{{< /highlight-box >}}

Human tokens create value by pushing the depth on the reasoning frontier - better abstractions, longer association & depth of attention, creative framing:

**1. Making every token count.** Instead of generating more tokens, compress reasoning into fewer, denser tokens. A consultant who synthesizes 500 pages into 3 strategic implications did reasoning AI can't replicate by scaling inference.

**2. Steering intelligence for better reasoning.** Frame problems to direct AI reasoning toward productive paths. "Find all research on X" generates lists. "What contradictions exist in the X literature, and which matter?" steers toward reasoning that requires abstraction.

**3. Distilling knowledge into mental models.** AI agents with prompt injection vulnerabilities ([Moltbot](https://www.theregister.com/2026/01/27/clawdbot_moltbot_security_concerns/), [Docker Hub's assistant](https://www.malwarebytes.com/blog/news/2025/12/prompt-injection-is-a-problem-that-may-never-be-fixed-warns-ncsc)) fail because they can't abstract "trusted instruction" from "external data." [OpenAI acknowledged](https://techcrunch.com/2025/12/22/openai-says-ai-browsers-may-always-be-vulnerable-to-prompt-injection-attacks/) prompt injection "is unlikely to ever be fully 'solved'" - it's a reasoning problem, not a security patch. Human reasoning builds the abstraction layer that distinguishes context from instructions.

---

## Where Human Reasoning Still Matters

[Shane Legg, DeepMind co-founder](https://x.com/ShaneLegg/status/1877674960770007042):

> "Pragmatically, we can say that AGI is reached when it's no longer easy to come up with problems that regular people can solve (with no prior training) and that are infeasible for AI models. Right now it's still easy to come up with such problems."

The shift from AI generation to human verification is already reshaping work. [Research from Penn Wharton](https://budgetmodel.wharton.upenn.edu/issues/2025/9/8/projected-impact-of-generative-ai-on-future-productivity-growth) projects AI will increase GDP 1.5% by 2035, 3% by 2055, but these gains come from task automation, not job replacement. A software engineer's job exists, but writing boilerplate vanished. A consultant's job exists, but formatting reports disappeared. The shift happens at task level, invisible until the job becomes a bundle of deprecated tasks.

As AI systems work as copilots and autopilots, erroneous reasoning in base patterns can move through systems much like human biases. When models train on their own outputs or optimize without human feedback, reasoning further drifts. The concern isn't just security exploits; it's reasoning misalignment where AI systems optimize toward patterns that can't abstract beyond token-level operations.

> ⚠️ **Misalignment Risk: Moltbot (Jan 2026)**
>
> [Moltbot (formerly Clawdbot), an open-source AI assistant that went viral in January 2026](https://www.theregister.com/2026/01/27/clawdbot_moltbot_security_concerns/), demonstrates reasoning misalignment. [Palo Alto Networks warned](https://www.paloaltonetworks.com/blog/network-security/why-moltbot-may-signal-ai-crisis/) it "does not maintain enforceable trust boundaries between untrusted inputs and high-privilege reasoning." The failure isn't security; it's the inability to reason about instruction context at an abstract level. [Security researchers discovered](https://pivot-to-ai.com/2026/01/28/moltbot-clawdbot-an-expensive-and-insecure-ai-agent-that-doesnt-work/) eight installations "open with no authentication" - a symptom of reasoning systems deployed without human reasoning about trust models.

The task for human intelligence is ensuring progress aligns with human values even as autonomous reasoning systems surpasses human intelligence.

---

## Every Token an Iceberg

**1. Framing to direct reasoning.** Deloitte's reports had perfect formatting, proper citation style, grammatically correct prose. The AI optimized for "looks like a research report." Human reasoning meant abstracting to a higher level: the goal wasn't appearance but epistemic validity. AI reasons within the frame you provide; human reasoning questions whether the frame addresses the right problem.

**2. Abstracting to compress context.** [Research on AI in scientific discovery](https://arxiv.org/html/2509.01398v1) shows AI systems "produce confident but false statements and mathematically inconsistent expressions." The [SPOT benchmark](https://arxiv.org/pdf/2505.11855) demonstrates even o3 (18.4% accuracy) struggles to detect its own errors. AI reasoning operates by expanding context - more tokens, longer chains, parallel exploration. Human reasoning operates by abstracting context - compressing 100 papers into one core insight, distilling principles from patterns, building mental models that expand effective reasoning without expanding tokens.

**3. Synthesizing across domains for alignment.** [AI agent deployments continue](https://theconversation.com/ai-agents-arrived-in-2025-heres-what-happened-and-the-challenges-ahead-in-2026-272325) despite unsolved reasoning challenges. Human reasoning synthesizes across technical constraints (what's possible), human values (what's desirable), and practical deployment (what's acceptable risk). This synthesis - pulling from ethics, engineering, economics, and lived experience - creates the reasoning layer that steers AI progress toward alignment before reasoning systems drift into patterns that devalue human input.

Human reasoning stays valuable by operating one level of abstraction above model capabilities - not competing on token generation speed, but on reasoning depth through abstraction, distillation, and synthesis.

{{< highlight-box title="The Human Frontier" >}}
If you build on generation speed, you're competing on price against free. If you build on reasoning depth - abstraction, distillation, synthesis - you're working in the only zone that still matters. Make every token an iceberg.
{{< /highlight-box >}}

---

## References

### Core Claims (Q4 2025/Early 2026)

**Compute Economics**
- [Computerworld: AI Compute Shift](https://www.computerworld.com/article/4114579/ces-2026-ai-compute-sees-a-shift-from-training-to-inference.html) — 80/20 spending split, Lenovo CEO forecast
- [FourWeekMBA: Three Scaling Laws](https://fourweekmba.com/the-three-scaling-laws-of-ai-pre-training-post-training-and-test-time/) — Pre-training, post-training, test-time
- [AI Multiple: Reasoning Model Costs](https://research.aimultiple.com/llm-scaling-laws/) — o3 at $0.10 per 1K tokens

**Practitioner Voices**
- [Andrej Karpathy Tweet (Dec 26, 2025)](https://x.com/karpathy/status/2004607146781278521) — "Never felt this much behind," 16.4M views
- [Shane Legg Tweet (Jan 2026)](https://x.com/ShaneLegg/status/1877674960770007042) — DeepMind co-founder: "Right now it's still easy to come up with [problems] that regular people can solve (with no prior training) and that are infeasible for AI models"
- [36kr: Magnitude 9 Earthquake](https://eu.36kr.com/en/p/3638410115976320) — "Alien tool with no manual" quote coverage
- [Business Today: OpenAI Co-founder](https://www.businesstoday.in/technology/news/story/never-felt-this-behind-openai-co-founder-admits-ai-is-evolving-so-fast-its-refactoring-how-developers-work-508391-2025-12-28) — "Refactoring how developers work"

**Case Study: Deloitte Hallucinations (Sept-Nov 2025)**
- [Fortune: Australian Report](https://fortune.com/2025/10/07/deloitte-ai-australia-government-report-hallucinations-technology-290000-refund/) — A$440K report, Dr. Rudge discovery, Sept 2025
- [Business Standard: Azure OpenAI GPT-4o](https://www.business-standard.com/technology/tech-news/deloitte-ai-hallucination-report-australia-gpt4o-fabricated-references-125100800915_1.html) — Deloitte acknowledged using GPT-4o
- [CBC News: Newfoundland Report](https://www.cbc.ca/news/canada/newfoundland-labrador/nl-deloitte-citations-9.6990216) — CA$1.6M report, 4+ fake citations
- [The Independent: Discovery](https://theindependent.ca/news/lji/major-n-l-healthcare-report-contains-errors-likely-generated-by-a-i/) — 526-page report, commissioned Mar 2023, delivered Mar 2025

**Case Study: Scientific Research Integrity (Jan 2026)**
- [Fortune: NeurIPS AI Hallucinations](https://fortune.com/2026/01/21/neurips-ai-conferences-research-papers-hallucinations/) — GPTZero analysis of 4,000+ papers, 100+ hallucinated citations in 53 papers, Jan 2026
- [BetaKit: ICLR 2026 Findings](https://betakit.com/start-up-investigation-reveals-50-peer-reviewed-papers-contained-hallucinated-citations/) — 50 additional fabricated citations found in ICLR 2026 submissions
- [PsyPost: Citation Accuracy Study](https://www.psypost.org/study-finds-nearly-two-thirds-of-ai-generated-citations-are-fabricated-or-contain-errors/) — Only 26.5% of AI-generated references correct, 40% fabricated
- [Rolling Stone: AI Peer Reviews](https://www.rollingstone.com/culture/culture-features/ai-chatbot-journal-research-fake-citations-1235485484/) — Up to 17% of peer reviews at major CS conferences AI-written, double-AI failure loop

**Case Study: Prompt Injection Wave (Nov-Dec 2025)**
- [TechCrunch: OpenAI on Prompt Injection](https://techcrunch.com/2025/12/22/openai-says-ai-browsers-may-always-be-vulnerable-to-prompt-injection-attacks/) — "May never be fully solved"
- [UK NCSC Warning](https://www.infosecurity-magazine.com/news/ncsc-raises-alarms-prompt/) — "May never be totally mitigated," data breach wave predicted
- [Malwarebytes: Docker Hub](https://www.malwarebytes.com/blog/news/2025/12/prompt-injection-is-a-problem-that-may-never-be-fixed-warns-ncsc) — Pillar Security discovery, metadata poisoning
- [BankInfoSecurity: ChatGPT](https://www.bankinfosecurity.com/openai-will-forever-fight-prompt-injection-attacks-a-30380) — ShadowLeak, ZombieAgent attacks, Radware research
- [Infosecurity Magazine: HashJack](https://www.infosecurity-magazine.com/news/hashjack-indirect-prompt-injection/) — Cato Networks, weaponized websites, browser vulnerabilities

**Case Study: Moltbot Misalignment (Jan 2026)**
- [The Register: Moltbot Security Concerns](https://www.theregister.com/2026/01/27/clawdbot_moltbot_security_concerns/) — Viral AI assistant, renamed from Clawdbot, security flaws
- [Palo Alto Networks: AI Security Crisis](https://www.paloaltonetworks.com/blog/network-security/why-moltbot-may-signal-ai-crisis/) — No trust boundaries, OWASP Top 10 failures
- [Pivot to AI: Moltbot Analysis](https://pivot-to-ai.com/2026/01/28/moltbot-clawdbot-an-expensive-and-insecure-ai-agent-that-doesnt-work/) — 8 installations exposed, no authentication

**Case Study: AI Verification Challenges**
- [arXiv: AI in Scientific Discovery](https://arxiv.org/html/2509.01398v1) — "Confident but false statements," Sept 2025
- [arXiv: SPOT Benchmark](https://arxiv.org/pdf/2505.11855) — o3 error detection 18.4% accuracy, May 2025
- [The Conversation: AI Agents in 2025](https://theconversation.com/ai-agents-arrived-in-2025-heres-what-happened-and-the-challenges-ahead-in-2026-272325) — Deployment challenges ahead in 2026

**Market Data**
- [blockchain.news: 85% Adoption](https://blockchain.news/news/ai-coding-assistants-85-percent-adoption-vibe-coding-mainstream-2026) — Developer AI tool usage, 2026
- [OpenRouter: Token Volume](https://openrouter.ai/state-of-ai) — 50%+ programming, 100T+ study
- [The Register: Code Review Tokens](https://www.theregister.com/2026/01/05/claude_devs_usage_limits/) — 700k+ per review
- [Penn Wharton: GDP Projections](https://budgetmodel.wharton.upenn.edu/issues/2025/9/8/projected-impact-of-generative-ai-on-future-productivity-growth) — 1.5% by 2035, 3% by 2055
- [eSchool News: Curriculum Shifts](https://www.eschoolnews.com/innovative-teaching/2026/01/01/draft-2026-predictions/) — 2026 education predictions
