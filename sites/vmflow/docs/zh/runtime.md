---
title: Runtime API
description: 可嵌入的 vmflow.Runtime Go API 参考——构造、快照应用、单规则操作、状态查询与生命周期。
---

# Runtime API

顶层 `github.com/cloudapp3/vmflow` 包是稳定的嵌入 facade。它在 `engine` 包之上暴露了一个 `Runtime`。

## 构造

```go
rt := vmflow.New()                       // default options
rt, _ := vmflow.NewRuntime(vmflow.Options{
    Collector:    nil,                   // nil -> a new in-memory collector is created
    CertProvider: nil,                   // nil -> HTTPS rules disabled (HTTPS is disabled in current build anyway)
})
```

| 函数 | 返回 |
| --- | --- |
| `New() *Runtime` | 使用默认选项的 Runtime。 |
| `NewRuntime(opts Options) *Runtime` | 使用显式选项的 Runtime。 |

`Options`：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `Collector` | `*engine.Collector` | 共享/包装计数器。`nil` 会创建一个新的。 |
| `CertProvider` | `CertProvider` | 启用 HTTPS 规则（当前构建中已禁用）。TCP/UDP 请保持 `nil`。 |

## 应用期望状态

```go
result := rt.Apply(rules)                                       // full replacement (ReplaceAll=true)
result := rt.ApplySnapshot(rules, engine.ApplySnapshotOptions{ // explicit options
    ReplaceAll: true,
})
```

`Apply` 返回一个 `engine.ApplyResult`：

| 字段 | 含义 |
| --- | --- |
| `AppliedRules` / `StoppedRules` / `FailedRules` / `TotalRules` | 动作汇总计数。 |
| `Items []ApplyItemResult` | 每条规则的结果（`RuleID`、`Revision`、`Action`、`Status`、`Error`）。 |

当你的应用从自己的数据库计算出完整的期望状态时，优先使用 `Apply`。

## 单规则操作

```go
err := rt.StartRule(rule)   // start one rule; error if it cannot bind
err := rt.RestartRule(rule) // stop+start, picking up new fields
rt.StopRule(ruleID)         // stop, keep counters
rt.RemoveRule(ruleID)       // stop, drop counters
```

`StartRule` 和 `RestartRule` 返回一个 `error`（例如端口不可用）。`StopRule` 和 `RemoveRule` 不会失败。

## 状态与计数器

```go
rules := rt.RunningRules()      // []engine.Rule, sorted by rule_id
n := rt.RunningCount()          // int
snap := rt.Snapshot(ruleID)     // engine.TrafficSnapshot
snaps := rt.SnapshotAll()       // []engine.TrafficSnapshot, sorted by rule_id
```

计数器仅存在于内存中；请在你自己的存储中持久化历史。

## 生命周期

```go
rt.StopAll()                 // stop all rules; keep the runtime reusable
err := rt.Close()            // stop all rules; mark runtime closed
err := rt.Shutdown(ctx)      // alias of Close today; ctx reserved for future graceful drain
```

在 `Close`/`Shutdown` 之后，后续调用都会成为安全的空操作：状态查询返回零值，而 `Apply` 会返回一个 `FailedRules == len(rules)` 的结果。

## 更底层的访问

```go
m := rt.Manager()    // *engine.Manager — advanced use
c := rt.Collector()  // *engine.Collector — read raw counters
```

除非你需要 facade 方法未暴露的能力，否则请优先使用 facade 方法。

## `engine.Rule` 字段

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

对快照进行 diff 时只比较运行时字段；修改元数据（`Remark`、`Revision`、时间戳）不会重启一条运行中的规则。参见[规则与生命周期](./rules)。
