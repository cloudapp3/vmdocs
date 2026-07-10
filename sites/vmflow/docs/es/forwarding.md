---
title: Motor de reenvío
description: Cómo reenvía vmflow el tráfico TCP, UDP y tcp+udp, con limitación de velocidad por regla, topes de conexiones y contadores de tráfico.
---

# Motor de reenvío

El paquete `engine/` es el núcleo puro de reenvío. Es propietario de los listeners, los bucles de proxy, las sesiones, los contadores y el ciclo de vida de las reglas — y nada más. No depende de una base de datos, un plano de control ni una interfaz. Eso es lo que lo mantiene embebible.

## Protocolos

Cada regla elige un protocolo mediante el campo `protocol`.

| Protocolo | Comportamiento |
| --- | --- |
| `tcp` | Reenvío de puertos TCP. |
| `udp` | Reenvío de puertos UDP. |
| `tcp+udp` | Reenvía tanto TCP como UDP en el mismo puerto desde una única regla. |
| `http` | Proxy de reenvío HTTP (plano + `CONNECT`). **Deshabilitado en el build actual.** |
| `https` | Reenvío con terminación TLS y certificados por dominio. **Deshabilitado en el build actual.** |

`http` y `https` existen en el código fuente (`engine/https.go`, `engine/proxy.go`) junto a los paquetes ACME/certstore, pero el build actual los rechaza en la validación y no conecta la gestión de certificados. Quedan reservados para rehabilitarse más adelante.

## Controles por regla

Cada regla lleva controles de ejecución independientes del protocolo:

- **`speed_limit`** — límite de tasa bidireccional por conexión (token bucket), en bytes/s. `0` significa ilimitado. Es intencionadamente simple y por sesión; no es un bucket compartido global de ancho de banda.
- **`max_conn`** — tope de conexiones concurrentes. Cuando se alcanza el tope, las conexiones nuevas se cierran de inmediato. `0` significa ilimitado.
- **`idle_timeout`** — tiempo de inactividad por conexión en segundos. `0` significa usar el valor por defecto (5 minutos / 300 s). Cambiarlo reinicia la regla.
- **`enabled`** — una regla deshabilitada se mantiene en la configuración (y en las instantáneas) pero no se inicia.

## Contadores de tráfico

Cada regla en ejecución reporta contadores en tiempo real:

- recuento actual de conexiones
- total de bytes de subida
- total de bytes de bajada

Los contadores viven solo en memoria. Para UDP, el recuento de conexiones es una aproximación tipo sesión. Léelos mediante [`GET /v1/stats`](./api#get-v1-stats) o las superficies `vmflow ctl stats` / TUI.

## Equivalencia de reglas

Las reglas llevan tanto campos de ejecución (protocolo, direcciones, puertos, límites, `idle_timeout`) como metadatos (`remark`, `revision`, timestamps). El motor compara solo los campos de ejecución al hacer diff de una nueva instantánea frente al estado en vivo, de modo que los cambios cosméticos no provocan reinicios innecesarios — pero cambiar `idle_timeout` sí dispara un reinicio. Consulta [Reglas y ciclo de vida](./rules).
