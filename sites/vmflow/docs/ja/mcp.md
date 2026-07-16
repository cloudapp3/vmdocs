---
title: MCP サーバー
description: 読み取り専用 stdio アダプターを介して Claude、Codex、その他の MCP クライアントを実行中の vmflow デーモンに接続します。
---

# MCP サーバー

`vmflow mcp` は、ツール専用の MCP サーバーを stdio 上でフォアグラウンド
起動します。ループバック管理チャネルを介して、すでに実行中の vmflow
デーモンに接続します。転送を開始せず、MCP のネットワークポートを開かず、
デーモン設定も変更しません。

## 要件

- vmflow デーモンと同じホストで MCP コマンドを実行します。
- デーモンの管理リスナーをループバックに限定します。
- 認証を有効にした場合は、`VMFLOW_CONTROL_TOKEN` で専用の viewer token
  を使用します。

## ツール

| ツール | 用途 |
| --- | --- |
| `get_vmflow_status` | 接続、バージョン、権限、ルール数、トラフィック、degraded 状態の概要 |
| `list_forwarding_rules` | エンドポイントや送信元ポリシーの詳細を含まないフィルター済みルール一覧 |
| `get_forwarding_rule` | 明示的に選択した 1 ルールの全設定、実行状態、統計 |
| `get_traffic_stats` | フィルター済みのルール別カウンターと集計値 |
| `run_config_precheck` | 現在永続化されている設定の読み取り専用検証 |

すべてのツールは読み取り専用です。一覧と事前チェックは既定で 50 件、最大
200 件を返します。アダプターが同時に実行するツール呼び出しは最大 4 件です。

## Viewer token

MCP クライアント専用の token を設定します。

```yaml
auth:
  enabled: true
  tokens:
    - name: mcp-viewer
      token: replace-with-a-long-random-token
      role: viewer
```

プロセスのコマンドラインに token が見える `-token` より、環境変数の使用を
推奨します。

## Claude Desktop

```json
{
  "mcpServers": {
    "vmflow": {
      "command": "/usr/local/bin/vmflow",
      "args": ["mcp"],
      "env": {
        "VMFLOW_CONTROL_TOKEN": "replace-with-a-long-random-token"
      }
    }
  }
}
```

## Codex

```toml
[mcp_servers.vmflow]
command = "/usr/local/bin/vmflow"
args = ["mcp"]
env = { VMFLOW_CONTROL_TOKEN = "replace-with-a-long-random-token" }
```

デーモンが既定以外の管理ポートを使う場合は、`args` に `-addr` とループ
バック URL を追加します。

```json
"args": ["mcp", "-addr", "http://127.0.0.1:49127"]
```

`-addr` が受け付けるのは `localhost` またはループバック IP のみです。別の
マシン上のデーモンには、管理リスナーを公開せず、SSH などを使ってその
マシン上で `vmflow mcp` を実行してください。

## データ境界

ルール詳細には、転送先アドレス、送信元 IP ポリシー、ドメイン、備考が含ま
れる場合があります。トラフィックと事前チェックの結果からローカルネット
ワーク構成が分かる場合もあります。ツール結果は MCP クライアントに設定した
モデルへ送信されます。

MCP サーバーは、設定の書き込み、生の YAML、bot token、証明書の秘密鍵、
シェル実行、ファイルアクセス、prompts、resources を公開しません。事前
チェックは、デーモン設定にすでに含まれる転送先を名前解決する場合があります。

## トラブルシューティング

- `connected: false`: 設定したループバックアドレスでデーモンに接続できません。
- HTTP `401`: `VMFLOW_CONTROL_TOKEN` に正しい viewer token を設定します。
- Session エンドポイントが利用不可: MCP サーバーと同じ vmflow release で
  デーモンを再起動します。
- 独自 TLS または mTLS: `vmflow ctl` と `vmflow tui` が対応する同じ
  `-tls-*` フラグを使います。
