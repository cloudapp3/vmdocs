---
title: Quick Start
description: Install and run vmlg as a single-binary Network Looking Glass in under 60 seconds.
---

# Quick Start

**vmlg** ships as a pure-Go (`CGO_ENABLED=0`) static binary with the web UI embedded via `go:embed`. No external database, Redis, PHP, or Node.js runtime is required.

## Install

```bash
# Release installer (SHA-256 verified)
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vmlg/main/install.sh | bash -s -- --system

# Or via Go toolchain
go install github.com/cloudapp3/vmlg/cmd/vmlg@latest
```

Upgrade an existing binary in place:

```bash
vmlg update
```

## Run Standalone Mode

```bash
vmlg serve \
  -listen 0.0.0.0:8080 \
  -node-id tyo-01 \
  -node-name "Tokyo · BGP Premium" \
  -location "Tokyo, JP" \
  -region "APAC"
```

Open `http://127.0.0.1:8080` in your browser.

## Unprivileged ICMP on Linux

Inside unprivileged containers without `CAP_NET_RAW`, `vmlg` automatically falls back to Linux kernel `IP_RECVERR` (`MSG_ERRQUEUE`) hop tracing. On bare-metal or VM systemd hosts, enable native ICMP with either:

```bash
sudo setcap cap_net_raw+ep /usr/local/bin/vmlg
# or
sudo sysctl -w net.ipv4.ping_group_range="0 2147483647"
```

## Shareable Deep-Links & Embeddable Widget

Link directly to an auto-running test or embed a compact card inside a review blog:

```html
<iframe
  src="https://lg.example.com/?tab=diag&node=tyo-01&embed=1"
  width="100%"
  height="540"
  style="border:0;border-radius:12px;overflow:hidden"
  loading="lazy">
</iframe>
```
