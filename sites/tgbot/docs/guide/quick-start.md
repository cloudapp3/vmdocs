---
title: Build Your First Go Telegram Bot with tgbot
description: Install tgbot and build your first Go Telegram Bot with a typed SendMessage call using the stable v0.1.0 release.
---

# Quick Start

This guide uses the latest tagged tgbot release and sends one message without starting an update receiver.

## Prerequisites

- Go 1.22 or newer
- A bot token created with [BotFather](https://t.me/BotFather)
- A target chat ID or channel username

Treat the bot token as a password. Keep it in an environment variable and never commit it to source control, shell history, screenshots, or logs.

## Create the module

```bash
mkdir hello-tgbot
cd hello-tgbot
go mod init example.com/hello-tgbot
go get github.com/cloudapp3/tgbot@latest
```

## Send a message

Create `main.go`:

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

Run it:

```bash
BOT_TOKEN='replace-me' CHAT_ID='replace-me' go run .
```

The target chat must already allow the bot to send messages. A user normally needs to start a private chat with the bot first.

## Choose how to receive updates

| Path | Use it when |
| --- | --- |
| Direct `GetUpdates` | You want complete control over offsets and retries. |
| `UpdatePoller` | You want background polling and filtered subscriptions. |
| `ext.Application.RunPolling` | You want handler and filter routing without an HTTP endpoint. |
| `ext.Application.WebhookHandler` | Your service already has a public HTTPS endpoint. |

Read [Long polling](/updates/long-polling) or [Webhooks](/updates/webhook) next.

## Common first-run failures

- `telegram bot token is empty`: verify `BOT_TOKEN` is present in the process environment.
- `401 Unauthorized`: replace a revoked or mistyped token.
- `400 Bad Request: chat not found`: verify the chat ID and make sure the bot can access that chat.
- No incoming updates: remove an active webhook before starting `getUpdates` polling.
