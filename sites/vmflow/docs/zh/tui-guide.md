---
title: TUI 仪表盘
description: 在 vmflow 终端 UI 中查看和管理规则、来源 IP 策略、计数器、预检与应用操作。
---

# TUI 仪表盘

vmflow 自带一个终端 UI，用于查看和管理本机守护进程的已配置规则与实时流量计数器。

## 启动它

```bash
vmflow tui
```

启用认证后，传入访问令牌：

```bash
vmflow tui -token <token>
# or
VMFLOW_CONTROL_TOKEN=<token> vmflow tui
```

## 视图

按 <kbd>Tab</kbd> 在各视图之间循环切换：

| 视图 | 显示内容 |
| --- | --- |
| **Dashboard** | 整体健康状态、运行中规则数、运行时长。 |
| **Rules** | 包含禁用规则在内的已配置规则、实时计数器、暂存改动，以及宽屏下的 `OPEN` / `ALLOW n` / `DENY n` 摘要。 |
| **Detail** | 所选规则的设置、来源 IP 条目、流量和累计 `IP Denied` 计数。 |

## 规则管理

使用已认证的 `admin` token 可以创建、编辑、复制、启停和删除规则。`viewer` token 以及未启用认证的会话为只读。在 Rules 视图中，使用 <kbd>n</kbd>/<kbd>e</kbd>/<kbd>c</kbd> 创建、编辑或复制，<kbd>Space</kbd> 启停，<kbd>d</kbd> 删除，<kbd>P</kbd> 预检，<kbd>A</kbd> 应用已验证的草稿。

编辑器中的 `Source IP mode` 可选 `OFF`、`ALLOWLIST` 或 `DENYLIST`；在 `Source IPs / CIDRs` 中用逗号分隔 IPv4/IPv6 字面地址和 CIDR。草稿必须先通过预检才能应用，现有 revision/ETag 流程会阻止过期编辑器覆盖更新后的配置。

## 何时使用它

TUI 是回答"vmflow 此刻在做什么？"最快捷的方式，无需抓取指标。如需长期历史，请将 Prometheus 指向 `/metrics`——TUI 只显示内存中的当前状态。
