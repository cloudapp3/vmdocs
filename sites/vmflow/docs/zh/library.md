---
title: 嵌入 vmflow
description: 将 vmflow 转发运行时嵌入你自己的 Go 控制面——职责划分、推荐 API、数据流，以及持久化指引。
---

# 嵌入 vmflow

vmflow 可以作为独立守护进程运行，但其核心转发运行时也被设计为可嵌入到一个更大的 Go 控制面中——即你自己的、已经拥有用户、存储、UI 或节点编排的服务。

## 职责划分

嵌入时请保持职责分离：

| 层 | 拥有 |
| --- | --- |
| 你的宿主应用 | 数据库、用户、计费、Web UI、节点编排、规则归属、历史聚合 |
| vmflow 运行时 | TCP/UDP 转发、规则生命周期、最大连接数限制、实时计数器 |

依赖方向是单向的：

```text
your application  ->  github.com/cloudapp3/vmflow
```

vmflow 不得导入你应用的模型、数据库代码或任务协议。

## 推荐 API

对大多数嵌入者，请使用顶层 facade：

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

更底层的 `engine.Manager` API 也可用于高级场景：

```go
manager := rt.Manager()
```

当你的应用从自己的数据库计算出完整的期望状态时，优先使用 `Runtime.Apply`。仅在有针对性的本地操作时才使用 `StartRule`、`RestartRule`、`StopRule` 和 `RemoveRule`。

完整的方法集参见 [Runtime API](./runtime)。

## 数据流

嵌入式使用的推荐流程：

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

嵌入时，**避免把 YAML 作为唯一事实来源**。你的应用应当拥有期望状态，并直接把 `[]engine.Rule` 传给 vmflow。

## 持久化指引

vmflow 可能会为独立守护进程模式提供一个本地存储。嵌入时，优先选择以下方式之一：

1. 在你应用现有的数据库中持久化流量历史和审计日志。
2. 禁用任何 vmflow 本地存储。
3. 仅将 vmflow 用于实时计数器和转发生命周期。

这可以避免出现两个相互竞争的事实来源。

## HTTPS 规则与证书（已禁用）

::: warning 当前构建中已禁用
HTTPS 转发和 ACME/证书管理**未启用**：`engine` 规则校验会拒绝 `http`/`https` 协议，守护进程不会启动 ACME，`/v1/certs*` 路由和 `certs` CLI 子命令已被移除。下文描述的是日后重新启用时所预留的接口。源码保留在 `acme/`、`certstore/`、`certreview/`、`engine/https.go`、`engine/proxy.go` 中。
:::

HTTPS 规则需要一个证书提供方。独立守护进程可以使用内置的 ACME 管理器。嵌入的应用可以注入自己的提供方：

```go
rt := vmflow.NewRuntime(vmflow.Options{
    CertProvider: myProvider,
})
```

该提供方必须满足：

```go
type CertProvider interface {
    GetCertificate(hello *tls.ClientHelloInfo) (*tls.Certificate, error)
    Obtain(ctx context.Context, domains []string) error
}
```

## 稳定包与可选包

稳定的嵌入接口面：

```text
github.com/cloudapp3/vmflow
github.com/cloudapp3/vmflow/engine
```

可选的守护进程/控制面包：

```text
config/
controlapi/
tui/
bot/
acme/
cmd/
```

这些可选包对独立的 vmflow 部署很有用，但不应被嵌入式集成所依赖。

## 关闭

当你的应用退出时，请使用 `Close` 或 `Shutdown`：

```go
_ = rt.Shutdown(ctx)
```

当前实现是同步停止的。`Shutdown(ctx)` 的签名是为将来支持优雅排空而预留的。
