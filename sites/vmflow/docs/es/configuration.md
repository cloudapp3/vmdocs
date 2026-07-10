---
title: Configuración
description: Referencia de configuración YAML de vmflow — dirección de control, TLS, logs, tokens de autenticación y reglas de reenvío.
---

# Configuración

vmflow se rige por un único archivo YAML. Pásalo al daemon con `-config`:

```bash
vmflow daemon -config ./examples/config.yaml
```

Una recarga vuelve a leer este archivo y aplica el nuevo estado deseado (consulta [Reglas y ciclo de vida](./rules)).

## Ejemplo completo

```yaml
version: 1
control_listen_addr: 127.0.0.1:19090

log:
  level: info
  format: text # text or json

# Enable auth (or set control_tls.client_ca_file for mTLS) before exposing
# control_listen_addr outside localhost; otherwise the daemon refuses to start.
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
    remark: example
```

## Campos de nivel superior

| Campo | Descripción |
| --- | --- |
| `version` | Versión del esquema de configuración. Actualmente `1`. |
| `control_listen_addr` | Dirección de escucha de la API de control local. Por defecto `127.0.0.1:19090`; mantén en loopback salvo que habilites auth o mTLS. |
| `control_tls` | TLS / mTLS opcional para la API de control (ver `control_tls` más abajo). |
| `log` | Logging estructurado — `level` y `format`. |
| `auth` | Auth por bearer token con roles `admin` / `viewer`. |
| `bot_token`, `bot_chat` | Bot de Telegram — consulta [Bot de Telegram](./telegram-bot). |
| `rules` | Reglas de reenvío (ver `rules[]` más abajo). |

## `control_tls`

TLS opcional (y TLS mutuo) para la API de control. El TLS está activo cuando se definen tanto `cert_file` como `key_file`; definir `client_ca_file` habilita el TLS mutuo.

```yaml
control_tls:
  cert_file: /etc/vmflow/server.pem
  key_file: /etc/vmflow/server.key
  client_ca_file: /etc/vmflow/client-ca.pem   # optional → mTLS
  min_version: "1.2"                           # "1.2" (default) or "1.3"
```

| Campo | Descripción |
| --- | --- |
| `cert_file` | Ruta del certificado del servidor. |
| `key_file` | Ruta de la clave del servidor. |
| `client_ca_file` | Bundle de CA para certificados de cliente. Definirlo habilita el **TLS mutuo** y satisface la verificación de seguridad de arranque fuera de loopback. |
| `min_version` | `1.2` (por defecto) o `1.3`. |

Consulta [HTTP API → TLS y TLS mutuo](./api#tls-and-mutual-tls). Los clientes usan `-tls-ca-file`, `-tls-client-cert`, `-tls-client-key` y `-tls-skip-verify`; consulta [Flags comunes de cliente](./commands#common-client-flags).

## `log`

| Campo | Valores |
| --- | --- |
| `level` | Nivel de log (p. ej. `debug`, `info`, `warn`, `error`). |
| `format` | `text` o `json`. |

## `auth`

Autenticación por bearer token para la API de control. Consulta [HTTP API](./api#authentication).

| Campo | Descripción |
| --- | --- |
| `enabled` | Si es `false`, la API de control trata las peticiones como un llamador anónimo de nivel admin — solo es seguro en loopback. |
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
| `remark` | Nota de texto libre. |

::: tip
Los protocolos `http` y `https` existen en el código fuente pero están deshabilitados en el build actual. La validación los rechaza. Consulta la [referencia de reenvío](./forwarding).
:::

## Otros campos

Además de las secciones anteriores, la configuración admite campos para el bot de Telegram y para ACME/certificados. Los campos del bot y `control_tls` están **activos**; los campos ACME/certificados están reservados para cuando se rehabilite el soporte HTTPS y de momento se ignoran.

| Campo | Estado |
| --- | --- |
| `control_tls` | Activo — consulta `control_tls` más arriba y [HTTP API](./api#tls-and-mutual-tls). |
| `bot_token`, `bot_chat` | Activos — consulta [Bot de Telegram](./telegram-bot). |
| `acme_*`, `cert_cache_dir`, `cert_review.*` | Reservados (ignorados en el build actual). |
