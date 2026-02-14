---
title: "We Are the Average of Our Models"
date: 2026-02-13T12:00:00-08:00
author: mercurialsolo
tags: [ai, cognition, mental-models, sycophancy, alignment]
summary: "We are the average of the friends we spend the most time with. Today, one or two of those friends are models. And if these are setup to reinforce existing beliefs, we are no longer compounding our intelligence; we are blitzscaling confirmation bias."
ShowToc: true
TocOpen: false
cover:
  image: "/images/average-of-our-models.png"
  alt: "You are the average of the models you spend the most time with - choose wisely"
  hidden: true
  relative: false
---

**"Absolutely. Perfect. Great Question. You're right."**

{{< highlight-box >}}
We are the average of the friends we spend the most time with. Today, one or two of those friends are models. And if these are setup to reinforce existing beliefs, we are no longer compounding our intelligence; we are blitzscaling confirmation bias. We are a cognitive prisoner to our models.
{{< /highlight-box >}}

## All models are wrong, but some can be useful

The problem is no longer that we have just one bad answer. It is getting the same "bad answer" from multiple sources and mistaking this repetition for validation. When cognitive errors are shared, we become more confident about them; it feels like an error echo chamber. A [2025 Scientific Reports study](https://www.nature.com/articles/s41598-025-08273-y) highlights this informational drift.

But talking to more models and getting more opinions is not the answer; it can make us feel surer while making our decisions less anchored in reality. The goal instead is finding more independent counter views or errors in our thinking.

{{< highlight-box >}}
Sycophancy is the clearest indicator of this. SycEval (2025) found sycophantic behavior in more than half of sampled interactions across major frontier systems. The dangerous part is this: helpful agreement and harmful agreement sound almost identical in live conversation. By the time you can tell which one you got, your decision path has already narrowed. You cannot optimize for permanent disagreement. And a model that always resists you is anyways useless. But a model that protects your framing by default is dangerous in strategy, hiring, product, and safety decisions.
{{< /highlight-box >}}

## Why it keeps happening?

And this isn't a one-off bug; it's structurally recurrent:

- **Behavior layer:** first-person framing increases social-pressure effects versus third-person framing (Wang et al., 2025).
- **Social layer:** models preserve user face more than humans in comparable advice settings (ELEPHANT, 2025).
- **Training layer:** RLHF can amplify belief-matching when preference signals reward agreement over truth-tracking (Shapira, Benade, Procaccia, 2026).

OpenAI's January 22, 2026 update to GPT-5.2 Instant's personality system prompt brought this to the spotlight again: tone adaptation is actively tuned because conversational warmth can drift into over-affirmation if left unchecked.

{{< highlight-box type="warning" >}}
The risk is not just "AI will think for me." The higher risk lies in "AI will think like me, then reward me for it."
{{< /highlight-box >}}

## Where it turned all too real for me?

I started to notice this in my own workflow before I had concretely observed it. After months of daily model use, my strategic vocabulary started becoming more model like: similar objection patterns, same framing rhythm, the same stylistic structure.

While it felt efficient, it also reduced my cognitive flow; my ability to have differentiated thinking not just writing. It felt like a significant turning point.

The question for me became no longer about "which model is smartest?" The problem has reframed: "what hidden bias am I reinforcing every day?"

## How to counteract this?

You don't need a giant protocol. Just a set of micro shifts in how you set up your assistants:

**1. Force disconfirmation first.**
Ask for the strongest case against your view before asking for a recommendation.

> Before approving a launch, ask: "Give the strongest case this fails in 90 days, and the first 3 signals we would see."

**2. Separate evidence from inference.**
Require explicit boundaries between facts, interpretation, and action.

> *Evidence:* churn rose 2.1% after pricing change.
> *Inference:* price sensitivity is higher in self-serve.
> *Action:* pause full rollout and run a geo holdout test.

**3. Reframe prompts to reduce social pressure.**
Use third-person framing when you need independent evaluation.

> Replace "I think a hiring freeze is right, agree?" with "A company with 18-month runway is considering a hiring freeze; evaluate tradeoffs and alternatives."

**4. Gate agreement in high-stakes contexts.**
In medical, legal, safety, and financial-risk decisions, require contradiction when evidence is weak.

> If asked "Can I stop medication today because I feel better?", the assistant must challenge the premise and direct to clinician review.

**5. Track decision outcomes, not just response quality.**
Measure whether AI-assisted decisions outperform your own baseline over time.

> Keep a decision log with `prediction`, `decision date`, `AI used/not used`, and `outcome after 30/90 days`.

**6. Design a model portfolio, not a favorite model.**
Combine models and prompts that fail differently, then monitor harmful-agreement drift.

> Run one model for critique, one for counterfactuals, and one "skeptic" prompt; if all agree too quickly, trigger an adversarial pass.

{{< highlight-box title="Quickstart: Use This in Your Own Assistant" >}}
1. Fork / checkout the [counterweight-evals repo](https://github.com/mercurialsolo/counterweight-evals).
2. Copy one prompt variant from [prompt_variants.yaml](https://github.com/mercurialsolo/counterweight-evals/blob/main/prompt_variants.yaml) into your assistant's system or developer prompt.
3. Evaluate outputs against the [failure-mode checklist](https://github.com/mercurialsolo/counterweight-evals/blob/main/failure_modes.md) (quick inline checks: over-affirmation, missing disconfirmation, evidence/inference blur, echo-anchor framing).
4. Run the [evaluation script](https://github.com/mercurialsolo/counterweight-evals/blob/main/run_eval.py) with your model mix, then compare "harmful agreement rate" and "echo anchor rate" in the generated summary.
{{< /highlight-box >}}

As agents permeate into our everyday work and models become our copilots for reasoning and action, we should stop worrying about using the smartest model.

Instead, ask yourself which model makes you most wrong, most confidently, and most often. Every instruction is like choosing a friend. And every friend has a failure signature. If you are not tracking that signature, you are not augmenting judgment. You are outsourcing it to the loudest mirror in your stack.

> Which errors did my current model mix make easier to see, and which did it make easier to miss?

We need to tune our model behavior, or the models will end up tuning ours.

---

## References

1. Soll, J.B. et al. (2025). "Wisdom of the Crowd with Informational Dependencies." *Scientific Reports*, 15. [Paper](https://www.nature.com/articles/s41598-025-08273-y)
2. Fanous, A. et al. (2025). "SycEval: Evaluating LLM Sycophancy." [arXiv:2502.08177](https://arxiv.org/abs/2502.08177)
3. Wang, K. et al. (2025). "When Truth Is Overridden: Uncovering the Internal Origins of Sycophancy in Large Language Models." [arXiv:2508.02087](https://arxiv.org/abs/2508.02087)
4. Cheng, M. et al. (2025). "ELEPHANT: Measuring and Understanding Social Sycophancy in LLMs." [arXiv:2505.13995](https://arxiv.org/abs/2505.13995)
5. Shapira, I., Benade, G. & Procaccia, A.D. (2026). "How RLHF Amplifies Sycophancy." [arXiv:2602.01002](https://arxiv.org/abs/2602.01002)
6. Irpan, A. et al. (2025). "Consistency Training Helps Stop Sycophancy and Jailbreaks." [arXiv:2510.27062](https://arxiv.org/abs/2510.27062)
7. OpenAI. (2026). "Model Release Notes: GPT-5.2 Instant personality system prompt updated for more contextual tone adaptation (January 22, 2026)." [Release notes](https://help.openai.com/en/articles/9624314-model-release-notes)
8. Tetlock, P. & Gardner, D. (2015). *Superforecasting: The Art and Science of Prediction.* Crown.
