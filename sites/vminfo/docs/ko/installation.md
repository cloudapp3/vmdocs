---
title: 설치
description: 셸 인스톨러, go install, 또는 사용자 지정 바이너리 디렉터리로 vminfo를 설치하세요.
---

# 설치

## 셸 인스톨러 (Linux/macOS)

인스톨러 스크립트는 Linux와 macOS에서 가장 빠른 방법입니다.

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vminfo/main/install.sh | bash
```

sudo와 함께:

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vminfo/main/install.sh | sudo bash
```

스크립트는 다음 순서로 설치 디렉터리를 자동 선택합니다:

1. `/usr/local/bin`
2. `~/.local/bin`
3. `~/bin`

고정된 디렉터리를 원하면 `--dir`을 전달하세요:

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vminfo/main/install.sh | bash -s -- --dir /opt/bin
```

체크섬 검증을 명시적으로 건너뛰려면 스크립트의 `--skip-verify`도 지원합니다.

## Go install

```bash
go install github.com/cloudapp3/vminfo/cmd/vminfo@latest
```

## 업데이트

```bash
vminfo update
vminfo update --check
vminfo update --version v0.1.0
```

참고:

- `vminfo update`는 태그된 빌드를 실행 중일 때 최신 태그 릴리스를 설치합니다
- `vminfo update --check`는 업데이트만 확인합니다
- `vminfo update --version v0.1.0`은 특정 릴리스 태그를 확인하거나 설치합니다

## PATH 문제 해결

`vminfo`가 설치되었지만 찾을 수 없다면, 설치 디렉터리가 `PATH`에 있는지 확인하세요.

일반적인 예:

```bash
export PATH="$HOME/.local/bin:$PATH"
export PATH="$HOME/bin:$PATH"
```

## 제거

설치한 디렉터리에서 바이너리를 제거하세요:

```bash
rm -f /usr/local/bin/vminfo
rm -f ~/.local/bin/vminfo
rm -f ~/bin/vminfo
```
