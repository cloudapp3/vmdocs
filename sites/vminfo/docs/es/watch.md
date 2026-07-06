---
title: watch
description: Transmite instantáneas en tiempo de ejecución de forma continua, como texto o JSON Lines.
---

# `vminfo watch`

Transmite instantáneas de forma continua.

## Uso

```bash
vminfo watch
vminfo watch --json
vminfo watch --count 1
vminfo watch --interval 2s
```

## Salida

- El modo texto imprime instantáneas con marca de tiempo.
- El modo JSON imprime JSON Lines con `collected_at`, `static` y `stats`.

## Ideal para

- monitorización en terminal
- pipelines de logs
- comprobaciones de CI
- bucles de muestreo simples

## Ejemplo

```bash
vminfo watch --json --count 3
```

## Relacionado

- [summary](/es/summary)
- [ps](/es/ps)
