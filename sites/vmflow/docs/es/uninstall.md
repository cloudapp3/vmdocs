---
title: vmflow uninstall
description: Desinstalación de vmflow con un solo comando — elimina el servicio, el binario, la configuración, los logs, los certificados y la caché de actualización.
---

# vmflow uninstall

```bash
vmflow uninstall [--dry-run]
```

Alias: `vmflow remove`, `vmflow rm`.

Realiza un desmontaje completo de una instalación de vmflow. Sigue un flujo de **plan → confirmación → ejecución**:

1. **Plan** — sondea el sistema y lista todo lo que se eliminaría.
2. **Confirmación** — pide `[y/N]` (se omite con `--dry-run` o cuando no hay nada que eliminar).
3. **Ejecución** — elimina los elementos en orden, tolerando rutas ya ausentes para que el comando sea idempotente.

## Flags

| Flag | Por defecto | Descripción |
| --- | --- | --- |
| `--dry-run` | `false` | Imprime el plan de eliminación sin eliminar nada. |

## Qué elimina

Los elementos se eliminan en este orden (primero el servicio, el binario en ejecución el último, de modo que un daemon aún supervisado desaparece antes de que se borre su ejecutable):

| Elemento | Notas |
| --- | --- |
| Servicio nativo | Detiene y elimina la unidad systemd / plist de launchd / Windows Service. |
| Archivos de configuración | La configuración por defecto de plataforma (consulta [`service`](./service)) y la configuración colocada junto al binario que pertenece al instalador. Se conserva una configuración colocada que pertenezca al usuario. |
| Certificados TLS / ACME externos | Se conservan los certificados y claves fuera del almacenamiento propiedad de vmflow. |
| Directorios de log | p. ej. `/var/log/vmflow` (Linux/macOS), `C:\ProgramData\vmflow\logs` (Windows). |
| Caché de autoactualización | El directorio de caché del actualizador. |
| Binario de vmflow | El ejecutable en ejecución, eliminado en último lugar. |

::: warning Instalaciones con gestor de paquetes
Si el binario es propiedad de un gestor de paquetes (`dpkg` / `rpm`), `uninstall` imprime una advertencia y recomienda `apt remove` / `yum remove` en su lugar, ya que borrar el archivo directamente deja la base de datos de paquetes obsoleta. Aun así, prosigue si lo confirmas.
:::

Las rutas protegidas (raíces del sistema, tu directorio home) no se eliminan nunca.

## Instalaciones gestionadas por el instalador

Para una instalación de usuario creada por `install.sh`, utiliza preferentemente la desinstalación del instalador:

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vmflow/main/install.sh \
  | bash -s -- --uninstall
```

Delega en `vmflow uninstall` cuando está disponible y usa una limpieza de shell para un binario antiguo o ausente. Después de eliminar correctamente el binario, también quita de `.zshrc`, `.bashrc` o `.profile` el bloque PATH exacto propiedad del instalador. Las líneas PATH similares escritas por el usuario, los archivos de inicio enlazados simbólicamente y los no escribibles no se modifican.

Usa `sudo bash -s -- --uninstall` solo para una instalación del sistema propiedad de root. Pasa `--dir PATH` junto a `--uninstall` cuando elimines un directorio personalizado elegido explícitamente.

## Ejemplos

```bash
# preview only
vmflow uninstall --dry-run

# full teardown (will prompt to confirm)
sudo vmflow uninstall
```
