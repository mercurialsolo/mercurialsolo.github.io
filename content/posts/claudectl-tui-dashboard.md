---
title: "claudectl: Building a TUI Dashboard for AI Coding Agents in Rust"
date: 2026-04-15T00:00:00+05:30
author: mercurialsolo
tags: [rust, tui, claude, ai-agents, ratatui, monitoring]
summary: "A deep technical walkthrough of claudectl, a sub-1MB Rust binary that monitors and manages multiple Claude Code sessions. Covers incremental JSONL parsing, multi-signal status inference, terminal multiplexer integration, and the design decisions behind keeping the dependency tree minimal."
description: "How to build a TUI dashboard in Rust that monitors AI coding agents. Covers session discovery, incremental JSONL parsing, multi-signal status inference via CPU + transcript heuristics, terminal integration across 9 emulators, and why you don't need an async runtime."
ShowToc: true
TocOpen: false
glossary:
  ratatui: "A Rust library for building terminal user interfaces, successor to tui-rs."
  crossterm: "A pure-Rust terminal manipulation library providing cross-platform terminal control."
  jsonl: "JSON Lines format where each line is a valid JSON object, commonly used for streaming structured logs."
  stop-reason: "In Claude's API, the reason a model stopped generating. 'end_turn' means it finished; 'tool_use' means it called a tool."
  serde: "The standard Rust serialization/deserialization framework. Derives Serialize and Deserialize traits via proc macros."
  tokio: "The most widely used async runtime for Rust, providing multi-threaded task scheduling, I/O, and timers."
  LTO: "Link-Time Optimization — allows the compiler to optimize across crate boundaries during linking, reducing binary size."
---

Running 3-5 Claude Code sessions across different repos is a common pattern for anyone who's moved past "try the AI thing" into "this is how I work now." The problem surfaces fast: you're alt-tabbing between terminal windows, missing permission prompts that block work, losing track of which session just burned $8 on a context-stuffed Opus call, and guessing whether that quiet terminal is thinking or stuck.

There's no unified view. Claude Code sessions are independent processes, each with its own {{< term "JSONL" >}} transcript, its own PID, its own terminal tab. The information exists; it's just scattered across your filesystem and process table.

claudectl is a single-binary TUI that collects all of it into one place: live status, cost, token usage, model, context window percentage, and elapsed time per session. Built with {{< term "ratatui" >}} + {{< term "crossterm" >}}, 6 runtime dependencies, release binary under 1 MB, startup under 50ms. No async runtime. `cargo install claudectl` and you're running.

This post walks through the Rust internals: how session discovery works, why incremental JSONL parsing matters, the multi-signal status inference problem, and the design decisions that kept the binary small and the architecture synchronous.

<script src="https://asciinema.org/a/bovJrUq2vEmC08NU.js" id="asciicast-bovJrUq2vEmC08NU" async data-autoplay="true" data-loop="true" data-speed="1.5"></script>

## Session Discovery: Reading Claude's Filesystem Layout

Claude Code writes a JSON file per active session to `~/.claude/sessions/`. Each file is small:

```json
{
  "pid": 42381,
  "sessionId": "a1b2c3d4-e5f6-...",
  "cwd": "/Users/me/projects/api-server",
  "startedAt": 1713168000
}
```

Discovery is a directory scan with `fs::read_dir`, filtering for `.json` extensions and deserializing each file into a `RawSession`:

```rust
#[derive(Debug, Deserialize)]
pub struct RawSession {
    pub pid: u32,
    #[serde(rename = "sessionId")]
    pub session_id: String,
    pub cwd: String,
    #[serde(rename = "startedAt")]
    pub started_at: u64,
}
```

The interesting part is JSONL path resolution. Claude stores conversation transcripts under `~/.claude/projects/{slug}/{sessionId}.jsonl`, but the mapping isn't always 1:1. A session started with `--resume` writes to the resumed session's JSONL, not its own. So claudectl resolves paths with a three-priority fallback:

