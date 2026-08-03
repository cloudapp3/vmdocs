---
title: vmflow tui
description: 実行中のデーモンに対して vmflow ターミナルダッシュボードを起動する。
---

# vmflow tui

```bash
vmflow tui [-addr URL] [-token TOKEN]
```

エイリアス: `vmflow t`。

ローカルデーモンのターミナルダッシュボードを起動します。デフォルトのローカルターゲットには、インストール済みで実行中のネイティブサービスが必要です。後から停止した場合は TUI から復旧できます。`vmflow run` で手動起動したデーモンには `-addr http://127.0.0.1:19090` を明示してサービスチェックを省略します。ビューと操作については [TUI ダッシュボード](./tui-guide)を参照してください。

## 例

```bash
vmflow tui
vmflow tui -addr http://127.0.0.1:19090
VMFLOW_CONTROL_TOKEN=change-me vmflow tui
```
