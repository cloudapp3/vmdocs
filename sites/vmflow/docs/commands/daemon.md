---
title: vmflow daemon
description: Run the vmflow forwarding daemon — config path and admin listen address flags.
---

# vmflow daemon

```bash
vmflow daemon -config ./examples/config.yaml [-admin-listen 127.0.0.1:19090]
```

Alias: `vmflow d`.

The daemon loads the config file, starts the admin API, and applies the rules as a snapshot. It then serves until interrupted.

## Flags

| Flag | Default | Description |
| --- | --- | --- |
| `-config` | _(required)_ | Path to the YAML config file. |
| `-admin-listen` | `127.0.0.1:19090` | Override the admin API listen address from the config. |

## Runtime behavior

- On startup, rules are applied via snapshot (`ReplaceAll`). See [Rules & Lifecycle](../guide/rules).
- The admin API exposes [health, rules, stats, precheck, reload, metrics](../api).
- `POST /v1/reload` (or `vmflow ctl reload`) re-reads the config and re-applies it after [precheck](../guide/precheck).
