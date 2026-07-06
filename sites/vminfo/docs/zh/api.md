---
title: HTTP API
description: vminfo Web 仪表盘提供的只读 HTTP API 与 WebSocket 端点。
---

# HTTP API

`vminfo --web` 启动一个轻量、只读的 HTTP API 和仪表盘。

## 启动服务

```bash
vminfo --web
```

默认地址：

```text
http://127.0.0.1:20021
```

自定义地址：

```bash
vminfo --web --bind 0.0.0.0 --port 8080 --interval 1s
```

## 鉴权

默认情况下，仪表盘和 API 仅限本地访问、无需鉴权。

启用 `--token` 时：

```bash
vminfo --web --token
vminfo --web --token my-secret
```

- 裸 `--token` 自动生成一个 URL 安全的 token
- `--token my-secret` 使用固定 token
- 首次通过 `/?token=...` 成功访问后会设置 cookie，供后续请求使用
- `/healthz` 保持公开
- `/`、`/api/v1/*` 和 `/ws` 需要 token 或鉴权 cookie
- token 保护模式不会暴露宽松的 `Access-Control-Allow-Origin: *`
- WebSocket 请求必须使用与仪表盘主机一致的浏览器 origin

## 端点

### `GET /healthz`

Web 进程的公开健康检查。

```json
{
  "status": "ok",
  "ws_clients": 0
}
```

### `GET /api/v1/snapshot`

返回当前完整的仪表盘快照。

```json
{
  "timestamp": "2026-06-14T12:00:00Z",
  "system": {},
  "cpu": {},
  "memory": {},
  "disk": {},
  "network": {},
  "load": {},
  "processes": {},
  "health": {}
}
```

### `GET /api/v1/cpu`

返回 CPU 总量、每核使用率，以及内存中的短期 CPU 历史。

### `GET /api/v1/memory`

返回内存与 swap 的总量、使用量、可用量与百分比。

### `GET /api/v1/disk`

返回文件系统使用率与磁盘 I/O 速率。

### `GET /api/v1/network`

返回网络吞吐、TCP/UDP 连接数与网卡计数器。

在 Linux 上，响应还包含 TCP 状态分布（有多少 socket 处于 `ESTABLISHED`、`TIME_WAIT`、`SYN_RECV` 等）以及 conntrack 使用情况（当前 / 最大 `nf_conntrack` 条目），便于发现 socket 或连接跟踪饱和。

### `GET /api/v1/processes`

返回补全后的进程列表。

支持的查询参数：

| 参数 | 说明 |
| --- | --- |
| `filter` | 对 PID、PPID、名称、命令、用户或状态做大小写不敏感匹配 |
| `q` | `filter` 的别名 |
| `sort` | `cpu`、`mem`、`pid` 或 `name`；默认 `cpu` |
| `limit` | 返回的最大行数；`0` 或省略表示不限制 |

示例：

```bash
curl 'http://127.0.0.1:20021/api/v1/processes?filter=ssh&sort=mem&limit=10'
```

响应结构：

```json
{
  "total": 128,
  "list": [
    {
      "pid": 1234,
      "ppid": 1,
      "name": "sshd",
      "user": "root",
      "cpu_percent": 0.1,
      "mem_percent": 0.2,
      "rss": 12345678,
      "status": "S",
      "command": "sshd: user@pts/0",
      "threads": 1,
      "nice": 0,
      "uptime": 3600,
      "started_at_unix": 1781434800
    }
  ]
}
```

### `GET /api/v1/system`

返回主机元数据、OS/内核/架构、CPU 型号与核心数，以及运行时长。

### `GET /api/v1/health`

返回仪表盘使用的轻量健康评分与告警。

```json
{
  "score": 90,
  "warnings": [
    {
      "level": "warning",
      "code": "disk_high",
      "message": "disk usage is 88.5%"
    }
  ]
}
```

`code` 字段标识告警类型。与网络相关的 code 包括：

| Code | 含义 |
| --- | --- |
| `network_errors` | 持续的每网卡错误率（事件/秒，而非累计计数） |
| `network_drops` | 持续的每网卡丢包率 |
| `tcpconn_high` | TCP socket 数异常偏高（≥5000 警告 / ≥20000 严重） |
| `conntrack_high` | conntrack 表趋于填满（≥85% 警告 / ≥95% 严重，Linux） |

触发 `network_errors` / `network_drops` 的是速率而非原始计数，因此一个长期累积的总量不会让一台本来健康的主机一直被标记。

### `POST /api/v1/net/diag`

按需运行网络诊断 —— 与 [`net` 命令](/zh/net) 相同的探测，可从仪表盘调用。它挂在受保护的 mux 上，因此启用 token 鉴权时，它像其它 `/api/v1/*` 路由一样继承 token / cookie 和同源检查。

请求体：

| 字段 | 说明 |
| --- | --- |
| `action` | `dns`、`port`、`ping` 或 `ip` |
| `target` | 域名（dns）或主机（port/ping）；必填。对 `ip`，为要查询的 IP，留空表示查询本机公网 IP |
| `port` | 目标端口（port / ping） |
| `server` | 可选 DNS 服务器（dns）或 IP 查询服务 base URL（ip） |
| `timeout_ms` | 每次探测的超时（毫秒，port / ping） |
| `count` | 探测次数（ping） |
| `mode` | ping 模式：`tcp`（默认）或 `icmp` |

示例：

```bash
curl -X POST http://127.0.0.1:20021/api/v1/net/diag \
  -H 'Content-Type: application/json' \
  -d '{"action":"ping","target":"example.com","port":443,"count":4,"mode":"tcp"}'
```

响应结构对应 CLI 的 JSON 结果（`DNSResult`、`PortResult`、`PingResult` 或 `IPInfo`）。

### `GET /ws`

完整仪表盘快照的 WebSocket 流。

- 连接后立即发送最新快照
- 随采集器更新持续推送刷新后的快照
- 在 token 保护模式下，请求必须通过鉴权并满足同源检查

## 相关文档

- [Web 仪表盘指南](/zh/web-dashboard)
- [命令参考](/zh/commands)
