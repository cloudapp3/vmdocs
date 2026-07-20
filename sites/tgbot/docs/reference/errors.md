---
title: Handle Telegram Bot API Errors and Rate Limits
description: Handle Telegram Bot API errors, HTTP failures, context cancellation, retry_after rate limits, and poller delivery errors in tgbot.
---

# Errors and Rate Limits

tgbot returns errors from request encoding, HTTP transport, Telegram responses, response decoding, polling, and handler execution.

## Telegram API errors

Failed Telegram responses are represented by `*tgbot.APIError` when the response contains API error information.

```go
_, err := bot.SendMessage(ctx, params)
if err == nil {
	return nil
}

var apiErr *tgbot.APIError
if errors.As(err, &apiErr) {
	log.Printf(
		"telegram error: status=%d code=%d retry_after=%d message=%s",
		apiErr.StatusCode,
		apiErr.Code,
		apiErr.RetryAfter,
		apiErr.Message,
	)
}
return err
```

Do not parse `Error()` strings for control flow. Use `errors.As` and the structured fields.

## Rate limits

```go
if tgbot.IsTooManyRequests(err) {
	var apiErr *tgbot.APIError
	if errors.As(err, &apiErr) && apiErr.RetryAfter > 0 {
		// Schedule a bounded retry after Telegram's requested delay.
	}
}
```

Build retries around the operation's idempotency and latency budget. Do not retry every error blindly, and do not hold a request goroutine forever.

## Context errors

```go
if errors.Is(err, context.Canceled) {
	return nil
}
if errors.Is(err, context.DeadlineExceeded) {
	return fmt.Errorf("telegram request timed out: %w", err)
}
```

Wrapped transport errors may still preserve context cancellation through `errors.Is`.

## Poller errors

Drain `UpdatePoller.Errors()` continuously. The stream can contain request failures and, in non-blocking mode, `*UpdateDispatchError` values for dropped deliveries.

```go
for err := range poller.Errors() {
	var dropped *tgbot.UpdateDispatchError
	if errors.As(err, &dropped) {
		metrics.DroppedUpdates.Add(1)
		continue
	}
	log.Printf("polling failed: %v", err)
}
```

The error channel is bounded and can itself drop errors when full. Export application metrics when exact observability matters.

Review [SDK client](/sdk/client) for request cancellation and deadlines, and [Long polling](/updates/long-polling) for retry, dispatch, and shutdown behavior.
