---
title: TUI Dashboard
description: Inspect and manage vmflow rules, source IP policies, counters, precheck, and apply operations from the terminal UI.
---

# TUI Dashboard

vmflow ships with a terminal UI for inspecting and managing the configured rules and live traffic counters of the local daemon.

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
| **Rules** | Configured rules, including disabled rules, live counters, staged changes, and an `OPEN` / `ALLOW n` / `DENY n` access summary on wide terminals. |
| **Detail** | Selected-rule settings, source IP entries, traffic, and the cumulative `IP Denied` counter. |

## Rule management

An authenticated `admin` token can create, edit, copy, toggle, and delete rules. Viewer tokens and sessions without authentication are read-only. In the Rules view, use <kbd>n</kbd>/<kbd>e</kbd>/<kbd>c</kbd> to create, edit, or copy; <kbd>Space</kbd> to toggle; <kbd>d</kbd> to delete; <kbd>P</kbd> to precheck; and <kbd>A</kbd> to apply the validated draft.

The editor exposes `Source IP mode` as `OFF`, `ALLOWLIST`, or `DENYLIST`. Enter literal IPv4/IPv6 addresses and CIDRs in `Source IPs / CIDRs`, separated by commas. Precheck must pass before apply; the existing revision/ETag flow prevents a stale editor from overwriting a newer configuration.

## When to use it

The TUI is the quickest way to answer "what is vmflow doing right now?" without scraping metrics. For long-term history, point Prometheus at `/metrics` instead — the TUI only shows the in-memory current state.
