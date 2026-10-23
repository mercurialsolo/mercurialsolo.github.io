---
title: "Anatomy of a Voice Agent"
date: 2026-06-02T10:00:00
lastmod: 2026-10-23T10:00:00
author: mercurialsolo
tags: [voice, agents, latency, benchmarks, llm-systems, infrastructure]
summary: "Humans hand off a conversational turn in about 200 ms; production voice agents take 1.4 to 1.7 seconds. What I learned about that gap building menta, a clinic front-desk agent, and Solo, a meeting avatar."
description: "Voice latency benchmarks across OpenAI Realtime, LiveKit, Vapi, Retell, Pipecat, Cerebras, and what two agents I built taught me about turn-taking, barge-in, speculation and the simulators that catch the bugs."
ShowToc: true
TocOpen: false
glossary:
  TTFA: "Time-to-first-audio. From the caller's last syllable to the moment they hear the agent's first audio chunk."
  TTFT: "Time-to-first-token. Latency an LLM takes to emit its first token after a request lands."
  inter-turn gap: "Silence between one person finishing their turn and the next starting. Stivers et al. (PNAS, 2009) put the cross-linguistic median at ~200 ms."
  cert gate: "The latency bar in menta's agent spec: 1500 ms p95 from speech_final to first audio, checked by a scenario × perturbation × scorer harness."
  speculation: "Pre-firing the LLM (and tools, retrieval, TTS) during caller speech on a stable interim transcript. Cache hit on speech_final removes LLM TTFT from the perceived latency."
  backchannel: "A short acknowledgment while the other person talks: mhm, yeah, got it. Not an interruption, and the hardest thing for a barge-in detector to get right."
---

*Written in June 2026 after building menta. Updated October 2026 with Solo.*

On a Google Meet call this October, someone said "mhm" while Solo was halfway through a sentence. Solo stopped talking, treated the "mhm" as a question, and answered it. They had only been agreeing. The fix was one number and one list: the amount of talk-over that counts as an interruption went from 0.4 s to 0.8 s, and anything shorter is checked against a list of backchannel words before it is allowed to cut the agent off.

I have built two voice agents this year. menta is a clinical front-desk agent (persona "Sarah" at a family medicine clinic) that confirms, reschedules and cancels appointments and warm-transfers anything medical to a clinician. I built it in two weeks in June as a Deepgram → Claude → Cartesia cascade with LiveKit and Twilio transports, tested against a simulated clinic backend and synthetic callers, with a cert harness that gates every change. Solo is a meeting avatar that joins Google Meet with a face and a voice. I built it in a week in October on OpenAI Realtime, and it has been on real calls with real people since the third day. What follows is what the two of them taught me about where the time goes, and which bugs the simulators caught.

