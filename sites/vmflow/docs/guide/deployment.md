---
title: Deployment
description: Run vmflow in production with loopback-only management, logging, metrics, SSH access, and native service setup.
---

# Deployment

vmflow runs as a long-lived forwarding daemon. Management stays on loopback and operators use the bundled CLI/TUI.

## Local management

The daemon always binds its internal management channel to `127.0.0.1`. Configure only the local port:

```yaml
control_port: 19090
```

Use `vmflow ctl` and `vmflow tui` for supported management workflows. The internal transport is not a public integration API.

## Remote administration

Forward the loopback port over SSH, then use the local CLI/TUI:

```bash
ssh -N -L 19090:127.0.0.1:19090 user@server
vmflow ctl rules
```

## Logging

Set the format that fits your stack:

```yaml
log:
  level: info
  format: json # text or json
```

`json` is easiest for log shippers; `text` is friendlier in a terminal. Under a service manager you can also pass `-log-file` to the daemon (required on Windows).

## Metrics

Point a same-host Prometheus instance at the loopback metrics listener:

```yaml
scrape_configs:
  - job_name: vmflow
    static_configs:
      - targets: ['127.0.0.1:19090']
    metrics_path: /metrics
```

The metrics endpoint is loopback-only; run Prometheus on the host or reach it through an SSH tunnel.

## Reload safely

Use `vmflow ctl reload` to apply configuration changes. Reload runs [precheck](./precheck) first and rejects any invalid change without partially applying it.

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
ExecStart=/usr/local/bin/vmflow -config /etc/vmflow/config.yaml
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

- Cumulative traffic counters can optionally persist; active connections and rates remain process-local.
- No bundled web dashboard or multi-node coordinator.
- No official Docker image is published yet; use the built-in native service installer for boot startup.
