---
title: 用 tgbot 实现 Go Telegram Bot Webhook
description: 使用 tgbot、secret token 校验、请求体限制和 net/http 路由，为 Go（Golang）Telegram Bot 实现安全 Webhook。
---

# Webhook

当 Go（Golang）Telegram Bot 服务已经具备公开 HTTPS 地址时，可以使用 Webhook。Telegram 会把每个更新作为 HTTP `POST` 请求发送到该地址。

## 注册端点

生成随机 secret，并与 Bot token 分开保存：

```bash
openssl rand -hex 32
```

注册公开 URL：

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

HTTPS、端口、证书和重试要求由 Telegram 定义。部署前应检查最新 [setWebhook 官方文档](https://core.telegram.org/bots/api#setwebhook)。

## 挂载 Handler

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

在可信反向代理或负载均衡器终止 TLS，只把预期路径转发给该服务。

## Handler 约定

`WebhookHandler` 会：

- 只接受 `POST`
- 配置 secret 后校验 `X-Telegram-Bot-Api-Secret-Token`
- 默认把请求体限制为 4 MiB
- 解码一个更新并执行所有匹配 Handler
- 路由返回错误时响应 `500`

只有明确业务需求时才覆盖 body limit：

```go
app, err := ext.NewApplication(
	bot,
	ext.WithWebhookBodyLimit(2<<20),
)
```

## 生产边界

- 不要把 Bot token 放入 Webhook URL。
- 生产环境必须配置非空 Webhook secret。
- 公开路由应保持窄范围，并在边缘拒绝意外方法。
- 代理和应用的请求体限制应保持一致。
- HTTP server 必须设置读写超时。
- 默认不记录请求头和完整更新 body。
- 重复交付可能造成损害时，Handler 需要具备幂等性。

## 移除 Webhook

切回轮询前执行：

```go
_, err := bot.DeleteWebhook(ctx, &tgbot.DeleteWebhookParams{
	DropPendingUpdates: false,
})
```

应明确决定 `DropPendingUpdates`。设置为 `true` 会丢弃 Telegram 侧排队中的更新。

需要 Handler 路由时，继续阅读 [ext Application](/zh/ext/)；处理 Telegram 与传输错误时，参考[错误与限流](/zh/reference/errors)。
