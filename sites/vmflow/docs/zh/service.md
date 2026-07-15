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

该服务只是在平台监管器下运行 `vmflow`。在 Linux 和 macOS 上，监管器会发送 `SIGTERM` 来停止它；在 Windows 上，守护进程在启动时检测服务控制管理器（Service Control Manager）并自行上报状态。SCM 没有 stdout，因此日志默认写入 `C:\ProgramData\vmflow\logs\vmflow.log`。

## 动作

| 动作 | 说明 |
| --- | --- |
| `install` | 验证配置，创建或更新 unit/plist/Windows Service，**启用**它并立即**启动**。重复执行会更新并重启现有服务。在 Linux/macOS 上需要 root，在 Windows 上需要管理员权限。 |
| `uninstall` | 停止并移除服务。配置和日志文件会保留原处。 |
| `status` | 打印当前服务状态。 |

## 参数

| 参数 | 默认值 | 说明 |
| --- | --- | --- |
| `-config` | 平台路径¹ | 服务运行时所用的配置文件路径。配置必须有效，并位于受保护、由 root/admin 拥有的位置。 |
| `-user` | `root` _(systemd)_ | 以该用户身份运行 unit；如不存在则创建为系统用户。仅限 Linux。 |
| `-log-file` | 平台默认值 | 覆盖守护进程日志位置。Linux 使用 stdout/journald，macOS 使用 launchd 捕获路径，Windows 使用 `C:\ProgramData\vmflow\logs\vmflow.log`。 |
| `--control-port` | 配置文件中的值 | 覆盖守护进程的本地管理端口；主机仍固定为 `127.0.0.1`。 |
| `--extra-arg` | _(无)_ | 以 `--extra-arg=-flag=value` 格式追加未来新增的守护进程标志，可重复使用。现有标志必须使用专用 service 选项。 |
| `-binary` | 当前可执行文件 | vmflow 二进制的路径。对于 `install`，它必须是位于可信位置、由 root/admin 拥有的**绝对路径**。 |

¹ 默认配置路径：Linux `/etc/vmflow/config.yaml`、macOS `/usr/local/etc/vmflow/config.yaml`、Windows `C:\ProgramData\vmflow\config.yaml`。

## 示例

```bash
# 1. install a config at the default system path, then register the service
sudo vmflow service install

# 2. point the service at a specific config and run it as a dedicated user
sudo vmflow service install -config /etc/vmflow/config.yaml -user vmflow

# 3. 可选：覆盖回环管理端口
sudo vmflow service install --control-port 19100

# 4. check / remove
vmflow service status
sudo vmflow service uninstall
```

## 安全说明

- 对于 `install`，二进制和配置都必须解析为位于可信位置、由 root/admin 拥有的绝对路径；否则安装会被拒绝。修改系统服务定义之前会先完整解析配置。
- 管理监听器始终绑定 `127.0.0.1`；远程管理请使用 SSH tunnel。

如需完整拆除（服务 + 二进制 + 配置 + 日志 + 证书），请改用 [`vmflow uninstall`](./uninstall)。
