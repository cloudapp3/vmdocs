---
title: 설정
description: 로컬 관리, 로깅, 인증, 통계, 포워딩 규칙을 위한 vmflow YAML 참조입니다.
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
| `remark` | 자유 형식 메모입니다. |

::: tip
`http`와 `https` 프로토콜은 소스에 존재하지만 현재 빌드에서는 비활성화되어 있습니다. 검증 단계에서 거부됩니다. [포워딩 참조](./forwarding)를 참고하세요.
:::

## 기타 필드

그 밖에 Telegram bot 필드와 예약된 ACME/인증서 필드를 사용할 수 있습니다. 활성 bot 설정은 [Telegram Bot](./telegram-bot)을 참고하세요.

| 필드 | 상태 |
| --- | --- |
| `bot_token`, `bot_chat` | 활성 — [Telegram 봇](./telegram-bot)을 참고하세요. |
| `acme_*`, `cert_cache_dir`, `cert_review.*` | 예약됨(현재 빌드에서 무시됨). |
