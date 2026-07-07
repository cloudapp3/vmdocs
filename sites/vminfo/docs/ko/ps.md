---
title: ps
description: Linux 전용 프로세스 목록으로 필터, 트리 보기, watch 모드, JSON 출력을 지원합니다.
---

# `vminfo ps`

Linux 전용 프로세스 목록 및 필터링입니다.

## 사용법

```bash
vminfo ps
vminfo ps nginx
vminfo ps --filter ssh
vminfo ps --tree
vminfo ps --watch
vminfo ps --limit 20
vminfo ps --json
vminfo ps --sort mem
```

## 옵션

| 플래그 | 설명 |
| --- | --- |
| 위치 필터 | 이름, 사용자, PID, 명령 또는 상태로 필터 |
| `--filter` | 명시적 프로세스 필터 |
| `--tree` | 프로세스 트리 렌더링 |
| `--watch` | 연속적으로 새로고침 |
| `--count` | `--watch`와 함께 사용할 때 샘플 수 |
| `--interval` | watch 모드의 새로고침 간격 |
| `--limit` | 행 수 제한 |
| `--json` | JSON 출력 |
| `--sort` | `cpu`, `mem`, `pid` 또는 `name`으로 정렬 |

## 참고

- 기본 정렬은 `cpu`입니다.
- JSON 출력은 프로세스 객체의 배열을 반환합니다.
- `--watch --json`은 `collected_at` 타임스탬프가 포함된 JSON Lines를 반환합니다.
- Linux가 아닌 빌드는 이 명령에 대해 지원되지 않는 stub을 유지합니다.

## 예시

```bash
vminfo ps --filter ssh --sort mem --limit 20
```

## 관련 항목

- [kill](/ko/kill)
- [HTTP API](/ko/api)
