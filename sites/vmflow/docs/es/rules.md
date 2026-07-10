---
title: Reglas y ciclo de vida
description: Gestiona las reglas de reenvío de vmflow — operaciones de regla única, aplicación de instantánea completa con diff incremental y consultas de estado.
---

# Reglas y ciclo de vida

Una *regla* es la unidad que gestiona vmflow: una entrada de reenvío `{protocol, listen, target}` con límites y metadatos. Las reglas tienen un ciclo de vida que puede gestionarse una a una o como una instantánea completa de estado deseado.

## Identidad estable

Cada regla tiene un `rule_id` que debe ser único dentro de una configuración/instantánea. El ID es la forma en que vmflow empareja una regla entrante con una en ejecución para decidir qué cambió. Mantén los IDs estables entre recargas — eso es lo que permite el diffing.

## Operaciones de regla única

| Operación | Efecto |
| --- | --- |
| `StartRule` | Inicia una regla (no debe estar ya en ejecución). |
| `RestartRule` | Detiene e inicia una regla en ejecución, recogiendo los nuevos campos. |
| `StopRule` | Detiene una regla en ejecución; conserva su configuración. |
| `RemoveRule` | Detiene y descarta una regla del conjunto en vivo. |

Son útiles para operaciones locales concretas. Cuando tienes un estado deseado completo, prefiere la aplicación de instantánea.

## Aplicación de instantánea

`ApplySnapshot(rules, opts)` toma el conjunto completo deseado de reglas y lo reconcilia con lo que está en ejecución. Con `ReplaceAll`, cualquier regla en ejecución ausente de la instantánea se detiene.

Para cada regla, la aplicación produce una acción:

| Acción | Significado |
| --- | --- |
| `started` | La regla está en la instantánea pero no estaba en ejecución. |
| `restarted` | La regla estaba en ejecución pero sus campos de ejecución cambiaron. |
| `stopped` | La regla estaba en ejecución pero está ausente de la instantánea (con `ReplaceAll`). |
| `removed` | La regla se detuvo y se descartó. |
| `unchanged` | La regla estaba en ejecución y sus campos de ejecución no cambiaron. |
| `failed` | No se pudo iniciar la regla (p. ej. puerto no disponible). |

…y un resumen: `Applied`, `Stopped`, `Failed`, `Total`.

::: tip ¿Qué cuenta como "cambiado"?
Solo se comparan los campos de ejecución (protocolo, dirección/puerto de escucha, dirección/puerto destino, límite de velocidad, máx. de conexiones, `idle_timeout`, habilitado). Editar `remark` o los timestamps **no** reinicia una regla.
:::

## Recarga

`POST /v1/reload` recarga el archivo de configuración y ejecuta `ApplySnapshot` con `ReplaceAll = true`. Ejecuta primero la [verificación previa](./precheck); ante cualquier error la recarga se rechaza y las reglas en ejecución quedan intactas.

## Consultas de estado

| Método | Devuelve |
| --- | --- |
| `RunningRules` / `RunningCount` | Reglas en ejecución actualmente / recuento. |
| `Snapshot(id)` | Estado en vivo de una regla. |
| `SnapshotAll()` | Estado en vivo de todas las reglas en ejecución. |
| `StopAll()` | Detener todo (p. ej. al apagar). |

Consulta [HTTP API](./api) para los equivalentes HTTP (`GET /v1/rules`, `GET /v1/stats`).
