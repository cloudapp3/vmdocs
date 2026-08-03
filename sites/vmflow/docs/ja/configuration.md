---
title: 設定
description: ローカル管理、ログ、認証、統計、転送ルール、送信元 IP アクセスポリシーの vmflow YAML 設定リファレンス。
---

# 設定

vmflow は単一の YAML ファイルで駆動します。`vmflow run` はデフォルトで platform user config path を読み込みます。

```bash
vmflow run
```

必要な場合はパスを明示して上書きできます。

```bash
vmflow run -config /path/to/config.yaml
```

リロード時には現在有効な設定パスを再読み込みし、新しい desired-state を適用します（[ルールとライフサイクル](./rules)を参照）。

## 完全な例

```yaml
version: 1
language: en
control_port: 19090
udp_max_sessions: 256

log:
  level: info
  format: text # text or json

stats:
  persist: false
  flush_interval: 60s

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
    bandwidth_limit:
      rate: 100 Mbps
    traffic_quota:
      daily: 100 GB
      monthly: 1 TB
      timezone: Asia/Shanghai
      action: block
    speed_limit: 0 # 旧形式の接続ごとの B/s 制限
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

## 共有帯域制限とトラフィッククォータ

`bandwidth_limit` は `rule_id` 全体の合計トラフィックを制限します。同じルールの TCP 接続と UDP セッションは方向別バケットを共有し、`tcp+udp` の両プロトコルも共有します。同じ上り・下り制限には `rate`、非対称制限には `upload` と `download` を使用します。省略した方向は無制限で、burst は vmflow が自動計算します。

`bps`/`Kbps`/`Mbps`/`Gbps` は bit/s、`B/s`/`KB/s`/`MB/s`/`GB/s`/`KiB/s`/`MiB/s` は byte/s で、大文字小文字を区別します。`traffic_quota.daily` と `monthly` は成功した上り + 下りペイロードを合算します。10 進の `GB`/`TB`、2 進の `GiB`/`TiB`、IANA `timezone` を使用できます。`action` は省略可能で、現在は `block` のみです。

クォータは `stats.persist: false` でも `quota-state.json` に永続化され、再起動や同じ `rule_id` の再追加ではリセットされません。`language` は `en` または `zh-CN` のみです。DNS は設定不要で、OS リゾルバーの一時障害時に `223.5.5.5:53`、次に `119.29.29.29:53` を使用します。`NXDOMAIN` はフォールバックしません。

::: tip
`http` および `https` プロトコルはソースには存在しますが、現在のビルドでは無効化されています。検証で拒否されます。[転送リファレンス](./forwarding)を参照してください。
:::

## その他のフィールド

| フィールド | 状態 |
| --- | --- |
| `bot_token`, `bot_chat` | 有効 — [Telegram ボット](./telegram-bot)を参照。 |
| `acme_*`, `cert_cache_dir`, `cert_review.*` | 予約済み（現在のビルドでは無視されます）。 |
