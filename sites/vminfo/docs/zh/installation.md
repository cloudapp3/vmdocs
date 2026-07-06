---
title: 安装
description: 通过 shell 安装脚本、go install 或自定义二进制目录安装 vminfo。
---

# 安装

## Shell 安装脚本（Linux/macOS）

安装脚本是 Linux 和 macOS 上最快的安装方式。

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vminfo/main/install.sh | bash
```

使用 sudo：

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vminfo/main/install.sh | sudo bash
```

脚本会按以下顺序自动选择安装目录：

1. `/usr/local/bin`
2. `~/.local/bin`
3. `~/bin`

如果想固定安装目录，传入 `--dir`：

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vminfo/main/install.sh | bash -s -- --dir /opt/bin
```

如果想显式跳过校验和验证，脚本还支持 `--skip-verify`。

## 通过 go install 安装

```bash
go install github.com/cloudapp3/vminfo/cmd/vminfo@latest
```

## 更新

```bash
vminfo update
vminfo update --check
vminfo update --version v0.1.0
```

说明：

- `vminfo update` 在运行的是 tagged 构建时，安装最新的 tagged release
- `vminfo update --check` 仅检查更新
- `vminfo update --version v0.1.0` 检查或安装指定的 release tag

## PATH 排错

如果已安装 `vminfo` 但找不到命令，请确认安装目录在 `PATH` 中。

常见示例：

```bash
export PATH="$HOME/.local/bin:$PATH"
export PATH="$HOME/bin:$PATH"
```

## 卸载

从安装目录中删除二进制文件：

```bash
rm -f /usr/local/bin/vminfo
rm -f ~/.local/bin/vminfo
rm -f ~/bin/vminfo
```
