---
title: Forwarding Engine
description: How vmflow forwards TCP, UDP, and tcp+udp traffic, with per-rule speed limiting, connection caps, and traffic counters.
---

# Forwarding Engine

The `engine/` package is the pure forwarding core. It owns listeners, proxy loops, sessions, counters, and rule lifecycle — and nothing else. It does not depend on a database, a control plane, or a UI. That keeps it embeddable.

## Protocols

Each rule picks one protocol via the `protocol` field.

| Protocol | Behavior |
| --- | --- |
| `tcp` | TCP port forwarding. |
| `udp` | UDP port forwarding. |
| `tcp+udp` | Forward both TCP and UDP on the same port from a single rule. |
| `http` | HTTP forward proxy (plain + `CONNECT`). **Disabled in current build.** |
| `https` | TLS-terminating forward with per-domain certificates. **Disabled in current build.** |

`http` and `https` exist in the source (`engine/https.go`, `engine/proxy.go`) alongside the ACME/certstore packages, but the current build rejects them at validation and does not wire up certificate management. They are reserved for re-enabling later.

## Per-rule controls

Each rule carries runtime controls independent of the protocol:

- **`speed_limit`** — per-connection bidirectional rate limit (token bucket), in bytes/sec. `0` means unlimited. This is intentionally simple and per-session; it is not a shared global bandwidth bucket.
- **`max_conn`** — concurrent connection cap. When the cap is reached, new connections are closed immediately. `0` means unlimited.
- **`idle_timeout`** — per-connection idle timeout in seconds. `0` means use the default (5 minutes / 300s). Changing it restarts the rule.
- **`enabled`** — a disabled rule is kept in config (and in snapshots) but is not started.

## Traffic counters

Every running rule reports real-time counters:

- current connection count
- upload bytes total
- download bytes total

Counters live in memory only. For UDP, the connection count is a session-like approximation. Read them through [`GET /v1/stats`](../api#get-v1-stats) or the `vmflow ctl stats` / TUI surfaces.

## Rule equivalence

Rules carry both runtime fields (protocol, addresses, ports, limits, `idle_timeout`) and metadata (`remark`, `revision`, timestamps). The engine compares only the runtime fields when diffing a new snapshot against the live state, so cosmetic edits do not cause needless restarts — but changing `idle_timeout` does trigger a restart. See [Rules & Lifecycle](./rules).
