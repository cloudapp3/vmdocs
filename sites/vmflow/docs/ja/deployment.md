---
title: デプロイメント
description: ループバック管理、ログ、メトリクス、SSH、ネイティブサービスで vmflow を運用します。
---

# デプロイメント

vmflow は長時間稼働する転送プロセスです。管理はループバックに限定され、組み込み CLI/TUI を使用します。

## ローカル管理

内部管理チャネルは常に `127.0.0.1` にバインドされます。設定するのはローカルポートだけです。

```yaml
control_port: 19090
```

サポートされる管理手段は `vmflow ctl` と `vmflow tui` です。内部通信は公開連携 API ではありません。

## リモート管理

SSH でループバックポートを転送し、ローカルの CLI/TUI を使用します。

```bash
ssh -N -L 19090:127.0.0.1:19090 user@server
vmflow ctl rules
```

## ロギング

スタックに合ったフォーマットを設定します：

```yaml
log:
  level: info
  format: json # text or json
```

`json` はログシッパーに最も扱いやすく、`text` はターミナルでは見やすいです。サービスマネージャ配下では、デーモンに `-log-file` を渡すこともできます（Windows では必須です）。

## メトリクス

同一ホストの Prometheus からループバックのメトリクスリスナーを取得します：

```yaml
scrape_configs:
  - job_name: vmflow
    static_configs:
      - targets: ['127.0.0.1:19090']
    metrics_path: /metrics
```

## 安全にリロードする

`vmflow ctl reload` で設定変更を適用します。最初に[事前チェック](./precheck)が実行され、無効な変更は部分適用されません。

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
ExecStart=/usr/local/bin/vmflow -config /etc/vmflow/config.yaml
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

- 累積トラフィックカウンターは任意で永続化できます。接続数とレートはプロセスローカルです。
- バンドルされた Web ダッシュボードやマルチノードコーディネータはありません。
- 公式 Docker イメージはまだ公開していません。自動起動には組み込みのネイティブサービスインストーラを使用してください。
