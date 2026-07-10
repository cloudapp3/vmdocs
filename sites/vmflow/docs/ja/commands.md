---
title: コマンドリファレンス
description: vmflow CLI リファレンス — daemon、ctl、tui、version、update、service、uninstall の各サブコマンドとそのエイリアス。
---

# コマンドリファレンス

vmflow は 7 つのサブコマンドを持つ単一バイナリです。エイリアスは下の表に記載しています。

| コマンド | エイリアス | 目的 |
| --- | --- | --- |
| [`daemon`](./daemon) | `d` | 転送デーモンを実行します。 |
| [`ctl`](./ctl) | `c` | 実行中のデーモンをクエリ・制御します。 |
| [`tui`](./tui) | `t` | ターミナルダッシュボード。 |
| [`version`](./version) | `v` | ビルドメタデータを表示します。 |
| [`update`](./update) | `u` | 新しいリリースの確認またはインストールをします。 |
| [`service`](./service) | `svc` | ネイティブ OS サービスとして登録します（起動時開始）。 |
| [`uninstall`](./uninstall) | `remove`, `rm` | ワンコマンドでクリーンアップ付きアンインストールをします。 |

## 共通クライアントフラグ {#common-client-flags}

`ctl` と `tui` は[コントロール API](./api) のクライアントであり、これらのフラグを共有します：

| フラグ | 環境変数 | デフォルト | 説明 |
| --- | --- | --- | --- |
| `-addr` | _(なし)_ | `http://127.0.0.1:19090` | コントロール API のベース URL。 |
| `-token` | `VMFLOW_CONTROL_TOKEN` | _(なし)_ | 認証が有効な場合の Bearer トークン。 |
| `-tls-ca-file` | `VMFLOW_TLS_CA_FILE` | _(なし)_ | コントロール API サーバー証明書を検証するための CA バンドル（プライベート/自己署名 CA）。 |
| `-tls-client-cert` | `VMFLOW_TLS_CLIENT_CERT` | _(なし)_ | mTLS 用のクライアント証明書（サーバーが `control_tls.client_ca_file` を設定している場合は必須）。 |
| `-tls-client-key` | `VMFLOW_TLS_CLIENT_KEY` | _(なし)_ | mTLS 用のクライアントキー（`-tls-client-cert` と併用）。 |
| `-tls-skip-verify` | `VMFLOW_TLS_INSECURE` (`1`/`true`) | `false` | サーバー証明書の検証をスキップします（危険、デバッグ専用）。 |
| `-H` / `--header` | `VMFLOW_HEADERS` (`;` 区切り) | _(なし)_ | `Name: Value` 形式の追加リクエストヘッダー（繰り返し可能）。 |

## 注記

- 古い分割バイナリ `relayd`、`relayctl`、`relaytui` は互換性のために引き続きビルド可能です — これらは同じパッケージの薄い shim であり、同じ `VMFLOW_CONTROL_TOKEN` 環境変数を読み取ります — が、リリースでは統合された `vmflow` バイナリを優先します。
- トンネルコマンド（`tunnel-server`、`tunnel-client`、`tunnel-ctl`）と証明書コマンド（`certs`、`certs-obtain`、`certs-review`）は現在のビルドでは**有効になっていません**。
