---
title: summary
description: Recoge una instantánea del estado del host como texto o JSON.
---

# `vminfo summary`

Recoge una instantánea del estado actual del host.

## Uso

```bash
vminfo summary
vminfo summary --json
vminfo summary --interval 1s
```

## Salida

- El modo texto imprime un resumen del host legible por humanos.
- El modo JSON imprime un objeto `vminfo.Snapshot` con los campos `static` y `stats`.

## Cuándo usarlo

- comprobaciones rápidas en terminal
- scripts de shell
- diagnóstico de CI
- automatización que necesita una sola muestra

## Ejemplo

```bash
vminfo summary --json
```

## Relacionado

- [watch](/es/watch)
- [API HTTP](/es/api)
- [Biblioteca Go](/es/library)
