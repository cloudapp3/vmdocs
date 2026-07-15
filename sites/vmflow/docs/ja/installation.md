---
title: インストール
description: GitHub Releases のワンライナーインストーラで vmflow をインストールするか、ソースからビルドします。--version、--dir、--skip-verify、GITHUB_TOKEN に対応。
---

# インストール

`vmflow` は Linux と macOS（`amd64` および `arm64`）向けに単一のスタティックバイナリとして提供されています。インストーラで GitHub Releases から取得するか、ソースからビルドしてください。

リリースではディストリビューション管理の `.deb` や `.rpm` ではなく、移植可能なアーカイブを公開します。以下のインストーラを使うか、アーカイブを手動で展開してください。

## ワンライナーインストーラ

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vmflow/main/install.sh | bash
```

`/usr/local/bin` にグローバルインストールします。

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vmflow/main/install.sh | sudo bash -s -- --dir /usr/local/bin
```

特定のリリースタグをインストールします。

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vmflow/main/install.sh | bash -s -- --version v0.1.0
```

### インストーラのオプション

| オプション | 説明 |
| --- | --- |
| `--version <tag>` | 特定のリリースタグをインストールします。省略時は最新リリースになります。 |
| `--dir <path>` | インストール先ディレクトリ。省略時は自動検出されます（後述）。 |
| `--skip-verify` | SHA-256 チェックサム検証をスキップします。 |
| `--uninstall` | `vmflow uninstall` に処理を委譲します（サービス、バイナリ、設定、ログ、証明書、更新キャッシュを削除）。 |
| `-h, --help` | ヘルプを表示します。 |

インストーラは GitHub Release のアーカイブをダウンロードし、デフォルトで SHA-256 による `checksums.txt` の検証を行い、インストール先ディレクトリを `/usr/local/bin` → `~/.local/bin` → `~/bin` の順に自動検出します。`--dir PATH` または `VMFLOW_INSTALL_DIR` 環境変数で上書きできます。

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

## PATH が設定されていない場合

インストーラが選択ディレクトリが `PATH` にないと報告した場合は、シンボリックリンクを作成します。

```bash
sudo ln -sf "$HOME/.local/bin/vmflow" /usr/local/bin/vmflow
```

…あるいはそのディレクトリをシェルの `PATH` に追加してください。

```bash
export PATH="$HOME/.local/bin:$PATH"
```

## vmflow の更新

タグ付きリリース（v0.1.1 以降）からインストールしていれば、`vmflow` は自身を更新できます。

```bash
vmflow update --check            # check for a newer release
vmflow update                    # install the newest release
vmflow update --version v0.1.1   # install a specific version
```

詳細、フラグ、プラットフォームごとの注意事項は [`vmflow update`](./update) を参照してください。（v0.1.0 リリースには `update` コマンドが存在しません。自己更新を利用するには、上記インストーラで再インストールしてください。）
