---
title: vmflow daemon
description: 运行 vmflow 转发守护进程——配置路径、控制监听地址，以及启动安全参数。
---

# vmflow daemon

```bash
vmflow daemon -config ./examples/config.yaml [-control-listen 127.0.0.1:19090]
```

别名：`vmflow d`。

守护进程会加载配置文件、启动控制 API，并以快照形式应用规则。随后它会持续运行，直到被中断（`SIGINT` / `SIGTERM`，这也是 systemd 和 launchd 停止它的方式）。

## 参数

| 参数 | 默认值 | 说明 |
| --- | --- | --- |
| `-config` | _(必填)_ | YAML 配置文件的路径。 |
| `-control-listen` | _(取自配置)_ | 覆盖控制 API 的监听地址（对应配置中的 `control_listen_addr`，默认为 `127.0.0.1:19090`）。 |
| `-insecure-allow-remote-control` | `false` | **危险：**允许在没有认证的情况下将控制 API 绑定到非回环地址。参见[部署](./deployment)。 |
| `-log-file` | _(stdout)_ | 将日志写入该文件而非 stdout（在服务管理器下很有用；在 Windows 上必填）。 |

## 启动安全 {#startup-safety}

当控制 API 绑定到非回环地址（`0.0.0.0`、`::`、非回环 IP，或 `:port`）且没有认证时，守护进程会拒绝启动，因为这会暴露一个未认证的远程控制端点。若仍要启动，请：

- 绑定到 `127.0.0.1`（默认值），
- 在配置中启用 `auth`，
- 启用双向 TLS（`control_tls.client_ca_file`），或
- 传入 `-insecure-allow-remote-control` 以确认风险。

## 运行时行为

- 启动时，规则会通过快照方式应用（`ReplaceAll`）。参见[规则与生命周期](./rules)。
- 控制 API 暴露 [health、rules、stats、precheck、reload、metrics](./api)。
- `POST /v1/reload`（或 `vmflow ctl reload`）会重新读取配置，并在[预检](./precheck)之后重新应用。
- 如需作为受管理的开机自启服务运行，参见 [`vmflow service`](./service)。
