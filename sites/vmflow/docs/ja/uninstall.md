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
| 設定ファイル | [`service`](./service) のプラットフォームデフォルト設定と、インストーラ所有の隣接設定。ユーザー所有の隣接設定は保持されます。 |
| 外部 TLS / ACME 証明書 | vmflow 管理外の証明書とキーファイルは保持されます。 |
| ログディレクトリ | 例: `/var/log/vmflow`（Linux/macOS）、`C:\ProgramData\vmflow\logs`（Windows）。 |
| 自己更新キャッシュ | アップデータのキャッシュディレクトリ。 |
| vmflow バイナリ | 実行中の実行ファイル。最後に削除されます。 |

::: warning パッケージマネージャによるインストールの場合
バイナリがパッケージマネージャ（`dpkg` / `rpm`）に所有されている場合、`uninstall` は警告を表示し、代わりに `apt remove` / `yum remove` を推奨します。ファイルを直接削除するとパッケージデータベースが古いままになるからです。確認すればそのまま続行します。
:::

保護されたパス（システムルート、ホームディレクトリ）は削除されません。

## インストーラ管理のインストール

`install.sh` で作成したユーザーインストールでは、インストーラレベルの削除を推奨します。

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vmflow/main/install.sh \
  | bash -s -- --uninstall
```

対応していれば `vmflow uninstall` に委譲し、古いまたは欠落したバイナリではシェルのクリーンアップにフォールバックします。バイナリの削除が成功した後、`.zshrc`、`.bashrc`、または `.profile` からインストーラ所有の正確な PATH ブロックも削除します。類似するユーザー作成の PATH 行、シンボリックリンク、書き込み不可の起動ファイルは変更しません。

root 所有のシステムインストールを削除する場合に限り `sudo bash -s -- --uninstall` を使用してください。明示したカスタムディレクトリを削除する場合は `--uninstall` とともに `--dir PATH` を渡します。

## 例

```bash
# preview only
vmflow uninstall --dry-run

# full teardown (will prompt to confirm)
sudo vmflow uninstall
```
