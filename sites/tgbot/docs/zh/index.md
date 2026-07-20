---
layout: home
title: tgbot Go Telegram Bot SDK 中文文档
titleTemplate: false
description: tgbot 是轻量、强类型的 Go（Golang）Telegram Bot SDK，支持 Bot API 方法、长轮询、Webhook 和文件上传。
hero:
  name: tgbot
  text: 轻量、强类型的 Go Telegram Bot
  tagline: 面向 Go（Golang）Telegram Bot 开发，提供强类型、完整更新接入路径和运行时零第三方依赖。
  image:
    src: /logo.svg
    alt: tgbot 标志
  actions:
    - theme: brand
      text: 快速开始
      link: /zh/guide/quick-start
    - theme: alt
      text: API 参考
      link: https://pkg.go.dev/github.com/cloudapp3/tgbot
features:
  - title: 强类型 API
    details: 方法参数、返回值和 Telegram 多态字段都保留在 Go 类型系统中。
    link: /zh/sdk/methods-and-types
  - title: 运行时零第三方依赖
    details: HTTP、JSON、multipart 上传和 Webhook 均基于 Go 标准库实现。
    link: /zh/sdk/client
  - title: 长轮询
    details: 可直接调用 getUpdates，也可使用后台 Poller、类型订阅和明确的背压策略。
    link: /zh/updates/long-polling
  - title: Webhook 集成
    details: 提供标准 http.Handler、secret token 校验和请求体大小限制。
    link: /zh/updates/webhook
  - title: 文件上传
    details: 统一支持 Telegram file ID、公开 URL、本地路径和 io.Reader。
    link: /zh/sdk/file-uploads
  - title: 可选路由层
    details: ext 包提供 PTB 风格的 Application、Handler、Filter、轮询和 Webhook。
    link: /zh/ext/
---

::: warning 文档版本状态
当前最新正式 tag 是 `v0.1.0`。`master` 已包含 v0.2 代码，但 Bot API 10.2、流式上传、新 Poller 行为和 `MessageOrBool` 在 `v0.2.0` 打 tag 前仍属于预览约定。使用预览 API 前，请先查看 [v0.2 迁移指南](/zh/migration/v0.2)。
:::

## 选择更新接入方式

<div class="tgbot-paths">
  <a href="/zh/updates/long-polling">
    <strong>长轮询</strong>
    <span>无需公开 HTTP 地址，适合本地进程、Worker 和常驻服务。</span>
  </a>
  <a href="/zh/updates/webhook">
    <strong>Webhook</strong>
    <span>通过现有 HTTPS 服务接收更新，并直接接入标准 net/http 路由。</span>
  </a>
  <a href="/zh/ext/">
    <strong>ext 路由</strong>
    <span>使用 Handler 和 Filter 分发命令、消息与 Callback Query。</span>
  </a>
  <a href="/zh/sdk/client">
    <strong>直接调用 SDK</strong>
    <span>调用强类型 Telegram 方法，并由业务代码完全控制执行流程。</span>
  </a>
</div>

## 从稳定版开始

```bash
mkdir hello-tgbot && cd hello-tgbot
go mod init example.com/hello-tgbot
go get github.com/cloudapp3/tgbot@latest
```

继续阅读[快速开始](/zh/guide/quick-start)，然后为入站更新选择[长轮询](/zh/updates/long-polling)或 [Webhook](/zh/updates/webhook)。

## 文档职责边界

- [本站文档](/zh/guide/quick-start)说明 tgbot 的使用流程和行为。
- [pkg.go.dev](https://pkg.go.dev/github.com/cloudapp3/tgbot)提供完整 Go 符号参考。
- [Telegram Bot API](https://core.telegram.org/bots/api)定义字段语义和平台限制。
- [API 覆盖说明](/zh/reference/api-coverage)明确仓库校验脚本真正验证了什么。
