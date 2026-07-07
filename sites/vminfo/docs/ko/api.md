---
title: HTTP API
description: vminfo 웹 대시보드가 노출하는 읽기 전용 HTTP API와 WebSocket 엔드포인트.
---

# HTTP API

`vminfo --web`은 가벼운 읽기 전용 HTTP API와 대시보드를 시작합니다.

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
- `/healthz`는 공개로 유지됩니다
- `/`, `/api/v1/*`, `/ws`는 토큰 또는 인증 쿠키가 필요합니다
- 토큰으로 보호된 모드는 관대한 `Access-Control-Allow-Origin: *`을 노출하지 않습니다
- WebSocket 요청은 대시보드 호스트와 동일한 브라우저 오리진을 사용해야 합니다

## 엔드포인트

### `GET /healthz`

웹 프로세스의 공개 상태 확인입니다.

```json
{
  "status": "ok",
  "ws_clients": 0
}
```

### `GET /api/v1/snapshot`

현재 전체 대시보드 스냅샷을 반환합니다.

```json
{
  "timestamp": "2026-06-14T12:00:00Z",
  "system": {},
  "cpu": {},
  "memory": {},
  "disk": {},
  "network": {},
  "load": {},
  "processes": {},
  "health": {}
}
```

### `GET /api/v1/cpu`

CPU 합계, 코어별 사용량, 그리고 짧은 메모리 내 CPU 기록을 반환합니다.

### `GET /api/v1/memory`

메모리와 스왑 합계, 사용량, 가용량, 백분율을 반환합니다.

### `GET /api/v1/disk`

파일시스템 사용량과 디스크 I/O 비율을 반환합니다.

### `GET /api/v1/network`

네트워크 처리량, TCP/UDP 연결 수, 인터페이스 카운터를 반환합니다.

Linux에서 페이로드는 TCP 상태 분포 (`ESTABLISHED`, `TIME_WAIT`, `SYN_RECV`, … 상태의 소켓 수)와 conntrack 사용량 (현재 vs. 최대 `nf_conntrack` 항목)도 포함하여, 소켓 또는 연결 추적 포화를 발견할 수 있게 합니다.

### `GET /api/v1/processes`

보완된 프로세스 목록을 반환합니다.

지원되는 쿼리 매개변수:

| 매개변수 | 설명 |
| --- | --- |
| `filter` | PID, PPID, 이름, 명령어, 사용자, 또는 상태에 대한 대소문자 구분 없는 일치 |
| `q` | `filter`의 별칭 |
| `sort` | `cpu`, `mem`, `pid`, 또는 `name`; 기본값 `cpu` |
| `limit` | 반환되는 최대 행 수; `0`이거나 생략하면 제한 없음 |

예제:

```bash
curl 'http://127.0.0.1:20021/api/v1/processes?filter=ssh&sort=mem&limit=10'
```

응답 형태:

```json
{
  "total": 128,
  "list": [
    {
      "pid": 1234,
      "ppid": 1,
      "name": "sshd",
      "user": "root",
      "cpu_percent": 0.1,
      "mem_percent": 0.2,
      "rss": 12345678,
      "status": "S",
      "command": "sshd: user@pts/0",
      "threads": 1,
      "nice": 0,
      "uptime": 3600,
      "started_at_unix": 1781434800
    }
  ]
}
```

### `GET /api/v1/system`

호스트 메타데이터, OS/커널/아키텍처, CPU 모델/코어 수, 가동 시간을 반환합니다.

### `GET /api/v1/health`

대시보드가 사용하는 가벼운 상태 점수와 경고를 반환합니다.

```json
{
  "score": 90,
  "warnings": [
    {
      "level": "warning",
      "code": "disk_high",
      "message": "disk usage is 88.5%"
    }
  ]
}
```

`code` 필드는 경고를 식별합니다. 네트워크 관련 코드는 다음을 포함합니다:

| 코드 | 의미 |
| --- | --- |
| `network_errors` | 지속적인 인터페이스별 오류 비율 (이벤트/초, 누적 카운터 아님) |
| `network_drops` | 지속적인 인터페이스별 패킷 드롭 비율 |
| `tcpconn_high` | 비정상적으로 높은 TCP 소켓 수 (≥5000 경고 / ≥20000 치명적) |
| `conntrack_high` | conntrack 테이블이 가득 참 (≥85% 경고 / ≥95% 치명적, Linux) |

`network_errors` / `network_drops`를 제어하는 것은 비율입니다 — 원시 카운터가 아니므로, 오래 누적된 합계가 달리 건강한 호스트를 계속 플래그 지정하지 않습니다.

### `POST /api/v1/net/diag`

주문형 네트워크 진단을 실행합니다 — [`net` 명령어](/ko/net)와 동일한 프로브로, 대시보드에서 호출할 수 있습니다. 보호된 mux에 마운트되어 있어, 토큰 인증이 활성화되면 다른 `/api/v1/*` 라우트처럼 토큰 / 쿠키와 동일 오리진 검사를 상속합니다.

요청 본문:

| 필드 | 설명 |
| --- | --- |
| `action` | `dns`, `port`, `ping`, 또는 `ip` |
| `target` | 도메인 (dns) 또는 호스트 (port/ping); 필수. `ip`의 경우, 조회할 IP 또는 자신의 공인 IP에 대해서는 빈 값 |
| `port` | 대상 포트 (port / ping 액션) |
| `server` | 선택적 DNS 서버 (dns) 또는 IP 조회 서비스 기본 URL (ip) |
| `timeout_ms` | 프로브당 타임아웃(밀리초) (port / ping) |
| `count` | 프로브 수 (ping) |
| `mode` | ping 모드: `tcp` (기본값) 또는 `icmp` |

예제:

```bash
curl -X POST http://127.0.0.1:20021/api/v1/net/diag \
  -H 'Content-Type: application/json' \
  -d '{"action":"ping","target":"example.com","port":443,"count":4,"mode":"tcp"}'
```

응답 형태는 해당 CLI JSON 결과 (`DNSResult`, `PortResult`, `PingResult`, 또는 `IPInfo`)와 일치합니다.

### `GET /ws`

전체 대시보드 스냅샷의 WebSocket 스트림입니다.

- 연결 직후 최신 스냅샷을 전송합니다
- 수집기가 업데이트됨에 따라 새로고침된 스냅샷을 스트리밍합니다
- 토큰으로 보호된 모드에서, 요청은 인증되어야 하고 동일 오리진 검사를 통과해야 합니다

## 참고 자료

- [웹 대시보드 안내서](/ko/web-dashboard)
- [명령어 참조](/ko/commands)
