---
title: vmflow tui
description: Lanza el panel de terminal de vmflow contra un daemon en ejecución.
---

# vmflow tui

```bash
vmflow tui [-addr URL] [-token TOKEN]
```

Alias: `vmflow t`.

Abre el panel de terminal del daemon local. El destino local predeterminado requiere un servicio nativo instalado y en ejecución; si se detiene después, la TUI permite recuperarlo. Para un daemon iniciado manualmente con `vmflow run`, pasa `-addr http://127.0.0.1:19090` explícitamente para omitir la comprobación del servicio. Consulta [Panel TUI](./tui-guide).

## Ejemplos

```bash
vmflow tui
vmflow tui -addr http://127.0.0.1:19090
VMFLOW_CONTROL_TOKEN=change-me vmflow tui
```
