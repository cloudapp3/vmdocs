---
title: 快速开始
description: 安装 vmflow，并在两分钟内运行你的第一条 TCP 转发规则。
---

# 快速开始

本指南将安装 `vmflow` 二进制文件，用一个示例配置启动守护进程，并通过 CLI 查询它。

## 1. 安装

安装最新的预编译二进制文件（Linux/macOS）：

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vmflow/main/install.sh | bash
```

希望全局安装：

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vmflow/main/install.sh | sudo bash -s -- --dir /usr/local/bin
```

验证：

```bash
vmflow version
```

关于 `--version`、校验和验证以及从源码构建，参见[安装](./installation)。

## 2. 启动守护进程

获取示例配置并启动守护进程：

```bash
vmflow daemon -config ./examples/config.yaml
```

该示例会把 TCP `0.0.0.0:2201` 转发到 `127.0.0.1:22`（SSH）。

## 3. 查询它

在另一个终端中，让 CLI 指向本地控制 API（默认 `127.0.0.1:19090`）：

```bash
vmflow ctl health
vmflow ctl rules
vmflow ctl stats
vmflow ctl metrics
vmflow ctl precheck
```

## 4. 打开终端 UI

```bash
vmflow tui
```

按 <kbd>Tab</kbd> 在 Dashboard、Rules 和 Detail 视图之间切换。参见 [TUI 仪表盘](./tui-guide)。

## 5. 编辑配置后重载

编辑 `examples/config.yaml`，然后应用新的期望状态：

```bash
vmflow ctl reload
```

重载会先运行[预检](./precheck)；如果有错误，变更会被拒绝，正在运行的规则保持不变。

## 接下来

- [配置](./configuration)——每一个 YAML 字段的说明
- [转发引擎](./forwarding)——协议、限速、连接数上限
- [规则与生命周期](./rules)——快照应用与增量 diff
- [`vmflow service install`](./service)——将 vmflow 作为开机自启的原生服务运行（systemd / launchd / Windows Service）
- [`vmflow uninstall`](./uninstall)——一条命令完成拆除（服务、二进制、配置、日志、证书）
