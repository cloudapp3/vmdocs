---
title: Roadmap
description: vmflow v0.3.0 is the current stable release, with shipped capabilities and future work tracked separately.
---

# Roadmap

vmflow v0.3.0 is the current stable release. The L4 forwarding path, local control plane, observability, native service lifecycle, traffic governance, terminal UI, and embedding API are available today.

## Baseline shipped before v0.3.0

- [x] TCP, UDP, and `tcp+udp` forwarding
- [x] `ApplySnapshot`, rule lifecycle, and YAML hot reload
- [x] Local CLI/TUI management
- [x] Prometheus metrics and structured logging
- [x] Management authentication and rule precheck
- [x] Embeddable Go runtime API

## v0.3.0 - shipped 2026-08-03

- [x] Aggregate per-rule upload/download bandwidth limits
- [x] Durable daily and monthly traffic quotas
- [x] Automatic DNS failover for checks and outbound forwarding
- [x] Host Network dashboard with live interface counters and rates
- [x] English and Simplified Chinese CLI/TUI localization
- [x] Native service install, boot startup, status, and TUI-assisted recovery
- [x] Read-only stdio MCP tools for local diagnostics

## Future work

- [ ] Graceful connection draining
- [ ] Event subscription API
- [ ] Windows and macOS manual verification
- [ ] Official Docker image and deployment examples
- [ ] Expanded cross-platform and integration coverage

## Reserved for later

HTTP/HTTPS forwarding and ACME/certificate management are implemented in the source (`engine/https.go`, `engine/proxy.go`, `acme/`, `certstore/`, `certreview/`) but disabled in the current build. NAT traversal (`tunnel/`) is likewise retained but not wired up. Both are candidates for a future release once the L4 surface stabilizes.
