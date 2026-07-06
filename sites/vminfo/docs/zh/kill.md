---
title: kill
description: 按 PID 向 Linux 进程发送 SIGTERM。
---

# `vminfo kill`

向 Linux 进程发送 `SIGTERM`。

::: warning
该命令会终止进程。运行前请确认 PID 正确。
:::

## 用法

```bash
vminfo kill 1234
```

## 说明

- 仅限 Linux
- 在非 Linux 构建上返回不支持的 stub
- 当目标进程属于其他用户时，可能需要相应权限

## 相关文档

- [ps](/zh/ps)
