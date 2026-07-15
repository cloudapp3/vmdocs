---
title: Referencia de comandos
description: Referencia CLI de vmflow para foreground, ctl, tui, version, update, service y uninstall.
---

# Referencia de comandos

vmflow es un único binario con ejecución foreground y seis subcomandos.

| Comando | Alias | Propósito |
| --- | --- | --- |
| `vmflow` | - | Ejecuta el runtime de reenvío en foreground. |
| [`ctl`](./ctl) | `c` | Consulta y controla un daemon en ejecución. |
| [`tui`](./tui) | `t` | Panel de terminal. |
| [`version`](./version) | `v` | Imprime los metadatos de build. |
| [`update`](./update) | `u` | Comprueba o instala una release más reciente. |
| [`service`](./service) | `svc` | Registra como servicio nativo del SO (arranque en boot). |
| [`uninstall`](./uninstall) | `remove`, `rm` | Desinstalación con un solo comando y limpieza. |

## Parámetros comunes de gestión {#common-client-flags}

Los comandos `ctl` y `tui` se conectan al daemon local.

| Parámetro | Variable | Por defecto | Descripción |
| --- | --- | --- | --- |
| `-token` | `VMFLOW_CONTROL_TOKEN` | _(ninguno)_ | Bearer token cuando la autenticación está habilitada. |

Para gestión remota usa el túnel SSH descrito en [Gestión local](./api).

## Notas

- Los antiguos binarios separados `relayd`, `relayctl` y `relaytui` aún se pueden compilar por compatibilidad — son thin shims sobre los mismos paquetes y leen la misma variable de entorno `VMFLOW_CONTROL_TOKEN` — pero las releases prefieren el binario unificado `vmflow`.
- Los comandos de túnel (`tunnel-server`, `tunnel-client`, `tunnel-ctl`) y de certificados (`certs`, `certs-obtain`, `certs-review`) **no están habilitados** en el build actual.
