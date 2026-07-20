---
title: 用 tgbot 实现 Go Telegram Bot 长轮询
description: 使用 getUpdates、tgbot UpdatePoller 订阅、offset、重试和关闭流程，为 Go（Golang）Telegram Bot 实现长轮询。
---

# 长轮询

Go（Golang）Telegram Bot 使用长轮询时无需公开入站 HTTP 地址。Telegram 会保持每个 `getUpdates` 请求，直到有更新到达或配置的 timeout 到期。

## 选择合适的层级

| 层级 | 控制范围 | 适用情况 |
| --- | --- | --- |
| `Bot.GetUpdates` | 自行管理 offset、重试和分发。 | 简单循环或自定义交付语义。 |
| `UpdatePoller` | tgbot 管理轮询和 channel fan-out。 | 多消费者或类型订阅。 |
| `ext.Application.RunPolling` | `ext` 将更新路由给 Handler。 | 命令和消息型应用。 |

同一个 Bot 存在有效 Webhook 时，不要同时运行长轮询。

## 直接 getUpdates 循环

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
		// 请求下一批之前处理当前更新。
	}
}
```

只有在业务按照自己的交付策略接受更新后，才应持久化 offset。

## 类型订阅

v0.2 默认 Telegram timeout 为 25 秒、limit 为 100、根流 buffer 为 64、错误 buffer 为 16，固定重试延迟为 2 秒。先创建订阅，再启动 Poller，避免已经开始获取更新却没有消费者：

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

`SubscribeHandle` 和 `SubscribeTypesHandle` 会返回订阅句柄。调用 `Unsubscribe` 会移除订阅并关闭对应 channel。

## 根更新流与订阅

::: warning 下一版本行为
`master` 上尚未发布的 v0.2 代码中，根 `Updates()` 流为按需启用。调用 `Updates()` 后，该 Poller 在剩余生命周期内都会启用根流，应用必须持续消费它。没有根流也没有订阅时，Poller 会等待，不会发出 `getUpdates` 请求。调整 Poller 消费方式前，请先查看 [v0.2 迁移指南](/zh/migration/v0.2)。
:::

只需要过滤订阅时，不要调用 `Updates()`。

## 背压

默认采用阻塞分发。慢消费者会暂停 fan-out，随后也会暂停轮询。应根据预期突发量设置 buffer，并限制 Handler 的执行时间。

订阅 Filter 会同步运行在轮询路径中，即使目标 channel 尚有空间，自定义 Filter 也必须保持快速。

`WithPollerNonBlockingDispatch()` 会改变交付约定：目标 channel 已满时丢弃该更新，并通过 `Errors()` 发送 `UpdateDispatchError`。

```go
poller, err := tgbot.NewUpdatePoller(
	bot,
	tgbot.WithPollerBuffer(128),
	tgbot.WithPollerErrorBuffer(32),
	tgbot.WithPollerRetryDelay(2*time.Second),
	tgbot.WithPollerNonBlockingDispatch(),
)
```

错误 channel 同样有界，buffer 满时错误也会被丢弃。必须持续消费，并在需要精确观测时输出自己的 metrics。

## 关闭流程

- 收到 `SIGINT` 或 `SIGTERM` 时取消父 context。
- 调用 `Stop()` 等待轮询 goroutine 和 channel 完成关闭。
- 将 channel 关闭视为正常退出。
- 按业务交付约定完成或明确放弃仍在执行的任务。

需要 Handler 路由时，继续阅读 [ext Application](/zh/ext/)。
