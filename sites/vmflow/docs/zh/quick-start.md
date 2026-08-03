---
title: 快速开始
description: 安装 vmflow，并在两分钟内运行你的第一条 TCP 转发规则。
---

# 快速开始

本指南会安装 vmflow v0.3.0 正式版，通过 `vmflow init` 创建并校验第一条规则，再使用 CLI 查询运行中的守护进程。

## 1. 安装

为当前 shell 安装 `v0.3.0`（Linux/macOS）：

```bash
VMFLOW_BIN_DIR="$(
  curl -fsSL https://raw.githubusercontent.com/cloudapp3/vmflow/main/install.sh \
    | bash -s -- --version v0.3.0 --print-install-dir
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

## 2. 初始化 vmflow

运行首次使用向导：

```bash
vmflow init
```

语言选择是第一步：`1` 选择 English，`2` 选择简体中文。接着选择推荐的系统原生服务、当前终端前台运行，或只保存暂不启动。向导随后创建经过校验的转发规则、启用带认证的本地管理，并根据运行模式写入正确的系统级或用户级配置路径。

系统服务模式会安装、启用并立即启动 vmflow；前台模式会占用当前终端。如果选择暂不启动，之后可运行：

```bash
vmflow run
```

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

先用 `vmflow status` 查看活动配置路径，编辑该文件，再应用新的期望状态：

```bash
vmflow status
vmflow ctl reload
```

重载会先运行[预检](./precheck)；如果有错误，变更会被拒绝，正在运行的规则保持不变。

## 接下来

- [配置](./configuration)——每一个 YAML 字段的说明
- [转发引擎](./forwarding)——协议、规则共享限速、日/月流量配额、连接数上限
- [规则与生命周期](./rules)——快照应用与增量 diff
- [`vmflow service install`](./service)——将 vmflow 作为开机自启的原生服务运行（systemd / launchd / Windows Service）
- [`vmflow uninstall`](./uninstall)——一条命令完成拆除（服务、二进制、配置、日志、证书）
