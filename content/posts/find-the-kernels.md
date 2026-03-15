---
title: "Find the Kernels"
date: 2026-03-15T00:00:00
lastmod: 2026-03-15T12:00:00
author: mercurialsolo
tags: [inference, kernels, GPU, systems-engineering, AI-infrastructure, moats, scale]
summary: "Model weights are open. APIs are commodity. The defensible value in the models era lives in the kernel layer, where small efficiency gains compound across GPU fleets and the talent pool is measured in hundreds."
description: "Where does defensible value live in the models era? Not in model weights or API wrappers."
ShowToc: true
TocOpen: false
cover:
  image: ""
  alt: "Find the Kernels"
  caption: ""
glossary:
  kernel: "A function launched on GPU hardware that executes across thousands of parallel threads. In AI inference, kernels implement core operations like matrix multiplication and attention."
  HBM: "High-Bandwidth Memory. The main GPU memory (80GB on H100) where model weights and KV cache live. Despite the name, it's the bottleneck relative to on-chip SRAM."
  SRAM: "Static Random-Access Memory. Fast on-chip memory (~200KB per streaming multiprocessor) that runs at near-compute speed."
  TFLOPs: "Tera Floating Point Operations per Second. A measure of GPU compute throughput."
---

In the software era, applications did wildly diverse things (auth, payments, search, analytics) so the only common abstraction was the process itself. The container became the basic unit of cloud computing. The infra to power it produced a $300B+ cloud infrastructure market.

{{< highlight-box title="The unit has moved down the stack" >}}
Transformers have reduced the base unit of computation to a small set of operations: matrix multiplication, attention, softmax, layer normalization, expert routing. The unit of optimization has moved lower down the stack. You no longer abstract at the process level; you optimize at the operation level. In the models era, the unit of computation is closer to the silicon.
{{< /highlight-box >}}

---

## Models need their Kernels

Between a model's math and the silicon sits a layer of code that determines whether inference costs $0.001 or $0.01 per token, whether latency is 50ms or 500ms, whether one GPU serves 10 or 100 concurrent users. When a transformer processes a prompt, it launches a {{< term "kernel" >}} that tiles Q, K, V matrices into blocks that fit in fast on-chip {{< term "SRAM" >}}, computes partial results, writes output back to slower {{< term "HBM" >}}. How that kernel manages memory access patterns and instruction scheduling impacts performance much more than any model architecture decision.

{{< highlight-box >}}
**Transformer inference is memory-bound, not compute-bound.** GPUs multiply matrices faster than memory can feed them data. The optimization target isn't just your FLOPs, rather how fast can you move data.
{{< /highlight-box >}}

---

## Workload shape determines Kernel design

MLPerf Inference benchmark suite tests four scenarios that capture distinct workload shapes: **Offline** (maximum throughput, all samples at once), **Server** (Poisson-distributed queries under latency SLA), **Single Stream** (minimum latency, one query at a time), and the newer **Interactive** scenario with tighter latency constraints for agentic and conversational applications.

They map directly to which kernel optimizations matter:

- **High-batch offline workloads** (document processing, batch embeddings) are compute-bound. Kernel optimization focuses on maximizing tensor core utilization, FP8/FP4 quantization, and large-tile GEMM configurations. The NVIDIA Blackwell platform holds every per-GPU MLPerf record because its 5th-gen tensor cores and native FP4 support dominate these scenarios.
- **Low-batch interactive workloads** (chatbots, code assistants, voice AI) are memory-bound. Each decode step generates one token per sequence, making arithmetic intensity extremely low. Here, FlashAttention's memory-traffic reduction, speculative decoding's parallelized verification, and PagedAttention's batch-size amplification matter most.
- **Mixed prefill/decode workloads** (real-time serving with variable prompt lengths) stress both regimes simultaneously. Disaggregated prefilling separates compute-heavy prompt processing from memory-heavy decode, routing each to differently optimized kernel configurations.

Kernel improvements now happen in months, not years. As AI apps move into the consumer and enterprise landscape, the workload also keeps shifting (longer contexts, multimodal inputs, reasoning chains, MoE routing) and each shift demands a brand new set of kernel specializations.

{{< highlight-box title="For horizontal application builders" >}}
Your workload profile is your kernel strategy. A coding assistant (long prefill, short decode, low concurrency) needs entirely different kernel trade-offs than a customer support bot (short prefill, long decode, high concurrency). Most teams run generic inference and leave 2-5x performance on the table. Profile your actual traffic: what's your prefill/decode ratio? Your p50 vs p99 sequence length? Your batch size distribution by hour? Those numbers determine whether you should optimize for FlashAttention-style memory reduction, PagedAttention-style batching, speculative decoding, or quantization. At scale, this becomes defensibility: a company that understands its workload shape well enough to select (or commission) the right kernel configuration has structurally lower cost-per-token than a competitor running defaults on the same hardware.
{{< /highlight-box >}}

