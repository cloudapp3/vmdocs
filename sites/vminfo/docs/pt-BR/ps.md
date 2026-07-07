---
title: ps
description: Listagem de processos exclusiva do Linux com filtros, visão em árvore, modo watch e saída JSON.
---

# `vminfo ps`

Listagem e filtragem de processos exclusiva do Linux.

## Uso

```bash
vminfo ps
vminfo ps nginx
vminfo ps --filter ssh
vminfo ps --tree
vminfo ps --watch
vminfo ps --limit 20
vminfo ps --json
vminfo ps --sort mem
```

## Opções

| Flag | Descrição |
| --- | --- |
| filtro posicional | Filtra por nome, usuário, PID, comando ou estado |
| `--filter` | Filtro explícito de processos |
| `--tree` | Renderiza uma árvore de processos |
| `--watch` | Atualiza continuamente |
| `--count` | Número de amostras quando usado com `--watch` |
| `--interval` | Intervalo de atualização para o modo watch |
| `--limit` | Limita o número de linhas |
| `--json` | Saída JSON |
| `--sort` | Ordena por `cpu`, `mem`, `pid` ou `name` |

## Observações

- A ordenação padrão é `cpu`.
- A saída JSON retorna um array de objetos de processo.
- `--watch --json` retorna JSON Lines com uma marca de tempo `collected_at`.
- Builds que não são do Linux mantêm stubs não suportados para este comando.

## Exemplo

```bash
vminfo ps --filter ssh --sort mem --limit 20
```

## Relacionados

- [kill](/pt-BR/kill)
- [API HTTP](/pt-BR/api)
