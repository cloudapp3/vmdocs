---
title: kill
description: PID로 Linux 프로세스에 SIGTERM을 보냅니다.
---

# `vminfo kill`

Linux 프로세스에 `SIGTERM`을 보냅니다.

::: warning
이 명령은 프로세스를 종료합니다. 실행하기 전에 PID가 올바른지 확인하세요.
:::

## 사용법

```bash
vminfo kill 1234
```

## 참고

- Linux 전용입니다
- Linux가 아닌 빌드에서는 지원되지 않는 stub을 반환합니다
- 대상 프로세스가 다른 사용자에게 속한 경우 권한이 필요할 수 있습니다

## 관련 문서

- [ps](/ko/ps)
