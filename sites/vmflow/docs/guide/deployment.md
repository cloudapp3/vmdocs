---
title: Deployment
description: Run vmflow as a daemon in production — admin API exposure, authentication, logging, metrics, and a systemd example.
---

# Deployment

vmflow runs as a long-lived daemon exposing a local admin API. This page covers the practical concerns for running it on a host.

## Keep the admin API on loopback

The default `admin_listen_addr` is `127.0.0.1:19090`. With `auth.enabled: false` the admin API treats every request as a trusted admin — that is only safe on loopback.

If you must expose it off localhost:

1. Set `auth.enabled: true`.
2. Define at least one `admin` token.
3. Use the admin token for any mutating call (`reload`, stop/start).

```yaml
admin_listen_addr: 0.0.0.0:19090
auth:
  enabled: true
  tokens:
    - name: admin
      token: <long-random-secret>
      role: admin
    - name: viewer
      token: <another-random-secret>
      role: viewer
```

See [HTTP API → Authentication](../api#authentication).

## Logging

Set the format that fits your stack:

```yaml
log:
  level: info
  format: json # text or json
```

`json` is easiest for log shippers; `text` is friendlier in a terminal.

## Metrics

Point Prometheus at the admin API:

```yaml
scrape_configs:
  - job_name: vmflow
    static_configs:
      - targets: ['127.0.0.1:19090']
    metrics_path: /metrics
```

See [HTTP API → Metrics](../api#metrics) for the exposed metric families.

## Reload safely

Configuration changes go through `POST /v1/reload` (or `vmflow ctl reload`). Reload runs [precheck](./precheck) first and rejects the change on any error, leaving running rules untouched. There is no graceful drain window yet — existing connections to a removed/changed rule are not migrated.

## Running under systemd (example)

vmflow does not ship an official systemd unit yet (that is a [roadmap](../roadmap) item). The following is a working example you can adapt:

```ini
[Unit]
Description=vmflow L4 forwarding daemon
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
ExecStart=/usr/local/bin/vmflow daemon -config /etc/vmflow/config.yaml
ExecReload=/usr/local/bin/vmflow ctl reload
Restart=on-failure
RestartSec=3
# Optional: send a reload on config edits
# WatchSec=1s

[Install]
WantedBy=multi-user.target
```

Reload the daemon after editing the config:

```bash
sudo systemctl reload vmflow
```

## Current limits

- Statistics are **in-memory only**; there is no built-in historical aggregation.
- No bundled web dashboard or multi-node coordinator.
- No official Docker/systemd packaging in the release archive yet.
