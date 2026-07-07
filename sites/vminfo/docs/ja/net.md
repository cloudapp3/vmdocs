---
title: net
description: オンデマンドのネットワーク診断 —— DNS 解決、TCP ポートプローブ、ping、パブリック IP / 地理情報の照会。
---

# `vminfo net`

ホスト指標の取得に使っているのと同じバイナリで、一度限りのネットワーク診断を実行できます。各サブコマンドはデフォルトで人間が読みやすい出力を行い、スクリプト用に `--json` を受け付けます。

## サブコマンド

| 操作 | 内容 |
| --- | --- |
| `net dns` | ドメイン名をアドレスに解決 |
| `net port` | `host:port` への TCP 接続性とレイテンシをテスト |
| `net ping` | TCP ダイアルまたは ICMP RTT でホストをプローブ |
| `net ip` | パブリック IP と ASN / 地理情報を照会 |

## `net dns`

```bash
vminfo net dns example.com
vminfo net dns example.com --server 1.1.1.1
vminfo net dns example.com --server 1.1.1.1 --json
```

| フラグ | 説明 |
| --- | --- |
| 位置引数 domain | 解決するドメイン（1 つだけ） |
| `--server` | DNS サーバー（`host` または `host:port`）。空 = システムデフォルト |
| `--json` | 結果を JSON で出力 |

## `net port`

```bash
vminfo net port example.com 443
vminfo net port example.com 443 --timeout 3s --json
```

| フラグ | 説明 |
| --- | --- |
| `host` / `port` | 対象ホストとポート（1–65535） |
| `--timeout` | ダイアルタイムアウト、デフォルト `2s` |
| `--json` | 結果を JSON で出力 |

## `net ping`

```bash
vminfo net ping example.com                       # TCP ping、ポート 80
vminfo net ping example.com --tcp-port 443        # 443 で TCP ping
vminfo net ping example.com --mode icmp           # 実 ICMP ping（権限が必要）
vminfo net ping example.com --count 6 --json
```

| フラグ | 説明 |
| --- | --- |
| 位置引数 host | プローブするホスト（1 つだけ） |
| `--mode` | `tcp`（デフォルト）または `icmp` |
| `--count` | プローブ回数、デフォルト `4` |
| `--timeout` | 1 回あたりのプローブタイムアウト、デフォルト `1s` |
| `--tcp-port` | TCP 対象ポート、デフォルト `80`（tcp モードのみ） |
| `--json` | 結果を JSON で出力 |

::: tip TCP と ICMP
`tcp` モードは TCP ダイアルの RTT を計測します —— クロスプラットフォームかつ非特権で動くため、どこでも使えます。`icmp` モードは `golang.org/x/net` 経由で実際の ICMP Echo パケットを送信します。Linux では非特権 UDP ICMP ソケットを許可する `net.ipv4.ping_group_range` の設定が必要で、Windows ではサポートされません。ICMP が使えない場合は `--mode tcp` に切り替えてください。
:::

## `net ip`

```bash
vminfo net ip                       # 自マシンのパブリック IP + ASN / 地理情報
vminfo net ip 8.8.8.8               # 特定 IP を照会
vminfo net ip --json
```

| フラグ | 説明 |
| --- | --- |
| 位置引数 ip | 任意の照会対象 IP。省略 = 自マシンのパブリック IP |
| `--server` | 照会サービスのベース URL、デフォルト `https://ip.bestcheapvps.org` |
| `--json` | 結果を JSON で出力 |

::: warning 外部リクエスト
`net ip` は、ASN・地理情報・リスクフラグを取得するため、第三者の照会サービス（デフォルトは `ip.bestcheapvps.org`）に対してユーザーが明示的にトリガーしたリクエストを 1 回だけ送信します。この挙動は `--help` とコマンド出力にも明記されています。自動的に実行されることはなく、ユーザーが要求したときだけ実行されます。
:::

## メモ

- 人間が読める出力はローカライズされます。JSON 出力は安定しており、言語に依存しません。
- JSON の結果ではタイミングを `elapsed_ms` で返し、エラーは `error` フィールドで示します。
- これらの診断は、 Web ダッシュボードから [`POST /api/v1/net/diag`](/ja/api#post-api-v1-net-diag) 経由でも利用できます。

## 例

```bash
vminfo net ping example.com --tcp-port 443 --count 4 --json
```

## 関連情報

- [HTTP API](/ja/api)
- [Web ダッシュボード](/ja/web-dashboard)
