---
title: HTTP API
description: La API de control local de vmflow — autenticación, TLS/mTLS, health, rules, stats, precheck, reload y métricas de Prometheus.
---

# HTTP API

El daemon expone una API de control local. La dirección de escucha por defecto es `127.0.0.1:19090`. La CLI y la TUI son clientes ligeros sobre estos endpoints.

## Autenticación {#authentication}

La API de control admite auth por bearer token con dos roles.

```yaml
auth:
  enabled: true
  tokens:
    - name: admin
      token: change-me
      role: admin
    - name: viewer
      token: view-only
      role: viewer
```

```bash
curl -H "Authorization: Bearer change-me" http://127.0.0.1:19090/v1/stats
```

```bash
vmflow ctl -token change-me stats
VMFLOW_CONTROL_TOKEN=change-me vmflow tui
```

| Rol | Permitido |
| --- | --- |
| `viewer` | Endpoints de lectura: `health`, `rules`, `stats`, `metrics`. |
| `admin` | Todo lo que puede hacer `viewer`, más `reload`. |

Los tokens se comparan en tiempo constante. Cuando `auth.enabled: false`, las peticiones se tratan como un llamador anónimo de nivel admin — solo es seguro en loopback.

Un bind no loopback con auth deshabilitado **se niega a arrancar** (fail-closed). Vincula a `127.0.0.1`, habilita `auth`, habilita TLS mutuo (`control_tls.client_ca_file`) o pasa `-insecure-allow-remote-control` al daemon para reincorporarte. La auth fallida reiterada desde una IP de peer (10 intentos en 1 minuto) se regula con HTTP `429` y se bloquea durante un minuto; esto es best-effort (por IP de peer, se reinicia al rearrancar).

## TLS y TLS mutuo {#tls-and-mutual-tls}

La API de control puede servir sobre TLS y, opcionalmente, exigir certificados de cliente (TLS mutuo). Configúralo bajo `control_tls`:

```yaml
control_listen_addr: 0.0.0.0:19090
control_tls:
  cert_file: /etc/vmflow/server.pem
  key_file:  /etc/vmflow/server.key
  client_ca_file: /etc/vmflow/client-ca.pem   # optional → enables mTLS
  min_version: "1.2"                           # "1.2" (default) or "1.3"
```

- El TLS está activo cuando se definen **ambos**, `cert_file` y `key_file`.
- Definir `client_ca_file` activa el **TLS mutuo**: cada cliente debe presentar un certificado firmado por esa CA. mTLS también satisface la verificación de seguridad de arranque fuera de loopback mencionada más arriba.
- Los clientes pasan su bundle de CA y su certificado de cliente vía `-tls-ca-file`, `-tls-client-cert`, `-tls-client-key` (o las variables de entorno `VMFLOW_TLS_*`). Consulta [Flags comunes de cliente](./commands#common-client-flags).

mTLS es la forma recomendada de exponer la API de control fuera de loopback (por ejemplo, detrás de un Cloudflare Tunnel) sin abrir un puerto de entrada.

## `GET /healthz`

Salud del daemon.

```json
{
  "ok": true,
  "running_rules": 1,
  "time": 1760000000
}
```

## `GET /v1/rules`

Reglas en ejecución.

```json
{
  "items": [
    {
      "rule_id": "ssh-forward",
      "name": "ssh-forward",
      "protocol": "tcp",
      "listen_addr": "0.0.0.0",
      "listen_port": 2201,
      "target_addr": "127.0.0.1",
      "target_port": 22,
      "enabled": true
    }
  ]
}
```

## `GET /v1/stats`

Contadores en memoria por regla.

```json
{
  "items": [
    {
      "rule_id": "ssh-forward",
      "upload_bytes": 1024,
      "download_bytes": 2048,
      "conns": 1,
      "updated_time": 1760000000
    }
  ]
}
```

## `GET|POST /v1/precheck`

Valida la configuración actual **sin aplicarla**. `reload` ejecuta las mismas comprobaciones; cualquier error rechaza la recarga.

Comprobaciones: validación de reglas, `rule_id` duplicado, conflictos de listener, capacidad de bind del puerto de escucha, resolución DNS del destino y advertencias de privilegio de puerto bajo. (Las comprobaciones de dominio HTTPS y de ACME están deshabilitadas en el build actual.)

```bash
vmflow ctl precheck
```

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

Consulta [Verificación previa](./precheck) para la lista completa de comprobaciones.

## `GET /metrics`

Exposición en texto de Prometheus. Ejemplo:

```text
vmflow_rule_upload_bytes_total{rule_id="ssh-forward",protocol="tcp"} 1024
vmflow_rule_download_bytes_total{rule_id="ssh-forward",protocol="tcp"} 2048
vmflow_rule_connections{rule_id="ssh-forward",protocol="tcp"} 1
vmflow_control_requests_total{method="GET",path="/v1/stats",status="200"} 10
vmflow_reload_total{status="ok"} 1
vmflow_rule_apply_total{action="started",status="ok"} 1
```

Familias de métricas:

- `vmflow_build_info`
- `vmflow_uptime_seconds`
- `vmflow_rule_running{rule_id,protocol}`
- `vmflow_rule_connections{rule_id,protocol}`
- `vmflow_rule_upload_bytes_total{rule_id,protocol}`
- `vmflow_rule_download_bytes_total{rule_id,protocol}`
- `vmflow_control_requests_total{method,path,status}`
- `vmflow_control_request_duration_seconds_sum{method,path,status}`
- `vmflow_reload_total{status}`
- `vmflow_rule_apply_total{action,status}`

## `POST /v1/reload`

Recarga el archivo de configuración y ejecuta `ApplySnapshot(replace_all=true)` tras la verificación previa.

```json
{
  "config_path": "./examples/config.yaml",
  "control_listen_addr": "127.0.0.1:19090",
  "rule_count": 1,
  "result": {
    "applied_rules": 1,
    "stopped_rules": 0,
    "failed_rules": 0,
    "total_rules": 1,
    "items": []
  }
}
```

::: warning Endpoints deshabilitados
Los endpoints de certificados `/v1/certs*` existen en el código fuente pero **no se registran** en el build actual (HTTPS/ACME está deshabilitado).
:::
