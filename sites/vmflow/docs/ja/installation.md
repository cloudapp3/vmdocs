---
title: インストール
description: 権限を考慮したユーザー/システムインストール、PATH 設定、チェックサム検証、アンインストールに対応するスクリプトで GitHub Releases から vmflow を導入します。
---

# インストール

`vmflow` は Linux と macOS（`amd64` および `arm64`）向けに単一のスタティックバイナリとして提供されています。インストーラで GitHub Releases から取得するか、ソースからビルドしてください。

リリースではディストリビューション管理の `.deb` や `.rpm` ではなく、移植可能なアーカイブを公開します。以下のインストーラを使うか、アーカイブを手動で展開してください。

## 推奨ユーザーインストール

```bash
VMFLOW_BIN_DIR="$(
  curl -fsSL https://raw.githubusercontent.com/cloudapp3/vmflow/main/install.sh \
    | bash -s -- --version v0.2.0-rc.4 --print-install-dir
)" \
  && [ -n "$VMFLOW_BIN_DIR" ] \
  && [ "${VMFLOW_BIN_DIR#/}" != "$VMFLOW_BIN_DIR" ] \
  && [ -x "$VMFLOW_BIN_DIR/vmflow" ] \
  && export PATH="$VMFLOW_BIN_DIR:$PATH"
```

このコマンドは現行プレリリースを固定し、選択されたディレクトリを現在のシェルの PATH に追加します。最新の安定版を使う場合は `--version v0.2.0-rc.4` を省略してください。現在、バージョンを省略すると `v0.1.1` が選ばれ、このドキュメントの MCP と Source IP ポリシーは含まれません。

## システム全体へのインストール

ダウンロードしたスクリプト全体を root で実行せずに `/usr/local/bin` へインストールします。

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vmflow/main/install.sh \
  | bash -s -- --version v0.2.0-rc.4 --system
```

非 root ユーザーが `--system` を指定すると、インストーラはダウンロード前に sudo を検証し、対象の確認と書き込みだけに使用します。新しく作成された隣接設定は root 所有かつモード `0600` になります。インストーラが表示する root/sudo 用の確認・起動コマンドを使用してください。

別のリリースを導入するには、`--version` に渡すタグを変更します。

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vmflow/main/install.sh | bash -s -- --version v0.2.0-rc.4
```

### インストーラのオプション

| オプション | 説明 |
| --- | --- |
| `--version <tag>` | 特定のリリースタグをインストールします。省略時は最新の安定版になります。 |
| `--dir <path>` | 明示したディレクトリへインストールします。`VMFLOW_INSTALL_DIR` でも指定できます。 |
| `--system` | `/usr/local/bin` へシステムインストールし、必要な場合だけ sudo を使用します。 |
| `--skip-verify` | SHA-256 チェックサム検証をスキップします。 |
| `--no-modify-path` | 自動選択したユーザーディレクトリをシェル起動ファイルへ追加しません。 |
| `--print-install-dir` | 成功後、選択したディレクトリだけを stdout に出力します。 |
| `--uninstall` | 利用可能なら `vmflow uninstall` で削除し、古い/欠落したバイナリではシェルのフォールバックを使用します。 |
| `-h, --help` | ヘルプを表示します。 |

### ディレクトリと PATH

`--dir` を省略すると、まず隣接設定を持つ既存の標準的な vmflow インストール先を再利用します。新規の root インストールは `/usr/local/bin` を使用します。一般ユーザーでは、すでに PATH にある `~/.local/bin` または `~/bin` を優先し、それ以外は `~/.local/bin` にフォールバックします。

自動ユーザーインストールでは、必要に応じて `.zshrc`、`.bashrc`、または `.profile` に冪等な PATH ブロックを一つ追加し、正確な再読み込みコマンドを表示します。現在のシェル自体は変更できないため、推奨コマンドでは `--print-install-dir` を取得して直ちに export します。`--dir` または `VMFLOW_INSTALL_DIR` を明示した場合、シェル起動ファイルは変更されません。

### 設定とアーカイブの互換性

インストーラは GitHub Release アーカイブをダウンロードし、デフォルトで `checksums.txt` を SHA-256 検証します。現在のトップレベル `config.yaml` と、旧アーカイブの `examples/config.yaml` の両方に対応します。初回インストールではバイナリの隣にモード `0600` の `config.yaml` を作成し、アップグレードではバイナリだけを置き換えて既存設定と転送ルールを保持します。

プライベートリリースや GitHub API のレート制限を緩和したい場合は、`GITHUB_TOKEN` または `GH_TOKEN` を設定してください。

## ソースからビルドする

必要なもの: [Go](https://go.dev/dl/)（最近のバージョン。`go.mod` を参照）。

```bash
git clone https://github.com/cloudapp3/vmflow.git
cd vmflow
go build -trimpath -o vmflow ./cmd/vmflow
```

または Makefile を使います。

```bash
make build
```

## インストールの確認

```bash
vmflow version
vmflow version -json
```

## vmflow の更新

タグ付きリリース（v0.1.1 以降）からインストールしていれば、`vmflow` は自身を更新できます。

```bash
vmflow update --check            # check for a newer release
vmflow update                    # install the newest release
vmflow update --version v0.2.0-rc.4 # 現行プレリリースをインストール
```

詳細、フラグ、プラットフォームごとの注意事項は [`vmflow update`](./update) を参照してください。

## インストーラ管理のコピーを削除する

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vmflow/main/install.sh \
  | bash -s -- --uninstall
```

バイナリの削除が成功すると、インストーラが追加した正確な PATH ブロックも削除されます。root 所有のシステムインストールを削除する場合に限り `sudo bash -s -- --uninstall` を使用してください。削除範囲と保持ルールは [`vmflow uninstall`](./uninstall) を参照してください。
