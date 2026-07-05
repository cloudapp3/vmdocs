---
title: vmflow 中文文档
description: vmflow 是一个轻量的纯 Go L4 转发运行时，可作为独立守护进程运行，也可嵌入你自己的控制面。
---

# vmflow 中文文档

`vmflow` 是一个轻量的纯 Go **L4 转发运行时**。它有两种使用方式:

1. 作为**独立守护进程**,由本地 CLI/API 控制;
2. 作为**可嵌入的库**,放进你自己的控制面进程内使用。

核心只负责"进程内转发 + 规则生命周期 + 实时计数",持久化、鉴权、UI、审计等交给宿主。

## 特性

- TCP / UDP / `tcp+udp` 端口转发
- 规则生命周期:启动、停止、重启、整快照应用
- 配置驱动的守护进程,支持热重载
- 本地 admin API(健康、规则、统计、预检、reload、metrics)
- Bearer Token 鉴权,分 viewer / admin 角色
- 结构化日志(text / json)
- Prometheus 兼容的 `/metrics`
- 应用规则前的预检(重复 ID、端口冲突、端口可绑定性、DNS 解析)
- 可嵌入的 Go runtime API
- 终端仪表盘(`vmflow tui`)
- 可选的 Telegram bot

## 一键安装

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vmflow/main/install.sh | bash
```

启动守护进程:

```bash
vmflow daemon -config ./examples/config.yaml
```

## 快速链接

- [快速开始](./quick-start)
- [命令参考](./commands)
- [GitHub 仓库](https://github.com/cloudapp3/vmflow)
- [英文文档](../)
