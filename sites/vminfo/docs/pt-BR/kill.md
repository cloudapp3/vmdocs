---
title: kill
description: Envia SIGTERM para um processo Linux por PID.
---

# `vminfo kill`

Envia `SIGTERM` para um processo Linux.

::: warning
Este comando encerra um processo. Certifique-se de que o PID está correto antes de executá-lo.
:::

## Uso

```bash
vminfo kill 1234
```

## Notas

- Disponível apenas no Linux
- retorna stubs não suportados em builds não Linux
- pode exigir permissão se o processo de destino pertencer a outro usuário

## Relacionado

- [ps](/pt-BR/ps)
