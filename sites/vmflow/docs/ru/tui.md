---
title: vmflow tui
description: Запуск терминальной панели vmflow для работающего демона.
---

# vmflow tui

```bash
vmflow tui [-addr URL] [-token TOKEN]
```

Псевдоним: `vmflow t`.

Запускает терминальную панель локального демона. Локальная цель по умолчанию требует установленную и работающую нативную службу; если она остановится позже, TUI поможет её восстановить. Для демона, запущенного вручную через `vmflow run`, явно передайте `-addr http://127.0.0.1:19090`, чтобы пропустить проверку службы. См. [Панель TUI](./tui-guide).

## Примеры

```bash
vmflow tui
vmflow tui -addr http://127.0.0.1:19090
VMFLOW_CONTROL_TOKEN=change-me vmflow tui
```
