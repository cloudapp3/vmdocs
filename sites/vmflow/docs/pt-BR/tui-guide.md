---
title: Painel TUI
description: O painel de terminal do vmflow — como iniciá-lo e alternar entre as visões Dashboard, Rules e Detail.
---

# Painel TUI

O vmflow inclui uma interface de terminal para consultar o estado das regras e os contadores de tráfego do daemon local.

## Como iniciá-lo

```bash
vmflow tui
```

Quando a autenticação estiver habilitada, informe um token de acesso:

```bash
vmflow tui -token <token>
# or
VMFLOW_CONTROL_TOKEN=<token> vmflow tui
```

## Visões

Pressione <kbd>Tab</kbd> para alternar entre as visões:

| Visão | Mostra |
| --- | --- |
| **Dashboard** | Saúde geral, contagem de regras em execução, tempo de atividade. |
| **Rules** | A lista de regras em execução com contadores em tempo real; oferece suporte à filtragem de regras por nome. |
| **Detail** | Detalhes da regra selecionada. |

## Quando usar

O TUI é a forma mais rápida de responder "o que o vmflow está fazendo agora?" sem fazer scraping de métricas. Para um histórico de longo prazo, aponte o Prometheus para `/metrics` — o TUI mostra apenas o estado atual em memória.
