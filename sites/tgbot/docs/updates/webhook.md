---
title: Telegram Bot Webhooks in Go with tgbot
description: Implement a secure Telegram Bot webhook in Go with tgbot, secret-token verification, bounded requests, and net/http routing.
---

# Webhooks

Use a webhook when your service already has a public HTTPS endpoint. Telegram sends each update as an HTTP `POST` request.

## Register the endpoint

Generate a random secret and keep it separate from the bot token:

```bash
openssl rand -hex 32
```

Register the public URL:

```go
ok, err := bot.SetWebhook(ctx, &tgbot.SetWebhookParams{
	URL:            "https://bot.example.com/telegram/webhook",
	SecretToken:    os.Getenv("WEBHOOK_SECRET"),
	AllowedUpdates: []string{"message", "callback_query"},
})
if err != nil {
	return err
}
if !ok {
	return errors.New("Telegram did not accept the webhook")
}
```

Telegram defines the HTTPS, port, certificate, and retry requirements. Check the current [setWebhook documentation](https://core.telegram.org/bots/api#setwebhook) before deployment.

## Mount the handler

```go
app, err := ext.NewApplication(bot)
if err != nil {
	log.Fatal(err)
}

app.AddHandler(ext.NewCommandHandler("start", func(ctx context.Context, c *ext.Context) error {
	message := c.EffectiveMessage()
	if message == nil || message.Chat == nil {
		return nil
	}
	_, err := c.Bot.SendMessage(ctx, &tgbot.SendMessageParams{
		ChatID: message.Chat.ID,
		Text:   "welcome",
	})
	return err
}))

mux := http.NewServeMux()
mux.Handle(
	"/telegram/webhook",
	app.WebhookHandler(os.Getenv("WEBHOOK_SECRET")),
)

server := &http.Server{
	Addr:              ":8080",
	Handler:           mux,
	ReadHeaderTimeout: 5 * time.Second,
	ReadTimeout:       15 * time.Second,
	WriteTimeout:      45 * time.Second,
	IdleTimeout:       60 * time.Second,
}

log.Fatal(server.ListenAndServe())
```

Terminate TLS at a trusted reverse proxy or load balancer and forward only the intended path to this server.

## Handler contract

`WebhookHandler`:

- accepts only `POST`
- compares `X-Telegram-Bot-Api-Secret-Token` when a secret is configured
- limits the body to 4 MiB by default
- decodes one update and runs matching handlers
- returns `500` when routing returns an error

Override the body limit only with an explicit application requirement:

```go
app, err := ext.NewApplication(
	bot,
	ext.WithWebhookBodyLimit(2<<20),
)
```

## Production boundaries

- Never place the bot token in the webhook URL.
- Require a non-empty webhook secret in production.
- Keep the public route narrow and reject unexpected methods at the edge.
- Configure proxy and application body limits consistently.
- Use server read and write timeouts.
- Do not log request headers or full update bodies by default.
- Make handlers idempotent when repeated delivery would cause harm.

## Remove a webhook

Before switching back to polling:

```go
_, err := bot.DeleteWebhook(ctx, &tgbot.DeleteWebhookParams{
	DropPendingUpdates: false,
})
```

Choose `DropPendingUpdates` deliberately. Setting it to `true` discards queued updates on Telegram's side.

For handler routing, continue with [ext Application](/ext/). For Telegram and transport failures, see [Errors and rate limits](/reference/errors).
