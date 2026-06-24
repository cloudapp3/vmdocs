---
title: Command Reference
description: CLI command overview for vmbench.
---

# Command Reference

| Command | Purpose |
| --- | --- |
| `vmbench` | Launch interactive TUI |
| `vmbench run [flags]` | Run raw workload benchmarks |
| `vmbench suite [flags]` | Run VPS composite suite sections |
| `vmbench list` | List available workloads |
| `vmbench sysinfo [--json]` | Show system information |
| `vmbench compare <a.json> <b.json>` | Compare two reports |
| `vmbench ecs-diff [--json]` | Show maintained vmbench vs ECS / GoECS product gap snapshot |
| `vmbench mcp serve --transport stdio` | Expose local MCP tools for LLM clients |
| `vmbench version` | Show version metadata |

## Common examples

```bash
vmbench run --json report.json --html report.html
vmbench suite --preset quick
vmbench suite --only ping,mail
vmbench compare before.json after.json
vmbench mcp serve --transport stdio
```

## Suite presets

| Preset | Sections | Scenario |
| --- | --- | --- |
| `quick` | `hardware,speed,ip_quality` | Fast VPS overview |
| `website` | `hardware,route,ping,speed,ip_quality,mail` | Website/server hosting |
| `proxy` | `route,ping,speed,ip_quality,media` | Proxy / unlock |
| `mail` | `route,ip_quality,mail` | Mail server |
