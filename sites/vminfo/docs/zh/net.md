---
title: net
description: 按需网络诊断 —— DNS 解析、TCP 端口探测、ping 与公网 IP / 地理信息查询。
---

# `vminfo net`

用你已经在用的同一个二进制顺手做一次性网络诊断。每个子命令默认输出易读的文本结果，并支持 `--json` 以便脚本调用。

## 子命令

| 操作 | 作用 |
| --- | --- |
| `net dns` | 解析域名对应的地址 |
| `net port` | 测试到 `host:port` 的 TCP 连通性与延迟 |
| `net ping` | 用 TCP 拨号或 ICMP RTT 探测主机 |
| `net ip` | 查询公网 IP 及 ASN / 地理信息 |

## `net dns`

```bash
vminfo net dns example.com
vminfo net dns example.com --server 1.1.1.1
vminfo net dns example.com --server 1.1.1.1 --json
```

| 参数 | 说明 |
| --- | --- |
| 位置参数 domain | 要解析的域名（仅一个） |
| `--server` | DNS 服务器，格式为 `host` 或 `host:port`；留空表示使用系统默认 |
| `--json` | 以 JSON 输出结果 |

## `net port`

```bash
vminfo net port example.com 443
vminfo net port example.com 443 --timeout 3s --json
```

| 参数 | 说明 |
| --- | --- |
| `host` / `port` | 目标主机和端口（1–65535） |
| `--timeout` | 拨号超时，默认 `2s` |
| `--json` | 以 JSON 输出结果 |

## `net ping`

```bash
vminfo net ping example.com                       # TCP ping，端口 80
vminfo net ping example.com --tcp-port 443        # 在 443 端口上 TCP ping
vminfo net ping example.com --mode icmp           # 真正的 ICMP ping（需要权限）
vminfo net ping example.com --count 6 --json
```

| 参数 | 说明 |
| --- | --- |
| 位置参数 host | 要探测的主机（仅一个） |
| `--mode` | `tcp`（默认）或 `icmp` |
| `--count` | 探测次数，默认 `4` |
| `--timeout` | 每次探测的超时，默认 `1s` |
| `--tcp-port` | TCP 目标端口，默认 `80`（仅 tcp 模式） |
| `--json` | 以 JSON 输出结果 |

::: tip TCP 与 ICMP
`tcp` 模式测量 TCP 拨号的 RTT —— 它是跨平台、无需特权的，因此在哪里都能用。`icmp` 模式通过 `golang.org/x/net` 发送真正的 ICMP Echo 数据包；在 Linux 上需要配置 `net.ipv4.ping_group_range` 来授予非特权 UDP ICMP socket 权限，在 Windows 上不支持。如果 ICMP 不可用，请改用 `--mode tcp`。
:::

## `net ip`

```bash
vminfo net ip                       # 查询本机公网 IP 及 ASN / 地理信息
vminfo net ip 8.8.8.8               # 查询指定 IP
vminfo net ip --json
```

| 参数 | 说明 |
| --- | --- |
| 位置参数 ip | 可选，要查询的 IP；省略表示查询本机公网 IP |
| `--server` | 查询服务 base URL，默认 `https://ip.bestcheapvps.org` |
| `--json` | 以 JSON 输出结果 |

::: warning 外部请求
`net ip` 会显式地向第三方查询服务（默认 `ip.bestcheapvps.org`）发起一次由用户主动触发的请求，用于获取 ASN、地理信息以及风险标记。这一行为在 `--help` 和命令输出中都有明确告知。它绝不会自动运行 —— 只有在你主动请求时才会执行。
:::

## 说明

- 易读的文本输出会做本地化；JSON 输出是稳定的、与语言无关的。
- JSON 结果通过 `elapsed_ms` 回显耗时，并在 `error` 字段中呈现错误。
- 这些诊断也可以从 Web 仪表盘通过 [`POST /api/v1/net/diag`](/zh/api#post-api-v1-net-diag) 调用。

## 示例

```bash
vminfo net ping example.com --tcp-port 443 --count 4 --json
```

## 相关文档

- [HTTP API](/zh/api)
- [Web 仪表盘](/zh/web-dashboard)
