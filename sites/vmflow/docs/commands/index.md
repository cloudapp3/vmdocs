---
title: Command Reference
description: vmflow CLI reference — daemon, ctl, tui, version subcommands and their one-letter aliases.
---

# Command Reference

vmflow is a single binary with four subcommands, each with a one-letter alias.

| Command | Alias | Purpose |
| --- | --- | --- |
| [`daemon`](./daemon) | `d` | Run the forwarding daemon. |
| [`ctl`](./ctl) | `c` | Query and control a running daemon. |
| [`tui`](./tui) | `t` | Terminal dashboard. |
| [`version`](./version) | `v` | Print build metadata. |

## Common flags

Flags that target the admin API are shared by `ctl` and `tui`:

| Flag | Env var | Default | Description |
| --- | --- | --- | --- |
| `-addr` | `VMFLOW_ADMIN_ADDR` | `http://127.0.0.1:19090` | Admin API base URL. |
| `-token` | `VMFLOW_ADMIN_TOKEN` | _(none)_ | Bearer token when auth is enabled. |

## Notes

- The older split binaries `relayd`, `relayctl`, and `relaytui` are still buildable for compatibility, but releases prefer the unified `vmflow` binary.
- Tunnel commands (`tunnel-server`, `tunnel-client`, `tunnel-ctl`) and certificate commands (`certs`, `certs-obtain`, `certs-review`) are **not enabled** in the current build.
