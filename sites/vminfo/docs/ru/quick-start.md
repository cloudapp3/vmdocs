---
title: Быстрый старт
description: Установите vminfo и следите за метриками хоста через TUI, JSON или веб-дашборд.
---

# Быстрый старт

vminfo обеспечивает быструю видимость рантайма хоста из терминала, через JSON-вывод, браузерный дашборд или Go API.

## Установка

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vminfo/main/install.sh | bash
```

С sudo:

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vminfo/main/install.sh | sudo bash
```

## Запуск TUI

```bash
vminfo
```

## Вывод JSON-снимка

```bash
vminfo summary --json
```

## Запуск веб-дашборда

```bash
vminfo --web
```

Адрес по умолчанию:

```text
http://127.0.0.1:20021
```

## Дальнейшие шаги

- Изучите [справочник команд](/ru/commands)
- Откройте [руководство по веб-дашборду](/ru/web-dashboard)
- Используйте [HTTP API](/ru/api)
- Встройте [библиотеку Go](/ru/library)
