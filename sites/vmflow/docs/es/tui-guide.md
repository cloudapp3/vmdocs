---
title: Panel TUI
description: Consulta y gestiona reglas de vmflow, políticas de IP de origen, contadores, verificación previa y operaciones de aplicación desde la interfaz de terminal.
---

# Panel TUI

vmflow incluye una interfaz de terminal para consultar y gestionar las reglas configuradas y los contadores de tráfico en vivo del daemon local.

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
| **Rules** | Reglas configuradas, incluidas las deshabilitadas, contadores en vivo, cambios preparados y un resumen de acceso `OPEN` / `ALLOW n` / `DENY n` en terminales anchas. |
| **Detail** | Ajustes de la regla seleccionada, entradas de IP de origen, tráfico y contador acumulado `IP Denied`. |

## Gestión de reglas

Un token `admin` autenticado puede crear, editar, copiar, habilitar, deshabilitar y eliminar reglas. Los tokens viewer y las sesiones sin autenticación son de solo lectura. En la vista Rules, usa <kbd>n</kbd>/<kbd>e</kbd>/<kbd>c</kbd> para crear, editar o copiar; <kbd>Space</kbd> para cambiar el estado; <kbd>d</kbd> para eliminar; <kbd>P</kbd> para ejecutar la verificación previa y <kbd>A</kbd> para aplicar el borrador validado.

El editor ofrece `Source IP mode` con los valores `OFF`, `ALLOWLIST` y `DENYLIST`. Introduce direcciones IPv4/IPv6 literales y CIDR separados por comas en `Source IPs / CIDRs`. La verificación previa debe superarse antes de aplicar; el flujo existente de revision/ETag evita que un editor obsoleto sobrescriba una configuración más reciente.

## Cuándo usarla

La TUI es la forma más rápida de responder a la pregunta "¿qué está haciendo vmflow ahora mismo?" sin recolectar métricas. Para historial a largo plazo, apunta Prometheus a `/metrics` en su lugar — la TUI solo muestra el estado actual en memoria.
