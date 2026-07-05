---
title: 命令参考
description: vmflow CLI 命令参考 —— daemon / ctl / tui / version 及其别名。
---

# 命令参考

`vmflow` 是单二进制,四个子命令,每个都有单字母别名。

| 命令 | 别名 | 用途 |
| --- | --- | --- |
| `daemon` | `d` | 运行转发守护进程 |
| `ctl` | `c` | 查询/控制一个运行中的守护进程 |
| `tui` | `t` | 终端仪表盘 |
| `version` | `v` | 打印构建信息 |

## 通用 flag

`ctl` 和 `tui` 共用以下 flag:

| Flag | 环境变量 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `-addr` | `VMFLOW_ADMIN_ADDR` | `http://127.0.0.1:19090` | admin API 地址 |
| `-token` | `VMFLOW_ADMIN_TOKEN` | _(无)_ | 开启鉴权时的 Bearer Token |

## `vmflow daemon`

```bash
vmflow daemon -config ./examples/config.yaml [-admin-listen 127.0.0.1:19090]
```

## `vmflow ctl`

```bash
vmflow ctl [-addr http://127.0.0.1:19090] [-token TOKEN] <health|rules|stats|metrics|precheck|reload>
```

| 子命令 | 对应接口 | 说明 |
| --- | --- | --- |
| `health` | `GET /healthz` | 守护进程健康状态 |
| `rules` | `GET /v1/rules` | 列出运行中的规则 |
| `stats` | `GET /v1/stats` | 每条规则的流量统计(内存快照) |
| `metrics` | `GET /metrics` | Prometheus 文本指标 |
| `precheck` | `GET\|POST /v1/precheck` | 校验当前配置但不应用 |
| `reload` | `POST /v1/reload` | 重新加载配置并应用 |

## `vmflow tui`

```bash
vmflow tui [-addr http://127.0.0.1:19090] [-token TOKEN]
```

## `vmflow version`

```bash
vmflow version [-json]
```

::: tip 备注
- 旧的分离二进制 `relayd` / `relayctl` / `relaytui` 仍可编译(兼容保留),但发布产物推荐统一使用 `vmflow`。
- 隧道命令(`tunnel-server` / `tunnel-client` / `tunnel-ctl`)和证书命令(`certs` 系列)在当前构建中**未启用**。
:::
