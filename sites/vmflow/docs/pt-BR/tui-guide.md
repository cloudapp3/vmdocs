---
title: Painel TUI
description: O painel de terminal do vmflow — como iniciá-lo e alternar entre as visões Dashboard, Rules e Detail.
---

# Painel TUI

O vmflow vem com uma interface de terminal para inspecionar um daemon em execução. Ele faz leituras da control API local, portanto mostra o estado das regras e os contadores de tráfego em tempo real.

## Como iniciá-lo

```bash
vmflow tui
```

Aponte para um endereço de controle que não seja o padrão ou informe um token:

```bash
vmflow tui -addr http://127.0.0.1:19090 -token <token>
# or
VMFLOW_CONTROL_TOKEN=<token> vmflow tui
```

O TUI aceita as mesmas flags de cliente do `ctl`, incluindo as flags de TLS/mTLS (`-tls-ca-file`, `-tls-client-cert`, `-tls-client-key`, `-tls-skip-verify`) e `-H` / `--header` para cabeçalhos de requisição personalizados.

## Visões

Pressione <kbd>Tab</kbd> para alternar entre as visões:

| Visão | Mostra |
| --- | --- |
| **Dashboard** | Saúde geral, contagem de regras em execução, tempo de atividade. |
| **Rules** | A lista de regras em execução com contadores em tempo real; oferece suporte à filtragem de regras por nome. |
| **Detail** | Detalhes da regra selecionada. |

## Quando usar

O TUI é a forma mais rápida de responder "o que o vmflow está fazendo agora?" sem fazer scraping de métricas. Para um histórico de longo prazo, aponte o Prometheus para `/metrics` — o TUI mostra apenas o estado atual em memória.
