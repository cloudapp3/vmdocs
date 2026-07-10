---
title: Panel TUI
description: El panel de terminal de vmflow — iniciar, alternar entre las vistas Dashboard, Rules y Detail.
---

# Panel TUI

vmflow incluye una interfaz de terminal para inspeccionar un daemon en ejecución. Lee de la API de control local, de modo que muestra el estado en vivo de las reglas y los contadores de tráfico.

## Iniciarlo

```bash
vmflow tui
```

Apunta a una dirección de control distinta de la por defecto o pasa un token:

```bash
vmflow tui -addr http://127.0.0.1:19090 -token <token>
# or
VMFLOW_CONTROL_TOKEN=<token> vmflow tui
```

La TUI acepta las mismas flags de cliente que `ctl`, incluidas las flags TLS/mTLS (`-tls-ca-file`, `-tls-client-cert`, `-tls-client-key`, `-tls-skip-verify`) y `-H` / `--header` para cabeceras de petición personalizadas.

## Vistas

Pulsa <kbd>Tab</kbd> para rotar entre las vistas:

| Vista | Muestra |
| --- | --- |
| **Dashboard** | Salud general, recuento de reglas en ejecución, tiempo de actividad. |
| **Rules** | La lista de reglas en ejecución con contadores en vivo; permite filtrar reglas por nombre. |
| **Detail** | Detalle de la regla seleccionada. |

## Cuándo usarla

La TUI es la forma más rápida de responder a la pregunta "¿qué está haciendo vmflow ahora mismo?" sin recolectar métricas. Para historial a largo plazo, apunta Prometheus a `/metrics` en su lugar — la TUI solo muestra el estado actual en memoria.
