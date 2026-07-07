---
title: Referência de comandos
description: Visão geral dos comandos da CLI do vminfo e dos fluxos de trabalho comuns.
---

# Referência de comandos

## Comandos comuns

| Comando | O que faz |
| --- | --- |
| `vminfo` | Inicia o TUI interativo |
| `vminfo info` | Alias para o TUI |
| `vminfo summary` | Coleta um instantâneo |
| `vminfo watch` | Transmite instantâneos continuamente |
| `vminfo --web` | Inicia o painel no navegador |
| `vminfo ps` | Lista os processos locais no Linux |
| `vminfo kill <pid>` | Envia SIGTERM para um processo no Linux |
| `vminfo net` | Executa diagnósticos de rede (dns / port / ping / ip) |
| `vminfo update` | Verifica ou instala uma atualização de lançamento |
| `vminfo --lang zh` | Alterna o idioma da interface |

## Folha de dicas

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

Use as páginas abaixo para obter detalhes completos:

- [summary](/pt-BR/summary)
- [watch](/pt-BR/watch)
- [ps](/pt-BR/ps)
- [kill](/pt-BR/kill)
- [net](/pt-BR/net)
- [update](/pt-BR/update)
