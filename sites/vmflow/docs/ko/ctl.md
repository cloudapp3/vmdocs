---
title: vmflow ctl
description: 지원 CLI를 통해 실행 중인 vmflow를 조회하고 관리합니다.
---

# vmflow ctl

```bash
vmflow ctl [-token TOKEN] <subcommand>
```

별칭: `vmflow c`.

`ctl`은 로컬 데몬을 위한 지원 명령 인터페이스입니다. 인증 시 `-token` 또는 `VMFLOW_CONTROL_TOKEN`을 사용합니다.

## 하위 명령어

| 하위 명령 | 설명 |
| --- | --- |
| `rules` | 실행 중인 규칙을 나열합니다. |
| `stats` | 규칙별 트래픽 카운터를 표시합니다. |
| `metrics` | Prometheus 텍스트 메트릭을 출력합니다. |
| `precheck` | 적용하지 않고 설정을 검증합니다. |
| `reload` | 사전 검사 후 설정을 다시 읽습니다. |

## 예제

```bash
vmflow ctl rules
vmflow ctl stats
vmflow ctl precheck
vmflow ctl reload
vmflow ctl -token change-me reload
```

::: tip
auth가 활성화되었을 때 변경을 일으키는 하위 명령어(`reload`)는 `admin` 토큰이 필요합니다. 읽기 전용 하위 명령어는 `viewer` 토큰으로 동작합니다.
:::
