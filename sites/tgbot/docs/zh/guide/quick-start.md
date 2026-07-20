---
title: 用 tgbot 构建第一个 Go Telegram Bot
description: 安装 tgbot，并基于稳定版 v0.1.0 用强类型 SendMessage 构建第一个 Go（Golang）Telegram Bot。
---

# 快速开始

本页基于最新正式 tag 构建一个最小 Go（Golang）Telegram Bot，只发送一条消息，不启动更新接收器。

## 准备条件

- Go 1.22 或更新版本
- 通过 [BotFather](https://t.me/BotFather) 创建的 Bot token
- 目标 chat ID 或频道用户名

Bot token 等同于密码。请放入环境变量，不能提交到代码仓库，也不要出现在 Shell 历史、截图和日志中。

## 创建模块

```bash
mkdir hello-tgbot
cd hello-tgbot
go mod init example.com/hello-tgbot
go get github.com/cloudapp3/tgbot@latest
```

## 发送消息

创建 `main.go`：

```go
package main

import (
	"context"
	"log"
	"os"

	"github.com/cloudapp3/tgbot"
)

func main() {
	token := os.Getenv("BOT_TOKEN")
	chatID := os.Getenv("CHAT_ID")
	if token == "" || chatID == "" {
		log.Fatal("BOT_TOKEN and CHAT_ID are required")
	}

	bot, err := tgbot.NewBot(token)
	if err != nil {
		log.Fatal(err)
	}

	_, err = bot.SendMessage(context.Background(), &tgbot.SendMessageParams{
		ChatID: chatID,
		Text:   "hello from tgbot",
	})
	if err != nil {
		log.Fatal(err)
	}
}
```

运行：

```bash
BOT_TOKEN='replace-me' CHAT_ID='replace-me' go run .
```

目标会话必须允许 Bot 发消息。私聊用户通常需要先主动启动与 Bot 的对话。

## 选择更新接收方式

| 方式 | 适用情况 |
| --- | --- |
| 直接调用 `GetUpdates` | 需要完全控制 offset、重试和分发。 |
| `UpdatePoller` | 需要后台轮询和过滤订阅。 |
| `ext.Application.RunPolling` | 需要 Handler 和 Filter，但不想公开 HTTP 地址。 |
| `ext.Application.WebhookHandler` | 已经有可公开访问的 HTTPS 服务。 |

下一步阅读[长轮询](/zh/updates/long-polling)或 [Webhook](/zh/updates/webhook)。

## 常见首次运行错误

- `telegram bot token is empty`：确认进程环境中存在 `BOT_TOKEN`。
- `401 Unauthorized`：更换被撤销或输入错误的 token。
- `400 Bad Request: chat not found`：检查 chat ID，并确认 Bot 能访问该会话。
- 收不到更新：使用 `getUpdates` 轮询前，先移除同一个 Bot 的现有 Webhook。
