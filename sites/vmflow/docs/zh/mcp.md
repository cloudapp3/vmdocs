---
title: MCP 服务器
description: 通过只读 stdio 适配器，将 Claude、Codex 等 MCP 客户端连接到运行中的 vmflow 守护进程。
---

# MCP 服务器

`vmflow mcp` 会在前台通过 stdio 启动一个仅提供 Tools 的 MCP 服务器，并通过
回环管理通道连接已经运行的 vmflow 守护进程。它不会启动转发、监听新的 MCP
网络端口，也不会修改守护进程配置。

## 使用条件

- 在 vmflow 守护进程所在的同一台主机上运行 MCP 命令。
- 保持守护进程管理监听器仅绑定回环地址。
- 启用认证时，通过 `VMFLOW_CONTROL_TOKEN` 使用专门的 viewer token。

## 工具

| 工具 | 用途 |
| --- | --- |
| `get_vmflow_status` | 返回连接、版本、鉴权、规则数量、流量和 degraded 状态摘要 |
| `list_forwarding_rules` | 返回经过筛选的规则摘要，不包含端点和来源策略详情 |
| `get_forwarding_rule` | 返回一条明确指定规则的完整配置、运行状态和统计 |
| `get_traffic_stats` | 返回经过筛选的逐规则计数器和汇总值 |
| `run_config_precheck` | 只读检查当前持久化配置 |

所有工具均为只读。规则列表和预检结果默认最多返回 50 条，允许的最大值为
200；适配器最多同时执行 4 个工具调用。

## Viewer Token

为 MCP 客户端配置独立 token：

```yaml
auth:
  enabled: true
  tokens:
    - name: mcp-viewer
      token: replace-with-a-long-random-token
      role: viewer
```

优先使用环境变量，不要使用会把 token 暴露在进程命令行中的 `-token`。

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

守护进程使用非默认管理端口时，在 `args` 中追加 `-addr` 和回环 URL：

```json
"args": ["mcp", "-addr", "http://127.0.0.1:49127"]
```

`-addr` 只接受 `localhost` 或回环 IP。对于另一台主机上的守护进程，应在目标
主机上执行 `vmflow mcp`，例如通过 SSH 启动，而不是公开管理监听器。

## 数据边界

规则详情可能包含目标地址、来源 IP 策略、域名和备注；流量及预检结果也可能
暴露本地网络拓扑。工具结果会发送给 MCP 客户端所配置的模型。

MCP 服务器不提供配置写入、原始 YAML、Bot Token、证书私钥、Shell 执行、
文件访问、Prompts 或 Resources。预检可能解析守护进程配置中已经存在的目标。

## 排错

- `connected: false`：守护进程无法通过所配置的回环地址访问。
- HTTP `401`：在 `VMFLOW_CONTROL_TOKEN` 中设置正确的 viewer token。
- session 端点不可用：使用与 MCP 服务器相同的 vmflow 版本重启守护进程。
- 自定义 TLS 或 mTLS：使用 `vmflow ctl`、`vmflow tui` 支持的相同 `-tls-*`
  参数。
