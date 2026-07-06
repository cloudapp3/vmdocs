---
title: TUI を組み込む
description: 他の Go CLI からインタラクティブなターミナル UI を起動します。
---

# TUI を組み込む

`github.com/cloudapp3/vminfo/tui` パッケージを使うと、独自の CLI から同じインタラクティブ UI を起動できます。

## 例

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

## オプション

| フィールド | 説明 |
| --- | --- |
| `Stdout` | ターミナル出力ストリーム |
| `Stdin` | キーボード入力ストリーム |
| `Lang` | UI 言語（`en` や `zh` など） |

`tui.Options` はカスタムストリームにも対応しており、組み込み CLI やテストで役立ちます。
