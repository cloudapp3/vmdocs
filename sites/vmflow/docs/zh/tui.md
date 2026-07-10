---
title: vmflow tui
description: 针对一个运行中的守护进程启动 vmflow 终端仪表盘。
---

# vmflow tui

```bash
vmflow tui [-addr http://127.0.0.1:19090] [-token TOKEN]
```

别名：`vmflow t`。

启动终端仪表盘。它从控制 API 读取实时状态，并接受与 `ctl` 相同的共享客户端参数——包括 TLS/mTLS 和自定义请求头（参见[通用客户端参数](./commands#common-client-flags)）。各视图和操作参见 [TUI 仪表盘](./tui-guide)。

## 示例

```bash
vmflow tui
vmflow tui -addr http://10.0.0.5:19090 -token change-me
VMFLOW_CONTROL_TOKEN=change-me vmflow tui

# against a TLS-protected control API
vmflow tui -addr https://10.0.0.5:19090 \
  -tls-ca-file ca.pem -tls-client-cert client.pem -tls-client-key client.key
```
