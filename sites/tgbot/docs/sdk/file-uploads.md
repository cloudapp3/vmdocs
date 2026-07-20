---
title: Upload Files with the tgbot Go Telegram Bot SDK
description: Upload Telegram files from IDs, URLs, local paths, and readers with tgbot InputFile, including v0.2 streaming behavior.
---

# File Uploads

`InputFile` represents four Telegram input paths through one API.

::: info Version scope
Direct upload fields support `InputFile` in the tagged `v0.1.0` release. Multipart streaming and `InputFile` values inside generated `Input*` media structures require `master` and are part of the unreleased [v0.2 preview](/migration/v0.2).
:::

| Source | Constructor | Network behavior |
| --- | --- | --- |
| Existing Telegram file | `FileFromID(fileID)` | Sends the file ID as a normal value. |
| Public URL | `FileFromURL(url)` | Sends the URL and lets Telegram fetch it. |
| Local path | `FileFromPath(path)` | Sends a multipart upload from disk; v0.2 streams it. |
| Reader | `FileFromReader(name, reader)` | Sends a named multipart part; v0.2 streams it. |

An `InputFile` must select exactly one source. Empty or ambiguous values return an encoding error before the request is sent.

## Upload a local document

```go
message, err := bot.SendDocument(ctx, &tgbot.SendDocumentParams{
	ChatID:   int64(123456789),
	Document: tgbot.FileFromPath("./report.pdf"),
	Caption:  "Build report",
})
```

Some generated fields use `any` because Telegram accepts several representations. `InputFile` is still the preferred value when the field can upload content.

## Upload from memory

```go
content := strings.NewReader("generated at runtime\n")

_, err := bot.SendDocument(ctx, &tgbot.SendDocumentParams{
	ChatID:   int64(123456789),
	Document: tgbot.FileFromReader("report.txt", content),
})
```

Use a stable filename with an extension when Telegram or the recipient needs to infer the media type.

## Nested media

Upload-capable fields inside generated `Input*` structures can also carry `InputFile`:

::: warning v0.2 preview
The following nested-media example requires the unreleased code on `master`. In `v0.1.0`, `InputMediaPhoto.Media` is a `string`; use a Telegram file ID or public URL instead. See the [v0.2 migration guide](/migration/v0.2) for the compatibility boundary.
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

The encoder assigns `attach://` references and writes the corresponding multipart parts.

::: warning Next-release behavior
The unreleased v0.2 encoder on `master` streams multipart bodies instead of buffering whole files. Local paths must identify regular files. If a reader also implements `io.Closer`, cancellation may close it to unblock a pending read; a successful upload does not close a caller-owned reader. Review the [v0.2 migration guide](/migration/v0.2) before adopting this behavior.
:::

## Operational guidance

- Keep the request context cancellable.
- Close files you open yourself after the call returns.
- Do not reuse a consumed reader for another upload unless it can be rewound.
- Use file IDs for content Telegram already stores. This avoids another upload.
- Apply application-level size limits before accepting user-provided uploads.

See [Methods and types](/sdk/methods-and-types) for generated upload fields and the [v0.2 migration guide](/migration/v0.2) for release-specific changes.
