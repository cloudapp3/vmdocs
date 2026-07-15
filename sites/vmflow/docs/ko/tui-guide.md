---
title: TUI 대시보드
description: vmflow 터미널 대시보드 — 시작하고, Dashboard·Rules·Detail 보기 간에 전환합니다.
---

# TUI 대시보드

vmflow는 로컬 데몬의 규칙 상태와 트래픽 카운터를 확인하는 터미널 UI를 제공합니다.

## 시작하기

```bash
vmflow tui
```

인증을 활성화한 경우 액세스 토큰을 전달하세요:

```bash
vmflow tui -token <token>
# or
VMFLOW_CONTROL_TOKEN=<token> vmflow tui
```

## 보기

<kbd>Tab</kbd>을 눌러 보기 간에 순환하세요:

| 보기 | 표시 |
| --- | --- |
| **Dashboard** | 전반적인 상태, 실행 중인 규칙 수, 가동 시간. |
| **Rules** | 라이브 카운터와 함께 실행 중인 규칙 목록. 이름으로 규칙 필터링 지원. |
| **Detail** | 선택한 규칙의 상세 정보. |

## 활용 시점

TUI는 메트릭을 수집하지 않고 "vmflow가 지금 무엇을 하고 있는가?"에 답하는 가장 빠른 방법입니다. 장기 히스토리가 필요하다면 대신 Prometheus를 `/metrics`로 향하게 하세요 — TUI는 메모리 상의 현재 상태만 보여줍니다.
