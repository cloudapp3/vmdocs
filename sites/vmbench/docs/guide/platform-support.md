---
title: Platform Support
description: Linux, macOS, and Windows support boundaries for vmbench.
---

# Platform Support

| Capability | Linux | macOS | Windows |
|------------|:-----:|:-----:|:-------:|
| `vmbench run` core CLI | ✅ | ✅ | ✅ |
| TUI | ✅ | ✅ | ✅ |
| `sysinfo` | ✅ | ✅ | ✅ |
| JSON / HTML reports | ✅ | ✅ | ✅ |
| Compare reports | ✅ | ✅ | ✅ |
| Default external hardware tools | ✅ | ⚠️ install via package manager | ⚠️ use platform tools |
| `winsat` adapter | ❌ | ❌ | ✅ |
| Suite network diagnostics | ✅ | ✅ | ⚠️ partial / environment-dependent |
| MCP stdio server | ✅ | ✅ | ✅ |

Network-related suite sections depend on local DNS, firewall, routing, IPv6, and sandbox permissions. Failures should be preserved as structured errors.
