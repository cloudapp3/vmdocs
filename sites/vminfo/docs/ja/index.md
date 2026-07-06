---
title: vminfo 日本語ドキュメント
description: vminfo は Linux・macOS・Windows に対応するクロスプラットフォームのホストランタイム情報ツールです。ターミナル UI、JSON 出力、Web ダッシュボード、Go ライブラリを備えています。
---

# vminfo 日本語ドキュメント

vminfo はクロスプラットフォームで動作するホストランタイム情報ツールです。ターミナル UI、JSON 出力、ブラウザダッシュボード、Go API を使って、CPU・メモリ・ディスク・ネットワーク・負荷・プロセスを手軽に確認できます。

## クイックインストール

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vminfo/main/install.sh | bash
```

## TUI を起動

```bash
vminfo
```

## JSON を出力

```bash
vminfo summary --json
```

## Web ダッシュボードを起動

```bash
vminfo --web
```

ダッシュボードは複数のテーマ（Auto / Neon / Light / Terminal / Synthwave）を内蔵し、ヘッダーから切り替えできます。JetBrains Mono フォントを同梱しているため、オフラインでも一貫したタイポグラフィを保ちます。

## ネットワーク診断

```bash
vminfo net dns example.com            # ドメイン名を解決
vminfo net port example.com 443       # TCP ポートの接続性をテスト
vminfo net ping example.com --tcp-port 443   # TCP ping（デフォルト・クロスプラットフォーム）
vminfo net ip                         # 自マシンのパブリック IP + ASN / 地理情報
```

続きを読む：

- [クイックスタート](/ja/quick-start)
- [コマンドリファレンス](/ja/commands)
- [HTTP API](/ja/api)
- [Go ライブラリ](/ja/library)
