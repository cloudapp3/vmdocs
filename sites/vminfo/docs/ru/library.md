---
title: Библиотека Go
description: Встраивание vminfo как Go-библиотеки для сбора метрик хоста и интеграции с терминальным UI.
---

# Библиотека Go

vminfo предоставляет публичные пакеты для сбора метрик хоста и встраивания терминального UI.

## Пакеты

- `github.com/cloudapp3/vminfo`
- `github.com/cloudapp3/vminfo/tui`

## Экспортируемые типы

- `StaticInfo`
- `RuntimeStats`
- `Snapshot`
- `ProcessInfo`
- `AppMetadata`

## Стандартные точки входа

- `CollectStatic`
- `CollectStats`
- `CollectAll`
- `Metadata`
- `tui.Run`

## См. также

- [Сбор метрик](/ru/collect)
- [Встраивание TUI](/ru/embed-tui)
