---
title: API de Runtime
description: Referência da API Go vmflow.Runtime incorporável — construção, aplicação de snapshot, operações de regra única, consultas de estado e ciclo de vida.
---

# API de Runtime

O pacote de nível superior `github.com/cloudapp3/vmflow` é a fachada estável de incorporação. Ele expõe um `Runtime` sobre o pacote `engine`.

## Construção

```go
rt := vmflow.New()                       // default options
rt, _ := vmflow.NewRuntime(vmflow.Options{
    Collector:    nil,                   // nil -> a new in-memory collector is created
    CertProvider: nil,                   // nil -> HTTPS rules disabled (HTTPS is disabled in current build anyway)
})
```

| Função | Retorna |
| --- | --- |
| `New() *Runtime` | Runtime com opções padrão. |
| `NewRuntime(opts Options) *Runtime` | Runtime com opções explícitas. |

`Options`:

| Campo | Tipo | Observações |
| --- | --- | --- |
| `Collector` | `*engine.Collector` | Compartilha/encapsula contadores. `nil` cria um novo. |
| `CertProvider` | `CertProvider` | Habilita regras HTTPS (desabilitado no build atual). Deixe `nil` para TCP/UDP. |

## Aplicando o estado desejado

```go
result := rt.Apply(rules)                                       // full replacement (ReplaceAll=true)
result := rt.ApplySnapshot(rules, engine.ApplySnapshotOptions{ // explicit options
    ReplaceAll: true,
})
```

`Apply` retorna um `engine.ApplyResult`:

| Campo | Significado |
| --- | --- |
| `AppliedRules` / `StoppedRules` / `FailedRules` / `TotalRules` | Contadores de resumo de ações. |
| `Items []ApplyItemResult` | Resultado por regra (`RuleID`, `Revision`, `Action`, `Status`, `Error`). |

Prefira `Apply` quando sua aplicação computar o estado desejado completo a partir de seu próprio banco de dados.

## Operações de regra única

```go
err := rt.StartRule(rule)   // start one rule; error if it cannot bind
err := rt.RestartRule(rule) // stop+start, picking up new fields
rt.StopRule(ruleID)         // stop, keep counters
rt.RemoveRule(ruleID)       // stop, drop counters
```

`StartRule` e `RestartRule` retornam um `error` (ex.: porta indisponível). `StopRule` e `RemoveRule` são infalíveis.

## Estado e contadores

```go
rules := rt.RunningRules()      // []engine.Rule, sorted by rule_id
n := rt.RunningCount()          // int
snap := rt.Snapshot(ruleID)     // engine.TrafficSnapshot
snaps := rt.SnapshotAll()       // []engine.TrafficSnapshot, sorted by rule_id
```

Os contadores são apenas em memória; persista o histórico em seu próprio armazenamento.

## Ciclo de vida

```go
rt.StopAll()                 // stop all rules; keep the runtime reusable
err := rt.Close()            // stop all rules; mark runtime closed
err := rt.Shutdown(ctx)      // alias of Close today; ctx reserved for future graceful drain
```

Após `Close`/`Shutdown`, chamadas posteriores tornam-se no-ops seguras: consultas de estado retornam valores zero e `Apply` retorna um resultado com `FailedRules == len(rules)`.

## Acesso de nível inferior

```go
m := rt.Manager()    // *engine.Manager — advanced use
c := rt.Collector()  // *engine.Collector — read raw counters
```

Prefira os métodos da fachada, a menos que você precise de algo que eles não exponham.

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

Apenas os campos de runtime são comparados ao diferenciar snapshots; editar metadados (`Remark`, `Revision`, timestamps) não reinicia uma regra em execução. Consulte [Regras e Ciclo de Vida](./rules).
