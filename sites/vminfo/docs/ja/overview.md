---
title: 概要
description: vminfo ができること、および収集するホスト指標。
---

# 概要

vminfo は、手軽なローカル診断向けのクロスプラットフォーム ホストランタイム情報ツールキットです。

## 提供するもの

- **TUI** — 全画面ターミナルダッシュボード
- **JSON 出力** — スクリプト向けのスナップショットと watch ストリーム
- **Web ダッシュボード** — REST・ WebSocket エンドポイント付きの軽量ブラウザ UI
- **Go ライブラリ** — インポート可能な指標収集・組み込み TUI API

## 収集する指標

vminfo は以下を収集します：

- CPU 使用率・コアごとの使用率・CPU 周波数
- メモリとスワップの使用状況
- ディスク使用量とディスク I/O
- ネットワークの総量・速度・TCP/UDP 接続数
- TCP ステート分布（`ESTABLISHED` / `TIME_WAIT` / `SYN_RECV` / …）と conntrack 使用状況（Linux）
- インターフェースごとのトラフィック・エラー・ドロップ
- プロセス一覧とプロセスメタデータ
- 温度読み取り
- 稼働時間とホストメタデータ

## 公開 Go 型

- `StaticInfo`
- `RuntimeStats`
- `Snapshot`
- `ProcessInfo`
- `AppMetadata`

## 主なエントリーポイント

- `vminfo`
- `vminfo info`
- `vminfo summary`
- `vminfo watch`
- `vminfo --web`
- `vminfo ps`
- `vminfo kill <pid>`
- `vminfo net dns | port | ping | ip`
- `vminfo update`

## 適しているケース

次のいずれかが必要な場合に適しています：

- ホストを手早く点検できる単一バイナリ
- インタラクティブな作業に使える読みやすいターミナル UI
- スクリプト・CI・自動化向けの JSON
- 監視スタックを用意せずに使える Web ダッシュボード
- 別の CLI に組み込める Go ライブラリ
