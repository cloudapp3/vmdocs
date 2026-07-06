---
title: インストール
description: シェルインストーラー、go install、または任意のバイナリディレクトリで vminfo をインストールします。
---

# インストール

## シェルインストーラー（Linux/macOS）

インストーラースクリプトは Linux と macOS で最速の導入方法です。

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vminfo/main/install.sh | bash
```

sudo を使う場合：

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vminfo/main/install.sh | sudo bash
```

スクリプトは以下の順序でインストール先を自動選択します：

1. `/usr/local/bin`
2. `~/.local/bin`
3. `~/bin`

インストール先を固定したい場合は `--dir` を指定します：

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vminfo/main/install.sh | bash -s -- --dir /opt/bin
```

チェックサム検証を明示的にスキップしたい場合は `--skip-verify` も使えます。

## go install

```bash
go install github.com/cloudapp3/vminfo/cmd/vminfo@latest
```

## アップデート

```bash
vminfo update
vminfo update --check
vminfo update --version v0.1.0
```

メモ：

- `vminfo update` は tagged ビルドを実行している場合、最新の tagged リリースをインストールします
- `vminfo update --check` はアップデートの確認のみ行います
- `vminfo update --version v0.1.0` は指定したリリースタグを確認・インストールします

## PATH のトラブルシューティング

`vminfo` をインストールしたのにコマンドが見つからない場合は、インストール先が `PATH` に含まれているか確認してください。

よくある例：

```bash
export PATH="$HOME/.local/bin:$PATH"
export PATH="$HOME/bin:$PATH"
```

## アンインストール

インストール先のディレクトリからバイナリを削除します：

```bash
rm -f /usr/local/bin/vminfo
rm -f ~/.local/bin/vminfo
rm -f ~/bin/vminfo
```
