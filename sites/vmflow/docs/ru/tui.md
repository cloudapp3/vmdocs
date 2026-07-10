---
title: vmflow tui
description: Запуск терминальной панели vmflow для работающего демона.
---

# vmflow tui

```bash
vmflow tui [-addr http://127.0.0.1:19090] [-token TOKEN]
```

Псевдоним: `vmflow t`.

Запускает терминальную панель. Она читает живое состояние из control API и принимает те же общие клиентские флаги, что и `ctl` — включая TLS/mTLS и пользовательские заголовки (см. [Общие клиентские флаги](./commands#common-client-flags)). Режимы просмотра и управление описаны в разделе [Панель TUI](./tui-guide).

## Примеры

```bash
vmflow tui
vmflow tui -addr http://10.0.0.5:19090 -token change-me
VMFLOW_CONTROL_TOKEN=change-me vmflow tui

# against a TLS-protected control API
vmflow tui -addr https://10.0.0.5:19090 \
  -tls-ca-file ca.pem -tls-client-cert client.pem -tls-client-key client.key
```
