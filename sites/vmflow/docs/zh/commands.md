---
title: 命令参考
description: vmflow CLI 参考，涵盖前台运行、ctl、tui、version、update、service 和 uninstall。
---

# 命令参考

vmflow 是一个包含前台运行模式和六个子命令的单二进制程序，别名见下表。

| 命令 | 别名 | 用途 |
| --- | --- | --- |
| `vmflow` | - | 在前台运行转发进程。 |
| [`ctl`](./ctl) | `c` | 查询并控制一个运行中的守护进程。 |
| [`tui`](./tui) | `t` | 终端仪表盘。 |
| [`version`](./version) | `v` | 打印构建元数据。 |
| [`update`](./update) | `u` | 检查或安装更新的版本。 |
| [`service`](./service) | `svc` | 注册为原生系统服务（开机自启）。 |
| [`uninstall`](./uninstall) | `remove`, `rm` | 一键卸载并清理。 |

## 通用管理参数 {#common-client-flags}

内置 `ctl` 和 `tui` 命令连接本机守护进程。

| 参数 | 环境变量 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `-token` | `VMFLOW_CONTROL_TOKEN` | _(无)_ | 启用认证时使用的 Bearer 令牌。 |

远程管理请使用[本地管理](./api)中说明的 SSH tunnel。

## 备注

- 出于兼容性，旧的分离式二进制 `relayd`、`relayctl` 和 `relaytui` 仍然可以构建——它们只是对相同包的薄封装，并读取相同的 `VMFLOW_CONTROL_TOKEN` 环境变量——但发布产物优先使用统一的 `vmflow` 二进制。
- 隧道命令（`tunnel-server`、`tunnel-client`、`tunnel-ctl`）和证书命令（`certs`、`certs-obtain`、`certs-review`）在当前构建中**未启用**。
