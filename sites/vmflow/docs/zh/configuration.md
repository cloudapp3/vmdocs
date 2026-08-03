---
title: 配置
description: vmflow YAML 配置参考，涵盖本地管理、日志、认证、统计、转发规则和来源 IP 访问策略。
---

# 配置

vmflow 由单个 YAML 文件驱动。`vmflow run` 默认读取平台用户配置路径：

```bash
vmflow run
```

需要时可明确覆盖路径：

```bash
vmflow run -config /path/to/config.yaml
```

重载时会重新读取当前生效的配置路径并应用新的期望状态（参见[规则与生命周期](./rules)）。

## 完整示例

```yaml
version: 1
language: zh-CN
control_port: 19090
udp_max_sessions: 256

log:
  level: info
  format: text # text or json

stats:
  persist: false
  flush_interval: 60s

# 管理通道固定监听 127.0.0.1，配置中只设置端口。
# The CLI/TUI can pass the token with -token or VMFLOW_CONTROL_TOKEN.
auth:
  enabled: false
  tokens:
    - name: admin
      token: change-me
      role: admin

rules:
  - rule_id: ssh-forward
    name: ssh-forward
    protocol: tcp
    listen_addr: 0.0.0.0
    listen_port: 2201
    target_addr: 127.0.0.1
    target_port: 22
    enabled: true
    bandwidth_limit:
      rate: 100 Mbps
    traffic_quota:
      daily: 100 GB
      monthly: 1 TB
      timezone: Asia/Shanghai
      action: block
    speed_limit: 0 # 旧版单连接 B/s 限速
    max_conn: 0
    source_ip_mode: allowlist
    source_ips:
      - 203.0.113.8
      - 198.51.100.0/24
      - 2001:db8:100::/48
    remark: example
```

## 顶层字段

| 字段 | 说明 |
| --- | --- |
| `version` | 配置 schema 版本。目前为 `1`。 |
| `language` | CLI/TUI 语言：`en` 或 `zh-CN`。 |
| `control_port` | 本地管理端口，默认 `19090`；监听主机固定为 `127.0.0.1`。 |
| `udp_max_sessions` | 进程级活动 UDP 会话上限，默认 `256`，最大 `4096`。 |
| `log` | 结构化日志——`level` 和 `format`。 |
| `stats` | 可选的累计统计持久化；配额状态始终持久化。 |
| `auth` | 带有 `admin` / `viewer` 角色的 Bearer 令牌认证。 |
| `bot_token`, `bot_chat` | Telegram bot——参见 [Telegram Bot](./telegram-bot)。 |
| `rules` | 转发规则（见下文 `rules[]`）。 |

## `log`

| 字段 | 取值 |
| --- | --- |
| `level` | 日志级别（例如 `debug`、`info`、`warn`、`error`）。 |
| `format` | `text` 或 `json`。 |

## `auth`

供 CLI/TUI 管理使用的 Bearer token 认证。

| 字段 | 说明 |
| --- | --- |
| `enabled` | 要求本地管理工具使用已配置的 token。 |
| `tokens[].name` | 令牌的标签（不用于认证）。 |
| `tokens[].token` | Bearer 令牌字符串。 |
| `tokens[].role` | `admin`（读 + 写）或 `viewer`（只读）。 |

## `rules[]`

每个条目描述一条转发规则。

| 字段 | 说明 |
| --- | --- |
| `rule_id` | 稳定的唯一 ID，用于在重载之间进行 diff。 |
| `name` | 人类可读的名称。 |
| `protocol` | `tcp`、`udp` 或 `tcp+udp`。 |
| `listen_addr` | 要监听的地址（例如 `0.0.0.0`）。 |
| `listen_port` | 要监听的端口。 |
| `target_addr` | 要转发到的上游地址。 |
| `target_port` | 上游端口。 |
| `enabled` | 如果为 `false`，该规则会保留在配置中，但不会启动。 |
| `bandwidth_limit` | 规则汇总限速：共享 `rate`，或分方向 `upload` / `download`。 |
| `traffic_quota` | 上传 + 下载合并的 `daily` / `monthly` 额度、`timezone` 与 `action`。 |
| `speed_limit` | 每连接的速率限制，单位为 bytes/sec（`0` = 不限制）。 |
| `max_conn` | 最大并发连接数（`0` = 不限制）。超过上限的新连接会被关闭。 |
| `idle_timeout` | 每连接的空闲超时，单位为秒（`0` = 默认 5 分钟）。修改此项会重启该规则。 |
| `source_ip_mode` | 来源 IP 准入模式：`off`、`allowlist` 或 `denylist`；省略时为 `off`。 |
| `source_ips` | 当前模式使用的 IPv4/IPv6 字面地址或 CIDR；每条规则最多 256 项。 |
| `remark` | 自由格式的备注。 |

