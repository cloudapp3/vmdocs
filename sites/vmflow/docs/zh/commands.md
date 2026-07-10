---
title: 命令参考
description: vmflow CLI 参考——daemon、ctl、tui、version、update、service、uninstall 子命令及其别名。
---

# 命令参考

vmflow 是一个带有七个子命令的单二进制程序。别名见下表。

| 命令 | 别名 | 用途 |
| --- | --- | --- |
| [`daemon`](./daemon) | `d` | 运行转发守护进程。 |
| [`ctl`](./ctl) | `c` | 查询并控制一个运行中的守护进程。 |
| [`tui`](./tui) | `t` | 终端仪表盘。 |
| [`version`](./version) | `v` | 打印构建元数据。 |
| [`update`](./update) | `u` | 检查或安装更新的版本。 |
| [`service`](./service) | `svc` | 注册为原生系统服务（开机自启）。 |
| [`uninstall`](./uninstall) | `remove`, `rm` | 一键卸载并清理。 |

## 通用客户端参数 {#common-client-flags}

`ctl` 和 `tui` 都是[控制 API](./api) 的客户端，共用以下参数：

| 参数 | 环境变量 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `-addr` | _(无)_ | `http://127.0.0.1:19090` | 控制 API 的 base URL。 |
| `-token` | `VMFLOW_CONTROL_TOKEN` | _(无)_ | 启用认证时的 Bearer 令牌。 |
| `-tls-ca-file` | `VMFLOW_TLS_CA_FILE` | _(无)_ | 用于校验控制 API 服务器证书的 CA 包（私有/自签名 CA）。 |
| `-tls-client-cert` | `VMFLOW_TLS_CLIENT_CERT` | _(无)_ | mTLS 的客户端证书（当服务器设置了 `control_tls.client_ca_file` 时必需）。 |
| `-tls-client-key` | `VMFLOW_TLS_CLIENT_KEY` | _(无)_ | mTLS 的客户端密钥（与 `-tls-client-cert` 配合使用）。 |
| `-tls-skip-verify` | `VMFLOW_TLS_INSECURE` (`1`/`true`) | `false` | 跳过服务器证书校验（危险，仅用于调试）。 |
| `-H` / `--header` | `VMFLOW_HEADERS`（以 `;` 分隔） | _(无)_ | 额外的请求头，格式为 `Name: Value`（可重复）。 |

## 备注

- 出于兼容性，旧的分离式二进制 `relayd`、`relayctl` 和 `relaytui` 仍然可以构建——它们只是对相同包的薄封装，并读取相同的 `VMFLOW_CONTROL_TOKEN` 环境变量——但发布产物优先使用统一的 `vmflow` 二进制。
- 隧道命令（`tunnel-server`、`tunnel-client`、`tunnel-ctl`）和证书命令（`certs`、`certs-obtain`、`certs-review`）在当前构建中**未启用**。
