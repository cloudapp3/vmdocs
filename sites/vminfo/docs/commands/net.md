---
title: net
description: On-demand network diagnostics — DNS lookup, TCP port probe, ping, and public/IP geo lookup.
---

# `vminfo net`

Run one-off network diagnostics from the same binary you already use for host
metrics. Each subcommand prints human-readable output by default and accepts
`--json` for scripting.

Flags can appear before or after the positional target. These forms are
equivalent:

```bash
vminfo net ping --tcp-port 443 example.com
vminfo net ping example.com --tcp-port 443
```

Use `--` when a positional value begins with `-` and must not be interpreted as
a flag.

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
| `--server` | DNS server as `host` or `host:port`; a bare host uses port 53; empty = system default |
| `--json` | Write the result as JSON |

## `net port`

```bash
vminfo net port example.com 443
vminfo net port example.com 443 --timeout 3s --json
```

| Flag | Description |
| --- | --- |
| `host` / `port` | Target host and port (1–65535) |
| `--timeout` | Dial timeout, default `2s`; must be positive and at most `10s` |
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
| `--count` | Number of probes, default `4`; CLI range `1`-`100` |
| `--timeout` | Per-probe timeout, default `1s`; must be positive and at most `10s` |
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
- JSON results echo timing in `elapsed_ms`; ping reports sent/lost counts,
  packet-loss percentage, and min/average/max RTTs.
- A completed probe can represent connection or lookup failure in its `error`
  field. Scripts should inspect `error`, `open`, or loss fields instead of
  treating valid JSON alone as proof that the target is reachable.
- Invalid flags, ports, counts, modes, or timeout ranges are rejected before a
  probe starts.
- These diagnostics are also reachable from the web dashboard via
  [`POST /api/v1/net/diag`](/api#post-api-v1-net-diag).

The web endpoint is intentionally stricter than the CLI: requests must be
same-origin JSON, ping count is limited to `1`-`10`, and port/ping timeouts are
limited to `1`-`3000` milliseconds. This keeps a browser request from starting
an unexpectedly long diagnostic.

## Troubleshooting

- **ICMP unavailable:** use `--mode tcp`; ICMP support depends on platform and
  local privileges.
- **TCP reports loss:** confirm the chosen `--tcp-port`; a closed service is not
  proof that the host itself is offline.
- **Custom DNS fails:** pass `--server` as a resolver host or `host:port`, not as
  an `https://` URL.
- **IP lookup fails:** `net ip` depends on the configured HTTP service and the
  host's outbound network access. DNS, port, and ping do not call that service.

## Example

```bash
vminfo net ping example.com --tcp-port 443 --count 4 --json
```

## Related

- [HTTP API](/api)
- [Web dashboard](/guide/web-dashboard)
