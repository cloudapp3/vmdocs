---
title: Справочник команд
description: Обзор команд CLI vminfo и типичные сценарии работы.
---

# Справочник команд

## Частые команды

| Команда | Назначение |
| --- | --- |
| `vminfo` | Запуск интерактивного TUI |
| `vminfo info` | Псевдоним для TUI |
| `vminfo summary` | Сбор одного снимка |
| `vminfo watch` | Непрерывный поток снимков |
| `vminfo --web` | Запуск веб-дашборда |
| `vminfo ps` | Список локальных процессов на Linux |
| `vminfo kill <pid>` | Отправка SIGTERM процессу Linux |
| `vminfo net` | Сетевая диагностика (dns / port / ping / ip) |
| `vminfo update` | Проверка или установка обновления релиза |
| `vminfo --lang zh` | Переключение языка интерфейса |

## Шпаргалка

```bash
vminfo
vminfo info
vminfo summary
vminfo summary --json
vminfo watch
vminfo watch --json
vminfo watch --count 1
vminfo --web
vminfo --web --token
vminfo --web --token secret-token
vminfo --web --tui
vminfo --web --bind 0.0.0.0 --port 8080
vminfo ps
vminfo ps nginx
vminfo ps --filter ssh
vminfo ps --tree
vminfo ps --watch
vminfo ps --limit 20
vminfo ps --json
vminfo ps --sort mem
vminfo kill <pid>
vminfo net dns example.com
vminfo net port example.com 443
vminfo net ping example.com --tcp-port 443
vminfo net ip
vminfo update
vminfo update --check
vminfo update --version v0.1.0
vminfo --lang zh
```

Полные детали — на страницах ниже:

- [summary](/ru/summary)
- [watch](/ru/watch)
- [ps](/ru/ps)
- [kill](/ru/kill)
- [net](/ru/net)
- [update](/ru/update)
