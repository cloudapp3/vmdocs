---
title: vmflow service
description: Register vmflow as a native OS service that starts at boot and restarts on crash — systemd, launchd, or Windows Service.
---

# vmflow service

```bash
vmflow service (install|uninstall|status) [flags]
```

Alias: `vmflow svc`.

Registers `vmflow` as a native OS service that **starts at boot** and **restarts on crash**:

| Platform | Mechanism | Location |
| --- | --- | --- |
| Linux | systemd unit | `/etc/systemd/system/<name>.service` |
| macOS | launchd daemon | `/Library/LaunchDaemons/io.cloudapp.<name>.plist` |
| Windows | Windows Service | managed via `services.msc` / `sc.exe` |

The service simply runs `vmflow` under the platform's supervisor. On Linux and macOS the supervisor sends `SIGTERM` to stop it; on Windows the daemon detects the Service Control Manager at startup and reports state itself. The SCM has no stdout, so logs default to `C:\ProgramData\vmflow\logs\vmflow.log`.

## Actions

| Action | Description |
| --- | --- |
| `install` | Validate the config, create or update the unit/plist/Windows Service, **enable** it, and **start** it now. Re-running it updates and restarts the existing service. Requires root on Linux/macOS, administrator on Windows. |
| `uninstall` | Stop and remove the service. Config and log files are left in place. |
| `status` | Print the current service status. |

## Flags

| Flag | Default | Description |
| --- | --- | --- |
| `-config` | platform path¹ | Config file path the service runs with. It must be valid and in a protected root/admin-owned location. |
| `-user` | `root` _(systemd)_ | Run the unit as this user; created as a system user if missing. Linux only. |
| `-log-file` | platform default | Override the daemon log destination. Linux uses stdout/journald, macOS uses launchd capture paths, and Windows uses `C:\ProgramData\vmflow\logs\vmflow.log`. |
| `--control-port` | config value | Override the daemon local management port; the host remains `127.0.0.1`. |
| `--extra-arg` | _(none)_ | Append a future daemon flag in `--extra-arg=-flag=value` form; repeat as needed. Existing flags must use their dedicated service options. |
| `-binary` | current executable | Path to the vmflow binary. For `install` it must be an **absolute path** owned by root/admin in a trusted location. |

¹ Default config paths: Linux `/etc/vmflow/config.yaml`, macOS `/usr/local/etc/vmflow/config.yaml`, Windows `C:\ProgramData\vmflow\config.yaml`.

## Examples

```bash
# 1. install a config at the default system path, then register the service
sudo vmflow service install

# 2. point the service at a specific config and run it as a dedicated user
sudo vmflow service install -config /etc/vmflow/config.yaml -user vmflow

# 3. optionally override the loopback management port
sudo vmflow service install --control-port 19100

# 4. check / remove
vmflow service status
sudo vmflow service uninstall
```

## Security notes

- For `install`, both the binary and config must resolve to absolute, root/admin-owned paths in trusted locations; otherwise installation is refused. The config is parsed before the service definition is changed.
- The management listener is always bound to `127.0.0.1`; remote administration uses an SSH tunnel.

For a full teardown (service + binary + config + logs + certs), use [`vmflow uninstall`](./uninstall) instead.
