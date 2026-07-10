---
title: Configuration
description: vmflow YAML configuration reference — control address, TLS, logging, auth tokens, and forwarding rules.
---

# Configuration

vmflow is driven by a single YAML file. Pass it to the daemon with `-config`:

```bash
vmflow daemon -config ./examples/config.yaml
```

A reload re-reads this file and applies the new desired state (see [Rules & Lifecycle](./rules)).

## Full example

```yaml
version: 1
control_listen_addr: 127.0.0.1:19090

log:
  level: info
  format: text # text or json

# Enable auth (or set control_tls.client_ca_file for mTLS) before exposing
# control_listen_addr outside localhost; otherwise the daemon refuses to start.
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
| `control_listen_addr` | Local control API listen address. Defaults to `127.0.0.1:19090`; keep on loopback unless you enable auth or mTLS. |
| `control_tls` | Optional TLS / mTLS for the control API (see `control_tls` below). |
| `log` | Structured logging — `level` and `format`. |
| `auth` | Bearer-token auth with `admin` / `viewer` roles. |
| `bot_token`, `bot_chat` | Telegram bot — see [Telegram Bot](./telegram-bot). |
| `rules` | Forwarding rules (see `rules[]` below). |

## `control_tls`

Optional TLS (and mutual TLS) for the control API. TLS is active when both `cert_file` and `key_file` are set; setting `client_ca_file` enables mutual TLS.

```yaml
control_tls:
  cert_file: /etc/vmflow/server.pem
  key_file: /etc/vmflow/server.key
  client_ca_file: /etc/vmflow/client-ca.pem   # optional → mTLS
  min_version: "1.2"                           # "1.2" (default) or "1.3"
```

| Field | Description |
| --- | --- |
| `cert_file` | Server certificate path. |
| `key_file` | Server key path. |
| `client_ca_file` | CA bundle for client certificates. Setting this enables **mutual TLS** and satisfies the non-loopback startup safety check. |
| `min_version` | `1.2` (default) or `1.3`. |

See [HTTP API → TLS and mutual TLS](../api#tls-and-mutual-tls). Clients use `-tls-ca-file`, `-tls-client-cert`, `-tls-client-key`, and `-tls-skip-verify` — see [Common client flags](../commands/#common-client-flags).

## `log`

| Field | Values |
| --- | --- |
| `level` | Log level (e.g. `debug`, `info`, `warn`, `error`). |
| `format` | `text` or `json`. |

## `auth`

Bearer-token authentication for the control API. See [HTTP API](../api#authentication).

| Field | Description |
| --- | --- |
| `enabled` | When `false`, the control API treats requests as an anonymous admin-level caller — only safe on loopback. |
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

Beyond the sections above, the config accepts Telegram bot and ACME/certificate fields. The bot fields and `control_tls` are **active**; the ACME/certificate fields are reserved for when HTTPS support is re-enabled and are currently ignored.

| Field | Status |
| --- | --- |
| `control_tls` | Active — see `control_tls` above and [HTTP API](../api#tls-and-mutual-tls). |
| `bot_token`, `bot_chat` | Active — see [Telegram Bot](./telegram-bot). |
| `acme_*`, `cert_cache_dir`, `cert_review.*` | Reserved (ignored in current build). |
