---
title: vmflow tui
description: Inicia o painel do terminal do vmflow contra um daemon em execução.
---

# vmflow tui

```bash
vmflow tui [-addr URL] [-token TOKEN]
```

Alias: `vmflow t`.

Abre o painel de terminal do daemon local. O destino local padrão exige um serviço nativo instalado e em execução; se ele parar depois, a TUI permite recuperá-lo. Para um daemon iniciado manualmente com `vmflow run`, informe `-addr http://127.0.0.1:19090` explicitamente para ignorar a verificação do serviço. Consulte [Painel TUI](./tui-guide).

## Exemplos

```bash
vmflow tui
vmflow tui -addr http://127.0.0.1:19090
VMFLOW_CONTROL_TOKEN=change-me vmflow tui
```
