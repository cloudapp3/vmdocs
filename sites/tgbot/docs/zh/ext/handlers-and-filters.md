---
title: tgbot Telegram Bot Handler 与 Filter
description: 使用 tgbot ext 为 Telegram Bot 构建命令、消息、Callback Query 和 Update 类型的 Handler 与组合 Filter。
---

# Handler 与 Filter

Handler 同时定义匹配规则和回调函数，Filter 用于复用消息筛选条件。

## 内置 Handler

| 构造方法 | 匹配内容 |
| --- | --- |
| `NewAnyHandler` | 所有更新。 |
| `NewTypeHandler` | 指定类型的更新。 |
| `NewMessageHandler` | 被 Filter 接受的 message-like 更新。 |
| `NewCommandHandler` | 归一化后的命令名，支持带或不带 `/`、`@botname`。 |
| `NewCallbackQueryHandler` | 被可选正则表达式接受的 Callback data。 |

命令归一化会移除开头的 `/` 和任意 `@username` 后缀，但不会验证该用户名是否属于当前 Bot。业务依赖这一边界时，需要自行校验。

## 内置 Filter

- `AnyFilter`
- `TextFilter`
- `CommandFilter`
- `RegexFilter`
- `UpdateTypeFilter`
- `And`、`Or`、`Not`

## 组合 Filter

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

空 `And()` 不匹配任何内容，空 `Or()` 同样不匹配，`Not(nil)` 匹配所有内容。

## Callback Query 路由

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

应尽快响应 Callback Query，让 Telegram 客户端及时清除进度状态。

## 自定义 Filter 和 Handler

简单规则可以使用 `ext.FilterFunc`：

```go
privateChat := ext.FilterFunc(func(c *ext.Context) bool {
	message := c.EffectiveMessage()
	return message != nil && message.Chat != nil && message.Chat.Type == "private"
})
```

匹配逻辑需要共享状态、观测或复用类型时，可直接实现 `Handler` 或 `Filter` interface。

通过 [ext Application 指南](/zh/ext/)把这些 Handler 接入轮询或 Webhook，并参考[错误与限流](/zh/reference/errors)定义失败处理方式。
