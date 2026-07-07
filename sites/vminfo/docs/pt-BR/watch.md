---
title: watch
description: Transmite instantâneos de execução continuamente, como texto ou JSON Lines.
---

# `vminfo watch`

Transmite instantâneos continuamente.

## Uso

```bash
vminfo watch
vminfo watch --json
vminfo watch --count 1
vminfo watch --interval 2s
```

## Saída

- O modo texto imprime instantâneos com marca de tempo.
- O modo JSON imprime JSON Lines com `collected_at`, `static` e `stats`.

## Ideal para

- monitoramento no terminal
- pipelines de logs
- verificações de CI
- loops de amostragem simples

## Exemplo

```bash
vminfo watch --json --count 3
```

## Relacionados

- [summary](/pt-BR/summary)
- [ps](/pt-BR/ps)
