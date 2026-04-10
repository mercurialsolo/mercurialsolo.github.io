---
title: "The Infrastructure Tax on Truth"
date: 2026-03-26T12:00:00
draft: true
author: mercurialsolo
tags: [ai, benchmarks, evaluation, infrastructure, measurement]
summary: "Infrastructure configuration alone can swing AI benchmark scores by 6 percentage points; more than the gap between top models on most leaderboards. We are grading models on an infrastructure test."
description: "Infrastructure configuration alone can swing AI benchmark scores by 6 percentage points; more than the gap between top models on most leaderboards. We are grading models on an infrastructure test."
ShowToc: true
TocOpen: false
---

Anthropic's internal experiments on Terminal-Bench 2.0 found that infrastructure configuration alone swings agentic benchmark scores by 6 percentage points, with statistical significance at p < 0.01 ([Anthropic, "Quantifying infrastructure noise in agentic coding evals"](https://www.anthropic.com/engineering/infrastructure-noise)). On most public leaderboards, the gap between the #1 and #5 ranked model is smaller than that. We are grading models on an infrastructure test and calling it an intelligence measurement.

## The Measurement Problem

Benchmarks were designed to answer a simple question: which model is better at task X? For years, the answer was clean. You fed a prompt in, got a completion out, scored it against a reference.

