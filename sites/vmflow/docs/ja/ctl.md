---
title: vmflow ctl
description: サポート対象 CLI で実行中の vmflow を照会・管理します。
---

# vmflow ctl

```bash
vmflow ctl [-token TOKEN] <subcommand>
```

エイリアス: `vmflow c`。

`ctl` はローカルデーモン用のサポート対象コマンドです。認証時は `-token` または `VMFLOW_CONTROL_TOKEN` を使用します。

## サブコマンド

| サブコマンド | 説明 |
| --- | --- |
| `rules` | 実行中のルールを表示します。 |
| `stats` | ルールごとのトラフィック統計を表示します。 |
| `metrics` | Prometheus テキストメトリクスを出力します。 |
| `precheck` | 適用せずに設定を検証します。 |
| `reload` | 事前チェック後に設定を再読み込みします。 |

## 例

```bash
vmflow ctl rules
vmflow ctl stats
vmflow ctl precheck
vmflow ctl reload
vmflow ctl -token change-me reload
```

::: tip
変更を伴うサブコマンド（`reload`）は、認証が有効な場合 `admin` トークンを要求します。読み取り専用のサブコマンドは `viewer` トークンで動作します。
:::
