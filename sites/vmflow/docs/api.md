---
title: HTTP API
description: The vmflow local admin API — authentication, health, rules, stats, precheck, reload, and Prometheus metrics.
---

# HTTP API

The daemon exposes a local admin API. The default listen address is `127.0.0.1:19090`. The CLI and TUI are thin clients over these endpoints.

## Authentication

The admin API supports bearer-token auth with two roles.

```yaml
auth:
  enabled: true
  tokens:
    - name: admin
      token: change-me
      role: admin
    - name: viewer
      token: view-only
      role: viewer
```

```bash
curl -H "Authorization: Bearer change-me" http://127.0.0.1:19090/v1/stats
```

```bash
vmflow ctl -token change-me stats
VMFLOW_ADMIN_TOKEN=change-me vmflow tui
```

| Role | Allowed |
| --- | --- |
| `viewer` | Read endpoints: `health`, `rules`, `stats`, `metrics`. |
| `admin` | Everything `viewer` can do, plus `reload`. |

Tokens are compared in constant time. When `auth.enabled: false`, requests are treated as a trusted anonymous admin — only safe on loopback. A non-loopback bind with auth disabled raises a warning.

## `GET /healthz`

Daemon health.

```json
{
  "ok": true,
  "running_rules": 1,
  "time": 1760000000
}
```

## `GET /v1/rules`

Running rules.

```json
{
  "items": [
    {
      "rule_id": "ssh-forward",
      "name": "ssh-forward",
      "protocol": "tcp",
      "listen_addr": "0.0.0.0",
      "listen_port": 2201,
      "target_addr": "127.0.0.1",
      "target_port": 22,
      "enabled": true
    }
  ]
}
```

## `GET /v1/stats`

Per-rule in-memory counters.

```json
{
  "items": [
    {
      "rule_id": "ssh-forward",
      "upload_bytes": 1024,
      "download_bytes": 2048,
      "conns": 1,
      "updated_time": 1760000000
    }
  ]
}
```

## `GET|POST /v1/precheck`

Validate the current config **without applying it**. `reload` runs the same checks; any error rejects the reload.

Checks: rule validation, duplicate `rule_id`, listener conflicts, listen-port bindability, target DNS resolution, and low-port privilege warnings. (HTTPS-domain and ACME checks are disabled in the current build.)

```bash
vmflow ctl precheck
```

```json
{
  "config_path": "./examples/config.yaml",
  "rule_count": 1,
  "result": {
    "ok": true,
    "error_count": 0,
    "warning_count": 0,
    "checked_rules": 1,
    "checked_time_ms": 1,
    "items": []
  }
}
```

See [Precheck](./guide/precheck) for the full list of checks.

## `GET /metrics`

Prometheus text exposition. Example:

```text
vmflow_rule_upload_bytes_total{rule_id="ssh-forward",protocol="tcp"} 1024
vmflow_rule_download_bytes_total{rule_id="ssh-forward",protocol="tcp"} 2048
vmflow_rule_connections{rule_id="ssh-forward",protocol="tcp"} 1
vmflow_admin_requests_total{method="GET",path="/v1/stats",status="200"} 10
vmflow_reload_total{status="ok"} 1
vmflow_rule_apply_total{action="started",status="ok"} 1
```

Metric families:

- `vmflow_build_info`
- `vmflow_uptime_seconds`
- `vmflow_rule_running{rule_id,protocol}`
- `vmflow_rule_connections{rule_id,protocol}`
- `vmflow_rule_upload_bytes_total{rule_id,protocol}`
- `vmflow_rule_download_bytes_total{rule_id,protocol}`
- `vmflow_admin_requests_total{method,path,status}`
- `vmflow_admin_request_duration_seconds_sum{method,path,status}`
- `vmflow_reload_total{status}`
- `vmflow_rule_apply_total{action,status}`

## `POST /v1/reload`

Reload the config file and run `ApplySnapshot(replace_all=true)` after precheck.

```json
{
  "config_path": "./examples/config.yaml",
  "admin_listen_addr": "127.0.0.1:19090",
  "rule_count": 1,
  "result": {
    "applied_rules": 1,
    "stopped_rules": 0,
    "failed_rules": 0,
    "total_rules": 1,
    "items": []
  }
}
```

::: warning Disabled endpoints
`/v1/certs*` certificate endpoints exist in the source but are **not registered** in the current build (HTTPS/ACME is disabled).
:::
