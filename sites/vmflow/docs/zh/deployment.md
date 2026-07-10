---
title: 部署
description: 将 vmflow 作为守护进程在生产环境中运行——控制 API 暴露、认证、TLS/mTLS、日志、指标，以及原生服务设置。
---

# 部署

vmflow 作为一个长期运行的守护进程运行，对外暴露一个本地控制 API。本页涵盖在主机上运行它的各种实际问题。

## 让控制 API 保持在回环地址

默认的 `control_listen_addr` 是 `127.0.0.1:19090`。当 `auth.enabled: false` 时，控制 API 会把每个请求都视为匿名的 admin 级别调用方——这仅在回环地址上才安全。

如果控制 API 绑定到非回环地址（`0.0.0.0`、`::`、非回环 IP，或 `:port`）且没有任何保护，守护进程会**拒绝启动**。这是一种 fail-closed（失败即关闭）设计：防止意外暴露一个未认证的远程控制端点。若要绑定到非回环地址，需满足以下任一条件：

1. `auth.enabled: true` 且至少有一个令牌，**或者**
2. 通过 `control_tls.client_ca_file` 启用双向 TLS（客户端必须出示证书），**或者**
3. 向守护进程传入 `-insecure-allow-remote-control` 以明确确认风险。

## 暴露到本机之外

当你需要从另一台主机访问控制 API 时，请选择一种安全方案。

### 方案 A——Bearer 令牌认证

```yaml
control_listen_addr: 0.0.0.0:19090
auth:
  enabled: true
  tokens:
    - name: admin
      token: <long-random-secret>
      role: admin
    - name: viewer
      token: <another-random-secret>
      role: viewer
```

任何会修改状态的调用（`reload`）请使用 `admin` 令牌。只读调用使用 `viewer` 令牌即可。

### 方案 B——TLS / 双向 TLS（推荐）

在控制 API 本身终结 TLS，并且为了最强的安全姿态，要求客户端证书：

```yaml
control_listen_addr: 0.0.0.0:19090
control_tls:
  cert_file: /etc/vmflow/server.pem
  key_file:  /etc/vmflow/server.key
  client_ca_file: /etc/vmflow/client-ca.pem   # mTLS — satisfies the startup check
  min_version: "1.2"
```

随后客户端使用 `-tls-ca-file`、`-tls-client-cert`、`-tls-client-key` 连接（参见[通用客户端参数](./commands#common-client-flags)）。这是在 Cloudflare Tunnel 之后暴露控制 API 且不开放任何入站端口的推荐方式。参见 [HTTP API → TLS 与双向 TLS](./api#tls-and-mutual-tls)。

另见 [HTTP API → 认证](./api#authentication)。

## 日志

选择适合你技术栈的格式：

```yaml
log:
  level: info
  format: json # text or json
```

`json` 最便于日志采集器；`text` 在终端中更友好。在服务管理器下，你也可以向守护进程传入 `-log-file`（在 Windows 上必填）。

## 指标

让 Prometheus 指向控制 API：

```yaml
scrape_configs:
  - job_name: vmflow
    static_configs:
      - targets: ['127.0.0.1:19090']
    metrics_path: /metrics
```

暴露的指标族参见 [HTTP API → Metrics](./api#get-metrics)。

## 安全地重载

配置变更通过 `POST /v1/reload`（或 `vmflow ctl reload`）进行。重载会先运行[预检](./precheck)，一旦出现任何错误就拒绝变更，使正在运行的规则保持不变。目前还没有优雅排空窗口——已连接到被删除/变更规则的现有连接不会被迁移。

## 作为原生服务运行

将 vmflow 注册到操作系统的服务管理器，使其开机自启并在崩溃后重启：

```bash
# installs + enables + starts a systemd unit / launchd plist / Windows Service
sudo vmflow service install
```

这是推荐的做法——参见 [`vmflow service`](./service) 了解各参数（配置路径、运行用户、日志文件、额外参数）。`vmflow service status` / `vmflow service uninstall` 用于查询和移除它。

如果你更愿意自己管理该单元，下面是一个可改造的可用 systemd 示例：

```ini
[Unit]
Description=vmflow L4 forwarding daemon
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
ExecStart=/usr/local/bin/vmflow daemon -config /etc/vmflow/config.yaml
ExecReload=/usr/local/bin/vmflow ctl reload
Restart=on-failure
RestartSec=3

[Install]
WantedBy=multi-user.target
```

编辑后重载配置：

```bash
sudo vmflow ctl reload
# or, with a hand-written unit that wires ExecReload:
sudo systemctl reload vmflow
```

如需完整拆除（服务 + 二进制 + 配置 + 日志 + 证书 + 更新缓存），请使用 [`vmflow uninstall`](./uninstall)。

## 当前限制

- 统计数据**仅存于内存中**；没有内置的历史聚合。
- 没有捆绑的 Web 仪表盘或多节点协调器。
- release 归档中暂无官方 Docker 镜像（可使用原生服务安装，以及 `.deb`/`.rpm` 软件包）。
