---
title: summary
description: Collect one cross-platform host snapshot as readable text or structured JSON for scripts and CI.
---

# `vminfo summary`

Collects one snapshot of the current host state and exits. It is the simplest
non-interactive way to inspect vminfo data and works on Linux, macOS, and
Windows.

## Usage

```bash
vminfo summary
vminfo summary --json
vminfo summary --interval 1s
```

## Options

| Option | Default | Purpose |
| --- | --- | --- |
| `--json` | off | Print one indented JSON object instead of text |
| `--interval <duration>` | `1s` | Sampling window used for CPU, network, and disk I/O rates |

The interval must be positive. A longer interval smooths short spikes but also
makes the command take longer to finish.

## Text output

Text mode is intended for people and follows the selected UI language. A result
contains host identity, operating system, CPU, memory, swap, disk, load,
network rates, connection counts, process count, and uptime.

```text
Host Summary
============
Host     : example-host
OS       : Debian GNU/Linux 12
Kernel   : 6.1.0-amd64
Arch     : x86_64
CPU      : Example CPU (4 cores)
Memory   : 3.0 GiB used / 8.0 GiB total
Swap     : 0 B used / 2.0 GiB total
Disk     : 18.0 GiB used / 80.0 GiB total
CPU      : 4.2%
Load     : 0.18 0.21 0.25
Network  : ↓ 12.0 KiB/s ↑ 3.0 KiB/s
Conn     : tcp 42 / udp 8 / proc 126
Uptime   : 7d 2h 0m
```

Values depend on the host and platform; the example is illustrative.

## JSON output

JSON mode prints a `vminfo.Snapshot` with two top-level objects:

```json
{
  "static": {
    "os": "linux",
    "hostname": "example-host",
    "cpu_cores": 4,
    "mem_total": 8589934592
  },
  "stats": {
    "cpu": 4.2,
    "mem_used": 3221225472,
    "net_in_speed": 12288,
    "net_out_speed": 3072
  }
}
```

- byte counters and rates use bytes and bytes per second
- CPU values are percentages
- fields unavailable on a platform may be omitted or zero
- JSON field names are language-neutral even when the text UI is localized

See the [Go library](/library/) for the `Snapshot`, `StaticInfo`, and
`RuntimeStats` types.

## When to use it

- quick terminal checks that should return immediately after one sample
- CI diagnostics and support bundles
- shell scripts that consume one JSON document
- automation that does not need a daemon or streaming connection

## Script examples

```bash
# Save a machine-readable snapshot.
vminfo summary --json > snapshot.json

# Use a longer rate-sampling window.
vminfo summary --interval 3s --json
```

The command rejects positional arguments and non-positive intervals. Collection
failures are written as errors rather than emitting a partial JSON document.

## Related

- [watch](/commands/watch)
- [HTTP API](/api)
- [Go library](/library/)
