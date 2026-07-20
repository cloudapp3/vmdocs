---
title: 快速开始
description: 安装 vmflow，并在两分钟内运行你的第一条 TCP 转发规则。
---

# 快速开始

本指南会安装当前 vmflow 预发布版及其共置配置，启动守护进程，并通过 CLI 查询它。

## 1. 安装

为当前 shell 安装 `v0.2.0-rc.4`（Linux/macOS）：

```bash
VMFLOW_BIN_DIR="$(
  curl -fsSL https://raw.githubusercontent.com/cloudapp3/vmflow/main/install.sh \
    | bash -s -- --version v0.2.0-rc.4 --print-install-dir
)" \
  && [ -n "$VMFLOW_BIN_DIR" ] \
  && [ "${VMFLOW_BIN_DIR#/}" != "$VMFLOW_BIN_DIR" ] \
  && [ -x "$VMFLOW_BIN_DIR/vmflow" ] \
  && export PATH="$VMFLOW_BIN_DIR:$PATH"
```

验证：

```bash
vmflow version -json
```

需要时，安装器还会为后续受支持的 shell 会话配置 PATH。系统级 `--system` 安装、目录选择、校验和验证及源码构建参见[安装](./installation)。

## 2. 启动守护进程

使用安装在二进制旁的 `config.yaml` 启动守护进程：

```bash
vmflow
```

共置配置是运行时默认配置。内置 SSH 示例默认禁用并监听 `127.0.0.1:2201`，启用该规则前请先检查配置。

## 3. 查询它

在另一个终端中，使用内置 CLI 查询本机守护进程：

```bash
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

打开解析后可执行文件旁的配置，然后应用新的期望状态：

```bash
VMFLOW_CONFIG="$(dirname "$(command -v vmflow)")/config.yaml"
"${EDITOR:-vi}" "$VMFLOW_CONFIG"
vmflow ctl reload
```

重载会先运行[预检](./precheck)；如果有错误，变更会被拒绝，正在运行的规则保持不变。

## 接下来

- [配置](./configuration)——每一个 YAML 字段的说明
- [转发引擎](./forwarding)——协议、限速、连接数上限
- [规则与生命周期](./rules)——快照应用与增量 diff
- [`vmflow service install`](./service)——将 vmflow 作为开机自启的原生服务运行（systemd / launchd / Windows Service）
- [`vmflow uninstall`](./uninstall)——一条命令完成拆除（服务、二进制、配置、日志、证书）
