---
title: vmflow service
description: vmflow を起動時に開始しクラッシュ時に再起動するネイティブ OS サービスとして登録する — systemd、launchd、または Windows サービス。
---

# vmflow service

```bash
vmflow service (install|uninstall|status) [flags]
```

エイリアス: `vmflow svc`。

`vmflow` を**起動時に開始**し**クラッシュ時に再起動**するネイティブ OS サービスとして登録します：

| プラットフォーム | 仕組み | 場所 |
| --- | --- | --- |
| Linux | systemd ユニット | `/etc/systemd/system/<name>.service` |
| macOS | launchd デーモン | `/Library/LaunchDaemons/io.cloudapp.<name>.plist` |
| Windows | Windows サービス | `services.msc` / `sc.exe` で管理 |

このサービスは単にプラットフォームのスーパーバイザ配下で `vmflow` を実行します。Linux と macOS ではスーパーバイザが停止のために `SIGTERM` を送信します。Windows ではデーモンが Service Control Manager を検出して状態を報告します。SCM には標準出力がないため、ログの既定値は `C:\ProgramData\vmflow\logs\vmflow.log` です。

## アクション

| アクション | 説明 |
| --- | --- |
| `install` | 設定を検証し、ユニット/plist/Windows サービスを作成または更新して、**有効化**し、すぐに**開始**します。再実行すると既存サービスを更新して再起動します。Linux/macOS では root、Windows では管理者権限が必要です。 |
| `uninstall` | サービスを停止して削除します。設定ファイルとログファイルはそのまま残ります。 |
| `status` | 現在のサービス状態を表示します。 |

## フラグ

| フラグ | デフォルト | 説明 |
| --- | --- | --- |
| `-config` | プラットフォームパス¹ | サービスが使用する設定ファイル。内容が有効で、root/管理者所有の保護された場所にある必要があります。 |
| `-user` | `root` _(systemd)_ | ユニットをこのユーザーとして実行します。存在しない場合はシステムユーザーとして作成されます。Linux のみ。 |
| `-log-file` | プラットフォーム既定値 | ログ出力先を上書きします。Linux は stdout/journald、macOS は launchd のパス、Windows は `C:\ProgramData\vmflow\logs\vmflow.log` を使用します。 |
| `--control-port` | 設定値 | ローカル管理ポートを上書きします。ホストは `127.0.0.1` のままです。 |
| `--extra-arg` | _(なし)_ | 将来のデーモンフラグを `--extra-arg=-flag=value` 形式で追加します。複数回指定できます。既存フラグには専用オプションを使用します。 |
| `-binary` | 現在の実行ファイル | vmflow バイナリのパス。`install` では、信頼できる場所にある root/管理者所有の**絶対パス**でなければなりません。 |

¹ デフォルトの設定パス: Linux `/etc/vmflow/config.yaml`、macOS `/usr/local/etc/vmflow/config.yaml`、Windows `C:\ProgramData\vmflow\config.yaml`。

## 例

```bash
# 1. install a config at the default system path, then register the service
sudo vmflow service install

# 2. point the service at a specific config and run it as a dedicated user
sudo vmflow service install -config /etc/vmflow/config.yaml -user vmflow

# 3. 必要に応じてループバック管理ポートを変更
sudo vmflow service install --control-port 19100

# 4. check / remove
vmflow service status
sudo vmflow service uninstall
```

## セキュリティ上の注記

- `install` では、バイナリと設定の両方が、信頼できる場所にある root/管理者所有の絶対パスに解決される必要があります。サービス定義を変更する前に設定を解析します。
- 管理リスナーは常に `127.0.0.1` にバインドされます。リモート管理には SSH トンネルを使用します。

完全な削除（サービス + バイナリ + 設定 + ログ + 証明書）は、代わりに [`vmflow uninstall`](./uninstall) を使ってください。
