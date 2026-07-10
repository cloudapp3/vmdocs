---
title: vmflow daemon
description: vmflow 포워딩 데몬 실행 — 설정 경로, 컨트롤 리슨 주소, 시작 안전 검사 플래그.
---

# vmflow daemon

```bash
vmflow daemon -config ./examples/config.yaml [-control-listen 127.0.0.1:19090]
```

별칭: `vmflow d`.

데몬은 설정 파일을 로드하고, 컨트롤 API를 시작하며, 규칙을 스냅샷으로 적용합니다. 그런 다음 중단될 때까지(`SIGINT` / `SIGTERM`, 이는 systemd와 launchd가 데몬을 멈추는 방식이기도 합니다) 서비스를 제공합니다.

## 플래그

| 플래그 | 기본값 | 설명 |
| --- | --- | --- |
| `-config` | _(필수)_ | YAML 설정 파일 경로입니다. |
| `-control-listen` | _(설정에서 가져옴)_ | 컨트롤 API 리슨 주소를 재정의합니다(설정의 `control_listen_addr`, 기본값 `127.0.0.1:19090`). |
| `-insecure-allow-remote-control` | `false` | **위험:** 인증 없이 컨트롤 API를 non-loopback 주소에 바인딩하는 것을 허용합니다. [배포](./deployment)를 참고하세요. |
| `-log-file` | _(stdout)_ | stdout 대신 이 파일에 로그를 기록합니다(서비스 매니저 하에서 유용하며, Windows에서는 필수). |

## 시작 안전 검사 {#startup-safety}

데몬은 컨트롤 API가 인증 없이 non-loopback 주소(`0.0.0.0`, `::`, non-loopback IP 또는 `:port`)에 바인딩되어 있을 때 시작을 거부합니다. 인증되지 않은 원격 컨트롤 엔드포인트가 노출되기 때문입니다. 그럼에도 시작하려면 다음 중 하나를 수행하세요:

- `127.0.0.1`(기본값)에 바인딩,
- 설정에서 `auth` 활성화,
- 상호 TLS(`control_tls.client_ca_file`) 활성화, 또는
- 위험을 감수하고 `-insecure-allow-remote-control` 전달.

## 런타임 동작

- 시작 시 규칙은 스냅샷(`ReplaceAll`)을 통해 적용됩니다. [규칙과 라이프사이클](./rules)을 참고하세요.
- 컨트롤 API는 [health, rules, stats, precheck, reload, metrics](./api)를 노출합니다.
- `POST /v1/reload`(또는 `vmflow ctl reload`)는 설정을 다시 읽고 [precheck](./precheck) 이후에 다시 적용합니다.
- 관리되는 부팅 시 서비스로 실행하려면 [`vmflow service`](./service)를 참고하세요.
