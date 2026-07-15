---
title: TUI 仪表盘
description: vmflow 终端仪表盘——启动它，并在 Dashboard、Rules 和 Detail 视图之间切换。
---

# TUI 仪表盘

vmflow 自带一个终端 UI，用于查看本机守护进程的实时规则状态和流量计数器。

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
| **Rules** | 运行中规则列表及其实时计数器；支持按名称筛选规则。 |
| **Detail** | 所选规则的详情。 |

## 何时使用它

TUI 是回答"vmflow 此刻在做什么？"最快捷的方式，无需抓取指标。如需长期历史，请将 Prometheus 指向 `/metrics`——TUI 只显示内存中的当前状态。
