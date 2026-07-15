---
title: vmflow service
description: Registra vmflow como servicio nativo del SO que arranca en el boot y se reinicia ante caídas — systemd, launchd o Windows Service.
---

# vmflow service

```bash
vmflow service (install|uninstall|status) [flags]
```

Alias: `vmflow svc`.

Registra `vmflow` como servicio nativo del SO que **arranca en el boot** y **se reinicia ante caídas**:

| Plataforma | Mecanismo | Ubicación |
| --- | --- | --- |
| Linux | unidad systemd | `/etc/systemd/system/<name>.service` |
| macOS | daemon launchd | `/Library/LaunchDaemons/io.cloudapp.<name>.plist` |
| Windows | Windows Service | gestionado vía `services.msc` / `sc.exe` |

El servicio simplemente ejecuta `vmflow` bajo el supervisor de la plataforma. En Linux y macOS el supervisor envía `SIGTERM` para detenerlo; en Windows el daemon detecta el Service Control Manager y reporta el estado. Como el SCM no tiene stdout, los logs usan `C:\ProgramData\vmflow\logs\vmflow.log` por defecto.

## Acciones

| Acción | Descripción |
| --- | --- |
| `install` | Valida la configuración, crea o actualiza la unidad/plist/Windows Service, la **habilita** y la **arranca**. Al repetirlo, actualiza y reinicia el servicio existente. Requiere root en Linux/macOS, administrador en Windows. |
| `uninstall` | Detiene y elimina el servicio. Los archivos de configuración y de log se conservan. |
| `status` | Imprime el estado actual del servicio. |

## Flags

| Flag | Por defecto | Descripción |
| --- | --- | --- |
| `-config` | ruta de plataforma¹ | Ruta de la configuración del servicio. Debe ser válida y estar protegida, bajo propiedad de root/admin. |
| `-user` | `root` _(systemd)_ | Ejecuta la unidad como este usuario; se crea como usuario del sistema si no existe. Solo Linux. |
| `-log-file` | valor de plataforma | Sobrescribe el destino de logs. Linux usa stdout/journald, macOS rutas de launchd y Windows `C:\ProgramData\vmflow\logs\vmflow.log`. |
| `--control-port` | valor de configuración | Sobrescribe el puerto de gestión local; el host sigue siendo `127.0.0.1`. |
| `--extra-arg` | _(ninguno)_ | Añade un futuro flag como `--extra-arg=-flag=value`; se puede repetir. Los flags actuales deben usar sus opciones dedicadas. |
| `-binary` | ejecutable actual | Ruta al binario de vmflow. Para `install` debe ser una **ruta absoluta** propiedad de root/admin en una ubicación de confianza. |

¹ Rutas de configuración por defecto: Linux `/etc/vmflow/config.yaml`, macOS `/usr/local/etc/vmflow/config.yaml`, Windows `C:\ProgramData\vmflow\config.yaml`.

## Ejemplos

```bash
# 1. install a config at the default system path, then register the service
sudo vmflow service install

# 2. point the service at a specific config and run it as a dedicated user
sudo vmflow service install -config /etc/vmflow/config.yaml -user vmflow

# 3. opcionalmente cambia el puerto de gestión loopback
sudo vmflow service install --control-port 19100

# 4. check / remove
vmflow service status
sudo vmflow service uninstall
```

## Notas de seguridad

- Para `install`, el binario y la configuración deben resolver a rutas absolutas propiedad de root/admin en ubicaciones de confianza; de lo contrario se rechaza. La configuración se analiza antes de cambiar el servicio.
- El listener de gestión siempre se enlaza a `127.0.0.1`; el acceso remoto usa un túnel SSH.

Para un desmontaje completo (servicio + binario + configuración + logs + certificados), usa [`vmflow uninstall`](./uninstall) en su lugar.
