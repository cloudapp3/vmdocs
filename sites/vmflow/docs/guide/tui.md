---
title: TUI Dashboard
description: The vmflow terminal dashboard — start it, switch between Dashboard, Rules, and Detail views.
---

# TUI Dashboard

vmflow ships with a terminal UI for inspecting the live rule state and traffic counters of the local daemon.

## Start it

```bash
vmflow tui
```

Pass a token when authentication is enabled:

```bash
vmflow tui -token <token>
# or
VMFLOW_CONTROL_TOKEN=<token> vmflow tui
```

## Views

Press <kbd>Tab</kbd> to cycle between views:

| View | Shows |
| --- | --- |
| **Dashboard** | Overall health, running rule count, uptime. |
| **Rules** | The list of running rules with live counters; supports filtering rules by name. |
| **Detail** | Detail for the selected rule. |

## When to use it

The TUI is the quickest way to answer "what is vmflow doing right now?" without scraping metrics. For long-term history, point Prometheus at `/metrics` instead — the TUI only shows the in-memory current state.
