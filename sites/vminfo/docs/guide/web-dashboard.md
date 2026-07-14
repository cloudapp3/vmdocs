---
title: Web Dashboard
description: Run the read-only vminfo dashboard and API with token authentication, same-origin checks, and secure remote-access guidance.
---

# Web Dashboard

`vminfo --web` starts a lightweight, read-only HTTP API and dashboard with
switchable themes. Metrics stay in memory; there is no database or external
frontend service.

## Start the server

```bash
vminfo --web
```

Default address:

```text
http://127.0.0.1:20021
```

Custom address:

```bash
vminfo --web --bind 0.0.0.0 --port 8080 --interval 1s --token
```

Every non-loopback bind requires `--token`. Empty bind values, ports outside
`1`-`65535`, and non-positive intervals are rejected before startup.

You can also launch the TUI alongside the dashboard:

```bash
vminfo --web --tui
```

## Options

| Option | Default | Purpose |
| --- | --- | --- |
| `--bind <address>` | `127.0.0.1` | Listener address; non-loopback values require `--token` |
| `--port <number>` | `20021` | Listener port from `1` through `65535` |
| `--interval <duration>` | `3s` | In-memory metric refresh interval |
| `--token [value]` | off | Protect the dashboard; no value generates a random token |
| `--tui` | off | Run the interactive TUI alongside the web server |
| `--silent` | off | Suppress informational startup output |

Web-only options must be used together with `--web`.

## Authentication and exposure

By default, the dashboard and API listen on loopback and are unauthenticated.
Local unauthenticated mode accepts only `localhost` or loopback-IP Host headers,
which prevents a public hostname from reaching the dashboard through DNS
rebinding.

When `--token` is enabled:

```bash
vminfo --web --token
vminfo --web --token my-secret
```

- bare `--token` auto-generates a URL-safe token
- `--token my-secret` uses a fixed token
- the first successful `/?token=...` visit sets an `HttpOnly`, `SameSite=Lax`
  cookie and redirects to the same page without the token in the URL
- the cookie is marked `Secure` when the request is HTTPS, including when a
  trusted proxy sends `X-Forwarded-Proto: https`
- `/`, `/api/v1/*`, and `/ws` require the token or auth cookie
- a generated-token startup message includes a ready-to-open URL

::: warning Remote access
The built-in server uses HTTP. A token controls access but does not encrypt
traffic. For remote access, keep vminfo behind an HTTPS reverse proxy or use an
SSH tunnel. Do not expose its HTTP port directly to an untrusted network.
:::

See [Deployment](/guide/deployment) for loopback, SSH tunnel, reverse-proxy, and
private-network patterns.

## Same-origin enforcement

The server enforces browser same-origin access whether or not token auth is
enabled:

- REST requests and WebSocket upgrades with an `Origin` header must match the
  request scheme, host, and port
- permissive `Access-Control-Allow-Origin: *` is never emitted
- native clients without an `Origin` header remain supported
- an HTTPS reverse proxy must preserve `Host`, set `X-Forwarded-Proto: https`,
  and forward WebSocket upgrades on `/ws`

`POST /api/v1/net/diag` also requires `Content-Type: application/json`, accepts
a bounded request body, and validates the action, port, probe count, mode, and
timeout before starting work. Browser ping count is limited to `1`-`10` and
probe timeouts to `1`-`3000` milliseconds.

## Endpoints

| Endpoint | Purpose |
| --- | --- |
| `GET /api/v1/snapshot` | Full runtime snapshot |
| `GET /api/v1/cpu` | CPU data |
| `GET /api/v1/memory` | Memory and swap data |
| `GET /api/v1/disk` | Filesystem and disk I/O data |
| `GET /api/v1/network` | Network totals and interface data |
| `GET /api/v1/processes` | Process list |
| `GET /api/v1/system` | Host metadata |
| `GET /api/v1/health` | Health score and warnings |
| `POST /api/v1/net/diag` | Run a network diagnostic (dns / port / ping / ip) |
| `GET /ws` | Live snapshot stream |

See the full [HTTP API reference](/api) for payload examples and query parameters.

There is no separate public health endpoint. Use `GET /api/v1/health`; it is
protected whenever token authentication is enabled.

## Verify from the command line

Local mode:

```bash
curl -fsS http://127.0.0.1:20021/api/v1/health
```

Token mode accepts the token once as a query parameter:

```bash
curl -fsS "http://127.0.0.1:20021/api/v1/health?token=$VMINFO_WEB_TOKEN"
```

Routine browser requests and WebSocket connect/disconnect events stay quiet on
stdout. Startup failures and real server errors are still reported. `SIGINT`,
`SIGTERM`, or context cancellation closes the HTTP server and active WebSocket
clients.

## Themes

The dashboard ships with switchable themes from the header: **Auto**, **Neon**, **Light**, **Terminal**, and **Synthwave**. "Auto" follows the OS color scheme.

[JetBrains Mono](https://www.jetbrains.com/lp/mono/) is **embedded** in the binary, so the dashboard is fully self-contained — it renders with its intended monospaced typeface and works offline with no external font requests.

## Troubleshooting

- **`non-loopback web bind requires --token`:** add bare `--token` or a fixed
  token, then protect the HTTP transport with a trusted network or HTTPS proxy.
- **`forbidden host`:** local unauthenticated mode only accepts loopback or
  `localhost` Host headers. Use the local URL rather than a public hostname.
- **`forbidden origin`:** keep the page, REST API, and WebSocket on the same
  scheme, host, and port; verify proxy headers and WebSocket forwarding.
- **401 from an API:** provide `?token=...` once or reuse the authenticated
  browser cookie.
- **WebSocket does not update:** confirm that the proxy forwards `Upgrade` and
  `Connection` headers for `/ws`.
