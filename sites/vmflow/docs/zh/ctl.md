---
title: vmflow ctl
description: 查询并控制一个运行中的 vmflow 守护进程——health、rules、stats、metrics、precheck、reload。
---

# vmflow ctl

```bash
vmflow ctl [-addr http://127.0.0.1:19090] [-token TOKEN] <subcommand>
```

别名：`vmflow c`。

`ctl` 是[控制 API](./api) 之上的一个薄客户端。它通过 `-addr` 定位守护进程，并在启用认证时使用 `-token`（或 `VMFLOW_CONTROL_TOKEN`）进行认证。完整的共享客户端参数集合——包括 TLS/mTLS 和自定义请求头——列于[通用客户端参数](./commands#common-client-flags)。

## 子命令

| 子命令 | 对应接口 | 说明 |
| --- | --- | --- |
| `health` | `GET /healthz` | 守护进程健康状态和运行中规则数。 |
| `rules` | `GET /v1/rules` | 列出运行中的规则。 |
| `stats` | `GET /v1/stats` | 每条规则的流量计数器（内存快照）。 |
| `metrics` | `GET /metrics` | Prometheus 文本格式输出。 |
| `precheck` | `POST /v1/precheck` | 校验当前配置但不应用。 |
| `reload` | `POST /v1/reload` | 在预检之后重载配置并重新应用。 |

## 示例

```bash
vmflow ctl health
vmflow ctl rules
vmflow ctl stats
vmflow ctl reload
vmflow ctl -token change-me reload

# against a TLS-protected control API using a private CA and mTLS client cert
vmflow ctl -addr https://10.0.0.5:19090 \
  -tls-ca-file ca.pem -tls-client-cert client.pem -tls-client-key client.key \
  reload

# send an extra header (e.g. a Cloudflare Access service token)
vmflow ctl -H "CF-Access-Client-Id: xxx" -H "CF-Access-Client-Secret: yyy" reload
```

::: tip
当启用认证时，会修改状态的子命令（`reload`）需要 `admin` 令牌。只读子命令使用 `viewer` 令牌即可。
:::
