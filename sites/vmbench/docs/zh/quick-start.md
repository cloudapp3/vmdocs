---
title: 快速开始
description: 安装 vmbench 并运行 CLI、TUI、suite 和报告。
---

# 快速开始

## 安装

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vmbench/main/install.sh | bash
```

或从源码安装：

```bash
go install github.com/cloudapp3/vmbench/cmd/vmbench@latest
```

## 启动 TUI

```bash
vmbench
```

## 运行 benchmark

```bash
vmbench run
vmbench run --json report.json --html report.html
vmbench run --filter 'sysbench|fio|OpenSSL'
```

## 运行 VPS suite

```bash
vmbench suite
vmbench suite --preset quick
vmbench suite --only ping,mail
```

## 对比报告

```bash
vmbench compare before.json after.json
```
