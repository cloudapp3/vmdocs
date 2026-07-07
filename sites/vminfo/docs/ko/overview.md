---
title: 개요
description: vminfo의 기능과 수집하는 호스트 지표.
---

# 개요

vminfo는 빠른 로컬 진단을 위한 크로스 플랫폼 호스트 런타임 정보 툴킷입니다.

## 제공하는 기능

- **TUI** — 전체 화면 터미널 대시보드
- **JSON 출력** — 스크립트 친화적 스냅샷과 watch 스트림
- **웹 대시보드** — REST 및 WebSocket 엔드포인트를 갖춘 가벼운 브라우저 UI
- **Go 라이브러리** — 임포트 가능한 지표 수집과 임베디드 TUI API

## 수집 지표

vminfo는 다음을 수집합니다:

- CPU 사용량, 코어별 사용량, CPU 주파수
- 메모리와 스왑 사용량
- 디스크 사용량과 디스크 I/O
- 네트워크 합계, 속도, TCP/UDP 수
- TCP 상태 분포 (`ESTABLISHED` / `TIME_WAIT` / `SYN_RECV` / …)와 conntrack 사용량 (Linux)
- 인터페이스별 트래픽, 오류, 드롭
- 프로세스 목록과 프로세스 메타데이터
- 온도 판독값
- 가동 시간과 호스트 메타데이터

## 공개 Go 타입

- `StaticInfo`
- `RuntimeStats`
- `Snapshot`
- `ProcessInfo`
- `AppMetadata`

## 공통 진입점

- `vminfo`
- `vminfo info`
- `vminfo summary`
- `vminfo watch`
- `vminfo --web`
- `vminfo ps`
- `vminfo kill <pid>`
- `vminfo net dns | port | ping | ip`
- `vminfo update`

## 적합한 경우

다음과 같을 때 vminfo가 적합합니다:

- 빠른 호스트 점검을 위한 단일 바이너리가 필요할 때
- 대화형 작업을 위한 읽기 쉬운 터미널 UI가 필요할 때
- 스크립트, CI, 또는 자동화를 위한 JSON이 필요할 때
- 모니터링 스택 없이 웹 대시보드가 필요할 때
- 다른 CLI에 임베드할 수 있는 Go 라이브러리가 필요할 때