```rust
pub fn resolve_jsonl_paths(sessions: &mut [ClaudeSession]) {
    for session in sessions.iter_mut() {
        let slug = cwd_to_slug(&session.cwd);
        let project_dir = projects_dir().join(&slug);

        // Priority 1: session's own ID
        let own_path = project_dir.join(format!("{}.jsonl", session.session_id));
        if own_path.exists() {
            session.jsonl_path = Some(own_path);
            continue;
        }

        // Priority 2: --resume UUID from command args
        if let Some(resume_id) = extract_resume_uuid(&session.command_args) {
            let resume_path = project_dir.join(format!("{resume_id}.jsonl"));
            if resume_path.exists() {
                session.jsonl_path = Some(resume_path);
                continue;
            }
        }

        // Priority 3: most recently modified .jsonl in the project dir
        session.jsonl_path = find_latest_jsonl(&project_dir);
    }
}
```

{{< highlight-box title="Gotcha #1" >}}
You need the process's command-line args before resolving JSONL paths, because the `--resume` UUID lives in the args. claudectl calls `ps -o pid=,tty=,%cpu=,rss=,command=` first, parses out the args, then resolves transcripts. Order matters.
{{< /highlight-box >}}

{{< highlight-box title="Gotcha #2" >}}
The `cwd_to_slug` function has to match Claude Code's own slug algorithm exactly. Get it wrong and you're looking at the wrong project directory entirely. Claude uses a path-hashing scheme that replaces `/` with `-`; reverse-engineering that mapping took more time than the rest of discovery combined.
{{< /highlight-box >}}

## Incremental JSONL Parsing: Never Reread the File

A multi-hour Claude session can produce megabytes of {{< term "JSONL" >}}. Parsing all of it every 2 seconds is the kind of waste that compounds silently until your TUI stutters and you blame ratatui. claudectl tracks a `jsonl_offset` per session (the byte position of the last read) and seeks directly to it:

```rust
pub fn update_tokens(session: &mut ClaudeSession) {
    // ... open file, get file_len ...

    if session.jsonl_offset > file_len {
        // File was truncated (new session reusing the path); reset
        session.jsonl_offset = 0;
        session.own_input_tokens = 0;
        session.own_output_tokens = 0;
        // ...
    }

    if session.jsonl_offset < file_len {
        file.seek(SeekFrom::Start(session.jsonl_offset))?;
        let reader = BufReader::new(&file);

        for line in reader.lines() {
            // parse only new lines...
        }

        session.jsonl_offset = file_len;
    }
}
```

The seek-to-offset pattern is simple but has a subtle edge case: file truncation. If a user starts a new session that reuses the same JSONL path, the file shrinks. `offset > file_len` catches this and resets all token accumulators. Without this check, the seek would land past EOF and silently return zero lines, leaving stale token counts frozen on screen.

Each JSONL line is a transcript event. The parser extracts:

- **Message role** (assistant vs. user) and **stop_reason** (end_turn, tool_use)
- **Token usage**: input, output, cache_read, cache_creation (all tracked separately because pricing differs per tier)
- **Tool use blocks**: tool name and input, used for rule-based auto-actions
- **Model identifier**: extracted and shortened (e.g., `claude-opus-4-6-20260401` -> `opus-4.6`)

{{< highlight-box title="Design Decision" >}}
claudectl doesn't parse the full semantic content of messages. It only needs the structural metadata. This keeps the parser fast and avoids coupling to Claude's message format beyond the envelope fields.
{{< /highlight-box >}}

{{< highlight-box title="Gotcha #3" >}}
Claude Code sometimes writes assistant messages with `stop_reason: null` when a `tool_use` block is awaiting user approval. The permission prompt hasn't been answered yet, so the API call returned without a clean {{< term "stop-reason" >}}. claudectl infers it from the content blocks:
{{< /highlight-box >}}

```rust
let has_tool_use = message.content.iter()
    .any(|b| matches!(b, TranscriptBlock::ToolUse { .. }));
if has_tool_use {
    last_stop_reason = "tool_use".to_string();
} else {
    last_stop_reason.clear();
}
```

