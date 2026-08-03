---
title: vmflow run
description: Referencia CLI de vmflow para foreground, ctl, tui, version, update, service y uninstall.
---

# vmflow run

```bash
vmflow run [-config /path/to/config.yaml] [-control-port 19090]
```

El modo foreground carga la configuración, inicia el canal interno solo en loopback, aplica las reglas como snapshot y se ejecuta hasta `SIGINT` o `SIGTERM`.

## Flags

| Flag | Por defecto | Descripción |
| --- | --- | --- |
| `-config` | platform user config | Sobrescribe la ruta de configuración YAML. |
| `-control-port` | _(de configuración)_ | Sobrescribe el puerto de gestión loopback. |
| `-log-file` | _(stdout)_ | Escribe los logs en este archivo en lugar de stdout; útil bajo un gestor de servicios. |
| `-service-name` | `vmflow` | Nombre registrado en Windows SCM; se ignora fuera de Windows service mode. |

## Comportamiento en ejecución

- Al arrancar, las reglas se aplican vía instantánea (`ReplaceAll`). Consulta [Reglas y ciclo de vida](./rules).
- `vmflow ctl` y `vmflow tui` son las interfaces de gestión compatibles.

- Para ejecutarlo como servicio gestionado al arrancar, consulta [`vmflow service`](./service).
