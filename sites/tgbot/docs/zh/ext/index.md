---
title: 使用 tgbot ext 路由 Telegram 更新
description: 使用 tgbot ext Application，通过 Go Handler、长轮询或安全 Webhook 路由 Telegram 更新。
---

# ext Application

`ext` 包在根 SDK 上增加 PTB 风格的应用层。业务更适合 Handler 和 Filter 路由，而不是手工分发每个 Update 时，可以使用这一层。

## 创建 Application

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

Application 保存原始 `*tgbot.Bot`、按顺序排列的 Handler、Webhook body limit 和可选全局错误回调。

## 添加命令 Handler

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

`Context` 提供绑定的 Bot、当前 Update，以及 `EffectiveMessage`、`Command`、`UpdateType` 辅助方法。

## 使用长轮询运行

```go
err := app.RunPolling(ctx,
	ext.WithPollingAllowedUpdates(
		ext.UpdateTypeMessage,
		ext.UpdateTypeCallbackQuery,
	),
)
```

`RunPolling` 会一直阻塞，直到 context 被取消或遇到不能继续的错误。它持有一个 `UpdatePoller`，持续消费更新流与错误流，并将更新交给 Application。

## 使用 Webhook 运行

```go
mux.Handle(
	"/telegram/webhook",
	app.WebhookHandler(os.Getenv("WEBHOOK_SECRET")),
)
```

同一个 Application 和 Handler 可以配合两种传输方式。公网端点要求见 [Webhook](/zh/updates/webhook)。

## Handler 执行规则

Handler 按注册顺序运行，所有匹配项都会执行。默认情况下，每个错误会报告给全局错误 Handler，然后继续路由；路由完成后，`ProcessUpdate` 仍返回第一个错误。`WithContinueOnError(false)` 会在第一个 Handler 错误处停止。

这一行为不同于“首个匹配后停止”的 Router，注册重叠 Handler 时必须有意为之。

继续阅读 [Handler 与 Filter](/zh/ext/handlers-and-filters)。
