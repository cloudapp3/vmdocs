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
| **Dashboard** | Salud, totales de reenvío, uptime, interfaces Host Network y tasas RX/TX del daemon conectado. |
| **Rules** | Reglas, tráfico y cuotas en vivo, cambios preparados y resumen Source IP. |
| **Detail** | Bandwidth/quota de la regla, Source IP, tráfico, uso de cuota y contadores de rechazo. |

## Gestión de reglas

Un token `admin` autenticado puede crear, editar, copiar, habilitar, deshabilitar y eliminar reglas. Los tokens viewer y las sesiones sin autenticación son de solo lectura. En la vista Rules, usa <kbd>n</kbd>/<kbd>e</kbd>/<kbd>c</kbd> para crear, editar o copiar; <kbd>Space</kbd> para cambiar el estado; <kbd>d</kbd> para eliminar; <kbd>P</kbd> para ejecutar la verificación previa y <kbd>A</kbd> para aplicar el borrador validado.

El editor ofrece `Source IP mode` con los valores `OFF`, `ALLOWLIST` y `DENYLIST`. Introduce direcciones IPv4/IPv6 literales y CIDR separados por comas en `Source IPs / CIDRs`. La verificación previa debe superarse antes de aplicar; el flujo existente de revision/ETag evita que un editor obsoleto sobrescriba una configuración más reciente.

El editor básico incluye rate compartido y cuotas diaria/mensual; las opciones avanzadas incluyen upload/download y timezone. Aplicar reinicia la regla, pero conserva el uso del mismo `rule_id`.

Host Network está dentro de Dashboard. <kbd>4</kbd> salta a la sección y <kbd>a</kbd> alterna interfaces físicas activas o todas. Los datos pertenecen al host del daemon conectado incluso mediante SSH tunnel; no son cuotas vmflow ni una prueba de velocidad.

## Cuándo usarla

La TUI es la forma más rápida de responder a la pregunta "¿qué está haciendo vmflow ahora mismo?" sin recolectar métricas. Para historial a largo plazo, apunta Prometheus a `/metrics` en su lugar — la TUI solo muestra el estado actual en memoria.
