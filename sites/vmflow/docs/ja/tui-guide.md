---
title: TUI ダッシュボード
description: vmflow のターミナルダッシュボード — 起動方法、Dashboard / Rules / Detail の各ビューの切り替え。
---

# TUI ダッシュボード

vmflow にはローカルデーモンのルール状態とトラフィックカウンターを確認するターミナル UI が同梱されています。

## 起動する

```bash
vmflow tui
```

認証を有効にした場合は、アクセストークンを渡します：

```bash
vmflow tui -token <token>
# or
VMFLOW_CONTROL_TOKEN=<token> vmflow tui
```

## ビュー

<kbd>Tab</kbd> キーでビューを切り替えます：

| ビュー | 表示内容 |
| --- | --- |
| **Dashboard** | 全体の健全性、実行中ルール数、稼働時間。 |
| **Rules** | ライブカウンタ付きの実行中ルール一覧。名前でのルール絞り込みに対応。 |
| **Detail** | 選択したルールの詳細。 |

## いつ使うか

TUI は、メトリクスをスクレイピングせずに「vmflow は今何をしているか？」に答える最速の方法です。長期の履歴については、代わりに Prometheus を `/metrics` に向けてください — TUI はメモリ内の現在状態しか表示しません。
