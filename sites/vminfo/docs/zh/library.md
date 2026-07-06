---
title: Go 库
description: 将 vminfo 作为 Go 库嵌入，用于采集主机指标并集成终端 UI。
---

# Go 库

vminfo 暴露了公开的包，用于采集主机指标和嵌入终端 UI。

## 包

- `github.com/cloudapp3/vminfo`
- `github.com/cloudapp3/vminfo/tui`

## 导出类型

- `StaticInfo`
- `RuntimeStats`
- `Snapshot`
- `ProcessInfo`
- `AppMetadata`

## 常用入口

- `CollectStatic`
- `CollectStats`
- `CollectAll`
- `Metadata`
- `tui.Run`

## 相关文档

- [采集指标](/zh/collect)
- [嵌入 TUI](/zh/embed-tui)
