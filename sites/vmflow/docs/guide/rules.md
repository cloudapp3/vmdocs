---
title: Rules & Lifecycle
description: Manage vmflow forwarding rules — single-rule operations, full snapshot apply with incremental diff, and state queries.
---

# Rules & Lifecycle

A *rule* is the unit vmflow manages: one `{protocol, listen, target}` forwarding entry with limits and metadata. Rules have a lifecycle that can be driven one-at-a-time or as a whole desired-state snapshot.

## Stable identity

Each rule has a `rule_id` that must be unique within a config/snapshot. The ID is how vmflow matches an incoming rule against a running one to decide what changed. Keep IDs stable across reloads — that is what makes diffing work.

## Single-rule operations

| Operation | Effect |
| --- | --- |
| `StartRule` | Start one rule (must not already be running). |
| `RestartRule` | Stop and start a running rule, picking up new fields. |
| `StopRule` | Stop a running rule; keep its config. |
| `RemoveRule` | Stop and drop a rule from the live set. |

These are good for targeted local operations. When you have a full desired state, prefer snapshot apply instead.

## Snapshot apply

`ApplySnapshot(rules, opts)` takes the complete desired set of rules and reconciles it against what is running. With `ReplaceAll`, any running rule absent from the snapshot is stopped.

For each rule, apply produces one action:

| Action | Meaning |
| --- | --- |
| `started` | Rule is in the snapshot but was not running. |
| `restarted` | Rule was running but its runtime fields changed. |
| `stopped` | Rule was running but is absent from the snapshot (with `ReplaceAll`). |
| `removed` | Rule was stopped and dropped. |
| `unchanged` | Rule was running and its runtime fields did not change. |
| `failed` | The rule could not be started (e.g. port unavailable). |

…and a summary: `Applied`, `Stopped`, `Failed`, `Total`.

::: tip What counts as "changed"?
Only runtime fields (protocol, listen address/port, target address/port, speed limit, max conn, enabled) are compared. Editing `remark` or timestamps does **not** restart a rule.
:::

## Reload

`POST /v1/reload` reloads the config file and runs `ApplySnapshot` with `ReplaceAll = true`. It runs [precheck](./precheck) first; on any error the reload is rejected and running rules are untouched.

## State queries

| Method | Returns |
| --- | --- |
| `RunningRules` / `RunningCount` | Currently running rules / count. |
| `Snapshot(id)` | Live state for one rule. |
| `SnapshotAll()` | Live state for all running rules. |
| `StopAll()` | Stop everything (e.g. on shutdown). |

See [HTTP API](../api) for the HTTP equivalents (`GET /v1/rules`, `GET /v1/stats`).
