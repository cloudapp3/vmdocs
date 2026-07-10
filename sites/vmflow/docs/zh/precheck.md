---
title: 预检
description: 在应用 vmflow 配置之前先校验它——重复 ID、监听器冲突、端口可绑定性，以及 DNS 解析。
---

# 预检

预检会在**不应用配置的情况下**对其进行校验。它会在每次 `reload` 之前自动运行，你也可以按需运行它，以便安全地对配置变更做一次健全性检查。

## 运行它

```bash
vmflow ctl precheck
```

或通过 API：`GET|POST /v1/precheck`。

## 它检查什么

预检会产出一组发现，每条要么是一个 **error（错误）**，要么是一个 **warning（警告）**。错误会阻止重载；警告不会。

| 检查项 | 严重级别 | 说明 |
| --- | --- | --- |
| 规则模型校验 | error | 格式错误的规则字段。 |
| `duplicate_rule_id` | error | 同一个 ID 在快照中出现多次。 |
| 监听器冲突 | error | 两条规则占用了同一个 `listen_addr:port`。 |
| 端口可绑定性 | error | 实际尝试绑定监听端口以确认其可用。 |
| 目标 DNS 解析 | error | `target_addr` 必须可解析。 |
| HTTPS 域名配置 | — | _当前构建中已禁用_（http/https 协议会被拒绝）。 |
| ACME HTTP-01 地址 | — | _当前构建中已禁用_（ACME 子系统处于关闭状态）。 |
| 低端口特权 | warning | 绑定特权端口（<1024）通常需要提升权限。 |

## 示例响应

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

## 重载如何使用它

`POST /v1/reload` 会先运行相同的检查。如果 `error_count > 0`，重载即被拒绝，正在运行的规则会完全保持原样。这使得配置编辑可以安全地通过自动化来发布：一份有问题的配置无法被部分应用。

::: warning 本地端口
端口可绑定性的探针会短暂打开一个本地监听器。如果你的环境阻止创建本地套接字，预检（以及随之而来的重载）就无法完整地校验可绑定性。
:::