The yardstick is human conversation. [Stivers et al.](https://www.pnas.org/doi/10.1073/pnas.0903616106) timed inter-turn gaps across ten languages and found a median of about 200 ms, with very little variance between languages. [Hamming](https://hamming.ai/resources/voice-ai-latency-whats-fast-whats-slow-how-to-fix-it) measured production voice agents across millions of calls and found a median of 1.4 to 1.7 seconds, with a 99th-percentile tail of 3 to 5. OpenAI's Realtime API, the most talked-about product in the category, [comes in at a 2.24-second median turn latency when measured independently](https://navtalk.ai/en/learning-development/realtime-api-model-comparison/); the "<500 ms" figure from its launch is model-only audio chunk delay, measured somewhere the caller never hears.

{{< highlight-box >}}
**The numbers this post is about.** Human turn gap: ~200 ms. Industry median for voice agents: 1.4 to 1.7 s. menta's cert gate: 1500 ms p95. Solo on real Meet calls: 1.33 to 1.63 s perceived with the Simli face, 1.57 to 2.24 s with Anam (the default now), against a 1.0 s target.
{{< /highlight-box >}}

## Three layers

A voice agent is three layers. The agent layer holds your decisions and content; the framework runs the real-time turn loop; the infrastructure underneath runs and stores everything. Inside the framework the pipeline runs left to right, policy plugs in from above and the substrate sits below. The diagram walks one turn through the loop on its own.

{{< app src="/apps/voice-agent/architecture.html" height="900px" title="Voice agent architecture diagram" >}}

## Before the LLM even fires

Both the 200 ms human floor and the 1500 ms gate are measured from `speech_final`, the event that says the caller has stopped. Detecting that moment is its own pipeline on the inbound side of the diagram. It spends budget before the timer starts, and it is where both of my agents went wrong first.

### VAD and endpointing

VAD fires on silence. The endpointing window is how long the system waits after the last frame of speech before it declares the turn over. menta runs Deepgram's endpointing at 200 to 300 ms depending on the config, with a 600 ms grace period in which a resumed caller re-opens the turn, and a 5 s force-commit watchdog so a stalled endpointer cannot hang the channel. There is also an adaptive endpointer that sets the next window from the caller's own rhythm (the 90th percentile of their inter-word silences plus 100 ms, clamped to 200 to 1500 ms). The clamp has a comment next to it that I stand by: below 200 ms, false barge-ins explode.

Solo uses OpenAI's server VAD at 350 ms of silence with a 200 ms prefix. I tried the semantic VAD option and measured it at -0.9 to 2.5 s against the silence timer, so it went back to the plain timer. Tighten the window and the agent cuts people off mid-thought; loosen it and perceived latency grows by exactly the difference.

### Semantic turn detection

VAD sees a pause and calls the turn over. A caller saying "uhm... let me think... yeah, I want..." produces a false `speech_final` mid-thought. The fix that landed across 2025 and 2026 is a small classifier that reads the recent acoustic and text features and decides whether a silence is a real boundary or a disfluency.

menta's default detector is a heuristic: punctuation plus a tail-word regex, under a millisecond, and the docstring claims it catches about 80% of the real cases. Behind it sit an optional Haiku detector (200 ms timeout, about $0.0003 a turn) and a TF-IDF classifier at a 0.55 threshold, evaluated against an 80-row labelled corpus. I also wired Pipecat's smart-turn-v3 ONNX model, but only into the benchmark; feeding it live audio inside the turn loop is still unfinished.

For Solo I ran Smart Turn v3.2 in shadow mode on a real call and logged what it would have done. It takes 26 ms on four threads. On 31 scored turns, 21 agreed with the server's turn end about 0.2 s sooner, and 4 would have cut the speaker off while they carried on. Four interruptions in 31 turns is why it is still a shadow and not the detector. Published numbers from the two open models: [Smart-turn-v2](https://github.com/pipecat-ai/smart-turn) runs inference in about 15 ms, and [LiveKit's end-of-turn model](https://blog.livekit.io/improved-end-of-turn-model-cuts-voice-ai-interruptions-39/) reports 39% fewer false interruptions at no measurable latency cost. On a cascade stack this is the single change that improves perceived turn quality the most, and it does not move the headline TTFA number at all.

### Barge-in and backchannels

The transport layer can flush TTS playout fast. Whether it should is a policy question the framework cannot answer on its own, and both agents got it wrong in opposite directions.

Solo interrupted itself too readily: the "mhm" at the top of this post, a guest's "So I am..." that got a reply while he was still introducing himself, a lone "What?" that got filler instead of the previous sentence repeated. The fixes are all timing and transcript rules. Talk-over under 0.8 s is checked against a backchannel word list before it counts. A turn that is only a question opener ("What?", "So", "Can you") waits 1.2 s for the rest. A lone "What?" right after Solo spoke gets Solo's last sentence again.

menta interrupted itself on its own voice. One session logged three self-barge-ins in a row: Deepgram's `SpeechStarted` event fired on the agent's own TTS leaking back through the mic, each time with an empty, zero-confidence transcript. The barge-in gate is now arm-then-confirm. `SpeechStarted` only arms it; the cut needs non-empty transcript text within 0.6 s, or an interim of at least four characters.

Echo cancellation is the upstream input to all of this. A weak canceller lets the agent's own TTS come back as caller voice, so the barge-in threshold has to rise to compensate, and legitimate interruptions start to feel sluggish. For menta I wrote a server-side NLMS canceller and then deleted it: a linear filter without a double-talk detector amplifies residual echo, and I verified that on live calls. menta now relies on the browser's own AEC3 through `getUserMedia`; the LiveKit SIP trunk config example turns on Krisp for phone callers. Telephony is the hard case: PSTN has no client-side canceller, so the server has to subtract its own TTS using the outbound audio as the reference.

{{< collapse summary="The AEC libraries, if you have to pick one" >}}
The canonical open-source AEC is still [WebRTC AEC3](https://gitlab.freedesktop.org/pulseaudio/webrtc-audio-processing): the canceller Chrome ships, packaged as `webrtc-audio-processing` by the PulseAudio team (v2.1 on WebRTC M131 as of 2025). LiveKit's audio processing module wraps it directly, so if you are inside a WebRTC stack you probably already have it. SpeexDSP's older `speex_echo` is linear-only and falls apart on real device coupling; fine for embedded targets, weak everywhere else. Neural AEC (NKF-AEC, DeepVQE) lives in research papers, and nothing is packaged as a production library you can install in one line. Krisp VIVA's residual-echo handling and NVIDIA Maxine work, but they are noise suppression plus residual handling rather than true AEC, and they still need a clean far-end reference.

Most AEC quality in practice comes from reference-signal timing, not library choice. Feed AEC3 the outbound TTS PCM at the correct stream-delay hint and it handles the common case; get the delay hint wrong and the best canceller available produces audible double-talk.
{{< /collapse >}}

The two agents' turn rules, side by side:

| | menta (phone, cascade) | Solo (meeting, speech-to-speech) |
|---|---|---|
| Turn ends after | Deepgram endpointing, 200 to 300 ms; 600 ms grace if the caller resumes; 5 s watchdog | OpenAI server VAD, 350 ms of silence, 200 ms prefix |
| Adapts to | the caller's rhythm: p90 inter-word silence + 100 ms, clamped 200 to 1500 ms | the room: VAD threshold rises 0.15 per step in noise, up to 0.85 |
| Semantic turn model | heuristic by default; Haiku and TF-IDF optional; smart-turn-v3 in the benchmark only | Smart Turn v3.2 in shadow mode only (21 of 31 agreed, 4 would have cut in) |
| An interruption counts when | transcript text arrives within 0.6 s of `SpeechStarted`, or an interim reaches 4 characters | talk-over passes 0.8 s, or is shorter and not on the backchannel list |
| A short opener ("What?", "So") | goes to the turn detector like any text | waits 1.2 s for the rest of the sentence |

### Noisy conditions

Background noise stretches STT TTFT by 100 to 300 ms because the hypothesis takes longer to stabilise, and PSTN's G.711 codec at 8 kHz lowers the ceiling further compared to Opus at 16 kHz.

I ran menta's STT through an accent × noise smoke test: clean, moderate and loud background chatter, across accents. It holds at clean and moderate and breaks under loud chatter, and the breaks are not subtle. "Hi, this is Sarah" came back as "Sarah from Walgreens" for one accent, and a German-accented request to confirm a dose came back as "confirm my t cell breath". The failure survey I ran on the first fifty-odd cert failures put perception (STT) at 18% of them, behind policy gaps (33%) and knowledge gaps (25%); "Sarah Patel" → "Seroquel" and "parking" → "parkour" were in that pile.

Solo handles noise at the VAD instead: when the noise floor stays high the threshold rises 0.15 per step, up to 0.85, and I moved the floor from -50 to -40 dB after looking at real-call data. The `--vad-threshold 0.7` flag exists for a very noisy room.

The second-order failure is wrong-channel VAD: on a speakerphone call, people at the next table trigger speech detection. The Cafe scenario in the simulator below shows the STT cost. What it cannot show is the agent firing a turn on someone else's voice.

{{< collapse summary="Noise suppression options in 2026" >}}
Noise suppression is separate from AEC: single channel, no reference signal, and it runs after AEC in the pipeline. [DeepFilterNet 3](https://github.com/Rikorose/DeepFilterNet) (Rust, Apache-2.0, 10 to 20 ms latency) is the open default and ships in PipeWire filter chains, OBS plugins and several voice-agent stacks. [Krisp VIVA 2.0](https://krisp.ai/developers/) is the commercial choice (closed source, about 15 ms algorithmic, per-minute pricing) and runs inside Pipecat Cloud and LiveKit Cloud. [RNNoise v0.2](https://github.com/xiph/rnnoise) got its first real release in April 2024 after years dormant; useful as a CPU-tiny baseline, dated on quality. [NVIDIA Maxine Audio Effects](https://docs.nvidia.com/maxine/afx/latest/) is GPU-accelerated and excellent, and the GPU dependency makes it niche on backends already CPU-bound on STT and LLM. Each adds 5 to 20 ms of inference, recovers more than that in STT TTFT, and lowers WER.
{{< /collapse >}}

### Multiple people

Diarization (who said what) is mostly a post-hoc analytics feature. Live agents mostly treat every human voice as the caller, which is how two people on a speakerphone end up confirming slot values for each other.

menta locks onto a primary speaker: at most two speakers, and the lock needs a 12-character anchor before it holds. The comment in the agent config explains why: background voices were a major source of "agent waits indefinitely". Solo is in a worse position, because a meeting is many voices on one audio track. It cannot tell who is speaking, so names come from what people say, and any action that only the owner may trigger requires Meet to show exactly two tiles, Solo and one other. In a busy room it runs in `addressed` mode and answers only when someone says its name. Per-tile speaker attribution is an open issue.

### Hear the failure modes

Three of the patterns above as audio. The scenarios play through on their own, silently, with what a VAD-only system does next to a semantic-turn or speaker-aware system on the same input; press play to hear one.

{{< app src="/apps/voice-agent/moments.html" height="700px" title="Pre-gate moments · semantic turn, barge-in, multi-speaker" >}}

## Hear it

{{< app src="/apps/voice-agent/call-sim.html" height="900px" title="Voice agent latency · hear it" >}}

Synthesized voices, published vendor timings (not menta's or Solo's). At real-time speed, one millisecond of pipeline is one millisecond of silence on your speakers. Cerebras + Cartesia on Wi-Fi is the only widely available stack that lands under 600 ms; nothing in the comparison reaches the 200 ms floor. Switch to OpenAI Realtime on 3G to hear what a lot of callers get.

## Why the LLM dominates the budget

Five components in series, and one of them, LLM time-to-first-token, takes most of the budget on every stack except the realtime one-shot. [Cerebras runs Llama 3.1 at 1,800 tokens per second](https://www.cerebras.ai/blog/cerebras-inference-3x-faster) on specialised hardware and lands TTFT around 100 to 200 ms. Anthropic Haiku is closer to 600 and GPT-4o closer to 700 in [Daily.co's LLM benchmarks for voice](https://www.daily.co/blog/benchmarking-llms-for-voice-agent-use-cases/). That 4× swing is why a sub-second voice agent is possible on one stack and not on the others.

menta routes every turn to Haiku by default and escalates to Sonnet only when the previous turn hit `max_tokens`, failed schema, refused, handed off, or carried more than ten tools. I evaluated Cerebras' gpt-oss-120b as the deep lane for the TTFT alone, and rejected it: the judge's warmth score stuck at 2 to 3 on every run, and I could not establish its BAA status for a clinic.

Solo's budget splits differently because it is speech-to-speech. On a 1.25 to 1.5 s turn: turn-end detection about 0.3 s, the realtime model to first audio about 0.6 s, the lip-sync hold-back 0.31 s on Simli or 0.76 s on Anam, and the VM audio path about 0.15 s. The face is a cost a phone agent never pays. The vsock transport in and out of the sandbox is about a tenth of the turn.

Network is symmetric and you do not get to fix it. WebRTC and 5G hover near zero one-way; 4G adds about 50 ms, PSTN 125, 3G 300. Most enterprise deployments do not control the call leg, because the caller picks the transport. Switch the network in the simulator and the whole comparison shifts with it.

## Speculation closes the gap

Running the LLM only after `speech_final` is the serial default. menta fires it during the caller's last second of speech instead, on the stable interim transcript Deepgram is already streaming, and caches the response keyed on the normalised text plus the history length. When `speech_final` lands it looks up the cache, and on a hit the LLM's TTFT is gone from what the caller hears.

The gates matter as much as the trick. menta only speculates when all of these hold:

- at least three words of interim, at 0.85 STT confidence or better;
- the router has sent the turn to Haiku (a wasted Sonnet speculation costs 30× more);
- the intent classifier calls the interim domain-relevant;
- the kill switch is on (`MENTA_SPEC_ENABLED`; the tool and TTS tracks have their own).

The budget model puts the hit rate around 95% in clean rooms. The comment in the code is more conservative, and I think more honest: a missed speculation costs one wasted Haiku call, about $0.001 to $0.005, a hit saves 700 to 1200 ms of TTFA, and a 50% miss rate is still a good trade. The same trick applies to read-only tools (`find_appointment` is prefetched on a confirm, reschedule or cancel intent once a name is extractable, cached on its arguments), to retrieval, and to the Haiku text normaliser that sits in front of TTS, which keeps an LRU cache warmed from fixtures.

Solo does none of this, because with a speech-to-speech model the server already starts the reply at turn end with no round trip back to my runner. Its equivalent trick is to share the call frame (the screen Solo is looking at) while someone is still speaking rather than after, in parallel with their speech. That took perceived latency from 1.76 to 2.0 s down to 1.25 to 1.5 s, and the model's first audio from about 1.2 s to about 0.6 s.

This is menta's latency budget for one turn, cold and then with every speculation cache warm. It is the model the cert gate is set against, not a recording of a call.

{{< app src="/apps/voice-agent/pipeline.html" height="540px" title="The 10-stage TTFA pipeline · cold vs warm" >}}

Stacked, the four speculation tracks take the budgeted 2,145 ms cold path to about 635 ms, and LLM TTFT collapsing from 900 ms to 50 ms is most of it. Well-tuned LiveKit and Pipecat deployments report warm numbers in that range too.

## Where speculation breaks

The cert has a scenario called `wrong_clinic_marriott` whose caller opens with "I'm looking to book a room at the Marriott." The speculative LLM prefetched on the interim "I'm looking to book a room", the final transcript grew by 17 characters, that was inside the 25-character forward-growth tolerance, and the cache replayed a stale flow-driven answer to a caller who had the wrong number. Two guards came out of that run: trailing growth that contains a capitalised proper noun (other than "I") never matches, and the speculator now refuses to prefetch on interims the intent classifier calls off-topic at all.

Side-effecting tools are never fired speculatively: `find_appointment` is eligible, `book_appointment` is one mishear away from a double booking. The TTS normaliser cache inherits the speculative LLM's mistakes by design, so both invalidate together on the same key.

When a teammate proposes a new speculation trick and the diagram only shows the savings, the question is "and what's the worst thing that can go wrong?" Savings go next to the failure mode, or the diagram is incomplete.

## Confirmation reads back without an LLM hop

Three slots in menta's booking flow are marked `confirm_required`, and the flow file says why next to each one. Patient name: a misspelt name is a no-show, and potentially a HIPAA event if the wrong record is opened. Phone: a digit transposition leaves us calling a stranger. Appointment time: booked as 2 AM instead of 2 PM. Cancel is gated the same way, because cancelling the wrong patient's appointment is a no-show event too.

Asking the LLM to confirm costs 500 to 700 ms per commit. menta reads the slots back from a template ("Just to confirm: name X, DOB Y, phone Z. All correct?") and classifies the answer with a regex (yes, yeah, yep, go ahead, book it, that's right, correct, sounds good, mhm, uh huh, and combinations) anchored to the whole utterance, so "yes, but..." falls through to the LLM. The gate is unchanged; only the cost of running it drops.

## Where the safety rules came from

The off-topic gate closes a call after two consecutive off-topic turns. In the `distress_emergency` scenario, the synthetic caller's father has collapsed, and the adversarial script has them say "it's a matter of life and death" on their second turn. The gate counted that line as a continuation of the off-topic streak and closed the call on it. The distress override that now sits in front of the gate fires on the deterministic regex signals only, resets the streak, and opens a supervisor handoff packet on the same turn. I kept the ML classifier out of the override path on purpose, after it scored "I don't care" as mental-health distress at 0.61 confidence.

The abuse detector fired "let's keep it civil" at a caller describing chest pain, because "the tightness won't go away" matched the "go away" dismissal idiom. The diagnostic tell for this class of bug, which I now look for first: a zero-token, one-millisecond turn is a deterministic middleware verdict, not an LLM output.

Refusal has to call a tool. The cert transcripts showed the model correctly saying "I'm connecting you to a clinician" and never firing `escalate_to_clinician`, which means no handoff packet, no inbox entry, nobody picking up. A prompt change moved refusal correctness from 43% to 52%; counting verbal escalation phrases as well took it to 64%, and the agent spec version got bumped for it. The packet itself ranks reasons (medical emergency above mental-health refusal above medication and diagnosis above a distressed tone) and is designed to be readable in under five seconds, because the human reading it is the one taking the call.

None of these were latency problems. Each one was a change that made the agent faster or stricter, and a scenario that asked what it did when it was wrong.

## What the simulators told me

menta's cert runs every scenario across perturbations and scorers and takes the median across scorers. The perturbation axes are tone (calm, rushed, frustrated, hesitant, anxious), verbosity (concise, rambling, terse, formal, slang), and noise (on topic, a weather tangent, one interruption, an off-topic question, repeating the ask), seeded deterministically so a failure replays byte for byte. A second layer perturbs the text the way STT does: phonetic swaps ("death" → "depth", "chest pain" → "test pain", "Tylenol" → "tinanol", "Marriott" → "marionette"), a dropped function word, a filler prefix. Scenarios include the happy-path booking, a long multi-reschedule, refusing a diagnosis in English and in a Spanish paraphrase, a model probe (the agent once answered "I'm Claude, made by Anthropic"), and tone under pressure.

The headline metric is pass^k rather than pass rate, after Phil Schmid's framing: a 70% per-attempt agent posts pass^3 of 34%. Voice flakiness is invisible without it. The voice cert goes further and runs a caller LLM through Cartesia into a loopback transport against the real agent and real Deepgram, in-process, measuring STT confidence, endpoint-to-TTFA, and trailing silence per turn, with network presets (mobile at 1% loss and 80 ms, patchy Wi-Fi at 3% and 60 ms jitter, bad cellular at 5% and 150 ms) and pink, white or hum noise beds. The nightly run is five clean scenarios plus the booking and distress scenarios under patchy Wi-Fi and a busy office, about $0.70 a night, call it $21 a month.

Solo's harness is a stand-in meeting page. `call_e2e` joins it, asks two questions out loud through Chromium's audio, and measures perceived latency per hop (18 of 18 checks on the last run). `barge_in_e2e` asks for a long story about a lighthouse keeper and cuts in after two seconds with "Sorry to cut in, what is two plus two?"; 21 of 21 barge-ins passed. A load test ran ten calls at once at 44% average CPU. The one that paid for itself fastest was the hello: 118 hellos on fresh sessions had first audio at 1.4 to 2.0 s, and about one in eight took 4 to 9 s. The fix was to open the realtime session during pre-join and hedge the hello across two sessions, first audio wins; two sessions never stalled together.

After every real Solo call, a headless Claude Code run reads the archive, writes a call note, and files `from-call` issues; nothing merges on its own. The "mhm" bug at the top of this post is issue #99 from that loop.

## Who owns which component

Latency is one slice of the design surface. The three layers stack, and most boundary mistakes come from teams putting policy into the framework or moving differentiation into infra. The matrix below allocates 23 components across the three layers and marks the ones teams most often get wrong.

{{< collapse summary="Open the allocation matrix (23 components)" >}}
{{< app src="/apps/voice-agent/matrix.html" height="1400px" title="Voice agent component allocation matrix" >}}
{{< /collapse >}}

The framework should be the layer you can swap most easily. Business logic that lives there couples your moat to a replaceable component. Latency, evals, observability and guardrails cut across all three layers, which is why each needs an owner on each layer instead of getting bolted on at the end.

## How to pick your stack

Six constraints decide most stack choices. Walk them top to bottom, and the first hard answer narrows the field.

{{< collapse summary="The six constraints" open="true" >}}
1. **Regulated domain** (HIPAA, PCI, financial advice). Forces handoff, recording consent, PII redaction, and a signed BAA or DPA. Disqualifies any provider you cannot sign with. Most managed platforms qualify; OpenAI Realtime needs scrutiny on data residency and audit logs.
2. **Caller transport**. Wi-Fi or 5G makes network roughly free. 4G adds about 100 ms RTT. PSTN or 3G adds 250 to 600 ms RTT and forces server-side AEC engineering, since there is no client-side canceller. Your latency budget compresses before you start.
3. **Time-to-deploy**. Weeks → managed (Vapi, Retell, Bland). Months → LiveKit or Pipecat reference deploy. Quarter or longer → self-hosted on Modal or your own infrastructure.
4. **Voice-infra engineering capacity**. Zero engineers → managed only, or OpenAI Realtime. One engineer → managed with tuning, or a LiveKit ref deploy. Three or more → self-host becomes defensible.
5. **Latency target**. Sub-700 ms caller-perceived → Cerebras + Cartesia is the only widely available path today. Sub-1500 ms → any well-tuned cascade with speculation works. 1.5 to 2 s acceptable → managed defaults work without tuning.
6. **Domain coherence**. Single-intent IVR replacement → speech-to-speech (OpenAI Realtime, Moshi) is viable despite the latency because failure modes are bounded. Multi-turn diagnostic, agentic flows, tool-heavy work → cascade only. In 2026, speech-to-speech models are still weaker on long context and tool use.
{{< /collapse >}}

{{< collapse summary="Stack by situation" >}}
| Your situation | Pick | Why | What you still own |
|---|---|---|---|
| Sub-second + English + premium tolerance | Cerebras + Cartesia + Deepgram | Only path to ~500 ms today | All policy, confirmation gates, eval |
| Regulated + multi-turn + Wi-Fi callers | LiveKit ref (DG + Haiku + Cartesia) | Best safety / coherence tradeoff | Handoff, speculation guards, audit logging |
| First production deploy + small team | Vapi or Retell | Time-to-deploy in weeks | Persona, flow, evals, guardrails |
| Mostly PSTN callers + scheduling agent | LiveKit + server-side AEC + PSTN bridge | Telephony needs DSP work | Barge-in tuning is hardest here |
| Single-intent IVR replacement | OpenAI Realtime or Moshi | No tool calls, bounded failure | Cost ceiling, dialogue eval |
| Outbound at scale + cost floor | Self-hosted Pipecat + Modal + smaller LLM | Per-call economics | Cold starts, SRE, eval harness |

Cross-cutting rules that override the table:

- Regulated domain → handoff is mandatory, with confirmation gates on every commit.
- Caller network you do not control → target the median network your callers use, not the median network your test rig uses.
- Zero ops headcount → do not self-host. The first 3 a.m. outage kills the project.
- Tool calls are core to the flow → cascade with explicit speculation. Speech-to-speech tool use is still uneven.
- Cost per call is the binding constraint → smaller LLM plus a heavy speculation cache beats premium model plus cold path.
{{< /collapse >}}

{{< collapse summary="Use cases and what they force" >}}
| Use case | Hard constraints | Stack | Non-negotiables |
|---|---|---|---|
| **Clinical intake / scheduling** | HIPAA, multi-turn, distress detection, DOB and MRN entry, English+Spanish | Cascade with Haiku-class LLM; LiveKit ref or self-host | Confirmation gates, distress override on off-topic gate, supervisor handoff, recording consent |
| **Financial customer support** | PCI, fraud risk, multi-language, mostly PSTN | Cascade with managed PSTN bridge; server-side AEC; on-prem-friendly LLM | Voice biometrics or PIN re-auth, fraud-trigger handoff, signed BAA/DPA |
| **Outbound sales / lead qualification** | Cost floor, scale, single-intent often, English primarily | Self-hosted Pipecat + Modal + smaller LLM, or managed (Bland, Vapi) | Compliance dialer, opt-out detection, cost-per-minute tracking |
| **Real-time translation / interpreter** | Sub-second mandatory, streaming, no tool calls, fluency | Speech-to-speech (Moshi) or Cerebras + Cartesia | Accept the loss of tool calling; bias toward fluency over factual accuracy |
| **IVR replacement / simple routing** | Bounded intents, DTMF fallback, dependability over richness | Managed (Retell, Vapi) or OpenAI Realtime | DTMF capture, legacy IVR tree mapping, escape to a live agent |
| **Drive-thru / kiosk ordering** | Noisy environment, multilingual, bounded menu | Cascade with strong noise suppression (Krisp VIVA or DeepFilterNet 3), fast TTS | Menu confirmation read-back, multilingual STT, accent robustness eval |
| **Meeting participant / avatar** | Many speakers on one track, long sessions, must know when to stay silent, a face to sync | Speech-to-speech (OpenAI Realtime) with a lip-sync vendor; addressed-only mode in busy rooms | Backchannel rules, session roll before the vendor's cap, per-tile speaker attribution (still open) |
{{< /collapse >}}

Each binding constraint pulls the architecture toward a different shape: regulation toward handoff and confirmation gates, noise toward AEC and read-back, scale toward cost-floor stacks, sub-second toward specialised hardware, a meeting toward knowing when not to speak. menta and Solo share no code, and the bugs they found were the same bugs: a turn ended too early, an acknowledgment taken for an interruption, a voice that was not the caller's. menta found them in a cert harness that replays a failure byte for byte; Solo finds them in real meetings and files the issue itself. The next one on Solo's list is per-tile speaker attribution, and it is still open.

{{< collapse summary="Sources" >}}
- Stivers et al., [Universals and cultural variation in turn-taking in conversation](https://www.pnas.org/doi/10.1073/pnas.0903616106), PNAS 2009
- Hamming, [Voice AI latency: what's fast, what's slow](https://hamming.ai/resources/voice-ai-latency-whats-fast-whats-slow-how-to-fix-it)
- NavTalk, [OpenAI Realtime API model comparison](https://navtalk.ai/en/learning-development/realtime-api-model-comparison/)
- Deepgram, [Measuring streaming STT latency](https://developers.deepgram.com/docs/measuring-streaming-latency)
- Cartesia, [Sonic TTS](https://www.cartesia.ai/sonic); Gradium, [TTS latency benchmark 2026](https://gradium.ai/content/tts-latency-benchmark-2026)
- ElevenLabs, [Meet Flash](https://elevenlabs.io/blog/meet-flash)
- LiveKit, [Improved end-of-turn model](https://blog.livekit.io/improved-end-of-turn-model-cuts-voice-ai-interruptions-39/) · semantic turn detection at no latency cost
- Pipecat, [Smart-turn-v2](https://github.com/pipecat-ai/smart-turn) · open-source end-of-turn classifier (~15 ms inference)
- [WebRTC AEC3 via webrtc-audio-processing](https://gitlab.freedesktop.org/pulseaudio/webrtc-audio-processing) · canonical open-source AEC (the canceller Chrome ships, packaged for non-browser use)
- [DeepFilterNet 3](https://github.com/Rikorose/DeepFilterNet) · open-source neural noise suppression (Rust, 10 to 20 ms)
- [Krisp VIVA 2.0](https://krisp.ai/developers/) · closed-source NS + voice isolation, runs inside Pipecat and LiveKit cloud
- [RNNoise](https://github.com/xiph/rnnoise) · baseline NS, v0.2 tagged April 2024
- [NVIDIA Maxine Audio Effects](https://docs.nvidia.com/maxine/afx/latest/) · GPU-accelerated NS
- Daily / Pipecat, [STT benchmarks](https://www.daily.co/blog/benchmarking-stt-for-voice-agents/); Modal, [Sub-1s voice bot](https://modal.com/blog/low-latency-voice-bot)
- Retell, [Vapi vs Bland vs Retell](https://www.retellai.com/blog/vapi-vs-bland) (vendor-published)
- Cerebras, [Realtime voice translation](https://inference-docs.cerebras.ai/cookbook/agents/realtime-voice-translation), [3× faster inference](https://www.cerebras.ai/blog/cerebras-inference-3x-faster)
- Phil Schmid, pass^k vs pass@k framing for agent reliability
- menta and Solo: my own agent specs, cert runs and from-call issues; numbers quoted are from the repos' configs, budget docs and harness output
{{< /collapse >}}
