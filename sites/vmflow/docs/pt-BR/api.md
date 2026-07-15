---
title: Gerenciamento local
description: Gerencie o vmflow pela CLI e pela interface de terminal incluídas.
---

# Gerenciamento local

As interfaces de gerenciamento suportadas são `vmflow ctl` e `vmflow tui`. O
daemon usa um transporte interno restrito ao loopback. Ele não é uma API pública
de integração e não oferece garantia de compatibilidade para clientes externos.

O gerenciamento sempre é vinculado a `127.0.0.1`; a configuração define apenas
a porta local:

```yaml
control_port: 19090
```

Use [`vmflow ctl`](./ctl) e [`vmflow tui`](./tui) para estado, regras,
estatísticas, precheck e reload.

## Gerenciamento remoto

Encaminhe a porta de loopback por SSH e continue usando a CLI/TUI localmente:

```bash
ssh -N -L 19090:127.0.0.1:19090 user@server
vmflow ctl rules
```
