---
title: TUI 임베드
description: 다른 Go CLI에서 인터랙티브 터미널 UI를 실행합니다.
---

# TUI 임베드

`github.com/cloudapp3/vminfo/tui` 패키지를 사용하면 자신의 CLI에서 동일한 인터랙티브 UI를 실행할 수 있습니다.

## 예제

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

## 옵션

| 필드 | 설명 |
| --- | --- |
| `Stdout` | 터미널 출력 스트림 |
| `Stdin` | 키보드 입력 스트림 |
| `Lang` | UI 언어 (예: `en` 또는 `zh`) |

`tui.Options`는 커스텀 스트림에서도 동작하므로, 임베드된 CLI와 테스트에 유용합니다.
