---
title: Command Reference
description: vmflow CLI reference for foreground runtime, ctl, tui, mcp, version, update, service, and uninstall.
---

# Command Reference

vmflow is a single binary with a foreground runtime and seven subcommands. Aliases are shown below.

| Command | Alias | Purpose |
| --- | --- | --- |
| `vmflow` | - | Run the forwarding runtime in the foreground. |
| [`ctl`](./ctl) | `c` | Query and control a running daemon. |
| [`tui`](./tui) | `t` | Terminal dashboard. |
| [`mcp`](./mcp) | - | Read-only stdio MCP server for a running local daemon. |
| [`version`](./version) | `v` | Print build metadata. |
| [`update`](./update) | `u` | Check for or install a newer release. |
| [`service`](./service) | `svc` | Register as a native OS service (boot startup). |
| [`uninstall`](./uninstall) | `remove`, `rm` | One-command uninstall with cleanup. |

## Common management flags

The bundled `ctl`, `tui`, and `mcp` commands connect to the local daemon.

| Flag | Env var | Default | Description |
| --- | --- | --- | --- |
| `-token` | `VMFLOW_CONTROL_TOKEN` | _(none)_ | Bearer token when authentication is enabled. |

For remote administration, use the SSH tunnel described in [Local management](../api).

## Notes

- The older split binaries `relayd`, `relayctl`, and `relaytui` are still buildable for compatibility — they are thin shims over the same packages and read the same `VMFLOW_CONTROL_TOKEN` env var — but releases prefer the unified `vmflow` binary.
- Tunnel commands (`tunnel-server`, `tunnel-client`, `tunnel-ctl`) and certificate commands (`certs`, `certs-obtain`, `certs-review`) are **not enabled** in the current build.
