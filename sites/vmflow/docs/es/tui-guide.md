---
title: Panel TUI
description: El panel de terminal de vmflow — iniciar, alternar entre las vistas Dashboard, Rules y Detail.
---

# Panel TUI

vmflow incluye una interfaz de terminal para consultar el estado de las reglas y los contadores de tráfico del daemon local.

## Iniciarlo

```bash
vmflow tui
```

Cuando la autenticación esté habilitada, pasa un token de acceso:

```bash
vmflow tui -token <token>
# or
VMFLOW_CONTROL_TOKEN=<token> vmflow tui
```

## Vistas

Pulsa <kbd>Tab</kbd> para rotar entre las vistas:

| Vista | Muestra |
| --- | --- |
| **Dashboard** | Salud general, recuento de reglas en ejecución, tiempo de actividad. |
| **Rules** | La lista de reglas en ejecución con contadores en vivo; permite filtrar reglas por nombre. |
| **Detail** | Detalle de la regla seleccionada. |

## Cuándo usarla

La TUI es la forma más rápida de responder a la pregunta "¿qué está haciendo vmflow ahora mismo?" sin recolectar métricas. Para historial a largo plazo, apunta Prometheus a `/metrics` en su lugar — la TUI solo muestra el estado actual en memoria.
