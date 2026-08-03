---
title: Configuration
description: vmflow YAML configuration reference for local management, logging, authentication, statistics, forwarding rules, and source IP access policies.
---

# Configuration

vmflow is driven by a single YAML file. `vmflow run` uses the platform user config path by default:

```bash
vmflow run
```

Override the path when needed:

```bash
vmflow run -config /path/to/config.yaml
```

A reload re-reads the active config path and applies the new desired state (see [Rules & Lifecycle](./rules)).

## Full example

```yaml
version: 1
language: en
control_port: 19090
udp_max_sessions: 256

log:
  level: info
  format: text # text or json

stats:
  persist: false
  flush_interval: 60s

# Management always binds to 127.0.0.1; configure only the port.
# The CLI/TUI can pass the token with -token or VMFLOW_CONTROL_TOKEN.
auth:
  enabled: false
  tokens:
    - name: admin
      token: change-me
      role: admin

rules:
  - rule_id: ssh-forward
    name: ssh-forward
    protocol: tcp
    listen_addr: 0.0.0.0
    listen_port: 2201
    target_addr: 127.0.0.1
    target_port: 22
    enabled: true
    bandwidth_limit:
      rate: 100 Mbps
    traffic_quota:
      daily: 100 GB
      monthly: 1 TB
      timezone: Asia/Shanghai
      action: block
    speed_limit: 0 # legacy per-connection B/s limit
    max_conn: 0
    source_ip_mode: allowlist
    source_ips:
      - 203.0.113.8
      - 198.51.100.0/24
      - 2001:db8:100::/48
    remark: example
```

## Top-level fields

| Field | Description |
| --- | --- |
| `version` | Config schema version. Currently `1`. |
| `language` | CLI/TUI language: `en` or `zh-CN`. |
| `control_port` | Local management port. Defaults to `19090`; the host is always `127.0.0.1`. |
| `udp_max_sessions` | Process-wide active UDP session limit. Default `256`, maximum `4096`. |
| `log` | Structured logging — `level` and `format`. |
| `stats` | Optional cumulative counter persistence. Quota state is always durable. |
| `auth` | Bearer-token auth with `admin` / `viewer` roles. |
| `bot_token`, `bot_chat` | Telegram bot — see [Telegram Bot](./telegram-bot). |
| `rules` | Forwarding rules (see `rules[]` below). |

## `log`

| Field | Values |
| --- | --- |
| `level` | Log level (e.g. `debug`, `info`, `warn`, `error`). |
| `format` | `text` or `json`. |

## `auth`

Bearer-token authentication for CLI/TUI management.

| Field | Description |
| --- | --- |
| `enabled` | Require configured tokens for the local management tools. |
| `tokens[].name` | Label for the token (not used for auth). |
| `tokens[].token` | The bearer token string. |
| `tokens[].role` | `admin` (read + write) or `viewer` (read-only). |

## `rules[]`

Each entry describes one forwarding rule.

| Field | Description |
| --- | --- |
| `rule_id` | Stable unique ID, used for diffing across reloads. |
| `name` | Human-readable name. |
| `protocol` | `tcp`, `udp`, or `tcp+udp`. |
| `listen_addr` | Address to listen on (e.g. `0.0.0.0`). |
| `listen_port` | Port to listen on. |
| `target_addr` | Upstream address to forward to. |
| `target_port` | Upstream port. |
| `enabled` | If `false`, the rule is kept in config but not started. |
| `bandwidth_limit` | Aggregate per-rule rate: shared `rate`, or directional `upload` / `download`. |
| `traffic_quota` | Combined upload + download `daily` / `monthly` allowance, `timezone`, and `action`. |
| `speed_limit` | Per-connection rate limit in bytes/sec (`0` = unlimited). |
| `max_conn` | Max concurrent connections (`0` = unlimited). New connections over the cap are closed. |
| `idle_timeout` | Per-connection idle timeout in seconds (`0` = default 5 minutes). Changing it restarts the rule. |
| `source_ip_mode` | Source admission mode: `off`, `allowlist`, or `denylist`. Omitted means `off`. |
| `source_ips` | Literal IPv4/IPv6 addresses or CIDRs used by the selected mode. Maximum 256 entries. |
| `remark` | Free-form note. |

## Source IP access policy

`allowlist` accepts only peers that match `source_ips`. `denylist` rejects matching peers and accepts the rest. A configured allowlist or denylist must contain at least one entry; hostnames, malformed addresses, empty entries, and lists over 256 entries are rejected.

TCP checks the socket peer before consuming `max_conn` or dialing the target. UDP checks it before creating a session or consuming per-rule and manager-wide capacity. Changing the mode or effective entries restarts the rule and closes its established TCP connections and UDP sessions so the new policy applies immediately.

The policy sees the actual socket peer. Behind NAT or a Layer 4 proxy, that may be the gateway or proxy address rather than the original client. vmflow does not trust forwarded HTTP headers or PROXY protocol metadata. Use a cloud firewall, security group, or host firewall as the first layer for volumetric attack filtering.

## Shared bandwidth and traffic quotas

`bandwidth_limit` caps aggregate traffic for the entire `rule_id`; every TCP connection and UDP session in that rule shares the same directional buckets, including both protocols of a `tcp+udp` rule. Use `rate` for the same upload and download limit, or omit it and set `upload` and/or `download` separately. An omitted direction is unlimited. vmflow sizes burst capacity automatically; there is no `burst` configuration field.

Rate units are explicit and case-sensitive. `bps`, `Kbps`, `Mbps`, `Gbps`, and `Tbps` are bits per second. `B/s`, `KB/s`, `MB/s`, `GB/s`, `KiB/s`, `MiB/s`, and the other byte-rate forms are bytes per second. Bare integers remain accepted as bytes per second for compatibility; ambiguous values such as `100M` are rejected.

`traffic_quota.daily` and `traffic_quota.monthly` charge successful upload plus download payload to one allowance. Decimal `KB`/`MB`/`GB`/`TB`, binary `KiB`/`MiB`/`GiB`/`TiB`, and legacy integer byte counts are accepted. `timezone` is an IANA zone used for calendar reset boundaries. `action` is optional; `block` is the default and currently the only supported action.

Quota state is durable even when `stats.persist` is false. It is stored in `quota-state.json` beside the resolved statistics path or config, fails closed when it cannot be read or written, survives restarts, and remains attached to the same `rule_id` if a rule is removed and re-added. Exhausted traffic reopens automatically at the next day or month boundary.

## Process-wide settings and DNS

`language` accepts `en` or `zh-CN`. `udp_max_sessions` limits active UDP sessions across all rules and can be reloaded. `stats.persist` controls cumulative traffic-counter persistence; quota enforcement does not depend on it.

DNS fallback has no configuration surface. Target checks and outbound forwarding use the operating-system resolver first, then retry transient failures through `223.5.5.5:53` and `119.29.29.29:53`. Definitive `NXDOMAIN` responses do not use fallback, and literal IP targets bypass DNS.

::: tip
`http` and `https` protocols exist in the source but are disabled in the current build. They are rejected by validation. See the [forwarding reference](./forwarding).
:::

## Other fields

Beyond the sections above, the config accepts Telegram bot and reserved ACME/certificate fields. See [Telegram Bot](./telegram-bot) for active bot settings.

| Field | Status |
| --- | --- |
| `bot_token`, `bot_chat` | Active — see [Telegram Bot](./telegram-bot). |
| `acme_*`, `cert_cache_dir`, `cert_review.*` | Reserved (ignored in current build). |
