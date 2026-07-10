---
title: Telegram Bot
description: 用于查看和控制 vmflow 规则的可选 Telegram bot——/status、/rules、/detail、/reload、/stop、/start_rule。
---

# Telegram Bot

vmflow 可以运行一个可选的 Telegram bot，用于轻量的、以聊天方式驱动的查看与控制——当你用手机操作、又不想为了一次快速检查而 SSH 登录时，它会非常方便。

## 启用它

只有当**两个字段都设置**时，bot 才会启动：

```yaml
bot_token: <your-telegram-bot-token>
bot_chat: <chat-id>
```

`bot_token` 是来自 [@BotFather](https://t.me/BotFather) 的令牌；`bot_chat` 是允许 bot 响应的数字聊天 ID。不设置 `bot_token` 只是意味着不会启动 bot。

## 授权

bot 被锁定在 `bot_chat` 中配置的那一个聊天——它会忽略来自任何其他聊天的消息和回调查询。请注意，bot **直接**与进程内引擎通信，而不是经过控制 API，因此控制 API 的认证与它无关。把控制 API 暴露到回环之外仍然有自己的规则（参见[部署](./deployment)）。

## 命令

| 命令 | 效果 |
| --- | --- |
| `/start` | 显示帮助文本。 |
| `/status` | 运行中规则数、总连接数，以及上传/下载总量。 |
| `/rules` | 以表格列出运行中的规则（名称、协议、listen→target、连接数、上传/下载）。 |
| `/detail <id>` | 显示单条规则的配置和实时流量。 |
| `/reload` | 请求重载；确认后会**停止所有规则**（见下方说明）。 |
| `/stop <id>` | 按 ID 停止单条规则（会请求确认）。 |
| `/start_rule <id>` | 请求启动一条规则（见下方说明）。 |

破坏性操作在生效前会通过内联按钮请求确认。

::: warning `/reload` 和 `/start_rule` 的限制
- `/reload` **不会**重新读取配置。确认后它会调用 `StopAll()` 并回复：_"✅ All rules stopped. Use control API /v1/reload for full config reload."_。要真正应用配置变更，请对控制 API 运行 `vmflow ctl reload`（或 `POST /v1/reload`）。
- `/start_rule` 是一个占位实现：确认后它会回复一条提示，让你使用控制 API 的 `/v1/reload`，因为重新应用单条规则需要 bot 并不持有的完整规则配置。

相比之下，`/stop <id>` 可以完整工作——它会立即停止指定的规则。
:::

## 备注

- 这项集成是可选的、尽力而为的；它不能替代控制 API 用于生产环境的重载。
- bot 与守护进程共享同一个进程，因此守护进程重启时 bot 也会重启。
