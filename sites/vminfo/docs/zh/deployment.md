---
title: 部署
description: 通过本机访问、SSH 隧道或 HTTPS 反向代理安全运行 vminfo Web 仪表盘。
---

# 部署

`vminfo --web` 是面向单台主机的轻量仪表盘，不需要数据库，也不是集中式监控平台。部署时应让内置 HTTP 服务处于可信边界之内。

## 仅本机访问

最安全的默认方式不需要认证：

```bash
vminfo --web
```

服务监听 `127.0.0.1:20021`。可在同一台机器打开
`http://127.0.0.1:20021`，或在本机检查 API：

```bash
curl -fsS http://127.0.0.1:20021/api/v1/health
```

未启用认证时，服务只接受 `localhost` 或回环 IP 的 Host 头，从而阻止通过 DNS rebinding 访问本机仪表盘。

## 通过 SSH 远程访问

单人管理时，保持服务监听回环地址并创建隧道：

```bash
# 服务器上
vminfo --web

# 工作电脑上
ssh -L 20021:127.0.0.1:20021 user@server
```

然后在工作电脑打开 `http://127.0.0.1:20021`。服务器不会向网络公开仪表盘端口。

## 通过 HTTPS 反向代理访问

需要长期浏览器入口时，让 vminfo 继续监听回环地址，并在同一主机使用 HTTPS 反向代理：

```bash
vminfo --web --bind 127.0.0.1 --port 20021 --token
```

不带值的 `--token` 会生成随机 token 并输出可直接打开的 URL。也可以传入固定值：

```bash
vminfo --web --bind 127.0.0.1 --port 20021 --token "$VMINFO_WEB_TOKEN"
```

反向代理需要：

- 终止 TLS，并转发到 `127.0.0.1:20021`
- 保留原始 `Host` 头
- 设置 `X-Forwarded-Proto: https`
- 支持 `/ws` 的 WebSocket upgrade
- 让仪表盘与 API 保持同源

首次成功访问 `/?token=...` 后，服务会写入 `HttpOnly`、`SameSite=Lax`
cookie，并重定向到不含 token 的 URL。请求使用 HTTPS（包括代理正确设置
`X-Forwarded-Proto`）时，cookie 还会带有 `Secure` 属性。

::: warning 传输安全
内置服务使用 HTTP。token 只能控制访问，不能加密流量。不要把该端口直接暴露到公网；请使用 HTTPS 反向代理或 SSH 隧道。
:::

## 直接绑定私有网络

受信任私网确实需要直连时，非回环绑定必须启用 token：

```bash
vminfo --web --bind 0.0.0.0 --port 20021 --token
```

缺少 `--token` 时程序会立即拒绝启动。还应使用防火墙限制来源，并记住此连接仍是未加密 HTTP。

## 浏览器与 API 防护

- 带 `Origin` 的 REST 请求和 WebSocket upgrade 必须与请求的 scheme、host、port 同源
- 服务不会发送宽松的 `Access-Control-Allow-Origin: *`
- token 模式下，页面、`/api/v1/*` 和 `/ws` 都需要 token 或认证 cookie
- 不带 `Origin` 的原生客户端仍可使用
- 网络诊断请求必须是 JSON，并受请求体大小、次数和超时限制

## 进程托管

可以使用主机已有的 systemd、launchd 或容器运行时托管 vminfo。尽量使用非 root
用户，异常退出后重启，通过 `SIGTERM` 优雅停止；前方有 HTTPS 代理时，后端应继续绑定回环地址。vminfo 当前不会自动安装 service 定义。

## 验证部署

```bash
curl -fsS http://127.0.0.1:20021/api/v1/health
curl -fsS "http://127.0.0.1:20021/api/v1/health?token=$VMINFO_WEB_TOKEN"
```

目前没有单独的公开健康检查端点。启用认证后，`/api/v1/health` 同样受保护。

## 相关文档

- [Web 仪表盘](/zh/web-dashboard)
- [HTTP API](/zh/api)
- [安装](/zh/installation)
- [update 命令](/zh/update)
