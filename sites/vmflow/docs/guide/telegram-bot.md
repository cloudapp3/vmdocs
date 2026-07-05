---
title: Telegram Bot
description: Optional Telegram bot for inspecting and controlling vmflow rules — /rules, /reload, /stop, /stopall.
---

# Telegram Bot

vmflow can run an optional Telegram bot for lightweight, chat-driven control of a daemon — handy when you operate from a phone and do not want to SSH in for a quick check or stop.

## Enable it

Add a bot token and a target chat to the config:

```yaml
bot_token: <your-telegram-bot-token>
bot_chat: <chat-id>
```

`bot_token` is the token from [@BotFather](https://t.me/BotFather); `bot_chat` is the chat ID the bot is allowed to respond in.

## Commands

| Command | Effect |
| --- | --- |
| `/rules` | List running rules. |
| `/reload` | Reload the config (with confirmation). |
| `/stop <id>` | Stop a single rule by ID (with confirmation). |
| `/stopall` | Stop all rules (with confirmation). |

Mutating commands require confirmation to avoid accidental disruption.

## Notes

- The bot is a thin client over the same admin API the CLI uses; it inherits the daemon's auth scope.
- If you expose the daemon off localhost, keep `auth.enabled: true`. The bot does not bypass admin API auth.
- This integration is optional — leaving `bot_token` unset simply means no bot starts.
