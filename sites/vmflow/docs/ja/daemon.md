---
title: vmflow
description: foreground、ctl、tui、version、update、service、uninstall の vmflow CLI リファレンス。
---

# vmflow

```bash
vmflow -config ./examples/config.yaml [-control-port 19090]
```

フォアグラウンド実行は設定を読み込み、ループバック専用の内部管理チャネルを開始し、ルールをスナップショットとして適用して `SIGINT` / `SIGTERM` まで動作します。

## フラグ

| フラグ | デフォルト | 説明 |
| --- | --- | --- |
| `-config` | _(必須)_ | YAML 設定ファイルのパス。 |
| `-control-port` | _(設定値)_ | ループバック管理ポートを上書きします。 |
| `-log-file` | _(標準出力)_ | 標準出力の代わりにログをこのファイルに書き出します（サービスマネージャ配下で有用。Windows では必須）。 |

## ランタイムの挙動

- 起動時、ルールはスナップショット（`ReplaceAll`）経由で適用されます。[ルールとライフサイクル](./rules)を参照してください。
- サポートされる管理手段は `vmflow ctl` と `vmflow tui` です。

- 管理された起動時サービスとして実行するには、[`vmflow service`](./service) を参照してください。
