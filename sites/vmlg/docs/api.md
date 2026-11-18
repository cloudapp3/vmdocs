---
title: HTTP & SSE API Reference
description: REST, Server-Sent Events (SSE), and Prometheus endpoints exposed by vmlg.
---

# HTTP & SSE API Reference

| Method & Path | Transport | Description |
| --- | --- | --- |
| `GET /healthz` | JSON | Service readiness probe |
| `GET /metrics` | Prometheus | Telemetry counters & gauges (optional `metrics_token` Bearer auth) |
| `GET /api/v1/meta` | JSON | Portal metadata, visitor IP/ASN, brand links, and registered nodes |
| `GET /api/v1/nodes` | JSON | Live node list with active load and short-lived HMAC speedtest tickets |
| `GET /api/v1/probe/compare` | SSE | Multi-node concurrent latency & return-route broadcast (`?target=...&ip_version=auto`) |
| `GET /api/v1/probe/mtr` | SSE | Live multi-cycle MTR hop snapshots (`?node=...&target=...&cycles=5`) |
| `GET /api/v1/probe/ping` | SSE | Live ICMP or TCP Ping stream (`?node=...&target=...&protocol=icmp`) |
| `GET /api/v1/bgp/route` | JSON | BGP RIB route lookup (`?node=...&target=1.1.1.0/24`) |
| `GET /api/v1/bgp/summary` | JSON | BGP neighbor session summary (`?node=...`) |
| `POST /api/v1/iperf3/lease` | JSON | Allocate temporary one-shot `iperf3` server port (`?node=...`) |
| `GET /api/v1/speedtest/ping` | `204` | Low-overhead HTTP RTT & jitter probe |
| `GET /api/v1/speedtest/download` | Binary | Incompressible `ChaCha8` download stream (`?bytes=...`) |
| `POST /api/v1/speedtest/upload` | JSON | Zero-disk upload discard sink |
| `GET /speedtest/files/{name}` | Binary | Zero-disk test files (`10MB.bin`, `100MB.bin`, `1GB.bin`) |
