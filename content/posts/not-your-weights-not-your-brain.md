---
title: "Not Your Weights, Not Your Brain"
date: 2026-04-16T00:00:00+05:30
author: mercurialsolo
tags: [ai, local-models, knowledge-distillation, copilots, personal-ai, agency]
summary: "Your corrections to AI carry 'dark knowledge' about your expertise. Teaching on-device models your reasoning traces, not renting cognition from cloud APIs, is the real unlock for AI copilots."
description: "Every time I correct my AI copilot, I'm leaking expertise — dark knowledge about how I think, what trade-offs I accept, where I draw the line. That signal is either compounding on my machine or vanishing into someone else's training run. I chose to keep it."
series: ["Coding Agents"]
ShowToc: true
TocOpen: false
glossary:
  knowledge-distillation: "An ML technique where a large 'teacher' model transfers learned patterns to a smaller 'student' model via soft probability distributions rather than hard labels."
  dark-knowledge: "Hinton's term for the information encoded in the relative probabilities of wrong answers, invisible in hard labels but captured in soft targets."
  tacit-knowledge: "Expertise that can be demonstrated but not easily articulated. Coined by Michael Polanyi: 'we know more than we can tell.'"
  few-shot-retrieval: "Providing a small number of relevant examples in the model's context window at inference time, rather than training the model on them."
  protege-effect: "The finding that teaching material to others improves the teacher's own learning more than studying alone."
  lora: "Low-Rank Adaptation. A parameter-efficient fine-tuning method that trains small adapter layers instead of modifying all model weights."
  exocortex: "An external cognitive system — memory, preferences, workflows, artifacts — that extends your thinking beyond what fits in your head."
images:
  - /images/not-your-weights/cover.svg
---

> "As we expand our brains into an exocortex on a computing substrate, we will be renting our brains and open source will become more important because 'not your weights, not your brain.'" — Karpathy

Persistent memory, preferences, workflows, and artifacts that extend your cognition beyond what fits in your head — that's our {{< term "exocortex" >}}. And with agents handling research, synthesis, code generation, and document drafting, the compounding asset is no longer the model itself but the judgment layer we accumulate around it — traces, evals, policies, and knowledge artifacts. This transforms general intelligence to personal intelligence.

Where inference runs, what the provider retains, and who owns the persistent state — these define who extracts value from this exocortex. And just running local inference doesn't automatically mean you are able to use this. The future: **own the control plane, keep the state portable** and rent the compute plane when it's economically better. The more of this loop you own, the more of the value you can extract from your own knowledge.

![Cloud inference disperses your correction traces to the provider. Local inference compounds them on your device.](/images/not-your-weights/cloud-vs-local.svg)

We know more than we can tell. The diagnostic intuition a doctor builds over decades, the architect's sense of proportion, the engineer's instinct that a codebase "smells" wrong before they can articulate why. This {{< term key="tacit-knowledge" text="tacit knowledge" >}}, the part in repeatable task judgments, has been hard to transfer. It lives in the body and judgment of the practitioner, not in any document they've written.

But every time we approve or reject an AI suggestion, we externalize a fragment of that tacit knowledge. When a senior engineer rejects an AI's deployment script because it skips the staging environment, or approves an architecture refactor because it matches the team's migration strategy, those decisions encode not just "right or wrong" but the relative weight of judgment across specific contexts. It's a signal of our thinking & knowledge. But who's capturing the signal?

The LLM Wiki illustrates this pattern. Raw sources flowing into an LLM that compiles a structured wiki, which then answers queries against compiled knowledge. Karpathy's personal version grew to approximately 100 articles and 400,000 words, not a single one written directly. We should stop treating LLMs as search engines; use them as "tireless librarians and system maintainers" for OUR knowledge. **The models should be building our knowledge base, not we theirs.**

A wiki is about persistent *knowledge*: facts, structured information, compiled references. An approval supervisor is about persistent *judgment*: decision policy, preferences, trade-offs. Together they form our exocortex.

## Books - videos - software - models — we are knowledge distillation machines

Hinton's work on {{< term "knowledge-distillation" >}} showed that soft probability distributions from a teacher model carry far richer information than hard labels. He called this "{{< term key="dark-knowledge" text="dark knowledge" >}}" — the signal hidden in relative probabilities of wrong answers, invisible in a binary right/wrong classification but encoded in the full distribution.

