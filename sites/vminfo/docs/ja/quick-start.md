---
title: クイックスタート
description: vminfo をインストールし、ターミナル・JSON・Web ダッシュボードからホストの指標を確認します。
---

# クイックスタート

vminfo を使うと、ホストのランタイム情報を手軽に確認できます。ターミナル・スクリプト・Web ダッシュボードの 3 つのユースケースに適しています。

## インストール

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vminfo/main/install.sh | bash
```

sudo を使う場合：

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vminfo/main/install.sh | sudo bash
```

## TUI を起動

```bash
vminfo
```

## JSON スナップショットを出力

```bash
vminfo summary --json
```

## Web ダッシュボードを起動

```bash
vminfo --web
```

デフォルトのアドレス：

```text
http://127.0.0.1:20021
```

## 次のステップ

- [コマンドリファレンス](/ja/commands) を見る
- [HTTP API](/api) を読む
- [Go ライブラリ](/library/) を知る
- 英語の [Web Dashboard](/guide/web-dashboard) を見る
