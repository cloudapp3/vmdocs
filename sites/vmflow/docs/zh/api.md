---
title: 本地管理
description: 通过内置 CLI、终端界面和只读 MCP 适配器管理 vmflow。
---

# 本地管理

vmflow 对外支持的管理入口是 `vmflow ctl`、`vmflow tui` 和只读的
`vmflow mcp` 适配器。守护进程通过仅监听回环地址的内部通道实现这些工具；
该通道不是公开集成 API，也不承诺对外兼容性。

管理通道固定绑定 `127.0.0.1`，配置中只设置本地端口：

```yaml
control_port: 19090
```

状态、规则、统计、预检、重载和交互管理均应使用内置命令。参见
[`vmflow ctl`](./ctl) 和 [`vmflow tui`](./tui)。本地 AI 辅助诊断参见
[`vmflow mcp`](./mcp)。

## 远程管理

通过 SSH 转发回环端口，然后继续在本机使用 CLI/TUI：

```bash
ssh -N -L 19090:127.0.0.1:19090 user@server
vmflow ctl rules
```
