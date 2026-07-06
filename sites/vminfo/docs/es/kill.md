---
title: kill
description: Envía SIGTERM a un proceso de Linux por PID.
---

# `vminfo kill`

Envía `SIGTERM` a un proceso de Linux.

::: warning
Este comando termina un proceso. Asegúrate de que el PID sea correcto antes de ejecutarlo.
:::

## Uso

```bash
vminfo kill 1234
```

## Notas

- Solo disponible en Linux
- devuelve stubs no soportados en compilaciones no Linux
- puede requerir permisos si el proceso objetivo pertenece a otro usuario

## Relacionado

- [ps](/es/ps)
