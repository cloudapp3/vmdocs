---
title: vmflow uninstall
description: vmflow のワンコマンドアンインストール — サービス、バイナリ、設定、ログ、証明書、更新キャッシュを削除します。
---

# vmflow uninstall

```bash
vmflow uninstall [--dry-run]
```

エイリアス: `vmflow remove`、`vmflow rm`。

vmflow インストールの完全な削除を行います。**計画 → 確認 → 実行**のフローを実行します：

1. **計画** — システムを調査し、削除されるすべてのものを一覧表示します。
2. **確認** — `[y/N]` でプロンプトします（`--dry-run` の場合や削除するものがない場合はスキップされます）。
3. **実行** — 順序に従って項目を削除します。すでに存在しないパスを許容するため、コマンドは冪等です。

## フラグ

| フラグ | デフォルト | 説明 |
| --- | --- | --- |
| `--dry-run` | `false` | 何も削除せずに削除計画を表示します。 |

## 削除対象

項目は次の順序で削除されます（サービスを最初に、実行中のバイナリを最後に行うことで、監視下にあるデーモンがその実行ファイルより先に確実になくなります）：

| 項目 | 備考 |
| --- | --- |
| ネイティブサービス | systemd ユニット / launchd plist / Windows サービスを停止して削除します。 |
| 設定ファイル | [`service`](./service) のプラットフォームデフォルト設定（存在する場合）。 |
| TLS / ACME 証明書 | **設定で参照されている**証明書とキーのパス（`control_tls`、ACME/証明書キャッシュディレクトリ）。 |
| ログディレクトリ | 例: `/var/log/vmflow`（Linux/macOS）、`C:\ProgramData\vmflow\logs`（Windows）。 |
| 自己更新キャッシュ | アップデータのキャッシュディレクトリ。 |
| vmflow バイナリ | 実行中の実行ファイル。最後に削除されます。 |

::: warning パッケージマネージャによるインストールの場合
バイナリがパッケージマネージャ（`dpkg` / `rpm`）に所有されている場合、`uninstall` は警告を表示し、代わりに `apt remove` / `yum remove` を推奨します。ファイルを直接削除するとパッケージデータベースが古いままになるからです。確認すればそのまま続行します。
:::

保護されたパス（システムルート、ホームディレクトリ）は削除されません。

## 例

```bash
# preview only
vmflow uninstall --dry-run

# full teardown (will prompt to confirm)
sudo vmflow uninstall
```
