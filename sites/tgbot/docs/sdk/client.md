---
title: Configure the tgbot Go Telegram Bot Client
description: Create and configure the tgbot Go client, call typed or raw Telegram Bot API methods, and control HTTP behavior and deadlines.
---

# SDK Client

`Bot` owns the Telegram token, API base URL, and HTTP client. It is safe to reuse for many method calls.

## Create a client

```go
bot, err := tgbot.NewBot(os.Getenv("BOT_TOKEN"))
if err != nil {
	log.Fatal(err)
}
```

An empty or whitespace-only token is rejected before any network request.

## Client options

```go
client := &http.Client{
	Timeout: 20 * time.Second,
}

bot, err := tgbot.NewBot(
	os.Getenv("BOT_TOKEN"),
	tgbot.WithHTTPClient(client),
	tgbot.WithAPIURL("http://127.0.0.1:8081"),
	tgbot.WithDebug(false),
)
```

| Option | Effect |
| --- | --- |
| `WithHTTPClient` | Uses your transport, proxy, TLS, connection pool, and timeout policy. |
| `WithAPIURL` | Targets a self-hosted Telegram Bot API server or a test endpoint. |
| `WithDebug` | Reports the narrow debug condition currently implemented by the client, such as an empty response body. |

## Typed calls

Generated wrappers expose request and response types:

```go
message, err := bot.SendMessage(ctx, &tgbot.SendMessageParams{
	ChatID: int64(123456789),
	Text:   "typed request",
})
if err != nil {
	return err
}
log.Printf("sent message %d", message.MessageID)
```

The method name maps to the Telegram method, while the `Params` struct uses Go field names with Telegram JSON tags.

## Raw calls

Use `Call` when Telegram adds a method before a typed wrapper is available:

```go
var result json.RawMessage
err := bot.Call(ctx, "futureMethod", map[string]any{
	"chat_id": 123456789,
}, &result)
```

Use `Do` when you want the raw Telegram `result` payload directly:

```go
raw, err := bot.Do(ctx, "getMe", nil)
```

Prefer typed wrappers for normal application code. Raw calls trade compile-time checks for immediate access.

Raw maps are not the upload path. Use generated parameter structs or your own typed struct when a request contains `InputFile` values.

## Context and deadlines

Always pass the request context owned by your operation. Cancellation interrupts the HTTP request and streaming upload work.

::: warning Next-release behavior
The unreleased v0.2 code on `master` applies a 30-second deadline to ordinary calls, `getUpdates.timeout + 5s` to long polling, and 10 minutes to multipart uploads. A caller deadline is preserved. When you supply `WithHTTPClient`, that client's timeout policy remains authoritative. Check the [v0.2 migration guide](/migration/v0.2) before relying on these defaults.
:::

Set an explicit deadline when your application needs a tighter bound:

```go
ctx, cancel := context.WithTimeout(parent, 5*time.Second)
defer cancel()

_, err := bot.GetMe(ctx, &tgbot.GetMeParams{})
```

Continue with [Methods and types](/sdk/methods-and-types) or [Errors and rate limits](/reference/errors).
