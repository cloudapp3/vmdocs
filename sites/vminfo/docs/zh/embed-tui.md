---
title: 嵌入 TUI
description: 在另一个 Go CLI 中运行交互式终端 UI。
---

# 嵌入 TUI

`github.com/cloudapp3/vminfo/tui` 包可以让你从自己的 CLI 启动同样的交互式 UI。

## 示例

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

## 选项

| 字段 | 说明 |
| --- | --- |
| `Stdout` | 终端输出流 |
| `Stdin` | 键盘输入流 |
| `Lang` | UI 语言，例如 `en` 或 `zh` |

`tui.Options` 也支持自定义流，对嵌入式 CLI 和测试很有用。
