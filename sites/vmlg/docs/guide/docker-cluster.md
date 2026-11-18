---
title: Docker & Multi-Node Cluster
description: Deploy vmlg with Docker Compose or connect global regional Agents to a central Hub portal.
---

# Docker & Multi-Node Cluster

Official `linux/amd64` and `linux/arm64` images are published at `ghcr.io/cloudapp3/vmlg:latest` with `iperf3` pre-installed and running as non-root UID `10001`.

## Standalone Docker Run

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

## Hub + Agent Multi-Region Topology

Instead of maintaining 10 separate Looking Glass subdomains, run one central **Hub** and connect any number of regional **Agents** outbound over WebSocket:

1. **Control & Diagnostic Stream**: Ping, streaming MTR, iPerf3 port leases, and BGP queries travel over the outbound Agent → Hub WebSocket tunnel (works behind NAT/firewalls).
2. **High-Bandwidth Speedtest**: When `public_url` is configured on an Agent, Hub issues short-lived HMAC-SHA256 tickets so browsers run 10Gbps HTML5 speedtests and download `1GB.bin` directly from the target region.

### Start Hub

```bash
export VMLG_AGENT_TOKEN="replace-with-strong-secret"
vmlg hub \
  -listen 0.0.0.0:8080 \
  -title "Global Cloud Looking Glass" \
  -enable-local-node \
  -node-id hkg-01 \
  -node-name "Hong Kong · Hub" \
  -region "APAC"
```

### Connect Regional Agent

```bash
export VMLG_AGENT_TOKEN="replace-with-strong-secret"
vmlg agent \
  -hub-url wss://lg.example.com/api/v1/cluster/ws \
  -node-id lax-01 \
  -node-name "Los Angeles · CN2 GIA" \
  -location "Los Angeles, US" \
  -region "NA" \
  -tags "CN2 GIA,10Gbps" \
  -speedtest-listen 0.0.0.0:8081 \
  -public-url https://lax-speed.example.com
```

Docker secrets via `*_FILE` environment variables (`VMLG_AGENT_TOKEN_FILE`, `VMLG_SIGNING_SECRET_FILE`, `VMLG_METRICS_TOKEN_FILE`) are also supported out of the box.
