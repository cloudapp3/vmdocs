---
title: Referencia de comandos
description: Referencia CLI de vmflow para foreground, ctl, tui, mcp, version, update, service y uninstall.
---

# Referencia de comandos

vmflow es un único binario con comandos de configuración inicial, foreground explícito, estado, gestión, servicio y mantenimiento.

| Comando | Alias | Propósito |
| --- | --- | --- |
| `vmflow` | - | Muestra estado de config/daemon y el siguiente paso. |
| `vmflow init` | - | Elige idioma y modo, y crea la primera regla validada y credenciales locales. |
| [`vmflow run`](./daemon) | - | Ejecuta el reenvío en foreground con el config de usuario de la plataforma. |
| `vmflow status` | - | Inspecciona ruta config, reglas, daemon y servicio nativo; admite `-json`. |
| [`ctl`](./ctl) | `c` | Consulta y controla un daemon en ejecución. |
| [`tui`](./tui) | `t` | Panel de terminal. |
| [`mcp`](./mcp) | - | Servidor MCP stdio de solo lectura para un daemon local en ejecución. |
| [`version`](./version) | `v` | Imprime los metadatos de build. |
| [`update`](./update) | `u` | Comprueba o instala una release más reciente. |
| [`service`](./service) | `svc` | Instala, inicia, inspecciona o desinstala el servicio nativo. |
| [`uninstall`](./uninstall) | `remove`, `rm` | Desinstalación con un solo comando y limpieza. |

## Parámetros comunes de gestión {#common-client-flags}

Los comandos `ctl`, `tui` y `mcp` se conectan al daemon local.

| Parámetro | Variable | Por defecto | Descripción |
| --- | --- | --- | --- |
| `-token` | `VMFLOW_CONTROL_TOKEN` | _(ninguno)_ | Bearer token cuando la autenticación está habilitada. |

Para gestión remota usa el túnel SSH descrito en [Gestión local](./api).

## Notas

- Los antiguos binarios separados `relayd`, `relayctl` y `relaytui` aún se pueden compilar por compatibilidad — son thin shims sobre los mismos paquetes y leen la misma variable de entorno `VMFLOW_CONTROL_TOKEN` — pero las releases prefieren el binario unificado `vmflow`.
- Los comandos de túnel (`tunnel-server`, `tunnel-client`, `tunnel-ctl`) y de certificados (`certs`, `certs-obtain`, `certs-review`) **no están habilitados** en el build actual.
