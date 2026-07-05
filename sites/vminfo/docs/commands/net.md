---
title: net
description: On-demand network diagnostics — DNS lookup, TCP port probe, ping, and public/IP geo lookup.
---

# `vminfo net`

Run one-off network diagnostics from the same binary you already use for host
metrics. Each subcommand prints human-readable output by default and accepts
`--json` for scripting.

## Subcommands

| Action | What it does |
| --- | --- |
| `net dns` | Resolve a domain to addresses |
| `net port` | Test TCP connectivity and latency to `host:port` |
| `net ping` | Probe a host with TCP-dial or ICMP RTTs |
| `net ip` | Look up public IP + ASN / geo info |

## `net dns`

```bash
vminfo net dns example.com
vminfo net dns example.com --server 1.1.1.1
vminfo net dns example.com --server 1.1.1.1 --json
```

| Flag | Description |
| --- | --- |
| positional domain | The domain to resolve (exactly one) |
| `--server` | DNS server as `host` or `host:port`; empty = system default |
| `--json` | Write the result as JSON |

## `net port`

```bash
vminfo net port example.com 443
vminfo net port example.com 443 --timeout 3s --json
```

| Flag | Description |
| --- | --- |
| `host` / `port` | Target host and port (1–65535) |
| `--timeout` | Dial timeout, default `2s` |
| `--json` | Write the result as JSON |

## `net ping`

```bash
vminfo net ping example.com                       # TCP ping, port 80
vminfo net ping example.com --tcp-port 443        # TCP ping on 443
vminfo net ping example.com --mode icmp           # real ICMP ping (needs privileges)
vminfo net ping example.com --count 6 --json
```

| Flag | Description |
| --- | --- |
| positional host | The host to probe (exactly one) |
| `--mode` | `tcp` (default) or `icmp` |
| `--count` | Number of probes, default `4` |
| `--timeout` | Per-probe timeout, default `1s` |
| `--tcp-port` | TCP target port, default `80` (tcp mode only) |
| `--json` | Write the result as JSON |

::: tip TCP vs ICMP
`tcp` mode does TCP-dial RTTs — it is cross-platform and unprivileged, so it
works anywhere. `icmp` mode sends real ICMP Echo packets via
`golang.org/x/net`; on Linux it needs `net.ipv4.ping_group_range` to grant the
unprivileged UDP ICMP socket, and it is unsupported on Windows. If ICMP is
unavailable, switch to `--mode tcp`.
:::

## `net ip`

```bash
vminfo net ip                       # your own public IP + ASN / geo
vminfo net ip 8.8.8.8               # look up a specific IP
vminfo net ip --json
```

| Flag | Description |
| --- | --- |
| positional ip | Optional IP to look up; omitted = your own public IP |
| `--server` | Lookup service base URL, default `https://ip.bestcheapvps.org` |
| `--json` | Write the result as JSON |

::: warning Outbound request
`net ip` makes an explicit, user-triggered request to a third-party lookup
service (`ip.bestcheapvps.org` by default) to fetch ASN, geo, and risk flags.
This is disclosed in `--help` and in the command output. It never runs
automatically — only when you ask for it.
:::

## Notes

- Human-readable output is localized; JSON output is stable and language-neutral.
- JSON results echo timing in `elapsed_ms` and surface errors in an `error` field.
- These diagnostics are also reachable from the web dashboard via
  [`POST /api/v1/net/diag`](/api#post-api-v1-net-diag).

## Example

```bash
vminfo net ping example.com --tcp-port 443 --count 4 --json
```

## Related

- [HTTP API](/api)
- [Web dashboard](/guide/web-dashboard)
