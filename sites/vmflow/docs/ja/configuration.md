---
title: 設定
description: vmflow の YAML 設定リファレンス — コントロールアドレス、TLS、ロギング、認証トークン、転送ルール。
---

# 設定

vmflow は単一の YAML ファイルで駆動します。`-config` でデーモンに渡します。

```bash
vmflow daemon -config ./examples/config.yaml
```

リロード時にはこのファイルを再読み込みし、新しい desired-state を適用します（[ルールとライフサイクル](./rules)を参照）。

## 完全な例

```yaml
version: 1
control_listen_addr: 127.0.0.1:19090

log:
  level: info
  format: text # text or json

# Enable auth (or set control_tls.client_ca_file for mTLS) before exposing
# control_listen_addr outside localhost; otherwise the daemon refuses to start.
# The CLI/TUI can pass the token with -token or VMFLOW_CONTROL_TOKEN.
auth:
  enabled: false
  tokens:
    - name: admin
      token: change-me
      role: admin

rules:
  - rule_id: ssh-forward
    name: ssh-forward
    protocol: tcp
    listen_addr: 0.0.0.0
    listen_port: 2201
    target_addr: 127.0.0.1
    target_port: 22
    enabled: true
    speed_limit: 0
    max_conn: 0
    remark: example
```

## 最上位のフィールド

| フィールド | 説明 |
| --- | --- |
| `version` | 設定スキーマのバージョン。現在は `1`。 |
| `control_listen_addr` | ローカルコントロール API のリッスンアドレス。デフォルトは `127.0.0.1:19090`。認証や mTLS を有効にしない限りループバックにしておいてください。 |
| `control_tls` | コントロール API のオプション TLS / mTLS（後述の `control_tls` を参照）。 |
| `log` | 構造化ロギング — `level` と `format`。 |
| `auth` | Bearer トークン認証。`admin` / `viewer` ロール。 |
| `bot_token`, `bot_chat` | Telegram ボット — [Telegram ボット](./telegram-bot)を参照。 |
| `rules` | 転送ルール（後述の `rules[]` を参照）。 |

## `control_tls`

コントロール API のオプション TLS（および相互 TLS）。`cert_file` と `key_file` の両方を設定すると TLS が有効になり、`client_ca_file` を設定すると相互 TLS が有効になります。

```yaml
control_tls:
  cert_file: /etc/vmflow/server.pem
  key_file: /etc/vmflow/server.key
  client_ca_file: /etc/vmflow/client-ca.pem   # optional → mTLS
  min_version: "1.2"                           # "1.2" (default) or "1.3"
```

| フィールド | 説明 |
| --- | --- |
| `cert_file` | サーバー証明書のパス。 |
| `key_file` | サーバーキーのパス。 |
| `client_ca_file` | クライアント証明書用の CA バンドル。これを設定すると**相互 TLS** が有効になり、ループバック以外での起動時安全チェックを満たします。 |
| `min_version` | `1.2`（デフォルト）または `1.3`。 |

[HTTP API → TLS および相互 TLS](./api#tls-and-mutual-tls)を参照してください。クライアントは `-tls-ca-file`、`-tls-client-cert`、`-tls-client-key`、`-tls-skip-verify` を使用します — [共通クライアントフラグ](./commands#common-client-flags)を参照してください。

## `log`

| フィールド | 値 |
| --- | --- |
| `level` | ログレベル（例: `debug`、`info`、`warn`、`error`）。 |
| `format` | `text` または `json`。 |

## `auth`

コントロール API の Bearer トークン認証。[HTTP API](./api#authentication)を参照してください。

| フィールド | 説明 |
| --- | --- |
| `enabled` | `false` の場合、コントロール API はリクエストを匿名の admin レベルの呼び出し元として扱います — ループバックでのみ安全です。 |
| `tokens[].name` | トークンのラベル（認証には使われません）。 |
| `tokens[].token` | Bearer トークンの文字列。 |
| `tokens[].role` | `admin`（読み取り + 書き込み）または `viewer`（読み取り専用）。 |

## `rules[]`

各エントリが 1 つの転送ルールを記述します。

| フィールド | 説明 |
| --- | --- |
| `rule_id` | 安定した一意の ID。リロード間の差分抽出に使われます。 |
| `name` | 人間が読める名前。 |
| `protocol` | `tcp`、`udp`、または `tcp+udp`。 |
| `listen_addr` | リッスンするアドレス（例: `0.0.0.0`）。 |
| `listen_port` | リッスンするポート。 |
| `target_addr` | 転送先の上流アドレス。 |
| `target_port` | 上流のポート。 |
| `enabled` | `false` の場合、設定には残りますが起動しません。 |
| `speed_limit` | 接続ごとのレート制限（バイト/秒、`0` = 無制限）。 |
| `max_conn` | 最大同時接続数（`0` = 無制限）。キャップを超える新規接続は切断されます。 |
| `idle_timeout` | 接続ごとのアイドルタイムアウト（秒、`0` = デフォルトの 5 分）。変更するとルールは再起動します。 |
| `remark` | 自由形式のメモ。 |

::: tip
`http` および `https` プロトコルはソースには存在しますが、現在のビルドでは無効化されています。検証で拒否されます。[転送リファレンス](./forwarding)を参照してください。
:::

## その他のフィールド

上記のセクション以外にも、設定は Telegram ボットと ACME/証明書のフィールドを受け付けます。ボット関連フィールドと `control_tls` は**有効**ですが、ACME/証明書フィールドは HTTPS サポートを再度有効化するまでの予約であり、現在は無視されます。

| フィールド | 状態 |
| --- | --- |
| `control_tls` | 有効 — 上記の `control_tls` と [HTTP API](./api#tls-and-mutual-tls)を参照。 |
| `bot_token`, `bot_chat` | 有効 — [Telegram ボット](./telegram-bot)を参照。 |
| `acme_*`, `cert_cache_dir`, `cert_review.*` | 予約済み（現在のビルドでは無視されます）。 |
