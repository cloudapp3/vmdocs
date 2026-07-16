---
title: 설정
description: 로컬 관리, 로깅, 인증, 통계, 포워딩 규칙, 소스 IP 접근 정책을 위한 vmflow YAML 참조입니다.
---

# 설정

vmflow는 단일 YAML 파일로 구동됩니다. `-config`로 데몬에 전달합니다:

```bash
vmflow -config ./examples/config.yaml
```

리로드는 이 파일을 다시 읽고 새로운 desired state를 적용합니다([규칙과 라이프사이클](./rules) 참고).

## 전체 예제

```yaml
version: 1
control_port: 19090

log:
  level: info
  format: text # text or json

# 관리는 항상 127.0.0.1에 바인딩되며 포트만 설정합니다.
# The CLI/TUI can pass the token with -token or VMFLOW_CONTROL_TOKEN.
auth:
  enabled: false
  tokens:
    - name: admin
      token: change-me
      role: admin

rules:
  - rule_id: ssh-forward
    name: ssh-forward
    protocol: tcp
    listen_addr: 0.0.0.0
    listen_port: 2201
    target_addr: 127.0.0.1
    target_port: 22
    enabled: true
    speed_limit: 0
    max_conn: 0
    source_ip_mode: allowlist
    source_ips:
      - 203.0.113.8
      - 198.51.100.0/24
      - 2001:db8:100::/48
    remark: example
```

## 최상위 필드

| 필드 | 설명 |
| --- | --- |
| `version` | 설정 스키마 버전입니다. 현재 `1`입니다. |
| `control_port` | 로컬 관리 포트입니다. 기본값은 `19090`이며 호스트는 항상 `127.0.0.1`입니다. |
| `log` | 구조화된 로깅 — `level`과 `format`. |
| `auth` | `admin` / `viewer` 역할의 Bearer 토큰 인증입니다. |
| `bot_token`, `bot_chat` | Telegram 봇 — [Telegram 봇](./telegram-bot)을 참고하세요. |
| `rules` | 포워딩 규칙입니다(아래 `rules[]` 참고). |

## `log`

| 필드 | 값 |
| --- | --- |
| `level` | 로그 레벨(예: `debug`, `info`, `warn`, `error`). |
| `format` | `text` 또는 `json`. |

## `auth`

CLI/TUI 관리를 위한 Bearer token 인증입니다.

| 필드 | 설명 |
| --- | --- |
| `enabled` | 로컬 관리 도구에 설정된 token을 요구합니다. |
| `tokens[].name` | 토큰의 라벨입니다(인증에 사용되지 않음). |
| `tokens[].token` | Bearer 토큰 문자열입니다. |
| `tokens[].role` | `admin`(읽기 + 쓰기) 또는 `viewer`(읽기 전용). |

## `rules[]`

각 항목은 하나의 포워딩 규칙을 나타냅니다.

| 필드 | 설명 |
| --- | --- |
| `rule_id` | 안정적인 고유 ID로, 리로드 간 diff에 사용됩니다. |
| `name` | 사람이 읽을 수 있는 이름입니다. |
| `protocol` | `tcp`, `udp`, 또는 `tcp+udp`. |
| `listen_addr` | 리슨할 주소(예: `0.0.0.0`). |
| `listen_port` | 리슨할 포트입니다. |
| `target_addr` | 포워딩할 업스트림 주소입니다. |
| `target_port` | 업스트림 포트입니다. |
| `enabled` | `false`이면 규칙이 설정에는 유지되지만 시작되지 않습니다. |
| `speed_limit` | 연결당 속도 제한(바이트/초, `0` = 무제한). |
| `max_conn` | 최대 동시 연결 수(`0` = 무제한). 한도를 초과하는 새 연결은 닫힙니다. |
| `idle_timeout` | 연결당 유휴 타임아웃(초, `0` = 기본값 5분). 변경하면 규칙이 재시작됩니다. |
| `source_ip_mode` | 소스 IP 허용 모드: `off`, `allowlist`, `denylist`. 생략하면 `off`입니다. |
| `source_ips` | 선택한 모드에서 사용하는 IPv4/IPv6 리터럴 주소 또는 CIDR. 규칙당 최대 256개입니다. |
| `remark` | 자유 형식 메모입니다. |

## 소스 IP 접근 정책

`allowlist`는 `source_ips`와 일치하는 소스만 허용합니다. `denylist`는 일치하는 소스를 거부하고 나머지는 허용합니다. 활성 허용 목록 또는 차단 목록에는 항목이 하나 이상 있어야 하며, 호스트 이름, 잘못된 주소, 빈 항목, 256개를 초과하는 목록은 거부됩니다.

TCP는 `max_conn`을 소비하거나 대상에 연결하기 전에 소켓 피어를 검사합니다. UDP는 세션을 생성하거나 규칙별·전역 UDP 세션 한도를 소비하기 전에 검사합니다. 모드 또는 유효 항목 집합을 변경하면 규칙이 재시작되고 기존 TCP 연결과 UDP 세션이 닫히므로 새 정책이 즉시 적용됩니다.

정책은 실제 소켓 피어를 확인합니다. NAT 또는 L4 프록시 뒤에서는 원래 클라이언트가 아니라 게이트웨이나 프록시의 주소일 수 있습니다. vmflow는 전달된 HTTP 헤더나 PROXY protocol 메타데이터를 신뢰하지 않습니다. 대규모 공격에 대한 첫 번째 방어 계층으로 클라우드 방화벽, security group 또는 호스트 방화벽을 사용하세요.

::: tip
`http`와 `https` 프로토콜은 소스에 존재하지만 현재 빌드에서는 비활성화되어 있습니다. 검증 단계에서 거부됩니다. [포워딩 참조](./forwarding)를 참고하세요.
:::

## 기타 필드

그 밖에 Telegram bot 필드와 예약된 ACME/인증서 필드를 사용할 수 있습니다. 활성 bot 설정은 [Telegram Bot](./telegram-bot)을 참고하세요.

| 필드 | 상태 |
| --- | --- |
| `bot_token`, `bot_chat` | 활성 — [Telegram 봇](./telegram-bot)을 참고하세요. |
| `acme_*`, `cert_cache_dir`, `cert_review.*` | 예약됨(현재 빌드에서 무시됨). |
