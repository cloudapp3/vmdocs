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

O bot é restrito ao único chat configurado em `bot_chat` — ele ignora mensagens e consultas de callback de qualquer outro chat. Observe que o bot conversa com o mecanismo em processo **diretamente**, não pela control API, então a autenticação da control API é irrelevante para ele. Expor a control API fora do loopback ainda tem suas próprias regras (consulte [Implantação](./deployment)).

## Comandos

| Comando | Efeito |
| --- | --- |
| `/start` | Exibe o texto de ajuda. |
| `/status` | Contagem de regras em execução, total de conexões e totais de upload/download. |
| `/rules` | Lista as regras em execução em uma tabela (nome, proto, listen→target, conns, up/down). |
| `/detail <id>` | Mostra a configuração e o tráfego em tempo real de uma regra. |
| `/reload` | Solicita um reload; ao confirmar, ele **para todas as regras** (consulte a observação abaixo). |
| `/stop <id>` | Para uma única regra pelo ID (pede confirmação). |
| `/start_rule <id>` | Solicita iniciar uma regra (consulte a observação abaixo). |

Ações destrutivas pedem confirmação por meio de botões embutidos antes de terem efeito.

::: warning Limitações de `/reload` e `/start_rule`
- `/reload` **não** relê a configuração. Ao confirmar, ele chama `StopAll()` e responde: _"✅ All rules stopped. Use control API /v1/reload for full config reload."_ Para aplicar de fato as alterações de configuração, execute `vmflow ctl reload` (ou `POST /v1/reload`) na control API.
- `/start_rule` é um stub: ao confirmar, ele responde com uma dica para usar a control API `/v1/reload`, porque reaplicar uma única regra exige a configuração completa da regra, que o bot não possui.

O `/stop <id>`, por outro lado, funciona totalmente — ele para a regra nomeada imediatamente.
:::

## Observações

- Esta integração é opcional e best-effort; não substitui a control API para reloads em produção.
- O bot compartilha o processo do daemon, então um reinício do daemon também reinicia o bot.
