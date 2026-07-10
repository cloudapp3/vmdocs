---
title: vmflow ctl
description: Query and control a running vmflow daemon — health, rules, stats, metrics, precheck, reload.
---

# vmflow ctl

```bash
vmflow ctl [-addr http://127.0.0.1:19090] [-token TOKEN] <subcommand>
```

Alias: `vmflow c`.

`ctl` is a thin client over the [control API](../api). It targets the daemon at `-addr` and authenticates with `-token` (or `VMFLOW_CONTROL_TOKEN`) when auth is enabled. The full set of shared client flags — including TLS/mTLS and custom headers — is listed in [Common client flags](./#common-client-flags).

## Subcommands

| Subcommand | Maps to | Description |
| --- | --- | --- |
| `health` | `GET /healthz` | Daemon health and running rule count. |
| `rules` | `GET /v1/rules` | List running rules. |
| `stats` | `GET /v1/stats` | Per-rule traffic counters (in-memory snapshot). |
| `metrics` | `GET /metrics` | Prometheus text exposition. |
| `precheck` | `POST /v1/precheck` | Validate the current config without applying. |
| `reload` | `POST /v1/reload` | Reload config and re-apply after precheck. |

## Examples

```bash
vmflow ctl health
vmflow ctl rules
vmflow ctl stats
vmflow ctl reload
vmflow ctl -token change-me reload

# against a TLS-protected control API using a private CA and mTLS client cert
vmflow ctl -addr https://10.0.0.5:19090 \
  -tls-ca-file ca.pem -tls-client-cert client.pem -tls-client-key client.key \
  reload

# send an extra header (e.g. a Cloudflare Access service token)
vmflow ctl -H "CF-Access-Client-Id: xxx" -H "CF-Access-Client-Secret: yyy" reload
```

::: tip
Mutating subcommands (`reload`) require an `admin` token when auth is enabled. Read-only subcommands work with a `viewer` token.
:::
