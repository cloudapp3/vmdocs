---
title: Deployment
description: Run vmflow as a daemon in production — control API exposure, authentication, TLS/mTLS, logging, metrics, and native service setup.
---

# Deployment

vmflow runs as a long-lived daemon exposing a local control API. This page covers the practical concerns for running it on a host.

## Keep the control API on loopback

The default `control_listen_addr` is `127.0.0.1:19090`. With `auth.enabled: false` the control API treats every request as an anonymous admin-level caller — that is only safe on loopback.

The daemon **refuses to start** if the control API is bound to a non-loopback address (`0.0.0.0`, `::`, a non-loopback IP, or `:port`) without protection. This is fail-closed: it prevents accidentally exposing an unauthenticated remote control endpoint. To bind off-loopback, satisfy one of:

1. `auth.enabled: true` with at least one token, **or**
2. mutual TLS via `control_tls.client_ca_file` (clients must present a cert), **or**
3. pass `-insecure-allow-remote-control` to the daemon to explicitly acknowledge the risk.

## Exposing it off localhost

When you need to reach the control API from another host, pick one of the safe options.

### Option A — bearer-token auth

```yaml
control_listen_addr: 0.0.0.0:19090
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

Use the `admin` token for any mutating call (`reload`). Read-only calls work with a `viewer` token.

### Option B — TLS / mutual TLS (recommended)

Terminate TLS on the control API itself and, for the strongest posture, require client certificates:

```yaml
control_listen_addr: 0.0.0.0:19090
control_tls:
  cert_file: /etc/vmflow/server.pem
  key_file:  /etc/vmflow/server.key
  client_ca_file: /etc/vmflow/client-ca.pem   # mTLS — satisfies the startup check
  min_version: "1.2"
```

Clients then connect with `-tls-ca-file`, `-tls-client-cert`, `-tls-client-key` (see [Common client flags](../commands/#common-client-flags)). This is the recommended way to expose the control API behind a Cloudflare Tunnel with zero inbound ports. See [HTTP API → TLS and mutual TLS](../api#tls-and-mutual-tls).

See also [HTTP API → Authentication](../api#authentication).

## Logging

Set the format that fits your stack:

```yaml
log:
  level: info
  format: json # text or json
```

`json` is easiest for log shippers; `text` is friendlier in a terminal. Under a service manager you can also pass `-log-file` to the daemon (required on Windows).

## Metrics

Point Prometheus at the control API:

```yaml
scrape_configs:
  - job_name: vmflow
    static_configs:
      - targets: ['127.0.0.1:19090']
    metrics_path: /metrics
```

See [HTTP API → Metrics](../api#get-metrics) for the exposed metric families.

## Reload safely

Configuration changes go through `POST /v1/reload` (or `vmflow ctl reload`). Reload runs [precheck](./precheck) first and rejects the change on any error, leaving running rules untouched. There is no graceful drain window yet — existing connections to a removed/changed rule are not migrated.

## Running as a native service

Register vmflow with your OS service manager so it starts at boot and restarts on crash:

```bash
# installs + enables + starts a systemd unit / launchd plist / Windows Service
sudo vmflow service install
```

This is the recommended path — see [`vmflow service`](../commands/service) for flags (config path, run-as user, log file, extra args). `vmflow service status` / `vmflow service uninstall` query and remove it.

If you prefer to manage the unit yourself, here is a working systemd example you can adapt:

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

[Install]
WantedBy=multi-user.target
```

Reload the config after edits:

```bash
sudo vmflow ctl reload
# or, with a hand-written unit that wires ExecReload:
sudo systemctl reload vmflow
```

For a full teardown (service + binary + config + logs + certs + update cache), use [`vmflow uninstall`](../commands/uninstall).

## Current limits

- Statistics are **in-memory only**; there is no built-in historical aggregation.
- No bundled web dashboard or multi-node coordinator.
- No official Docker image in the release archive yet (native service install, plus `.deb`/`.rpm` packages, are available).
