---
title: Changelog
description: Notable user-facing changes to vmflow.
---

# Changelog

All notable user-facing changes to `vmflow` are documented here.

## v0.1.1

### Added

- `vmflow update` self-update command (`--check`, `--version`), ported from vminfo's updater. Self-replaces the binary on Linux/macOS; Windows is check-only.

## v0.1.0

### Added

- Unified `vmflow` binary with `daemon`, `ctl`, `tui`, and `version` subcommands.
- TCP, UDP, and `tcp+udp` forwarding rules.
- Rule lifecycle management with full snapshot apply and reload support.
- Local admin API for health, rules, stats, precheck, reload, and metrics.
- Bearer-token auth with viewer/admin roles.
- Structured text/JSON logging.
- Prometheus-compatible `/metrics` endpoint.
- Rule precheck for loops, duplicate listeners, and unavailable ports.
- Embeddable top-level Go runtime API.
- GitHub Actions CI and GoReleaser release configuration.

### Changed

- Public documentation now recommends the single `vmflow` binary instead of separate `relayd`, `relayctl`, and `relaytui` artifacts.

### Notes

- Historical stats, web dashboard, graceful drain, and systemd/Docker packaging remain roadmap items.
