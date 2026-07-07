---
title: 지표 수집
description: Go 코드에서 vminfo를 사용해 호스트 메타데이터와 런타임 지표를 수집합니다.
---

# 지표 수집

루트 패키지를 사용해 Go에서 호스트 데이터를 수집합니다.

## 최소 예제

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

## 옵션

| 필드 | 설명 |
| --- | --- |
| `SampleInterval` | `CollectStats`와 `CollectAll`이 사용하는 샘플링 시간 |

## 참고

- `CollectAll`은 `StaticInfo`와 `RuntimeStats`를 모두 반환합니다.
- `CollectStats`는 캐시된 정적 스냅샷과 새로운 동적 샘플을 사용합니다.
- `SampleInterval`은 설정하지 않은 경우 기본적으로 1초가 됩니다.

## 관련 문서

- [Go 라이브러리](/ko/library)
- [HTTP API](/ko/api)
