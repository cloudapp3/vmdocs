---
title: HTTP API
description: vmflow のローカルコントロール API — 認証、TLS/mTLS、ヘルス、ルール、統計、プレチェック、リロード、Prometheus メトリクス。
---

# HTTP API

デーモンはローカルのコントロール API を公開します。デフォルトのリッスンアドレスは `127.0.0.1:19090` です。CLI と TUI はこれらのエンドポイントの上の薄いクライアントです。

## 認証 {#authentication}

コントロール API は 2 つのロールを持つ Bearer トークン認証をサポートします。

```yaml
auth:
  enabled: true
  tokens:
    - name: admin
      token: change-me
      role: admin
    - name: viewer
      token: view-only
      role: viewer
```

```bash
curl -H "Authorization: Bearer change-me" http://127.0.0.1:19090/v1/stats
```

```bash
vmflow ctl -token change-me stats
VMFLOW_CONTROL_TOKEN=change-me vmflow tui
```

| ロール | 許可 |
| --- | --- |
| `viewer` | 読み取りエンドポイント: `health`、`rules`、`stats`、`metrics`。 |
| `admin` | `viewer` にできるすべてに加え、`reload`。 |

トークンの比較は定時間比較（constant-time comparison）で行われます。`auth.enabled: false` の場合、リクエストは匿名の admin レベルの呼び出し元として扱われます — ループバックでのみ安全です。

認証無効での非ループバックバインドは**起動を拒否**します（フェイルクローズド）。`127.0.0.1` にバインドする、`auth` を有効にする、相互 TLS（`control_tls.client_ca_file`）を有効にする、またはデーモンに `-insecure-allow-remote-control` を渡して再びオプトインしてください。1 つのピア IP からの認証失敗の繰り返し（1 分間に 10 回）は HTTP `429` でスロットルされ、1 分間ロックアウトされます。これはベストエフォートです（ピア IP 単位、再起動でリセット）。

## TLS と相互 TLS {#tls-and-mutual-tls}

コントロール API は TLS でサービスを提供でき、オプションでクライアント証明書を要求できます（相互 TLS）。`control_tls` で設定します：

```yaml
control_listen_addr: 0.0.0.0:19090
control_tls:
  cert_file: /etc/vmflow/server.pem
  key_file:  /etc/vmflow/server.key
  client_ca_file: /etc/vmflow/client-ca.pem   # optional → enables mTLS
  min_version: "1.2"                           # "1.2" (default) or "1.3"
```

- `cert_file` と `key_file` が**両方**設定されると TLS が有効になります。
- `client_ca_file` を設定すると**相互 TLS** がオンになります。すべてのクライアントはその CA で署名された証明書を提示しなければなりません。mTLS は上記の非ループバック起動時安全チェックも満たします。
- クライアントは CA バンドルとクライアント証明書を `-tls-ca-file`、`-tls-client-cert`、`-tls-client-key`（または `VMFLOW_TLS_*` 環境変数）で渡します。[共通クライアントフラグ](./commands#common-client-flags)を参照してください。

mTLS は、インバウンドポートを開かずにコントロール API を非ループバックで公開する（例えば Cloudflare Tunnel の背後で）推奨される方法です。

## `GET /healthz`

デーモンの健全性。

```json
{
  "ok": true,
  "running_rules": 1,
  "time": 1760000000
}
```

## `GET /v1/rules`

実行中のルール。

```json
{
  "items": [
    {
      "rule_id": "ssh-forward",
      "name": "ssh-forward",
      "protocol": "tcp",
      "listen_addr": "0.0.0.0",
      "listen_port": 2201,
      "target_addr": "127.0.0.1",
      "target_port": 22,
      "enabled": true
    }
  ]
}
```

## `GET /v1/stats`

ルールごとのメモリ内カウンタ。

```json
{
  "items": [
    {
      "rule_id": "ssh-forward",
      "upload_bytes": 1024,
      "download_bytes": 2048,
      "conns": 1,
      "updated_time": 1760000000
    }
  ]
}
```

## `GET|POST /v1/precheck`

現在の設定を**適用せずに**検証します。`reload` は同じ検査を実行します。エラーがあるとリロードは却下されます。

検査内容: ルールの検証、重複する `rule_id`、リスナーの衝突、リッスンポートのバインド可否、ターゲットの DNS 解決、特権ポートの警告。（HTTPS ドメインと ACME の検査は現在のビルドでは無効です。）

```bash
vmflow ctl precheck
```

```json
{
  "config_path": "./examples/config.yaml",
  "rule_count": 1,
  "result": {
    "ok": true,
    "error_count": 0,
    "warning_count": 0,
    "checked_rules": 1,
    "checked_time_ms": 1,
    "items": []
  }
}
```

検査の完全なリストについては[プレチェック](./precheck)を参照してください。

## `GET /metrics`

Prometheus テキスト exposition。例：

```text
vmflow_rule_upload_bytes_total{rule_id="ssh-forward",protocol="tcp"} 1024
vmflow_rule_download_bytes_total{rule_id="ssh-forward",protocol="tcp"} 2048
vmflow_rule_connections{rule_id="ssh-forward",protocol="tcp"} 1
vmflow_control_requests_total{method="GET",path="/v1/stats",status="200"} 10
vmflow_reload_total{status="ok"} 1
vmflow_rule_apply_total{action="started",status="ok"} 1
```

メトリックファミリ:

- `vmflow_build_info`
- `vmflow_uptime_seconds`
- `vmflow_rule_running{rule_id,protocol}`
- `vmflow_rule_connections{rule_id,protocol}`
- `vmflow_rule_upload_bytes_total{rule_id,protocol}`
- `vmflow_rule_download_bytes_total{rule_id,protocol}`
- `vmflow_control_requests_total{method,path,status}`
- `vmflow_control_request_duration_seconds_sum{method,path,status}`
- `vmflow_reload_total{status}`
- `vmflow_rule_apply_total{action,status}`

## `POST /v1/reload`

設定ファイルをリロードし、プレチェック後に `ApplySnapshot(replace_all=true)` を実行します。

```json
{
  "config_path": "./examples/config.yaml",
  "control_listen_addr": "127.0.0.1:19090",
  "rule_count": 1,
  "result": {
    "applied_rules": 1,
    "stopped_rules": 0,
    "failed_rules": 0,
    "total_rules": 1,
    "items": []
  }
}
```

::: warning 無効なエンドポイント
`/v1/certs*` 証明書エンドポイントはソースに存在しますが、現在のビルドでは**登録されていません**（HTTPS/ACME は無効です）。
:::
