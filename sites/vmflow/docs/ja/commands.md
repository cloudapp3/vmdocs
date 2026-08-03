---
title: コマンドリファレンス
description: foreground、ctl、tui、mcp、version、update、service、uninstall の vmflow CLI リファレンス。
---

# コマンドリファレンス

vmflow は初回設定、明示的な foreground 実行、状態、管理、サービス、保守コマンドを持つ単一バイナリです。

| コマンド | エイリアス | 目的 |
| --- | --- | --- |
| `vmflow` | - | 設定/デーモン状態と次の操作を表示します。 |
| `vmflow init` | - | 言語と実行モードを選び、最初の検証済みルールとローカル資格情報を作成します。 |
| [`vmflow run`](./daemon) | - | platform user config で転送を foreground 実行します。 |
| `vmflow status` | - | 設定パス、ルール数、デーモン、ネイティブサービス状態を確認します。`-json` 対応。 |
| [`ctl`](./ctl) | `c` | 実行中のデーモンをクエリ・制御します。 |
| [`tui`](./tui) | `t` | ターミナルダッシュボード。 |
| [`mcp`](./mcp) | - | 実行中のローカルデーモン向け読み取り専用 stdio MCP サーバー。 |
| [`version`](./version) | `v` | ビルドメタデータを表示します。 |
| [`update`](./update) | `u` | 新しいリリースの確認またはインストールをします。 |
| [`service`](./service) | `svc` | ネイティブ OS サービスを install/start/status/uninstall します。 |
| [`uninstall`](./uninstall) | `remove`, `rm` | ワンコマンドでクリーンアップ付きアンインストールをします。 |

## 共通管理フラグ {#common-client-flags}

組み込みの `ctl`、`tui`、`mcp` はローカルデーモンに接続します。

| フラグ | 環境変数 | 既定値 | 説明 |
| --- | --- | --- | --- |
| `-token` | `VMFLOW_CONTROL_TOKEN` | _(なし)_ | 認証を有効にした場合の Bearer token。 |

リモート管理には[ローカル管理](./api)の SSH トンネルを使用してください。

## 注記

- 古い分割バイナリ `relayd`、`relayctl`、`relaytui` は互換性のために引き続きビルド可能です — これらは同じパッケージの薄い shim であり、同じ `VMFLOW_CONTROL_TOKEN` 環境変数を読み取ります — が、リリースでは統合された `vmflow` バイナリを優先します。
- トンネルコマンド（`tunnel-server`、`tunnel-client`、`tunnel-ctl`）と証明書コマンド（`certs`、`certs-obtain`、`certs-review`）は現在のビルドでは**有効になっていません**。
