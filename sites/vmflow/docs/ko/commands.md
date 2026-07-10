---
title: 명령어 참조
description: vmflow CLI 참조 — daemon, ctl, tui, version, update, service, uninstall 하위 명령어와 별칭.
---

# 명령어 참조

vmflow는 일곱 개의 하위 명령어를 가진 단일 바이너리입니다. 별칭은 아래 표에 나와 있습니다.

| 명령어 | 별칭 | 용도 |
| --- | --- | --- |
| [`daemon`](./daemon) | `d` | 포워딩 데몬을 실행합니다. |
| [`ctl`](./ctl) | `c` | 실행 중인 데몬을 조회하고 제어합니다. |
| [`tui`](./tui) | `t` | 터미널 대시보드입니다. |
| [`version`](./version) | `v` | 빌드 메타데이터를 출력합니다. |
| [`update`](./update) | `u` | 새 릴리스를 확인하거나 설치합니다. |
| [`service`](./service) | `svc` | 네이티브 OS 서비스로 등록합니다(부팅 시 시작). |
| [`uninstall`](./uninstall) | `remove`, `rm` | 정리를 포함한 원커맨드 제거입니다. |

## 공통 클라이언트 플래그 {#common-client-flags}

`ctl`과 `tui`는 [컨트롤 API](./api)의 클라이언트이며 다음 플래그를 공유합니다:

| 플래그 | 환경 변수 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `-addr` | _(없음)_ | `http://127.0.0.1:19090` | 컨트롤 API 기본 URL입니다. |
| `-token` | `VMFLOW_CONTROL_TOKEN` | _(없음)_ | auth가 활성화되었을 때의 Bearer 토큰입니다. |
| `-tls-ca-file` | `VMFLOW_TLS_CA_FILE` | _(없음)_ | 컨트롤 API 서버 인증서를 검증하기 위한 CA 번들입니다(사설/자체 서명 CA). |
| `-tls-client-cert` | `VMFLOW_TLS_CLIENT_CERT` | _(없음)_ | mTLS용 클라이언트 인증서입니다(서버가 `control_tls.client_ca_file`을 설정할 때 필요). |
| `-tls-client-key` | `VMFLOW_TLS_CLIENT_KEY` | _(없음)_ | mTLS용 클라이언트 키입니다(`-tls-client-cert`와 함께 사용). |
| `-tls-skip-verify` | `VMFLOW_TLS_INSECURE` (`1`/`true`) | `false` | 서버 인증서 검증을 건너뜁니다(위험, 디버그 전용). |
| `-H` / `--header` | `VMFLOW_HEADERS` (`;`로 구분) | _(없음)_ | `Name: Value` 형식의 추가 요청 헤더입니다(반복 가능). |

## 참고

- 더 오래된 분할 바이너리인 `relayd`, `relayctl`, `relaytui`는 호환성을 위해 여전히 빌드할 수 있습니다 — 같은 패키지 위의 얇은 셸이며 같은 `VMFLOW_CONTROL_TOKEN` 환경 변수를 읽습니다 — 하지만 릴리스는 통합된 `vmflow` 바이너리를 선호합니다.
- 터널 명령어(`tunnel-server`, `tunnel-client`, `tunnel-ctl`)와 인증서 명령어(`certs`, `certs-obtain`, `certs-review`)는 현재 빌드에서 **활성화되어 있지 않습니다**.
