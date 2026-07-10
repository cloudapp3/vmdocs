---
title: vmflow ctl
description: 실행 중인 vmflow 데몬 조회 및 제어 — health, rules, stats, metrics, precheck, reload.
---

# vmflow ctl

```bash
vmflow ctl [-addr http://127.0.0.1:19090] [-token TOKEN] <subcommand>
```

별칭: `vmflow c`.

`ctl`은 [컨트롤 API](./api) 위의 얇은 클라이언트입니다. `-addr`로 데몬을 가리키며, auth가 활성화되었을 때 `-token`(또는 `VMFLOW_CONTROL_TOKEN`)으로 인증합니다. 공유 클라이언트 플래그 전체 목록 — TLS/mTLS와 커스텀 헤더 포함 — 은 [공통 클라이언트 플래그](./commands#common-client-flags)에 나와 있습니다.

## 하위 명령어

| 하위 명령어 | 매핑 대상 | 설명 |
| --- | --- | --- |
| `health` | `GET /healthz` | 데몬 상태와 실행 중인 규칙 수입니다. |
| `rules` | `GET /v1/rules` | 실행 중인 규칙을 나열합니다. |
| `stats` | `GET /v1/stats` | 규칙별 트래픽 카운터(메모리 내 스냅샷)입니다. |
| `metrics` | `GET /metrics` | Prometheus 텍스트 익스포지션입니다. |
| `precheck` | `POST /v1/precheck` | 적용 없이 현재 설정을 검증합니다. |
| `reload` | `POST /v1/reload` | precheck 이후 설정을 리로드하고 다시 적용합니다. |

## 예제

```bash
vmflow ctl health
vmflow ctl rules
vmflow ctl stats
vmflow ctl reload
vmflow ctl -token change-me reload

# against a TLS-protected control API using a private CA and mTLS client cert
vmflow ctl -addr https://10.0.0.5:19090 \
  -tls-ca-file ca.pem -tls-client-cert client.pem -tls-client-key client.key \
  reload

# send an extra header (e.g. a Cloudflare Access service token)
vmflow ctl -H "CF-Access-Client-Id: xxx" -H "CF-Access-Client-Secret: yyy" reload
```

::: tip
auth가 활성화되었을 때 변경을 일으키는 하위 명령어(`reload`)는 `admin` 토큰이 필요합니다. 읽기 전용 하위 명령어는 `viewer` 토큰으로 동작합니다.
:::
