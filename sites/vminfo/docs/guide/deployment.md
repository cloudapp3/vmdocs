---
title: Deployment
description: Run the vminfo web dashboard locally, through an SSH tunnel, or behind an HTTPS reverse proxy without exposing it insecurely.
---

# Deployment

`vminfo --web` is a lightweight dashboard for one host. It is not a central
monitoring service and does not require a database. Choose an access model that
keeps the built-in HTTP server behind a trusted boundary.

## Local-only dashboard

The default is the safest deployment and needs no authentication:

```bash
vminfo --web
```

It listens on `127.0.0.1:20021`. Open `http://127.0.0.1:20021` on the same
machine, or query the API locally:

```bash
curl -fsS http://127.0.0.1:20021/api/v1/health
```

Unauthenticated mode only accepts `localhost` or loopback-IP Host headers. This
prevents a public hostname from reaching the local dashboard through DNS
rebinding.

## Remote access through SSH

For one-person administration, keep the server on loopback and create a tunnel:

```bash
# On the server
vminfo --web

# On your workstation
ssh -L 20021:127.0.0.1:20021 user@server
```

Then open `http://127.0.0.1:20021` on your workstation. The dashboard remains
unpublished on the server network.

## Remote access through an HTTPS reverse proxy

For a persistent browser endpoint, keep vminfo on loopback and place an HTTPS
reverse proxy on the same host:

```bash
vminfo --web --bind 127.0.0.1 --port 20021 --token
```

Bare `--token` generates a random token and prints a ready-to-open URL. A fixed
secret is also accepted:

```bash
vminfo --web --bind 127.0.0.1 --port 20021 --token "$VMINFO_WEB_TOKEN"
```

Configure the proxy to:

- terminate TLS and forward requests to `127.0.0.1:20021`
- preserve the original `Host` header
- set `X-Forwarded-Proto: https`
- support WebSocket upgrades on `/ws`
- keep the dashboard and API on the same origin

The first successful `/?token=...` visit stores the token in an `HttpOnly`,
`SameSite=Lax` cookie and redirects to a URL without the token. When the request
scheme is HTTPS, including through a proxy that sets `X-Forwarded-Proto`, the
cookie is also marked `Secure`.

::: warning Transport security
The built-in server speaks HTTP. A token controls access but does not encrypt
traffic. Never expose its port directly to the public internet; terminate HTTPS
at a trusted proxy or use an SSH tunnel.
:::

## Direct private-network binding

If a trusted private network requires direct access, a non-loopback bind always
requires a token:

```bash
vminfo --web --bind 0.0.0.0 --port 20021 --token
```

Starting a non-loopback listener without `--token` fails immediately. Firewall
the port to the intended source network and remember that the connection is
still unencrypted HTTP.

## Browser and API protections

The web server applies the same-origin policy in both authenticated and local
modes:

- REST requests and WebSocket upgrades with an `Origin` header must match the
  request scheme, host, and port
- permissive `Access-Control-Allow-Origin: *` is never emitted
- token-protected pages, `/api/v1/*`, and `/ws` require the token or auth cookie
- native clients without an `Origin` header remain supported
- network-diagnostic requests are size-bounded, require JSON, and enforce short
  probe limits

## Process supervision

Run vminfo under the supervisor already used on the host, such as systemd,
launchd, or a container runtime. The supervisor should:

- run the process as a non-root account when host permissions allow it
- restart it after unexpected exits
- send `SIGTERM` for graceful shutdown
- keep a fixed token outside command history when a token is required
- bind the backend to loopback when an HTTPS proxy is in front

vminfo does not currently install a service definition for you. Keep any local
unit or container configuration under your own deployment management.

## Verify the deployment

For loopback mode:

```bash
curl -fsS http://127.0.0.1:20021/api/v1/health
```

For token mode, pass the token once as a query parameter or use the cookie set
by the browser:

```bash
curl -fsS "http://127.0.0.1:20021/api/v1/health?token=$VMINFO_WEB_TOKEN"
```

There is no separate public health endpoint. Treat `/api/v1/health` as protected
whenever token authentication is enabled.

## Related

- [Web dashboard](/guide/web-dashboard)
- [HTTP API](/api)
- [Installation](/guide/installation)
- [Update command](/commands/update)
