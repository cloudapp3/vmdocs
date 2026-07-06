---
title: watch
description: ランタイムのスナップショットを継続的にストリーム出力し、テキストまたは JSON Lines に対応します。
---

# `vminfo watch`

スナップショットを継続的に出力します。

## 使い方

```bash
vminfo watch
vminfo watch --json
vminfo watch --count 1
vminfo watch --interval 2s
```

## 出力

- テキストモードはタイムスタンプ付きのスナップショットを出力します。
- JSON モードは `collected_at`、`static`、`stats` を持つ JSON Lines を出力します。

## 適した用途

- ターミナルでの監視
- ログパイプライン
- CI チェック
- シンプルなサンプリングループ

## 例

```bash
vminfo watch --json --count 3
```

## 関連項目

- [summary](/ja/summary)
- [ps](/ja/ps)
