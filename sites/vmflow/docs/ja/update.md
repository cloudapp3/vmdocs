---
title: vmflow update
description: 最新の vmflow リリースの確認またはインストール — vmflow update、--check、--version。
---

# vmflow update

GitHub Releases を確認し、`vmflow` の最新のタグ付きビルドをその場でインストールします。

```bash
vmflow update [--check] [--version <tag>]
```

エイリアス: `vmflow u`。

## フラグ

| フラグ | 説明 |
| --- | --- |
| `--check` | アップデートの確認のみ行い、インストールしません。 |
| `--version <tag>` | 特定のリリースタグ（例: `v0.1.1`）をインストールまたは検査します。 |

## 実行内容

1. `cloudapp3/vmflow` の GitHub Releases API に問い合わせます。
2. 最新リリースを実行中ビルドのバージョンと比較します。
3. インストール時: 現在の OS/アーキテクチャ用のアーカイブをダウンロードし、SHA-256 で `checksums.txt` に対して検証し、バイナリを展開し、実行中の `vmflow` バイナリを原子的に置き換えます。

## 例

新しいリリースが利用可能か、インストールせずに確認します：

```bash
vmflow update --check
```

最新リリースをインストールします：

```bash
vmflow update
```

特定バージョンをインストールします：

```bash
vmflow update --version v0.1.1
```

## 注記

- `dev` ビルド（例: リリースの ldflags なしでソースからビルドした場合）は、現在のバージョンが不明なため `--version` なしでは自己更新できません。その場合は `vmflow update --version vX.Y.Z` を使ってください。
- アップデート確認はキャッシュディレクトリ（`~/.cache/vmflow/update-check.json` または `$XDG_CACHE_HOME/vmflow`）に 24 時間キャッシュされます。特定のタグでキャッシュをバイパスするには `--version` を使ってください。
- **Windows**: 自己更新（バイナリ置き換え）はサポートされていません。`--check` は機能します。Windows でアップデートするには `install.sh` またはリリースアーカイブで再インストールしてください。
- プライベートリリースや GitHub API のレート制限を緩和したい場合は、`GITHUB_TOKEN` または `GH_TOKEN` を設定してください。
- 自己更新は実行中のバイナリを置き換えるため、そのバイナリへの書き込み権限が必要です。権限エラーで失敗した場合は、適切な権限（例えば `sudo`）で再実行するか、インストールパスの権限を修正してください。

## 関連項目

- [インストール](./installation)
- [Changelog](/changelog)
