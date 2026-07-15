---
title: HTTP API
description: vmflow 本地控制 API——认证、TLS/mTLS、health、rules、stats、precheck、reload 以及 Prometheus 指标。
---

# HTTP API

> **内部本地接口,非对外 API。** 控制 API 只监听 `127.0.0.1:19090`,供本机 CLI/TUI(`vmflow ctl`、`vmflow tui`)使用,不作为对外公开接口。日常操作请走 CLI/TUI;下面的端点与 `curl` 示例仅供本机工具与调试参考。

守护进程暴露一个本地控制 API。默认监听地址为 `127.0.0.1:19090`。CLI 和 TUI 都是这些端点之上的薄客户端。

## 认证 {#authentication}

控制 API 支持带两种角色的 Bearer 令牌认证。

```yaml
auth:
  enabled: true
  tokens:
    - name: admin
      token: change-me
      role: admin
    - name: viewer
      token: view-only
      role: viewer
```

```bash
# 仅本机调试——日常请用 `vmflow ctl` / `vmflow tui`
curl -H "Authorization: Bearer change-me" http://127.0.0.1:19090/v1/stats
```

```bash
vmflow ctl -token change-me stats
VMFLOW_CONTROL_TOKEN=change-me vmflow tui
```

| 角色 | 允许的操作 |
| --- | --- |
| `viewer` | 只读端点：`health`、`rules`、`stats`、`metrics`。 |
| `admin` | `viewer` 能做的一切，再加上 `reload`。 |

令牌以常数时间进行比较。当 `auth.enabled: false` 时，请求会被视为匿名的 admin 级别调用方——仅在回环地址上才安全。

在禁用认证的情况下绑定到非回环地址会**拒绝启动**（fail-closed）。请绑定到 `127.0.0.1`、启用 `auth`、启用双向 TLS（`control_tls.client_ca_file`），或向守护进程传入 `-insecure-allow-remote-control` 以重新启用。来自单个对端 IP 的反复认证失败（1 分钟内 10 次）会被限流并返回 HTTP `429`，且锁定一分钟；这是尽力而为的机制（按对端 IP 统计，重启后重置）。

## TLS 与双向 TLS {#tls-and-mutual-tls}

控制 API 可以通过 TLS 提供服务，并可选择要求客户端证书（双向 TLS）。在 `control_tls` 下配置：

```yaml
control_listen_addr: 0.0.0.0:19090
control_tls:
  cert_file: /etc/vmflow/server.pem
  key_file:  /etc/vmflow/server.key
  client_ca_file: /etc/vmflow/client-ca.pem   # optional → enables mTLS
  min_version: "1.2"                           # "1.2" (default) or "1.3"
```

- 当 `cert_file` 和 `key_file` **都**设置时 TLS 生效。
- 设置 `client_ca_file` 会开启**双向 TLS**：每个客户端都必须出示一张由该 CA 签名的证书。mTLS 也满足上文所述的非回环启动安全检查。
- 客户端通过 `-tls-ca-file`、`-tls-client-cert`、`-tls-client-key`（或 `VMFLOW_TLS_*` 环境变量）传入其 CA 包和客户端证书。参见[通用客户端参数](./commands#common-client-flags)。

mTLS 是在不开放入站端口的情况下，把控制 API 暴露到回环之外（例如在 Cloudflare Tunnel 之后）的推荐方式。

## `GET /healthz`

守护进程健康状态。

```json
{
  "ok": true,
  "running_rules": 1,
  "time": 1760000000
}
```

## `GET /v1/rules`

运行中的规则。

```json
{
  "items": [
    {
      "rule_id": "ssh-forward",
      "name": "ssh-forward",
      "protocol": "tcp",
      "listen_addr": "0.0.0.0",
      "listen_port": 2201,
      "target_addr": "127.0.0.1",
      "target_port": 22,
      "enabled": true
    }
  ]
}
```

## `GET /v1/stats`

每条规则的内存计数器。

```json
{
  "items": [
    {
      "rule_id": "ssh-forward",
      "upload_bytes": 1024,
      "download_bytes": 2048,
      "conns": 1,
      "updated_time": 1760000000
    }
  ]
}
```

## `GET|POST /v1/precheck`

在**不应用**的情况下校验当前配置。`reload` 会运行相同的检查；任何错误都会拒绝重载。

检查项：规则校验、重复的 `rule_id`、监听器冲突、监听端口可绑定性、目标 DNS 解析，以及低端口特权警告。（HTTPS 域名和 ACME 检查在当前构建中已禁用。）

```bash
vmflow ctl precheck
```

```json
{
  "config_path": "./examples/config.yaml",
  "rule_count": 1,
  "result": {
    "ok": true,
    "error_count": 0,
    "warning_count": 0,
    "checked_rules": 1,
    "checked_time_ms": 1,
    "items": []
  }
}
```

完整的检查项列表参见[预检](./precheck)。

## `GET /metrics`

Prometheus 文本格式输出。示例：

```text
vmflow_rule_upload_bytes_total{rule_id="ssh-forward",protocol="tcp"} 1024
vmflow_rule_download_bytes_total{rule_id="ssh-forward",protocol="tcp"} 2048
vmflow_rule_connections{rule_id="ssh-forward",protocol="tcp"} 1
vmflow_control_requests_total{method="GET",path="/v1/stats",status="200"} 10
vmflow_reload_total{status="ok"} 1
vmflow_rule_apply_total{action="started",status="ok"} 1
```

指标族：

- `vmflow_build_info`
- `vmflow_uptime_seconds`
- `vmflow_rule_running{rule_id,protocol}`
- `vmflow_rule_connections{rule_id,protocol}`
- `vmflow_rule_upload_bytes_total{rule_id,protocol}`
- `vmflow_rule_download_bytes_total{rule_id,protocol}`
- `vmflow_control_requests_total{method,path,status}`
- `vmflow_control_request_duration_seconds_sum{method,path,status}`
- `vmflow_reload_total{status}`
- `vmflow_rule_apply_total{action,status}`

## `POST /v1/reload`

重新读取配置文件，并在预检之后运行 `ApplySnapshot(replace_all=true)`。

```json
{
  "config_path": "./examples/config.yaml",
  "control_listen_addr": "127.0.0.1:19090",
  "rule_count": 1,
  "result": {
    "applied_rules": 1,
    "stopped_rules": 0,
    "failed_rules": 0,
    "total_rules": 1,
    "items": []
  }
}
```

::: warning 已禁用的端点
`/v1/certs*` 证书端点存在于源码中，但在当前构建中**未注册**（HTTPS/ACME 已禁用）。
:::
