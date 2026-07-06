---
title: watch
description: Поток снимков состояния рантайма в реальном времени в виде текста или JSON Lines.
---

# `vminfo watch`

Непрерывно стримит снимки состояния.

## Использование

```bash
vminfo watch
vminfo watch --json
vminfo watch --count 1
vminfo watch --interval 2s
```

## Вывод

- Текстовый режим выводит снимки с метками времени.
- JSON-режим выводит JSON Lines с `collected_at`, `static` и `stats`.

## Для чего подходит

- мониторинг в терминале
- лог-конвейеры
- проверки в CI
- простые циклы выборки

## Пример

```bash
vminfo watch --json --count 3
```

## Связанные

- [summary](/ru/summary)
- [ps](/ru/ps)
