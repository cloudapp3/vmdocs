---
title: 路线图
description: vmflow 版本路线图——v0.1 基线已发布，v0.2 进行中，v0.3 已规划。
---

# 路线图

vmflow 处于一个实用的 v0.1 式 MVP 阶段。转发路径、规则生命周期、本地控制面、可观测性基础，以及嵌入 API 均已就位。

## v0.1——基线

- [x] TCP 转发
- [x] UDP 转发
- [x] `ApplySnapshot`
- [x] 守护进程 + CLI
- [x] 本地控制 API
- [x] YAML 配置

## v0.2——进行中

- [x] Prometheus 指标
- [x] 更好的结构化日志
- [x] 控制 API 认证
- [x] 规则预检
- [ ] 优雅排空
- [ ] Windows / macOS 人工验证

## v0.3——已规划

- [ ] 每规则共享带宽桶
- [ ] 事件订阅 API
- [ ] 配置热重载增强
- [x] 原生开机自启服务（通过 `vmflow service install` 支持 systemd / launchd / Windows Service）
- [ ] Docker 官方镜像 / 示例

## 留待以后

HTTP/HTTPS 转发和 ACME/证书管理已在源码中实现（`engine/https.go`、`engine/proxy.go`、`acme/`、`certstore/`、`certreview/`），但在当前构建中被禁用。NAT 穿透（`tunnel/`）同样被保留但未接通。两者都是 L4 能力面稳定之后的未来版本候选。
