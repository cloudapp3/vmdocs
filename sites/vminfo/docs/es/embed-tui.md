---
title: Incrustar la TUI
description: Ejecuta la UI de terminal interactiva desde otra CLI de Go.
---

# Incrustar la TUI

El paquete `github.com/cloudapp3/vminfo/tui` te permite lanzar la misma UI interactiva desde tu propia CLI.

## Ejemplo

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

## Opciones

| Campo | Descripción |
| --- | --- |
| `Stdout` | Flujo de salida de terminal |
| `Stdin` | Flujo de entrada de teclado |
| `Lang` | Idioma de la UI, como `en` o `zh` |

`tui.Options` también funciona con flujos personalizados, lo cual es útil para CLIs incrustadas y pruebas.
