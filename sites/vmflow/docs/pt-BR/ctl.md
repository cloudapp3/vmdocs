---
title: vmflow ctl
description: Consulte e gerencie o vmflow pela CLI suportada.
---

# vmflow ctl

```bash
vmflow ctl [-token TOKEN] <subcommand>
```

Alias: `vmflow c`.

`ctl` é a interface de comando suportada para o daemon local. Use `-token` ou `VMFLOW_CONTROL_TOKEN` quando houver autenticação.

## Subcomandos

| Subcomando | Descrição |
| --- | --- |
| `rules` | Lista regras em execução. |
| `stats` | Mostra contadores por regra. |
| `metrics` | Imprime métricas Prometheus. |
| `precheck` | Valida sem aplicar a configuração. |
| `reload` | Recarrega após o precheck. |

## Exemplos

```bash
vmflow ctl rules
vmflow ctl stats
vmflow ctl precheck
vmflow ctl reload
vmflow ctl -token change-me reload
```

::: tip
Subcomandos de mutação (`reload`) exigem um token `admin` quando a autenticação está habilitada. Subcomandos somente leitura funcionam com um token `viewer`.
:::
