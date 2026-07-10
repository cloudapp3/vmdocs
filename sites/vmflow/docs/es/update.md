---
title: vmflow update
description: Comprueba o instala la última release de vmflow — vmflow update, --check, --version.
---

# vmflow update

Consulta GitHub Releases e instala el build etiquetado más reciente de `vmflow` in situ.

```bash
vmflow update [--check] [--version <tag>]
```

Alias: `vmflow u`.

## Flags

| Flag | Descripción |
| --- | --- |
| `--check` | Solo comprueba si hay actualizaciones; no instala. |
| `--version <tag>` | Instala o inspecciona una etiqueta de release concreta (p. ej. `v0.1.1`). |

## Qué hace

1. Consulta la API de GitHub Releases para `cloudapp3/vmflow`.
2. Compara la release más reciente con la versión del build en ejecución.
3. Al instalar: descarga el archivo del SO/arquitectura actual, lo verifica contra `checksums.txt` con SHA-256, extrae el binario y reemplaza atómicamente el binario `vmflow` en ejecución.

## Ejemplos

Comprueba si hay una release más reciente disponible, sin instalar:

```bash
vmflow update --check
```

Instala la release más reciente:

```bash
vmflow update
```

Instala una versión concreta:

```bash
vmflow update --version v0.1.1
```

## Notas

- Un build `dev` (por ejemplo, compilado desde el código fuente sin ldflags de release) no puede autoactualizarse sin `--version`, porque se desconoce su versión actual. Usa `vmflow update --version vX.Y.Z` en ese caso.
- Las comprobaciones de actualización se cachean durante 24 horas bajo tu directorio de caché (`~/.cache/vmflow/update-check.json`, o `$XDG_CACHE_HOME/vmflow`). Usa `--version` para saltarte la caché para una etiqueta concreta.
- **Windows**: la autoactualización (reemplazo del binario) no es compatible; `--check` sí funciona. Reinstala con `install.sh` o con el archivo de release para actualizar en Windows.
- Para releases privados o límites de tasa más altos de la API de GitHub, define `GITHUB_TOKEN` o `GH_TOKEN`.
- La autoactualización reemplaza el binario en ejecución y necesita permiso de escritura sobre él. Si falla con un error de permisos, vuelve a ejecutarlo con los privilegios adecuados (por ejemplo `sudo`) o arregla los permisos de la ruta de instalación.

## Relacionado

- [Instalación](./installation)
- [Changelog](/changelog)
