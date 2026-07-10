---
title: vmflow daemon
description: Run the vmflow forwarding daemon — config path, control listen address, and startup safety flags.
---

# vmflow daemon

```bash
vmflow daemon -config ./examples/config.yaml [-control-listen 127.0.0.1:19090]
```

Alias: `vmflow d`.

The daemon loads the config file, starts the control API, and applies the rules as a snapshot. It then serves until interrupted (`SIGINT` / `SIGTERM`, which is also how systemd and launchd stop it).

## Flags

| Flag | Default | Description |
| --- | --- | --- |
| `-config` | _(required)_ | Path to the YAML config file. |
| `-control-listen` | _(from config)_ | Override the control API listen address (`control_listen_addr` in the config, which defaults to `127.0.0.1:19090`). |
| `-insecure-allow-remote-control` | `false` | **Dangerous:** allow binding the control API on a non-loopback address without auth. See [Deployment](../guide/deployment). |
| `-log-file` | _(stdout)_ | Write logs to this file instead of stdout (useful under a service manager; required on Windows). |

## Startup safety

The daemon refuses to start when the control API is bound to a non-loopback address (`0.0.0.0`, `::`, a non-loopback IP, or `:port`) without authentication, since that would expose an unauthenticated remote control endpoint. To start anyway, either:

- bind to `127.0.0.1` (the default),
- enable `auth` in the config,
- enable mutual TLS (`control_tls.client_ca_file`), or
- pass `-insecure-allow-remote-control` to acknowledge the risk.

## Runtime behavior

- On startup, rules are applied via snapshot (`ReplaceAll`). See [Rules & Lifecycle](../guide/rules).
- The control API exposes [health, rules, stats, precheck, reload, metrics](../api).
- `POST /v1/reload` (or `vmflow ctl reload`) re-reads the config and re-applies it after [precheck](../guide/precheck).
- To run as a managed boot-time service, see [`vmflow service`](./service).
