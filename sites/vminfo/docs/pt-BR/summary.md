---
title: summary
description: Coleta um instantâneo de execução como texto ou JSON.
---

# `vminfo summary`

Coleta um instantâneo do estado atual do host.

## Uso

```bash
vminfo summary
vminfo summary --json
vminfo summary --interval 1s
```

## Saída

- O modo texto imprime um resumo do host legível por humanos.
- O modo JSON imprime um objeto `vminfo.Snapshot` com os campos `static` e `stats`.

## Quando usar

- verificações rápidas no terminal
- scripts de shell
- diagnóstico de CI
- automação que precisa de uma única amostra

## Exemplo

```bash
vminfo summary --json
```

## Relacionados

- [watch](/pt-BR/watch)
- [API HTTP](/pt-BR/api)
- [Biblioteca Go](/pt-BR/library)
