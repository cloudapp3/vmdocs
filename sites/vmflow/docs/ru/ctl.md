---
title: vmflow ctl
description: Опрос и управление vmflow через поддерживаемый CLI.
---

# vmflow ctl

```bash
vmflow ctl [-token TOKEN] <subcommand>
```

Псевдоним: `vmflow c`.

`ctl` — поддерживаемый командный интерфейс локального демона. При аутентификации используйте `-token` или `VMFLOW_CONTROL_TOKEN`.

## Подкоманды

| Подкоманда | Описание |
| --- | --- |
| `rules` | Список работающих правил. |
| `stats` | Счётчики трафика по правилам. |
| `metrics` | Метрики Prometheus в текстовом формате. |
| `precheck` | Проверка конфигурации без применения. |
| `reload` | Перезагрузка после предпроверки. |

## Примеры

```bash
vmflow ctl rules
vmflow ctl stats
vmflow ctl precheck
vmflow ctl reload
vmflow ctl -token change-me reload
```

::: tip
Изменяющие подкоманды (`reload`) требуют токен `admin`, если включена аутентификация. Подкоманды только для чтения работают с токеном `viewer`.
:::
