---
title: Recolectar métricas
description: Usa vminfo desde código Go para recolectar metadatos del host y métricas en tiempo de ejecución.
---

# Recolectar métricas

Usa el paquete raíz para recolectar datos del host desde Go.

## Ejemplo mínimo

```go
package main

import (
	"context"
	"fmt"
	"time"

	"github.com/cloudapp3/vminfo"
)

func main() {
	ctx := context.Background()

	static, _ := vminfo.CollectStatic(ctx)
	stats, _ := vminfo.CollectStats(ctx, vminfo.Options{SampleInterval: time.Second})

	fmt.Println(static.Hostname, stats.CPU)
}
```

## Opciones

| Campo | Descripción |
| --- | --- |
| `SampleInterval` | Duración de muestreo usada por `CollectStats` y `CollectAll` |

## Notas

- `CollectAll` devuelve tanto `StaticInfo` como `RuntimeStats`.
- `CollectStats` usa una instantánea estática en caché y muestras dinámicas frescas.
- `SampleInterval` por defecto es un segundo si no se establece.

## Relacionado

- [Biblioteca Go](/es/library)
- [HTTP API](/es/api)
