---
title: 路线图
description: vmflow v0.3.0 是当前正式版本，已交付能力与后续工作分别列出。
---

# 路线图

vmflow v0.3.0 是当前正式版本。L4 转发路径、本地控制面、可观测性、原生服务生命周期、流量治理、终端 UI 和嵌入 API 均已可用。

## v0.3.0 之前已交付的基线能力

- [x] TCP、UDP 和 `tcp+udp` 转发
- [x] `ApplySnapshot`、规则生命周期和 YAML 热重载
- [x] 本地 CLI/TUI 管理
- [x] Prometheus 指标和结构化日志
- [x] 管理认证和规则预检
- [x] 可嵌入的 Go 运行时 API

## v0.3.0 - 已于 2026-08-03 发布

- [x] 每规则共享的上传/下载带宽限制
- [x] 可持久化的日/月流量配额
- [x] 检查与出站转发的自动 DNS 故障切换
- [x] 显示网卡实时计数与速率的 Host Network 仪表盘
- [x] CLI/TUI 英文和简体中文本地化
- [x] 原生服务安装、开机启动、状态检查与 TUI 辅助恢复
- [x] 用于本地诊断的只读 stdio MCP 工具

## 后续工作

- [ ] 优雅排空现有连接
- [ ] 事件订阅 API
- [ ] Windows 和 macOS 人工验证
- [ ] 官方 Docker 镜像与部署示例
- [ ] 扩展跨平台和集成测试覆盖

## 留待以后

HTTP/HTTPS 转发和 ACME/证书管理已在源码中实现（`engine/https.go`、`engine/proxy.go`、`acme/`、`certstore/`、`certreview/`），但在当前构建中被禁用。NAT 穿透（`tunnel/`）同样被保留但未接通。两者都是 L4 能力面稳定之后的未来版本候选。
