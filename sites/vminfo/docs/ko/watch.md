---
title: watch
description: 런타임 스냅샷을 텍스트 또는 JSON Lines로 연속적으로 스트리밍합니다.
---

# `vminfo watch`

스냅샷을 연속적으로 스트리밍합니다.

## 사용법

```bash
vminfo watch
vminfo watch --json
vminfo watch --count 1
vminfo watch --interval 2s
```

## 출력

- 텍스트 모드는 타임스탬프가 찍힌 스냅샷을 출력합니다.
- JSON 모드는 `collected_at`, `static`, `stats`가 포함된 JSON Lines를 출력합니다.

## 다음에 적합

- 터미널 모니터링
- 로그 파이프라인
- CI 확인
- 간단한 샘플링 루프

## 예시

```bash
vminfo watch --json --count 3
```

## 관련 항목

- [summary](/ko/summary)
- [ps](/ko/ps)
