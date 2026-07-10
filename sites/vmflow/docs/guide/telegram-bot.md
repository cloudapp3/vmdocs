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

The bot is locked to the single chat configured in `bot_chat` — it ignores messages and callback queries from any other chat. Note that the bot talks to the in-process engine **directly**, not through the control API, so control API auth is irrelevant to it. Exposing the control API off-loopback still has its own rules (see [Deployment](./deployment)).

## Commands

| Command | Effect |
| --- | --- |
| `/start` | Show the help text. |
| `/status` | Running rule count, total connections, and upload/download totals. |
| `/rules` | List running rules in a table (name, proto, listen→target, conns, up/down). |
| `/detail <id>` | Show one rule's config and live traffic. |
| `/reload` | Ask to reload; on confirm it **stops all rules** (see note below). |
| `/stop <id>` | Stop a single rule by ID (asks for confirmation). |
| `/start_rule <id>` | Ask to start a rule (see note below). |

Destructive actions ask for confirmation via inline buttons before they take effect.

::: warning Limitations of `/reload` and `/start_rule`
- `/reload` does **not** re-read the config. On confirm it calls `StopAll()` and replies: _"✅ All rules stopped. Use control API /v1/reload for full config reload."_ To actually apply config changes, run `vmflow ctl reload` (or `POST /v1/reload`) against the control API.
- `/start_rule` is a stub: on confirm it replies with a hint to use the control API `/v1/reload`, because re-applying a single rule needs the full rule config the bot does not hold.

`/stop <id>`, by contrast, works fully — it stops the named rule immediately.
:::

## Notes

- This integration is optional and best-effort; it is not a replacement for the control API for production reloads.
- The bot shares the daemon process, so a daemon restart also restarts the bot.
