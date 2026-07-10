---
title: ランタイム API
description: 組み込み可能な vmflow.Runtime Go API のリファレンス — 構築、スナップショット適用、単一ルール操作、状態クエリ、ライフサイクル。
---

# ランタイム API

最上位の `github.com/cloudapp3/vmflow` パッケージが安定した組み込み用ファサードです。`engine` パッケージの上に `Runtime` を公開します。

## 構築

```go
rt := vmflow.New()                       // default options
rt, _ := vmflow.NewRuntime(vmflow.Options{
    Collector:    nil,                   // nil -> a new in-memory collector is created
    CertProvider: nil,                   // nil -> HTTPS rules disabled (HTTPS is disabled in current build anyway)
})
```

| 関数 | 戻り値 |
| --- | --- |
| `New() *Runtime` | デフォルトオプションの Runtime。 |
| `NewRuntime(opts Options) *Runtime` | 明示的なオプションの Runtime。 |

`Options`:

| フィールド | 型 | 備考 |
| --- | --- | --- |
| `Collector` | `*engine.Collector` | カウンタの共有/ラップ。`nil` で新規作成。 |
| `CertProvider` | `CertProvider` | HTTPS ルールを有効化（現在のビルドでは無効）。TCP/UDP の場合は `nil` のままにします。 |

## desired-state の適用

```go
result := rt.Apply(rules)                                       // full replacement (ReplaceAll=true)
result := rt.ApplySnapshot(rules, engine.ApplySnapshotOptions{ // explicit options
    ReplaceAll: true,
})
```

`Apply` は `engine.ApplyResult` を返します：

| フィールド | 意味 |
| --- | --- |
| `AppliedRules` / `StoppedRules` / `FailedRules` / `TotalRules` | アクションサマリの件数。 |
| `Items []ApplyItemResult` | ルールごとの結果（`RuleID`、`Revision`、`Action`、`Status`、`Error`）。 |

アプリケーションが独自のデータベースから完全な desired-state を計算する場合は `Apply` を推奨します。

## 単一ルール操作

```go
err := rt.StartRule(rule)   // start one rule; error if it cannot bind
err := rt.RestartRule(rule) // stop+start, picking up new fields
rt.StopRule(ruleID)         // stop, keep counters
rt.RemoveRule(ruleID)       // stop, drop counters
```

`StartRule` と `RestartRule` は `error` を返します（例: ポートが利用不可）。`StopRule` と `RemoveRule` は失敗しません。

## 状態とカウンタ

```go
rules := rt.RunningRules()      // []engine.Rule, sorted by rule_id
n := rt.RunningCount()          // int
snap := rt.Snapshot(ruleID)     // engine.TrafficSnapshot
snaps := rt.SnapshotAll()       // []engine.TrafficSnapshot, sorted by rule_id
```

カウンタはメモリ内のみです。履歴は独自のストアに永続化してください。

## ライフサイクル

```go
rt.StopAll()                 // stop all rules; keep the runtime reusable
err := rt.Close()            // stop all rules; mark runtime closed
err := rt.Shutdown(ctx)      // alias of Close today; ctx reserved for future graceful drain
```

`Close`/`Shutdown` の後は、以降の呼び出しは安全な no-op になります。状態クエリはゼロ値を返し、`Apply` は `FailedRules == len(rules)` の結果を返します。

## より低レベルなアクセス

```go
m := rt.Manager()    // *engine.Manager — advanced use
c := rt.Collector()  // *engine.Collector — read raw counters
```

ファサードメソッドが公開していないものが必要でない限り、ファサードメソッドを推奨します。

## `engine.Rule` フィールド

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

スナップショットの差分抽出ではランタイムフィールドだけが比較されます。メタデータ（`Remark`、`Revision`、タイムスタンプ）の編集は実行中のルールを再起動しません。[ルールとライフサイクル](./rules)を参照してください。
