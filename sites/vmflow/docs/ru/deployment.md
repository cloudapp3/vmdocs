---
title: Развёртывание
description: Запуск vmflow как демона в продакшене — раскрытие control API, аутентификация, TLS/mTLS, журналирование, метрики и настройка нативной службы.
---

# Развёртывание

vmflow работает как долго живущий демон, предоставляющий локальный control API. На этой странице рассмотрены практические аспекты его запуска на хосте.

## Держите control API на loopback

По умолчанию `control_listen_addr` равен `127.0.0.1:19090`. При `auth.enabled: false` control API считает каждый запрос анонимным вызывающим стороной уровня admin — это безопасно только на loopback.

Демон **отказывается запускаться**, если control API привязан к адресу вне loopback (`0.0.0.0`, `::`, не-loopback IP или `:port`) без защиты. Это поведение fail-closed: оно предотвращает случайное раскрытие неаутентифицированной точки удалённого управления. Чтобы выполнить привязку вне loopback, удовлетворите одно из условий:

1. `auth.enabled: true` хотя бы с одним токеном, **либо**
2. взаимный TLS через `control_tls.client_ca_file` (клиенты обязаны предъявлять сертификат), **либо**
3. передайте демону `-insecure-allow-remote-control`, чтобы явно подтвердить риск.

## Раскрытие вне localhost

Когда нужно обращаться к control API с другого хоста, выберите один из безопасных вариантов.

### Вариант A — аутентификация по Bearer-токену

```yaml
control_listen_addr: 0.0.0.0:19090
auth:
  enabled: true
  tokens:
    - name: admin
      token: <long-random-secret>
      role: admin
    - name: viewer
      token: <another-random-secret>
      role: viewer
```

Используйте токен `admin` для любого изменяющего вызова (`reload`). Вызовы только для чтения работают с токеном `viewer`.

### Вариант B — TLS / взаимный TLS (рекомендуется)

Завершайте TLS непосредственно на control API и для максимальной стойкости требуйте клиентские сертификаты:

```yaml
control_listen_addr: 0.0.0.0:19090
control_tls:
  cert_file: /etc/vmflow/server.pem
  key_file:  /etc/vmflow/server.key
  client_ca_file: /etc/vmflow/client-ca.pem   # mTLS — satisfies the startup check
  min_version: "1.2"
```

Затем клиенты подключаются с `-tls-ca-file`, `-tls-client-cert`, `-tls-client-key` (см. [Общие клиентские флаги](./commands#common-client-flags)). Это рекомендуемый способ раскрыть control API за Cloudflare Tunnel без входящих портов. См. [HTTP API → TLS и взаимный TLS](./api#tls-and-mutual-tls).

См. также [HTTP API → Аутентификация](./api#authentication).

## Журналирование

Установите формат, подходящий для вашего стека:

```yaml
log:
  level: info
  format: json # text or json
```

`json` удобнее для систем сбора журналов; `text` дружелюбнее в терминале. Под менеджером служб демону можно также передать `-log-file` (на Windows это обязательно).

## Метрики

Настройте Prometheus на control API:

```yaml
scrape_configs:
  - job_name: vmflow
    static_configs:
      - targets: ['127.0.0.1:19090']
    metrics_path: /metrics
```

Семейства метрик — см. [HTTP API → Метрики](./api#get-metrics).

## Безопасная перезагрузка

Изменения конфигурации идут через `POST /v1/reload` (или `vmflow ctl reload`). Перезагрузка сначала запускает [предпроверку](./precheck) и отклоняет изменение при любой ошибке, оставляя работающие правила нетронутыми. Пока что окна плавного завершения нет — существующие соединения удалённого/изменённого правила не переносятся.

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
ExecStart=/usr/local/bin/vmflow daemon -config /etc/vmflow/config.yaml
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

- Статистика хранится **только в памяти**; встроенной исторической агрегации нет.
- Нет встроенного веб-дашборда или координатора на несколько узлов.
- В архиве релиза пока нет официального Docker-образа (доступны установка нативной службы и пакеты `.deb`/`.rpm`).
