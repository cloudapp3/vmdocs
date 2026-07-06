---
layout: home
titleTemplate: false
description: "vminfo — кроссплатформенный системный монитор для терминала и CLI для Linux, macOS и Windows: метрики CPU, памяти, диска, сети и процессов в реальном времени, JSON-вывод, веб-дашборд и встраиваемая библиотека Go."
hero:
  name: vminfo
  text: Системный монитор для терминала, веб-дашборд и библиотека Go
  tagline: Кроссплатформенный мониторинг рантайма хоста для Linux, macOS и Windows — через TUI, JSON-вывод, браузерный дашборд или встраиваемые Go API.
  image:
    src: /logo.svg
    alt: vminfo
  actions:
    - theme: brand
      text: Начать
      link: /ru/quick-start
    - theme: alt
      text: Команды
      link: /ru/commands
    - theme: alt
      text: HTTP API
      link: /ru/api
    - theme: alt
      text: GitHub
      link: https://github.com/cloudapp3/vminfo

features:
  - icon: 🖥️
    title: Отточенный TUI
    details: Живой терминальный дашборд для CPU, памяти, диска, сети, нагрузки и процессов.
    link: /ru/tui-controls
  - icon: 📦
    title: JSON для скриптов
    details: Экспорт снимков и потоков watch для автоматизации, CI и диагностики.
    link: /ru/summary
  - icon: 🌐
    title: Тематический веб-дашборд
    details: Запускайте браузерный дашборд только для чтения с REST- и WebSocket-эндпоинтами и переключаемыми темами.
    link: /ru/web-dashboard
  - icon: 🧩
    title: Встраиваемые Go API
    details: Импортируйте API сбора метрик vminfo или встраивайте интерактивный TUI в собственный Go CLI.
    link: /ru/library
  - icon: ⚡
    title: Видимость рантайма без настройки
    details: Без демона, без базы данных, без центрального сервера. Установите и быстро изучите локальный хост.
    link: /ru/installation
  - icon: 🔍
    title: Сетевая диагностика
    details: Запускайте DNS, проверку TCP-портов, ping и поиск публичного IP / ASN по требованию — из CLI или дашборда.
    link: /ru/net
  - icon: 🔒
    title: Веб-режим с поддержкой токенов
    details: Защитите удалённый доступ к дашборду с помощью токена, cookie, CORS и проверки origin для WebSocket.
    link: /ru/api
---

## Установка одной командой

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vminfo/main/install.sh | bash
```

Затем запустите терминальный UI:

```bash
vminfo
```

Или получите JSON-снимок для скриптов:

```bash
vminfo summary --json
```

## Почему vminfo

vminfo создан для разработчиков, SRE- и DevOps-инженеров и администраторов серверов, которым нужен низкопороговый способ получить видимость состояния машины.

Используйте его, когда нужно:

- посмотреть CPU, память, диск, сеть, нагрузку и процессы из терминала
- экспортировать машиночитаемый JSON для скриптов и автоматизации
- открыть браузерный дашборд на сервере через `vminfo --web`
- встроить сбор метрик хоста в другой Go-инструмент
- продиагностировать отдельный хост без развёртывания полноценной платформы мониторинга

## Скриншоты

<div class="vminfo-screenshot-grid">
  <img src="../assets/tui-overview-refreshed.png" alt="Обзор TUI vminfo" />
  <img src="../assets/web-dashboard.png" alt="Веб-дашборд vminfo" />
  <img src="../assets/tui-processes.png" alt="Просмотр процессов vminfo" />
  <img src="../assets/tui-help.png" alt="Окно справки vminfo" />
</div>

![Обзор TUI vminfo](../assets/tui-overview-refreshed.png)

## Быстрые ссылки

- [Быстрый старт](/ru/quick-start)
- [Установка](/ru/installation)
- [Развёртывание](/ru/deployment)
- [Справочник команд](/ru/commands)
- [HTTP API](/ru/api)
- [Библиотека Go](/ru/library)
- [中文文档](/zh/)
- [日本語ドキュメント](/ja/)
