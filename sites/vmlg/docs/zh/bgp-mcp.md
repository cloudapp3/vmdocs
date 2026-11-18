---
title: BGP 拓扑与 MCP 排障
description: 配置 BIRD 2/3、FRRouting、GoBGP 驱动与 AI MCP 诊断服务。
---

# BGP 拓扑与 MCP 排障

## 1. 开启只读 BGP 驱动

在 `config.toml` 中开启 `[bgp]`（或启动参数传 `-bgp-driver bird` / 环境变量 `VMLG_BGP_DRIVER=bird`）：

```toml
[bgp]
enabled = true
driver = "bird" # bird | frr | gobgp | mock
router_asn = "AS64512"
bird_socket = "/run/bird/bird.ctl"

[bgp.communities]
"64512:100" = "Customer Route"
"64512:1000:1" = "HKIX Learned"
```

- **BIRD 2/3**：纯 Go 直连 Unix Socket 并首先发送 `restrict` 进入只读模式，零进程 fork 开销。
- **FRRouting / GoBGP**：固定参数调用 `vtysh -c "... json"` 与 `gobgp -j`。
- **演示模式**：执行 `vmlg serve -bgp-driver mock` 即可无路由器环境预览纯 SVG AS-Path 拓扑渲染。

## 2. Stdio MCP Server（`vmlg mcp`）

让大模型客户端直接调用全球多机房节点协助排查网络与 BGP 收敛问题：

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
