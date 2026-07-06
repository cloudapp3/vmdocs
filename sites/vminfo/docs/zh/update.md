---
title: update
description: 检查或安装最新的 vminfo 标记版本。
---

# `vminfo update`

检查 GitHub Releases，并在可能的情况下安装最新的标记构建。

## 用法

```bash
vminfo update
vminfo update --check
vminfo update --version v0.1.0
```

## 说明

- `--check` 只检查更新。
- `--version` 检查或安装指定的发布标签。
- 开发构建在没有 `--version` 的情况下无法自更新。
- 在 Windows 上不支持安装模式，因为二进制无法就地替换自身。

## 示例

```bash
vminfo update --check
```

## 相关文档

- [安装](/zh/installation)
- [Changelog](/changelog)
