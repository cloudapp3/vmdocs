---
title: Runtime API
description: Справочник по встраиваемому Go-API vmflow.Runtime — конструирование, применение снимка, операции над отдельными правилами, запросы состояния и жизненный цикл.
---

# Runtime API

Пакет верхнего уровня `github.com/cloudapp3/vmflow` — стабильный фасад для встраивания. Он предоставляет `Runtime` поверх пакета `engine`.

## Конструирование

```go
rt := vmflow.New()                       // default options
rt, _ := vmflow.NewRuntime(vmflow.Options{
    Collector:    nil,                   // nil -> a new in-memory collector is created
    CertProvider: nil,                   // nil -> HTTPS rules disabled (HTTPS is disabled in current build anyway)
})
```

| Функция | Возвращает |
| --- | --- |
| `New() *Runtime` | Runtime с параметрами по умолчанию. |
| `NewRuntime(opts Options) *Runtime` | Runtime с явными параметрами. |

`Options`:

| Поле | Тип | Примечания |
| --- | --- | --- |
| `Collector` | `*engine.Collector` | Разделение/обёртка счётчиков. `nil` создаёт новый. |
| `CertProvider` | `CertProvider` | Включает правила HTTPS (отключено в текущей сборке). Оставьте `nil` для TCP/UDP. |

## Применение желаемого состояния

```go
result := rt.Apply(rules)                                       // full replacement (ReplaceAll=true)
result := rt.ApplySnapshot(rules, engine.ApplySnapshotOptions{ // explicit options
    ReplaceAll: true,
})
```

`Apply` возвращает `engine.ApplyResult`:

| Поле | Значение |
| --- | --- |
| `AppliedRules` / `StoppedRules` / `FailedRules` / `TotalRules` | Сводные счётчики действий. |
| `Items []ApplyItemResult` | Результат по каждому правилу (`RuleID`, `Revision`, `Action`, `Status`, `Error`). |

Предпочитайте `Apply`, когда ваше приложение вычисляет полное желаемое состояние из собственной базы данных.

## Операции над отдельными правилами

```go
err := rt.StartRule(rule)   // start one rule; error if it cannot bind
err := rt.RestartRule(rule) // stop+start, picking up new fields
rt.StopRule(ruleID)         // stop, keep counters
rt.RemoveRule(ruleID)       // stop, drop counters
```

`StartRule` и `RestartRule` возвращают `error` (например, порт недоступен). `StopRule` и `RemoveRule` не возвращают ошибок.

## Состояние и счётчики

```go
rules := rt.RunningRules()      // []engine.Rule, sorted by rule_id
n := rt.RunningCount()          // int
snap := rt.Snapshot(ruleID)     // engine.TrafficSnapshot
snaps := rt.SnapshotAll()       // []engine.TrafficSnapshot, sorted by rule_id
```

Счётчики хранятся только в памяти; историю сохраняйте в собственном хранилище.

## Жизненный цикл

```go
rt.StopAll()                 // stop all rules; keep the runtime reusable
err := rt.Close()            // stop all rules; mark runtime closed
err := rt.Shutdown(ctx)      // alias of Close today; ctx reserved for future graceful drain
```

После `Close`/`Shutdown` дальнейшие вызовы становятся безопасными пустыми операциями: запросы состояния возвращают нулевые значения, а `Apply` возвращает результат с `FailedRules == len(rules)`.

## Нижнеуровневый доступ

```go
m := rt.Manager()    // *engine.Manager — advanced use
c := rt.Collector()  // *engine.Collector — read raw counters
```

Предпочитайте методы фасада, если только вам не нужно то, чего они не предоставляют.

## Поля `engine.Rule`

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

При сравнении снимков учитываются только поля времени выполнения; редактирование метаданных (`Remark`, `Revision`, временные метки) не перезапускает работающее правило. См. [Правила и жизненный цикл](./rules).
