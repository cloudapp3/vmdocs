---
layout: home
title: "tgbot: Go Telegram Bot SDK"
titleTemplate: false
description: Build Telegram Bots in Go with tgbot, a typed Golang SDK for Bot API methods, long polling, webhooks, and file uploads.
hero:
  name: tgbot
  text: Typed Telegram bots in Go
  tagline: Strong types, complete update paths, and zero third-party runtime dependencies.
  image:
    src: /logo.svg
    alt: tgbot logo
  actions:
    - theme: brand
      text: Get started
      link: /guide/quick-start
    - theme: alt
      text: API reference
      link: https://pkg.go.dev/github.com/cloudapp3/tgbot
features:
  - title: Typed API surface
    details: Generated method parameters, results, and polymorphic Telegram fields stay visible to the Go compiler.
    link: /sdk/methods-and-types
  - title: Zero runtime dependencies
    details: The SDK runtime uses the Go standard library, including HTTP, JSON, multipart uploads, and webhook handling.
    link: /sdk/client
  - title: Long polling
    details: Use direct getUpdates calls or a background poller with typed subscriptions and explicit backpressure behavior.
    link: /updates/long-polling
  - title: Webhook integration
    details: Mount a standard http.Handler with secret-token verification and a bounded request body.
    link: /updates/webhook
  - title: File uploads
    details: Send a Telegram file ID, public URL, local path, or io.Reader through one InputFile abstraction.
    link: /sdk/file-uploads
  - title: Optional routing layer
    details: Build PTB-style applications with handlers, composable filters, polling, and webhooks in the ext package.
    link: /ext/
---

::: warning Documentation status
The latest tagged release is `v0.1.0`. The `master` branch already contains the v0.2 code, but Bot API 10.2, streaming uploads, refined poller behavior, and `MessageOrBool` remain preview contracts until `v0.2.0` is tagged. Review the [v0.2 migration guide](/migration/v0.2) before using preview APIs.
:::

## Choose an update path

<div class="tgbot-paths">
  <a href="/updates/long-polling">
    <strong>Long polling</strong>
    <span>Run locally or behind a worker without exposing an HTTP endpoint.</span>
  </a>
  <a href="/updates/webhook">
    <strong>Webhook</strong>
    <span>Receive updates through an existing HTTPS service and standard net/http routing.</span>
  </a>
  <a href="/ext/">
    <strong>ext routing</strong>
    <span>Route commands, messages, and callback queries through handlers and filters.</span>
  </a>
  <a href="/sdk/client">
    <strong>Direct SDK</strong>
    <span>Call typed Telegram methods directly and keep application control in your code.</span>
  </a>
</div>

## Start with the stable release

```bash
mkdir hello-tgbot && cd hello-tgbot
go mod init example.com/hello-tgbot
go get github.com/cloudapp3/tgbot@latest
```

Continue with the [Quick start](/guide/quick-start), then choose [long polling](/updates/long-polling) or a [webhook](/updates/webhook) for incoming updates.

## Know the authority boundary

- [This documentation](/guide/quick-start) explains tgbot workflows and behavior.
- [pkg.go.dev](https://pkg.go.dev/github.com/cloudapp3/tgbot) is the complete Go symbol reference.
- [Telegram Bot API](https://core.telegram.org/bots/api) defines field semantics and platform limits.
- [API coverage](/reference/api-coverage) explains exactly what the repository coverage check verifies.
