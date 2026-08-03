---
title: vmflow run
description: Справочник CLI vmflow — foreground, ctl, tui, version, update, service и uninstall.
---

# vmflow run

```bash
vmflow run [-config /path/to/config.yaml] [-control-port 19090]
```

Режим foreground загружает конфигурацию, запускает внутренний канал управления только на loopback, применяет снимок правил и работает до `SIGINT` или `SIGTERM`.

## Флаги

| Флаг | По умолчанию | Описание |
| --- | --- | --- |
| `-config` | platform user config | Переопределяет путь к YAML-конфигурации. |
| `-control-port` | _(из конфигурации)_ | Переопределяет loopback-порт управления. |
| `-log-file` | _(stdout)_ | Писать журналы в файл вместо stdout; полезно под сервис-менеджером. |
| `-service-name` | `vmflow` | Имя службы Windows SCM; игнорируется вне Windows service mode. |

## Поведение во время выполнения

- При запуске правила применяются через снимок (`ReplaceAll`). См. [Правила и жизненный цикл](./rules).
- Поддерживаемые средства управления: `vmflow ctl` и `vmflow tui`.

- О запуске в качестве управляемой службы, стартующей при загрузке, см. [`vmflow service`](./service).
