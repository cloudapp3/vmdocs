---
title: Local Management
description: Manage vmflow through the bundled CLI, terminal UI, and read-only MCP adapter.
---

# Local Management

The supported management interfaces are `vmflow ctl`, `vmflow tui`, and the
read-only `vmflow mcp` adapter. vmflow uses an internal loopback-only transport
to implement these tools. That transport is not a public integration API and
carries no compatibility promise.

The daemon always binds management to `127.0.0.1`. Configure only its local
port:

```yaml
control_port: 19090
```

Use the bundled commands for status, rules, statistics, precheck, reload, and
interactive management. See [`vmflow ctl`](./commands/ctl) and
[`vmflow tui`](./commands/tui). For local AI-assisted diagnostics, see
[`vmflow mcp`](./commands/mcp).

## Remote Administration

Forward the loopback port over SSH, then continue using the CLI/TUI locally:

```bash
ssh -N -L 19090:127.0.0.1:19090 user@server
vmflow ctl rules
```
