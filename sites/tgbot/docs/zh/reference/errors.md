---
title: 处理 Telegram Bot API 错误与限流
description: 在 tgbot 中处理 Telegram Bot API 错误、HTTP 失败、context 取消、retry_after 限流和 Poller 投递错误。
---

# 错误与限流

tgbot 可能返回请求编码、HTTP transport、Telegram 响应、响应解码、轮询和 Handler 执行错误。

## Telegram API 错误

Telegram 失败响应包含 API 错误信息时，会表示为 `*tgbot.APIError`。

```go
_, err := bot.SendMessage(ctx, params)
if err == nil {
	return nil
}

var apiErr *tgbot.APIError
if errors.As(err, &apiErr) {
	log.Printf(
		"telegram error: status=%d code=%d retry_after=%d message=%s",
		apiErr.StatusCode,
		apiErr.Code,
		apiErr.RetryAfter,
		apiErr.Message,
	)
}
return err
```

不要解析 `Error()` 字符串控制业务流程，应使用 `errors.As` 和结构化字段。

## 限流

```go
if tgbot.IsTooManyRequests(err) {
	var apiErr *tgbot.APIError
	if errors.As(err, &apiErr) && apiErr.RetryAfter > 0 {
		// 按 Telegram 指定的延迟安排有界重试。
	}
}
```

重试策略必须结合操作幂等性和延迟预算。不要盲目重试所有错误，也不要永久占用请求 goroutine。

## Context 错误

```go
if errors.Is(err, context.Canceled) {
	return nil
}
if errors.Is(err, context.DeadlineExceeded) {
	return fmt.Errorf("telegram request timed out: %w", err)
}
```

Transport 错误经过包装后，仍可能通过 `errors.Is` 保留 context 取消信息。

## Poller 错误

必须持续消费 `UpdatePoller.Errors()`。错误流可能包含请求失败，也可能在非阻塞模式下包含表示交付丢弃的 `*UpdateDispatchError`。

```go
for err := range poller.Errors() {
	var dropped *tgbot.UpdateDispatchError
	if errors.As(err, &dropped) {
		metrics.DroppedUpdates.Add(1)
		continue
	}
	log.Printf("polling failed: %v", err)
}
```

错误 channel 有界，满时也会丢错误。需要精确观测时，应输出应用自己的 metrics。

请求取消和 deadline 见 [SDK 客户端](/zh/sdk/client)，重试、分发和关闭流程见[长轮询](/zh/updates/long-polling)。
