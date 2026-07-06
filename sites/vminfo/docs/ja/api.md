---
title: HTTP API
description: vminfo Web ダッシュボードが提供する読み取り専用 HTTP API と WebSocket エンドポイント。
---

# HTTP API

`vminfo --web` は、軽量・読み取り専用の HTTP API とダッシュボードを起動します。

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
- `/healthz` は公開されたままです
- `/`、`/api/v1/*`、`/ws` はトークンまたは認証 cookie が必要です
- トークン保護モードでは、寛容な `Access-Control-Allow-Origin: *` は公開されません
- WebSocket リクエストはダッシュボードホストと同じブラウザ origin を使う必要があります

## エンドポイント

### `GET /healthz`

Web プロセスの公開ヘルスチェック。

```json
{
  "status": "ok",
  "ws_clients": 0
}
```

### `GET /api/v1/snapshot`

現在の完全なダッシュボードスナップショットを返します。

```json
{
  "timestamp": "2026-06-14T12:00:00Z",
  "system": {},
  "cpu": {},
  "memory": {},
  "disk": {},
  "network": {},
  "load": {},
  "processes": {},
  "health": {}
}
```

### `GET /api/v1/cpu`

CPU の合計、コアごとの使用率、メモリ上の短期 CPU 履歴を返します。

### `GET /api/v1/memory`

メモリとスワップの合計、使用量、空き量、百分比を返します。

### `GET /api/v1/disk`

ファイルシステムの使用率とディスク I/O 速度を返します。

### `GET /api/v1/network`

ネットワークのスループット、TCP/UDP 接続数、インターフェースカウンターを返します。

Linux では、ペイロードに TCP ステート分布（`ESTABLISHED`、`TIME_WAIT`、`SYN_RECV` などのソケット数）と conntrack 使用状況（現在 / 最大 `nf_conntrack` エントリ）も含まれるため、ソケットやコネクション追跡の飽和を見つけやすくなっています。

### `GET /api/v1/processes`

補完済みのプロセス一覧を返します。

対応するクエリパラメータ：

| パラメータ | 説明 |
| --- | --- |
| `filter` | PID・PPID・名前・コマンド・ユーザー・ステートに対する大文字小文字を区別しない一致 |
| `q` | `filter` のエイリアス |
| `sort` | `cpu`、`mem`、`pid`、`name`。デフォルトは `cpu` |
| `limit` | 返す行数の上限。`0` または省略で無制限 |

例：

```bash
curl 'http://127.0.0.1:20021/api/v1/processes?filter=ssh&sort=mem&limit=10'
```

レスポンスの構造：

```json
{
  "total": 128,
  "list": [
    {
      "pid": 1234,
      "ppid": 1,
      "name": "sshd",
      "user": "root",
      "cpu_percent": 0.1,
      "mem_percent": 0.2,
      "rss": 12345678,
      "status": "S",
      "command": "sshd: user@pts/0",
      "threads": 1,
      "nice": 0,
      "uptime": 3600,
      "started_at_unix": 1781434800
    }
  ]
}
```

### `GET /api/v1/system`

ホストメタデータ、OS/カーネル/アーキテクチャ、CPU モデルとコア数、稼働時間を返します。

### `GET /api/v1/health`

ダッシュボードが使う軽量ヘルススコアと警告を返します。

```json
{
  "score": 90,
  "warnings": [
    {
      "level": "warning",
      "code": "disk_high",
      "message": "disk usage is 88.5%"
    }
  ]
}
```

`code` フィールドが警告を識別します。ネットワーク関連の code には以下があります：

| Code | 意味 |
| --- | --- |
| `network_errors` | 持続的なインターフェースごとのエラー率（累積カウンターではなく 1 秒あたりのイベント数） |
| `network_drops` | 持続的なインターフェースごとのパケットドロップ率 |
| `tcpconn_high` | TCP ソケット数が異常に多い（≥5000 警告 / ≥20000 クリティカル） |
| `conntrack_high` | conntrack テーブルが逼迫（≥85% 警告 / ≥95% クリティカル、Linux） |

`network_errors` / `network_drops` を決めるのはレートであり生のカウンターではないため、長期間累積された総量が、本来健全なホストをフラグし続けることはありません。

### `POST /api/v1/net/diag`

オンデマンドでネットワーク診断を実行します —— [`net` コマンド](/ja/net) と同じプローブをダッシュボードから呼び出せます。保護された mux にマウントされているため、トークン認証の有効時は他の `/api/v1/*` ルートと同様にトークン / cookie と同一 origin チェックを継承します。

リクエストボディ：

| フィールド | 説明 |
| --- | --- |
| `action` | `dns`、`port`、`ping`、`ip` |
| `target` | ドメイン（dns）またはホスト（port/ping）。必須。`ip` の場合は調査する IP、空なら自分のパブリック IP |
| `port` | 対象ポート（port / ping） |
| `server` | 任意の DNS サーバー（dns）または IP 参照サービスの base URL（ip） |
| `timeout_ms` | プローブごとのタイムアウト（ミリ秒、port / ping） |
| `count` | プローブ回数（ping） |
| `mode` | ping モード：`tcp`（デフォルト）または `icmp` |

例：

```bash
curl -X POST http://127.0.0.1:20021/api/v1/net/diag \
  -H 'Content-Type: application/json' \
  -d '{"action":"ping","target":"example.com","port":443,"count":4,"mode":"tcp"}'
```

レスポンスの構造は対応する CLI の JSON 結果（`DNSResult`、`PortResult`、`PingResult`、`IPInfo`）と一致します。

### `GET /ws`

完全なダッシュボードスナップショットの WebSocket ストリーム。

- 接続直後に最新スナップショットを送信します
- コレクターの更新に合わせてリフレッシュされたスナップショットを流し続けます
- トークン保護モードでは、リクエストは認証され同一 origin チェックを通過する必要があります

## 関連項目

- [Web ダッシュボードガイド](/ja/web-dashboard)
- [コマンドリファレンス](/ja/commands)
