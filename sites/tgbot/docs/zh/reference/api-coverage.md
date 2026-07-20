---
title: tgbot 的 Telegram Bot API 覆盖范围
description: 了解 tgbot 生成和校验了哪些 Telegram Bot API 方法、类型、字段与参数，以及覆盖检查的边界。
---

# API 覆盖

tgbot 根据 Telegram Bot API 官方文档生成类型、方法封装和 union 支持。

## 当前开发快照

尚未发布的 v0.2 master 代码基于 Telegram Bot API 10.2，该版本发布于 2026 年 7 月 14 日。在新 tag 发布前，最新正式 tgbot 版本仍是 `v0.1.0`。

依赖特定 Bot API 版本前，应同时检查生成文件头和 release tag。

## 重新生成 SDK

在 tgbot 仓库根目录运行：

```bash
go run ./cmd/apigen
```

需要确定性或离线生成时，传入已下载的官方页面：

```bash
go run ./cmd/apigen -html /path/to/telegram_bot_api.html
```

生成器会写入：

- `sdk_types.go`
- `sdk_methods.go`
- `sdk_unions.go`

## 校验生成结果

```bash
./scripts/check_generated.sh
python3 scripts/verify_telegram_bot_api_coverage.py
```

仓库包含压缩的 Bot API 文档快照，用于确定性生成检查。定时 workflow 会对照在线官方页面检测漂移。

## Coverage 脚本真正证明什么

脚本会比较：

- 官方具名类型与仓库类型、union interface
- 官方字段与生成的 JSON 字段名
- 官方方法与生成的 Params 结构体
- 官方参数与生成的 JSON 参数名

## 它不能证明什么

该脚本不证明每个 Go 字段类型、方法返回类型、union decoder、optional 规则或运行时行为都正确。这些约定仍需要测试和代码审查。

准确说法是：仓库匹配该脚本所检查的 Telegram Bot API 名称和字段、参数集合。

Go 签名以 [pkg.go.dev](https://pkg.go.dev/github.com/cloudapp3/tgbot)为准，平台语义以 [Telegram 官方文档](https://core.telegram.org/bots/api)为准。

生成代码的用法见[方法与类型](/zh/sdk/methods-and-types)，未发布 API 的变化见 [v0.2 迁移指南](/zh/migration/v0.2)。
