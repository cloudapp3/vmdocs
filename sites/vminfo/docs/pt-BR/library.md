---
title: Biblioteca Go
description: Incorpore o vminfo como uma biblioteca Go para coleta de métricas do host e integração com a interface de terminal.
---

# Biblioteca Go

O vminfo expõe pacotes públicos para coletar métricas do host e incorporar a interface de terminal.

## Pacotes

- `github.com/cloudapp3/vminfo`
- `github.com/cloudapp3/vminfo/tui`

## Tipos exportados

- `StaticInfo`
- `RuntimeStats`
- `Snapshot`
- `ProcessInfo`
- `AppMetadata`

## Pontos de entrada comuns

- `CollectStatic`
- `CollectStats`
- `CollectAll`
- `Metadata`
- `tui.Run`

## Relacionado

- [Coletar métricas](/pt-BR/collect)
- [Incorporar o TUI](/pt-BR/embed-tui)
