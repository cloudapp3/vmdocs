---
title: Forwarding Engine
description: How vmflow forwards TCP, UDP, and tcp+udp traffic, with per-rule source IP admission, speed limiting, connection caps, and traffic counters.
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
- **`source_ip_mode` / `source_ips`** — `off`, an IPv4/IPv6 allowlist, or an IPv4/IPv6 denylist. Entries may be literal addresses or CIDRs, up to 256 per rule.
- **`enabled`** — a disabled rule is kept in config (and in snapshots) but is not started.

## Source IP admission

TCP evaluates the socket peer after `Accept` but before reserving a connection slot or dialing the target. UDP evaluates every source datagram before creating a session or consuming either UDP session limit. Rejected traffic therefore does not consume forwarding capacity.

Changing the effective source policy restarts the rule and closes established TCP connections and UDP sessions. Reordering equivalent CIDRs does not restart it. The policy uses only the socket peer address: vmflow does not trust forwarded HTTP headers or PROXY protocol metadata, and an upstream NAT or Layer 4 proxy can hide the original client address.

## Traffic counters

Every running rule reports real-time counters:

- current connection count
- upload bytes total
- download bytes total
- source IP denials total (TCP connection attempts or UDP datagrams)

Read counters through `vmflow ctl stats` or the TUI. Source policy denials are also exported as `vmflow_rule_source_ip_denied_total`. When statistics persistence is enabled, the denial total survives daemon restarts. For UDP, the connection count is a session-like approximation.

## Rule equivalence

Rules carry both runtime fields (protocol, addresses, ports, limits, `idle_timeout`, source IP policy) and metadata (`remark`, `revision`, timestamps). The engine compares only the runtime fields when diffing a new snapshot against the live state, so cosmetic edits do not cause needless restarts — but changing `idle_timeout` or the effective source IP policy does trigger a restart. See [Rules & Lifecycle](./rules).
