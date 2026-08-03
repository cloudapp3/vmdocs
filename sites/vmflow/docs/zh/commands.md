---
title: 命令参考
description: vmflow CLI 参考，涵盖前台运行、ctl、tui、mcp、version、update、service 和 uninstall。
---

# 命令参考

vmflow 是一个单二进制程序，包含首次设置、显式前台运行、状态、管理、系统服务与维护命令，别名见下表。

| 命令 | 别名 | 用途 |
| --- | --- | --- |
| `vmflow` | - | 显示配置/守护进程状态与下一步操作。 |
| `vmflow init` | - | 先选择语言和运行模式，再创建第一条已校验规则与本地凭据。 |
| [`vmflow run`](./daemon) | - | 使用平台用户配置在前台运行转发。 |
| `vmflow status` | - | 查看解析后的配置路径、规则数、守护进程和系统服务状态；支持 `-json`。 |
| [`ctl`](./ctl) | `c` | 查询并控制一个运行中的守护进程。 |
| [`tui`](./tui) | `t` | 终端仪表盘。 |
| [`mcp`](./mcp) | - | 为本机运行中的守护进程提供只读 stdio MCP 服务。 |
| [`version`](./version) | `v` | 打印构建元数据。 |
| [`update`](./update) | `u` | 检查或安装更新的版本。 |
| [`service`](./service) | `svc` | 安装、启动、检查或卸载原生系统服务。 |
| [`uninstall`](./uninstall) | `remove`, `rm` | 一键卸载并清理。 |

## 通用管理参数 {#common-client-flags}

全局 `--lang <en|zh-CN>`（或 `VMFLOW_LANG`）可为单次命令覆盖已保存的显示语言。

内置 `ctl`、`tui` 和 `mcp` 命令连接本机守护进程。

| 参数 | 环境变量 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `-token` | `VMFLOW_CONTROL_TOKEN` | _(无)_ | 启用认证时使用的 Bearer 令牌。 |

远程管理请使用[本地管理](./api)中说明的 SSH tunnel。

## 备注

- 出于兼容性，旧的分离式二进制 `relayd`、`relayctl` 和 `relaytui` 仍然可以构建——它们只是对相同包的薄封装，并读取相同的 `VMFLOW_CONTROL_TOKEN` 环境变量——但发布产物优先使用统一的 `vmflow` 二进制。
- 隧道命令（`tunnel-server`、`tunnel-client`、`tunnel-ctl`）和证书命令（`certs`、`certs-obtain`、`certs-review`）在当前构建中**未启用**。
