---
title: vmflow update
description: 최신 vmflow 릴리스를 확인하거나 설치합니다 — vmflow update, --check, --version.
---

# vmflow update

GitHub Releases를 확인하고 `vmflow`의 최신 태그 빌드를 그 자리에 설치합니다.

```bash
vmflow update [--check] [--version <tag>]
```

별칭: `vmflow u`.

## 플래그

| 플래그 | 설명 |
| --- | --- |
| `--check` | 업데이트만 확인하고 설치하지 않습니다. |
| `--version <tag>` | 특정 릴리스 태그(예: `v0.1.1`)를 설치하거나 확인합니다. |

## 수행하는 작업

1. `cloudapp3/vmflow`의 GitHub Releases API를 조회합니다.
2. 최신 릴리스를 실행 중인 빌드의 버전과 비교합니다.
3. 설치 시: 현재 OS/arch에 맞는 아카이브를 다운로드하고, SHA-256으로 `checksums.txt`와 검증한 뒤, 바이너리를 추출하여 실행 중인 `vmflow` 바이너리를 원자적으로 교체합니다.

## 예제

설치하지 않고 새 릴리스가 있는지 확인:

```bash
vmflow update --check
```

최신 릴리스 설치:

```bash
vmflow update
```

특정 버전 설치:

```bash
vmflow update --version v0.1.1
```

## 참고 사항

- `dev` 빌드(예: 릴리스 ldflags 없이 소스에서 빌드)는 현재 버전을 알 수 없기 때문에 `--version` 없이는 자동 업데이트할 수 없습니다. 이 경우 `vmflow update --version vX.Y.Z`를 사용하세요.
- 업데이트 확인 결과는 캐시 디렉터리(`~/.cache/vmflow/update-check.json` 또는 `$XDG_CACHE_HOME/vmflow`)에 24시간 동안 캐시됩니다. 특정 태그에 대해 캐시를 우회하려면 `--version`을 사용하세요.
- **Windows**: 자동 업데이트(바이너리 교체)는 지원되지 않으며, `--check`는 동작합니다. Windows에서 업데이트하려면 `install.sh`나 릴리스 아카이브로 다시 설치하세요.
- 비공개 릴리스이거나 GitHub API 요청 한도를 늘리려면 `GITHUB_TOKEN` 또는 `GH_TOKEN`을 설정하세요.
- 자동 업데이트는 실행 중인 바이너리를 교체하므로 해당 파일에 대한 쓰기 권한이 필요합니다. 권한 오류로 실패하면 적절한 권한(예: `sudo`)으로 다시 실행하거나 설치 경로의 권한을 수정하세요.

## 관련 항목

- [설치](./installation)
- [Changelog](/changelog)
