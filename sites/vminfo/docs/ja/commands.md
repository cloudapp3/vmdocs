---
title: コマンドリファレンス
description: vminfo のコマンド説明、よく使う引数と使用例。
---

# コマンドリファレンス

## よく使うコマンド

| コマンド | 説明 |
| --- | --- |
| `vminfo` | インタラクティブ TUI を起動 |
| `vminfo info` | TUI のエイリアス |
| `vminfo summary` | 1 回だけスナップショットを出力 |
| `vminfo watch` | スナップショットを継続的に出力 |
| `vminfo --web` | Web ダッシュボードを起動 |
| `vminfo ps` | Linux のプロセス一覧を表示 |
| `vminfo kill <pid>` | Linux プロセスに SIGTERM を送信 |
| `vminfo net` | ネットワーク診断（dns / port / ping / ip） |
| `vminfo update` | アップデートの確認・インストール |
| `vminfo --lang en` | UI 言語を切り替え |

## チートシート

```bash
vminfo
vminfo summary
vminfo summary --json
vminfo watch
vminfo watch --json
vminfo watch --count 1
vminfo --web
vminfo --web --token
vminfo --web --token secret-token
vminfo --web --tui
vminfo --web --bind 0.0.0.0 --port 8080
vminfo ps
vminfo ps nginx
vminfo ps --filter ssh
vminfo ps --tree
vminfo ps --watch
vminfo ps --limit 20
vminfo ps --json
vminfo ps --sort mem
vminfo kill <pid>
vminfo net dns example.com
vminfo net port example.com 443
vminfo net ping example.com --tcp-port 443
vminfo net ip
vminfo update
vminfo update --check
vminfo update --version v0.1.0
vminfo --lang en
```

## 解説

- `summary`：1 回限りのスナップショット。スクリプトや CI 向け。
- `watch`：連続サンプリング。`--json` の場合は JSON Lines を出力。
- `ps`：Linux 専用。フィルター・ツリー表示・watch・limit・JSON に対応。
- `kill`：Linux 専用。`SIGTERM` を送信。
- `net`：オンデマンドのネットワーク診断。`dns` はドメイン名を解決（`--server` で DNS 指定可）、`port` は TCP ポートの接続性とレイテンシをテスト、`ping` は TCP（デフォルト・クロスプラットフォーム）と ICMP（権限が必要）の両モードをサポート、`ip` は自マシンまたは指定 IP のパブリック情報（ASN / 地理情報、第三者の `ip.bestcheapvps.org` 経由）を照会します。いずれも `--json` に対応。
- `update`：最新リリースの確認・インストール。Windows は確認のみ対応。
