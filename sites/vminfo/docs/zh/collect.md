---
title: 采集指标
description: 在 Go 代码中使用 vminfo 采集主机元数据和运行时指标。
---

# 采集指标

使用根包从 Go 中采集主机数据。

## 最小示例

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

## 选项

| 字段 | 说明 |
| --- | --- |
| `SampleInterval` | `CollectStats` 和 `CollectAll` 使用的采样时长 |

## 注意事项

- `CollectAll` 同时返回 `StaticInfo` 和 `RuntimeStats`。
- `CollectStats` 使用缓存的静态快照和最新的动态采样。
- 未设置时，`SampleInterval` 默认为 1 秒。

## 相关文档

- [Go 库](/zh/library)
- [HTTP API](/zh/api)
