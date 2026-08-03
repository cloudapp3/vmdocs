---
title: vmflow tui
description: Launch the vmflow terminal dashboard against a running daemon.
---

# vmflow tui

```bash
vmflow tui [-addr URL] [-token TOKEN]
```

Alias: `vmflow t`.

Launches the terminal dashboard against the local daemon. The default local target requires an installed, running native service and offers service recovery if it later stops. For a daemon started manually with `vmflow run`, pass `-addr http://127.0.0.1:19090` explicitly to bypass that service check. See [TUI Dashboard](../guide/tui) for views and controls.

## Examples

```bash
vmflow tui
vmflow tui -addr http://127.0.0.1:19090
VMFLOW_CONTROL_TOKEN=change-me vmflow tui
```
