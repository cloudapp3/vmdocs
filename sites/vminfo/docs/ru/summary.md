---
title: summary
description: Собрать один снимок состояния рантайма в виде текста или JSON.
---

# `vminfo summary`

Собирает один снимок текущего состояния хоста.

## Использование

```bash
vminfo summary
vminfo summary --json
vminfo summary --interval 1s
```

## Вывод

- Текстовый режим выводит читаемое описание хоста.
- JSON-режим выводит объект `vminfo.Snapshot` с полями `static` и `stats`.

## Когда использовать

- быстрые проверки в терминале
- shell-скрипты
- диагностика в CI
- автоматизация, которой нужен один замер

## Пример

```bash
vminfo summary --json
```

## Связанные

- [watch](/ru/watch)
- [HTTP API](/ru/api)
- [библиотека Go](/ru/library)
