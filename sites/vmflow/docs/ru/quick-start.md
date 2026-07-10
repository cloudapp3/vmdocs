---
title: Быстрый старт
description: Установите vmflow и запустите первое правило перенаправления TCP за две минуты.
---

# Быстрый старт

Это руководство устанавливает бинарный файл `vmflow`, запускает демон с примером конфигурации и опрашивает его через CLI.

## 1. Установка

Установите последний готовый бинарный файл (Linux/macOS):

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vmflow/main/install.sh | bash
```

Предпочитаете глобальную установку:

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vmflow/main/install.sh | sudo bash -s -- --dir /usr/local/bin
```

Проверка:

```bash
vmflow version
```

См. [Установка](./installation) — про `--version`, проверку контрольных сумм и сборку из исходников.

## 2. Запуск демона

Возьмите пример конфигурации и запустите демон:

```bash
vmflow daemon -config ./examples/config.yaml
```

В примере TCP `0.0.0.0:2201` перенаправляется на `127.0.0.1:22` (SSH).

## 3. Опрос

Из другого терминала направьте CLI на локальный control API (по умолчанию `127.0.0.1:19090`):

```bash
vmflow ctl health
vmflow ctl rules
vmflow ctl stats
vmflow ctl metrics
vmflow ctl precheck
```

## 4. Открытие терминального интерфейса

```bash
vmflow tui
```

Нажмите <kbd>Tab</kbd> для переключения между режимами Dashboard, Rules и Detail. См. [Панель TUI](./tui-guide).

## 5. Перезагрузка после правки конфигурации

Отредактируйте `examples/config.yaml`, затем примените новое желаемое состояние:

```bash
vmflow ctl reload
```

Перезагрузка сначала запускает [предпроверку](./precheck); при ошибках изменение отклоняется, а работающие правила остаются нетронутыми.

## Что дальше

- [Конфигурация](./configuration) — описание каждого поля YAML
- [Движок перенаправления](./forwarding) — протоколы, ограничения скорости, максимум соединений
- [Правила и жизненный цикл](./rules) — применение снимка и инкрементальное сравнение
- [`vmflow service install`](./service) — запуск vmflow как нативной службы, стартующей при загрузке (systemd / launchd / Windows Service)
- [`vmflow uninstall`](./uninstall) — удаление одной командой (служба, бинарный файл, конфигурация, журналы, сертификаты)
