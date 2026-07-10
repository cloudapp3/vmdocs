---
title: Changelog
description: Notable user-facing changes to vmflow.
---

# Changelog

All notable user-facing changes to `vmflow` are documented here.

## Unreleased

### Added

- Control-plane TLS and mutual TLS on the control API via `control_tls` (`cert_file`, `key_file`, optional `client_ca_file` for mTLS, `min_version`). Client flags `-tls-ca-file` / `-tls-client-cert` / `-tls-client-key` / `-tls-skip-verify` (and `VMFLOW_TLS_*` env). mTLS satisfies the non-loopback startup safety check.
- Repeatable client header flag `-H` / `--header` (and `VMFLOW_HEADERS` env, semicolon-separated) on `vmflow ctl`/`tui` and the legacy clients — e.g. to send Cloudflare Access service tokens.
- `vmflow service (install|uninstall|status)` — register vmflow as a native OS service that starts at boot and restarts on crash (systemd / launchd / Windows Service).
- `vmflow uninstall [--dry-run]` — one-command teardown that removes the service, binary, config, logs, TLS/ACME certificates, and self-update cache.
- New end-user guide `docs/USAGE.md` and the `docs/behind-cloudflare.md` runbook (expose the control API behind Cloudflare Tunnel + Access with zero inbound ports).

### Security

- **Breaking:** the daemon now refuses to start when the control API is bound to a non-loopback address without `auth.enabled` or mTLS (`control_tls.client_ca_file`). Previously this only logged a warning. Bind to `127.0.0.1`, enable auth, enable mTLS, or pass `--insecure-allow-remote-control` to opt back in.
- Per-connection TCP `idle_timeout` (default 5 minutes) and force-closing of forwarded connections on Stop/reload.
- Auth-failure rate limiting: a peer IP that fails auth 10 times within one minute is throttled with HTTP `429` and locked out for one minute.
- Self-update hardening (random temp file + `Lstat`), redaction of internal paths from logs, and `install.sh --no-same-owner`.

### Changed

- "Admin" → "Control" rename of the API surface: config key `admin_listen_addr` → `control_listen_addr`, env var `VMFLOW_ADMIN_TOKEN` → `VMFLOW_CONTROL_TOKEN`, and metric prefix `vmflow_admin_*` → `vmflow_control_*`. (Auth roles remain `admin` / `viewer`.)
- Native service registration is now built in; the hand-written systemd unit is no longer the only option. Releases also produce `.deb` / `.rpm` packages.

## v0.1.1

### Added

- `vmflow update` self-update command (`--check`, `--version`), ported from vminfo's updater. Self-replaces the binary on Linux/macOS; Windows is check-only.

## v0.1.0

### Added

- Unified `vmflow` binary with `daemon`, `ctl`, `tui`, and `version` subcommands.
- TCP, UDP, and `tcp+udp` forwarding rules.
- Rule lifecycle management with full snapshot apply and reload support.
- Local control API for health, rules, stats, precheck, reload, and metrics.
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
