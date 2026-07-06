---
title: ps
description: Список процессов только для Linux с фильтрами, древовидным видом, режимом наблюдения и выводом JSON.
---

# `vminfo ps`

Список процессов и фильтрация, только для Linux.

## Использование

```bash
vminfo ps
vminfo ps nginx
vminfo ps --filter ssh
vminfo ps --tree
vminfo ps --watch
vminfo ps --limit 20
vminfo ps --json
vminfo ps --sort mem
```

## Параметры

| Флаг | Описание |
| --- | --- |
| позиционный фильтр | Фильтр по имени, пользователю, PID, команде или состоянию |
| `--filter` | Явный фильтр процессов |
| `--tree` | Отрисовать дерево процессов |
| `--watch` | Непрерывное обновление |
| `--count` | Число замеров при использовании с `--watch` |
| `--interval` | Интервал обновления для режима watch |
| `--limit` | Ограничить число строк |
| `--json` | Вывод в JSON |
| `--sort` | Сортировка по `cpu`, `mem`, `pid` или `name` |

## Примечания

- Сортировка по умолчанию — `cpu`.
- JSON-вывод возвращает массив объектов процессов.
- `--watch --json` возвращает JSON Lines с меткой времени `collected_at`.
- Сборки не для Linux сохраняют неподдерживаемые заглушки для этой команды.

## Пример

```bash
vminfo ps --filter ssh --sort mem --limit 20
```

## Связанные

- [kill](/ru/kill)
- [HTTP API](/ru/api)
