---
title: vmflow
description: foreground, ctl, tui, version, update, service, uninstall을 위한 vmflow CLI 참조입니다.
---

# vmflow

```bash
vmflow -config ./examples/config.yaml [-control-port 19090]
```

포그라운드 실행은 설정을 읽고 루프백 전용 내부 관리 채널을 시작한 뒤 규칙 스냅샷을 적용하고 `SIGINT` 또는 `SIGTERM`까지 실행됩니다.

## 플래그

| 플래그 | 기본값 | 설명 |
| --- | --- | --- |
| `-config` | _(필수)_ | YAML 설정 파일 경로입니다. |
| `-control-port` | _(설정값)_ | 루프백 관리 포트를 재정의합니다. |
| `-log-file` | _(stdout)_ | stdout 대신 이 파일에 로그를 기록합니다(서비스 매니저 하에서 유용하며, Windows에서는 필수). |

## 런타임 동작

- 시작 시 규칙은 스냅샷(`ReplaceAll`)을 통해 적용됩니다. [규칙과 라이프사이클](./rules)을 참고하세요.
- 지원되는 관리 인터페이스는 `vmflow ctl`과 `vmflow tui`입니다.

- 관리되는 부팅 시 서비스로 실행하려면 [`vmflow service`](./service)를 참고하세요.
