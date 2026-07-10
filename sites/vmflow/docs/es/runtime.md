---
title: Runtime API
description: Referencia de la API embebible de Go `vmflow.Runtime` — construcción, aplicación de instantánea, operaciones de regla única, consultas de estado y ciclo de vida.
---

# Runtime API

El paquete de nivel superior `github.com/cloudapp3/vmflow` es la fachada de embebido estable. Expone un `Runtime` sobre el paquete `engine`.

## Construcción

```go
rt := vmflow.New()                       // default options
rt, _ := vmflow.NewRuntime(vmflow.Options{
    Collector:    nil,                   // nil -> a new in-memory collector is created
    CertProvider: nil,                   // nil -> HTTPS rules disabled (HTTPS is disabled in current build anyway)
})
```

| Función | Devuelve |
| --- | --- |
| `New() *Runtime` | Runtime con opciones por defecto. |
| `NewRuntime(opts Options) *Runtime` | Runtime con opciones explícitas. |

`Options`:

| Campo | Tipo | Notas |
| --- | --- | --- |
| `Collector` | `*engine.Collector` | Comparte/envuelve contadores. `nil` crea uno nuevo. |
| `CertProvider` | `CertProvider` | Habilita las reglas HTTPS (deshabilitado en el build actual). Déjalo a `nil` para TCP/UDP. |

## Aplicar el estado deseado

```go
result := rt.Apply(rules)                                       // full replacement (ReplaceAll=true)
result := rt.ApplySnapshot(rules, engine.ApplySnapshotOptions{ // explicit options
    ReplaceAll: true,
})
```

`Apply` devuelve un `engine.ApplyResult`:

| Campo | Significado |
| --- | --- |
| `AppliedRules` / `StoppedRules` / `FailedRules` / `TotalRules` | Conteos del resumen de acciones. |
| `Items []ApplyItemResult` | Resultado por regla (`RuleID`, `Revision`, `Action`, `Status`, `Error`). |

Prefiere `Apply` cuando tu aplicación calcula el estado deseado completo desde su propia base de datos.

## Operaciones de regla única

```go
err := rt.StartRule(rule)   // start one rule; error if it cannot bind
err := rt.RestartRule(rule) // stop+start, picking up new fields
rt.StopRule(ruleID)         // stop, keep counters
rt.RemoveRule(ruleID)       // stop, drop counters
```

`StartRule` y `RestartRule` devuelven un `error` (p. ej. puerto no disponible). `StopRule` y `RemoveRule` son infalibles.

## Estado y contadores

```go
rules := rt.RunningRules()      // []engine.Rule, sorted by rule_id
n := rt.RunningCount()          // int
snap := rt.Snapshot(ruleID)     // engine.TrafficSnapshot
snaps := rt.SnapshotAll()       // []engine.TrafficSnapshot, sorted by rule_id
```

Los contadores son solo en memoria; persiste el historial en tu propio almacén.

## Ciclo de vida

```go
rt.StopAll()                 // stop all rules; keep the runtime reusable
err := rt.Close()            // stop all rules; mark runtime closed
err := rt.Shutdown(ctx)      // alias of Close today; ctx reserved for future graceful drain
```

Tras `Close`/`Shutdown`, las llamadas posteriores se convierten en no-ops seguras: las consultas de estado devuelven valores cero y `Apply` devuelve un resultado con `FailedRules == len(rules)`.

## Acceso de nivel inferior

```go
m := rt.Manager()    // *engine.Manager — advanced use
c := rt.Collector()  // *engine.Collector — read raw counters
```

Prefiere los métodos de la fachada salvo que necesites algo que no expongan.

## Campos de `engine.Rule`

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

Al hacer diff de instantáneas solo se comparan los campos de ejecución; editar metadatos (`Remark`, `Revision`, timestamps) no reinicia una regla en ejecución. Consulta [Reglas y ciclo de vida](./rules).
