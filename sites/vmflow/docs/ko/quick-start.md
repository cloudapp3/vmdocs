---
title: 빠른 시작
description: vmflow를 설치하고 2분 만에 첫 TCP 포워딩 규칙을 실행해 봅니다.
---

# 빠른 시작

이 가이드에서는 `vmflow` 바이너리를 설치하고, 예제 설정으로 데몬을 시작한 뒤 CLI에서 쿼리해 봅니다.

## 1. 설치

최신 빌드된 바이너리를 설치합니다 (Linux/macOS):

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vmflow/main/install.sh | bash
```

전역 설치를 원한다면:

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vmflow/main/install.sh | sudo bash -s -- --dir /usr/local/bin
```

확인:

```bash
vmflow version
```

`--version`, 체크섬 검증, 소스에서 빌드하는 방법은 [설치](./installation)를 참고하세요.

## 2. 데몬 시작

예제 설정을 가져와 데몬을 시작합니다:

```bash
vmflow -config ./examples/config.yaml
```

번들 SSH 예제는 비활성화되어 있고 `127.0.0.1:2201`에서 수신합니다. 활성화 전에 검토하세요.

## 3. 쿼리

다른 터미널에서 번들 CLI로 로컬 데몬을 조회합니다:

```bash
vmflow ctl rules
vmflow ctl stats
vmflow ctl metrics
vmflow ctl precheck
```

## 4. 터미널 UI 열기

```bash
vmflow tui
```

<kbd>Tab</kbd> 키로 Dashboard, Rules, Detail 보기 사이를 전환합니다. [TUI 대시보드](./tui-guide)를 참고하세요.

## 5. 설정 편집 후 리로드

`examples/config.yaml`을 편집한 뒤 새로운 desired state를 적용합니다:

```bash
vmflow ctl reload
```

리로드는 먼저 [사전 검사](./precheck)를 실행합니다. 오류가 있으면 변경이 거부되고, 실행 중인 규칙은 그대로 남습니다.

## 다음 단계

- [설정](./configuration) — 모든 YAML 필드 설명
- [포워딩 엔진](./forwarding) — 프로토콜, 속도 제한, 연결 수 제한
- [규칙과 라이프사이클](./rules) — 스냅샷 적용과 증분 diff
- [`vmflow service install`](./service) — 부팅 시 실행되는 네이티브 서비스로 vmflow 등록 (systemd / launchd / Windows Service)
- [`vmflow uninstall`](./uninstall) — 한 번의 명령으로 제거 (서비스, 바이너리, 설정, 로그, 인증서)
