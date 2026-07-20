---
title: Telegram Bot Long Polling in Go with tgbot
description: Implement Telegram Bot long polling in Go with getUpdates, tgbot UpdatePoller subscriptions, offsets, retries, and shutdown handling.
---

# Long Polling

Long polling receives updates without exposing an inbound HTTP endpoint. Telegram holds each `getUpdates` request until an update arrives or the configured timeout expires.

## Pick the right layer

| Layer | Control | Best fit |
| --- | --- | --- |
| `Bot.GetUpdates` | You own offsets, retries, and dispatch. | Small loops or custom delivery semantics. |
| `UpdatePoller` | tgbot owns polling and channel fan-out. | Multiple consumers or typed subscriptions. |
| `ext.Application.RunPolling` | `ext` routes each update to handlers. | Command and message applications. |

Do not run long polling while a webhook is active for the same bot.

## Direct getUpdates loop

```go
var offset int64

for {
	updates, err := bot.GetUpdates(ctx, &tgbot.GetUpdatesParams{
		Offset:  offset,
		Timeout: 25,
		Limit:   100,
	})
	if err != nil {
		return err
	}

	for _, update := range updates {
		if update.UpdateID >= offset {
			offset = update.UpdateID + 1
		}
		// Process the update before requesting the next batch.
	}
}
```

Persist the offset only after your application has accepted the update according to its delivery policy.

## Typed subscriptions

The v0.2 defaults are a 25-second Telegram timeout, a limit of 100, a root buffer of 64, an error buffer of 16, and a fixed retry delay of 2 seconds. Create subscriptions before starting the poller so no fetch window exists without a consumer:

```go
ctx, stop := signal.NotifyContext(
	context.Background(),
	os.Interrupt,
	syscall.SIGTERM,
)
defer stop()

poller, err := tgbot.NewUpdatePoller(bot,
	tgbot.WithPollerParams(tgbot.GetUpdatesParams{
		Timeout: 25,
		Limit:   100,
	}),
	tgbot.WithPollerAllowedUpdates(
		tgbot.UpdateTypeMessage,
		tgbot.UpdateTypeCallbackQuery,
	),
)
if err != nil {
	log.Fatal(err)
}
defer poller.Stop()

messages := poller.SubscribeTypesHandle(32, tgbot.UpdateTypeMessage)
defer messages.Unsubscribe()

poller.Start(ctx)

go func() {
	for err := range poller.Errors() {
		log.Printf("poller: %v", err)
	}
}()

for update := range messages.Updates() {
	message := update.EffectiveMessage()
	if message == nil || message.Chat == nil {
		continue
	}
	_, _ = bot.SendMessage(ctx, &tgbot.SendMessageParams{
		ChatID: message.Chat.ID,
		Text:   "received",
	})
}
```

`SubscribeHandle` and `SubscribeTypesHandle` return a handle whose `Unsubscribe` method removes the subscriber and closes its channel.

## Root stream and subscriptions

::: warning Next-release behavior
In the unreleased v0.2 poller on `master`, the root `Updates()` stream is opt-in. Calling `Updates()` enables it for the lifetime of that poller, so the application must keep draining it. A poller with no root stream and no subscriptions waits without issuing `getUpdates` requests. Review the [v0.2 migration guide](/migration/v0.2) before changing poller consumers.
:::

If you only need filtered subscribers, do not call `Updates()`.

## Backpressure

Blocking dispatch is the default. A slow consumer can pause fan-out and therefore pause polling. Size buffers for expected bursts and keep handlers bounded.

Subscription filters run synchronously in the polling path. Keep custom filters fast even when their target channel has capacity.

`WithPollerNonBlockingDispatch()` changes the contract: a full target channel drops that update and emits `UpdateDispatchError` on `Errors()`.

```go
poller, err := tgbot.NewUpdatePoller(
	bot,
	tgbot.WithPollerBuffer(128),
	tgbot.WithPollerErrorBuffer(32),
	tgbot.WithPollerRetryDelay(2*time.Second),
	tgbot.WithPollerNonBlockingDispatch(),
)
```

The error channel is also bounded. Errors are dropped when its buffer is full, so drain it continuously and export your own metrics when loss matters.

## Shutdown

- Cancel the parent context on `SIGINT` or `SIGTERM`.
- Call `Stop()` to wait for the polling goroutine and channel shutdown.
- Treat channel closure as normal termination.
- Finish or explicitly abandon in-flight application work according to your own delivery contract.

For handler-based routing, continue with [ext Application](/ext/).
