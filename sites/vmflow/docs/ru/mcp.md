---
title: MCP-сервер
description: Подключение Claude, Codex и других MCP-клиентов к работающему демону vmflow через адаптер stdio только для чтения.
---

# MCP-сервер

`vmflow mcp` запускает в foreground MCP-сервер только с tools через stdio. Он
подключается к уже работающему демону vmflow через loopback-канал управления.
Сервер не запускает forwarding, не открывает сетевой порт MCP и не изменяет
конфигурацию демона.

## Требования

- Запускайте MCP-команду на том же хосте, что и демон vmflow.
- Оставляйте listener управления демона доступным только через loopback.
- Если аутентификация включена, передавайте отдельный viewer token через
  `VMFLOW_CONTROL_TOKEN`.

## Инструменты

| Инструмент | Назначение |
| --- | --- |
| `get_vmflow_status` | Сводка подключения, версии, прав, правил, трафика и degraded-состояния |
| `list_forwarding_rules` | Отфильтрованные правила без endpoint и политик исходных адресов |
| `get_forwarding_rule` | Полная конфигурация, состояние и статистика явно выбранного правила |
| `get_traffic_stats` | Отфильтрованные счётчики по правилам и агрегированные итоги |
| `run_config_precheck` | Проверка текущей сохранённой конфигурации только для чтения |

Все инструменты работают только на чтение. Списки и precheck возвращают 50
элементов по умолчанию и не более 200. Адаптер допускает до четырёх одновременных
вызовов tools.

## Viewer token

Настройте отдельный token для MCP-клиента:

```yaml
auth:
  enabled: true
  tokens:
    - name: mcp-viewer
      token: replace-with-a-long-random-token
      role: viewer
```

Предпочитайте переменную окружения параметру `-token`, который раскрывает token
в командной строке процесса.

## Claude Desktop

```json
{
  "mcpServers": {
    "vmflow": {
      "command": "/usr/local/bin/vmflow",
      "args": ["mcp"],
      "env": {
        "VMFLOW_CONTROL_TOKEN": "replace-with-a-long-random-token"
      }
    }
  }
}
```

## Codex

```toml
[mcp_servers.vmflow]
command = "/usr/local/bin/vmflow"
args = ["mcp"]
env = { VMFLOW_CONTROL_TOKEN = "replace-with-a-long-random-token" }
```

Если демон использует нестандартный порт управления, добавьте `-addr` и
loopback URL в `args`:

```json
"args": ["mcp", "-addr", "http://127.0.0.1:49127"]
```

`-addr` принимает только `localhost` или loopback IP. Для демона на другой
машине запускайте `vmflow mcp` на этой машине, например через SSH, а не
открывайте listener управления наружу.

## Граница данных

Детали правила могут содержать адреса назначения, политики исходных IP,
домены и примечания. Результаты трафика и precheck также могут раскрывать
топологию локальной сети. Результаты tools отправляются модели, настроенной в
MCP-клиенте.

MCP-сервер не предоставляет запись конфигурации, исходный YAML, bot tokens,
закрытые ключи сертификатов, выполнение shell, доступ к файлам, prompts или
resources. Precheck может разрешать адреса целей, уже указанных в конфигурации
демона.

## Диагностика

- `connected: false`: демон недоступен по настроенному loopback-адресу.
- HTTP `401`: задайте правильный viewer token в `VMFLOW_CONTROL_TOKEN`.
- Session endpoint недоступен: перезапустите демон с той же release vmflow,
  которая используется MCP-сервером.
- Пользовательский TLS или mTLS: используйте те же параметры `-tls-*`, что
  поддерживаются `vmflow ctl` и `vmflow tui`.
