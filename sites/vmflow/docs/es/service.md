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

El servicio simplemente ejecuta `vmflow daemon` bajo el supervisor de la plataforma. En Linux y macOS el supervisor envía `SIGTERM` para detenerlo; en Windows el daemon detecta el Service Control Manager al arrancar y reporta el estado él mismo (no hay stdout disponible, de modo que `-log-file` es obligatorio).

## Acciones

| Acción | Descripción |
| --- | --- |
| `install` | Genera la unidad/plist (o registra el Windows Service), la **habilita** y la **arranca** ahora. Requiere root en Linux/macOS, administrador en Windows. |
| `uninstall` | Detiene y elimina el servicio. Los archivos de configuración y de log se conservan. |
| `status` | Imprime el estado actual del servicio. |

## Flags

| Flag | Por defecto | Descripción |
| --- | --- | --- |
| `-config` | ruta de plataforma¹ | Ruta del archivo de configuración con el que se ejecuta el servicio. La configuración debe existir ya. |
| `-user` | `root` _(systemd)_ | Ejecuta la unidad como este usuario; se crea como usuario del sistema si no existe. Solo Linux. |
| `-log-file` | _(stdout)_ | Redirige aquí los logs del daemon. Se pasa como `-log-file` en Linux/Windows; define las rutas de captura de launchd en macOS. Prácticamente **obligatorio en Windows**. |
| `-extra-args` | _(ninguna)_ | Flags extra que se añaden literalmente a la línea de comandos del daemon, p. ej. `"-control-listen 0.0.0.0:19090"`. |
| `-binary` | ejecutable actual | Ruta al binario de vmflow. Para `install` debe ser una **ruta absoluta** propiedad de root/admin en una ubicación de confianza. |

¹ Rutas de configuración por defecto: Linux `/etc/vmflow/config.yaml`, macOS `/usr/local/etc/vmflow/config.yaml`, Windows `C:\ProgramData\vmflow\config.yaml`.

## Ejemplos

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

## Notas de seguridad

- Para `install`, el binario debe resolver a una ruta absoluta, propiedad de root/admin, en una ubicación de instalación de confianza; de lo contrario la instalación se rechaza. Esto evita que un usuario con menos privilegios sustituya el binario tras una instalación privilegiada.
- Vincular la API de control fuera de loopback sigue sujeto a la [verificación de seguridad de arranque](./daemon#startup-safety) del daemon: habilita `auth` o mTLS, o el servicio entrará en un crash-loop.

Para un desmontaje completo (servicio + binario + configuración + logs + certificados), usa [`vmflow uninstall`](./uninstall) en su lugar.
