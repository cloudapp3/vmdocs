---
title: Coletar métricas
description: Use o vminfo a partir de código Go para coletar metadados do host e métricas em tempo de execução.
---

# Coletar métricas

Use o pacote raiz para coletar dados do host a partir de Go.

## Exemplo mínimo

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

## Opções

| Campo | Descrição |
| --- | --- |
| `SampleInterval` | Duração da amostragem usada por `CollectStats` e `CollectAll` |

## Notas

- `CollectAll` retorna tanto `StaticInfo` quanto `RuntimeStats`.
- `CollectStats` usa um instantâneo estático em cache e amostras dinâmicas recentes.
- `SampleInterval` usa um segundo como padrão quando não definido.

## Relacionado

- [Biblioteca Go](/pt-BR/library)
- [API HTTP](/pt-BR/api)
