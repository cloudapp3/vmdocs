---
title: vmflow ctl
description: Query and manage a running vmflow daemon through the supported CLI.
---

# vmflow ctl

```bash
vmflow ctl [-token TOKEN] <subcommand>
```

Alias: `vmflow c`.

`ctl` is the supported command interface for the local daemon. Use `-token` (or `VMFLOW_CONTROL_TOKEN`) when authentication is enabled.

## Subcommands

| Subcommand | Description |
| --- | --- |
| `rules` | List running rules. |
| `stats` | Show per-rule traffic counters. |
| `metrics` | Print Prometheus text metrics. |
| `precheck` | Validate the current config without applying it. |
| `reload` | Reload config and re-apply it after precheck. |

## Examples

```bash
vmflow ctl rules
vmflow ctl stats
vmflow ctl precheck
vmflow ctl reload
vmflow ctl -token change-me reload
```

::: tip
Mutating subcommands (`reload`) require an `admin` token when auth is enabled. Read-only subcommands work with a `viewer` token.
:::
