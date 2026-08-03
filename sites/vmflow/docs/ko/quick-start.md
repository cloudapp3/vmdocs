---
title: 빠른 시작
description: vmflow를 설치하고 2분 만에 첫 TCP 포워딩 규칙을 실행해 봅니다.
---

# 빠른 시작

이 가이드에서는 안정 버전 vmflow v0.3.0을 설치하고 `vmflow init`으로 검증된 첫 규칙을 만든 뒤 CLI에서 실행 중인 데몬을 조회합니다.

## 1. 설치

현재 셸에 `v0.3.0`를 설치합니다(Linux/macOS):

```bash
VMFLOW_BIN_DIR="$(
  curl -fsSL https://raw.githubusercontent.com/cloudapp3/vmflow/main/install.sh \
    | bash -s -- --version v0.3.0 --print-install-dir
)" \
  && [ -n "$VMFLOW_BIN_DIR" ] \
  && [ "${VMFLOW_BIN_DIR#/}" != "$VMFLOW_BIN_DIR" ] \
  && [ -x "$VMFLOW_BIN_DIR/vmflow" ] \
  && export PATH="$VMFLOW_BIN_DIR:$PATH"
```

확인:

```bash
vmflow version -json
```

필요하면 설치 프로그램이 이후 지원되는 셸 세션을 위한 PATH도 설정합니다. `--system` 시스템 설치, 디렉터리 선택, 체크섬 검증 및 소스 빌드는 [설치](./installation)를 참고하세요.

## 2. vmflow 초기화

첫 사용 마법사를 실행합니다:

```bash
vmflow init
```

언어가 첫 번째 선택입니다. `1`은 English, `2`는 중국어 간체입니다. 다음으로 권장 네이티브 시스템 서비스, 현재 터미널 foreground 또는 시작하지 않고 저장을 선택합니다. 마법사는 검증된 규칙과 인증된 로컬 관리를 만들고 선택한 모드에 맞는 system/user config 경로에 저장합니다.

서비스 모드는 vmflow를 설치하고 활성화한 뒤 이미 시작하므로 두 번째 foreground 프로세스를 실행하지 마세요. Foreground 모드도 이미 실행 중이며 현재 터미널에 연결된 상태를 유지합니다. 시작하지 않고 저장한 경우에만 나중에 `vmflow run`을 실행하세요.

## 3. 쿼리

다른 터미널에서 번들 CLI로 로컬 데몬을 조회합니다:

```bash
vmflow ctl rules
vmflow ctl stats
vmflow ctl metrics
vmflow ctl precheck
```

## 4. 터미널 UI 열기

네이티브 시스템 서비스에서는 기본 명령을 사용합니다. 먼저 로컬 서비스가 설치되어 실행 중인지 확인합니다:

```bash
vmflow tui
```

Foreground 모드에서는 데몬 터미널을 열어 둔 채 수동으로 시작한 프로세스의 주소를 명시하세요:

```bash
vmflow tui -addr http://127.0.0.1:19090
```

명시적인 `-addr`는 네이티브 서비스 검사를 건너뜁니다. <kbd>Tab</kbd> 키로 Dashboard, Rules, Detail 보기 사이를 전환합니다. [TUI 대시보드](./tui-guide)를 참고하세요.

## 5. 설정 편집 후 리로드

`vmflow status`로 활성 설정 경로를 확인해 편집한 뒤 새로운 desired state를 적용합니다:

```bash
vmflow status
vmflow ctl reload
```

리로드는 먼저 [사전 검사](./precheck)를 실행합니다. 오류가 있으면 변경이 거부되고, 실행 중인 규칙은 그대로 남습니다.

## 다음 단계

- [설정](./configuration) — 모든 YAML 필드 설명
- [포워딩 엔진](./forwarding) — 프로토콜, 공유 bandwidth, 일간·월간 쿼터, 연결 수 제한
- [규칙과 라이프사이클](./rules) — 스냅샷 적용과 증분 diff
- [`vmflow service install`](./service) — 부팅 시 실행되는 네이티브 서비스로 vmflow 등록 (systemd / launchd / Windows Service)
- [`vmflow uninstall`](./uninstall) — 한 번의 명령으로 제거 (서비스, 바이너리, 설정, 로그, 인증서)
