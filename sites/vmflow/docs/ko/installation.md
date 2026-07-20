---
title: 설치
description: 권한 인식 사용자/시스템 설치, PATH 연동, 체크섬 검증 및 제거를 지원하는 스크립트로 GitHub Releases에서 vmflow를 설치하거나 소스에서 빌드합니다.
---

# 설치

`vmflow`는 Linux와 macOS(`amd64`와 `arm64`)용 단일 정적 바이너리로 제공됩니다. 설치 스크립트로 GitHub Releases에서 받거나, 소스에서 빌드할 수 있습니다.

릴리스는 배포판에서 관리하는 `.deb` 또는 `.rpm` 패키지 대신 이식 가능한 아카이브를 제공합니다. 아래 설치 프로그램을 사용하거나 아카이브를 직접 압축 해제하세요.

## 권장 사용자 설치

```bash
VMFLOW_BIN_DIR="$(
  curl -fsSL https://raw.githubusercontent.com/cloudapp3/vmflow/main/install.sh \
    | bash -s -- --version v0.2.0-rc.4 --print-install-dir
)" \
  && [ -n "$VMFLOW_BIN_DIR" ] \
  && [ "${VMFLOW_BIN_DIR#/}" != "$VMFLOW_BIN_DIR" ] \
  && [ -x "$VMFLOW_BIN_DIR/vmflow" ] \
  && export PATH="$VMFLOW_BIN_DIR:$PATH"
```

이 명령은 현재 프리릴리스 버전을 고정하고 선택된 디렉터리를 현재 셸의 PATH에 즉시 추가합니다. 최신 안정 버전을 따르려면 `--version v0.2.0-rc.4`를 생략하세요. 현재 버전을 지정하지 않으면 `v0.1.1`이 선택되며, 여기서 설명하는 MCP와 Source IP 정책은 포함되지 않습니다.

## 시스템 전체 설치

다운로드한 전체 스크립트를 root로 실행하지 않고 `/usr/local/bin`에 설치합니다:

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vmflow/main/install.sh \
  | bash -s -- --version v0.2.0-rc.4 --system
```

일반 사용자가 `--system`을 지정하면 설치 프로그램은 다운로드 전에 sudo를 검증하고 대상 확인과 쓰기에만 사용합니다. 새로 생성된 바이너리 옆 설정은 root 소유이며 모드는 `0600`입니다. 설치 프로그램이 출력하는 root/sudo 확인 및 시작 명령을 사용하세요.

다른 릴리스를 설치하려면 `--version`에 전달하는 태그를 변경합니다:

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vmflow/main/install.sh | bash -s -- --version v0.2.0-rc.4
```

### 설치 스크립트 옵션

| 옵션 | 설명 |
| --- | --- |
| `--version <tag>` | 특정 릴리스 태그를 설치합니다. 기본값은 최신 안정 버전입니다. |
| `--dir <path>` | 명시적인 설치 디렉터리를 사용합니다. `VMFLOW_INSTALL_DIR`로도 지정할 수 있습니다. |
| `--system` | `/usr/local/bin`에 시스템 전체 설치하며 필요한 경우에만 sudo를 사용합니다. |
| `--skip-verify` | SHA-256 체크섬 검증을 건너뜁니다. |
| `--no-modify-path` | 자동 선택된 사용자 디렉터리를 셸 시작 파일에 추가하지 않습니다. |
| `--print-install-dir` | 설치 성공 후 선택된 디렉터리만 stdout에 출력합니다. |
| `--uninstall` | 가능하면 `vmflow uninstall`로 제거하고, 오래되었거나 없는 바이너리는 셸 fallback으로 정리합니다. |
| `-h, --help` | 도움말을 표시합니다. |

### 디렉터리와 PATH 동작

`--dir`를 생략하면 먼저 바이너리 옆 설정을 가진 기존의 일반적인 vmflow 설치 디렉터리를 재사용합니다. 새로운 root 설치는 `/usr/local/bin`을 사용합니다. 일반 사용자는 이미 PATH에 있는 `~/.local/bin` 또는 `~/bin`을 우선하며, 그렇지 않으면 `~/.local/bin`을 사용합니다.

자동 사용자 설치는 필요할 때 `.zshrc`, `.bashrc` 또는 `.profile`에 하나의 멱등 PATH 블록을 추가하고 정확한 다시 불러오기 명령을 출력합니다. 현재 셸 자체는 변경할 수 없으므로 권장 명령은 `--print-install-dir`를 캡처해 즉시 export합니다. `--dir` 또는 `VMFLOW_INSTALL_DIR`를 명시하면 셸 시작 파일을 변경하지 않습니다.

### 설정 및 아카이브 호환성

설치 프로그램은 GitHub Release 아카이브를 다운로드하고 기본적으로 SHA-256으로 `checksums.txt`를 검증합니다. 현재 최상위 `config.yaml`과 레거시 `examples/config.yaml` 레이아웃을 모두 지원합니다. 최초 설치는 바이너리 옆에 모드 `0600`인 `config.yaml`을 만들고, 업그레이드는 바이너리만 교체하며 기존 설정과 포워딩 규칙을 보존합니다.

비공개 릴리스이거나 GitHub API 호출 한도가 더 필요하다면 `GITHUB_TOKEN` 또는 `GH_TOKEN`을 설정하세요.

## 소스에서 빌드

요구 사항: [Go](https://go.dev/dl/)(최근 버전, `go.mod` 참고).

```bash
git clone https://github.com/cloudapp3/vmflow.git
cd vmflow
go build -trimpath -o vmflow ./cmd/vmflow
```

또는 Makefile로:

```bash
make build
```

## 설치 확인

```bash
vmflow version
vmflow version -json
```

## vmflow 업데이트

태그가 지정된 릴리스(v0.1.1 이상)로 한 번 설치했다면, `vmflow`가 스스로 업데이트할 수 있습니다:

```bash
vmflow update --check            # 최신 릴리스 확인
vmflow update                    # 최신 릴리스 설치
vmflow update --version v0.2.0-rc.4 # 현재 프리릴리스 설치
```

자세한 내용, 플래그, 플랫폼 참고 사항은 [`vmflow update`](./update)를 보세요.

## 설치 프로그램이 관리하는 복사본 제거

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vmflow/main/install.sh \
  | bash -s -- --uninstall
```

바이너리 정리가 성공하면 설치 프로그램이 만든 정확한 PATH 블록도 제거합니다. root 소유 시스템 설치를 제거할 때만 `sudo bash -s -- --uninstall`을 사용하세요. 정리 범위와 보존 규칙은 [`vmflow uninstall`](./uninstall)을 참고하세요.
