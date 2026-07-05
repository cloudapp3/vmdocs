---
title: Embedding vmflow
description: Embed the vmflow forwarding runtime into your own Go control plane — responsibility split, recommended API, data flow, and persistence guidance.
---

# Embedding vmflow

vmflow can run as a standalone daemon, but the core forwarding runtime is also designed to be embedded into a larger Go control plane — your own service that already owns users, storage, a UI, or node orchestration.

## Responsibility split

Keep responsibilities separated when embedding:

| Layer | Owns |
| --- | --- |
| Your host application | database, users, billing, web UI, node orchestration, rule ownership, historical aggregation |
| vmflow runtime | TCP/UDP forwarding, rule lifecycle, max-connection enforcement, real-time counters |

The dependency direction is one-way:

```text
your application  ->  github.com/cloudapp3/vmflow
```

vmflow must not import your application's models, database code, or task protocols.

## Recommended API

For most embedders, use the top-level facade:

```go
package main

import (
    "github.com/cloudapp3/vmflow"
    "github.com/cloudapp3/vmflow/engine"
)

func main() {
    rt := vmflow.New()
    defer rt.Close()

    rules := []engine.Rule{
        {
            RuleID:     "ssh-forward",
            Name:       "ssh-forward",
            Protocol:   engine.ProtocolTCP,
            ListenAddr: "0.0.0.0",
            ListenPort: 2201,
            TargetAddr: "127.0.0.1",
            TargetPort: 22,
            Enabled:    true,
        },
    }

    result := rt.Apply(rules) // full replacement snapshot
    if result.FailedRules > 0 {
        // handle failed rules in your application
    }

    snapshots := rt.SnapshotAll()
    _ = snapshots
}
```

The lower-level `engine.Manager` API is also available for advanced use:

```go
manager := rt.Manager()
```

Prefer `Runtime.Apply` when your application computes the complete desired state from its own database. Use `StartRule`, `RestartRule`, `StopRule`, and `RemoveRule` only for targeted local operations.

See [Runtime API](./runtime) for the full method set.

## Data flow

Recommended flow for embedded use:

```text
your DB / business API
        ↓
convert business forwarding records to []engine.Rule
        ↓
vmflow.Runtime.Apply(rules)
        ↓
vmflow.Runtime.SnapshotAll()
        ↓
your application samples and persists traffic history in its own DB
```

When embedded, **avoid making YAML the source of truth**. Your application should own desired state and pass `[]engine.Rule` directly to vmflow.

## Persistence guidance

vmflow may provide a local store for standalone daemon mode. When embedded, prefer one of:

1. Persist traffic history and audit logs in your application's existing database.
2. Disable any local vmflow store.
3. Use vmflow only for real-time counters and forwarding lifecycle.

This avoids two competing sources of truth.

## HTTPS rules and certificates (disabled)

::: warning Disabled in current build
HTTPS forwarding and ACME/certificate management are **not enabled**: `engine` rule validation rejects `http`/`https` protocols, the daemon does not start ACME, and the `/v1/certs*` routes and `certs` CLI subcommand are removed. The notes below describe the reserved interface for when it is re-enabled. Source is retained in `acme/`, `certstore/`, `certreview/`, `engine/https.go`, `engine/proxy.go`.
:::

HTTPS rules require a certificate provider. The standalone daemon can use the built-in ACME manager. Embedded applications can inject their own provider:

```go
rt := vmflow.NewRuntime(vmflow.Options{
    CertProvider: myProvider,
})
```

The provider must satisfy:

```go
type CertProvider interface {
    GetCertificate(hello *tls.ClientHelloInfo) (*tls.Certificate, error)
    Obtain(ctx context.Context, domains []string) error
}
```

## Stable vs optional packages

Stable embedding surface:

```text
github.com/cloudapp3/vmflow
github.com/cloudapp3/vmflow/engine
```

Optional daemon/control packages:

```text
config/
controlapi/
tui/
bot/
acme/
cmd/
```

The optional packages are useful for standalone vmflow deployments but should not be required by an embedded integration.

## Shutdown

Use `Close` or `Shutdown` when your application exits:

```go
_ = rt.Shutdown(ctx)
```

The current implementation stops synchronously. The `Shutdown(ctx)` shape is reserved for future graceful-drain support.
