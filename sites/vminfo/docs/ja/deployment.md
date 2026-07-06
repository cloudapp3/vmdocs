---
title: デプロイ
description: ドキュメントサイトを Cloudflare Pages にデプロイし、ビルド出力とカスタムドメインを正しく設定します。
---

# デプロイ

このドキュメントサイトは、`cloudapp3/vmdocs` ドキュメントモノレポから Cloudflare Pages へ問題なくデプロイできるよう設計されています。

## Cloudflare Pages の設定

| 設定 | 値 |
| --- | --- |
| フレームワークプリセット | VitePress または None |
| ビルドコマンド | `pnpm docs:build:vminfo` |
| ビルド出力ディレクトリ | `sites/vminfo/docs/.vitepress/dist` |
| ルートディレクトリ | `/` |
| Node.js バージョン | 20 以上 |

Pages プロジェクトがビルド中に依存関係をインストールする必要がある場合は、以下を使います。

```bash
corepack enable && pnpm install --frozen-lockfile && pnpm docs:build:vminfo
```

## カスタムドメイン

- `vminfo.bestcheapvps.org` のようなドキュメント用サブドメインを使います
- まず Cloudflare Pages プロジェクト内でカスタムドメインを追加します
- 次に Cloudflare の指示に従って DNS を設定します
- Pages プロジェクトを紐付けずに手動 CNAME だけを作成しないでください

## ベースパス

- サイトルートのカスタムドメインの場合、`base` は設定しません
- `https://example.com/vminfo/` のようなサブパスへのデプロイでは、`base: "/vminfo/"` を設定します

## 出力

Cloudflare Pages は `sites/vminfo/docs/.vitepress/dist` から静的サイトを公開します。
