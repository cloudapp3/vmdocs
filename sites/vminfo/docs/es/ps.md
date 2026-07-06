---
title: ps
description: Listado de procesos exclusivo de Linux con filtros, vista en árbol, modo watch y salida JSON.
---

# `vminfo ps`

Listado y filtrado de procesos exclusivo de Linux.

## Uso

```bash
vminfo ps
vminfo ps nginx
vminfo ps --filter ssh
vminfo ps --tree
vminfo ps --watch
vminfo ps --limit 20
vminfo ps --json
vminfo ps --sort mem
```

## Opciones

| Flag | Descripción |
| --- | --- |
| filtro posicional | Filtra por nombre, usuario, PID, comando o estado |
| `--filter` | Filtro explícito de procesos |
| `--tree` | Renderiza un árbol de procesos |
| `--watch` | Actualiza de forma continua |
| `--count` | Número de muestras cuando se usa con `--watch` |
| `--interval` | Intervalo de actualización para el modo watch |
| `--limit` | Limita el número de filas |
| `--json` | Salida JSON |
| `--sort` | Ordena por `cpu`, `mem`, `pid` o `name` |

## Notas

- El orden por defecto es `cpu`.
- La salida JSON devuelve un array de objetos de proceso.
- `--watch --json` devuelve JSON Lines con una marca de tiempo `collected_at`.
- Las compilaciones que no son de Linux mantienen stubs no soportados para este comando.

## Ejemplo

```bash
vminfo ps --filter ssh --sort mem --limit 20
```

## Relacionado

- [kill](/es/kill)
- [API HTTP](/es/api)
