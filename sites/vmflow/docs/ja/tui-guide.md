---
title: TUI ダッシュボード
description: ターミナル UI から vmflow のルール、送信元 IP ポリシー、カウンター、プレチェック、適用操作を確認・管理します。
---

# TUI ダッシュボード

vmflow には、ローカルデーモンに設定されたルールとライブトラフィックカウンターを確認・管理するターミナル UI が同梱されています。

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
| **Rules** | 無効なルールを含む設定済みルール、ライブカウンター、未適用の変更、ワイド端末での `OPEN` / `ALLOW n` / `DENY n` アクセス概要。 |
| **Detail** | 選択したルールの設定、送信元 IP エントリ、トラフィック、累積 `IP Denied` カウンター。 |

## ルール管理

認証済みの `admin` トークンでは、ルールの作成、編集、コピー、有効・無効の切り替え、削除ができます。viewer トークンおよび未認証セッションは読み取り専用です。Rules ビューでは、<kbd>n</kbd>/<kbd>e</kbd>/<kbd>c</kbd> で作成・編集・コピー、<kbd>Space</kbd> で切り替え、<kbd>d</kbd> で削除、<kbd>P</kbd> でプレチェック、<kbd>A</kbd> で検証済みドラフトを適用します。

エディターの `Source IP mode` では `OFF`、`ALLOWLIST`、`DENYLIST` を選択できます。`Source IPs / CIDRs` には、IPv4/IPv6 のリテラルアドレスと CIDR をカンマ区切りで入力します。適用前にプレチェックが成功する必要があり、既存の revision/ETag フローによって古いエディターが新しい設定を上書きするのを防ぎます。

## いつ使うか

TUI は、メトリクスをスクレイピングせずに「vmflow は今何をしているか？」に答える最速の方法です。長期の履歴については、代わりに Prometheus を `/metrics` に向けてください — TUI はメモリ内の現在状態しか表示しません。
