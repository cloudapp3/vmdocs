---
title: tgbot 的 Telegram Bot API 方法与类型
description: 使用 tgbot 生成的 Telegram Bot API 参数结构、强类型返回值、union interface 和 v0.2 MessageOrBool。
---

# 方法与类型

tgbot 将 Telegram Bot API 官方 schema 转换为 Go 方法封装、参数结构、对象类型和 union interface。

## 方法结构

每个 Telegram 方法遵循相同的 Go 调用形式：

```go
result, err := bot.MethodName(ctx, &tgbot.MethodNameParams{
	// Telegram 参数对应的 Go 字段。
})
```

例如：

```go
member, err := bot.GetChatMember(ctx, &tgbot.GetChatMemberParams{
	ChatID: int64(-1001234567890),
	UserID: 123456789,
})
```

通过 [pkg.go.dev](https://pkg.go.dev/github.com/cloudapp3/tgbot)查询最新正式 tag 的导出方法和类型。字段含义、限制和平台行为以 [Telegram Bot API 官方文档](https://core.telegram.org/bots/api)为准。

## Union interface

Telegram 的部分字段可以包含多种对象形态。tgbot 使用 `ChatMember`、`InputMedia`、`InlineQueryResult` 等 Go interface 表示这些 union。

通过 type switch 检查解码结果：

```go
switch member := member.(type) {
case *tgbot.ChatMemberOwner:
	log.Printf("owner: %d", member.User.ID)
case *tgbot.ChatMemberAdministrator:
	log.Printf("administrator: %d", member.User.ID)
case *tgbot.ChatMemberMember:
	log.Printf("member: %d", member.User.ID)
default:
	log.Printf("other membership state: %T", member)
}
```

发送 union 字段时使用具体实现：

正式版 `v0.1.0` 的写法：

```go
media := &tgbot.InputMediaPhoto{
	Type:  "photo",
	Media: "https://example.com/photo.jpg",
}
```

`master` 上尚未发布的 v0.2 代码把支持上传的字段改为 `InputFile`：

```go
media := &tgbot.InputMediaPhoto{
	Type:  "photo",
	Media: tgbot.FileFromURL("https://example.com/photo.jpg"),
}
```

v0.2 写法还可以传入 `tgbot.FileFromPath(...)` 进行嵌套上传。

这些 union interface 通过未导出的 marker method 封闭，外部 package 不能添加新 variant。Telegram 返回未知 discriminator 时也可能解码失败，因此 Bot API 漂移应被视为兼容性事件，并及时更新生成 SDK。

## 两种可能形态的返回值

::: warning 下一版本行为
`master` 上尚未发布的 v0.2 代码使用 `MessageOrBool` 表示“普通聊天返回 `Message`，内联消息返回 `True`”的方法。调整返回值处理前，请先查看 [v0.2 迁移指南](/zh/migration/v0.2)。
:::

```go
result, err := bot.EditMessageText(ctx, params)
if err != nil {
	return err
}

if message, ok := result.AsMessage(); ok {
	log.Printf("edited message %d", message.MessageID)
}
if value, ok := result.AsBool(); ok {
	log.Printf("inline edit accepted: %t", value)
}
```

## 生成代码归属

生成文件包括：

- `sdk_types.go`：Telegram 对象类型和 union root
- `sdk_methods.go`：参数结构与客户端方法
- `sdk_unions.go`：多态 JSON 编解码

不要手工修改这些文件。应修改生成器并重新生成 SDK。具体流程见 [API 覆盖](/zh/reference/api-coverage)。
