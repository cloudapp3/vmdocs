---
title: Configuration
description: vmflow YAML configuration reference for local management, logging, authentication, statistics, and forwarding rules.
---

# Configuration

vmflow is driven by a single YAML file. Pass it to the daemon with `-config`:

```bash
vmflow -config ./examples/config.yaml
```

A reload re-reads this file and applies the new desired state (see [Rules & Lifecycle](./rules)).

## Full example

```yaml
version: 1
control_port: 19090

log:
  level: info
  format: text # text or json

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
    speed_limit: 0
    max_conn: 0
    remark: example
```

## Top-level fields

| Field | Description |
| --- | --- |
| `version` | Config schema version. Currently `1`. |
| `control_port` | Local management port. Defaults to `19090`; the host is always `127.0.0.1`. |
| `log` | Structured logging — `level` and `format`. |
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
| `speed_limit` | Per-connection rate limit in bytes/sec (`0` = unlimited). |
| `max_conn` | Max concurrent connections (`0` = unlimited). New connections over the cap are closed. |
| `idle_timeout` | Per-connection idle timeout in seconds (`0` = default 5 minutes). Changing it restarts the rule. |
| `remark` | Free-form note. |

::: tip
`http` and `https` protocols exist in the source but are disabled in the current build. They are rejected by validation. See the [forwarding reference](./forwarding).
:::

## Other fields

Beyond the sections above, the config accepts Telegram bot and reserved ACME/certificate fields. See [Telegram Bot](./telegram-bot) for active bot settings.

| Field | Status |
| --- | --- |
| `bot_token`, `bot_chat` | Active — see [Telegram Bot](./telegram-bot). |
| `acme_*`, `cert_cache_dir`, `cert_review.*` | Reserved (ignored in current build). |
