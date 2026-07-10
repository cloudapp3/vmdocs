---
title: TUI Dashboard
description: The vmflow terminal dashboard — start it, switch between Dashboard, Rules, and Detail views.
---

# TUI Dashboard

vmflow ships with a terminal UI for inspecting a running daemon. It reads from the local control API, so it shows live rule state and traffic counters.

## Start it

```bash
vmflow tui
```

Point at a non-default control address or pass a token:

```bash
vmflow tui -addr http://127.0.0.1:19090 -token <token>
# or
VMFLOW_CONTROL_TOKEN=<token> vmflow tui
```

The TUI accepts the same client flags as `ctl`, including the TLS/mTLS flags (`-tls-ca-file`, `-tls-client-cert`, `-tls-client-key`, `-tls-skip-verify`) and `-H` / `--header` for custom request headers.

## Views

Press <kbd>Tab</kbd> to cycle between views:

| View | Shows |
| --- | --- |
| **Dashboard** | Overall health, running rule count, uptime. |
| **Rules** | The list of running rules with live counters; supports filtering rules by name. |
| **Detail** | Detail for the selected rule. |

## When to use it

The TUI is the quickest way to answer "what is vmflow doing right now?" without scraping metrics. For long-term history, point Prometheus at `/metrics` instead — the TUI only shows the in-memory current state.
