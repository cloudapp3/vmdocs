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

The service simply runs `vmflow daemon` under the platform's supervisor. On Linux and macOS the supervisor sends `SIGTERM` to stop it; on Windows the daemon detects the Service Control Manager at startup and reports state itself (no stdout is available, so `-log-file` is required).

## Actions

| Action | Description |
| --- | --- |
| `install` | Generate the unit/plist (or register the Windows Service), **enable** it, and **start** it now. Requires root on Linux/macOS, administrator on Windows. |
| `uninstall` | Stop and remove the service. Config and log files are left in place. |
| `status` | Print the current service status. |

## Flags

| Flag | Default | Description |
| --- | --- | --- |
| `-config` | platform path¹ | Config file path the service runs with. The config must already exist. |
| `-user` | `root` _(systemd)_ | Run the unit as this user; created as a system user if missing. Linux only. |
| `-log-file` | _(stdout)_ | Redirect daemon logs here. Passed as `-log-file` on Linux/Windows; sets the launchd capture paths on macOS. Effectively **required on Windows**. |
| `-extra-args` | _(none)_ | Extra flags appended verbatim to the daemon command line, e.g. `"-control-listen 0.0.0.0:19090"`. |
| `-binary` | current executable | Path to the vmflow binary. For `install` it must be an **absolute path** owned by root/admin in a trusted location. |

¹ Default config paths: Linux `/etc/vmflow/config.yaml`, macOS `/usr/local/etc/vmflow/config.yaml`, Windows `C:\ProgramData\vmflow\config.yaml`.

## Examples

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

## Security notes

- For `install`, the binary must resolve to an absolute, root/admin-owned path in a trusted install location; otherwise installation is refused. This prevents a less-privileged user from swapping the binary after a privileged install.
- Binding the control API off-loopback is still subject to the daemon's [startup safety check](./daemon#startup-safety) — enable `auth` or mTLS, or the service will crash-loop.

For a full teardown (service + binary + config + logs + certs), use [`vmflow uninstall`](./uninstall) instead.
