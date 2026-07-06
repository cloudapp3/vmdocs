---
title: Referencia de comandos
description: Resumen de los comandos de la CLI de vminfo y los flujos de trabajo habituales.
---

# Referencia de comandos

## Comandos habituales

| Comando | Qué hace |
| --- | --- |
| `vminfo` | Inicia el TUI interactivo |
| `vminfo info` | Alias del TUI |
| `vminfo summary` | Recopila una instantánea |
| `vminfo watch` | Muestra instantáneas en streaming continuo |
| `vminfo --web` | Inicia el panel en el navegador |
| `vminfo ps` | Lista los procesos locales en Linux |
| `vminfo kill <pid>` | Envía SIGTERM a un proceso de Linux |
| `vminfo net` | Ejecuta diagnóstico de red (dns / port / ping / ip) |
| `vminfo update` | Comprueba o instala una actualización de release |
| `vminfo --lang zh` | Cambia el idioma de la interfaz |

## Hoja de referencia rápida

```bash
vminfo
vminfo info
vminfo summary
vminfo summary --json
vminfo watch
vminfo watch --json
vminfo watch --count 1
vminfo --web
vminfo --web --token
vminfo --web --token secret-token
vminfo --web --tui
vminfo --web --bind 0.0.0.0 --port 8080
vminfo ps
vminfo ps nginx
vminfo ps --filter ssh
vminfo ps --tree
vminfo ps --watch
vminfo ps --limit 20
vminfo ps --json
vminfo ps --sort mem
vminfo kill <pid>
vminfo net dns example.com
vminfo net port example.com 443
vminfo net ping example.com --tcp-port 443
vminfo net ip
vminfo update
vminfo update --check
vminfo update --version v0.1.0
vminfo --lang zh
```

Usa las páginas siguientes para ver los detalles completos:

- [summary](/es/summary)
- [watch](/es/watch)
- [ps](/es/ps)
- [kill](/es/kill)
- [net](/es/net)
- [update](/es/update)
