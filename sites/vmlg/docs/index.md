---
layout: home
hero:
  name: vmlg
  text: Modern Multi-Node Network & BGP Looking Glass in Go
  tagline: Single static binary (8.6 MB, zero CGO, zero Node build) uniting real-time SSE MTR, multi-region return-route comparison, zero-disk speedtest, ephemeral iPerf3 leases, and pure SVG BGP AS-Path graphs.
  image:
    src: /logo.svg
    alt: vmlg
  actions:
    - theme: brand
      text: Quick Start
      link: /guide/quick-start
    - theme: alt
      text: Docker & Cluster
      link: /guide/docker-cluster
    - theme: alt
      text: BGP & MCP
      link: /guide/bgp-mcp
    - theme: alt
      text: GitHub
      link: https://github.com/cloudapp3/vmlg

features:
  - icon: ⚡
    title: Multi-Node Broadcast Compare
    details: Visitors click once to test latency, packet loss, and return-route backbones concurrently across all online regions.
    link: /guide/docker-cluster
  - icon: 🧭
    title: Streaming MTR & Carrier Tags
    details: Real-time SSE MTR with Linux IP_RECVERR unprivileged fallback and built-in CN2 GIA, CU 9929, CMIN2, IIJ, HKIX, and DE-CIX detection.
    link: /guide/quick-start
  - icon: 🚀
    title: Zero-Disk Speedtest & iPerf3 Leases
    details: Stream incompressible ChaCha8 test files from RAM (0 disk usage), run HTML5 benchmarks, and lease temporary one-shot iPerf3 ports.
    link: /guide/quick-start
  - icon: 🌐
    title: Pluggable Read-Only BGP & SVG Graph
    details: Query BIRD 2/3 Unix sockets (restrict mode), FRRouting JSON, or GoBGP with client-side SVG AS-Path topology rendering.
    link: /guide/bgp-mcp
  - icon: 🛡️
    title: Dual-Dimension Anti-Abuse Guard
    details: Zero shell execution, strict DNS-rebinding/SSRF blocking, and Per-Client + Per-Target (/24 & /48) amplification rate limits.
    link: /api
  - icon: 🤖
    title: Prometheus, MCP & Embed Widget
    details: Built-in /metrics endpoint, stdio JSON-RPC MCP server, Markdown + Discuz! BBCode export, and iframe widget mode.
    link: /guide/bgp-mcp
---

## One-Line Installation

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vmlg/main/install.sh | bash -s -- --system
```

Or run with Docker Compose (multi-arch `linux/amd64` & `linux/arm64`, `iperf3` pre-installed):

```bash
docker compose up -d
```
