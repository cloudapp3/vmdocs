---
title: Развёртывание
description: Эксплуатация vmflow с loopback-управлением, журналами, метриками, SSH и нативной службой.
---

# Развёртывание

vmflow работает как долгоживущий процесс перенаправления. Управление остаётся на loopback и выполняется через встроенные CLI/TUI.

## Локальное управление

Внутренний канал управления всегда привязан к `127.0.0.1`. В конфигурации задаётся только локальный порт:

```yaml
control_port: 19090
```

Поддерживаемые средства управления: `vmflow ctl` и `vmflow tui`. Внутренний транспорт не является публичным API интеграции.

## Удалённое управление

Пробросьте loopback-порт через SSH и используйте локальные CLI/TUI:

```bash
ssh -N -L 19090:127.0.0.1:19090 user@server
vmflow ctl rules
```

## Журналирование

Установите формат, подходящий для вашего стека:

```yaml
log:
  level: info
  format: json # text or json
```

`json` удобнее для систем сбора журналов; `text` дружелюбнее в терминале. Под менеджером служб демону можно также передать `-log-file` (на Windows это обязательно).

## Метрики

Настройте Prometheus на том же хосте для чтения loopback-метрик:

```yaml
scrape_configs:
  - job_name: vmflow
    static_configs:
      - targets: ['127.0.0.1:19090']
    metrics_path: /metrics
```

## Безопасная перезагрузка

Применяйте изменения командой `vmflow ctl reload`. Сначала выполняется [предпроверка](./precheck), а ошибочная конфигурация не применяется частично.

## Запуск как нативной службы

Зарегистрируйте vmflow в менеджере служб ОС, чтобы он стартовал при загрузке и перезапускался при сбое:

```bash
# installs + enables + starts a systemd unit / launchd plist / Windows Service
sudo vmflow service install
```

Это рекомендуемый путь — см. [`vmflow service`](./service) для списка флагов (путь к конфигурации, пользователь запуска, файл журнала, дополнительные аргументы). `vmflow service status` / `vmflow service uninstall` проверяют и удаляют службу.

Если предпочитаете управлять юнитом самостоятельно, вот рабочий пример systemd для адаптации:

```ini
[Unit]
Description=vmflow L4 forwarding daemon
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
ExecStart=/usr/local/bin/vmflow -config /etc/vmflow/config.yaml
ExecReload=/usr/local/bin/vmflow ctl reload
Restart=on-failure
RestartSec=3

[Install]
WantedBy=multi-user.target
```

Перезагрузите конфигурацию после правок:

```bash
sudo vmflow ctl reload
# or, with a hand-written unit that wires ExecReload:
sudo systemctl reload vmflow
```

Для полного демонтажа (служба + бинарный файл + конфигурация + журналы + сертификаты + кэш обновлений) используйте [`vmflow uninstall`](./uninstall).

## Текущие ограничения

- Накопительные счётчики трафика можно сохранять; активные соединения и скорости остаются локальными для процесса.
- Нет встроенного веб-дашборда или координатора на несколько узлов.
- Официальный Docker-образ пока не публикуется; для автозапуска используйте встроенную установку нативной службы.
