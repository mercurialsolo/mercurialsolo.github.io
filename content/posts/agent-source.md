---
title: "Agent Source"
date: 2026-03-24T10:00:00
author: mercurialsolo
tags: [ai, agents, open-source, cognitive-biases, libraries, developer-tools]
summary: "Coding agents now choose most of the libraries. And they choose badly, in predictable ways. 48% unnecessary library usage across eight models. 30 out of 30 cognitive biases confirmed across 20 LLMs. Open source is becoming agent source."
description: "AI coding agents don't choose libraries rationally. They exhibit the same cognitive biases humans do, but from a different source: training data instead of evolution. This piece maps six agent selection biases to their human analogues, traces the feedback loop that reinforces them, and asks whether open source conventions built for human developers need rebuilding for machines."
ShowToc: true
TocOpen: false
glossary:
  MCP: "Model Context Protocol; open standard by Anthropic for connecting AI agents to external tools and data sources"
  A2A: "Agent2Agent Protocol; Google's open protocol for agent interoperability with 150+ backing organizations"
  llms-txt: "A proposed standard for providing LLM-friendly documentation indexes at the root of websites"
  slopsquatting: "Registering hallucinated package names with malicious implementations to exploit AI code generation"
  corpus-presence: "The degree to which a library's usage patterns exist in model training data, driving agent preference"
  AGENTS-md: "A markdown file encoding project-specific rules that steer agent behavior at session start"
---

Spin up Claude Code, describe a task, and when you come back you find it having chosen `pandas` for a job where `polars` would've been 10x faster. Or imported NumPy where no math was needed at all. This kept happening, and I kept modding AGENTS/CLAUDE.md to patch it, until I started seeing these failures as something we all know too well: cognitive biases.

{{< highlight-box >}}
Cognitive biases are evolution's solution for speed over accuracy. Agents suffer from selection biases; training optimizes for next-token prediction over fitness-for-purpose.
{{< /highlight-box >}}

