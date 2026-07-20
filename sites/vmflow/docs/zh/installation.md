---
title: 安装
description: 通过具备权限感知、PATH 管理、校验和验证与卸载能力的脚本，从 GitHub Releases 安装 vmflow，或从源码构建。
---

# 安装

`vmflow` 以单个静态二进制文件的形式发布，支持 Linux 和 macOS（`amd64` 与 `arm64`）。你可以通过安装脚本从 GitHub Releases 获取，或从源码构建。

Release 仅发布便携归档，不提供由系统包管理器管理的 `.deb` 或 `.rpm` 软件包。请使用下方安装脚本，或手动解压归档。

## 推荐的用户安装方式

```bash
VMFLOW_BIN_DIR="$(
  curl -fsSL https://raw.githubusercontent.com/cloudapp3/vmflow/main/install.sh \
    | bash -s -- --version v0.2.0-rc.4 --print-install-dir
)" \
  && [ -n "$VMFLOW_BIN_DIR" ] \
  && [ "${VMFLOW_BIN_DIR#/}" != "$VMFLOW_BIN_DIR" ] \
  && [ -x "$VMFLOW_BIN_DIR/vmflow" ] \
  && export PATH="$VMFLOW_BIN_DIR:$PATH"
```

该命令固定安装当前预发布版，并立即把安装目录加入当前 shell。省略 `--version v0.2.0-rc.4` 会改为跟随最新稳定版；目前不指定版本会安装 `v0.1.1`，它不包含本文档介绍的 MCP 和 Source IP 策略功能。

## 系统级安装

安装到 `/usr/local/bin`，无需让下载的整个脚本以 root 身份运行：

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vmflow/main/install.sh \
  | bash -s -- --version v0.2.0-rc.4 --system
```

非 root 用户指定 `--system` 时，安装器会在下载前验证 sudo，并且只在检查和写入目标目录时提权。新建的共置配置文件归 root 所有，权限为 `0600`；请使用安装器输出的 root/sudo 验证与启动命令。

安装其他版本时，修改传给 `--version` 的标签：

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vmflow/main/install.sh | bash -s -- --version v0.2.0-rc.4
```

### 安装脚本选项

| 选项 | 说明 |
| --- | --- |
| `--version <tag>` | 安装指定的版本标签。默认为最新稳定版。 |
| `--dir <path>` | 使用明确的安装目录；也可通过 `VMFLOW_INSTALL_DIR` 设置。 |
| `--system` | 系统级安装到 `/usr/local/bin`，仅在必要时使用 sudo。 |
| `--skip-verify` | 跳过 SHA-256 校验和验证。 |
| `--no-modify-path` | 不把自动选择的用户目录写入 shell 启动文件。 |
| `--print-install-dir` | 安装成功后只向 stdout 输出所选目录。 |
| `--uninstall` | 可用时通过 `vmflow uninstall` 卸载；旧版或二进制缺失时使用 shell 回退清理。 |
| `-h, --help` | 显示帮助。 |

### 目录与 PATH 行为

未指定 `--dir` 时，安装器会先复用已有且带有共置配置的常规 vmflow 安装目录。全新的 root 安装使用 `/usr/local/bin`；全新的普通用户安装优先选择已经位于 `PATH` 中的 `~/.local/bin` 或 `~/bin`，否则回退到 `~/.local/bin`。

自动用户安装会在需要时向 `.zshrc`、`.bashrc` 或 `.profile` 写入一段幂等的 PATH 配置，并输出准确的重新加载命令。安装器无法修改当前 shell，因此推荐命令会捕获 `--print-install-dir` 并立即执行 export。明确指定 `--dir` 或 `VMFLOW_INSTALL_DIR` 时，安装器不会修改 shell 启动文件。

### 配置与归档兼容性

安装器下载 GitHub Release 归档，并默认使用 SHA-256 验证 `checksums.txt`。它同时兼容当前归档顶层的 `config.yaml` 和旧版归档中的 `examples/config.yaml`。首次安装会在二进制旁创建权限为 `0600` 的 `config.yaml`；升级只替换二进制，并保留已有配置和转发规则。

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

## 更新 vmflow

一旦从带标签的版本（v0.1.1 或更高）安装，`vmflow` 即可自我更新：

```bash
vmflow update --check            # check for a newer release
vmflow update                    # install the newest release
vmflow update --version v0.2.0-rc.4 # 安装当前预发布版
```

详见 [`vmflow update`](./update) 中的说明、参数和平台注意事项。

## 卸载由安装器管理的版本

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vmflow/main/install.sh \
  | bash -s -- --uninstall
```

二进制清理成功后，该命令还会移除安装器写入的精确 PATH 块。只有卸载 root 所有的系统级安装时才使用 `sudo bash -s -- --uninstall`。清理范围与保留规则参见 [`vmflow uninstall`](./uninstall)。
