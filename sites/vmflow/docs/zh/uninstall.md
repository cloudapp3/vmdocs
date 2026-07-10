---
title: vmflow uninstall
description: 一条命令卸载 vmflow——移除服务、二进制、配置、日志、证书和更新缓存。
---

# vmflow uninstall

```bash
vmflow uninstall [--dry-run]
```

别名：`vmflow remove`、`vmflow rm`。

对 vmflow 安装进行完整拆除。它执行一个**规划 → 确认 → 执行**流程：

1. **规划**——探测系统，并列出将被移除的所有内容。
2. **确认**——提示 `[y/N]`（在 `--dry-run` 下或没有任何东西可移除时跳过）。
3. **执行**——按顺序移除各项，对已不存在的路径予以容忍，使该命令具有幂等性。

## 参数

| 参数 | 默认值 | 说明 |
| --- | --- | --- |
| `--dry-run` | `false` | 只打印移除计划，不移除任何东西。 |

## 它移除什么

各项按以下顺序移除（服务最先，正在运行的二进制最后，这样仍在被监管的守护进程会在其可执行文件被删除之前消失）：

| 项目 | 说明 |
| --- | --- |
| 原生服务 | 停止并移除 systemd unit / launchd plist / Windows Service。 |
| 配置文件 | 平台默认配置（参见 [`service`](./service)），如果存在。 |
| TLS / ACME 证书 | **被配置引用的**证书和密钥路径（`control_tls`、ACME/证书缓存目录）。 |
| 日志目录 | 例如 `/var/log/vmflow`（Linux/macOS）、`C:\ProgramData\vmflow\logs`（Windows）。 |
| 自更新缓存 | 更新器的缓存目录。 |
| vmflow 二进制 | 正在运行的可执行文件，最后移除。 |

::: warning 包管理器安装
如果二进制由包管理器（`dpkg` / `rpm`）管理，`uninstall` 会打印一条警告并建议改用 `apt remove` / `yum remove`，因为直接删除文件会使包数据库变旧。如果你确认，它仍会继续。
:::

受保护路径（系统根目录、你的家目录）永远不会被移除。

## 示例

```bash
# preview only
vmflow uninstall --dry-run

# full teardown (will prompt to confirm)
sudo vmflow uninstall
```
