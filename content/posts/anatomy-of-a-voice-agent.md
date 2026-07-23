---
title: "Anatomy of a Voice Agent"
date: 2026-06-02T10:00:00
author: mercurialsolo
tags: [voice, agents, latency, benchmarks, llm-systems, infrastructure]
summary: "Humans hand off conversational turns in ~200 ms. Production voice agents sit at 1.4 to 1.7 seconds. That gap is the problem the category is solving."
description: "Voice latency benchmarks across OpenAI Realtime, LiveKit, Vapi, Retell, Pipecat, Cerebras. Hear the difference; switch the network and listen to the dead air grow."
ShowToc: true
TocOpen: false
glossary:
  TTFA: "Time-to-first-audio. From the caller's last syllable to the moment they hear the agent's first audio chunk."
  TTFT: "Time-to-first-token. Latency an LLM takes to emit its first token after a request lands."
  inter-turn gap: "Silence between one person finishing their turn and the next starting. Stivers et al. (PNAS, 2009) put the cross-linguistic median at ~200 ms."
  speculation: "Pre-firing the LLM (and tools, retrieval, TTS) during caller speech on a stable interim transcript. Cache hit on speech_final removes LLM TTFT from the perceived latency."
---

Conversation has a measurable rhythm. [Stivers et al.](https://www.pnas.org/doi/10.1073/pnas.0903616106) timed inter-turn gaps across ten languages and put the median at about 200 ms with very low variance. That is what attention sounds like between two people who are listening to each other.

[Hamming](https://hamming.ai/resources/voice-ai-latency-whats-fast-whats-slow-how-to-fix-it) measured real production voice agents across millions of calls. The median sits at 1.4 to 1.7 seconds. The 99th-percentile tail runs 3 to 5. OpenAI's Realtime API, the loudest product in the category, [shows a 2.24-second median turn latency in independent measurement](https://navtalk.ai/en/learning-development/realtime-api-model-comparison/). (Their "<500 ms" launch number is model-only audio chunk delay, which is not anything the caller actually hears.)

That gap, from 200 ms to ~1700 ms, is the problem the category is solving.

## The shape of an agent

Before the numbers, the architecture. A voice agent is three layers: the agent (your decisions and content), the framework (the real-time turn loop), and the infrastructure underneath. The pipeline runs left-to-right inside the framework; policy stacks on top, substrate stacks below.

{{< app src="/apps/voice-agent/architecture.html" height="900px" title="Voice agent architecture diagram" >}}

## Before the LLM even fires

The 200 ms human floor and the 1500 ms cert gate are both measured from `speech_final`. The work that *detects* that moment lives on the inbound side of the architecture diagram and eats budget before the timer starts. It is also the place most production agents get wrong.

### VAD and endpointing

VAD fires on silence; the endpointing window is the wait after the last frame of speech before the system declares the turn over. Typical setting is 150–400 ms, scaled by what the slot expects (DOB or phone longer to allow digit-by-digit, yes/no shorter). Tighten the window and false finals climb because the caller gets cut off mid-thought; loosen it and the perceived latency climbs by exactly the difference. Cellular variance widens both error modes.

### Semantic turn detection

VAD-only sees a pause and declares the turn over. The caller saying "uhm... let me think... yeah, I want..." fires a false `speech_final` mid-thought. The 2025–2026 fix is a small classifier that reads recent acoustic plus text features and decides whether a silence is a real turn boundary or a disfluency.

[Smart-turn-v2](https://github.com/pipecat-ai/smart-turn) (open source, from the Pipecat team) runs ~15 ms inference. [LiveKit's end-of-turn model](https://blog.livekit.io/improved-end-of-turn-model-cuts-voice-ai-interruptions-39/) reports a 39% reduction in false interruptions at no measurable latency cost. Either is the highest-leverage single change you can make to perceived turn quality on a cascade stack today. Neither shows up in the headline TTFA number.

### Barge-in mechanics

The transport layer can flush TTS playout in under 20 ms. Whether to flush is a policy question the framework cannot answer alone. A caller's "mhm" or "yeah, yeah" is acknowledgment, not an interrupt; treating it as one makes the agent stutter mid-sentence. The barge-in detection latency in the simulator above (~100 ms on Cerebras, ~750 ms on OpenAI Realtime) is what the system takes to *decide* there is a real interrupt before the flush fires.

AEC quality is the upstream input. If the canceller is weak, the agent's own TTS leaks back through the mic as "caller voice" and the barge-in threshold has to rise to compensate, which makes legitimate interruptions feel sluggish. Telephony makes this hardest: PSTN has no client-side AEC, so the agent must subtract its own TTS server-side using the outbound audio as the reference signal.

The canonical open-source AEC is still [WebRTC AEC3](https://gitlab.freedesktop.org/pulseaudio/webrtc-audio-processing): the canceller Chrome ships, packaged as `webrtc-audio-processing` by the PulseAudio team (v2.1 on WebRTC M131 as of 2025). LiveKit's audio processing module wraps it directly; if you are inside a WebRTC stack you probably already have it. SpeexDSP's older `speex_echo` is linear-only and falls apart on real device coupling; fine for embedded targets, weak everywhere else. Neural AEC (NKF-AEC, DeepVQE) lives in research papers; nothing is packaged as a production library you can install in one line. Krisp VIVA's residual-echo handling and NVIDIA Maxine work but are NS-plus-residual rather than true AEC, and still need a clean far-end reference to do their job.

Most of the real-world AEC quality comes from getting the reference-signal timing right, not from picking a better library. Feed the AEC the outbound TTS PCM at the correct stream-delay hint and AEC3 handles 95% of the case. Get the delay hint wrong and the best canceller in the world produces audible double-talk.

### Noisy conditions

Background noise stretches STT TTFT 100–300 ms because the hypothesis takes longer to stabilise. PSTN's G.711 8 kHz codec drops the ceiling further compared to Opus 16 kHz. Noise suppression is a separate concern from AEC; it is single channel, no reference signal, and runs after AEC in the pipeline.

The 2026 SOTA options: [DeepFilterNet 3](https://github.com/Rikorose/DeepFilterNet) (Rust, Apache-2.0, ~10–20 ms latency) is the open default and ships in PipeWire filter chains, OBS plugins, and several voice-agent stacks. [Krisp VIVA 2.0](https://krisp.ai/developers/) is the commercial choice (closed source, ~15 ms algorithmic, per-minute pricing) and runs inside Pipecat Cloud and LiveKit Cloud. [RNNoise v0.2](https://github.com/xiph/rnnoise) got its first real release in April 2025 after years dormant; useful as a CPU-tiny baseline but quality is dated. [NVIDIA Maxine Audio Effects](https://docs.nvidia.com/maxine/afx/latest/) is GPU-accelerated and excellent, but the GPU dependency makes it niche on voice-agent backends already CPU-bound on STT and LLM. Each of these adds ~5–20 ms of inference and reclaims more in STT TTFT than it costs, plus lowers WER.

The second-order failure is wrong-channel VAD: people at the next table trigger false speech detection on speakerphone calls. The Cafe scenario in the simulator above shows the STT cost. What it does not show is the turns the agent fires on someone else's voice at the next table.

### Multiple people

Diarization (who said what) is mostly a post-hoc analytics concern, not a live voice-agent feature. Most production agents treat every human voice in the call as "the caller", which means two people on a speakerphone can confirm slot values for each other and book the wrong appointment. The clean fix is speaker embedding at STT time (adds ~50 ms), available in some stacks but rare in production. The pragmatic fix is to require a single-speaker contract at the start of the call and refuse to commit when voice characteristics shift mid-turn.

### Hear the failure modes

Three of the patterns above as audio. Each scenario plays once and shows what a VAD-only system would do compared to a semantic-turn or speaker-aware system on the same input.

{{< app src="/apps/voice-agent/moments.html" height="700px" title="Pre-gate moments · semantic turn, barge-in, multi-speaker" >}}

## Hear it

{{< app src="/apps/voice-agent/call-sim.html" height="900px" title="Voice agent latency · hear it" >}}

Synthesized voice, real published timings. Real-time playback puts one ms of pipeline on one ms of silence on your speakers. Cerebras + Cartesia on Wi-Fi is the only widely-available stack that currently sits near the human floor. Switch to OpenAI Realtime on 3G to hear what most callers actually experience.

## LLM TTFT is doing the damage

Five components in series. One of them, LLM time-to-first-token, accounts for most of the budget on every stack except the realtime one-shot. [Cerebras runs Llama 3.1 at 1,800 tokens per second](https://www.cerebras.ai/blog/cerebras-inference-3x-faster) on specialised hardware and lands TTFT around 100 to 200 ms. Anthropic Haiku is closer to 600, GPT-4o closer to 700, in [Daily.co's LLM benchmarks for voice](https://www.daily.co/blog/benchmarking-llms-for-voice-agent-use-cases/). That 4× swing is why a sub-second voice agent is possible on one stack and not the others.

Network is symmetric, and you do not get to fix it. WebRTC and 5G hover near zero one-way. 4G adds about 50 ms; PSTN adds 125; 3G adds 300. Most enterprise voice deploys do not control the call leg, since the caller picks the transport. Switch the network in the simulator above and the cross-stack comparison shifts with it.

## Speculation closes the gap

Stop running the LLM serially after `speech_final`. Fire it during the caller's last second of speech, on the stable interim transcript Deepgram is already streaming. Cache the response keyed on a transcript hash. On `speech_final`, look up the cache. On hit, LLM TTFT disappears from the caller's perceived latency.

In our own measurements, hit rate in clean rooms runs around 95% and a wasted Haiku speculation costs roughly $0.001 to $0.005. Cheap enough to call free in practice. The same trick applies to read-only tools, RAG retrieval, and TTS phonetic formatting. Stacked, the four together drop a 2,145 ms cold path to about 625 ms.

{{< app src="/apps/voice-agent/pipeline.html" height="540px" title="The 10-stage TTFA pipeline · cold vs warm" >}}

That warm number turns up in well-tuned LiveKit and Pipecat deployments too; it is the floor of what the speculation stack can save. LLM TTFT collapsing from 900 ms to 50 ms accounts for most of the saving.

## Every speculation ships a way to be wrong

This is the part I never see in the conference talks.

Real incident: a speculative LLM matched `"I'm looking to book a room"` for `"I'm looking to book a room at the Marriott"`. Seventeen characters of drift, under the 25-character cache-eviction threshold, cache hit, caller heard the wrong answer. The proper-noun growth guard that catches that pattern now ships in every speculation stack we run.

Side-effecting tools must never be speculatively fired. `find_appointment` is eligible; `book_appointment` is one mishear away from a double-booking. Predictive retriever pulls stale documents on false starts and evicts on >25 character interim drift. TTS formatter warm inherits the speculative LLM's mistakes by design, so they invalidate together on the same cache key.

If a teammate proposes a new speculation trick and only shows the savings, ask "and what's the worst thing that can go wrong?" The diagram has to show savings next to reliability gap, or the savings are pretending the gap is not there.

## Confirmation reads back without an LLM hop

DOB, member ID, name, appointment time. STT mishears these every day. Booking the wrong patient is the most expensive failure mode a scheduling agent has, and the one I think about the most.

Asking the LLM to confirm costs 500 to 700 ms per commit. A templated batch read-back ("Just to confirm: name X, DOB Y, phone Z. All correct?") plus a regex affirmation classifier ("yes", "yeah", "go ahead", "that's right", and combinations) runs in about 5 ms. The LLM only fires when the response is ambiguous. The gate stays the same; only the cost changes.

## Where the decisions live

Latency is one slice of the design surface. A voice agent is three layers stacked, and most boundary mistakes happen because teams put policy into the framework or move differentiation into infra.

{{< app src="/apps/voice-agent/matrix.html" height="1400px" title="Voice agent component allocation matrix" >}}

The framework should be your most swappable layer. If business logic lives there, you have coupled your moat to a replaceable component. Latency, evals, observability, and guardrails all cut across the three layers, which is why they need an owner on each layer rather than getting bolted on at the end.

## How to pick your stack

Six constraints decide most stack choices. Walk them top to bottom; the first hard answer narrows the field.

1. **Regulated domain** (HIPAA, PCI, financial advice). Forces handoff, recording consent, PII redaction, and a signed BAA or DPA. Disqualifies any provider you cannot sign with. Most managed platforms qualify; OpenAI Realtime needs scrutiny on data residency and audit logs.
2. **Caller transport**. Wi-Fi or 5G makes network roughly free. 4G adds about 100 ms RTT. PSTN or 3G adds 250 to 600 ms RTT and forces server-side AEC engineering, since there is no client-side canceller. Your latency budget compresses before you start.
3. **Time-to-deploy**. Weeks → managed (Vapi, Retell, Bland). Months → LiveKit or Pipecat reference deploy. Quarter or longer → self-hosted on Modal or your own infrastructure.
4. **Voice-infra engineering capacity**. Zero engineers → managed only, or OpenAI Realtime. One engineer → managed with tuning, or a LiveKit ref deploy. Three or more → self-host becomes defensible.
5. **Latency target**. Sub-700 ms caller-perceived → Cerebras + Cartesia is the only widely-available path today. Sub-1500 ms → any well-tuned cascade with speculation works. 1.5-2 s acceptable → managed defaults work without tuning.
6. **Domain coherence**. Single-intent IVR replacement → speech-to-speech (OpenAI Realtime, Moshi) is viable despite the latency because failure modes are bounded. Multi-turn diagnostic, agentic flows, tool-heavy work → cascade only. In 2026, speech-to-speech models are still weaker on long context and tool use.

| Your situation | Pick | Why | What you still own |
|---|---|---|---|
| Sub-second + English + premium tolerance | Cerebras + Cartesia + Deepgram | Only path to ~500 ms today | All policy, confirmation gates, eval |
| Regulated + multi-turn + Wi-Fi callers | LiveKit ref (DG + Haiku + Cartesia) | Best safety / coherence tradeoff | Handoff, speculation guards, audit logging |
| First production deploy + small team | Vapi or Retell | Time-to-deploy in weeks | Persona, flow, evals, guardrails |
| Mostly PSTN callers + scheduling agent | LiveKit + server-side AEC + PSTN bridge | Telephony needs DSP work | Barge-in tuning is hardest here |
| Single-intent IVR replacement | OpenAI Realtime or Moshi | No tool calls, bounded failure | Cost ceiling, dialogue eval |
| Outbound at scale + cost floor | Self-hosted Pipecat + Modal + smaller LLM | Per-call economics | Cold starts, SRE, eval harness |

Cross-cutting rules that override the table:

- Regulated domain → handoff is mandatory, confirmation gates on every commit. No exceptions.
- Caller network you do not control → target the median network your callers use, not the median network your test rig uses.
- Zero ops headcount → do not self-host. The first 3 a.m. outage kills the project.
- Tool calls are core to the flow → cascade with explicit speculation. Speech-to-speech tool use is still uneven.
- Cost per call is the binding constraint → smaller LLM + heavy speculation cache beats premium model + cold path.

### Use cases and what they force

The same constraints repeat by use case. Six recurring patterns:

| Use case | Hard constraints | Stack | Non-negotiables |
|---|---|---|---|
| **Clinical intake / scheduling** | HIPAA, multi-turn, distress detection, DOB and MRN entry, English+Spanish | Cascade with Haiku-class LLM; LiveKit ref or self-host | Confirmation gates, distress override on off-topic gate, supervisor handoff, recording consent |
| **Financial customer support** | PCI, fraud risk, multi-language, mostly PSTN | Cascade with managed PSTN bridge; server-side AEC; on-prem-friendly LLM | Voice biometrics or PIN re-auth, fraud-trigger handoff, signed BAA/DPA |
| **Outbound sales / lead qualification** | Cost floor, scale, single-intent often, English primarily | Self-hosted Pipecat + Modal + smaller LLM, or managed (Bland, Vapi) | Compliance dialer, opt-out detection, cost-per-minute tracking |
| **Real-time translation / interpreter** | Sub-second mandatory, streaming, no tool calls, fluency | Speech-to-speech (Moshi) or Cerebras + Cartesia | Accept the loss of tool calling; bias toward fluency over factual accuracy |
| **IVR replacement / simple routing** | Bounded intents, DTMF fallback, dependability over richness | Managed (Retell, Vapi) or OpenAI Realtime | DTMF capture, legacy IVR tree mapping, escape to a live agent |
| **Drive-thru / kiosk ordering** | Noisy environment, multilingual, bounded menu | Cascade with strong noise suppression (Krisp VIVA or DeepFilterNet 3), fast TTS | Menu confirmation read-back, multilingual STT, accent robustness eval |

Each binding constraint pulls the architecture toward a different shape: regulation toward handoff and confirmation gates, noise toward AEC and read-back, scale toward cost-floor stacks, sub-second toward specialised hardware. Match the architecture to the constraint you actually have, not the one you wish you had.

## The floor underneath

Some incidents that actually happened: an off-topic gate without a distress override closed a caller mid-crisis; a speculative LLM without a proper-noun growth check shipped a stale match to a real caller; a commit slot that bypassed read-back booked the wrong patient. The shape is the same in each: someone saved N ms and forgot to ask what happened if N ms of safety went with it.

Every "saves N ms" decision gets reviewed against "and what's the worst thing that can go wrong?" If the answer is "wrong patient" or "missed escalation", the optimisation does not ship and you go find a different N ms.

The 200 ms target is universal; the architecture that hits it is not. Pick the failure mode you can afford.

## Sources

- Stivers et al., [Universals and cultural variation in turn-taking in conversation](https://www.pnas.org/doi/10.1073/pnas.0903616106), PNAS 2009
- Hamming, [Voice AI latency: what's fast, what's slow](https://hamming.ai/resources/voice-ai-latency-whats-fast-whats-slow-how-to-fix-it)
- NavTalk, [OpenAI Realtime API model comparison](https://navtalk.ai/en/learning-development/realtime-api-model-comparison/)
- Deepgram, [Measuring streaming STT latency](https://developers.deepgram.com/docs/measuring-streaming-latency)
- Cartesia, [Sonic TTS](https://www.cartesia.ai/sonic); Gradium, [TTS latency benchmark 2026](https://gradium.ai/content/tts-latency-benchmark-2026)
- ElevenLabs, [Meet Flash](https://elevenlabs.io/blog/meet-flash)
- LiveKit, [Improved end-of-turn model](https://blog.livekit.io/improved-end-of-turn-model-cuts-voice-ai-interruptions-39/) · semantic turn detection at no latency cost
- Pipecat, [Smart-turn-v2](https://github.com/pipecat-ai/smart-turn) · open-source end-of-turn classifier (~15 ms inference)
- [WebRTC AEC3 via webrtc-audio-processing](https://gitlab.freedesktop.org/pulseaudio/webrtc-audio-processing) · canonical open-source AEC (the canceller Chrome ships, packaged for non-browser use)
- [DeepFilterNet 3](https://github.com/Rikorose/DeepFilterNet) · open-source neural noise suppression (Rust, ~10–20 ms)
- [Krisp VIVA 2.0](https://krisp.ai/developers/) · closed-source NS + voice isolation, runs inside Pipecat and LiveKit cloud
- [RNNoise](https://github.com/xiph/rnnoise) · baseline NS, freshly tagged v0.2 in 2025
- [NVIDIA Maxine Audio Effects](https://docs.nvidia.com/maxine/afx/latest/) · GPU-accelerated NS
- Daily / Pipecat, [STT benchmarks](https://www.daily.co/blog/benchmarking-stt-for-voice-agents/); Modal, [Sub-1s voice bot](https://modal.com/blog/low-latency-voice-bot)
- Retell, [Vapi vs Bland vs Retell](https://www.retellai.com/blog/vapi-vs-bland) (vendor-published)
- Cerebras, [Realtime voice translation](https://inference-docs.cerebras.ai/cookbook/agents/realtime-voice-translation), [3× faster inference](https://www.cerebras.ai/blog/cerebras-inference-3x-faster)
