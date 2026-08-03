---
title: 로드맵
description: vmflow v0.3.0은 현재 안정 릴리스이며 제공된 기능과 향후 작업을 구분해 관리합니다.
---

# 로드맵

vmflow v0.3.0은 현재 안정 릴리스입니다. L4 포워딩, 로컬 컨트롤 플레인, 관측성, 네이티브 서비스 수명 주기, 트래픽 제어, TUI, 임베딩 API를 지금 사용할 수 있습니다.

## v0.3.0 이전에 제공된 기본 기능

- [x] TCP, UDP, `tcp+udp` 포워딩
- [x] `ApplySnapshot`, 규칙 수명 주기, YAML 핫 리로드
- [x] 로컬 CLI/TUI 관리
- [x] Prometheus 메트릭과 구조화 로깅
- [x] 관리 인증과 규칙 사전 검사
- [x] 임베딩 가능한 Go 런타임 API

## v0.3.0 - 2026-08-03 출시 완료

- [x] 규칙별 공유 upload/download 대역폭 제한
- [x] 영구 일간 및 월간 트래픽 쿼터
- [x] 검사 및 아웃바운드 포워딩을 위한 자동 DNS 장애 조치
- [x] 실시간 인터페이스 카운터와 속도를 제공하는 Host Network 대시보드
- [x] CLI/TUI 영어 및 중국어 간체 현지화
- [x] 네이티브 서비스 설치, 부팅 시작, 상태 확인 및 TUI 복구
- [x] 로컬 진단을 위한 읽기 전용 stdio MCP 도구

## 향후 작업

- [ ] 기존 연결의 graceful drain
- [ ] 이벤트 구독 API
- [ ] Windows 및 macOS 수동 검증
- [ ] 공식 Docker 이미지와 배포 예제
- [ ] 크로스 플랫폼 및 통합 테스트 범위 확대

## 나중을 위해 예약됨

HTTP/HTTPS 포워딩과 ACME/인증서 관리는 소스(`engine/https.go`, `engine/proxy.go`, `acme/`, `certstore/`, `certreview/`)에 구현되어 있지만 현재 빌드에서는 비활성화되어 있습니다. NAT 트래버설(`tunnel/`)도 마찬가지로 유지되지만 연결되어 있지 않습니다. 둘 다 L4 서피스가 안정화된 이후 향후 릴리스의 후보입니다.
