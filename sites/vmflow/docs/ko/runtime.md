---
title: 런타임 API
description: 임베드 가능한 vmflow.Runtime Go API 참조 — 생성, 스냅샷 적용, 단일 규칙 작업, 상태 조회, 라이프사이클.
---

# 런타임 API

최상위 `github.com/cloudapp3/vmflow` 패키지는 안정적인 임베드 facade입니다. `engine` 패키지 위에 `Runtime`을 노출합니다.

## 생성

```go
rt := vmflow.New()                       // default options
rt, _ := vmflow.NewRuntime(vmflow.Options{
    Collector:    nil,                   // nil -> a new in-memory collector is created
    CertProvider: nil,                   // nil -> HTTPS rules disabled (HTTPS is disabled in current build anyway)
})
```

| 함수 | 반환 |
| --- | --- |
| `New() *Runtime` | 기본 옵션의 Runtime. |
| `NewRuntime(opts Options) *Runtime` | 명시적 옵션의 Runtime. |

`Options`:

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `Collector` | `*engine.Collector` | 카운터를 공유/래핑합니다. `nil`이면 새로 만듭니다. |
| `CertProvider` | `CertProvider` | HTTPS 규칙을 활성화합니다(현재 빌드에서 비활성화됨). TCP/UDP의 경우 `nil`로 두세요. |

## desired state 적용

```go
result := rt.Apply(rules)                                       // full replacement (ReplaceAll=true)
result := rt.ApplySnapshot(rules, engine.ApplySnapshotOptions{ // explicit options
    ReplaceAll: true,
})
```

`Apply`는 `engine.ApplyResult`를 반환합니다:

| 필드 | 의미 |
| --- | --- |
| `AppliedRules` / `StoppedRules` / `FailedRules` / `TotalRules` | 작업 요약 카운트입니다. |
| `Items []ApplyItemResult` | 규칙별 결과(`RuleID`, `Revision`, `Action`, `Status`, `Error`). |

애플리케이션이 자체 데이터베이스에서 완전한 desired state를 계산할 때는 `Apply`를 선호하세요.

## 단일 규칙 작업

```go
err := rt.StartRule(rule)   // start one rule; error if it cannot bind
err := rt.RestartRule(rule) // stop+start, picking up new fields
rt.StopRule(ruleID)         // stop, keep counters
rt.RemoveRule(ruleID)       // stop, drop counters
```

`StartRule`과 `RestartRule`은 `error`를 반환합니다(예: 포트를 사용할 수 없음). `StopRule`과 `RemoveRule`은 실패하지 않습니다.

## 상태와 카운터

```go
rules := rt.RunningRules()      // []engine.Rule, sorted by rule_id
n := rt.RunningCount()          // int
snap := rt.Snapshot(ruleID)     // engine.TrafficSnapshot
snaps := rt.SnapshotAll()       // []engine.TrafficSnapshot, sorted by rule_id
```

카운터는 메모리에만 존재합니다. 기록은 자체 저장소에 영속화하세요.

## 라이프사이클

```go
rt.StopAll()                 // stop all rules; keep the runtime reusable
err := rt.Close()            // stop all rules; mark runtime closed
err := rt.Shutdown(ctx)      // alias of Close today; ctx reserved for future graceful drain
```

`Close`/`Shutdown` 이후의 추가 호출은 안전한 no-op이 됩니다: 상태 조회는 zero value를 반환하고 `Apply`는 `FailedRules == len(rules)`인 결과를 반환합니다.

## 더 낮은 수준의 접근

```go
m := rt.Manager()    // *engine.Manager — advanced use
c := rt.Collector()  // *engine.Collector — read raw counters
```

facade 메서드가 노출하지 않는 기능이 필요한 경우가 아니면 facade 메서드를 선호하세요.

## `engine.Rule` 필드

```go
rules := []engine.Rule{
    {
        RuleID:      "ssh-forward",
        Name:        "ssh-forward",
        Protocol:    engine.ProtocolTCP, // ProtocolTCP | ProtocolUDP | ProtocolTCPUDP
        ListenAddr:  "0.0.0.0",
        ListenPort:  2201,
        TargetAddr:  "127.0.0.1",
        TargetPort:  22,
        Enabled:     true,
        SpeedLimit:  0,   // bytes/sec, 0 = unlimited
        MaxConn:     0,   // 0 = unlimited
        Remark:      "example",
    },
}
```

스냅샷을 diff할 때는 런타임 필드만 비교됩니다. 메타데이터(`Remark`, `Revision`, 타임스탬프)를 편집해도 실행 중인 규칙이 재시작되지 않습니다. [규칙과 라이프사이클](./rules)을 참고하세요.
