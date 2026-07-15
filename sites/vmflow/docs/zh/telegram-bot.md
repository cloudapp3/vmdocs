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

Bot 只响应 `bot_chat` 配置的单一聊天，并忽略其他聊天。将 `bot_control_token` 设置为 `auth.tokens` 中的 admin token 可启用写操作；不设置时为只读。请求始终在进程内处理。

## 命令

| 命令 | 效果 |
| --- | --- |
| `/start` | 显示帮助文本。 |
| `/status` | 运行中规则数、总连接数，以及上传/下载总量。 |
| `/rules` | 以表格列出运行中的规则（名称、协议、listen→target、连接数、上传/下载）。 |
| `/detail <id>` | 显示单条规则的配置和实时流量。 |
| `/reload` | 确认后从磁盘重载配置。 |
| `/stop <id>` | 按 ID 停止单条规则（会请求确认）。 |
| `/start_rule <id>` | 确认后启用并启动规则。 |

破坏性操作在生效前会通过内联按钮请求确认。

::: tip
Bot 写操作与 TUI 共用预检、事务应用、回滚和乐观并发控制流程；发生并发编辑时会提示重试。
:::

## 备注

- 该集成是可选能力；CLI/TUI 仍是主要管理入口。
- bot 与守护进程共享同一个进程，因此守护进程重启时 bot 也会重启。
