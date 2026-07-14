---
title: watch
description: Stream cross-platform host snapshots as readable text or JSON Lines with a configurable interval and sample count.
---

# `vminfo watch`

Collects snapshots repeatedly until the requested count is reached or the
process is interrupted. It works on Linux, macOS, and Windows and does not
require the TUI.

## Usage

```bash
vminfo watch
vminfo watch --json
vminfo watch --count 1
vminfo watch --interval 2s
```

## Options

| Option | Default | Purpose |
| --- | --- | --- |
| `--json` | off | Emit one compact JSON object per line |
| `--interval <duration>` | `1s` | Sampling window for each snapshot |
| `--count <n>` | `0` | Stop after `n` snapshots; `0` means keep running |

`--count` must be zero or greater and `--interval` must be positive. Use
`Ctrl+C` to stop an unlimited stream.

## Text output

Text mode prints a timestamp followed by resource and connection summaries:

```text
[2026-07-14T12:00:00Z] host=example-host os=linux
cpu=4.2% mem=3.0 GiB/8.0 GiB swap=0 B/2.0 GiB disk=18.0 GiB/80.0 GiB
load=0.18 0.21 0.25 net=↓ 12.0 KiB/s ↑ 3.0 KiB/s conn=tcp 42 udp 8 proc 126 uptime=7d 2h 0m
```

The next sample is separated by a blank line.

## JSON Lines output

JSON mode is suitable for line-oriented pipelines. Each line is a complete
object with its own collection timestamp:

```json
{"collected_at":"2026-07-14T12:00:00Z","static":{"os":"linux","hostname":"example-host"},"stats":{"cpu":4.2,"mem_used":3221225472}}
```

Do not parse JSON Lines as one JSON array. Process each line independently or
collect a bounded number of samples first.

## Good for

- short troubleshooting windows without opening the TUI
- log and telemetry pipelines that accept JSON Lines
- CI checks that need a fixed number of samples
- comparing a host before and after a workload change

## Examples

```bash
# Emit exactly three JSON records.
vminfo watch --json --count 3

# Capture one sample in the same envelope used by a stream.
vminfo watch --json --count 1 > sample.jsonl

# Use a slower sampling window for a five-sample observation.
vminfo watch --interval 5s --count 5
```

The command rejects positional arguments. If collection or output fails, it
stops instead of silently skipping a sample.

## Related

- [summary](/commands/summary)
- [ps](/commands/ps)
- [HTTP API](/api)
