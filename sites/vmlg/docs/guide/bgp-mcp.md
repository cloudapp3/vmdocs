---
title: BGP Drivers & MCP Server
description: Configure read-only BIRD 2/3, FRRouting, or GoBGP Looking Glass drivers and AI-assisted MCP diagnostics.
---

# BGP Drivers & MCP Server

## Pluggable Read-Only BGP Looking Glass

Enable `[bgp]` in `config.toml` (or pass `-bgp-driver` / `VMLG_BGP_DRIVER`) to activate the **BGP & AS-Path** tab with pure client-side SVG topology rendering:

```toml
[bgp]
enabled = true
driver = "bird" # "bird" | "frr" | "gobgp" | "mock"
router_asn = "AS64512"
bird_socket = "/run/bird/bird.ctl"

[bgp.communities]
"64512:100" = "Customer Route"
"64512:200" = "IXP Peer"
"64512:1000:1" = "HKIX Learned"
```

### Supported Daemons

- **`bird` (BIRD 2 / BIRD 3)**: Connects directly to `/run/bird/bird.ctl` over Unix domain socket and immediately issues `restrict` before running `show route for <target> all` or `show protocols`. Zero subprocess fork overhead.
- **`frr` (FRRouting)**: Executes fixed-argv `vtysh -c "show bgp ipv4|ipv6 unicast <target> json"` and parses structured RIB paths, LocalPref, MED, and Standard/Large Communities.
- **`gobgp` (GoBGP)**: Queries `gobgp -j global rib` and `gobgp -j neighbor`.
- **`mock`**: Built-in deterministic multi-path table for UI demos and testing (`vmlg serve -bgp-driver mock`).

## Stdio MCP Server (`vmlg mcp`)

Expose multi-region network and BGP diagnostics to AI assistants (Claude Desktop, Cursor, Antigravity, Codex) over JSON-RPC 2.0 `stdio`:

```json
{
  "mcpServers": {
    "vmlg": {
      "command": "vmlg",
      "args": ["mcp", "-hub-http", "https://lg.example.com"]
    }
  }
}
```

Omit `-hub-http` to run diagnostics directly from the local machine without opening any listening port.

### Exposed MCP Tools

- `vmlg_list_nodes` — List online nodes and capabilities
- `vmlg_ping` — Run ICMP or TCP Ping
- `vmlg_mtr` — Run multi-cycle MTR with carrier/IXP classification
- `vmlg_compare` — Broadcast concurrent Ping & return-route trace across all online nodes
- `vmlg_bgp_route` — Query BGP RIB paths, AS-Path, and communities
