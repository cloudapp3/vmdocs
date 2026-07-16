---
title: TUI 대시보드
description: 터미널 UI에서 vmflow 규칙, 소스 IP 정책, 카운터, 사전 검사, 적용 작업을 확인하고 관리합니다.
---

# TUI 대시보드

vmflow는 로컬 데몬에 설정된 규칙과 실시간 트래픽 카운터를 확인하고 관리하는 터미널 UI를 제공합니다.

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
| **Rules** | 비활성 규칙을 포함한 설정된 규칙, 실시간 카운터, 준비된 변경 사항, 넓은 터미널에서의 `OPEN` / `ALLOW n` / `DENY n` 접근 요약. |
| **Detail** | 선택한 규칙 설정, 소스 IP 항목, 트래픽, 누적 `IP Denied` 카운터. |

## 규칙 관리

인증된 `admin` 토큰은 규칙을 생성, 편집, 복사, 활성화, 비활성화, 삭제할 수 있습니다. viewer 토큰과 인증되지 않은 세션은 읽기 전용입니다. Rules 보기에서 <kbd>n</kbd>/<kbd>e</kbd>/<kbd>c</kbd>로 생성·편집·복사하고, <kbd>Space</kbd>로 활성 상태를 전환하며, <kbd>d</kbd>로 삭제하고, <kbd>P</kbd>로 사전 검사를 실행하며, <kbd>A</kbd>로 검증된 초안을 적용합니다.

편집기의 `Source IP mode`에서 `OFF`, `ALLOWLIST`, `DENYLIST`를 선택할 수 있습니다. `Source IPs / CIDRs`에는 IPv4/IPv6 리터럴 주소와 CIDR을 쉼표로 구분해 입력합니다. 적용 전에 사전 검사를 통과해야 하며, 기존 revision/ETag 흐름이 오래된 편집기에서 더 최신 설정을 덮어쓰는 것을 방지합니다.

## 활용 시점

TUI는 메트릭을 수집하지 않고 "vmflow가 지금 무엇을 하고 있는가?"에 답하는 가장 빠른 방법입니다. 장기 히스토리가 필요하다면 대신 Prometheus를 `/metrics`로 향하게 하세요 — TUI는 메모리 상의 현재 상태만 보여줍니다.
