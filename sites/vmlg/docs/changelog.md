---
title: Changelog
description: Release history for vmlg.
---

# Changelog

## v0.1.0 (2026-11-18)

- Initial release of **vmlg**: single-binary `standalone`, `hub`, and `agent` modes.
- Multi-node concurrent latency & return-route comparison (`CN2 GIA`, `CU 9929`, `CMIN2`, `CT 163`, `CU 4837`, `CMI`, `IIJ`, `SoftBank`, `HKIX`, `DE-CIX`, `AMS-IX`, `Equinix`).
- Native Go ICMP/TCP Ping & live SSE MTR with unprivileged Linux `IP_RECVERR` fallback.
- Zero-disk `ChaCha8` speedtest streams, HTML5 speedtest, and ephemeral `iperf3` port leases.
- Pluggable read-only BGP drivers (`bird`, `frr`, `gobgp`, `mock`) with pure SVG AS-Path topology rendering.
- Dual-dimension anti-abuse Guard (`Per-Client` + `Per-Target /24 & /48`), Prometheus `/metrics`, `vmlg mcp`, `vmlg update`, multi-arch Docker image, Markdown + Discuz! BBCode export, and `?embed=1` widget mode.