---

## What innovation in the kernel looks like?

FlashAttention delivered 2-4x speedups by rethinking how attention uses GPU memory. Four generations later, FlashAttention-4 reaches **1605 {{< term "TFLOPs" >}}/s on Blackwell** (71% hardware utilization). PagedAttention cut KV cache memory waste from 60-80% to under 4%, improving throughput **2-4x**. Quantization kernels compress weights to 4-bit with 3x speedups. Speculative decoding reaches **500 tok/s on DeepSeek-V3.1**.

{{< highlight-box >}}
Each of these upgrades are the building block underwriting billion-dollar outcomes: FlashAttention is core IP behind Together AI ($12.6B); PagedAttention powers vLLM, now the default serving engine across the industry; quantization kernels enabled llama.cpp to put 70B models on consumer hardware, catalyzing the open-weight ecosystem; speculative decoding is what makes Groq's $20B NVIDIA licensing deal economically viable at scale.
{{< /highlight-box >}}

---

## Discovering kernels

Kernel discovery follows a tight loop:

{{< app src="/apps/kernel-loop.html" height="480px" title="Kernel Discovery Loop" >}}

The creative work here is restructuring tile sizes, memory access patterns, instruction ordering, fusing operations to eliminate HBM writes.

The domain has **perfect verifiability**: TFLOPs/s against theoretical hardware peak. That verifiability makes kernel optimization tractable for AI agents. Karpathy's **autoresearch** pattern (edit code, run experiment, evaluate, keep or revert, repeat) was immediately adapted for kernels. **AutoKernel** takes any PyTorch model, profiles it, extracts bottleneck operations, then runs 300+ automated experiments on Triton or CUDA C++ kernels overnight. NVIDIA demonstrated a closed-loop workflow using DeepSeek-R1 with a hardware verifier to auto-generate optimized attention kernels, achieving **100% numerical correctness on Stanford's KernelBench Level-1 problems** and 96% on Level-2 in just 15 minutes of inference-time compute per problem.

{{< highlight-box title="AI writing kernels for AI" >}}
AI models are now writing the kernels that make AI models run faster.

But the humans behind them still define the search space, set the objective function, and architect the verification infrastructure. The autoresearch loop accelerates kernel discovery; it hasn't yet replaced the insight that decides the operations to fuse or which memory access pattern to rethink about.
{{< /highlight-box >}}

---

## The new lever for scale

Inference engines (vLLM, TensorRT-LLM, SGLang) are kernel orchestrators: they select kernels, batch requests, schedule phases, choose precision, parallelize across GPUs. They sit in the middle of a value chain where **applications** consume inference, **models** define computation, and **kernels** execute on **silicon**.

Value concentrates at the kernel layer because the margins of error are razor-thin and the talent is still scarce. A misaligned memory access or suboptimal tile size means 2x slower on identical hardware. Understanding GPU memory hierarchy isn't enough; you need the insight to rethink the algorithm itself (online softmax, pingpong scheduling, asymmetric hardware pipelining). You can't yet vibe-code a CUDA kernel. You can't prompt-engineer your way to 71% hardware utilization on Blackwell. Together AI, Tri Dao's lab at Princeton, NVIDIA's CUTLASS team, a handful of engineers at Fireworks and Meta: entire industry runs on a handful of frontier talent and arcane techniques.

Hyperscalers emerged because running applications at scale was too complex to do in-house. The models era is producing **inference providers**: Together AI ($12.6B), Fireworks AI ($4B), Groq, Cerebras, Baseten ($5B), DeepInfra, SambaNova. They compete on kernel quality, hardware optimization, and serving infrastructure.

| Cloud Hyperscalers | Inference Providers |
|---|---|
| Abstracted servers + networking | Abstract GPUs + kernel optimization |
| Competed on price/performance per VM | Compete on cost/latency per token |
| Built proprietary hardware (Graviton, TPU) | Build proprietary kernels, some build custom silicon |
| Economies of scale drove margins | Kernel efficiency compounds across fleet |
| Vendor lock-in via platform services | Lock-in via optimized model serving + fine-tuning |

Together AI co-authors FlashAttention and maintains the Together Kernel collection. Fireworks was built by ex-PyTorch engineers, serving 10T+ tokens/day. Groq built entirely custom silicon. Each has a kernel-level moat. The market is already stratifying: custom silicon (Groq, Cerebras) on raw speed, GPU platforms (Together AI, Fireworks, Baseten) on flexibility, API-first (DeepInfra, Replicate) on simplicity. IaaS, PaaS, and managed services, reborn for inference.

