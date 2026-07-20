---
title: Telegram Bot Handlers and Filters with tgbot
description: Build Telegram Bot handlers and composable filters for commands, messages, callback queries, and update types with tgbot ext.
---

# Handlers and Filters

Handlers define both a match rule and a callback. Filters add reusable message conditions.

## Built-in handlers

| Constructor | Matches |
| --- | --- |
| `NewAnyHandler` | Every update. |
| `NewTypeHandler` | One typed update category. |
| `NewMessageHandler` | Message-like updates accepted by a filter. |
| `NewCommandHandler` | A normalized command name, with or without `/` or `@botname`. |
| `NewCallbackQueryHandler` | Callback data accepted by an optional regular expression. |

Command normalization removes a leading slash and any `@username` suffix. It does not verify that the suffix names the current bot, so enforce that distinction in application code when it matters.

## Built-in filters

- `AnyFilter`
- `TextFilter`
- `CommandFilter`
- `RegexFilter`
- `UpdateTypeFilter`
- `And`, `Or`, and `Not`

## Compose filters

```go
textWithoutCommands := ext.And(
	ext.TextFilter(),
	ext.Not(ext.CommandFilter()),
)

app.AddHandler(ext.NewMessageHandler(
	textWithoutCommands,
	func(ctx context.Context, c *ext.Context) error {
		message := c.EffectiveMessage()
		if message == nil || message.Chat == nil {
			return nil
		}
		_, err := c.Bot.SendMessage(ctx, &tgbot.SendMessageParams{
			ChatID: message.Chat.ID,
			Text:   "text received",
		})
		return err
	},
))
```

An empty `And()` matches nothing. An empty `Or()` also matches nothing. `Not(nil)` matches everything.

## Callback query routing

```go
confirmPattern := regexp.MustCompile(`^confirm:`)

app.AddHandler(ext.NewCallbackQueryHandler(
	confirmPattern,
	func(ctx context.Context, c *ext.Context) error {
		query := c.Update.CallbackQuery
		_, err := c.Bot.AnswerCallbackQuery(ctx, &tgbot.AnswerCallbackQueryParams{
			CallbackQueryID: query.ID,
			Text:            "Confirmed",
		})
		return err
	},
))
```

Answer callback queries promptly so the Telegram client can clear its progress state.

## Custom filters and handlers

Use `ext.FilterFunc` for a small inline rule:

```go
privateChat := ext.FilterFunc(func(c *ext.Context) bool {
	message := c.EffectiveMessage()
	return message != nil && message.Chat != nil && message.Chat.Type == "private"
})
```

Implement the `Handler` or `Filter` interface directly when matching needs shared state, instrumentation, or a reusable type.

Use the [ext Application guide](/ext/) to wire these handlers into polling or webhooks, and define failure behavior with [Errors and rate limits](/reference/errors).
