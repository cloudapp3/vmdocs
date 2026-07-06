---
title: kill
description: PID を指定して Linux プロセスに SIGTERM を送信します。
---

# `vminfo kill`

Linux プロセスに `SIGTERM` を送信します。

::: warning
このコマンドはプロセスを終了させます。実行前に PID が正しいことを確認してください。
:::

## 使い方

```bash
vminfo kill 1234
```

## メモ

- Linux 専用です
- 非 Linux ビルドではサポート外のスタブを返します
- 対象プロセスが別のユーザーに属する場合、権限が必要になることがあります

## 関連情報

- [ps](/ja/ps)
