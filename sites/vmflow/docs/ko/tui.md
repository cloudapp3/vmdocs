---
title: vmflow tui
description: 실행 중인 데몬을 대상으로 vmflow 터미널 대시보드를 실행합니다.
---

# vmflow tui

```bash
vmflow tui [-addr http://127.0.0.1:19090] [-token TOKEN]
```

별칭: `vmflow t`.

터미널 대시보드를 실행합니다. 컨트롤 API에서 실시간 상태를 읽어오며, `ctl`과 동일한 공통 클라이언트 플래그(TLS/mTLS 및 사용자 지정 헤더 포함)를 받습니다([공통 클라이언트 플래그](./commands#common-client-flags) 참고). 화면과 조작은 [TUI 대시보드](./tui-guide)를 참고하세요.

## 예제

```bash
vmflow tui
vmflow tui -addr http://10.0.0.5:19090 -token change-me
VMFLOW_CONTROL_TOKEN=change-me vmflow tui

# against a TLS-protected control API
vmflow tui -addr https://10.0.0.5:19090 \
  -tls-ca-file ca.pem -tls-client-cert client.pem -tls-client-key client.key
```
