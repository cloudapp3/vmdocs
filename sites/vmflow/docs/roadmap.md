---
title: Roadmap
description: vmflow release roadmap — v0.1 baseline shipped, v0.2 in progress, v0.3 planned.
---

# Roadmap

vmflow is at a practical v0.1-style MVP. The forwarding path, rule lifecycle, local control plane, observability basics, and embedding API are in place.

## v0.1 — baseline

- [x] TCP forwarding
- [x] UDP forwarding
- [x] `ApplySnapshot`
- [x] daemon + CLI
- [x] local admin API
- [x] YAML config

## v0.2 — in progress

- [x] Prometheus metrics
- [x] better structured logging
- [x] admin API authentication
- [x] rule precheck
- [ ] graceful drain
- [ ] Windows / macOS manual verification

## v0.3 — planned

- [ ] per-rule shared bandwidth bucket
- [ ] event subscription API
- [ ] config hot-reload enhancements
- [ ] Docker / systemd official examples

## Reserved for later

HTTP/HTTPS forwarding and ACME/certificate management are implemented in the source (`engine/https.go`, `engine/proxy.go`, `acme/`, `certstore/`, `certreview/`) but disabled in the current build. NAT traversal (`tunnel/`) is likewise retained but not wired up. Both are candidates for a future release once the L4 surface stabilizes.