When correcting an AI's output, we're not just providing a hard label ("this is wrong"). We're providing signal about the shape of your judgment: which errors matter more, which trade-offs are acceptable, what "good enough" looks like in this specific context. The corrections carry richer preference signal than hard labels and can later support preference learning, reward modeling, or distillation-like compression. They encode expertise in a way that no explicit instruction could capture.

We do this continuously and subconsciously, not just in our AI interactions. We extract information from experience, compress it into mental models, and deploy those models faster than we can deliberately articulate the rules. The difference between a junior engineer and a senior engineer isn't access to information. It's 10,000+ compressed experiences of what went wrong and why.

Every AI interaction is a potential distillation opportunity. The question becomes whether this distilled knowledge accumulates on your behalf or moves into someone else's training corpus.

{{< highlight-box title="Building the Signal Locally" >}}
`claudectl` is a local brain for your coding agents. It runs a quantized 4B model on my laptop that supervises my Claude Code sessions, making approve/deny decisions on tool calls.

Every correction I make is logged as JSONL alongside the context that produced it. After a few hundred corrections: the model has internalized that `cargo test` is always safe in my Rust projects but `npm run deploy` needs review, that Read operations are fine but Write operations in `src/config/` require manual approval, that sessions over $10 with no file edits should be flagged.

After 500+ logged decisions, novel situations requiring human review have dropped to roughly 20% of total decisions. False-approve and false-deny rates are being tracked; early numbers are directionally encouraging but the sample needs to grow.

The corrections are encoding my engineering judgment in a form I can read, edit, and version. More importantly, I own my trained judgment model. It's an attempt at inverting the brain drain.

Download, fork & star at [github.com/mercurialsolo/claudectl](https://github.com/mercurialsolo/claudectl)
{{< /highlight-box >}}

## Teaching is learning

When we reject an AI's suggestion, we're forced to articulate why: what assumption it violated, what context it missed, what the correct approach would be. That's not just feedback for the model. It's cognition that sharpens our own judgment. The obvious benefit is that the model improves. But the less obvious case: we do too.

The caveat is real, though. If the human falls into passive line editing or rubber-stamping approvals, the loop deskills rather than sharpens. The compounding only works when corrections are deliberate. Autopilot kills the signal.

The {{< term key="protege-effect" text="protégé effect" >}} tells us teaching forces deeper learning than studying. Correcting an AI is teaching. Every reject is a micro-lesson where we synthesize domain knowledge into an actionable judgment — we don't just get better at supervising the agent, we get better at the underlying work.

In claudectl, this compounds visibly. Early corrections are gut reactions: "this feels wrong." Later corrections become structured reasoning: "this targets a config path that's caused incidents before, and the session has no rollback coverage." The act of correcting the model forces us to articulate rules we've been following unconsciously for years.

Mollick's BCG study (Dell'Acqua et al., HBS Working Paper 24-013, September 2023) found directional evidence that experts extract disproportionate value from AI when they can recognize errors: "experts may be able to get the most out of AI coworkers and are likely to be able to fact-check and correct AI errors." In other contexts, novices show larger raw productivity gains. But for judgment capture, the expert's advantage is clear: the ability to articulate why the AI is wrong, precisely enough to correct it, and that ability compounds with every correction.

Shopify's VP of Engineering Farhan Thawar described the same dynamic from the production side:

> "We try to do a diff on how much the actual final update was rewritten by the human, and the AI gets smarter based on that rewriting."

The delta between AI draft and human correction is the learning signal for both parties. The model gets smarter from the correction; you get more precise about your own standards.

## Transform traces to training

The practical question though is — how do we capture this signal in a form that compounds us locally? The asset isn't the retrieval framework or the model weights, it's the judgment trace.

![Two-stage architecture: correction traces power few-shot retrieval today and LoRA fine-tuning tomorrow](/images/not-your-weights/architecture-pipeline.svg)

In claudectl, a local model (Gemma 4 4B, quantized, running on a laptop GPU) observes your interactions with frontier models and makes structured classifications: approve, deny, flag, route, terminate, spawn. When it gets a decision wrong, you correct it. That correction is logged as JSONL alongside the full context that produced it: the tool call, the session state, the project, your action, your reasoning. Over time, this log becomes a structured record of your engineering judgment across thousands of real decisions.

Today, these traces power {{< term "few-shot-retrieval" >}}. On the next similar situation, the model pulls your most relevant past decisions as in-context examples. No training required. Inference in 200-500ms. One correction is enough to shift behavior on the next similar call. The log is a file on your machine you can read, edit, grep, and version.

