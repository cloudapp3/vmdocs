---
title: Biblioteca Go
description: Incrusta vminfo como biblioteca Go para la recolección de métricas del host y la integración con la UI de terminal.
---

# Biblioteca Go

vminfo expone paquetes públicos para recolectar métricas del host e incrustar la UI de terminal.

## Paquetes

- `github.com/cloudapp3/vminfo`
- `github.com/cloudapp3/vminfo/tui`

## Tipos exportados

- `StaticInfo`
- `RuntimeStats`
- `Snapshot`
- `ProcessInfo`
- `AppMetadata`

## Puntos de entrada comunes

- `CollectStatic`
- `CollectStats`
- `CollectAll`
- `Metadata`
- `tui.Run`

## Relacionado

- [Recolectar métricas](/es/collect)
- [Incrustar la TUI](/es/embed-tui)
