---
title: TUI Dashboard
description: Inspect and manage vmflow rules, source IP policies, counters, precheck, and apply operations from the terminal UI.
---

# TUI Dashboard

vmflow ships with a terminal UI for inspecting and managing the configured rules and live traffic counters of the local daemon.

## Start it

With the default local target, `vmflow tui` manages the native service. Complete the system-service mode in `vmflow init`, or install and start the service before running:

```bash
vmflow tui
```

If the daemon was started manually in foreground mode, keep that terminal open and specify its address explicitly. This bypasses the native-service check:

```bash
vmflow tui -addr http://127.0.0.1:19090
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
| **Dashboard** | Health, forwarding totals, uptime, and the connected daemon's Host Network interfaces and RX/TX rates. |
| **Rules** | Configured rules, live traffic and quota status, staged changes, and access summaries. |
| **Detail** | Selected-rule bandwidth/quota policy, source IP entries, traffic, quota usage, and denial counters. |

## Rule management

An authenticated `admin` token can create, edit, copy, toggle, and delete rules. Viewer tokens and sessions without authentication are read-only. In the Rules view, use <kbd>n</kbd>/<kbd>e</kbd>/<kbd>c</kbd> to create, edit, or copy; <kbd>Space</kbd> to toggle; <kbd>d</kbd> to delete; <kbd>P</kbd> to precheck; and <kbd>A</kbd> to apply the validated draft.

The editor exposes `Source IP mode` as `OFF`, `ALLOWLIST`, or `DENYLIST`. Enter literal IPv4/IPv6 addresses and CIDRs in `Source IPs / CIDRs`, separated by commas. Precheck must pass before apply; the existing revision/ETag flow prevents a stale editor from overwriting a newer configuration.

Shared bandwidth rate plus daily and monthly quotas are in the basic editor. Directional upload/download limits and quota timezone are in advanced settings. Applying a changed policy restarts that rule, while current quota usage for the same `rule_id` remains intact.

Host Network is part of Dashboard, not a separate view. Press <kbd>4</kbd> to jump to it and <kbd>a</kbd> to switch between active physical interfaces and all interfaces. The data always comes from the connected daemon, including through an SSH tunnel. Interface counters are host traffic, not vmflow rule quotas or a bandwidth test.

## When to use it

The TUI is the quickest way to answer "what is vmflow doing right now?" without scraping metrics. For long-term history, point Prometheus at `/metrics` instead — the TUI only shows the in-memory current state.
