---
title: 設定
description: ローカル管理、ログ、認証、統計、転送ルール、送信元 IP アクセスポリシーの vmflow YAML 設定リファレンス。
---

# 設定

vmflow は単一の YAML ファイルで駆動します。`-config` でデーモンに渡します。

```bash
vmflow -config ./examples/config.yaml
```

リロード時にはこのファイルを再読み込みし、新しい desired-state を適用します（[ルールとライフサイクル](./rules)を参照）。

## 完全な例

```yaml
version: 1
control_port: 19090

log:
  level: info
  format: text # text or json

# 管理チャネルは常に 127.0.0.1 にバインドされ、ポートだけを設定します。
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
    source_ip_mode: allowlist
    source_ips:
      - 203.0.113.8
      - 198.51.100.0/24
      - 2001:db8:100::/48
    remark: example
```

## 最上位のフィールド

| フィールド | 説明 |
| --- | --- |
| `version` | 設定スキーマのバージョン。現在は `1`。 |
| `control_port` | ローカル管理ポート。既定値は `19090`、ホストは常に `127.0.0.1` です。 |
| `log` | 構造化ロギング — `level` と `format`。 |
| `auth` | Bearer トークン認証。`admin` / `viewer` ロール。 |
| `bot_token`, `bot_chat` | Telegram ボット — [Telegram ボット](./telegram-bot)を参照。 |
| `rules` | 転送ルール（後述の `rules[]` を参照）。 |

## `log`

| フィールド | 値 |
| --- | --- |
| `level` | ログレベル（例: `debug`、`info`、`warn`、`error`）。 |
| `format` | `text` または `json`。 |

## `auth`

CLI/TUI 管理用の Bearer token 認証。

| フィールド | 説明 |
| --- | --- |
| `enabled` | ローカル管理ツールに設定済み token を要求します。 |
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
| `source_ip_mode` | 送信元 IP の許可モード：`off`、`allowlist`、`denylist`。省略時は `off`。 |
| `source_ips` | 選択したモードで使用する IPv4/IPv6 リテラルまたは CIDR。1 ルール最大 256 件。 |
| `remark` | 自由形式のメモ。 |

## 送信元 IP アクセスポリシー

`allowlist` は `source_ips` に一致する接続元だけを許可します。`denylist` は一致する接続元を拒否し、それ以外を許可します。allowlist または denylist を有効にする場合は 1 件以上必要です。ホスト名、不正または空のアドレス、256 件を超えるリストは拒否されます。

TCP は `max_conn` を消費したりターゲットへ接続したりする前に socket peer を検査します。UDP はセッション作成やルール単位・全体の UDP 枠を消費する前に検査します。モードまたは有効なエントリを変更するとルールが再起動し、既存の TCP 接続と UDP セッションが閉じられるため、新しいポリシーが直ちに適用されます。

ポリシーが見るのは実際の socket peer です。NAT や L4 プロキシの背後では、元のクライアントではなくゲートウェイやプロキシのアドレスになる場合があります。vmflow は転送 HTTP ヘッダーや PROXY protocol メタデータを信頼しません。大規模な攻撃の第一層にはクラウドファイアウォール、セキュリティグループ、ホストファイアウォールを使用してください。

::: tip
`http` および `https` プロトコルはソースには存在しますが、現在のビルドでは無効化されています。検証で拒否されます。[転送リファレンス](./forwarding)を参照してください。
:::

## その他のフィールド

| フィールド | 状態 |
| --- | --- |
| `bot_token`, `bot_chat` | 有効 — [Telegram ボット](./telegram-bot)を参照。 |
| `acme_*`, `cert_cache_dir`, `cert_review.*` | 予約済み（現在のビルドでは無視されます）。 |
