---
title: HTTP API
description: vmflow 로컬 컨트롤 API — 인증, TLS/mTLS, 헬스, 규칙, 통계, 사전 점검, 리로드, Prometheus 메트릭.
---

# HTTP API

데몬은 로컬 컨트롤 API를 노출합니다. 기본 리슨 주소는 `127.0.0.1:19090`입니다. CLI와 TUI는 이 엔드포인트 위의 씬 클라이언트입니다.

## 인증 {#authentication}

컨트롤 API는 두 가지 역할의 Bearer 토큰 인증을 지원합니다.

```yaml
auth:
  enabled: true
  tokens:
    - name: admin
      token: change-me
      role: admin
    - name: viewer
      token: view-only
      role: viewer
```

```bash
curl -H "Authorization: Bearer change-me" http://127.0.0.1:19090/v1/stats
```

```bash
vmflow ctl -token change-me stats
VMFLOW_CONTROL_TOKEN=change-me vmflow tui
```

| 역할 | 허용 |
| --- | --- |
| `viewer` | 읽기 엔드포인트: `health`, `rules`, `stats`, `metrics`. |
| `admin` | `viewer`의 모든 권한에 `reload`가 추가됩니다. |

토큰은 상수 시간으로 비교됩니다. `auth.enabled: false`이면 요청은 익명의 admin 수준 호출자로 취급됩니다 — 루프백에서만 안전합니다.

인증이 비활성화된 상태에서 non-loopback 바인딩은 **시작을 거부합니다**(fail-closed). 다시 허용하려면 `127.0.0.1`에 바인딩하거나, `auth`를 활성화하거나, 상호 TLS(`control_tls.client_ca_file`)를 활성화하거나, 데몬에 `-insecure-allow-remote-control`을 전달하세요. 단일 피어 IP에서 반복된 인증 실패(1분 내 10회 시도)는 HTTP `429`로 제한되며 1분 동안 잠깁니다; 이것은 best-effort입니다(피어 IP별, 재시작 시 초기화).

## TLS와 상호 TLS {#tls-and-mutual-tls}

컨트롤 API는 TLS를 통해 서빙할 수 있고, 선택적으로 클라이언트 인증서(상호 TLS)를 요구할 수 있습니다. `control_tls` 아래에서 설정합니다.

```yaml
control_listen_addr: 0.0.0.0:19090
control_tls:
  cert_file: /etc/vmflow/server.pem
  key_file:  /etc/vmflow/server.key
  client_ca_file: /etc/vmflow/client-ca.pem   # optional → enables mTLS
  min_version: "1.2"                           # "1.2" (default) or "1.3"
```

- **`cert_file`과 `key_file`이 모두** 설정되면 TLS가 활성화됩니다.
- `client_ca_file`을 설정하면 **상호 TLS**가 켜집니다: 모든 클라이언트는 해당 CA로 서명된 인증서를 제시해야 합니다. mTLS는 또한 위의 non-loopback 시작 안전 검사를 만족합니다.
- 클라이언트는 CA 번들과 클라이언트 인증서를 `-tls-ca-file`, `-tls-client-cert`, `-tls-client-key`(또는 `VMFLOW_TLS_*` 환경 변수)로 전달합니다. [공통 클라이언트 플래그](./commands#common-client-flags)를 보세요.

mTLS는 인바운드 포트를 열지 않고 컨트롤 API를 루프백 외부(예: Cloudflare Tunnel 뒤)에 노출하는 권장 방법입니다.

## `GET /healthz`

데몬 헬스.

```json
{
  "ok": true,
  "running_rules": 1,
  "time": 1760000000
}
```

## `GET /v1/rules`

실행 중인 규칙.

```json
{
  "items": [
    {
      "rule_id": "ssh-forward",
      "name": "ssh-forward",
      "protocol": "tcp",
      "listen_addr": "0.0.0.0",
      "listen_port": 2201,
      "target_addr": "127.0.0.1",
      "target_port": 22,
      "enabled": true
    }
  ]
}
```

## `GET /v1/stats`

규칙별 인메모리 카운터.

```json
{
  "items": [
    {
      "rule_id": "ssh-forward",
      "upload_bytes": 1024,
      "download_bytes": 2048,
      "conns": 1,
      "updated_time": 1760000000
    }
  ]
}
```

## `GET|POST /v1/precheck`

현재 설정을 **적용하지 않고** 검증합니다. `reload`는 같은 검사를 실행하며, 어떤 오류든 리로드를 거부합니다.

검사 항목: 규칙 검증, 중복 `rule_id`, 리스너 충돌, 리슨 포트 바인딩 가능성, 타깃 DNS 해석, 저권한 포트 경고. (HTTPS 도메인과 ACME 검사는 현재 빌드에서 비활성화되어 있습니다.)

```bash
vmflow ctl precheck
```

```json
{
  "config_path": "./examples/config.yaml",
  "rule_count": 1,
  "result": {
    "ok": true,
    "error_count": 0,
    "warning_count": 0,
    "checked_rules": 1,
    "checked_time_ms": 1,
    "items": []
  }
}
```

검사 항목의 전체 목록은 [사전 점검](./precheck)을 참고하세요.

## `GET /metrics`

Prometheus 텍스트 익스포지션. 예시:

```text
vmflow_rule_upload_bytes_total{rule_id="ssh-forward",protocol="tcp"} 1024
vmflow_rule_download_bytes_total{rule_id="ssh-forward",protocol="tcp"} 2048
vmflow_rule_connections{rule_id="ssh-forward",protocol="tcp"} 1
vmflow_control_requests_total{method="GET",path="/v1/stats",status="200"} 10
vmflow_reload_total{status="ok"} 1
vmflow_rule_apply_total{action="started",status="ok"} 1
```

메트릭 패밀리:

- `vmflow_build_info`
- `vmflow_uptime_seconds`
- `vmflow_rule_running{rule_id,protocol}`
- `vmflow_rule_connections{rule_id,protocol}`
- `vmflow_rule_upload_bytes_total{rule_id,protocol}`
- `vmflow_rule_download_bytes_total{rule_id,protocol}`
- `vmflow_control_requests_total{method,path,status}`
- `vmflow_control_request_duration_seconds_sum{method,path,status}`
- `vmflow_reload_total{status}`
- `vmflow_rule_apply_total{action,status}`

## `POST /v1/reload`

설정 파일을 리로드하고 사전 점검 후 `ApplySnapshot(replace_all=true)`을 실행합니다.

```json
{
  "config_path": "./examples/config.yaml",
  "control_listen_addr": "127.0.0.1:19090",
  "rule_count": 1,
  "result": {
    "applied_rules": 1,
    "stopped_rules": 0,
    "failed_rules": 0,
    "total_rules": 1,
    "items": []
  }
}
```

::: warning 비활성화된 엔드포인트
`/v1/certs*` 인증서 엔드포인트는 소스에 존재하지만 현재 빌드에서 **등록되지 않습니다**(HTTPS/ACME는 비활성화됨).
:::
