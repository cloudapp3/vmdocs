---
title: vmflow tui
description: 実行中のデーモンに対して vmflow ターミナルダッシュボードを起動する。
---

# vmflow tui

```bash
vmflow tui [-addr http://127.0.0.1:19090] [-token TOKEN]
```

エイリアス: `vmflow t`。

ターミナルダッシュボードを起動します。コントロール API からライブ状態を読み取り、`ctl` と同じ共有クライアントフラグを受け付けます — TLS/mTLS やカスタムヘッダーを含みます（[共通クライアントフラグ](./commands#common-client-flags)を参照）。ビューと操作については [TUI ダッシュボード](./tui-guide)を参照してください。

## 例

```bash
vmflow tui
vmflow tui -addr http://10.0.0.5:19090 -token change-me
VMFLOW_CONTROL_TOKEN=change-me vmflow tui

# against a TLS-protected control API
vmflow tui -addr https://10.0.0.5:19090 \
  -tls-ca-file ca.pem -tls-client-cert client.pem -tls-client-key client.key
```
