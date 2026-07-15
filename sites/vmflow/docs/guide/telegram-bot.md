---
title: Telegram Bot
description: Optional Telegram bot for inspecting and controlling vmflow rules — /status, /rules, /detail, /reload, /stop, /start_rule.
---

# Telegram Bot

vmflow can run an optional Telegram bot for lightweight, chat-driven inspection and control — handy when you operate from a phone and do not want to SSH in for a quick check.

## Enable it

The bot starts only when **both** fields are set:

```yaml
bot_token: <your-telegram-bot-token>
bot_chat: <chat-id>
```

`bot_token` is the token from [@BotFather](https://t.me/BotFather); `bot_chat` is the numeric chat ID the bot is allowed to respond in. Leaving `bot_token` unset simply means no bot starts.

## Authorization

The bot is restricted to the single chat configured in `bot_chat` and ignores every other chat. Set `bot_control_token` to an admin token from `auth.tokens` to enable write commands; without it the bot is read-only. Requests stay in process.

## Commands

| Command | Effect |
| --- | --- |
| `/start` | Show the help text. |
| `/status` | Running rule count, total connections, and upload/download totals. |
| `/rules` | List running rules in a table (name, proto, listen→target, conns, up/down). |
| `/detail <id>` | Show one rule's config and live traffic. |
| `/reload` | Reload configuration from disk after confirmation. |
| `/stop <id>` | Stop a single rule by ID (asks for confirmation). |
| `/start_rule <id>` | Enable and start a rule after confirmation. |

Destructive actions ask for confirmation via inline buttons before they take effect.

::: tip
Bot write commands use the same precheck, transactional apply, rollback, and optimistic-concurrency path as the TUI. Conflicting edits are reported with a retry hint.
:::

## Notes

- This integration is optional; CLI/TUI remain the primary administration surfaces.
- The bot shares the daemon process, so a daemon restart also restarts the bot.
