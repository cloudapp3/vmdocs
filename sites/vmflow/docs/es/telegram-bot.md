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

El bot está bloqueado al único chat configurado en `bot_chat`: ignora los mensajes y las callback queries de cualquier otro chat. Ten en cuenta que el bot se comunica con el motor en proceso **directamente**, no a través de la API de control, de modo que la auth de la API de control es irrelevante para él. Exponer la API de control fuera de loopback sigue teniendo sus propias reglas (consulta [Despliegue](./deployment)).

## Comandos

| Comando | Efecto |
| --- | --- |
| `/start` | Muestra el texto de ayuda. |
| `/status` | Recuento de reglas en ejecución, conexiones totales y totales de subida/bajada. |
| `/rules` | Lista las reglas en ejecución en una tabla (nombre, proto, listen→target, conns, up/down). |
| `/detail <id>` | Muestra la configuración y el tráfico en vivo de una regla. |
| `/reload` | Pide recargar; al confirmar **detiene todas las reglas** (ver nota más abajo). |
| `/stop <id>` | Detiene una regla concreta por ID (pide confirmación). |
| `/start_rule <id>` | Pide iniciar una regla (ver nota más abajo). |

Las acciones destructivas piden confirmación mediante botones en línea antes de surtir efecto.

::: warning Limitaciones de `/reload` y `/start_rule`
- `/reload` **no** vuelve a leer la configuración. Al confirmar llama a `StopAll()` y responde: _"✅ All rules stopped. Use control API /v1/reload for full config reload."_ Para aplicar realmente los cambios de configuración, ejecuta `vmflow ctl reload` (o `POST /v1/reload`) contra la API de control.
- `/start_rule` es un stub: al confirmar responde con una pista para usar la API de control `/v1/reload`, porque volver a aplicar una sola regla necesita la configuración completa de la regla, que el bot no retiene.

`/stop <id>`, en cambio, funciona por completo: detiene la regla indicada de inmediato.
:::

## Notas

- Esta integración es opcional y best-effort; no sustituye a la API de control para recargas en producción.
- El bot comparte el proceso del daemon, de modo que un reinicio del daemon también reinicia el bot.
