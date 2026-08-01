---
title: vminfo 中文文档
description: vminfo 是面向 Linux、macOS 和 Windows 的跨平台主机运行时信息工具，支持终端 UI、JSON、Web 仪表盘、只读 MCP 服务器与 Go 库。
---

# vminfo 中文文档

vminfo 是一个跨平台主机运行时信息工具，可以通过终端 UI、JSON 输出、Web 仪表盘、只读 MCP Tools 或 Go API 快速查看 CPU、内存、磁盘、网络、负载与进程。

## 快速安装

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vminfo/main/install.sh | bash
```

## 启动 TUI

```bash
vminfo
```

## 输出 JSON

```bash
vminfo summary --json
```

## 启动 Web 仪表盘

```bash
vminfo --web
```

仪表盘内置多套主题(Auto / Neon / Light / Terminal / Synthwave),可从页头切换;JetBrains Mono 字体内嵌,离线也能保持一致排版。

## 网络诊断

```bash
vminfo net dns example.com            # 解析域名
vminfo net port example.com 443       # 测试 TCP 端口
vminfo net ping example.com --tcp-port 443   # TCP ping(默认,跨平台)
vminfo net ip                         # 本机公网 IP + ASN / 地理
```

## 接入 MCP 客户端

```bash
vminfo mcp
```

MCP 模式通过 stdio 向 Claude Desktop、Codex 等可信客户端提供只读主机信息和有边界的网络诊断，不监听网络端口。参见 [`vminfo mcp`](/zh/mcp)。

继续阅读：

- [快速开始](/zh/quick-start)
- [命令参考](/zh/commands)
- [MCP 服务器](/zh/mcp)
- [HTTP API](/zh/api)
- [Go Library](/zh/library)