This kind of defensive inference is where most of the debugging time went. The JSONL format is an internal implementation detail of Claude Code, not a stable API. Every edge case you handle today might change tomorrow.

## Multi-Signal Status Inference: The Hard Problem

Status is the column users look at first, and the one that's hardest to get right. There's no single "status" field anywhere in Claude Code's output; you have to triangulate it from signals that each tell a partial truth.

The `infer_status` function combines five signals in a strict precedence order:

```rust
pub fn infer_status(
    session: &mut ClaudeSession,
    last_msg_type: &str,
    last_stop_reason: &str,
    is_waiting_for_task: bool,
) {
    // Signal 1: CPU is the strongest real-time indicator.
    // If the process is burning CPU, it's processing
    // regardless of what the JSONL says (JSONL can lag).
    if session.cpu_percent > 5.0 {
        session.status = SessionStatus::Processing;
        return;
    }

    // Signal 2: Explicit waiting_for_task event from transcript
    if is_waiting_for_task {
        session.status = SessionStatus::NeedsInput;
        return;
    }

    // Signal 3: assistant + end_turn = done, waiting for user
    if last_msg_type == "assistant" && last_stop_reason == "end_turn" {
        let age_mins = /* time since last message */ ;
        if age_mins > 10 {
            session.status = SessionStatus::Idle;
        } else {
            session.status = SessionStatus::WaitingInput;
        }
        return;
    }

    // Signal 4: assistant + tool_use + low CPU + stale = permission prompt
    if last_msg_type == "assistant" && last_stop_reason == "tool_use" {
        if session.cpu_percent < 2.0 && age_secs > 5 {
            session.status = SessionStatus::NeedsInput;
        } else {
            session.status = SessionStatus::Processing;
        }
        return;
    }

    // Signal 5: user message sent, Claude hasn't responded
    if last_msg_type == "user" {
        session.status = SessionStatus::Processing;
        return;
    }

    session.status = SessionStatus::Idle;
}
```

Why CPU as the highest-priority signal? Because JSONL writes are not real-time. Claude Code buffers transcript entries; there's a lag between the model generating tokens and the JSONL line appearing on disk. CPU doesn't lag. If `ps` reports >5% CPU, the process is working, period.

{{< highlight-box title="Gotcha #4" >}}
Permission prompts are invisible in the transcript. When Claude wants to run `rm -rf` and the user hasn't approved it, the last JSONL entry is an assistant message with `stop_reason: tool_use`. Nothing else gets written until the user acts. The only way to detect this: low CPU (<2%) combined with a `tool_use` stop reason that's more than 5 seconds old. This heuristic has false positives (slow API responses look similar) but in practice it's reliable enough.
{{< /highlight-box >}}

**CPU smoothing**: Raw `ps` CPU readings are noisy. A single sample can show 0% between context switches even when the process is active. claudectl keeps a 3-sample rolling average:

```rust
session.cpu_history.push(cpu);
if session.cpu_history.len() > 3 {
    session.cpu_history.remove(0);
}
session.cpu_percent =
    session.cpu_history.iter().sum::<f32>() / session.cpu_history.len() as f32;
```

A `VecDeque` would be more idiomatic here, but `Vec` with `remove(0)` on 3 elements is fast enough that the allocation overhead of switching doesn't matter. Boring code wins.

## Why No Async Runtime

The reflexive Rust instinct is to reach for {{< term "tokio" >}}. Resist it. claudectl polls every 2 seconds. The polling loop does: `ps` for process info, `seek` + `read` for JSONL deltas, and {{< term "ratatui" >}} rendering. Total work per tick: under 10ms for a dozen sessions.

Pulling in `tokio` or `async-std` would add 2-3 MB to the binary, increase compile time, and complicate the control flow for zero practical benefit. The event loop is `crossterm::event::poll` with a timeout, followed by synchronous data refresh. Hooks fire via `Command::spawn()` (non-blocking on the OS level) without needing an async executor:

