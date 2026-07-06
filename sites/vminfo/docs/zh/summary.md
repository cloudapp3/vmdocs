---
title: summary
description: 采集一次运行时快照，输出为文本或 JSON。
---

# `vminfo summary`

采集当前主机状态的一次快照。

## 用法

```bash
vminfo summary
vminfo summary --json
vminfo summary --interval 1s
```

## 输出

- 文本模式输出易读的主机摘要。
- JSON 模式输出一个 `vminfo.Snapshot` 对象，包含 `static` 和 `stats` 字段。

## 何时使用

- 终端快速检查
- shell 脚本
- CI 诊断
- 只需要单次采样的自动化场景

## 示例

```bash
vminfo summary --json
```

## 相关文档

- [watch](/zh/watch)
- [HTTP API](/zh/api)
- [Go 库](/zh/library)
