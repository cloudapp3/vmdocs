---
title: 使用 tgbot 上传 Telegram Bot 文件
description: 使用 tgbot InputFile 从 file ID、URL、本地路径和 Reader 上传 Telegram 文件，并了解 v0.2 流式行为。
---

# 文件上传

`InputFile` 用一个 API 表示四种 Telegram 文件输入方式。

::: info 版本范围
正式版 `v0.1.0` 已支持在直接上传字段中使用 `InputFile`。multipart 流式传输，以及在生成的 `Input*` 媒体结构中使用 `InputFile`，需要 `master` 上尚未发布的 [v0.2 预览代码](/zh/migration/v0.2)。
:::

| 来源 | 构造方法 | 网络行为 |
| --- | --- | --- |
| 已存在的 Telegram 文件 | `FileFromID(fileID)` | 将 file ID 作为普通字段发送。 |
| 公开 URL | `FileFromURL(url)` | 发送 URL，由 Telegram 获取文件。 |
| 本地路径 | `FileFromPath(path)` | 从磁盘发送 multipart；v0.2 改为流式传输。 |
| Reader | `FileFromReader(name, reader)` | 发送带文件名的 multipart part；v0.2 改为流式传输。 |

一个 `InputFile` 必须且只能选择一种来源。空值或同时设置多个来源时，会在发出请求前返回编码错误。

## 上传本地文档

```go
message, err := bot.SendDocument(ctx, &tgbot.SendDocumentParams{
	ChatID:   int64(123456789),
	Document: tgbot.FileFromPath("./report.pdf"),
	Caption:  "Build report",
})
```

部分生成字段使用 `any`，因为 Telegram 接受多种表示。字段支持上传时，仍应优先传入 `InputFile`。

## 从内存上传

```go
content := strings.NewReader("generated at runtime\n")

_, err := bot.SendDocument(ctx, &tgbot.SendDocumentParams{
	ChatID:   int64(123456789),
	Document: tgbot.FileFromReader("report.txt", content),
})
```

需要 Telegram 或接收方判断媒体类型时，应提供带扩展名的稳定文件名。

## 嵌套媒体

生成的 `Input*` 结构体中的上传字段同样可以携带 `InputFile`：

::: warning v0.2 预览
下面的嵌套媒体示例需要 `master` 上尚未发布的代码。`v0.1.0` 中 `InputMediaPhoto.Media` 的类型是 `string`，请改用 Telegram file ID 或公开 URL。兼容边界见 [v0.2 迁移指南](/zh/migration/v0.2)。
:::

```go
media := []tgbot.InputMedia{
	&tgbot.InputMediaPhoto{
		Type:    "photo",
		Media:   tgbot.FileFromPath("./first.jpg"),
		Caption: "First image",
	},
	&tgbot.InputMediaPhoto{
		Type:  "photo",
		Media: tgbot.FileFromPath("./second.jpg"),
	},
}

_, err := bot.SendMediaGroup(ctx, &tgbot.SendMediaGroupParams{
	ChatID: int64(123456789),
	Media:  media,
})
```

编码器会自动分配 `attach://` 引用并写入对应 multipart part。

::: warning 下一版本行为
`master` 上尚未发布的 v0.2 编码器会流式写出 multipart body，不再缓冲完整文件。本地路径必须指向 regular file。Reader 同时实现 `io.Closer` 时，取消请求可能主动关闭它以解除阻塞；成功上传不会代替调用方关闭 Reader。采用该行为前，请先查看 [v0.2 迁移指南](/zh/migration/v0.2)。
:::

## 运行建议

- 请求 context 必须可取消。
- 自己打开的文件应在调用返回后关闭。
- Reader 被消费后不要直接复用，除非它可以 rewind。
- Telegram 已存储的内容优先使用 file ID，避免重复上传。
- 接收用户文件时，在进入 SDK 前应用业务侧大小限制。

生成上传字段的类型见[方法与类型](/zh/sdk/methods-and-types)，版本差异见 [v0.2 迁移指南](/zh/migration/v0.2)。
