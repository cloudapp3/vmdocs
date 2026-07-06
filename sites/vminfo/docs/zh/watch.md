---
title: watch
description: 持续输出运行时快照，支持文本或 JSON Lines 格式。
---

# `vminfo watch`

持续输出快照。

## 用法

```bash
vminfo watch
vminfo watch --json
vminfo watch --count 1
vminfo watch --interval 2s
```

## 输出

- 文本模式输出带时间戳的快照。
- JSON 模式输出 JSON Lines，包含 `collected_at`、`static` 和 `stats`。

## 适用场景

- 终端监视
- 日志管道
- CI 检查
- 简单的采样循环

## 示例

```bash
vminfo watch --json --count 3
```

## 相关文档

- [summary](/zh/summary)
- [ps](/zh/ps)
