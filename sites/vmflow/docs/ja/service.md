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

このサービスは単にプラットフォームのスーパーバイザ配下で `vmflow daemon` を実行します。Linux と macOS ではスーパーバイザが停止のために `SIGTERM` を送信します。Windows ではデーモンは起動時に Service Control Manager を検出して自身で状態を報告します（標準出力は利用できないため、`-log-file` が必須です）。

## アクション

| アクション | 説明 |
| --- | --- |
| `install` | ユニット/plist を生成（または Windows サービスを登録）し、**有効化**し、今すぐ**開始**します。Linux/macOS では root、Windows では管理者権限が必要です。 |
| `uninstall` | サービスを停止して削除します。設定ファイルとログファイルはそのまま残ります。 |
| `status` | 現在のサービス状態を表示します。 |

## フラグ

| フラグ | デフォルト | 説明 |
| --- | --- | --- |
| `-config` | プラットフォームパス¹ | サービスが実行に使用する設定ファイルのパス。設定はすでに存在している必要があります。 |
| `-user` | `root` _(systemd)_ | ユニットをこのユーザーとして実行します。存在しない場合はシステムユーザーとして作成されます。Linux のみ。 |
| `-log-file` | _(標準出力)_ | デーモンのログをここにリダイレクトします。Linux/Windows では `-log-file` として渡されます。macOS では launchd のキャプチャパスを設定します。Windows では事実上**必須**です。 |
| `-extra-args` | _(なし)_ | デーモンコマンドラインにそのまま追加されるフラグ。例: `"-control-listen 0.0.0.0:19090"`。 |
| `-binary` | 現在の実行ファイル | vmflow バイナリのパス。`install` では、信頼できる場所にある root/管理者所有の**絶対パス**でなければなりません。 |

¹ デフォルトの設定パス: Linux `/etc/vmflow/config.yaml`、macOS `/usr/local/etc/vmflow/config.yaml`、Windows `C:\ProgramData\vmflow\config.yaml`。

## 例

```bash
# 1. install a config at the default system path, then register the service
sudo vmflow service install

# 2. point the service at a specific config and run it as a dedicated user
sudo vmflow service install -config /etc/vmflow/config.yaml -user vmflow

# 3. bind the control API off-loopback (auth/mTLS still required — see Deployment)
sudo vmflow service install -extra-args "-control-listen 0.0.0.0:19090"

# 4. check / remove
vmflow service status
sudo vmflow service uninstall
```

## セキュリティ上の注記

- `install` では、バイナリは信頼できるインストール場所にある絶対の root/管理者所有パスに解決されなければなりません。そうでない場合はインストールを拒否します。これは、特権インストールの後に特権の低いユーザーがバイナリを差し替えることを防ぎます。
- コントロール API の非ループバックバインドは、依然としてデーモンの[起動時安全チェック](./daemon#startup-safety)の対象です — `auth` または mTLS を有効にしないと、サービスはクラッシュループします。

完全な削除（サービス + バイナリ + 設定 + ログ + 証明書）は、代わりに [`vmflow uninstall`](./uninstall) を使ってください。
