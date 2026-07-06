---
title: ps
description: Linux 専用のプロセス一覧で、フィルタ、ツリー表示、watch モード、JSON 出力に対応します。
---

# `vminfo ps`

Linux 専用のプロセス一覧とフィルタリング。

## 使い方

```bash
vminfo ps
vminfo ps nginx
vminfo ps --filter ssh
vminfo ps --tree
vminfo ps --watch
vminfo ps --limit 20
vminfo ps --json
vminfo ps --sort mem
```

## オプション

| フラグ | 説明 |
| --- | --- |
| 位置引数（filter） | 名前・ユーザー・PID・コマンド・ステートでフィルタ |
| `--filter` | 明示的なプロセスフィルタ |
| `--tree` | プロセスツリーを描画 |
| `--watch` | 継続的にリフレッシュ |
| `--count` | `--watch` と併用する際のサンプル数 |
| `--interval` | watch モードのリフレッシュ間隔 |
| `--limit` | 返す行数を制限 |
| `--json` | JSON を出力 |
| `--sort` | `cpu`、`mem`、`pid`、`name` でソート |

## 注意点

- デフォルトのソートは `cpu` です。
- JSON 出力はプロセスオブジェクトの配列を返します。
- `--watch --json` は `collected_at` タイムスタンプ付きの JSON Lines を返します。
- 非 Linux ビルドでは、このコマンドは未サポートの stub として残ります。

## 例

```bash
vminfo ps --filter ssh --sort mem --limit 20
```

## 関連項目

- [kill](/ja/kill)
- [HTTP API](/ja/api)
