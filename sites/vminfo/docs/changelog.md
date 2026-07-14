---
title: Changelog
description: Release notes and recent product changes for vminfo.
---

# Changelog

## Unreleased

- Require token authentication for every non-loopback web bind, reject empty or invalid web options, and document loopback, SSH-tunnel, reverse-proxy, and private-network deployment patterns.
- Harden the web server with loopback Host validation against DNS rebinding, scheme/host/port same-origin checks for REST and WebSocket requests, secure auth cookies behind HTTPS proxies, bounded JSON network diagnostics, HTTP timeouts, and graceful client shutdown.
- Harden CLI and TUI output against terminal control sequences from host and process data; add stricter PID, interval, port, timeout, probe-count, and flag-position validation across `summary`, `watch`, `ps`, `kill`, `--web`, and `net`.
- Harden self-update and collector lifecycle behavior with cancellation-aware checks, regular-file-only update caches, release-metadata revalidation, unique synced temporary binaries, cleanup on replacement failures, idempotent start/stop, and defensive snapshot copies.

## v0.2.1 - 2026-07-05

- Add `vminfo net` diagnostics — `dns`, `port`, `ping` (TCP or ICMP), and `ip` (public IP + ASN / geo) subcommands, each with `--json` output, plus a `POST /api/v1/net/diag` endpoint to trigger them from the web dashboard.

## v0.2.0 - 2026-07-04

- Add switchable web dashboard themes (Auto / Neon / Light / Terminal / Synthwave) and embed JetBrains Mono so the dashboard is self-contained and works offline.
- Add network health signals: TCP state distribution (`ESTABLISHED` / `TIME_WAIT` / …), conntrack usage (Linux), and health warnings `network_errors`, `network_drops`, `tcpconn_high`, and `conntrack_high` in `GET /api/v1/health`.
- Enhance `vminfo ps` on Linux with positional and `--filter` process search, `--limit`, tree output, `--watch` with `--count` / `--interval`, `AGE` / `COMMAND` columns, and JSON `command` / `started_at_unix` process fields.
- Add a lightweight web Health Summary card, `GET /api/v1/health`, and a filterable/sortable `GET /api/v1/processes` endpoint for process diagnostics.
- Add `docs/api.md` and `docs/roadmap/feature-benchmark.md` to document the HTTP API, competitor feature benchmarking, and a prioritized product roadmap for `vminfo`.
- Add public `github.com/cloudapp3/vminfo/tui` package for embedding the interactive terminal UI from other Go CLIs.
- Add configurable TUI runner options for stdin, stdout, and language selection while keeping existing internal CLI behavior.
- Improve Linux process collection by reading `/proc` directly, with better CPU and user-name resolution.
- Add a TUI toggle for showing or hiding kernel threads in the process list.

## v0.1.4 - 2026-05-03

- Fix web dashboard auth so `vminfo --web` no longer auto-generates or enables a token unless `--token` is explicitly requested.
- Add regression coverage for explicit vs implicit web token resolution.
