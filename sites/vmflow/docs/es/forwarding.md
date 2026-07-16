---
title: Motor de reenvío
description: Cómo reenvía vmflow el tráfico TCP, UDP y tcp+udp, con acceso por IP de origen, limitación de velocidad, topes de conexiones y contadores por regla.
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
- **`source_ip_mode` / `source_ips`** — `off`, una lista de permitidos IPv4/IPv6 o una lista de denegados IPv4/IPv6. Las entradas pueden ser direcciones literales o CIDR, hasta 256 por regla.
- **`enabled`** — una regla deshabilitada se mantiene en la configuración (y en las instantáneas) pero no se inicia.

## Admisión por IP de origen

TCP evalúa el socket peer después de `Accept`, pero antes de reservar el cupo de conexiones o conectarse al destino. UDP evalúa el datagrama de origen antes de crear una sesión o consumir los cupos de sesiones UDP. El tráfico rechazado no consume capacidad de reenvío.

Cambiar la política efectiva de origen reinicia la regla y cierra las conexiones TCP y sesiones UDP existentes. Reordenar CIDR equivalentes no provoca un reinicio. La política usa exclusivamente el socket peer: vmflow no confía en cabeceras HTTP reenviadas ni en metadatos de PROXY protocol, y un NAT o proxy L4 upstream puede ocultar la dirección del cliente original.

## Contadores de tráfico

Cada regla en ejecución reporta contadores en tiempo real:

- recuento actual de conexiones
- total de bytes de subida
- total de bytes de bajada
- total de rechazos por IP de origen (intentos de conexión TCP o datagramas UDP)

Consulta los contadores con `vmflow ctl stats` o la TUI. Los rechazos de la política de origen también se exportan como `vmflow_rule_source_ip_denied_total`. Cuando la persistencia de estadísticas está habilitada, el total de rechazos se conserva tras reiniciar el daemon. En UDP, el número de conexiones aproxima las sesiones.

## Equivalencia de reglas

Las reglas llevan tanto campos de ejecución (protocolo, direcciones, puertos, límites, `idle_timeout`, política de IP de origen) como metadatos (`remark`, `revision`, timestamps). El motor compara solo los campos de ejecución al hacer diff de una nueva instantánea frente al estado en vivo, de modo que los cambios cosméticos no provocan reinicios innecesarios — pero cambiar `idle_timeout` o la política efectiva de origen sí dispara un reinicio. Consulta [Reglas y ciclo de vida](./rules).
