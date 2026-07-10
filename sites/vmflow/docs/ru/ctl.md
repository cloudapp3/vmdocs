---
title: vmflow ctl
description: Опрос и управление работающим демоном vmflow — health, rules, stats, metrics, precheck, reload.
---

# vmflow ctl

```bash
vmflow ctl [-addr http://127.0.0.1:19090] [-token TOKEN] <subcommand>
```

Псевдоним: `vmflow c`.

`ctl` — тонкий клиент над [control API](./api). Он обращается к демону по адресу `-addr` и аутентифицируется через `-token` (или `VMFLOW_CONTROL_TOKEN`), если включена аутентификация. Полный набор общих клиентских флагов — включая TLS/mTLS и пользовательские заголовки — приведён в разделе [Общие клиентские флаги](./commands#common-client-flags).

## Подкоманды

| Подкоманда | Вызывает | Описание |
| --- | --- | --- |
| `health` | `GET /healthz` | Состояние демона и количество работающих правил. |
| `rules` | `GET /v1/rules` | Список работающих правил. |
| `stats` | `GET /v1/stats` | Счётчики трафика по каждому правилу (снимок в памяти). |
| `metrics` | `GET /metrics` | Текстовое представление Prometheus. |
| `precheck` | `POST /v1/precheck` | Проверка текущей конфигурации без применения. |
| `reload` | `POST /v1/reload` | Перезагрузка конфигурации и повторное применение после предпроверки. |

## Примеры

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
Изменяющие подкоманды (`reload`) требуют токен `admin`, если включена аутентификация. Подкоманды только для чтения работают с токеном `viewer`.
:::
