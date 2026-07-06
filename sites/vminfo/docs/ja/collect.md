---
title: 指標を収集する
description: Go コードから vminfo を使い、ホストのメタデータとランタイム指標を収集します。
---

# 指標を収集する

ルートパッケージを使って、Go からホストデータを収集します。

## 最小構成の例

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

## オプション

| フィールド | 説明 |
| --- | --- |
| `SampleInterval` | `CollectStats` と `CollectAll` が使用するサンプリング時間 |

## メモ

- `CollectAll` は `StaticInfo` と `RuntimeStats` の両方を返します。
- `CollectStats` はキャッシュされた静的スナップショットと最新の動的サンプルを使います。
- `SampleInterval` は未設定の場合、既定で 1 秒になります。

## 関連情報

- [Go ライブラリ](/ja/library)
- [HTTP API](/ja/api)
