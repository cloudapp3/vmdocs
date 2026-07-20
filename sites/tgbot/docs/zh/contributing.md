---
title: 参与 tgbot 代码与文档贡献
description: 了解如何测试、重新生成、记录并提交可靠的 tgbot Go Telegram Bot SDK 代码与文档改动。
---

# 参与贡献

代码和 Web 文档分别位于两个仓库：

- SDK：[cloudapp3/tgbot](https://github.com/cloudapp3/tgbot)
- 文档：[cloudapp3/vmdocs](https://github.com/cloudapp3/vmdocs/tree/main/sites/tgbot/docs)

## 校验 SDK 改动

先运行目标 package，再执行完整检查：

```bash
go test ./...
go test -race ./...
go vet ./...
test -z "$(gofmt -l .)"
./scripts/check_generated.sh
```

生成文件的变更必须来自 `cmd/apigen` 或更新后的官方 schema，不能手工编辑生成结果。

## 校验文档改动

在 vmdocs 仓库运行：

```bash
pnpm install --frozen-lockfile
pnpm docs:dev:tgbot
pnpm docs:build:tgbot
pnpm check:seo:tgbot
```

生产构建会自动运行 tgbot 严格 SEO 检查，覆盖标题与摘要、canonical、
robots 指令、完整 hreflang 语言组、社交元数据与图片、JSON-LD、sitemap
和 `robots.txt`。

## 内容归属

- 面向任务的长文放在 vmdocs。
- Go API 注释放在 tgbot 源码和 pkg.go.dev。
- Release notes 跟随对应的 tgbot release。
- Telegram 字段语义链接官方 Bot API，不复制整份上游手册。
- 英文和中文页面已经建立对应关系时，两边必须同步更新。

不要在测试、文档、截图和 issue 中放入真实 Bot token、Webhook secret、私有 Update payload 或用户标识。

提交改动前，应先确认 [API 覆盖约定](/zh/reference/api-coverage)，并编译文档列出的[示例](/zh/examples/)。
