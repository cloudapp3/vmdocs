---
title: Telegram Bot API Methods and Types in Go
description: Use tgbot generated Telegram Bot API parameter structs, typed results, union interfaces, and v0.2 MessageOrBool responses.
---

# Methods and Types

tgbot converts the official Telegram Bot API schema into Go method wrappers, parameter structs, object types, and union interfaces.

## Method shape

Each Telegram method follows the same Go pattern:

```go
result, err := bot.MethodName(ctx, &tgbot.MethodNameParams{
	// Telegram parameters as Go fields.
})
```

For example:

```go
member, err := bot.GetChatMember(ctx, &tgbot.GetChatMemberParams{
	ChatID: int64(-1001234567890),
	UserID: 123456789,
})
```

Use [pkg.go.dev](https://pkg.go.dev/github.com/cloudapp3/tgbot) to search the exported surface of the latest tagged release. Use the [official Telegram Bot API](https://core.telegram.org/bots/api) for parameter meaning, limits, and platform behavior.

## Union interfaces

Telegram uses fields that can contain one of several object shapes. tgbot models these as Go interfaces such as `ChatMember`, `InputMedia`, and `InlineQueryResult`.

Decode-side unions can be inspected with a type switch:

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

Construct send-side unions with a concrete implementation:

For the tagged `v0.1.0` release:

```go
media := &tgbot.InputMediaPhoto{
	Type:  "photo",
	Media: "https://example.com/photo.jpg",
}
```

The unreleased v0.2 code on `master` changes upload-capable fields to `InputFile`:

```go
media := &tgbot.InputMediaPhoto{
	Type:  "photo",
	Media: tgbot.FileFromURL("https://example.com/photo.jpg"),
}
```

The v0.2 form also accepts `tgbot.FileFromPath(...)` for nested uploads.

These union interfaces are closed by unexported marker methods, so another package cannot add a new variant. An unknown Telegram discriminator can also fail decoding. Treat Bot API drift as a compatibility event and keep the generated SDK current.

## Results with two possible shapes

::: warning Next-release behavior
The unreleased v0.2 code on `master` uses `MessageOrBool` for methods that return a `Message` for chat messages and `True` for inline messages. See the [v0.2 migration guide](/migration/v0.2) before updating result handling.
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

## Generated code ownership

The generated files are:

- `sdk_types.go` for Telegram object types and union roots
- `sdk_methods.go` for parameters and client wrappers
- `sdk_unions.go` for polymorphic JSON encoding and decoding

Do not edit them manually. Update the generator and regenerate the SDK instead. See [API coverage](/reference/api-coverage).
