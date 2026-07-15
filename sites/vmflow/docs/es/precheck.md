---
title: Verificación previa
description: Valida una configuración de vmflow antes de aplicarla — IDs duplicados, conflictos de listener, capacidad de bind de puertos y resolución DNS.
---

# Verificación previa

La verificación previa valida una configuración **sin aplicarla**. Se ejecuta automáticamente antes de cada `reload`, y puedes ejecutarla bajo demanda para comprobar con seguridad un cambio de configuración.

## Ejecútala

```bash
vmflow ctl precheck
```

Ejecuta `vmflow ctl precheck` para validar la configuración actual.

## Qué comprueba

La verificación previa produce una lista de hallazgos, cada uno de ellos un **error** o una **advertencia**. Los errores bloquean una recarga; las advertencias, no.

| Comprobación | Severidad | Notas |
| --- | --- | --- |
| Validación del modelo de regla | error | Campos de regla mal formados. |
| `duplicate_rule_id` | error | El mismo ID aparece más de una vez en la instantánea. |
| Conflicto de listener | error | Dos reglas reclaman el mismo `listen_addr:port`. |
| Capacidad de bind del puerto | error | Realmente intenta hacer bind del puerto de escucha para confirmar que está disponible. |
| Resolución DNS del destino | error | `target_addr` debe resolver. |
| Configuración de dominio HTTPS | — | _Deshabilitado en el build actual_ (los protocolos http/https se rechazan). |
| Dirección ACME HTTP-01 | — | _Deshabilitado en el build actual_ (el subsistema ACME está apagado). |
| Privilegio de puerto bajo | advertencia | Hacer bind de puertos privilegiados (<1024) suele necesitar permisos elevados. |

## Respuesta de ejemplo

```json
{
  "config_path": "./examples/config.yaml",
  "rule_count": 1,
  "result": {
    "ok": true,
    "error_count": 0,
    "warning_count": 0,
    "checked_rules": 1,
    "checked_time_ms": 1,
    "items": []
  }
}
```

## Cómo la usa la recarga

`vmflow ctl reload` ejecuta primero las mismas comprobaciones. Si `error_count > 0`, la recarga se rechaza y las reglas en ejecución quedan exactamente como estaban. Esto hace seguro enviar cambios de configuración mediante automatización: una configuración rota no puede aplicarse parcialmente.

::: warning Puertos locales
La sonda de capacidad de bind abre brevemente un listener local. Si tu entorno bloquea la creación de sockets locales, la verificación previa (y por tanto la recarga) no puede validar completamente la capacidad de bind.
:::
