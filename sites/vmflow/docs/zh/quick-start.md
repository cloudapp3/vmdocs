---
title: 快速开始
description: 两分钟装好 vmflow 并跑通第一条 TCP 转发规则。
---

# 快速开始

## 1. 安装

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vmflow/main/install.sh | bash
```

全局安装到 `/usr/local/bin`:

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vmflow/main/install.sh | sudo bash -s -- --dir /usr/local/bin
```

验证:

```bash
vmflow version
```

## 2. 启动守护进程

```bash
vmflow daemon -config ./examples/config.yaml
```

示例配置把 TCP `0.0.0.0:2201` 转发到 `127.0.0.1:22`(SSH)。

## 3. 查询

在另一个终端:

```bash
vmflow ctl health
vmflow ctl rules
vmflow ctl stats
vmflow ctl precheck
```

## 4. 打开终端面板

```bash
vmflow tui
```

按 <kbd>Tab</kbd> 在 Dashboard / Rules / Detail 视图间切换。

## 5. 修改配置后重载

编辑 `examples/config.yaml`,然后:

```bash
vmflow ctl reload
```

reload 会先做[预检](../guide/precheck);如果有 error,变更会被拒绝,正在运行的规则不受影响。

## 下一步

- [配置说明](../guide/configuration)
- [转发引擎](../guide/forwarding)
- [规则与生命周期](../guide/rules)
