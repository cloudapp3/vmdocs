---
title: 部署
description: 将文档站点部署到 Cloudflare Pages，配置正确的构建输出与自定义域名。
---

# 部署

本文档站点设计为可直接从 `cloudapp3/vmdocs` 文档 monorepo 顺利部署到 Cloudflare Pages。

## Cloudflare Pages 设置

| 设置 | 值 |
| --- | --- |
| 框架预设 | VitePress 或 None |
| 构建命令 | `pnpm docs:build:vminfo` |
| 构建输出目录 | `sites/vminfo/docs/.vitepress/dist` |
| 根目录 | `/` |
| Node.js 版本 | 20 或更高 |

如果 Pages 项目需要在构建期间安装依赖，请使用：

```bash
corepack enable && pnpm install --frozen-lockfile && pnpm docs:build:vminfo
```

## 自定义域名

- 使用文档子域名，例如 `vminfo.bestcheapvps.org`
- 先在 Cloudflare Pages 项目中添加自定义域名
- 然后按照 Cloudflare 的提示配置 DNS
- 不要在未关联 Pages 项目的情况下只创建手动 CNAME

## Base 路径

- 对于位于站点根目录的自定义域名，不要设置 `base`
- 对于子路径部署（例如 `https://example.com/vminfo/`），设置 `base: "/vminfo/"`

## 输出

Cloudflare Pages 应从 `sites/vminfo/docs/.vitepress/dist` 发布静态站点。
