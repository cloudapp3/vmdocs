---
title: ps
description: 仅限 Linux 的进程列表，支持过滤、树视图、watch 模式和 JSON 输出。
---

# `vminfo ps`

仅限 Linux 的进程列表与过滤。

## 用法

```bash
vminfo ps
vminfo ps nginx
vminfo ps --filter ssh
vminfo ps --tree
vminfo ps --watch
vminfo ps --limit 20
vminfo ps --json
vminfo ps --sort mem
```

## 选项

| 参数 | 说明 |
| --- | --- |
| 位置参数（filter） | 按名称、用户、PID、命令或状态过滤 |
| `--filter` | 显式进程过滤 |
| `--tree` | 渲染进程树 |
| `--watch` | 持续刷新 |
| `--count` | 与 `--watch` 一起使用时的采样次数 |
| `--interval` | watch 模式的刷新间隔 |
| `--limit` | 限制返回行数 |
| `--json` | 输出 JSON |
| `--sort` | 按 `cpu`、`mem`、`pid` 或 `name` 排序 |

## 注意事项

- 默认排序为 `cpu`。
- JSON 输出返回进程对象数组。
- `--watch --json` 返回带 `collected_at` 时间戳的 JSON Lines。
- 非 Linux 构建会保留不支持该命令的 stub。

## 示例

```bash
vminfo ps --filter ssh --sort mem --limit 20
```

## 相关文档

- [kill](/zh/kill)
- [HTTP API](/zh/api)
