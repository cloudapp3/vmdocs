---
title: vmflow service
description: 将 vmflow 注册为开机自启、崩溃重启的原生系统服务——systemd、launchd 或 Windows Service。
---

# vmflow service

```bash
vmflow service (install|uninstall|status) [flags]
```

别名：`vmflow svc`。

将 `vmflow` 注册为一个**开机自启**且**崩溃后重启**的原生系统服务：

| 平台 | 机制 | 位置 |
| --- | --- | --- |
| Linux | systemd unit | `/etc/systemd/system/<name>.service` |
| macOS | launchd daemon | `/Library/LaunchDaemons/io.cloudapp.<name>.plist` |
| Windows | Windows Service | 通过 `services.msc` / `sc.exe` 管理 |

该服务只是在平台监管器下运行 `vmflow daemon`。在 Linux 和 macOS 上，监管器会发送 `SIGTERM` 来停止它；在 Windows 上，守护进程在启动时检测服务控制管理器（Service Control Manager）并自行上报状态（由于没有可用的 stdout，因此必须使用 `-log-file`）。

## 动作

| 动作 | 说明 |
| --- | --- |
| `install` | 生成 unit/plist（或注册 Windows Service），**启用**它，并立即**启动**它。在 Linux/macOS 上需要 root，在 Windows 上需要管理员权限。 |
| `uninstall` | 停止并移除服务。配置和日志文件会保留原处。 |
| `status` | 打印当前服务状态。 |

## 参数

| 参数 | 默认值 | 说明 |
| --- | --- | --- |
| `-config` | 平台路径¹ | 服务运行时所用的配置文件路径。该配置必须已存在。 |
| `-user` | `root` _(systemd)_ | 以该用户身份运行 unit；如不存在则创建为系统用户。仅限 Linux。 |
| `-log-file` | _(stdout)_ | 将守护进程日志重定向到此。在 Linux/Windows 上作为 `-log-file` 传入；在 macOS 上设置 launchd 的捕获路径。在 Windows 上实际上**必填**。 |
| `-extra-args` | _(无)_ | 原样追加到守护进程命令行的额外参数，例如 `"-control-listen 0.0.0.0:19090"`。 |
| `-binary` | 当前可执行文件 | vmflow 二进制的路径。对于 `install`，它必须是位于可信位置、由 root/admin 拥有的**绝对路径**。 |

¹ 默认配置路径：Linux `/etc/vmflow/config.yaml`、macOS `/usr/local/etc/vmflow/config.yaml`、Windows `C:\ProgramData\vmflow\config.yaml`。

## 示例

```bash
# 1. install a config at the default system path, then register the service
sudo vmflow service install

# 2. point the service at a specific config and run it as a dedicated user
sudo vmflow service install -config /etc/vmflow/config.yaml -user vmflow

# 3. bind the control API off-loopback (auth/mTLS still required — see Deployment)
sudo vmflow service install -extra-args "-control-listen 0.0.0.0:19090"

# 4. check / remove
vmflow service status
sudo vmflow service uninstall
```

## 安全说明

- 对于 `install`，二进制必须解析为一个位于可信安装位置、由 root/admin 拥有的绝对路径；否则安装会被拒绝。这能防止低权限用户在特权安装之后替换二进制。
- 将控制 API 绑定到回环之外，仍受守护进程的[启动安全检查](./daemon#startup-safety)约束——请启用 `auth` 或 mTLS，否则服务会陷入崩溃循环。

如需完整拆除（服务 + 二进制 + 配置 + 日志 + 证书），请改用 [`vmflow uninstall`](./uninstall)。
