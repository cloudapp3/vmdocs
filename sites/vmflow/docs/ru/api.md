---
title: HTTP API
description: Локальный control API vmflow — аутентификация, TLS/mTLS, health, rules, stats, precheck, reload и метрики Prometheus.
---

# HTTP API

Демон предоставляет локальный control API. Адрес прослушивания по умолчанию — `127.0.0.1:19090`. CLI и TUI — тонкие клиенты над этими конечными точками.

## Аутентификация {#authentication}

Control API поддерживает аутентификацию по токену-носителю (bearer token) с двумя ролями.

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

| Роль | Разрешено |
| --- | --- |
| `viewer` | Конечные точки чтения: `health`, `rules`, `stats`, `metrics`. |
| `admin` | Всё, что может `viewer`, плюс `reload`. |

Токены сравниваются за константное время. Когда `auth.enabled: false`, запросы считаются анонимным вызывающим с уровнем admin — это безопасно только на loopback.

Привязка к адресу, отличному от loopback, с отключённой аутентификацией **отказывается запускаться** (fail-closed). Привяжитесь к `127.0.0.1`, включите `auth`, включите mutual TLS (`control_tls.client_ca_file`) или передайте демону `-insecure-allow-remote-control`, чтобы явно согласиться. Повторяющиеся неудачные аутентификации с одного peer IP (10 попыток в течение 1 минуты) throttлятся ответом HTTP `429` и блокируются на одну минуту; это best-effort (по peer IP, сбрасывается при перезапуске).

## TLS и mutual TLS {#tls-and-mutual-tls}

Control API может работать поверх TLS и при необходимости требовать клиентские сертификаты (mutual TLS). Настройте это в `control_tls`:

```yaml
control_listen_addr: 0.0.0.0:19090
control_tls:
  cert_file: /etc/vmflow/server.pem
  key_file:  /etc/vmflow/server.key
  client_ca_file: /etc/vmflow/client-ca.pem   # optional → enables mTLS
  min_version: "1.2"                           # "1.2" (default) or "1.3"
```

- TLS активен, когда заданы **оба** значения `cert_file` и `key_file`.
- Установка `client_ca_file` включает **mutual TLS**: каждый клиент должен предъявить сертификат, подписанный этим CA. mTLS также удовлетворяет описанной выше проверке безопасности при запуске для не-loopback адресов.
- Клиенты передают свой CA-бандл и клиентский сертификат через `-tls-ca-file`, `-tls-client-cert`, `-tls-client-key` (или переменные окружения `VMFLOW_TLS_*`). См. [Общие клиентские флаги](./commands#common-client-flags).

mTLS — рекомендуемый способ открыть control API за пределами loopback (например, за Cloudflare Tunnel) без открытия входящего порта.

## `GET /healthz`

Состояние демона.

```json
{
  "ok": true,
  "running_rules": 1,
  "time": 1760000000
}
```

## `GET /v1/rules`

Работающие правила.

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

Счётчики в памяти по каждому правилу.

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

Проверка текущей конфигурации **без её применения**. `reload` выполняет те же проверки; любая ошибка отклоняет перезагрузку.

Проверки: валидация правил, дублирование `rule_id`, конфликты слушателей, возможность привязки listen-порта, разрешение DNS цели и предупреждения о привилегиях для низких портов. (Проверки HTTPS-доменов и ACME отключены в текущей сборке.)

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

Полный список проверок см. в разделе [Предпроверка](./precheck).

## `GET /metrics`

Текстовое представление Prometheus. Пример:

```text
vmflow_rule_upload_bytes_total{rule_id="ssh-forward",protocol="tcp"} 1024
vmflow_rule_download_bytes_total{rule_id="ssh-forward",protocol="tcp"} 2048
vmflow_rule_connections{rule_id="ssh-forward",protocol="tcp"} 1
vmflow_control_requests_total{method="GET",path="/v1/stats",status="200"} 10
vmflow_reload_total{status="ok"} 1
vmflow_rule_apply_total{action="started",status="ok"} 1
```

Семейства метрик:

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

Перезагружает файл конфигурации и выполняет `ApplySnapshot(replace_all=true)` после предпроверки.

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

::: warning Отключённые конечные точки
Конечные точки сертификатов `/v1/certs*` присутствуют в исходном коде, но **не зарегистрированы** в текущей сборке (HTTPS/ACME отключён).
:::
