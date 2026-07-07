---
title: summary
description: 하나의 런타임 스냅샷을 텍스트 또는 JSON으로 수집합니다.
---

# `vminfo summary`

현재 호스트 상태의 스냅샷 하나를 수집합니다.

## 사용법

```bash
vminfo summary
vminfo summary --json
vminfo summary --interval 1s
```

## 출력

- 텍스트 모드는 사람이 읽기 쉬운 호스트 요약을 출력합니다.
- JSON 모드는 `static`과 `stats` 필드를 가진 `vminfo.Snapshot` 객체를 출력합니다.

## 활용 시기

- 빠른 터미널 확인
- 셸 스크립트
- CI 진단
- 단일 샘플이 필요한 자동화

## 예시

```bash
vminfo summary --json
```

## 관련 항목

- [watch](/ko/watch)
- [HTTP API](/ko/api)
- [Go 라이브러리](/ko/library)
