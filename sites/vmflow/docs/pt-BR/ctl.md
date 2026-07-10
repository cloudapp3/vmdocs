---
title: vmflow ctl
description: Consulta e controla um daemon vmflow em execução — health, rules, stats, metrics, precheck, reload.
---

# vmflow ctl

```bash
vmflow ctl [-addr http://127.0.0.1:19090] [-token TOKEN] <subcommand>
```

Alias: `vmflow c`.

`ctl` é um cliente fino sobre a [control API](./api). Ele tem como alvo o daemon em `-addr` e autentica com `-token` (ou `VMFLOW_CONTROL_TOKEN`) quando a autenticação está habilitada. O conjunto completo de flags de cliente compartilhadas — incluindo TLS/mTLS e cabeçalhos personalizados — está listado em [Flags comuns de cliente](./commands#common-client-flags).

## Subcomandos

| Subcomando | Mapeia para | Descrição |
| --- | --- | --- |
| `health` | `GET /healthz` | Saúde do daemon e contagem de regras em execução. |
| `rules` | `GET /v1/rules` | Lista as regras em execução. |
| `stats` | `GET /v1/stats` | Contadores de tráfego por regra (snapshot em memória). |
| `metrics` | `GET /metrics` | Exposição em formato de texto do Prometheus. |
| `precheck` | `POST /v1/precheck` | Valida a configuração atual sem aplicá-la. |
| `reload` | `POST /v1/reload` | Recarrega a configuração e reaplica após o precheck. |

## Exemplos

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
Subcomandos de mutação (`reload`) exigem um token `admin` quando a autenticação está habilitada. Subcomandos somente leitura funcionam com um token `viewer`.
:::
