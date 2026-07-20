---
title: tgbot Go Telegram Bot 示例
description: 运行 tgbot 的消息、命令、订阅、长轮询和 Telegram Webhook Go 示例，并区分稳定版与 v0.2 预览。
---

# 示例

源码仓库提供了可随 SDK 编译的小型程序，并明确区分不同传输方式。

| 示例 | 展示内容 | 运行命令 |
| --- | --- | --- |
| [quickstart](https://github.com/cloudapp3/tgbot/tree/v0.1.0/examples/quickstart) | 一次强类型 `SendMessage` 调用。 | `go run ./examples/quickstart` |
| [commands](https://github.com/cloudapp3/tgbot/tree/v0.1.0/examples/commands) | 直接 `GetUpdates`、offset 与命令解析。 | `go run ./examples/commands` |
| [async_updates (v0.2 Preview)](https://github.com/cloudapp3/tgbot/tree/master/examples/async_updates) | Poller 类型订阅和错误流消费。 | `go run ./examples/async_updates` |
| [ext_polling](https://github.com/cloudapp3/tgbot/tree/v0.1.0/examples/ext_polling) | 使用轮询的 `ext.Application`。 | `go run ./examples/ext_polling` |
| [webhook](https://github.com/cloudapp3/tgbot/tree/v0.1.0/examples/webhook) | 通过 `net/http` 接入 `ext` 路由。 | `go run ./examples/webhook` |

## 环境变量

| 变量 | 使用位置 |
| --- | --- |
| `BOT_TOKEN` | 所有示例。 |
| `CHAT_ID` | `quickstart`。 |
| `WEBHOOK_SECRET` | `webhook`。 |
| `ADDR` | 可选 Webhook 监听地址，默认 `:8080`。 |

示例：

```bash
BOT_TOKEN='replace-me' CHAT_ID='replace-me' go run ./examples/quickstart
```

## 不访问 Telegram，只做编译

```bash
go test ./examples/...
```

只有实际运行 `main` 时，示例才会读取凭据并访问 Telegram。

## 建议学习顺序

1. 运行 `quickstart`，验证凭据和会话权限。
2. 阅读 `commands`，理解 offset 和 Update payload。
3. 多个消费者需要类型更新流时使用 `async_updates`。
4. 需要 Handler 和 Filter 时使用 `ext_polling`。
5. 理解 HTTPS 与 secret 边界后，再部署 `webhook`。

先完成[快速开始](/zh/guide/quick-start)，再比较[长轮询](/zh/updates/long-polling)与 [Webhook](/zh/updates/webhook)的生产边界。
