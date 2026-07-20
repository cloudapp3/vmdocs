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
| 配置文件 | 平台默认配置（参见 [`service`](./service)）以及安装器所有的共置配置。用户所有的共置配置会被保留。 |
| 外部 TLS / ACME 证书 | vmflow 自有存储之外引用的证书和密钥文件会被保留。 |
| 日志目录 | 例如 `/var/log/vmflow`（Linux/macOS）、`C:\ProgramData\vmflow\logs`（Windows）。 |
| 自更新缓存 | 更新器的缓存目录。 |
| vmflow 二进制 | 正在运行的可执行文件，最后移除。 |

::: warning 包管理器安装
如果二进制由包管理器（`dpkg` / `rpm`）管理，`uninstall` 会打印一条警告并建议改用 `apt remove` / `yum remove`，因为直接删除文件会使包数据库变旧。如果你确认，它仍会继续。
:::

受保护路径（系统根目录、你的家目录）永远不会被移除。

## 安装器管理的安装

对于由 `install.sh` 创建的用户安装，优先使用安装器级卸载：

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vmflow/main/install.sh \
  | bash -s -- --uninstall
```

支持时，它会委托给 `vmflow uninstall`；二进制过旧或缺失时则回退到 shell 清理。二进制清理成功后，它还会从 `.zshrc`、`.bashrc` 或 `.profile` 中移除安装器所有的精确 PATH 块。相似的用户自定义 PATH 行、符号链接或不可写的启动文件均保持不变。

只有卸载 root 所有的系统级安装时才使用 `sudo bash -s -- --uninstall`。卸载明确指定的自定义目录时，同时传入 `--dir PATH`。

## 示例

```bash
# preview only
vmflow uninstall --dry-run

# full teardown (will prompt to confirm)
sudo vmflow uninstall
```
