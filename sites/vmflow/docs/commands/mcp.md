---
title: MCP Server
description: Connect Claude, Codex, and other MCP clients to a running vmflow daemon through a read-only stdio adapter.
---

# MCP Server

`vmflow mcp` starts a foreground, tools-only MCP server over stdio. It connects
to an already running vmflow daemon through the loopback management channel. It
does not start forwarding, listen on an MCP network port, or modify daemon
configuration.

## Requirements

- Run the MCP command on the same host as the vmflow daemon.
- Keep the daemon management listener on loopback.
- When authentication is enabled, use a dedicated viewer token through
  `VMFLOW_CONTROL_TOKEN`.

## Tools

| Tool | Purpose |
| --- | --- |
| `get_vmflow_status` | Connection, version, authorization, rule-count, traffic, and degraded-state summary |
| `list_forwarding_rules` | Filtered rule summaries without endpoint or source-policy details |
| `get_forwarding_rule` | Full configuration, running state, and statistics for one explicitly selected rule |
| `get_traffic_stats` | Filtered per-rule counters and aggregate totals |
| `run_config_precheck` | Read-only validation of the current persisted configuration |

All tools are read-only. List and precheck results default to 50 entries and
accept a maximum of 200. The adapter permits at most four concurrent tool calls.

## Viewer token

Configure a token dedicated to the MCP client:

```yaml
auth:
  enabled: true
  tokens:
    - name: mcp-viewer
      token: replace-with-a-long-random-token
      role: viewer
```

Prefer the environment variable over `-token`, which would expose the token in
the process command line.

## Claude Desktop

```json
{
  "mcpServers": {
    "vmflow": {
      "command": "/usr/local/bin/vmflow",
      "args": ["mcp"],
      "env": {
        "VMFLOW_CONTROL_TOKEN": "replace-with-a-long-random-token"
      }
    }
  }
}
```

## Codex

```toml
[mcp_servers.vmflow]
command = "/usr/local/bin/vmflow"
args = ["mcp"]
env = { VMFLOW_CONTROL_TOKEN = "replace-with-a-long-random-token" }
```

When the daemon uses a non-default management port, append `-addr` and the
loopback URL to `args`:

```json
"args": ["mcp", "-addr", "http://127.0.0.1:49127"]
```

`-addr` accepts only `localhost` or a loopback IP. For a daemon on another
machine, execute `vmflow mcp` on that machine, for example through SSH, instead
of exposing the management listener.

## Data boundary

Rule details can contain target addresses, source IP policies, domains, and
remarks. Traffic and precheck output can also reveal local network topology.
Tool results are sent to the model configured by the MCP client.

The MCP server exposes no configuration writes, raw YAML, bot tokens,
certificate private keys, shell execution, file access, prompts, or resources.
Precheck may resolve targets already present in the daemon configuration.

## Troubleshooting

- `connected: false`: the daemon is not reachable at the configured loopback
  address.
- HTTP `401`: set the correct viewer token in `VMFLOW_CONTROL_TOKEN`.
- Session endpoint unavailable: restart the daemon with the same vmflow release
  used to launch the MCP server.
- Custom TLS or mTLS: use the same `-tls-*` flags supported by `vmflow ctl` and
  `vmflow tui`.
