---
title: Runtime API
description: Reference for the embeddable vmflow.Runtime Go API — construction, snapshot apply, single-rule ops, state queries, and lifecycle.
---

# Runtime API

The top-level `github.com/cloudapp3/vmflow` package is the stable embedding facade. It exposes a `Runtime` over the `engine` package.

## Construction

```go
rt := vmflow.New()                       // default options
rt, _ := vmflow.NewRuntime(vmflow.Options{
    Collector:    nil,                   // nil -> a new in-memory collector is created
    CertProvider: nil,                   // nil -> HTTPS rules disabled (HTTPS is disabled in current build anyway)
})
```

| Function | Returns |
| --- | --- |
| `New() *Runtime` | Runtime with default options. |
| `NewRuntime(opts Options) *Runtime` | Runtime with explicit options. |

`Options`:

| Field | Type | Notes |
| --- | --- | --- |
| `Collector` | `*engine.Collector` | Share/wrap counters. `nil` creates a new one. |
| `CertProvider` | `CertProvider` | Enables HTTPS rules (disabled in current build). Leave `nil` for TCP/UDP. |

## Applying desired state

```go
result := rt.Apply(rules)                                       // full replacement (ReplaceAll=true)
result := rt.ApplySnapshot(rules, engine.ApplySnapshotOptions{ // explicit options
    ReplaceAll: true,
})
```

`Apply` returns an `engine.ApplyResult`:

| Field | Meaning |
| --- | --- |
| `AppliedRules` / `StoppedRules` / `FailedRules` / `TotalRules` | Action summary counts. |
| `Items []ApplyItemResult` | Per-rule outcome (`RuleID`, `Revision`, `Action`, `Status`, `Error`). |

Prefer `Apply` when your application computes the full desired state from its own database.

## Single-rule operations

```go
err := rt.StartRule(rule)   // start one rule; error if it cannot bind
err := rt.RestartRule(rule) // stop+start, picking up new fields
rt.StopRule(ruleID)         // stop, keep counters
rt.RemoveRule(ruleID)       // stop, drop counters
```

`StartRule` and `RestartRule` return an `error` (e.g. port unavailable). `StopRule` and `RemoveRule` are infallible.

## State and counters

```go
rules := rt.RunningRules()      // []engine.Rule, sorted by rule_id
n := rt.RunningCount()          // int
snap := rt.Snapshot(ruleID)     // engine.TrafficSnapshot
snaps := rt.SnapshotAll()       // []engine.TrafficSnapshot, sorted by rule_id
```

Counters are in-memory only; persist history in your own store.

## Lifecycle

```go
rt.StopAll()                 // stop all rules; keep the runtime reusable
err := rt.Close()            // stop all rules; mark runtime closed
err := rt.Shutdown(ctx)      // alias of Close today; ctx reserved for future graceful drain
```

After `Close`/`Shutdown`, further calls become safe no-ops: state queries return zero values and `Apply` returns a result with `FailedRules == len(rules)`.

## Lower-level access

```go
m := rt.Manager()    // *engine.Manager — advanced use
c := rt.Collector()  // *engine.Collector — read raw counters
```

Prefer the facade methods unless you need something they do not expose.

## `engine.Rule` fields

```go
rules := []engine.Rule{
    {
        RuleID:      "ssh-forward",
        Name:        "ssh-forward",
        Protocol:    engine.ProtocolTCP, // ProtocolTCP | ProtocolUDP | ProtocolTCPUDP
        ListenAddr:  "0.0.0.0",
        ListenPort:  2201,
        TargetAddr:  "127.0.0.1",
        TargetPort:  22,
        Enabled:     true,
        SpeedLimit:  0,   // bytes/sec, 0 = unlimited
        MaxConn:     0,   // 0 = unlimited
        Remark:      "example",
    },
}
```

Only runtime fields are compared when diffing snapshots; editing metadata (`Remark`, `Revision`, timestamps) does not restart a running rule. See [Rules & Lifecycle](../guide/rules).
