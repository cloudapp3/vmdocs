---
title: Конфигурация
description: Справочник YAML-конфигурации vmflow — адрес control API, TLS, журналирование, токены аутентификации и правила перенаправления.
---

# Конфигурация

vmflow управляется единым YAML-файлом. Передайте его демону через `-config`:

```bash
vmflow daemon -config ./examples/config.yaml
```

При перезагрузке файл перечитывается и применяется новое желаемое состояние (см. [Правила и жизненный цикл](./rules)).

## Полный пример

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

## Поля верхнего уровня

| Поле | Описание |
| --- | --- |
| `version` | Версия схемы конфигурации. На данный момент `1`. |
| `control_listen_addr` | Адрес прослушивания локального control API. По умолчанию `127.0.0.1:19090`; держите его на loopback, если не включили аутентификацию или mTLS. |
| `control_tls` | Опциональный TLS / mTLS для control API (см. `control_tls` ниже). |
| `log` | Структурированное журналирование — `level` и `format`. |
| `auth` | Аутентификация по Bearer-токену с ролями `admin` / `viewer`. |
| `bot_token`, `bot_chat` | Telegram-бот — см. [Telegram-бот](./telegram-bot). |
| `rules` | Правила перенаправления (см. `rules[]` ниже). |

## `control_tls`

Опциональный TLS (и взаимный TLS) для control API. TLS активен, когда заданы оба поля `cert_file` и `key_file`; установка `client_ca_file` включает взаимный TLS.

```yaml
control_tls:
  cert_file: /etc/vmflow/server.pem
  key_file: /etc/vmflow/server.key
  client_ca_file: /etc/vmflow/client-ca.pem   # optional → mTLS
  min_version: "1.2"                           # "1.2" (default) or "1.3"
```

| Поле | Описание |
| --- | --- |
| `cert_file` | Путь к сертификату сервера. |
| `key_file` | Путь к ключу сервера. |
| `client_ca_file` | Набор CA для клиентских сертификатов. Установка этого поля включает **взаимный TLS** и удовлетворяет проверке безопасности запуска вне loopback. |
| `min_version` | `1.2` (по умолчанию) или `1.3`. |

См. [HTTP API → TLS и взаимный TLS](./api#tls-and-mutual-tls). Клиенты используют `-tls-ca-file`, `-tls-client-cert`, `-tls-client-key` и `-tls-skip-verify` — см. [Общие клиентские флаги](./commands#common-client-flags).

## `log`

| Поле | Значения |
| --- | --- |
| `level` | Уровень журналирования (например, `debug`, `info`, `warn`, `error`). |
| `format` | `text` или `json`. |

## `auth`

Аутентификация по Bearer-токену для control API. См. [HTTP API](./api#authentication).

| Поле | Описание |
| --- | --- |
| `enabled` | При `false` control API считает запросы анонимным вызывающим стороной уровня admin — это безопасно только на loopback. |
| `tokens[].name` | Метка токена (не используется для аутентификации). |
| `tokens[].token` | Строка Bearer-токена. |
| `tokens[].role` | `admin` (чтение + запись) или `viewer` (только чтение). |

## `rules[]`

Каждая запись описывает одно правило перенаправления.

| Поле | Описание |
| --- | --- |
| `rule_id` | Стабильный уникальный ID, используется для сравнения при перезагрузках. |
| `name` | Человекочитаемое имя. |
| `protocol` | `tcp`, `udp` или `tcp+udp`. |
| `listen_addr` | Адрес прослушивания (например, `0.0.0.0`). |
| `listen_port` | Порт прослушивания. |
| `target_addr` | Адрес вышестоящего узла для перенаправления. |
| `target_port` | Порт вышестоящего узла. |
| `enabled` | При `false` правило остаётся в конфигурации, но не запускается. |
| `speed_limit` | Ограничение скорости на соединение в байтах/сек (`0` = без ограничений). |
| `max_conn` | Максимум одновременных соединений (`0` = без ограничений). Новые соединения сверх лимита закрываются. |
| `idle_timeout` | Тайм-аут простоя на соединение в секундах (`0` = по умолчанию 5 минут). Изменение перезапускает правило. |
| `remark` | Произвольное примечание. |

::: tip
Протоколы `http` и `https` присутствуют в исходниках, но отключены в текущей сборке. Они отклоняются при валидации. См. [справочник по перенаправлению](./forwarding).
:::

## Прочие поля

Помимо описанных выше секций, конфигурация принимает поля Telegram-бота и ACME/сертификатов. Поля бота и `control_tls` **активны**; поля ACME/сертификатов зарезервированы на случай повторного включения поддержки HTTPS и в настоящее время игнорируются.

| Поле | Статус |
| --- | --- |
| `control_tls` | Активно — см. `control_tls` выше и [HTTP API](./api#tls-and-mutual-tls). |
| `bot_token`, `bot_chat` | Активно — см. [Telegram-бот](./telegram-bot). |
| `acme_*`, `cert_cache_dir`, `cert_review.*` | Зарезервировано (игнорируется в текущей сборке). |
