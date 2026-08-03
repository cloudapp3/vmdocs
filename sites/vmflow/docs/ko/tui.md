---
title: vmflow tui
description: 실행 중인 데몬을 대상으로 vmflow 터미널 대시보드를 실행합니다.
---

# vmflow tui

```bash
vmflow tui [-addr URL] [-token TOKEN]
```

별칭: `vmflow t`.

로컬 데몬의 터미널 대시보드를 엽니다. 기본 로컬 대상에는 설치되어 실행 중인 네이티브 서비스가 필요하며 나중에 중지되면 TUI에서 복구할 수 있습니다. `vmflow run`으로 수동 시작한 데몬에는 `-addr http://127.0.0.1:19090`을 명시해 서비스 검사를 건너뜁니다. [TUI 대시보드](./tui-guide)를 참고하세요.

## 예제

```bash
vmflow tui
vmflow tui -addr http://127.0.0.1:19090
VMFLOW_CONTROL_TOKEN=change-me vmflow tui
```
