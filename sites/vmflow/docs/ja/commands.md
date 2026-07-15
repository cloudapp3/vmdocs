---
title: コマンドリファレンス
description: foreground、ctl、tui、version、update、service、uninstall の vmflow CLI リファレンス。
---

# コマンドリファレンス

vmflow はフォアグラウンド実行と 6 個のサブコマンドを持つ単一バイナリです。

| コマンド | エイリアス | 目的 |
| --- | --- | --- |
| `vmflow` | - | 転送ランタイムをフォアグラウンドで実行します。 |
| [`ctl`](./ctl) | `c` | 実行中のデーモンをクエリ・制御します。 |
| [`tui`](./tui) | `t` | ターミナルダッシュボード。 |
| [`version`](./version) | `v` | ビルドメタデータを表示します。 |
| [`update`](./update) | `u` | 新しいリリースの確認またはインストールをします。 |
| [`service`](./service) | `svc` | ネイティブ OS サービスとして登録します（起動時開始）。 |
| [`uninstall`](./uninstall) | `remove`, `rm` | ワンコマンドでクリーンアップ付きアンインストールをします。 |

## 共通管理フラグ {#common-client-flags}

組み込みの `ctl` と `tui` はローカルデーモンに接続します。

| フラグ | 環境変数 | 既定値 | 説明 |
| --- | --- | --- | --- |
| `-token` | `VMFLOW_CONTROL_TOKEN` | _(なし)_ | 認証を有効にした場合の Bearer token。 |

リモート管理には[ローカル管理](./api)の SSH トンネルを使用してください。

## 注記

- 古い分割バイナリ `relayd`、`relayctl`、`relaytui` は互換性のために引き続きビルド可能です — これらは同じパッケージの薄い shim であり、同じ `VMFLOW_CONTROL_TOKEN` 環境変数を読み取ります — が、リリースでは統合された `vmflow` バイナリを優先します。
- トンネルコマンド（`tunnel-server`、`tunnel-client`、`tunnel-ctl`）と証明書コマンド（`certs`、`certs-obtain`、`certs-review`）は現在のビルドでは**有効になっていません**。
