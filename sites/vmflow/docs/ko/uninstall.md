---
title: vmflow uninstall
description: vmflow의 원커맨드 언인스톨 — 서비스, 바이너리, 설정, 로그, 인증서, 업데이트 캐시를 제거합니다.
---

# vmflow uninstall

```bash
vmflow uninstall [--dry-run]
```

별칭: `vmflow remove`, `vmflow rm`.

vmflow 설치를 완전히 제거합니다. **계획 → 확인 → 실행** 흐름으로 동작합니다:

1. **계획** — 시스템을 조사하고 제거될 모든 항목을 나열합니다.
2. **확인** — `[y/N]`을 묻습니다(`--dry-run`이거나 제거할 항목이 없으면 생략됨).
3. **실행** — 항목을 순서대로 제거하며, 이미 없는 경로는 허용하여 명령이 멱등이 되도록 합니다.

## 플래그

| 플래그 | 기본값 | 설명 |
| --- | --- | --- |
| `--dry-run` | `false` | 아무것도 제거하지 않고 제거 계획만 출력합니다. |

## 제거 대상

항목은 다음 순서대로 제거됩니다(서비스가 먼저, 실행 중인 바이너리가 마지막이므로, 여전히 감독되고 있는 데몬이 실행 파일이 삭제되기 전에 사라집니다):

| 항목 | 참고 |
| --- | --- |
| 네이티브 서비스 | systemd unit / launchd plist / Windows Service를 중지하고 제거합니다. |
| 설정 파일 | 플랫폼 기본 설정([`service`](./service) 참고)과 설치 프로그램 소유의 바이너리 옆 설정입니다. 사용자 소유의 바이너리 옆 설정은 보존됩니다. |
| 외부 TLS / ACME 인증서 | vmflow 소유 저장소 외부의 인증서와 키 파일은 보존됩니다. |
| 로그 디렉터리 | 예: `/var/log/vmflow`(Linux/macOS), `C:\ProgramData\vmflow\logs`(Windows). |
| 자동 업데이트 캐시 | 업데이터 캐시 디렉터리. |
| vmflow 바이너리 | 실행 중인 실행 파일로, 마지막에 제거됩니다. |

::: warning 패키지 매니저로 설치한 경우
바이너리가 패키지 매니저(`dpkg` / `rpm`)가 소유한 경우, `uninstall`은 경고를 출력하고 파일을 직접 삭제하면 패키지 데이터베이스가 오래된 상태로 남기 때문에 대신 `apt remove` / `yum remove`를 권장합니다. 확인하면 계속 진행합니다.
:::

보호된 경로(시스템 루트, 홈 디렉터리)는 절대 제거되지 않습니다.

## 설치 프로그램이 관리하는 설치

`install.sh`로 만든 사용자 설치는 설치 프로그램 수준의 제거를 권장합니다:

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vmflow/main/install.sh \
  | bash -s -- --uninstall
```

지원되는 경우 `vmflow uninstall`에 위임하고, 오래되었거나 없는 바이너리는 셸 정리로 fallback합니다. 바이너리 정리가 성공한 뒤 `.zshrc`, `.bashrc` 또는 `.profile`에서 설치 프로그램 소유의 정확한 PATH 블록도 제거합니다. 비슷한 사용자 작성 PATH 줄, 심볼릭 링크 또는 쓰기 불가능한 시작 파일은 변경하지 않습니다.

root 소유 시스템 설치를 제거할 때만 `sudo bash -s -- --uninstall`을 사용하세요. 명시적으로 선택한 사용자 지정 디렉터리를 제거할 때는 `--uninstall`과 함께 `--dir PATH`를 전달하세요.

## 예제

```bash
# preview only
vmflow uninstall --dry-run

# full teardown (will prompt to confirm)
sudo vmflow uninstall
```
