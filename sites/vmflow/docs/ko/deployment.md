---
title: 배포
description: 프로덕션에서 vmflow를 데몬으로 실행 — 컨트롤 API 노출, 인증, TLS/mTLS, 로깅, 메트릭, 네이티브 서비스 설정.
---

# 배포

vmflow는 로컬 컨트롤 API를 노출하는 장기 실행 데몬으로 동작합니다. 이 페이지는 호스트에서 실행할 때 실질적으로 고려할 사항을 다룹니다.

## 컨트롤 API는 루프백에 두세요

기본 `control_listen_addr`는 `127.0.0.1:19090`입니다. `auth.enabled: false`이면 컨트롤 API는 모든 요청을 익명의 admin 수준 호출자로 취급합니다 — 이는 루프백에서만 안전합니다.

컨트롤 API가 보호 없이 루프백 외 주소(`0.0.0.0`, `::`, 루프백이 아닌 IP, 또는 `:port`)에 바인딩되면 데몬은 **시작을 거부**합니다. 이는 실패 시 닫히는(fail-closed) 동작으로, 인증되지 않은 원격 제어 엔드포인트가 실수로 노출되는 것을 막아줍니다. 루프백 외부로 바인딩하려면 다음 중 하나를 충족하세요:

1. `auth.enabled: true`에 토큰을 최소 하나 이상 설정, **또는**
2. `control_tls.client_ca_file`로 상호 TLS(클라이언트가 인증서를 제시해야 함), **또는**
3. 위험을 명시적으로 인정하는 `-insecure-allow-remote-control`을 데몬에 전달.

## 로컬호스트 외부로 노출하기

다른 호스트에서 컨트롤 API에 접근해야 할 때, 안전한 옵션 중 하나를 선택하세요.

### 옵션 A — Bearer 토큰 인증

```yaml
control_listen_addr: 0.0.0.0:19090
auth:
  enabled: true
  tokens:
    - name: admin
      token: <long-random-secret>
      role: admin
    - name: viewer
      token: <another-random-secret>
      role: viewer
```

상태를 변경하는 호출(`reload`)에는 `admin` 토큰을 사용하세요. 읽기 전용 호출은 `viewer` 토큰으로도 동작합니다.

### 옵션 B — TLS / 상호 TLS(권장)

컨트롤 API 자체에서 TLS를 종료하고, 가장 강력한 구성을 원한다면 클라이언트 인증서를 요구하세요:

```yaml
control_listen_addr: 0.0.0.0:19090
control_tls:
  cert_file: /etc/vmflow/server.pem
  key_file:  /etc/vmflow/server.key
  client_ca_file: /etc/vmflow/client-ca.pem   # mTLS — satisfies the startup check
  min_version: "1.2"
```

이후 클라이언트는 `-tls-ca-file`, `-tls-client-cert`, `-tls-client-key`로 연결합니다([공통 클라이언트 플래그](./commands#common-client-flags) 참고). 인바운드 포트 없이 Cloudflare Tunnel 뒤에서 컨트롤 API를 노출할 때 권장되는 방법입니다. [HTTP API → TLS와 상호 TLS](./api#tls-and-mutual-tls)를 참고하세요.

[HTTP API → 인증](./api#authentication)도 함께 보세요.

## 로깅

여러분의 스택에 맞는 형식을 설정하세요:

```yaml
log:
  level: info
  format: json # text or json
```

`json`은 로그 수집기에 가장 적합하고, `text`는 터미널에서 더 보기 편합니다. 서비스 매니저 하에서는 데몬에 `-log-file`을 전달할 수도 있습니다(Windows에서는 필수).

## 메트릭

Prometheus를 컨트롤 API로 향하게 하세요:

```yaml
scrape_configs:
  - job_name: vmflow
    static_configs:
      - targets: ['127.0.0.1:19090']
    metrics_path: /metrics
```

노출되는 메트릭 패밀리는 [HTTP API → 메트릭](./api#get-metrics)을 참고하세요.

## 안전하게 리로드하기

설정 변경은 `POST /v1/reload`(또는 `vmflow ctl reload`)를 거칩니다. 리로드는 먼저 [사전 검사](./precheck)를 실행하고, 오류가 있으면 변경을 거부하며 실행 중인 규칙은 그대로 둡니다. 아직 우아한 드레인(graceful drain) 기간은 없습니다 — 제거되거나 변경된 규칙에 대한 기존 연결은 마이그레이션되지 않습니다.

## 네이티브 서비스로 실행하기

vmflow를 OS 서비스 매니저에 등록하면 부팅 시 시작되고 충돌 시 재시작됩니다:

```bash
# installs + enables + starts a systemd unit / launchd plist / Windows Service
sudo vmflow service install
```

이 방법이 권장됩니다 — 플래그(설정 경로, 실행 사용자, 로그 파일, 추가 인자)는 [`vmflow service`](./service)를 참고하세요. `vmflow service status` / `vmflow service uninstall`로 조회하고 제거합니다.

직접 유닛을 관리하고 싶다면, 아래는 응용할 수 있는 동작하는 systemd 예제입니다:

```ini
[Unit]
Description=vmflow L4 forwarding daemon
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
ExecStart=/usr/local/bin/vmflow daemon -config /etc/vmflow/config.yaml
ExecReload=/usr/local/bin/vmflow ctl reload
Restart=on-failure
RestartSec=3

[Install]
WantedBy=multi-user.target
```

편집 후 설정을 리로드합니다:

```bash
sudo vmflow ctl reload
# or, with a hand-written unit that wires ExecReload:
sudo systemctl reload vmflow
```

전체 제거(서비스 + 바이너리 + 설정 + 로그 + 인증서 + 업데이트 캐시)에는 [`vmflow uninstall`](./uninstall)을 사용하세요.

## 현재 제한 사항

- 통계는 **메모리에만** 존재합니다. 빌트인 과거 집계 기능은 없습니다.
- 번들된 웹 대시보드나 다중 노드 코디네이터는 없습니다.
- 릴리스 아카이브에 공식 Docker 이미지는 아직 없습니다(네이티브 서비스 설치와 `.deb`/`.rpm` 패키지는 사용 가능합니다).
