---
title: 설치
description: 한 줄 설치 스크립트로 GitHub Releases에서 vmflow를 설치하거나, 소스에서 빌드합니다. --version, --dir, --skip-verify, GITHUB_TOKEN을 지원합니다.
---

# 설치

`vmflow`는 Linux와 macOS(`amd64`와 `arm64`)용 단일 정적 바이너리로 제공됩니다. 설치 스크립트로 GitHub Releases에서 받거나, 소스에서 빌드할 수 있습니다.

릴리스는 배포판에서 관리하는 `.deb` 또는 `.rpm` 패키지 대신 이식 가능한 아카이브를 제공합니다. 아래 설치 프로그램을 사용하거나 아카이브를 직접 압축 해제하세요.

## 한 줄 설치

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vmflow/main/install.sh | bash
```

`/usr/local/bin`에 전역 설치:

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vmflow/main/install.sh | sudo bash -s -- --dir /usr/local/bin
```

특정 릴리스 태그 설치:

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vmflow/main/install.sh | bash -s -- --version v0.1.0
```

### 설치 스크립트 옵션

| 옵션 | 설명 |
| --- | --- |
| `--version <tag>` | 특정 릴리스 태그를 설치합니다. 기본값은 최신 릴리스입니다. |
| `--dir <path>` | 설치 디렉터리입니다. 생략하면 자동으로 감지합니다(아래 참고). |
| `--skip-verify` | SHA-256 체크섬 검증을 건너뜁니다. |
| `--uninstall` | `vmflow uninstall`에 위임합니다(서비스, 바이너리, 설정, 로그, 인증서, 업데이트 캐시 제거). |
| `-h, --help` | 도움말을 표시합니다. |

설치 스크립트는 GitHub Release 아카이브를 다운로드하고, 기본적으로 SHA-256으로 `checksums.txt`를 검증한 뒤, 이 순서로 설치 디렉터리를 자동 감지합니다: `/usr/local/bin` → `~/.local/bin` → `~/bin`. `--dir PATH` 또는 `VMFLOW_INSTALL_DIR` 환경 변수로 재정의할 수 있습니다.

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

## PATH가 설정되지 않았다면?

설치 스크립트가 선택한 디렉터리가 `PATH`에 없다고 알려주면, 심볼릭 링크를 만드세요:

```bash
sudo ln -sf "$HOME/.local/bin/vmflow" /usr/local/bin/vmflow
```

…또는 해당 디렉터리를 셸 `PATH`에 추가하세요:

```bash
export PATH="$HOME/.local/bin:$PATH"
```

## vmflow 업데이트

태그가 지정된 릴리스(v0.1.1 이상)로 한 번 설치했다면, `vmflow`가 스스로 업데이트할 수 있습니다:

```bash
vmflow update --check            # 최신 릴리스 확인
vmflow update                    # 최신 릴리스 설치
vmflow update --version v0.1.1   # 특정 버전 설치
```

자세한 내용, 플래그, 플랫폼 참고 사항은 [`vmflow update`](./update)를 보세요. (v0.1.0 릴리스는 `update` 명령어 이전의 버전입니다. 자체 업데이트를 사용하려면 위 설치 스크립트로 다시 설치하세요.)
