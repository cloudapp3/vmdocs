---
title: vmflow tui
description: Inicia o painel do terminal do vmflow contra um daemon em execução.
---

# vmflow tui

```bash
vmflow tui [-addr http://127.0.0.1:19090] [-token TOKEN]
```

Alias: `vmflow t`.

Inicia o painel do terminal. Ele lê o estado em tempo real da control API e aceita as mesmas flags compartilhadas de cliente que o `ctl` — incluindo TLS/mTLS e cabeçalhos personalizados (veja [Flags comuns de cliente](./commands#common-client-flags)). Veja [Painel TUI](./tui-guide) para as visualizações e controles.

## Exemplos

```bash
vmflow tui
vmflow tui -addr http://10.0.0.5:19090 -token change-me
VMFLOW_CONTROL_TOKEN=change-me vmflow tui

# against a TLS-protected control API
vmflow tui -addr https://10.0.0.5:19090 \
  -tls-ca-file ca.pem -tls-client-cert client.pem -tls-client-key client.key
```