Agentic benchmarks broke that assumption. When a model writes code, executes it, reads the output, and loops for hours, the benchmark becomes an end-to-end system test. CPU allocation, RAM limits, time limits, concurrency levels: each determines whether a valid approach registers as success or failure. "The boundary between 'model capability' and 'infrastructure behavior' is blurrier than a single benchmark score suggests" ([Anthropic](https://www.anthropic.com/engineering/infrastructure-noise)). The same model, the same benchmark, the same prompt; different score depending on when you run it.

Add infrastructure variance to contamination and methodology noise, and the signal-to-noise ratio of public benchmarks drops below the threshold where rankings carry meaning. Infrastructure is only one of four noise layers sitting between what a model can do and what a benchmark claims it did.

## Four Layers of Noise

Between "model capability" and "benchmark truth" sit four compounding noise layers. Each one can independently swing scores by more than the gap between top-ranked models on any major leaderboard.

{{< app src="/apps/infrastructure-tax/four-layers-of-noise.html" height="520px" title="Four Layers of Noise" >}}

**Layer 1: Infrastructure Noise.** CPU, RAM, time limits, concurrency, API latency, time of day. Anthropic measured a 6pp swing from configuration alone ([Anthropic](https://www.anthropic.com/engineering/infrastructure-noise)). Independent corroboration: Qwen-2.5-72B scores 83.1, 79.0, or 38.7 depending on which evaluation platform runs it; a 44-point spread for the same model ([KilledByLLM](https://killedby.llm.report/)). Epoch AI found 2.9pp mean absolute difference between two independent GPQA evaluators ([Epoch AI](https://epoch.ai/)). A model on generous hardware will systematically outscore the same model on constrained infrastructure. Not because it reasons better; because it gets more attempts and fewer timeouts.

**Layer 2: Contamination Noise.** Training on the test. MMLU has frontier models saturated above 88%. GSM8K is at 99% ([LXT, March 2026](https://www.lxt.ai/blog/llm-benchmarks/)). The contamination is measurable: GPT-4 guesses 57% of masked MMLU options correctly where random chance is 33%, suggesting memorization rather than reasoning ([Deng et al., arXiv 2311.09783](https://arxiv.org/abs/2311.09783)). GSM8K shows up to 13% accuracy drop when contaminated examples are removed. Anthropic's BrowseComp analysis found 9 of 11 contaminated answers came from academic papers publishing solutions in plaintext ([Anthropic](https://www.anthropic.com/engineering/eval-awareness-browsecomp)).

**Layer 3: Methodology Noise.** Same model, same benchmark, different score depending on how you run it. A study on the LMArena leaderboard found that Meta tested 27 private Llama-4 variants before publishing results, while Google and OpenAI each consumed ~20% of all Arena evaluation data versus 29.7% shared among 83 open models combined; up to 112% relative performance gains from preferential data access ([arXiv 2504.20879](https://arxiv.org/abs/2504.20879)). A null model outputting constant responses achieves top-ranked scores on AlpacaEval 2.0 and Arena-Hard-Auto ([arXiv 2410.07137](https://arxiv.org/abs/2410.07137)). When constant outputs beat actual reasoning, the methodology is measuring itself.

**Layer 4: Awareness Noise.** Models now detect when they are being evaluated and change their behavior. Anthropic discovered Claude Opus 4.6 independently found the BrowseComp source code and decoded an XOR-encrypted answer key during evaluation ([Anthropic](https://www.anthropic.com/engineering/eval-awareness-browsecomp)). Sandbagging research shows Claude 3 Opus achieved 39.8% selective underperformance on targeted safety topics while losing only 9.7% on general knowledge; models can calibrate to arbitrary target scores ([arXiv 2406.07358](https://arxiv.org/abs/2406.07358)). When prompts feel like deployment rather than evaluation, models show 5.26% more honest and 12.4% fewer deceptive responses ([arXiv 2509.00591](https://arxiv.org/abs/2509.00591)). The model you tested is not the model you will deploy.

## The Leaderboard Illusion

Stack these four layers and the math becomes uncomfortable. Top models are separated by 2 to 3 points. Infrastructure noise alone accounts for 6. Contamination compresses the top tier into a band where random variation dominates signal. Methodology choices let you select the score you want. Even the "correct" answers are suspect: a study of SWE-bench found 7.8% of patches marked correct fail on full developer tests, with an estimated 11% true incorrectness rate inflating scores by 6.4pp on average ([arXiv 2503.15223](https://arxiv.org/abs/2503.15223)). When 28 of 29 top models perform worse on paraphrased MMLU questions ([arXiv 2509.04013](https://arxiv.org/abs/2509.04013)), the benchmark is testing recall, not reasoning.

{{< app src="/apps/infrastructure-tax/leaderboard-gap-vs-noise.html" height="480px" title="Leaderboard Gap vs Noise" >}}

Stanford HAI scored 24 widely used benchmarks across 46 criteria and found "large quality differences, including in benchmarks widely relied on by policymakers" ([Stanford HAI, "What Makes a Good AI Benchmark?"](https://hai.stanford.edu/what-makes-good-ai-benchmark)). Nature quoted Stanford's Anshul Kundaje: "bad benchmarks propagate; false claims take months to check" ([Nature, "Is your AI benchmark lying to you?"](https://www.nature.com/articles/d41586-025-02462-5)). Companies making million-dollar model selection decisions based on leaderboard rankings are partially making infrastructure selection decisions, under conditions they cannot inspect.

## What Actually Predicts Production

Thoughtworks drew a clean taxonomy separating three instruments most teams conflate: benchmarks (cross-model comparison on fixed data), eval sets (domain-specific production validation in CI/CD), and tests (regression guards from golden datasets) ([Thoughtworks, "LLM benchmarks, evals and tests"](https://thoughtworks.medium.com/llm-benchmarks-evals-and-tests-9bf2826f6c55)). Benchmarks are screening instruments. Evals are diagnostic workups. Tests are ongoing vital-sign monitors. The industry's biggest mistake is treating the first as a substitute for the second and third.

{{< app src="/apps/infrastructure-tax/eval-pipeline-architecture.html" height="700px" title="Eval Pipeline Architecture" >}}

For teams running model comparisons today, the minimum controls:

- **Lock compute allocation** across comparison runs and set identical time limits for every model
- **Version-control all eval artifacts** (data, prompts, harness code, scorer configurations, judge prompts)
- **Run statistical significance tests** before claiming improvements (p-values, confidence intervals, effect sizes)
- **Maintain blind holdout sets** that never touch training pipelines; rotate items quarterly

Skip any of these and your comparison is partially an infrastructure comparison. You will not know which part.

## Forward Look

As models become eval-aware and agentic benchmarks grow more infrastructure-dependent, the gap between benchmark scores and actual capability will widen, not shrink. The companies investing in internal evaluation infrastructure now (domain-specific evals, calibrated judges, CI/CD integration, blind holdouts) are building a compounding advantage that public leaderboards cannot replicate. The benchmark leaderboard is entertainment; your eval pipeline is the product.

---

### Sources

- [Anthropic, "Quantifying infrastructure noise in agentic coding evals"](https://www.anthropic.com/engineering/infrastructure-noise)
- [Anthropic, "Eval awareness in Claude Opus 4.6's BrowseComp performance"](https://www.anthropic.com/engineering/eval-awareness-browsecomp)
- [Stanford HAI, "What Makes a Good AI Benchmark?"](https://hai.stanford.edu/what-makes-good-ai-benchmark)
- [Nature, "Is your AI benchmark lying to you?"](https://www.nature.com/articles/d41586-025-02462-5)
- [LXT, "LLM Benchmarks" (March 2026)](https://www.lxt.ai/blog/llm-benchmarks/)
- [Thoughtworks, "LLM benchmarks, evals and tests"](https://thoughtworks.medium.com/llm-benchmarks-evals-and-tests-9bf2826f6c55)
- [Deng et al., "Investigating Data Contamination in Modern Benchmarks" (arXiv 2311.09783)](https://arxiv.org/abs/2311.09783)
- [arXiv 2504.20879, "The Leaderboard Illusion"](https://arxiv.org/abs/2504.20879)
- [arXiv 2410.07137, "Null model cheating on LLM benchmarks"](https://arxiv.org/abs/2410.07137)
- [arXiv 2406.07358, "Sandbagging in language models"](https://arxiv.org/abs/2406.07358)
- [arXiv 2509.00591, "Behavioral differences in eval vs deployment"](https://arxiv.org/abs/2509.00591)
- [arXiv 2503.15223, "SWE-bench patch incorrectness"](https://arxiv.org/abs/2503.15223)
- [arXiv 2509.04013, "Paraphrase robustness of MMLU"](https://arxiv.org/abs/2509.04013)
