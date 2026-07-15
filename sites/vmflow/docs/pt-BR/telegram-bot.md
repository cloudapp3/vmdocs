---
title: Bot do Telegram
description: Bot opcional do Telegram para inspecionar e controlar regras do vmflow — /status, /rules, /detail, /reload, /stop, /start_rule.
---

# Bot do Telegram

O vmflow pode executar um bot opcional do Telegram para inspeção e controle leves via chat — útil quando você opera pelo telefone e não quer abrir uma sessão SSH para uma verificação rápida.

## Como habilitar

O bot é iniciado apenas quando **ambos** os campos estão definidos:

```yaml
bot_token: <your-telegram-bot-token>
bot_chat: <chat-id>
```

`bot_token` é o token obtido de [@BotFather](https://t.me/BotFather); `bot_chat` é o ID numérico do chat em que o bot tem permissão para responder. Deixar `bot_token` indefinido significa apenas que nenhum bot é iniciado.

## Autorização

O bot só responde ao chat `bot_chat`. Defina `bot_control_token` como um admin token de `auth.tokens` para habilitar escrita; sem ele o bot é somente leitura. As solicitações ficam no processo.

## Comandos

| Comando | Efeito |
| --- | --- |
| `/start` | Exibe o texto de ajuda. |
| `/status` | Contagem de regras em execução, total de conexões e totais de upload/download. |
| `/rules` | Lista as regras em execução em uma tabela (nome, proto, listen→target, conns, up/down). |
| `/detail <id>` | Mostra a configuração e o tráfego em tempo real de uma regra. |
| `/reload` | Recarrega a configuração do disco após confirmação. |
| `/stop <id>` | Para uma única regra pelo ID (pede confirmação). |
| `/start_rule <id>` | Habilita e inicia uma regra após confirmação. |

Ações destrutivas pedem confirmação por meio de botões embutidos antes de terem efeito.

::: tip
As escritas do bot usam o mesmo precheck, aplicação transacional, rollback e controle de concorrência da TUI. Conflitos pedem nova tentativa.
:::

## Observações

- A integração é opcional; CLI/TUI continuam sendo as interfaces principais.
- O bot compartilha o processo do daemon, então um reinício do daemon também reinicia o bot.
