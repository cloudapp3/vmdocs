---
title: デプロイメント
description: vmflow をデーモンとして本番環境で実行する — コントロール API の公開、認証、TLS/mTLS、ロギング、メトリクス、ネイティブサービスのセットアップ。
---

# デプロイメント

vmflow はローカルのコントロール API を公開する長時間稼働するデーモンとして動作します。このページでは、ホスト上で実行する際の実践的な注意事項を取り上げます。

## コントロール API はループバックに留める

デフォルトの `control_listen_addr` は `127.0.0.1:19090` です。`auth.enabled: false` の場合、コントロール API はすべてのリクエストを匿名の admin レベルの呼び出し元として扱います — これはループバックでのみ安全です。

コントロール API が保護なしで非ループバックアドレス（`0.0.0.0`、`::`、非ループバックの IP、または `:port`）にバインドされている場合、デーモンは**起動を拒否**します。これはフェイルクローズドであり、認証されていないリモート制御エンドポイントの意図せぬ公開を防ぎます。非ループバックにバインドするには、次のいずれかを満たします：

1. `auth.enabled: true` を設定し、少なくとも 1 つのトークンを用意する、**または**
2. `control_tls.client_ca_file` による相互 TLS（クライアントは証明書を提示する必要あり）、**または**
3. デーモンに `-insecure-allow-remote-control` を渡して、リスクを明示的に承認する。

## ローカルホスト以外に公開する

別のホストからコントロール API にアクセスする必要がある場合は、安全な選択肢から選んでください。

### オプション A — Bearer トークン認証

```yaml
control_listen_addr: 0.0.0.0:19090
auth:
  enabled: true
  tokens:
    - name: admin
      token: <long-random-secret>
      role: admin
    - name: viewer
      token: <another-random-secret>
      role: viewer
```

変更を伴う呼び出し（`reload`）には `admin` トークンを使います。読み取り専用の呼び出しは `viewer` トークンで動作します。

### オプション B — TLS / 相互 TLS（推奨）

コントロール API 自体で TLS を終端し、最も強力な姿勢としてクライアント証明書を要求します：

```yaml
control_listen_addr: 0.0.0.0:19090
control_tls:
  cert_file: /etc/vmflow/server.pem
  key_file:  /etc/vmflow/server.key
  client_ca_file: /etc/vmflow/client-ca.pem   # mTLS — satisfies the startup check
  min_version: "1.2"
```

クライアントは `-tls-ca-file`、`-tls-client-cert`、`-tls-client-key` で接続します（[共通クライアントフラグ](./commands#common-client-flags)を参照）。これが、インバウンドポートを開放せずに Cloudflare Tunnel の背後でコントロール API を公開する推奨される方法です。[HTTP API → TLS および相互 TLS](./api#tls-and-mutual-tls)を参照してください。

[HTTP API → 認証](./api#authentication)も参照してください。

## ロギング

スタックに合ったフォーマットを設定します：

```yaml
log:
  level: info
  format: json # text or json
```

`json` はログシッパーに最も扱いやすく、`text` はターミナルでは見やすいです。サービスマネージャ配下では、デーモンに `-log-file` を渡すこともできます（Windows では必須です）。

## メトリクス

Prometheus をコントロール API に向けます：

```yaml
scrape_configs:
  - job_name: vmflow
    static_configs:
      - targets: ['127.0.0.1:19090']
    metrics_path: /metrics
```

公開されるメトリックファミリについては [HTTP API → メトリクス](./api#get-metrics)を参照してください。

## 安全にリロードする

設定の変更は `POST /v1/reload`（または `vmflow ctl reload`）経由で行います。リロードはまず[プレチェック](./precheck)を実行し、エラーがあれば変更を却下して、実行中のルールはそのまま維持します。まだグレースフルドレインの期間はなく、削除/変更されたルールへの既存接続はマイグレーションされません。

## ネイティブサービスとして実行する

OS のサービスマネージャに vmflow を登録し、起動時に開始しクラッシュ時に再起動するようにします：

```bash
# installs + enables + starts a systemd unit / launchd plist / Windows Service
sudo vmflow service install
```

これが推奨される方法です — フラグ（設定パス、実行ユーザー、ログファイル、追加引数）については [`vmflow service`](./service) を参照してください。`vmflow service status` / `vmflow service uninstall` で確認と削除を行います。

ユニットを自分で管理したい場合は、適宜調整して使える動作する systemd の例を以下に示します：

```ini
[Unit]
Description=vmflow L4 forwarding daemon
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
ExecStart=/usr/local/bin/vmflow daemon -config /etc/vmflow/config.yaml
ExecReload=/usr/local/bin/vmflow ctl reload
Restart=on-failure
RestartSec=3

[Install]
WantedBy=multi-user.target
```

編集後に設定をリロードします：

```bash
sudo vmflow ctl reload
# or, with a hand-written unit that wires ExecReload:
sudo systemctl reload vmflow
```

完全な削除（サービス + バイナリ + 設定 + ログ + 証明書 + 更新キャッシュ）は、[`vmflow uninstall`](./uninstall) を使います。

## 現在の制限事項

- 統計は**メモリ内のみ**です。組み込みの履歴集計はありません。
- バンドルされた Web ダッシュボードやマルチノードコーディネータはありません。
- リリースアーカイブにはまだ公式 Docker イメージがありません（ネイティブサービスインストールと、`.deb`/`.rpm` パッケージは利用可能です）。
