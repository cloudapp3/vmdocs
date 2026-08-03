---
title: Painel TUI
description: Consulte e gerencie regras do vmflow, políticas de IP de origem, contadores, precheck e operações de aplicação pela interface de terminal.
---

# Painel TUI

O vmflow inclui uma interface de terminal para consultar e gerenciar as regras configuradas e os contadores de tráfego em tempo real do daemon local.

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
| **Dashboard** | Saúde, totais de encaminhamento, uptime, interfaces Host Network e taxas RX/TX do daemon conectado. |
| **Rules** | Regras, tráfego e cotas em tempo real, alterações preparadas e resumo Source IP. |
| **Detail** | Bandwidth/quota da regra, Source IP, tráfego, uso da cota e contadores de rejeição. |

## Gerenciamento de regras

Um token `admin` autenticado pode criar, editar, copiar, ativar, desativar e excluir regras. Tokens viewer e sessões sem autenticação são somente leitura. Na visão Rules, use <kbd>n</kbd>/<kbd>e</kbd>/<kbd>c</kbd> para criar, editar ou copiar; <kbd>Space</kbd> para alternar; <kbd>d</kbd> para excluir; <kbd>P</kbd> para executar o precheck e <kbd>A</kbd> para aplicar o rascunho validado.

O editor oferece `Source IP mode` como `OFF`, `ALLOWLIST` ou `DENYLIST`. Informe endereços IPv4/IPv6 literais e CIDRs separados por vírgulas em `Source IPs / CIDRs`. O precheck deve ser aprovado antes da aplicação; o fluxo existente de revision/ETag impede que um editor desatualizado sobrescreva uma configuração mais recente.

O editor básico inclui rate compartilhado e cotas diária/mensal; opções avançadas incluem upload/download e timezone. Aplicar reinicia a regra, mas preserva o uso do mesmo `rule_id`.

Host Network fica dentro do Dashboard. <kbd>4</kbd> salta para a seção e <kbd>a</kbd> alterna interfaces físicas ativas ou todas. Os dados pertencem ao host do daemon conectado mesmo via SSH tunnel; não são cotas vmflow nem teste de velocidade.

## Quando usar

O TUI é a forma mais rápida de responder "o que o vmflow está fazendo agora?" sem fazer scraping de métricas. Para um histórico de longo prazo, aponte o Prometheus para `/metrics` — o TUI mostra apenas o estado atual em memória.
