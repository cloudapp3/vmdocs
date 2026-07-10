---
title: vmflow ctl
description: 実行中の vmflow デーモンをクエリ・制御する — health、rules、stats、metrics、precheck、reload。
---

# vmflow ctl

```bash
vmflow ctl [-addr http://127.0.0.1:19090] [-token TOKEN] <subcommand>
```

エイリアス: `vmflow c`。

`ctl` は[コントロール API](./api) の上の薄いクライアントです。`-addr` でデーモンを対象とし、認証が有効な場合は `-token`（または `VMFLOW_CONTROL_TOKEN`）で認証します。共有クライアントフラグの完全なセット — TLS/mTLS やカスタムヘッダーを含む — は[共通クライアントフラグ](./commands#common-client-flags)に記載されています。

## サブコマンド

| サブコマンド | 対応 API | 説明 |
| --- | --- | --- |
| `health` | `GET /healthz` | デーモンの健全性と実行中ルール数。 |
| `rules` | `GET /v1/rules` | 実行中ルールを一覧表示。 |
| `stats` | `GET /v1/stats` | ルールごとのトラフィックカウンタ（メモリ内スナップショット）。 |
| `metrics` | `GET /metrics` | Prometheus テキスト exposition。 |
| `precheck` | `POST /v1/precheck` | 現在の設定を適用せずに検証。 |
| `reload` | `POST /v1/reload` | 設定をリロードし、プレチェック後に再適用。 |

## 例

```bash
vmflow ctl health
vmflow ctl rules
vmflow ctl stats
vmflow ctl reload
vmflow ctl -token change-me reload

# against a TLS-protected control API using a private CA and mTLS client cert
vmflow ctl -addr https://10.0.0.5:19090 \
  -tls-ca-file ca.pem -tls-client-cert client.pem -tls-client-key client.key \
  reload

# send an extra header (e.g. a Cloudflare Access service token)
vmflow ctl -H "CF-Access-Client-Id: xxx" -H "CF-Access-Client-Secret: yyy" reload
```

::: tip
変更を伴うサブコマンド（`reload`）は、認証が有効な場合 `admin` トークンを要求します。読み取り専用のサブコマンドは `viewer` トークンで動作します。
:::
