---
title: Changelog
description: Notable user-facing changes to vmflow.
---

# Changelog

All notable user-facing changes to `vmflow` are documented here.

## v0.3.0 - 2026-08-03

### Added

- Aggregate per-rule `bandwidth_limit` with human-readable bit-rate and byte-rate units, symmetric `rate` or directional `upload` / `download`, and sharing across every TCP connection and UDP session with the same `rule_id`.
- Durable `traffic_quota` enforcement for combined successful upload + download payload, with daily/monthly calendar periods, IANA timezones, automatic reopening, and fail-closed `quota-state.json` persistence independent of optional statistics persistence.
- Automatic DNS failover for init checks, precheck, and outbound forwarding: operating-system DNS remains primary, with transient-error fallback to `223.5.5.5:53` and `119.29.29.29:53`; definitive `NXDOMAIN` responses stay local.
- Dashboard Host Network section with interface state, MTU, IP CIDRs, cumulative RX/TX counters, and live rates from the connected daemon.
- `vmflow mcp` - read-only stdio MCP tools for daemon status, forwarding rules, traffic statistics, and current-config precheck without exposing a new network listener.
- `vmflow service (install|start|uninstall|status)` — register and recover a native OS service that starts at boot and restarts on crash (systemd / launchd / Windows Service).
- `vmflow service start` and TUI-assisted recovery for an installed local service that is stopped.
- `vmflow uninstall [--dry-run]` — one-command teardown that removes the service, binary, config, logs, TLS/ACME certificates, and self-update cache.

### Security

- **Breaking:** daemon management now always binds to `127.0.0.1`. Configure only `control_port`; loopback `control_listen_addr` values are accepted for one migration release, while non-loopback values are rejected. Use an SSH tunnel for remote CLI/TUI access.
- Per-connection TCP `idle_timeout` (default 5 minutes) and force-closing of forwarded connections on Stop/reload.
- Auth-failure rate limiting: a peer IP that fails auth 10 times within one minute is throttled with HTTP `429` and locked out for one minute.
- Self-update hardening (random temp file + `Lstat`), redaction of internal paths from logs, and `install.sh --no-same-owner`.

### Changed

- `vmflow init` now asks for language first, then explicitly offers native background service, foreground, or configure-only mode. It validates target input before saving, requires explicit confirmation for exposed listeners, and creates the correct system or user config plus a mode-`0600` local client profile.
- The TUI rule editor exposes shared bandwidth and daily/monthly quota fields, with directional rates and quota timezone in advanced settings. Host Network remains part of Dashboard and is reachable with `4`.
- Release archives keep the sample at `examples/config.yaml`; the installer writes only `vmflow`, preserves all existing configuration, and directs first-time users to `vmflow init`.
- Reload continues to apply `rules` and `udp_max_sessions` transactionally after precheck. Bandwidth, quota, or source-policy changes restart only the affected rule while preserving quota usage for its stable `rule_id`.
- The supported management surface is the bundled CLI/TUI and read-only MCP adapter. Its loopback transport is internal and has no external compatibility promise.
- Native service registration is now built in; the hand-written systemd unit is no longer the only option. Releases use portable archives and the installer rather than distro-specific system packages.
- Service installation now parses and validates the protected config before changing OS state. Linux unit updates restart immediately and roll back the previous unit/state on failure; macOS restores the previous plist and loaded state when bootstrap fails; Windows uses native SCM APIs for quoted arguments, updates existing services, enables recovery for crash and non-crash failures, and waits for application readiness before reporting success.

## v0.2.0-rc.4

### Added

- `install.sh --system` for an explicit system-wide install with privilege escalation limited to target checks and writes.
- `install.sh --no-modify-path` and `--print-install-dir` for controlled shell startup-file updates and machine-readable current-shell integration.

### Changed

- The installer is privilege-aware: it reuses conventional existing installs with colocated configs, selects root and user directories separately, and adds an idempotent PATH block only for automatic user installs.
- Release extraction accepts both the current top-level `config.yaml` and the legacy `examples/config.yaml` archive layout. Existing colocated configs and forwarding rules are preserved during upgrades.
- `install.sh --uninstall` delegates to the binary when available, falls back to shell cleanup for older or missing binaries, and removes only the exact installer-owned PATH block after binary cleanup succeeds.

### Security

- Installer option values, extracted binary/config file types, existing target paths, and privileged command paths receive explicit validation. Sudo authentication now happens before downloads, and the downloaded script no longer needs to run wholesale as root for a system install.

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
