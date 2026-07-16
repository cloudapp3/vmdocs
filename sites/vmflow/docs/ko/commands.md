---
title: 명령어 참조
description: foreground, ctl, tui, mcp, version, update, service, uninstall을 위한 vmflow CLI 참조입니다.
---

# 명령어 참조

vmflow는 포그라운드 실행과 일곱 개의 하위 명령을 제공하는 단일 바이너리입니다.

| 명령어 | 별칭 | 용도 |
| --- | --- | --- |
| `vmflow` | - | 포워딩 런타임을 포그라운드로 실행합니다. |
| [`ctl`](./ctl) | `c` | 실행 중인 데몬을 조회하고 제어합니다. |
| [`tui`](./tui) | `t` | 터미널 대시보드입니다. |
| [`mcp`](./mcp) | - | 실행 중인 로컬 데몬을 위한 읽기 전용 stdio MCP 서버입니다. |
| [`version`](./version) | `v` | 빌드 메타데이터를 출력합니다. |
| [`update`](./update) | `u` | 새 릴리스를 확인하거나 설치합니다. |
| [`service`](./service) | `svc` | 네이티브 OS 서비스로 등록합니다(부팅 시 시작). |
| [`uninstall`](./uninstall) | `remove`, `rm` | 정리를 포함한 원커맨드 제거입니다. |

## 공통 관리 플래그 {#common-client-flags}

번들 `ctl`, `tui`, `mcp` 명령은 로컬 데몬에 연결합니다.

| 플래그 | 환경 변수 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `-token` | `VMFLOW_CONTROL_TOKEN` | _(없음)_ | 인증을 활성화한 경우의 Bearer token입니다. |

원격 관리는 [로컬 관리](./api)의 SSH 터널을 사용하세요.

## 참고

- 더 오래된 분할 바이너리인 `relayd`, `relayctl`, `relaytui`는 호환성을 위해 여전히 빌드할 수 있습니다 — 같은 패키지 위의 얇은 셸이며 같은 `VMFLOW_CONTROL_TOKEN` 환경 변수를 읽습니다 — 하지만 릴리스는 통합된 `vmflow` 바이너리를 선호합니다.
- 터널 명령어(`tunnel-server`, `tunnel-client`, `tunnel-ctl`)와 인증서 명령어(`certs`, `certs-obtain`, `certs-review`)는 현재 빌드에서 **활성화되어 있지 않습니다**.
