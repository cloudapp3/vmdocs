---
title: 概览
description: vminfo 的作用，以及它采集哪些主机指标。
---

# 概览

vminfo 是一个跨平台主机运行时信息工具包，用于快速的本地诊断。

## 它能提供什么

- **TUI** — 全屏终端仪表盘
- **JSON 输出** — 适合脚本的单次快照与持续 watch 流
- **Web 仪表盘** — 轻量浏览器 UI，附带 REST 与 WebSocket 端点
- **Go 库** — 可导入的指标采集与内嵌 TUI API

## 采集的指标

vminfo 采集：

- CPU 使用率、每核使用率、CPU 频率
- 内存与 swap 使用情况
- 磁盘使用率与磁盘 I/O
- 网络总流量、速率、TCP/UDP 连接数
- TCP 状态分布（`ESTABLISHED` / `TIME_WAIT` / `SYN_RECV` / …）与 conntrack 使用情况（Linux）
- 每个网卡的流量、错误与丢包
- 进程列表与进程元数据
- 温度读数
- 运行时长与主机元数据

## 公开的 Go 类型

- `StaticInfo`
- `RuntimeStats`
- `Snapshot`
- `ProcessInfo`
- `AppMetadata`

## 常用入口

- `vminfo`
- `vminfo info`
- `vminfo summary`
- `vminfo watch`
- `vminfo --web`
- `vminfo ps`
- `vminfo kill <pid>`
- `vminfo net dns | port | ping | ip`
- `vminfo update`

## 适用场景

当你需要以下任一项时，vminfo 很合适：

- 一个单二进制，用于快速查看主机状态
- 一个可读的终端 UI，用于交互式操作
- 面向脚本、CI 或自动化的 JSON
- 一个无需部署监控体系的浏览器仪表盘
- 一个可嵌入到其它 CLI 的 Go 库
