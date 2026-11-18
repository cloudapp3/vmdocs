---
title: 快速开始与集群部署
description: 1 分钟部署单机或多机房 vmlg Looking Glass。
---

# 快速开始与集群部署

## 1. 二进制一键安装与单机启动

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vmlg/main/install.sh | bash -s -- --system

vmlg serve \
  -listen 0.0.0.0:8080 \
  -node-id tyo-01 \
  -node-name "Tokyo · BGP Premium" \
  -location "Tokyo, JP" \
  -region "APAC"
```

后续升级只需执行 `vmlg update`。

## 2. Docker 与 Docker Compose 部署

官方多架构镜像 `ghcr.io/cloudapp3/vmlg:latest` 已内置 `iperf3` 并默认以非特权用户运行：

```bash
docker run -d \
  --name vmlg \
  --restart unless-stopped \
  --cap-drop ALL \
  --cap-add NET_RAW \
  --sysctl net.ipv4.ping_group_range="0 2147483647" \
  -p 8080:8080 \
  -p 5201-5210:5201-5210/tcp \
  -p 5201-5210:5201-5210/udp \
  -e VMLG_NODE_ID=tyo-01 \
  -e VMLG_NODE_NAME="Tokyo · BGP Premium" \
  -e VMLG_NODE_LOCATION="Tokyo, JP" \
  -e VMLG_NODE_REGION=APAC \
  ghcr.io/cloudapp3/vmlg:latest
```

## 3. Hub + Agent 多机房聚合模式

在主门户运行 `vmlg hub`，各地域机器运行 `vmlg agent` 主动通过反向 WebSocket 注册（支持 NAT 环境与 `*_FILE` Docker Secrets）：

```bash
# Hub 节点
export VMLG_AGENT_TOKEN="your-strong-cluster-token"
vmlg hub -listen 0.0.0.0:8080 -enable-local-node -node-id hkg-01 -node-name "Hong Kong 01" -region "APAC"

# 远端 Agent 节点
export VMLG_AGENT_TOKEN="your-strong-cluster-token"
vmlg agent \
  -hub-url wss://lg.example.com/api/v1/cluster/ws \
  -node-id lax-01 \
  -node-name "Los Angeles · CN2 GIA" \
  -region "NA" \
  -tags "CN2 GIA,10Gbps" \
  -speedtest-listen 0.0.0.0:8081 \
  -public-url https://lax-speed.example.com
```

## 4. 测评博客嵌入与深链分享

支持导出 **Markdown（NodeSeek / LET）** 与 **BBCode（HostLoc）** 双格式脱敏报告，并支持通过 `?embed=1` 直接嵌入评测文章：

```html
<iframe src="https://lg.example.com/?tab=diag&node=tyo-01&embed=1" width="100%" height="540" style="border:0;border-radius:12px"></iframe>
```
