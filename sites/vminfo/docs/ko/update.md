---
title: update
description: 최신 태그된 vminfo 릴리스를 확인하거나 설치합니다.
---

# `vminfo update`

GitHub Releases를 확인하고, 가능한 경우 최신 태그 빌드를 설치합니다.

## 사용법

```bash
vminfo update
vminfo update --check
vminfo update --version v0.1.0
```

## 참고

- `--check`는 업데이트만 확인합니다.
- `--version`은 특정 릴리스 태그를 확인하거나 설치합니다.
- 개발 빌드는 `--version` 없이는 자동 업데이트할 수 없습니다.
- Windows에서는 바이너리가 실행 중인 위치에서 스스로를 교체할 수 없기 때문에 설치 모드가 지원되지 않습니다.

## 예제

```bash
vminfo update --check
```

## 관련 문서

- [설치](/ko/installation)
- [Changelog](/changelog)
