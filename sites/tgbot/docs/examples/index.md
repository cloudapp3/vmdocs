---
title: tgbot Go Telegram Bot Examples
description: Run stable and v0.2 preview tgbot examples for messages, commands, subscriptions, polling, and Telegram webhooks in Go.
---

# Examples

The source repository contains small programs that compile with the SDK and keep transport choices explicit.

| Example | Demonstrates | Run |
| --- | --- | --- |
| [quickstart](https://github.com/cloudapp3/tgbot/tree/v0.1.0/examples/quickstart) | One typed `SendMessage` call. | `go run ./examples/quickstart` |
| [commands](https://github.com/cloudapp3/tgbot/tree/v0.1.0/examples/commands) | Direct `GetUpdates`, offsets, and command parsing. | `go run ./examples/commands` |
| [async_updates (v0.2 Preview)](https://github.com/cloudapp3/tgbot/tree/master/examples/async_updates) | Typed poller subscriptions and error draining. | `go run ./examples/async_updates` |
| [ext_polling](https://github.com/cloudapp3/tgbot/tree/v0.1.0/examples/ext_polling) | `ext.Application` with polling. | `go run ./examples/ext_polling` |
| [webhook](https://github.com/cloudapp3/tgbot/tree/v0.1.0/examples/webhook) | `ext` routing through `net/http`. | `go run ./examples/webhook` |

## Environment variables

| Variable | Used by |
| --- | --- |
| `BOT_TOKEN` | Every example. |
| `CHAT_ID` | `quickstart`. |
| `WEBHOOK_SECRET` | `webhook`. |
| `ADDR` | Optional webhook listen address, default `:8080`. |

Example:

```bash
BOT_TOKEN='replace-me' CHAT_ID='replace-me' go run ./examples/quickstart
```

## Compile without contacting Telegram

```bash
go test ./examples/...
```

The examples read credentials and contact Telegram only when their `main` functions run.

## Suggested learning order

1. Run `quickstart` to verify credentials and chat access.
2. Read `commands` to understand offsets and update payloads.
3. Use `async_updates` when separate consumers need typed update streams.
4. Use `ext_polling` when handlers and filters fit the application.
5. Deploy `webhook` only after the HTTPS and secret boundaries are understood.

Start with the [Quick Start](/guide/quick-start), then compare the production boundaries for [long polling](/updates/long-polling) and [webhooks](/updates/webhook).
