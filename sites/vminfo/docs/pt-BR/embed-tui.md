---
title: Incorporar o TUI
description: Execute a interface de terminal interativa a partir de outro CLI em Go.
---

# Incorporar o TUI

O pacote `github.com/cloudapp3/vminfo/tui` permite iniciar a mesma interface interativa a partir do seu próprio CLI.

## Exemplo

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

## Opções

| Campo | Descrição |
| --- | --- |
| `Stdout` | Fluxo de saída do terminal |
| `Stdin` | Fluxo de entrada do teclado |
| `Lang` | Idioma da interface, como `en` ou `zh` |

`tui.Options` também funciona com fluxos personalizados, o que é útil para CLIs incorporados e testes.
