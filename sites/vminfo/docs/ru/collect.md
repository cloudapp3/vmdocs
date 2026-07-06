---
title: Сбор метрик
description: Использование vminfo из Go-кода для сбора метаданных хоста и метрик рантайма.
---

# Сбор метрик

Используйте корневой пакет для сбора данных хоста из Go.

## Минимальный пример

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

## Опции

| Поле | Описание |
| --- | --- |
| `SampleInterval` | Длительность выборки, используемая `CollectStats` и `CollectAll` |

## Примечания

- `CollectAll` возвращает и `StaticInfo`, и `RuntimeStats`.
- `CollectStats` использует кэшированный статический снимок и свежие динамические выборки.
- `SampleInterval` по умолчанию равен одной секунде, если не задан.

## См. также

- [Библиотека Go](/ru/library)
- [HTTP API](/ru/api)
