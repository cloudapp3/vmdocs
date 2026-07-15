---
title: Changelog
description: Notable user-facing changes to vmflow.
---

# Changelog

All notable user-facing changes to `vmflow` are documented here.

## Unreleased

### Added

- `vmflow service (install|uninstall|status)` — register vmflow as a native OS service that starts at boot and restarts on crash (systemd / launchd / Windows Service).
- `vmflow uninstall [--dry-run]` — one-command teardown that removes the service, binary, config, logs, TLS/ACME certificates, and self-update cache.

### Security

- **Breaking:** daemon management now always binds to `127.0.0.1`. Configure only `control_port`; loopback `control_listen_addr` values are accepted for one migration release, while non-loopback values are rejected. Use an SSH tunnel for remote CLI/TUI access.
- Per-connection TCP `idle_timeout` (default 5 minutes) and force-closing of forwarded connections on Stop/reload.
- Auth-failure rate limiting: a peer IP that fails auth 10 times within one minute is throttled with HTTP `429` and locked out for one minute.
- Self-update hardening (random temp file + `Lstat`), redaction of internal paths from logs, and `install.sh --no-same-owner`.

### Changed

- The supported management surface is the bundled CLI/TUI. Its loopback transport is internal and has no external compatibility promise.
- Native service registration is now built in; the hand-written systemd unit is no longer the only option. Releases use portable archives and the installer rather than distro-specific system packages.
- Service installation now parses and validates the protected config before changing OS state. Linux unit updates restart immediately and roll back the previous unit/state on failure; macOS restores the previous plist and loaded state when bootstrap fails; Windows uses native SCM APIs for quoted arguments, updates existing services, enables recovery for crash and non-crash failures, and waits for application readiness before reporting success.

## v0.1.1

### Added

- `vmflow update` self-update command (`--check`, `--version`), ported from vminfo's updater. Self-replaces the binary on Linux/macOS; Windows is check-only.

## v0.1.0

### Added

- Unified `vmflow` binary with `daemon`, `ctl`, `tui`, and `version` subcommands.
- TCP, UDP, and `tcp+udp` forwarding rules.
- Rule lifecycle management with full snapshot apply and reload support.
- Local CLI/TUI management for health, rules, stats, precheck, reload, and metrics.
- Bearer-token auth with viewer/admin roles.
- Structured text/JSON logging.
- Prometheus-compatible `/metrics` endpoint.
- Rule precheck for loops, duplicate listeners, and unavailable ports.
- Embeddable top-level Go runtime API.
- GitHub Actions CI and GoReleaser release configuration.

### Changed

- Public documentation now recommends the single `vmflow` binary instead of separate `relayd`, `relayctl`, and `relaytui` artifacts.

### Notes

- Historical stats, web dashboard, and graceful drain remain roadmap items.
