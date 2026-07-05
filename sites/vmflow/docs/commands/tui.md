---
title: vmflow tui
description: Launch the vmflow terminal dashboard against a running daemon.
---

# vmflow tui

```bash
vmflow tui [-addr http://127.0.0.1:19090] [-token TOKEN]
```

Alias: `vmflow t`.

Launches the terminal dashboard. It reads live state from the admin API. See [TUI Dashboard](../guide/tui) for the views and controls.

## Examples

```bash
vmflow tui
vmflow tui -addr http://10.0.0.5:19090 -token change-me
VMFLOW_ADMIN_TOKEN=change-me vmflow tui
```
