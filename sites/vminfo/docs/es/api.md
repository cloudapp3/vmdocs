---
title: HTTP API
description: HTTP API de solo lectura y endpoints WebSocket expuestos por el panel web de vminfo.
---

# HTTP API

`vminfo --web` inicia una HTTP API ligera y de solo lectura y un panel.

## Iniciar el servidor

```bash
vminfo --web
```

Dirección por defecto:

```text
http://127.0.0.1:20021
```

Dirección personalizada:

```bash
vminfo --web --bind 0.0.0.0 --port 8080 --interval 1s
```

## Autenticación

Por defecto, el panel y la API son locales y sin autenticar.

Cuando se habilita `--token`:

```bash
vminfo --web --token
vminfo --web --token my-secret
```

- `--token` sin argumento genera automáticamente un token seguro para URL
- `--token my-secret` usa un token fijo
- la primera visita exitosa a `/?token=...` establece una cookie para las peticiones posteriores
- `/healthz` sigue siendo público
- `/`, `/api/v1/*` y `/ws` requieren el token o la cookie de autenticación
- el modo protegido con token no expone un `Access-Control-Allow-Origin: *` permisible
- las peticiones WebSocket deben usar el mismo origen de navegador que el host del panel

## Endpoints

### `GET /healthz`

Comprobación de estado pública del proceso web.

```json
{
  "status": "ok",
  "ws_clients": 0
}
```

### `GET /api/v1/snapshot`

Devuelve la instantánea completa actual del panel.

```json
{
  "timestamp": "2026-06-14T12:00:00Z",
  "system": {},
  "cpu": {},
  "memory": {},
  "disk": {},
  "network": {},
  "load": {},
  "processes": {},
  "health": {}
}
```

### `GET /api/v1/cpu`

Devuelve los totales de CPU, el uso por núcleo y un historial corto de CPU en memoria.

### `GET /api/v1/memory`

Devuelve los totales de memoria y swap, el uso, la disponibilidad y los porcentajes.

### `GET /api/v1/disk`

Devuelve el uso del sistema de ficheros y las tasas de E/S de disco.

### `GET /api/v1/network`

Devuelve el rendimiento de red, los conteos de conexiones TCP/UDP y los contadores de interfaces.

En Linux, la respuesta también incluye la distribución de estados TCP (cuántos sockets hay en `ESTABLISHED`, `TIME_WAIT`, `SYN_RECV`, …) y el uso de conntrack (entradas `nf_conntrack` actuales frente al máximo), de forma que puedas detectar la saturación de sockets o del seguimiento de conexiones.

### `GET /api/v1/processes`

Devuelve la lista de procesos completada.

Parámetros de consulta admitidos:

| Parámetro | Descripción |
| --- | --- |
| `filter` | Coincidencia sin distinción de mayúsculas frente a PID, PPID, nombre, comando, usuario o estado |
| `q` | Alias de `filter` |
| `sort` | `cpu`, `mem`, `pid` o `name`; por defecto `cpu` |
| `limit` | Número máximo de filas devueltas; `0` u omitido significa sin límite |

Ejemplo:

```bash
curl 'http://127.0.0.1:20021/api/v1/processes?filter=ssh&sort=mem&limit=10'
```

Forma de la respuesta:

```json
{
  "total": 128,
  "list": [
    {
      "pid": 1234,
      "ppid": 1,
      "name": "sshd",
      "user": "root",
      "cpu_percent": 0.1,
      "mem_percent": 0.2,
      "rss": 12345678,
      "status": "S",
      "command": "sshd: user@pts/0",
      "threads": 1,
      "nice": 0,
      "uptime": 3600,
      "started_at_unix": 1781434800
    }
  ]
}
```

### `GET /api/v1/system`

Devuelve metadatos del host, SO/kernel/arquitectura, modelo/núcleos de CPU y tiempo de actividad.

### `GET /api/v1/health`

Devuelve la puntuación de salud ligera y los avisos que usa el panel.

```json
{
  "score": 90,
  "warnings": [
    {
      "level": "warning",
      "code": "disk_high",
      "message": "disk usage is 88.5%"
    }
  ]
}
```

El campo `code` identifica el aviso. Los códigos relacionados con la red incluyen:

| Código | Significado |
| --- | --- |
| `network_errors` | Tasa de errores sostenida por interfaz (eventos/s, no contadores acumulados) |
| `network_drops` | Tasa de paquetes descartados sostenida por interfaz |
| `tcpconn_high` | Número de sockets TCP inusualmente alto (≥5000 aviso / ≥20000 crítico) |
| `conntrack_high` | Tabla de conntrack llenándose (≥85% aviso / ≥95% crítico, Linux) |

Lo que dispara `network_errors` / `network_drops` son tasas, no contadores en bruto, de modo que un total acumulado durante mucho tiempo no mantiene marcado a un host que por lo demás está sano.

### `POST /api/v1/net/diag`

Ejecuta un diagnóstico de red bajo demanda — las mismas sondas que el [`comando net`](/es/net), invocable desde el panel. Está montado en el mux protegido, de modo que cuando la autenticación con token está habilitada hereda las comprobaciones de token / cookie y de mismo origen como las demás rutas `/api/v1/*`.

Cuerpo de la petición:

| Campo | Descripción |
| --- | --- |
| `action` | `dns`, `port`, `ping` o `ip` |
| `target` | Dominio (dns) u host (port/ping); obligatorio. Para `ip`, la IP a consultar o vacío para tu propia IP pública |
| `port` | Puerto de destino (acciones port / ping) |
| `server` | Servidor DNS opcional (dns) o URL base del servicio de consulta de IP (ip) |
| `timeout_ms` | Tiempo de espera por sonda en milisegundos (port / ping) |
| `count` | Número de sondas (ping) |
| `mode` | Modo ping: `tcp` (por defecto) o `icmp` |

Ejemplo:

```bash
curl -X POST http://127.0.0.1:20021/api/v1/net/diag \
  -H 'Content-Type: application/json' \
  -d '{"action":"ping","target":"example.com","port":443,"count":4,"mode":"tcp"}'
```

La forma de la respuesta coincide con el resultado JSON correspondiente de la CLI (`DNSResult`, `PortResult`, `PingResult` o `IPInfo`).

### `GET /ws`

Flujo WebSocket de instantáneas completas del panel.

- envía la instantánea más reciente inmediatamente tras la conexión
- envía instantáneas refrescadas a medida que el recolector se actualiza
- en modo protegido con token, la petición debe autenticarse y pasar las comprobaciones de mismo origen

## Ver también

- [Guía del panel web](/es/web-dashboard)
- [Referencia de comandos](/es/commands)
