---
title: vmflow ctl
description: Consulta y gestiona vmflow mediante la CLI compatible.
---

# vmflow ctl

```bash
vmflow ctl [-token TOKEN] <subcomando>
```

Alias: `vmflow c`.

`ctl` es la interfaz de comandos compatible para el daemon local. Usa `-token` o `VMFLOW_CONTROL_TOKEN` cuando haya autenticación.

## Subcomandos

| Subcomando | Descripción |
| --- | --- |
| `rules` | Lista las reglas activas. |
| `stats` | Muestra contadores de tráfico por regla. |
| `metrics` | Imprime métricas Prometheus. |
| `precheck` | Valida sin aplicar la configuración. |
| `reload` | Recarga después del precheck. |

## Ejemplos

```bash
vmflow ctl rules
vmflow ctl stats
vmflow ctl precheck
vmflow ctl reload
vmflow ctl -token change-me reload
```

::: tip
Los subcomandos que mutan estado (`reload`) requieren un token `admin` cuando auth está habilitado. Los subcomandos de solo lectura funcionan con un token `viewer`.
:::
