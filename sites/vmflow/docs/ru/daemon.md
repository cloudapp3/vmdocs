---
title: vmflow
description: Справочник CLI vmflow — foreground, ctl, tui, version, update, service и uninstall.
---

# vmflow

```bash
vmflow -config ./examples/config.yaml [-control-port 19090]
```

Режим foreground загружает конфигурацию, запускает внутренний канал управления только на loopback, применяет снимок правил и работает до `SIGINT` или `SIGTERM`.

## Флаги

| Флаг | По умолчанию | Описание |
| --- | --- | --- |
| `-config` | _(обязательный)_ | Путь к файлу конфигурации YAML. |
| `-control-port` | _(из конфигурации)_ | Переопределяет loopback-порт управления. |
| `-log-file` | _(stdout)_ | Писать журналы в этот файл вместо stdout (полезно под сервис-менеджером; обязательно на Windows). |

## Поведение во время выполнения

- При запуске правила применяются через снимок (`ReplaceAll`). См. [Правила и жизненный цикл](./rules).
- Поддерживаемые средства управления: `vmflow ctl` и `vmflow tui`.

- О запуске в качестве управляемой службы, стартующей при загрузке, см. [`vmflow service`](./service).
