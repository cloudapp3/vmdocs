---
title: Gestión local
description: Gestiona vmflow mediante la CLI, la interfaz de terminal y el adaptador MCP de solo lectura incluidos.
---

# Gestión local

Las interfaces de gestión compatibles son `vmflow ctl`, `vmflow tui` y el
adaptador de solo lectura `vmflow mcp`. El demonio usa un transporte interno
limitado a loopback. No es una API pública de integración ni ofrece garantías
de compatibilidad para clientes externos.

La gestión siempre se enlaza a `127.0.0.1`; la configuración solo define el
puerto local:

```yaml
control_port: 19090
```

Usa [`vmflow ctl`](./ctl) y [`vmflow tui`](./tui) para consultar estado, reglas,
estadísticas, precheck y recargar la configuración. Para diagnósticos locales
asistidos por IA, consulta [`vmflow mcp`](./mcp).

## Gestión remota

Reenvía el puerto loopback mediante SSH y utiliza la CLI/TUI localmente:

```bash
ssh -N -L 19090:127.0.0.1:19090 user@server
vmflow ctl rules
```
