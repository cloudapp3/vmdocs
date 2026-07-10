---
title: vmflow ctl
description: Consulta y controla un daemon de vmflow en ejecución — health, rules, stats, metrics, precheck, reload.
---

# vmflow ctl

```bash
vmflow ctl [-addr http://127.0.0.1:19090] [-token TOKEN] <subcomando>
```

Alias: `vmflow c`.

`ctl` es un cliente ligero sobre la [API de control](./api). Se dirige al daemon en `-addr` y se autentica con `-token` (o `VMFLOW_CONTROL_TOKEN`) cuando auth está habilitado. El conjunto completo de flags de cliente compartidas — incluidas TLS/mTLS y cabeceras personalizadas — se lista en [Flags comunes de cliente](./commands#common-client-flags).

## Subcomandos

| Subcomando | Mapea a | Descripción |
| --- | --- | --- |
| `health` | `GET /healthz` | Salud del daemon y recuento de reglas en ejecución. |
| `rules` | `GET /v1/rules` | Lista las reglas en ejecución. |
| `stats` | `GET /v1/stats` | Contadores de tráfico por regla (instantánea en memoria). |
| `metrics` | `GET /metrics` | Exposición en texto de Prometheus. |
| `precheck` | `POST /v1/precheck` | Valida la configuración actual sin aplicar. |
| `reload` | `POST /v1/reload` | Recarga la configuración y reaplica tras la verificación previa. |

## Ejemplos

```bash
vmflow ctl health
vmflow ctl rules
vmflow ctl stats
vmflow ctl reload
vmflow ctl -token change-me reload

# against a TLS-protected control API using a private CA and mTLS client cert
vmflow ctl -addr https://10.0.0.5:19090 \
  -tls-ca-file ca.pem -tls-client-cert client.pem -tls-client-key client.key \
  reload

# send an extra header (e.g. a Cloudflare Access service token)
vmflow ctl -H "CF-Access-Client-Id: xxx" -H "CF-Access-Client-Secret: yyy" reload
```

::: tip
Los subcomandos que mutan estado (`reload`) requieren un token `admin` cuando auth está habilitado. Los subcomandos de solo lectura funcionan con un token `viewer`.
:::
