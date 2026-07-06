---
title: summary
description: ランタイムのスナップショットを 1 回だけ取得し、テキストまたは JSON で出力します。
---

# `vminfo summary`

現在のホスト状態のスナップショットを 1 回取得します。

## 使い方

```bash
vminfo summary
vminfo summary --json
vminfo summary --interval 1s
```

## 出力

- テキストモードは人間が読めるホストサマリーを出力します。
- JSON モードは `static` と `stats` フィールドを持つ `vminfo.Snapshot` オブジェクトを出力します。

## 使う場面

- ターミナルでの手軽な確認
- シェルスクリプト
- CI 診断
- 1 サンプルだけ必要な自動化

## 例

```bash
vminfo summary --json
```

## 関連項目

- [watch](/ja/watch)
- [HTTP API](/ja/api)
- [Go ライブラリ](/ja/library)
