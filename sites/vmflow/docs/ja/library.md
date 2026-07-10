---
title: vmflow の組み込み
description: vmflow の転送ランタイムを独自の Go コントロールプレーンに組み込む — 責務の分割、推奨 API、データフロー、永続化の指針。
---

# vmflow の組み込み

vmflow はスタンドアロンのデーモンとして実行できますが、コアの転送ランタイムはより大きな Go コントロールプレーン — ユーザー、ストレージ、UI、ノードオーケストレーションを既に所有している独自のサービス — に組み込むようにも設計されています。

## 責務の分割

組み込む際は責務を分離しておきます：

| レイヤー | 所有するもの |
| --- | --- |
| ホストアプリケーション | データベース、ユーザー、課金、Web UI、ノードオーケストレーション、ルールの所有権、履歴集計 |
| vmflow ランタイム | TCP/UDP 転送、ルールライフサイクル、最大接続数の強制、リアルタイムカウンタ |

依存の方向は一方向です：

```text
your application  ->  github.com/cloudapp3/vmflow
```

vmflow はアプリケーションのモデル、データベースコード、タスクプロトコルを import してはなりません。

## 推奨 API

ほとんどの組み込み利用者には、最上位のファサードを使います：

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

より高度な用途では、下層の `engine.Manager` API も利用できます：

```go
manager := rt.Manager()
```

アプリケーションが独自のデータベースから完全な desired-state を計算する場合は `Runtime.Apply` を推奨します。`StartRule`、`RestartRule`、`StopRule`、`RemoveRule` は対象を絞ったローカル操作にのみ使ってください。

完全なメソッドセットについては [ランタイム API](./runtime) を参照してください。

## データフロー

組み込み利用の推奨フロー：

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

組み込み時は、**YAML を信頼の唯一の情報源にしないでください**。アプリケーションが desired-state を所有し、`[]engine.Rule` を直接 vmflow に渡すべきです。

## 永続化の指針

vmflow はスタンドアロンのデーモンモード向けにローカルストアを提供する場合があります。組み込み時は、次のいずれかを推奨します：

1. トラフィック履歴と監査ログをアプリケーションの既存のデータベースに永続化する。
2. vmflow のローカルストアがあれば無効にする。
3. vmflow をリアルタイムカウンタと転送ライフサイクルのためだけに使う。

これにより、競合する 2 つの信頼の情報源を回避できます。

## HTTPS ルールと証明書（無効）

::: warning 現在のビルドでは無効
HTTPS 転送と ACME/証明書管理は**有効になっていません**。`engine` のルール検証は `http`/`https` プロトコルを拒否し、デーモンは ACME を開始せず、`/v1/certs*` ルートと `certs` CLI サブコマンドは削除されています。以下の注記は、再度有効化された際のための予約されたインターフェースを説明するものです。ソースは `acme/`、`certstore/`、`certreview/`、`engine/https.go`、`engine/proxy.go` に保持されています。
:::

HTTPS ルールには証明書プロバイダが必要です。スタンドアロンデーモンは組み込みの ACME マネージャを使えます。組み込みアプリケーションは独自のプロバイダを注入できます：

```go
rt := vmflow.NewRuntime(vmflow.Options{
    CertProvider: myProvider,
})
```

プロバイダは次を満たす必要があります：

```go
type CertProvider interface {
    GetCertificate(hello *tls.ClientHelloInfo) (*tls.Certificate, error)
    Obtain(ctx context.Context, domains []string) error
}
```

## 安定パッケージとオプションパッケージ

安定した組み込み表面：

```text
github.com/cloudapp3/vmflow
github.com/cloudapp3/vmflow/engine
```

オプションのデーモン/コントロールパッケージ：

```text
config/
controlapi/
tui/
bot/
acme/
cmd/
```

これらのオプションパッケージはスタンドアロンの vmflow デプロイメントでは有用ですが、組み込みの統合からは必須にすべきではありません。

## シャットダウン

アプリケーション終了時に `Close` または `Shutdown` を使います：

```go
_ = rt.Shutdown(ctx)
```

現在の実装は同期的に停止します。`Shutdown(ctx)` の形状は将来のグレースフルドレイン対応のために予約されています。
