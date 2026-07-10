---
title: vmflow 임베딩
description: vmflow 포워딩 런타임을 자체 Go 컨트롤 플레인에 임베드하는 방법 — 책임 분담, 권장 API, 데이터 흐름, 영속성 가이드.
---

# vmflow 임베딩

vmflow는 독립형 데몬으로 실행할 수 있지만, 핵심 포워딩 런타임은 더 큰 Go 컨트롤 플레인 — 이미 사용자, 저장소, UI 또는 노드 오케스트레이션을 관리하는 자체 서비스 — 에 임베드할 수 있도록 설계되었습니다.

## 책임 분담

임베드할 때는 책임을 분리하세요:

| 계층 | 담당 |
| --- | --- |
| 호스트 애플리케이션 | 데이터베이스, 사용자, 과금, 웹 UI, 노드 오케스트레이션, 규칙 소유권, 기록 집계 |
| vmflow 런타임 | TCP/UDP 포워딩, 규칙 라이프사이클, 최대 연결 수 제한, 실시간 카운터 |

의존성 방향은 단방향입니다:

```text
your application  ->  github.com/cloudapp3/vmflow
```

vmflow는 애플리케이션의 모델, 데이터베이스 코드 또는 작업 프로토콜을 import해서는 안 됩니다.

## 권장 API

대부분의 임베더는 최상위 facade를 사용하세요:

```go
package main

import (
    "github.com/cloudapp3/vmflow"
    "github.com/cloudapp3/vmflow/engine"
)

func main() {
    rt := vmflow.New()
    defer rt.Close()

    rules := []engine.Rule{
        {
            RuleID:     "ssh-forward",
            Name:       "ssh-forward",
            Protocol:   engine.ProtocolTCP,
            ListenAddr: "0.0.0.0",
            ListenPort: 2201,
            TargetAddr: "127.0.0.1",
            TargetPort: 22,
            Enabled:    true,
        },
    }

    result := rt.Apply(rules) // full replacement snapshot
    if result.FailedRules > 0 {
        // handle failed rules in your application
    }

    snapshots := rt.SnapshotAll()
    _ = snapshots
}
```

고급 사용을 위해 더 낮은 수준의 `engine.Manager` API도 사용할 수 있습니다:

```go
manager := rt.Manager()
```

애플리케이션이 자체 데이터베이스에서 완전한 desired state를 계산할 때는 `Runtime.Apply`를 선호하세요. `StartRule`, `RestartRule`, `StopRule`, `RemoveRule`은 대상이 지정된 로컬 작업에만 사용하세요.

전체 메서드 목록은 [런타임 API](./runtime)를 참고하세요.

## 데이터 흐름

임베드 사용을 위한 권장 흐름입니다:

```text
your DB / business API
        ↓
convert business forwarding records to []engine.Rule
        ↓
vmflow.Runtime.Apply(rules)
        ↓
vmflow.Runtime.SnapshotAll()
        ↓
your application samples and persists traffic history in its own DB
```

임베드할 때는 **YAML을 source of truth로 만들지 마세요**. 애플리케이션이 desired state를 소유하고 `[]engine.Rule`을 vmflow에 직접 전달해야 합니다.

## 영속성 가이드

vmflow는 독립형 데몬 모드를 위한 로컬 저장소를 제공할 수 있습니다. 임베드할 때는 다음 중 하나를 선호하세요:

1. 트래픽 기록과 감사 로그를 애플리케이션의 기존 데이터베이스에 영속화하세요.
2. vmflow의 로컬 저장소를 비활성화하세요.
3. 실시간 카운터와 포워딩 라이프사이클에만 vmflow를 사용하세요.

이렇게 하면 두 개의 경쟁하는 source of truth가 생기지 않습니다.

## HTTPS 규칙과 인증서 (비활성화)

::: warning 현재 빌드에서 비활성화됨
HTTPS 포워딩과 ACME/인증서 관리는 **활성화되어 있지 않습니다**: `engine` 규칙 검증이 `http`/`https` 프로토콜을 거부하고, 데몬은 ACME를 시작하지 않으며, `/v1/certs*` 라우트와 `certs` CLI 하위 명령이 제거되었습니다. 아래 설명은 다시 활성화될 때를 대비한 예약된 인터페이스를 설명합니다. 소스는 `acme/`, `certstore/`, `certreview/`, `engine/https.go`, `engine/proxy.go`에 보존되어 있습니다.
:::

HTTPS 규칙은 인증서 프로바이더가 필요합니다. 독립형 데몬은 내장 ACME 매니저를 사용할 수 있습니다. 임베드한 애플리케이션은 자체 프로바이더를 주입할 수 있습니다:

```go
rt := vmflow.NewRuntime(vmflow.Options{
    CertProvider: myProvider,
})
```

프로바이더는 다음을 만족해야 합니다:

```go
type CertProvider interface {
    GetCertificate(hello *tls.ClientHelloInfo) (*tls.Certificate, error)
    Obtain(ctx context.Context, domains []string) error
}
```

## 안정 패키지와 선택 패키지

안정적인 임베드 노출 영역입니다:

```text
github.com/cloudapp3/vmflow
github.com/cloudapp3/vmflow/engine
```

선택적인 데몬/컨트롤 패키지입니다:

```text
config/
controlapi/
tui/
bot/
acme/
cmd/
```

선택 패키지는 독립형 vmflow 배포에 유용하지만 임베드 통합에서 필수로 요구되어서는 안 됩니다.

## 종료

애플리케이션이 종료될 때 `Close` 또는 `Shutdown`을 사용하세요:

```go
_ = rt.Shutdown(ctx)
```

현재 구현은 동기적으로 중지합니다. `Shutdown(ctx)` 형태는 향후 graceful drain 지원을 위해 예약되어 있습니다.
