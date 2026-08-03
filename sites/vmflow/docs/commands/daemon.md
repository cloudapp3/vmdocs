---
title: vmflow run
description: vmflow CLI reference for foreground runtime, ctl, tui, version, update, service, and uninstall.
---

# vmflow run

```bash
vmflow run [-config /path/to/config.yaml] [-control-port 19090]
```

The foreground runtime loads the config, starts the internal loopback management channel, applies the rules as a snapshot, and runs until `SIGINT` or `SIGTERM`.

## Flags

| Flag | Default | Description |
| --- | --- | --- |
| `-config` | platform user config | Override the YAML config path. |
| `-control-port` | _(from config)_ | Override the loopback management port. |
| `-log-file` | _(stdout)_ | Write logs to this file instead of stdout; useful under a service manager. |
| `-service-name` | `vmflow` | Windows SCM registered service name; ignored outside Windows service mode. |

## Runtime behavior

- On startup, rules are applied via snapshot (`ReplaceAll`). See [Rules & Lifecycle](../guide/rules).
- `vmflow ctl` and `vmflow tui` provide the supported management surfaces.

- To run as a managed boot-time service, see [`vmflow service`](./service).
