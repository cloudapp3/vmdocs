---
title: Go ライブラリ
description: vminfo を Go ライブラリとして組み込み、ホスト指標の収集とターミナル UI の統合を行います。
---

# Go ライブラリ

vminfo は、ホスト指標の収集とターミナル UI の組み込み用に公開パッケージを提供します。

## パッケージ

- `github.com/cloudapp3/vminfo`
- `github.com/cloudapp3/vminfo/tui`

## エクスポートされる型

- `StaticInfo`
- `RuntimeStats`
- `Snapshot`
- `ProcessInfo`
- `AppMetadata`

## 主要なエントリーポイント

- `CollectStatic`
- `CollectStats`
- `CollectAll`
- `Metadata`
- `tui.Run`

## 関連情報

- [指標を収集する](/ja/collect)
- [TUI を組み込む](/ja/embed-tui)