```rust
let _ = Command::new("sh")
    .args(["-c", &cmd])
    .stdin(Stdio::null())
    .stdout(Stdio::null())
    .stderr(Stdio::null())
    .spawn();
```

Spawn and forget. The TUI never waits for hook completion.

{{< highlight-box title="Design Principle" >}}
Async is justified when you're waiting on I/O that would block the thread (network calls, database queries). When your I/O is local filesystem reads under 1ms, synchronous code is simpler and faster.
{{< /highlight-box >}}

## Keeping the Binary Under 1 MB

Every dependency is a tax on binary size, compile time, and supply chain surface. Six runtime dependencies, and each one earns its place: `ratatui`, `crossterm`, {{< term "serde" >}}, `serde_json`, `clap`, `libc` + `ctrlc`. The release profile:

```toml
[profile.release]
opt-level = 3
lto = "thin"
codegen-units = 1
strip = true
panic = "abort"
```

Key choices that kept the dependency tree small:

- **`ps` instead of `sysinfo`**: The `sysinfo` crate is excellent but pulls in platform-specific FFI bindings and adds ~500KB. A single `ps` call with parsed stdout gives CPU, memory, TTY, and command args. Trade-off: one process spawn per tick instead of in-process syscalls. For a 2-second polling interval, this is noise.

- **`libc` for process signals**: Sending SIGTERM to a session (`kill` in the rules engine) uses `libc::kill()` directly. No need for a process management crate.

- **No `dirs` crate**: Home directory resolution is `std::env::var_os("HOME")` with a `/tmp` fallback. The `dirs` crate handles Windows, XDG, and edge cases; claudectl only needs `$HOME`.

- **`clap` with derive**: This is the largest dependency by transitive count, but `clap` earns its weight. The CLI surface (17 flags, subcommands for `--doctor`, `--run`, `--history`) would be painful to hand-roll.

`lto = "thin"` over `lto = "fat"`: thin {{< term "LTO" >}} gets ~90% of fat LTO's size reduction at a fraction of the link time. For a project this size, the difference in binary size is <50KB. The compile time difference is noticeable.

`panic = "abort"` removes the unwinding machinery. This saves ~100-200KB and makes the binary behavior more predictable: a panic kills the process immediately, which is the right behavior for a monitoring tool. You don't want a half-crashed TUI hanging around with a corrupted terminal state.

## Terminal Integration: The Capabilities Matrix

Terminal emulators are the least standardized part of the Unix ecosystem, and it shows. claudectl auto-detects 9 of them and exposes up to 4 actions per terminal: Launch, Switch, Input, and Approve. Each supports a different subset:

| Terminal      | Launch | Switch | Input | Approve |
|--------------|--------|--------|-------|---------|
| Kitty        | yes    | yes    | yes   | yes     |
| Ghostty      | yes    | yes    | yes   | yes     |
| iTerm2       | yes    | yes    | yes   | no      |
| WezTerm      | yes    | yes    | yes   | no      |
| tmux         | yes    | yes    | yes   | yes     |
| Warp         | yes    | no     | no    | no      |
| Terminal.app | yes    | no     | no    | no      |
| Windows Term | yes    | no     | no    | no      |
| GNOME Term   | yes    | yes    | no    | no      |

Detection uses environment variable inspection: `TERM_PROGRAM`, `KITTY_WINDOW_ID`, `TMUX`, `WEZTERM_EXECUTABLE`, `GNOME_TERMINAL_SERVICE`. The `--doctor` subcommand tests each action for the detected terminal and suggests fixes.

{{< highlight-box title="Gotcha #5" >}}
Platform-specific modules use `#[cfg(target_os = "macos")]` gating, not runtime detection. Ghostty, iTerm2, Warp, and Terminal.app only compile on macOS. This means cross-compilation from Linux to macOS requires the right target, but keeps the Linux binary free of dead AppleScript integration code.
{{< /highlight-box >}}

