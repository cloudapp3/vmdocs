---
title: vmflow tui
description: Lanza el panel de terminal de vmflow contra un daemon en ejecución.
---

# vmflow tui

```bash
vmflow tui [-addr http://127.0.0.1:19090] [-token TOKEN]
```

Alias: `vmflow t`.

Lanza el panel de terminal. Lee el estado en vivo desde la API de control y acepta las mismas flags de cliente compartidas que `ctl`, incluidas TLS/mTLS y cabeceras personalizadas (consulta [Flags comunes de cliente](./commands#common-client-flags)). Consulta [Panel TUI](./tui-guide) para las vistas y los controles.

## Ejemplos

```bash
vmflow tui
vmflow tui -addr http://10.0.0.5:19090 -token change-me
VMFLOW_CONTROL_TOKEN=change-me vmflow tui

# against a TLS-protected control API
vmflow tui -addr https://10.0.0.5:19090 \
  -tls-ca-file ca.pem -tls-client-cert client.pem -tls-client-key client.key
```
