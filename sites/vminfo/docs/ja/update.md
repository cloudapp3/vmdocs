---
title: update
description: 最新の vminfo タグ付きリリースを確認・インストールします。
---

# `vminfo update`

GitHub Releases を確認し、可能な場合は最新のタグ付きビルドをインストールします。

## 使い方

```bash
vminfo update
vminfo update --check
vminfo update --version v0.1.0
```

## メモ

- `--check` はアップデートの確認のみを行います。
- `--version` は特定のリリースタグを確認・インストールします。
- 開発ビルドは `--version` なしでは自己アップデートできません。
- Windows では、バイナリが実行中に自身を置き換えられないため、インストールモードはサポートされません。

## 例

```bash
vminfo update --check
```

## 関連情報

- [インストール](/ja/installation)
- [Changelog](/changelog)