[Malberg et al.](https://arxiv.org/abs/2410.15413) tested 30 known cognitive biases across 20 LLMs and found evidence of all 30 in at least some models. [Zhou et al.](https://arxiv.org/abs/2601.08045) then studied bias specifically in LLM-assisted software development and found that 48.8% of programmer actions are biased, with LLM interactions accounting for 56.4% of those biased actions.

Every time you use agents you can see behavioural biases that can be mapped to specific failure modes. Think of biases but the agent mode of it:

{{< bias-grid title="Agent Selection Biases" subtitle="Human cognitive biases → Agent failure modes (click to expand)" >}}
{{< bias-card name="Popularity" color="#58a6ff" human="Follow the crowd" agent="Follow the corpus" stat="48% unnecessary NumPy" example="Express always. npm over bun." >}}
[Twist et al.](https://arxiv.org/abs/2503.17181) found LLMs overuse NumPy in 48% of cases where it's unnecessary. Developers on HN noticed Claude Code picks Express for every JavaScript backend. The Claude Code lead dev had to put "Use bun" in his own `CLAUDE.md` because the agent defaults to npm. Polars has twice the GitHub star growth rate of pandas, but agents never pick it.
{{< /bias-card >}}
{{< bias-card name="Temporal" color="#f0883e" human="Recency bias" agent="Frozen at training cutoff" stat="1 in 5 deps safe" example="javax over jakarta." >}}
Agents are frozen at their training cutoff, recommending whatever dominated circa 2022-2024. ThoughtWorks documented this: without code examples in prompts, LLMs default to `javax.persistence` (superseded years ago) instead of `jakarta.persistence`. Ask for a lightweight alternative to Intercom and you get Zendesk; "like asking for a bicycle and being handed a bus." Endor Labs reported in 2025 that only 1 in 5 AI-recommended dependency versions are safe.
{{< /bias-card >}}
{{< bias-card name="Anchoring" color="#d2a8ff" human="First info dominates" agent="Prior context bleeds" stat="URLs misapplied cross-domain" example="mongodb → python.org/docs" >}}
[Huang et al.](https://arxiv.org/abs/2505.15392) showed that prior context influences outputs even when not explicitly referenced. Carey observed this at MongoDB: an agent that visited `mongodb.com/docs` would later try `python.org/docs` instead of the correct `docs.python.org`. Gemini shoved `shadcn/ui` into a React dashboard mid-2025 without being asked; the HN discussion couldn't settle whether it was training-data prevalence, Tailwind synergy, or contextual anchoring. Probably all three.
{{< /bias-card >}}
{{< bias-card name="Default" color="#7ee787" human="Can't change behavior" agent="Can't change training" stat="58% Python. 0% Rust." example="Python always. Rust never." >}}
Python gets chosen 58% of the time for high-performance tasks where it's suboptimal. Rust is never chosen; not once, across eight models in the Twist study. The model has a default, and unless you override it in the context window, it'll reach for Python the way we reach for our phone.
{{< /bias-card >}}
{{< bias-card name="Survivorship" color="#ffa657" human="Neglect the filtered" agent="Invisible if not in corpus" stat="Polars invisible (2x stars)" example="Plotly: 1 task, 3 models." >}}
If your library wasn't in the training corpus, it doesn't exist to the agent. Plotly outpaces Matplotlib on growth signals but gets used for one problem by three models. The library might be objectively better, but if it wasn't visible during training, it's also invisible during inference.
{{< /bias-card >}}
{{< bias-card name="Confabulation" color="#ff7b72" human="No human analogue" agent="Invents libs confidently" stat="Pareto boundary sparse" example="Slopsquatting attacks." >}}
[Krishna et al.](https://arxiv.org/abs/2501.19012) found the Pareto boundary between code quality and package hallucination is sparsely populated. {{< term "slopsquatting" >}}: someone registers the hallucinated package name with malicious code. The agent isn't uncertain; it's wrong with full conviction.
{{< /bias-card >}}
{{< /bias-grid >}}

---

## The feedback loop

LLMs now frequently augment training data with self-generated code, and library favoritism in that synthetic data creates a feedback loop that further reduces diversity. [Improta et al.](https://arxiv.org/abs/2503.11402) confirms this: low-quality patterns in training data directly increase the probability of generating low-quality code at inference time.

[Taivalsaari and Mikkonen](https://arxiv.org/abs/2508.19834) call this the next chapter of software reuse: agents trusting an oracle whose training data predates the current API surface. The popularity contest is being run by the training corpus itself.

The supply chain risk compounds this. Today, the [litellm PyPI package was compromised](https://x.com/karpathy/status/2036487306585268612) (97 million downloads/month). A poisoned version exfiltrated SSH keys, cloud credentials, and API keys from every machine that installed it. The attack was discovered because an MCP plugin inside Cursor pulled litellm as a transitive dependency, the poisoned version crashed the machine, and someone noticed. Karpathy's reaction:

> *"Classical software engineering would have you believe that dependencies are good (we're building pyramids from bricks), but imo this has to be re-evaluated, and it's why I've been so growingly averse to them, preferring to use LLMs to 'yoink' functionality when it's simple enough and possible."*
> — [Andrej Karpathy](https://x.com/karpathy/status/2036487306585268612), March 24, 2026

When agents both choose dependencies blindly AND can write functionality from scratch, the question of import vs generate stops being academic. The biases push agents toward importing established libraries. The supply chain pushes toward generating from scratch. Something has to give.

---

## The discovery mess

So what do you do about this? I've spent the last few months trying every layer of the emerging discovery stack, and it's a mess at the moment. Nothing's just drop it in and it will work.

I shipped {{< term key="llms-txt" text="llms.txt" >}} files pointing to markdown docs. I configured {{< term "MCP" >}} servers and {{< term "A2A" >}} capability cards. I tested Context7 (24K+ indexed libraries) and browsed Smithery (128K+ skills). I watched Claude Code's skill system and Cursor's extensions start forming something like app stores inside agent workflows. These layers overlap, compete, and most are less than a year old. Noma Security's ContextCrush disclosure showed these channels are also emerging security loopholes.

The tooling's catching up and emerging fast in this space but not fast enough to keep pace at which automated code gen is permeating into our codebases. Stainless now generates MCP servers from OpenAPI specs. Context7 compiles docs into portable agent skills. Drift scans codebases and maps 150+ conventions for agent consumption. Adding rules to {{< term key="AGENTS-md" text="AGENTS.md" >}} — pandas over polars, deprecated APIs — is probably the single most effective correction today. Scott AI (YC F25) is building a neutral decision layer, arguing that coding agents are biased toward their own tooling.

---

## Exploit or Patch?

As these biases proliferate it opens both opportunities for improving as well as opens up temporary gaps that infra builders can exploit to get an advantage in distribution.

{{< highlight-box title="Open source becomes agent source" >}}
If the primary consumer is now an agent whose selection biases are well-documented and predictable, the conventions built for human developers (stars, READMEs, conference talks) need rebuilding for models. The ecosystem was built for a different cognitive system.
{{< /highlight-box >}}

**Packaging forks.** Libraries ship as npm or PyPI packages. Agents want MCP servers, `SKILL.md` files, `agent.json` capability cards. The question is whether agent-native packaging becomes primary, with human-readable packaging as secondary.

**Do stars give way to {{< term key="corpus-presence" text="corpus presence" >}}?** [Twist et al.'s](https://arxiv.org/abs/2503.17181) feedback loop means training-data representation drives selection more than any human signal. Getting your library into widely-used repos may matter more than accumulating stars. Discovery shifts from social proof to training-data SEO.

**Are agent biases going to be exploited or patched?** Both are already happening. Noma Security's researcher manufactured Context7's trending badges and top-4% rankings using nothing but fake API requests; no real adoption needed. As one HN commenter put it: "This is where LLM advertising will inevitably end up: completely invisible." On the correction side, [Zhou et al.'s](https://arxiv.org/abs/2601.08045) bias taxonomy comes with mitigations: {{< term key="AGENTS-md" text="AGENTS.md" >}} overrides, framework comparison tools, TDD to catch biased suggestions. Context7 provides current docs regardless of stale training data. Scott AI decouples library selection from the biased execution agent. Whether agent source produces a healthier or more monocultural ecosystem depends on which side moves faster.

---

The blast radius is still evolving but we are already in the middle-game of the coding agent era.

Model harnesses are quickly waking up and adjusting; Opus 4.6 already picks zustand over redux where earlier versions didn't, and dropped Redis for caching in cases where it was over-engineered. But model-level correction and corpus-level bias operate on different timescales, and the corpus moves slower. 30 out of 30 cognitive biases confirmed across 20 models isn't noise. And the 48% unneeded library usage across all models is a pattern, not just an edge case anymore.

{{< highlight-box >}}
Open source is rapidly evolving into the agent source era. Getting preferred by agents is how you find distribution for your next software library.
{{< /highlight-box >}}

---

## References

- Zhou et al., "[Cognitive Biases in LLM-Assisted Software Development](https://arxiv.org/abs/2601.08045)," Jan 2026
- Malberg et al., "[A Comprehensive Evaluation of Cognitive Biases in LLMs](https://arxiv.org/abs/2410.15413)," Oct 2024
- Twist et al., "[A Study of LLMs' Preferences for Libraries and Programming Languages](https://arxiv.org/abs/2503.17181)," Mar 2025
- Improta et al., "[Quality In, Quality Out: Investigating Training Data's Role in AI Code Generation](https://arxiv.org/abs/2503.11402)," Mar 2025
- Krishna et al., "[Importing Phantoms: Measuring LLM Package Hallucination Vulnerabilities](https://arxiv.org/abs/2501.19012)," Jan 2025
- Huang et al., "[An Empirical Study of the Anchoring Effect in LLMs](https://arxiv.org/abs/2505.15392)," May 2025
- Taivalsaari & Mikkonen, "[On the Future of Software Reuse in the Era of AI Native Software Engineering](https://arxiv.org/abs/2508.19834)," Aug 2025
- Carey, "[Agent-Friendly Docs](https://dacharycarey.com/2026/02/18/agent-friendly-docs/)," Feb 2026
- Howard, "[The /llms.txt file](https://llmstxt.org/)," Sep 2024
- Noma Security, "[ContextCrush: The Context7 MCP Server Vulnerability](https://noma.security/blog/contextcrush-context7-the-mcp-server-vulnerability/)," Mar 2026
- ThoughtWorks, "[How far can we push AI autonomy in code generation?](https://martinfowler.com/articles/pushing-ai-autonomy.html)," Aug 2025
- Woolf, "[An AI agent coding skeptic tries AI agent coding](https://minimaxir.com/2026/02/ai-agent-coding/)," Feb 2026
- Endor Labs, "AI Code Suggestions and Dependency Safety," 2025
