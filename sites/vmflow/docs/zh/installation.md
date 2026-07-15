---
title: 安装
description: 通过 GitHub Releases 用一行安装脚本安装 vmflow，或从源码构建。支持 --version、--dir、--skip-verify 和 GITHUB_TOKEN。
---

# 安装

`vmflow` 以单个静态二进制文件的形式发布，支持 Linux 和 macOS（`amd64` 与 `arm64`）。你可以通过安装脚本从 GitHub Releases 获取，或从源码构建。

Release 仅发布便携归档，不提供由系统包管理器管理的 `.deb` 或 `.rpm` 软件包。请使用下方安装脚本，或手动解压归档。

## 一行安装脚本

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vmflow/main/install.sh | bash
```

全局安装到 `/usr/local/bin`：

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vmflow/main/install.sh | sudo bash -s -- --dir /usr/local/bin
```

安装指定的版本标签：

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vmflow/main/install.sh | bash -s -- --version v0.1.0
```

### 安装脚本选项

| 选项 | 说明 |
| --- | --- |
| `--version <tag>` | 安装指定的版本标签。默认为最新版本。 |
| `--dir <path>` | 安装目录。省略时自动检测（见下文）。 |
| `--skip-verify` | 跳过 SHA-256 校验和验证。 |
| `--uninstall` | 委托给 `vmflow uninstall`（移除服务、二进制、配置、日志、证书、更新缓存）。 |
| `-h, --help` | 显示帮助。 |

安装脚本会下载 GitHub Release 压缩包，默认用 SHA-256 校验 `checksums.txt`，并按以下顺序自动检测安装目录：`/usr/local/bin` → `~/.local/bin` → `~/bin`。你可以通过 `--dir PATH` 或 `VMFLOW_INSTALL_DIR` 环境变量覆盖它。

对于私有 release 或需要更高的 GitHub API 速率限制，可设置 `GITHUB_TOKEN` 或 `GH_TOKEN`。

## 从源码构建

依赖：[Go](https://go.dev/dl/)（较新的版本，见 `go.mod`）。

```bash
git clone https://github.com/cloudapp3/vmflow.git
cd vmflow
go build -trimpath -o vmflow ./cmd/vmflow
```

或使用 Makefile：

```bash
make build
```

## 验证安装

```bash
vmflow version
vmflow version -json
```

## PATH 没有设置？

如果安装脚本提示所选目录不在你的 `PATH` 中，可以建立一个软链接：

```bash
sudo ln -sf "$HOME/.local/bin/vmflow" /usr/local/bin/vmflow
```

……或者将该目录加入你的 shell `PATH`：

```bash
export PATH="$HOME/.local/bin:$PATH"
```

## 更新 vmflow

一旦从带标签的版本（v0.1.1 或更高）安装，`vmflow` 即可自我更新：

```bash
vmflow update --check            # check for a newer release
vmflow update                    # install the newest release
vmflow update --version v0.1.1   # install a specific version
```

详见 [`vmflow update`](./update) 中的说明、参数和平台注意事项。（v0.1.0 版本早于 `update` 命令——请用上面的安装脚本重新安装以获得自更新能力。）
