---
title: vmflow tui
description: Launch the vmflow terminal dashboard against a running daemon.
---

# vmflow tui

```bash
vmflow tui [-addr http://127.0.0.1:19090] [-token TOKEN]
```

Alias: `vmflow t`.

Launches the terminal dashboard. It reads live state from the control API and accepts the same shared client flags as `ctl` — including TLS/mTLS and custom headers (see [Common client flags](./#common-client-flags)). See [TUI Dashboard](../guide/tui) for the views and controls.

## Examples

```bash
vmflow tui
vmflow tui -addr http://10.0.0.5:19090 -token change-me
VMFLOW_CONTROL_TOKEN=change-me vmflow tui

# against a TLS-protected control API
vmflow tui -addr https://10.0.0.5:19090 \
  -tls-ca-file ca.pem -tls-client-cert client.pem -tls-client-key client.key
```
