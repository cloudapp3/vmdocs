---
title: Configuración
description: Referencia YAML de vmflow para gestión local, logs, autenticación, estadísticas, reglas de reenvío y políticas de acceso por IP de origen.
---

# Configuración

vmflow se rige por un único archivo YAML. Pásalo al daemon con `-config`:

```bash
vmflow -config ./examples/config.yaml
```

Una recarga vuelve a leer este archivo y aplica el nuevo estado deseado (consulta [Reglas y ciclo de vida](./rules)).

## Ejemplo completo

```yaml
version: 1
control_port: 19090

log:
  level: info
  format: text # text or json

# La gestión siempre se enlaza a 127.0.0.1; solo se configura el puerto.
# The CLI/TUI can pass the token with -token or VMFLOW_CONTROL_TOKEN.
auth:
  enabled: false
  tokens:
    - name: admin
      token: change-me
      role: admin

rules:
  - rule_id: ssh-forward
    name: ssh-forward
    protocol: tcp
    listen_addr: 0.0.0.0
    listen_port: 2201
    target_addr: 127.0.0.1
    target_port: 22
    enabled: true
    speed_limit: 0
    max_conn: 0
    source_ip_mode: allowlist
    source_ips:
      - 203.0.113.8
      - 198.51.100.0/24
      - 2001:db8:100::/48
    remark: example
```

## Campos de nivel superior

| Campo | Descripción |
| --- | --- |
| `version` | Versión del esquema de configuración. Actualmente `1`. |
| `control_port` | Puerto de gestión local. Por defecto `19090`; el host siempre es `127.0.0.1`. |
| `log` | Logging estructurado — `level` y `format`. |
| `auth` | Auth por bearer token con roles `admin` / `viewer`. |
| `bot_token`, `bot_chat` | Bot de Telegram — consulta [Bot de Telegram](./telegram-bot). |
| `rules` | Reglas de reenvío (ver `rules[]` más abajo). |

## `log`

| Campo | Valores |
| --- | --- |
| `level` | Nivel de log (p. ej. `debug`, `info`, `warn`, `error`). |
| `format` | `text` o `json`. |

## `auth`

Autenticación Bearer token para la gestión CLI/TUI.

| Campo | Descripción |
| --- | --- |
| `enabled` | Exige tokens configurados a las herramientas locales de gestión. |
| `tokens[].name` | Etiqueta para el token (no se usa para auth). |
| `tokens[].token` | La cadena del bearer token. |
| `tokens[].role` | `admin` (lectura + escritura) o `viewer` (solo lectura). |

## `rules[]`

Cada entrada describe una regla de reenvío.

| Campo | Descripción |
| --- | --- |
| `rule_id` | ID único y estable, usado para diffing entre recargas. |
| `name` | Nombre legible por humanos. |
| `protocol` | `tcp`, `udp` o `tcp+udp`. |
| `listen_addr` | Dirección en la que escuchar (p. ej. `0.0.0.0`). |
| `listen_port` | Puerto en el que escuchar. |
| `target_addr` | Dirección upstream a la que reenviar. |
| `target_port` | Puerto upstream. |
| `enabled` | Si es `false`, la regla se mantiene en la configuración pero no se inicia. |
| `speed_limit` | Límite de tasa por conexión en bytes/s (`0` = ilimitado). |
| `max_conn` | Máximo de conexiones concurrentes (`0` = ilimitado). Las conexiones nuevas por encima del tope se cierran. |
| `idle_timeout` | Tiempo de inactividad por conexión en segundos (`0` = 5 minutos por defecto). Cambiarlo reinicia la regla. |
| `source_ip_mode` | Modo de admisión por IP de origen: `off`, `allowlist` o `denylist`. Si se omite, se usa `off`. |
| `source_ips` | Direcciones IPv4/IPv6 literales o CIDR usadas por el modo seleccionado. Máximo de 256 entradas por regla. |
| `remark` | Nota de texto libre. |

## Política de acceso por IP de origen

`allowlist` solo acepta orígenes que coincidan con `source_ips`. `denylist` rechaza los orígenes coincidentes y acepta el resto. Una lista de permitidos o denegados activa debe contener al menos una entrada; se rechazan nombres de host, direcciones no válidas, entradas vacías y listas de más de 256 entradas.

TCP comprueba el socket peer antes de consumir `max_conn` o conectarse al destino. UDP lo comprueba antes de crear una sesión o consumir los límites de sesiones UDP de la regla o globales. Cambiar el modo o el conjunto efectivo de entradas reinicia la regla y cierra las conexiones TCP y sesiones UDP existentes, por lo que la nueva política se aplica de inmediato.

La política ve el socket peer real. Detrás de NAT o de un proxy L4, este puede ser la dirección de la puerta de enlace o del proxy, no la del cliente original. vmflow no confía en cabeceras HTTP reenviadas ni en metadatos de PROXY protocol. Usa un firewall de nube, un security group o el firewall del host como primera capa frente a ataques de gran volumen.

::: tip
Los protocolos `http` y `https` existen en el código fuente pero están deshabilitados en el build actual. La validación los rechaza. Consulta la [referencia de reenvío](./forwarding).
:::

## Otros campos

Además, la configuración acepta campos del bot de Telegram y campos ACME/certificados reservados. Consulta [Telegram Bot](./telegram-bot) para los campos activos.

| Campo | Estado |
| --- | --- |
| `bot_token`, `bot_chat` | Activos — consulta [Bot de Telegram](./telegram-bot). |
| `acme_*`, `cert_cache_dir`, `cert_review.*` | Reservados (ignorados en el build actual). |
