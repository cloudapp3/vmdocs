---
title: デプロイ
description: ローカルアクセス、SSH トンネル、または HTTPS リバースプロキシ経由で vminfo Web ダッシュボードを安全に運用します。
---

# デプロイ

`vminfo --web` は単一ホスト向けの軽量ダッシュボードです。データベースは不要で、集中監視サービスでもありません。組み込み HTTP サーバーは信頼できる境界の内側で運用してください。

## ローカルのみで利用する

最も安全なデフォルト構成では認証は不要です。

```bash
vminfo --web
```

`127.0.0.1:20021` で待ち受けます。同じマシンで
`http://127.0.0.1:20021` を開くか、API を確認します。

```bash
curl -fsS http://127.0.0.1:20021/api/v1/health
```

未認証モードでは `localhost` またはループバック IP の Host ヘッダーだけを受け付け、DNS rebinding によるアクセスを防ぎます。

## SSH 経由のリモートアクセス

一人で管理する場合はループバック待受のままトンネルを作成します。

```bash
# サーバー側
vminfo --web

# ワークステーション側
ssh -L 20021:127.0.0.1:20021 user@server
```

ワークステーションで `http://127.0.0.1:20021` を開きます。サーバーのネットワークにはダッシュボードのポートを公開しません。

## HTTPS リバースプロキシ経由

常設のブラウザー URL が必要な場合は、vminfo をループバックに保ち、同じホストの HTTPS リバースプロキシを使用します。

```bash
vminfo --web --bind 127.0.0.1 --port 20021 --token
```

値なしの `--token` はランダムな token と、そのまま開ける URL を生成します。固定値も指定できます。

```bash
vminfo --web --bind 127.0.0.1 --port 20021 --token "$VMINFO_WEB_TOKEN"
```

プロキシでは次を設定します。

- TLS を終端して `127.0.0.1:20021` へ転送する
- 元の `Host` ヘッダーを維持する
- `X-Forwarded-Proto: https` を設定する
- `/ws` の WebSocket upgrade を通す
- ダッシュボードと API を同一オリジンに保つ

最初に `/?token=...` へ正しくアクセスすると、`HttpOnly`、`SameSite=Lax`
cookie が保存され、token を除いた URL へリダイレクトされます。HTTPS と認識されたリクエストでは cookie に `Secure` も付きます。

::: warning 通信の暗号化
組み込みサーバーは HTTP です。token はアクセスを制御しますが通信を暗号化しません。ポートをインターネットへ直接公開せず、HTTPS プロキシまたは SSH トンネルを使用してください。
:::

## プライベートネットワークへ直接バインドする

信頼できるプライベートネットワークで直接アクセスする場合も、非ループバックの bind には token が必須です。

```bash
vminfo --web --bind 0.0.0.0 --port 20021 --token
```

`--token` がなければ起動時に失敗します。ファイアウォールで接続元を制限し、接続自体は暗号化されないことに注意してください。

## ブラウザーと API の保護

- `Origin` を持つ REST / WebSocket リクエストは scheme、host、port が一致する必要があります
- `Access-Control-Allow-Origin: *` は返しません
- token モードではページ、`/api/v1/*`、`/ws` に token または cookie が必要です
- `Origin` を送らないネイティブクライアントは引き続き利用できます
- ネットワーク診断は JSON、本文サイズ、回数、タイムアウトを検証します

## プロセス管理

systemd、launchd、コンテナランタイムなど、既存の supervisor を使用してください。可能なら非 root
ユーザーで実行し、異常終了時に再起動し、停止には `SIGTERM` を送ります。vminfo は service 定義を自動インストールしません。

## 動作確認

```bash
curl -fsS http://127.0.0.1:20021/api/v1/health
curl -fsS "http://127.0.0.1:20021/api/v1/health?token=$VMINFO_WEB_TOKEN"
```

独立した公開ヘルスチェック endpoint はありません。認証を有効にすると `/api/v1/health` も保護されます。

## 関連項目

- [Web ダッシュボード](/ja/web-dashboard)
- [HTTP API](/ja/api)
- [インストール](/ja/installation)
- [update コマンド](/ja/update)
