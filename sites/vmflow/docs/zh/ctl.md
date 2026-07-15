---
title: vmflow ctl
description: 通过受支持的 CLI 查询并管理运行中的 vmflow。
---

# vmflow ctl

```bash
vmflow ctl [-token TOKEN] <subcommand>
```

别名：`vmflow c`。

`ctl` 是本机守护进程受支持的命令接口。启用认证时使用 `-token`（或 `VMFLOW_CONTROL_TOKEN`）。

## 子命令

| 子命令 | 说明 |
| --- | --- |
| `rules` | 列出运行中的规则。 |
| `stats` | 显示每条规则的流量计数器。 |
| `metrics` | 输出 Prometheus 文本指标。 |
| `precheck` | 校验当前配置但不应用。 |
| `reload` | 预检后重载并重新应用配置。 |

## 示例

```bash
vmflow ctl rules
vmflow ctl stats
vmflow ctl precheck
vmflow ctl reload
vmflow ctl -token change-me reload
```

::: tip
当启用认证时，会修改状态的子命令（`reload`）需要 `admin` 令牌。只读子命令使用 `viewer` 令牌即可。
:::
