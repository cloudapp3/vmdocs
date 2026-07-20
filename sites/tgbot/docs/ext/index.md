---
title: Route Telegram Updates with tgbot ext
description: Use tgbot ext Application to route Telegram updates through Go handlers with long polling or secure webhooks.
---

# ext Application

The `ext` package adds a PTB-style application layer on top of the root SDK. Use it when handler and filter routing is more useful than manually dispatching every update.

## Create an application

```go
app, err := ext.NewApplication(
	bot,
	ext.WithErrorHandler(func(ctx context.Context, c *ext.Context, err error) {
		log.Printf("handler failed: %v", err)
	}),
	ext.WithContinueOnError(true),
)
if err != nil {
	log.Fatal(err)
}
```

The application keeps the original `*tgbot.Bot`, an ordered handler list, a webhook body limit, and an optional global error callback.

## Add a command handler

```go
app.AddHandler(ext.NewCommandHandler("start", func(ctx context.Context, c *ext.Context) error {
	message := c.EffectiveMessage()
	if message == nil || message.Chat == nil {
		return nil
	}

	_, err := c.Bot.SendMessage(ctx, &tgbot.SendMessageParams{
		ChatID: message.Chat.ID,
		Text:   "ready",
	})
	return err
}))
```

`Context` exposes the bound bot, the current update, `EffectiveMessage`, `Command`, and `UpdateType` helpers.

## Run with long polling

```go
err := app.RunPolling(ctx,
	ext.WithPollingAllowedUpdates(
		ext.UpdateTypeMessage,
		ext.UpdateTypeCallbackQuery,
	),
)
```

`RunPolling` blocks until the context is canceled or a non-continuable error occurs. It owns an `UpdatePoller`, drains its update and error streams, and routes updates through the application.

## Run behind a webhook

```go
mux.Handle(
	"/telegram/webhook",
	app.WebhookHandler(os.Getenv("WEBHOOK_SECRET")),
)
```

The same application and handlers work with either transport. See [Webhooks](/updates/webhook) for public endpoint requirements.

## Handler execution

Handlers run in registration order. Every matching handler is called. By default, each error is reported to the global error handler and routing continues; after routing, `ProcessUpdate` still returns the first error. `WithContinueOnError(false)` stops at the first handler error.

This is different from routers that stop after the first match. Keep handler overlap intentional.

Continue with [Handlers and filters](/ext/handlers-and-filters).
