---
title: Встраивание TUI
description: Запуск интерактивного терминального UI из другой Go CLI.
---

# Встраивание TUI

Пакет `github.com/cloudapp3/vminfo/tui` позволяет запустить тот же интерактивный UI из собственной CLI.

## Пример

```go
package main

import (
	"context"
	"log"

	vminfotui "github.com/cloudapp3/vminfo/tui"
)

func main() {
	if err := vminfotui.Run(context.Background(), vminfotui.Options{Lang: "en"}); err != nil {
		log.Fatal(err)
	}
}
```

## Опции

| Поле | Описание |
| --- | --- |
| `Stdout` | Поток вывода терминала |
| `Stdin` | Поток ввода с клавиатуры |
| `Lang` | Язык интерфейса, например `en` или `zh` |

`tui.Options` также работает с пользовательскими потоками, что полезно для встраиваемых CLI и тестов.
