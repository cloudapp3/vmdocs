---
title: 플랫폼 지원
description: Linux, macOS, Windows에서 어떤 기능이 동작하는지 확인합니다.
---

# 플랫폼 지원

| 기능 | Linux | macOS | Windows |
| --- | --- | --- | --- |
| `summary` / `watch` | ✅ | ✅ | ✅ |
| TUI | ✅ | ✅ | ✅ |
| 웹 대시보드 | ✅ | ✅ | ✅ |
| `ps` / `kill` | ✅ | ⚠️ stub | ⚠️ stub |
| `update --check` | ✅ | ✅ | ✅ |
| `update` 설치 | ✅ | ✅ | ⚠️ 확인 전용 |

참고 사항:

- TUI는 실제 TTY가 필요합니다.
- `ps`와 `kill`은 설계상 Linux 전용입니다.
- Linux가 아닌 빌드는 프로세스 기능에 대해 지원되지 않는 stub을 유지합니다.
- Windows는 업데이트를 확인할 수 있지만 자기 자신을 교체(self-replacement)하는 것은 지원되지 않습니다.