{{< highlight-box title="The cost model" >}}
`Cost per Token = (GPU Cost per Hour) / (Tokens per Second * 3600 * Utilization)`

An H100 at ~$3/hour with baseline FP16 kernels at 50% utilization costs ~$1.66/M tokens. FlashAttention-3 + FP8 quantization doubles throughput, pushes utilization to 80%. Combined kernel optimization drops cost below $0.50/M tokens on the same hardware. Groq serves Llama 3.1 8B at $0.05/M input tokens. The gap between generic and optimized inference is **2-7x**.
{{< /highlight-box >}}

---

Yesterday, I was having a conversation around how do you find durable alpha when the underlying techniques and models are evolving so rapidly. My take, in fast-moving domains, you don't build walls; you build speedier engines.

Locate the specific leverage points in your stack where small gains compound across scale, where the domain is verifiable enough to iterate fast, and where expertise is scarce enough that the advantage holds while you accelerate. **Find the kernels.**

---

## References

1. Dao, T. et al. (2022). "FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness." [arXiv:2205.14135](https://arxiv.org/abs/2205.14135)
2. Dao, T. (2023). "FlashAttention-2: Faster Attention with Better Parallelism and Work Partitioning." [arXiv:2307.08691](https://arxiv.org/abs/2307.08691)
3. Zadouri, T. et al. (2026). "FlashAttention-4: Algorithm and Kernel Pipelining Co-Design." [Together AI](https://www.together.ai/blog/flashattention-4)
4. Kwon, W. et al. (2023). "Efficient Memory Management for LLM Serving with PagedAttention." [arXiv:2309.06180](https://arxiv.org/abs/2309.06180)
5. Tillet, P. et al. (2021). "Introducing Triton: Open-source GPU programming for neural networks." [OpenAI](https://openai.com/index/triton/)
6. Frantar, E. et al. (2022). "GPTQ: Accurate Post-Training Quantization for Generative Pre-trained Transformers." [arXiv:2210.17323](https://arxiv.org/abs/2210.17323)
7. Lin, J. et al. (2023). "AWQ: Activation-aware Weight Quantization for LLM Compression and Acceleration." [arXiv:2306.00978](https://arxiv.org/abs/2306.00978)
8. Together AI. (2025). "Best practices to accelerate inference for large-scale production workloads." [Together AI](https://www.together.ai/guides/best-practices-to-accelerate-inference-for-large-scale-production-workloads)
9. Groq. (2025). "What is a Language Processing Unit?" [Groq](https://groq.com/blog/the-groq-lpu-explained)
10. Groq. (2025). "Inside the LPU: Deconstructing Groq's Speed." [Groq](https://groq.com/blog/inside-the-lpu-deconstructing-groq-speed)
11. NVIDIA. (2026). "Tuning Flash Attention for Peak Performance in NVIDIA CUDA Tile." [NVIDIA](https://developer.nvidia.com/blog/tuning-flash-attention-for-peak-performance-in-nvidia-cuda-tile/)
12. Upadhyay, A. (2024). "The Architecture of Groq's LPU." [Coding Confessions](https://blog.codingconfessions.com/p/groq-lpu-design)
13. vLLM Blog. (2023). "vLLM: Easy, Fast, and Cheap LLM Serving with PagedAttention." [vLLM](https://blog.vllm.ai/2023/06/20/vllm.html)
14. NVIDIA. (2017). "CUTLASS: Fast Linear Algebra in CUDA C++." [NVIDIA](https://developer.nvidia.com/blog/cutlass-linear-algebra-cuda/)
15. Together AI. (2024). "Announcing Together Inference Engine 2.0." [Together AI](https://www.together.ai/blog/together-inference-engine-2)
16. IBM. (2025). "From microservices to AI agents: The evolution of application architecture." [IBM Think](https://www.ibm.com/think/insights/evolution-application-architecture)
17. Leviathan, Y. et al. (2023). "Fast Inference from Transformers via Speculative Decoding." [arXiv:2302.01318](https://arxiv.org/abs/2302.01318)
18. Cerebras. "Wafer-Scale Engine Overview." [EmergentMind](https://www.emergentmind.com/topics/cerebras-wafer-scale-engine-wse)
19. d-Matrix. (2025). "Why optimizing every layer of AI workloads is now critical." [d-Matrix](https://www.d-matrix.ai/why-optimizing-every-layer-of-ai-workloads-from-software-to-infrastructure-is-now-critical-as-apps-take-off/)
20. Pure Storage. (2025). "LPU vs GPU: What's the Difference?" [Pure Storage](https://blog.purestorage.com/purely-educational/lpu-vs-gpu-whats-the-difference/)
