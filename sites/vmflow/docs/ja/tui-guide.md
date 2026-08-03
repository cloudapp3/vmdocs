---
title: TUI ダッシュボード
description: ターミナル UI から vmflow のルール、送信元 IP ポリシー、カウンター、プレチェック、適用操作を確認・管理します。
---

# TUI ダッシュボード

vmflow には、ローカルデーモンに設定されたルールとライブトラフィックカウンターを確認・管理するターミナル UI が同梱されています。

## 起動する

デフォルトのローカルターゲットでは、`vmflow tui` はネイティブサービスを管理します。`vmflow init` のシステムサービスモードを完了するか、サービスをインストールして起動してから実行します。

```bash
vmflow tui
```

デーモンを foreground モードで手動起動した場合は、そのターミナルを開いたままアドレスを明示します。これによりネイティブサービスのチェックを省略します。

```bash
vmflow tui -addr http://127.0.0.1:19090
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
| **Dashboard** | 健全性、転送集計、稼働時間、接続先デーモンの Host Network NIC と RX/TX レート。 |
| **Rules** | 設定済みルール、ライブトラフィックとクォータ状態、未適用変更、送信元アクセス概要。 |
| **Detail** | 選択ルールの帯域/クォータ、送信元 IP、トラフィック、使用量、拒否カウンター。 |

## ルール管理

認証済みの `admin` トークンでは、ルールの作成、編集、コピー、有効・無効の切り替え、削除ができます。viewer トークンおよび未認証セッションは読み取り専用です。Rules ビューでは、<kbd>n</kbd>/<kbd>e</kbd>/<kbd>c</kbd> で作成・編集・コピー、<kbd>Space</kbd> で切り替え、<kbd>d</kbd> で削除、<kbd>P</kbd> でプレチェック、<kbd>A</kbd> で検証済みドラフトを適用します。

エディターの `Source IP mode` では `OFF`、`ALLOWLIST`、`DENYLIST` を選択できます。`Source IPs / CIDRs` には、IPv4/IPv6 のリテラルアドレスと CIDR をカンマ区切りで入力します。適用前にプレチェックが成功する必要があり、既存の revision/ETag フローによって古いエディターが新しい設定を上書きするのを防ぎます。

基本エディターには共有レート、日次・月次クォータがあり、詳細設定には方向別 upload/download とクォータ timezone があります。適用時はルールを再起動しますが、同じ `rule_id` の使用量は保持します。

Host Network は Dashboard 内です。<kbd>4</kbd> で移動し、<kbd>a</kbd> で有効な物理 NIC と全 NIC を切り替えます。値は SSH tunnel 越しでも接続先デーモンのホスト値で、vmflow クォータや速度テストではありません。

## いつ使うか

TUI は、メトリクスをスクレイピングせずに「vmflow は今何をしているか？」に答える最速の方法です。長期の履歴については、代わりに Prometheus を `/metrics` に向けてください — TUI はメモリ内の現在状態しか表示しません。
