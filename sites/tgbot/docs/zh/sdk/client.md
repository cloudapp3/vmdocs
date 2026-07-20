---
title: 配置 tgbot Go Telegram Bot 客户端
description: 创建并配置 tgbot Go 客户端，调用强类型或原始 Telegram Bot API 方法，并控制 HTTP 行为与 deadline。
---

# SDK 客户端

`Bot` 持有 Telegram token、API 基础地址和 HTTP client。应在多个方法调用之间复用同一个实例。

## 创建客户端

```go
bot, err := tgbot.NewBot(os.Getenv("BOT_TOKEN"))
if err != nil {
	log.Fatal(err)
}
```

空字符串或只包含空白的 token 会在发出网络请求之前被拒绝。

## 客户端选项

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

| 选项 | 作用 |
| --- | --- |
| `WithHTTPClient` | 使用调用方提供的 Transport、代理、TLS、连接池和超时策略。 |
| `WithAPIURL` | 指向自托管 Telegram Bot API Server 或测试端点。 |
| `WithDebug` | 只报告客户端当前实现的窄范围调试条件，例如响应体为空。 |

## 强类型调用

生成的方法会公开明确的请求与返回类型：

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

方法名映射 Telegram method，`Params` 结构体使用 Go 字段名和 Telegram JSON tag。

## 原始调用

Telegram 新增 method 而 SDK 还未生成强类型封装时，可以使用 `Call`：

```go
var result json.RawMessage
err := bot.Call(ctx, "futureMethod", map[string]any{
	"chat_id": 123456789,
}, &result)
```

需要直接取得 Telegram `result` 原始数据时使用 `Do`：

```go
raw, err := bot.Do(ctx, "getMe", nil)
```

普通业务代码应优先使用强类型封装。原始调用牺牲编译期校验，换取对新 API 的即时访问。

原始 map 不是上传路径。请求包含 `InputFile` 时，应使用生成的 Params 或自定义强类型 struct。

## Context 与 deadline

始终传入当前操作所属的 context。取消 context 会中断 HTTP 请求和流式上传工作。

::: warning 下一版本行为
`master` 上尚未发布的 v0.2 客户端会为普通调用设置 30 秒 deadline，为长轮询设置 `getUpdates.timeout + 5s`，为 multipart 上传设置 10 分钟。调用方已有 deadline 会被保留；使用 `WithHTTPClient` 时，自定义 client 的超时策略优先。依赖这些默认值前，请先查看 [v0.2 迁移指南](/zh/migration/v0.2)。
:::

业务需要更紧的限制时，显式设置 deadline：

```go
ctx, cancel := context.WithTimeout(parent, 5*time.Second)
defer cancel()

_, err := bot.GetMe(ctx, &tgbot.GetMeParams{})
```

继续阅读[方法与类型](/zh/sdk/methods-and-types)或[错误与限流](/zh/reference/errors)。