{{< highlight-box title="Gotcha #6" >}}
Sending keystrokes to a session (the Input and Approve actions) is terminal-specific and fragile. Kitty uses `kitten @send-text`, tmux uses `send-keys`, iTerm2 uses AppleScript. Each has different escaping rules for special characters. If you're building terminal integration for your own TUI, start with tmux and Kitty; they have the most predictable programmatic interfaces.
{{< /highlight-box >}}

## Rule-Based Auto-Actions

Monitoring is table stakes; the real value is acting on what you see. The rules engine lets you define declarative policies in `.claudectl.toml`:

```toml
[[rules]]
name = "auto-approve-tests"
match_status = ["NeedsInput"]
match_tool = ["Bash"]
match_command = ["cargo test", "npm test"]
match_project = ["api-server"]
action = "approve"

[[rules]]
name = "kill-expensive"
match_cost_above = 10.0
action = "terminate"
```

All conditions within a rule are AND'd; empty conditions are wildcards. The evaluation has one hard constraint: **deny rules always win**, regardless of order. Among non-deny rules, first match in config order takes precedence.

```rust
pub fn evaluate(rules: &[AutoRule], session: &ClaudeSession) -> Option<RuleMatch> {
    let mut first_non_deny: Option<RuleMatch> = None;

    for rule in rules {
        if !matches_rule(rule, session) { continue; }
        if rule.action == RuleAction::Deny {
            return Some(RuleMatch { /* deny immediately */ });
        }
        if first_non_deny.is_none() {
            first_non_deny = Some(RuleMatch { /* capture first match */ });
        }
    }
    first_non_deny
}
```

This is a deliberate security decision. If you have a rule that auto-approves Bash commands in your test project, and another rule that denies `rm -rf` globally, the deny wins even if it appears later in the config. Fail-safe defaults for a system that can send keystrokes to your terminal.

## Task Orchestration

Why start 5 sessions by hand when you can declare the dependency graph? The orchestrator runs multi-session workflows from a JSON task file with dependency ordering:

```json
{
  "tasks": [
    { "name": "migrate", "cwd": "./api", "prompt": "Run the database migration" },
    { "name": "test-api", "cwd": "./api", "prompt": "Run the test suite", "depends_on": ["migrate"] },
    { "name": "test-web", "cwd": "./web", "prompt": "Run frontend tests" }
  ]
}
```

`test-web` runs in parallel with `migrate` (no dependency). `test-api` waits for `migrate` to complete. Output from completed tasks can be templated into downstream prompts via `{{migrate.stdout}}`. The orchestrator polls every 2 seconds using `Arc<AtomicBool>` for graceful Ctrl+C handling.

At this point claudectl crosses from monitoring into workflow automation. Instead of manually starting 5 sessions and watching which one finishes first, you declare the dependency graph and let it run.

## What I'd Do Differently

Building against undocumented internals teaches you humility fast.

**Process discovery via `ps` is brittle.** If Claude Code changes its process name or argument format, the parsing breaks. A better approach would be for Claude Code to expose a local socket or status file with structured data. Until then, `ps` parsing with defensive fallbacks is the pragmatic choice.

**The JSONL format is undocumented.** Every field claudectl reads could change without notice. The `TelemetryStatus` enum exists specifically to handle graceful degradation: if the transcript format changes, sessions degrade to "Unknown" status instead of crashing. Build your parsers to survive schema changes.

**Testing status inference requires mocking time.** The `age_mins > 10` and `age_secs > 5` checks in `infer_status` make tests time-dependent. The test suite works around this by constructing sessions with specific `last_message_ts` values, but injecting a clock trait would be cleaner.

## Ship It

MIT licensed. macOS and Linux. Windows Terminal/WSL support in progress.

```bash
cargo install claudectl
```

Source: [github.com/mercurialsolo/claudectl](https://github.com/mercurialsolo/claudectl)

The dependency tree is intentionally minimal, the binary is intentionally small, and the architecture is intentionally synchronous. Not every Rust project needs an async runtime, a plugin system, or a proc-macro framework. Sometimes `ps`, `seek`, and a 2-second polling loop is the right answer.
