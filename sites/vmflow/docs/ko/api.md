---
title: 로컬 관리
description: 번들 CLI와 터미널 UI로 vmflow를 관리합니다.
---

# 로컬 관리

지원되는 관리 인터페이스는 `vmflow ctl`과 `vmflow tui`입니다. 데몬은
루프백 전용 내부 전송 계층을 사용합니다. 이 전송 계층은 공개 통합 API가
아니며 외부 클라이언트에 대한 호환성을 보장하지 않습니다.

관리 채널은 항상 `127.0.0.1`에 바인딩되며 설정에서는 로컬 포트만 지정합니다.

```yaml
control_port: 19090
```

상태, 규칙, 통계, 사전 검사 및 리로드에는 [`vmflow ctl`](./ctl)과
[`vmflow tui`](./tui)를 사용하세요.

## 원격 관리

SSH로 루프백 포트를 전달한 뒤 로컬 CLI/TUI를 계속 사용합니다.

```bash
ssh -N -L 19090:127.0.0.1:19090 user@server
vmflow ctl rules
```
