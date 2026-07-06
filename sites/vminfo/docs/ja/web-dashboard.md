---
title: Web ダッシュボード
description: 読み取り専用の HTTP API とブラウザダッシュボード（トークン認証・WebSocket アクセスを含む）を起動します。
---

# Web ダッシュボード

`vminfo --web` は、テーマ切替可能な軽量・読み取り専用の HTTP API とダッシュボードを起動します。

## サーバーを起動

```bash
vminfo --web
```

デフォルトのアドレス：

```text
http://127.0.0.1:20021
```

カスタムアドレス：

```bash
vminfo --web --bind 0.0.0.0 --port 8080 --interval 1s
```

ダッシュボードと一緒に TUI を起動することもできます：

```bash
vminfo --web --tui
```

## 認証

デフォルトでは、ダッシュボードと API はローカルのみで認証なしです。

`--token` を有効にした場合：

```bash
vminfo --web --token
vminfo --web --token my-secret
```

- `--token` 単体で URL セーフなトークンを自動生成します
- `--token my-secret` は固定トークンを使います
- 最初に `/?token=...` でアクセス成功すると、以降のリクエスト用に cookie が設定されます
- `/healthz` はローカルプローブ向けに公開されたままです
- `/`、`/api/v1/*`、`/ws` はトークンまたは認証 cookie が必要です
- トークン保護モードでは、寛容な `Access-Control-Allow-Origin: *` は公開されません
- WebSocket アップグレードでは、ブラウザの origin がダッシュボードのホストと一致する必要があります

::: warning リモートアクセス
`0.0.0.0` にバインドする場合、信頼できるプライベートネットワークにのみ公開するのでなければ、`--token` を有効にしてください。
:::

## エンドポイント

| エンドポイント | 用途 |
| --- | --- |
| `GET /healthz` | 公開ヘルスチェック |
| `GET /api/v1/snapshot` | 完全なランタイムスナップショット |
| `GET /api/v1/cpu` | CPU データ |
| `GET /api/v1/memory` | メモリとスワップのデータ |
| `GET /api/v1/disk` | ファイルシステムとディスク I/O データ |
| `GET /api/v1/network` | ネットワーク総量とインターフェースデータ |
| `GET /api/v1/processes` | プロセス一覧 |
| `GET /api/v1/system` | ホストメタデータ |
| `GET /api/v1/health` | ヘルススコアと警告 |
| `POST /api/v1/net/diag` | ネットワーク診断を実行（dns / port / ping / ip） |
| `GET /ws` | ライブスナップショットストリーム |

ペイロード例とクエリパラメータは [HTTP API リファレンス](/ja/api) を参照してください。

## テーマ

ダッシュボードはヘッダーから切り替え可能なテーマを内蔵しています：**Auto**、**Neon**、**Light**、**Terminal**、**Synthwave**。"Auto" は OS の配色に従います。

[JetBrains Mono](https://www.jetbrains.com/lp/mono/) はバイナリに**同梱**されているため、ダッシュボードは完全に自己完結します —— 意図した等幅フォントで描画され、外部フォントへのリクエストなしでオフラインでも動作します。
