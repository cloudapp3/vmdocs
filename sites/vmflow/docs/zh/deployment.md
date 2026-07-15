---
title: 部署
description: 在生产环境运行 vmflow，使用回环管理、日志、指标、SSH 访问和原生系统服务。
---

# 部署

vmflow 作为长期运行的转发进程工作。管理通道仅监听回环地址，运维操作使用内置 CLI/TUI。

## 本地管理

守护进程的内部管理通道固定绑定 `127.0.0.1`，配置中只设置本地端口：

```yaml
control_port: 19090
```

受支持的管理入口是 `vmflow ctl` 和 `vmflow tui`。内部传输不作为公开集成 API。

## 远程管理

通过 SSH 转发回环端口，然后继续使用本机 CLI/TUI：

```bash
ssh -N -L 19090:127.0.0.1:19090 user@server
vmflow ctl rules
```

## 日志

选择适合你技术栈的格式：

```yaml
log:
  level: info
  format: json # text or json
```

`json` 最便于日志采集器；`text` 在终端中更友好。在服务管理器下，你也可以向守护进程传入 `-log-file`（在 Windows 上必填）。

## 指标

让同一主机上的 Prometheus 抓取回环指标监听器：

```yaml
scrape_configs:
  - job_name: vmflow
    static_configs:
      - targets: ['127.0.0.1:19090']
    metrics_path: /metrics
```

指标端点仅监听回环地址；请在同一主机运行 Prometheus，或通过 SSH tunnel 访问。

## 安全地重载

使用 `vmflow ctl reload` 应用配置变更。重载会先执行[预检](./precheck)，发现错误时不会部分应用。

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
ExecStart=/usr/local/bin/vmflow -config /etc/vmflow/config.yaml
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

- 累计流量计数器可选择持久化；活动连接数和速率仍只属于当前进程。
- 没有捆绑的 Web 仪表盘或多节点协调器。
- 目前不发布官方 Docker 镜像；如需开机启动，请使用内置的原生服务安装命令。
