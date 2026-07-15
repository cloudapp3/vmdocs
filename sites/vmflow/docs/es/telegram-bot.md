---
title: Bot de Telegram
description: Bot de Telegram opcional para inspeccionar y controlar reglas de vmflow — /status, /rules, /detail, /reload, /stop, /start_rule.
---

# Bot de Telegram

vmflow puede ejecutar un bot de Telegram opcional para inspección y control ligeros orientados a chat — práctico cuando operas desde un teléfono y no quieres hacer SSH para una comprobación rápida.

## Habilitarlo

El bot arranca solo cuando **ambos** campos están definidos:

```yaml
bot_token: <your-telegram-bot-token>
bot_chat: <chat-id>
```

`bot_token` es el token de [@BotFather](https://t.me/BotFather); `bot_chat` es el ID numérico del chat en el que el bot puede responder. Dejar `bot_token` sin definir simplemente significa que no arranca ningún bot.

## Autorización

El bot solo responde al chat `bot_chat`. Configura `bot_control_token` con un admin token de `auth.tokens` para habilitar escritura; sin él es de solo lectura. Las solicitudes permanecen dentro del proceso.

## Comandos

| Comando | Efecto |
| --- | --- |
| `/start` | Muestra el texto de ayuda. |
| `/status` | Recuento de reglas en ejecución, conexiones totales y totales de subida/bajada. |
| `/rules` | Lista las reglas en ejecución en una tabla (nombre, proto, listen→target, conns, up/down). |
| `/detail <id>` | Muestra la configuración y el tráfico en vivo de una regla. |
| `/reload` | Recarga la configuración desde disco tras confirmar. |
| `/stop <id>` | Detiene una regla concreta por ID (pide confirmación). |
| `/start_rule <id>` | Habilita e inicia una regla tras confirmar. |

Las acciones destructivas piden confirmación mediante botones en línea antes de surtir efecto.

::: tip
Las escrituras del bot usan el mismo precheck, aplicación transaccional, rollback y control de concurrencia que la TUI. Los conflictos solicitan reintentar.
:::

## Notas

- La integración es opcional; CLI/TUI siguen siendo las interfaces principales.
- El bot comparte el proceso del daemon, de modo que un reinicio del daemon también reinicia el bot.