But few-shot retrieval has a ceiling. Local models have finite context windows. A 4B model can hold maybe 5-8 past decisions alongside the current session context. As your judgment log grows to thousands of entries, retrieval alone can't surface everything relevant. The model is pattern-matching on a narrow sample of your full expertise.

The same JSONL log that powers today's few-shot retrieval becomes tomorrow's fine-tuning dataset. The operational architecture falls into three layers:

| Layer | What lives here | Update cadence |
|---|---|---|
| **Rules and hard policy** | `cargo test` always safe, `src/config/` writes need review, spend limits | Manual; rarely changes |
| **Retrieval and episodic memory** | Few-shot examples from JSONL traces, contextual preferences | Every correction; instant |
| **Tuning and adapters** | {{< term key="lora" text="LoRA" >}} fine-tuned on stable, high-frequency patterns | Periodic batch training |

Stable patterns move down into tuning once they've been validated hundreds of times and are unlikely to change. Context-sensitive and evolving preferences stay in the retrieval layer, where they can be inspected and edited without retraining. Hard rules never get learned; they get enforced.

This is the same two-stage architecture Hinton described for {{< term "knowledge-distillation" >}}: a large, cumbersome training process optimized for extracting structure from data, followed by a compressed deployment form optimized for fast inference. Your judgment traces are the training data. The fine-tuned local model is the compressed deployment. Few-shot retrieval handles the long tail.

Personal fine-tuning pipelines (LoRA adapters trained on your own decision logs, project-specific routing between specialized adapters) may not as readily be accessible today. But what matters now is capturing the traces in a format rich enough to serve both approaches: structured JSONL with full context, not just approve/deny labels. The richer the trace, the more learning signal it carries.

## Corrections are our judgment traces

"[The Bitter Lesson](http://www.incompleteideas.net/IncIdeas/BitterLesson.html)" holds good at the population level. But for personal copilots, this is inverted: **scaled general models remain the substrate, and private judgment layers are where the specialization and value reside.**

General models provide the substrate: raw reasoning capability, broad knowledge, code generation at scale. But our corrections provide the personal signal that no amount of scaling today can replicate. It's accumulated judgment about which trade-offs matter in the domain, for the specific team, under specific constraints, and is not in any training corpus. It's in the pattern of what we've accepted and rejected across thousands of interactions.

> *"The competitive edge isn't who has the best AI. It's who has the best skills for the AI to learn." — Ethan Mollick, Mar 2026*

The human judgment in human-AI loops isn't overhead; it's the product. And when this judgment's captured in a local model, our copilot compounds without needing a human babysitter for every decision.

The claudectl numbers bear this out. At 500+ decisions, roughly **80% of tool calls route automatically**. The remaining 20% are the frontier — novel situations, ambiguous trade-offs, edge cases where context outweighs pattern. That frontier is where both the model and the human learn. Every correction pushes the autonomy boundary further out.

## Your copilot - Your skills - Your brain

The future of work question that actually matters isn't "will AI take my job." It's "what form does professional value take when AI handles most execution." My take — a practitioner + their personal copilots is what makes them valuable. Not the credentials or experience in the abstract, but the distilled system of preferences and judgment calls they've externalized into the models that work with them.

This reframes how we hire too. We're no longer hiring a senior engineer with ten years of experience. We're instead hiring a senior engineer whose copilot has their grounded engineering judgment across 10,000+ real world decisions. The copilot's learned preferences are the skills, externalized and inspectable. The engineer who has been deliberate about capturing correction traces has something the engineer who has been prompting casually does not: a compounding asset for his own brain. The portable part isn't bringing a prior employer's trained copilot intact; it's the methodology for rebuilding a judgment stack quickly in any new environment.

Karpathy's original framing was about open source as a safeguard against cognitive dependency. For cloud models, the risk is dilution; every correction improves a system that serves everyone. For local models, the dynamic inverts; every correction improves a system that serves you. If you run the weights locally, learn from your own corrections, and keep the reasoning traces on your own hardware, the brain compounds with your experience. It transfers across projects. It represents intellectual capital that no API provider can extract.

**Your weights. Your copilot. Your brain.**

{{< highlight-box >}}
Start capturing traces now. The format matters more than the model: structured JSONL with full context, not just approve/deny labels. The richer the trace, the more learning signal it carries, and the more options you have when personal fine-tuning pipelines become accessible.
{{< /highlight-box >}}
