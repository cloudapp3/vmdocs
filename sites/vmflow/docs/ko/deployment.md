---
title: 배포
description: 루프백 관리, 로그, 메트릭, SSH, 네이티브 서비스로 vmflow를 운영합니다.
---

# 배포

vmflow는 장기 실행 포워딩 프로세스입니다. 관리는 루프백에 유지되며 번들 CLI/TUI를 사용합니다.

## 로컬 관리

내부 관리 채널은 항상 `127.0.0.1`에 바인딩됩니다. 설정에서는 로컬 포트만 지정합니다.

```yaml
control_port: 19090
```

지원되는 관리 인터페이스는 `vmflow ctl`과 `vmflow tui`입니다. 내부 전송 계층은 공개 통합 API가 아닙니다.

## 원격 관리

SSH로 루프백 포트를 전달한 뒤 로컬 CLI/TUI를 사용합니다.

```bash
ssh -N -L 19090:127.0.0.1:19090 user@server
vmflow ctl rules
```

## 로깅

여러분의 스택에 맞는 형식을 설정하세요:

```yaml
log:
  level: info
  format: json # text or json
```

`json`은 로그 수집기에 가장 적합하고, `text`는 터미널에서 더 보기 편합니다. 서비스 매니저 하에서는 데몬에 `-log-file`을 전달할 수도 있습니다(Windows에서는 필수).

## 메트릭

같은 호스트의 Prometheus가 루프백 메트릭 리스너를 읽도록 설정합니다:

```yaml
scrape_configs:
  - job_name: vmflow
    static_configs:
      - targets: ['127.0.0.1:19090']
    metrics_path: /metrics
```

## 안전하게 리로드하기

`vmflow ctl reload`로 설정 변경을 적용합니다. 먼저 [사전 검사](./precheck)를 실행하며 잘못된 설정은 부분 적용되지 않습니다.

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
ExecStart=/usr/local/bin/vmflow -config /etc/vmflow/config.yaml
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

- 누적 트래픽 카운터는 선택적으로 영속화할 수 있으며 활성 연결과 속도는 프로세스 로컬입니다.
- 번들된 웹 대시보드나 다중 노드 코디네이터는 없습니다.
- 공식 Docker 이미지는 아직 제공되지 않습니다. 부팅 시 자동 시작하려면 내장 네이티브 서비스 설치 프로그램을 사용하세요.
