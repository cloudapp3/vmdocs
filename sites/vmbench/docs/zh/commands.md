---
title: 命令参考
description: vmbench 常用命令参考。
---

# 命令参考

| 命令 | 用途 |
| --- | --- |
| `vmbench` | 启动交互式 TUI |
| `vmbench run [flags]` | 运行原始 workload benchmark |
| `vmbench suite [flags]` | 运行 VPS 综合 suite |
| `vmbench list` | 列出 workload |
| `vmbench sysinfo --json` | 输出系统信息 |
| `vmbench compare <a.json> <b.json>` | 对比两份报告 |
| `vmbench ecs-diff --json` | 输出 ECS / GoECS 对标差异快照 |
| `vmbench mcp serve --transport stdio` | 暴露 MCP stdio tools |
| `vmbench version` | 输出版本 |

常用 suite 参数：

```bash
vmbench suite --preset quick
vmbench suite --preset website
vmbench suite --only ping,mail
vmbench suite --skip media
vmbench suite --ip-version v4|v6|dual
```