## 来源 IP 访问策略

`allowlist` 只接受命中 `source_ips` 的来源；`denylist` 拒绝命中的来源并允许其余来源。启用白名单或黑名单时至少需要一项；域名、错误地址、空项以及超过 256 项的列表都会被拒绝。

TCP 会在占用 `max_conn` 和连接目标端之前检查 socket 对端；UDP 会在创建会话、占用单规则或全局 UDP 配额之前检查。修改模式或有效条目会重启该规则，并关闭既有 TCP 连接和 UDP 会话，使新策略立即生效。

策略看到的是真实 socket 对端。经过 NAT 或四层代理时，它可能是网关或代理地址，而不是原始客户端。vmflow 不信任 HTTP 转发头或 PROXY protocol 元数据。应继续使用云防火墙、安全组或主机防火墙作为流量攻击的第一层防护。

## 规则共享限速与流量配额

`bandwidth_limit` 限制整个 `rule_id` 的汇总流量；该规则下的所有 TCP 连接和 UDP 会话共享分方向令牌桶，`tcp+udp` 的两个协议也共享。使用 `rate` 可同时设置上传和下载，或省略 `rate` 后分别配置 `upload`、`download`；未配置的方向不限速。突发容量由 vmflow 自动计算，不提供 `burst` 配置项。

速率单位区分大小写。`bps`、`Kbps`、`Mbps`、`Gbps`、`Tbps` 表示每秒比特；`B/s`、`KB/s`、`MB/s`、`GB/s`、`KiB/s`、`MiB/s` 等表示每秒字节。为兼容旧配置，纯整数仍按 B/s 解释；`100M` 等含糊写法会被拒绝。

`traffic_quota.daily` 和 `traffic_quota.monthly` 将成功上传与下载的业务数据合并计入同一额度。支持十进制 `KB`/`MB`/`GB`/`TB`、二进制 `KiB`/`MiB`/`GiB`/`TiB`，以及旧版纯字节整数。`timezone` 使用 IANA 时区确定日/月自然周期边界。`action` 可省略，默认且目前唯一支持的值是 `block`。

即使 `stats.persist` 为 false，配额状态也会持久化。状态存放在统计文件或配置旁的 `quota-state.json`；无法读取或写入时会失败关闭。重启以及删除后用同一 `rule_id` 重新添加规则，都不会清空当前周期用量；额度在下一个自然日或自然月自动恢复。

## 进程级设置与 DNS

`language` 只接受 `en` 或 `zh-CN`。`udp_max_sessions` 限制全部规则合计的活动 UDP 会话数，并支持 reload。`stats.persist` 控制累计统计计数是否持久化，配额执行不依赖该开关。

DNS 容错没有配置项。目标检查和出站转发先使用操作系统 DNS，遇到超时或网络错误时依次尝试 `223.5.5.5:53`、`119.29.29.29:53`。明确的 `NXDOMAIN` 不会触发 fallback，字面 IP 目标则完全绕过 DNS。

::: tip
`http` 和 `https` 协议在源码中存在，但在当前构建中被禁用。它们会在校验时被拒绝。参见[转发参考](./forwarding)。
:::

## 其他字段

除上述小节外，配置还接受 Telegram bot 和预留的 ACME/证书字段。有效的 bot 设置参见 [Telegram Bot](./telegram-bot)。

| 字段 | 状态 |
| --- | --- |
| `bot_token`, `bot_chat` | 已启用——参见 [Telegram Bot](./telegram-bot)。 |
| `acme_*`, `cert_cache_dir`, `cert_review.*` | 预留（当前构建中被忽略）。 |
