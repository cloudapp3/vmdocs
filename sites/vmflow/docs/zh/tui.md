---
title: vmflow tui
description: 针对一个运行中的守护进程启动 vmflow 终端仪表盘。
---

# vmflow tui

```bash
vmflow tui [-addr URL] [-token TOKEN]
```

别名：`vmflow t`。

启动连接本机守护进程的终端仪表盘。默认本机目标要求原生服务已安装并正在运行；如果服务之后停止，TUI 可辅助恢复。对于通过 `vmflow run` 手动启动的守护进程，请显式传入 `-addr http://127.0.0.1:19090` 以绕过服务检查。视图与操作参见 [TUI 仪表盘](./tui-guide)。

## 示例

```bash
vmflow tui
vmflow tui -addr http://127.0.0.1:19090
VMFLOW_CONTROL_TOKEN=change-me vmflow tui
```
