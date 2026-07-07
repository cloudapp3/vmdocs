---
title: 웹 대시보드
description: 읽기 전용 HTTP API와 웹 대시보드 시작하기, 토큰 인증 및 웹소켓 접근 포함.
---

# 웹 대시보드

`vminfo --web`은 전환 가능한 테마를 갖춘 가벼운 읽기 전용 HTTP API와 대시보드를 시작합니다.

## 서버 시작

```bash
vminfo --web
```

기본 주소:

```text
http://127.0.0.1:20021
```

사용자 지정 주소:

```bash
vminfo --web --bind 0.0.0.0 --port 8080 --interval 1s
```

대시보드와 함께 TUI를 실행할 수도 있습니다:

```bash
vminfo --web --tui
```

## 인증

기본적으로 대시보드와 API는 로컬이며 인증이 없습니다.

`--token`이 활성화되면:

```bash
vminfo --web --token
vminfo --web --token my-secret
```

- 인수 없는 `--token`은 URL에 안전한 토큰을 자동 생성합니다
- `--token my-secret`은 고정 토큰을 사용합니다
- 첫 번째로 성공한 `/?token=...` 방문이 이후 요청을 위한 쿠키를 설정합니다
- `/healthz`는 로컬 프로브를 위해 공개로 유지됩니다
- `/`, `/api/v1/*`, `/ws`는 토큰 또는 인증 쿠키가 필요합니다
- 토큰으로 보호된 모드는 관대한 `Access-Control-Allow-Origin: *`을 노출하지 않습니다
- WebSocket 업그레이드는 브라우저 오리진이 대시보드 호스트와 일치해야 합니다

::: warning 원격 접근
`0.0.0.0`에 바인딩할 때, 대시보드가 신뢰할 수 있는 사설망에만 노출되는 경우가 아니면 `--token`을 활성화하세요.
:::

## 엔드포인트

| 엔드포인트 | 용도 |
| --- | --- |
| `GET /healthz` | 공개 상태 확인 |
| `GET /api/v1/snapshot` | 전체 런타임 스냅샷 |
| `GET /api/v1/cpu` | CPU 데이터 |
| `GET /api/v1/memory` | 메모리와 스왑 데이터 |
| `GET /api/v1/disk` | 파일시스템과 디스크 I/O 데이터 |
| `GET /api/v1/network` | 네트워크 합계와 인터페이스 데이터 |
| `GET /api/v1/processes` | 프로세스 목록 |
| `GET /api/v1/system` | 호스트 메타데이터 |
| `GET /api/v1/health` | 상태 점수와 경고 |
| `POST /api/v1/net/diag` | 네트워크 진단 실행 (dns / port / ping / ip) |
| `GET /ws` | 실시간 스냅샷 스트림 |

페이로드 예제와 쿼리 매개변수는 전체 [HTTP API 참조](/ko/api)를 참조하세요.

## 테마

대시보드는 헤더에서 전환 가능한 테마를 제공합니다: **Auto**, **Neon**, **Light**, **Terminal**, **Synthwave**. "Auto"는 OS 색 구성표를 따릅니다.

[JetBrains Mono](https://www.jetbrains.com/lp/mono/)는 바이너리에 **임베드**되어 있어, 대시보드는 완전히 자체 포함됩니다 — 의도된 고정폭 글꼴로 렌더링되며 외부 글꼴 요청 없이 오프라인으로 작동합니다.
