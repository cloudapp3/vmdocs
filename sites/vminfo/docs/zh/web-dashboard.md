---
title: Web 仪表盘
description: 启动只读 HTTP API 与浏览器仪表盘，包括 token 鉴权与 WebSocket 访问。
---

# Web 仪表盘

`vminfo --web` 启动一个轻量、只读的 HTTP API 和仪表盘，支持切换主题。

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

也可以在仪表盘之外同时启动 TUI：

```bash
vminfo --web --tui
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
- `/healthz` 保持公开，供本地探针使用
- `/`、`/api/v1/*` 和 `/ws` 需要 token 或鉴权 cookie
- token 保护模式不会暴露宽松的 `Access-Control-Allow-Origin: *`
- WebSocket 升级要求浏览器 origin 与仪表盘主机一致

::: warning 远程访问
当绑定到 `0.0.0.0` 时，除非仪表盘只暴露给受信任的私网，否则请启用 `--token`。
:::

## 端点

| 端点 | 用途 |
| --- | --- |
| `GET /healthz` | 公开的健康检查 |
| `GET /api/v1/snapshot` | 完整运行时快照 |
| `GET /api/v1/cpu` | CPU 数据 |
| `GET /api/v1/memory` | 内存与 swap 数据 |
| `GET /api/v1/disk` | 文件系统与磁盘 I/O 数据 |
| `GET /api/v1/network` | 网络总量与网卡数据 |
| `GET /api/v1/processes` | 进程列表 |
| `GET /api/v1/system` | 主机元数据 |
| `GET /api/v1/health` | 健康评分与告警 |
| `POST /api/v1/net/diag` | 运行网络诊断（dns / port / ping / ip） |
| `GET /ws` | 实时快照流 |

完整的请求/响应示例与查询参数见 [HTTP API 参考](/zh/api)。

## 主题

仪表盘内置可从页头切换的主题：**Auto**、**Neon**、**Light**、**Terminal** 和 **Synthwave**。"Auto" 跟随系统配色。

[JetBrains Mono](https://www.jetbrains.com/lp/mono/) **内嵌**在二进制中，因此仪表盘完全自包含 —— 使用预期的等宽字体渲染，离线也能工作，无需外部字体请求。
