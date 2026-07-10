---
title: Command Reference
description: vmflow CLI reference — daemon, ctl, tui, version, update, service, uninstall subcommands and their aliases.
---

# Command Reference

vmflow is a single binary with seven subcommands. Aliases are shown in the table below.

| Command | Alias | Purpose |
| --- | --- | --- |
| [`daemon`](./daemon) | `d` | Run the forwarding daemon. |
| [`ctl`](./ctl) | `c` | Query and control a running daemon. |
| [`tui`](./tui) | `t` | Terminal dashboard. |
| [`version`](./version) | `v` | Print build metadata. |
| [`update`](./update) | `u` | Check for or install a newer release. |
| [`service`](./service) | `svc` | Register as a native OS service (boot startup). |
| [`uninstall`](./uninstall) | `remove`, `rm` | One-command uninstall with cleanup. |

## Common client flags

`ctl` and `tui` are clients of the [control API](../api) and share these flags:

| Flag | Env var | Default | Description |
| --- | --- | --- | --- |
| `-addr` | _(none)_ | `http://127.0.0.1:19090` | Control API base URL. |
| `-token` | `VMFLOW_CONTROL_TOKEN` | _(none)_ | Bearer token when auth is enabled. |
| `-tls-ca-file` | `VMFLOW_TLS_CA_FILE` | _(none)_ | CA bundle to verify the control API server certificate (private/self-signed CAs). |
| `-tls-client-cert` | `VMFLOW_TLS_CLIENT_CERT` | _(none)_ | Client certificate for mTLS (required when the server sets `control_tls.client_ca_file`). |
| `-tls-client-key` | `VMFLOW_TLS_CLIENT_KEY` | _(none)_ | Client key for mTLS (used with `-tls-client-cert`). |
| `-tls-skip-verify` | `VMFLOW_TLS_INSECURE` (`1`/`true`) | `false` | Skip server certificate verification (dangerous, debug only). |
| `-H` / `--header` | `VMFLOW_HEADERS` (`;`-separated) | _(none)_ | Extra request header as `Name: Value` (repeatable). |

## Notes

- The older split binaries `relayd`, `relayctl`, and `relaytui` are still buildable for compatibility — they are thin shims over the same packages and read the same `VMFLOW_CONTROL_TOKEN` env var — but releases prefer the unified `vmflow` binary.
- Tunnel commands (`tunnel-server`, `tunnel-client`, `tunnel-ctl`) and certificate commands (`certs`, `certs-obtain`, `certs-review`) are **not enabled** in the current build.
