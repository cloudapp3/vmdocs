---
title: vmflow update
description: 检查或安装最新的 vmflow 版本——vmflow update、--check、--version。
---

# vmflow update

查询 GitHub Releases，并就地安装 `vmflow` 最新的带标签构建。

```bash
vmflow update [--check] [--version <tag>]
```

别名：`vmflow u`。

## 参数

| 参数 | 说明 |
| --- | --- |
| `--check` | 仅检查更新；不安装。 |
| `--version <tag>` | 安装或查看指定的版本标签（例如 `v0.1.1`）。 |

## 它做什么

1. 查询 `cloudapp3/vmflow` 的 GitHub Releases API。
2. 将最新版本与当前运行构建的版本进行比较。
3. 安装时：下载当前 OS/架构对应的压缩包，用 SHA-256 对照 `checksums.txt` 进行校验，解压出二进制，并原子地替换正在运行的 `vmflow` 二进制。

## 示例

只检查是否有更新的版本可用，而不安装：

```bash
vmflow update --check
```

安装最新版本：

```bash
vmflow update
```

安装指定版本：

```bash
vmflow update --version v0.1.1
```

## 备注

- `dev` 构建（例如从源码构建且没有 release ldflags）在缺少 `--version` 的情况下无法自更新，因为其当前版本未知。此时请使用 `vmflow update --version vX.Y.Z`。
- 更新检查会在你的缓存目录下缓存 24 小时（`~/.cache/vmflow/update-check.json`，或 `$XDG_CACHE_HOME/vmflow`）。使用 `--version` 可针对特定标签绕过缓存。
- **Windows**：不支持自更新（二进制替换）；`--check` 仍可用。在 Windows 上请用 `install.sh` 或 release 归档重新安装来更新。
- 对于私有 release 或需要更高的 GitHub API 速率限制，可设置 `GITHUB_TOKEN` 或 `GH_TOKEN`。
- 自更新会替换正在运行的二进制，因此需要对其有写权限。如果因权限错误失败，请以适当权限重新运行（例如 `sudo`），或修复安装路径的权限。

## 相关

- [安装](./installation)
- [Changelog](/changelog)
