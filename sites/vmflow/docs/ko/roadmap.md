---
title: 로드맵
description: vmflow 릴리스 로드맵 — v0.1 베이스라인 출시, v0.2 진행 중, v0.3 계획됨.
---

# 로드맵

vmflow는 실용적인 v0.1 스타일의 MVP 단계입니다. 포워딩 경로, 규칙 라이프사이클, 로컬 컨트롤 플레인, 관측 기초, 임베딩 API가 갖춰져 있습니다.

## v0.1 — 베이스라인

- [x] TCP 포워딩
- [x] UDP 포워딩
- [x] `ApplySnapshot`
- [x] daemon + CLI
- [x] 로컬 CLI/TUI 관리
- [x] YAML 설정

## v0.2 — 진행 중

- [x] Prometheus 메트릭
- [x] 향상된 구조화 로깅
- [x] 관리 인증
- [x] 규칙 사전 점검
- [ ] graceful drain
- [ ] Windows / macOS 수동 검증

## v0.3 — 계획됨

- [ ] 규칙별 공유 대역폭 버킷
- [ ] 이벤트 구독 API
- [ ] 설정 핫 리로드 개선
- [x] 네이티브 부트 시작 서비스(`vmflow service install`을 통한 systemd / launchd / Windows Service)
- [ ] Docker 공식 이미지 / 예제

## 나중을 위해 예약됨

HTTP/HTTPS 포워딩과 ACME/인증서 관리는 소스(`engine/https.go`, `engine/proxy.go`, `acme/`, `certstore/`, `certreview/`)에 구현되어 있지만 현재 빌드에서는 비활성화되어 있습니다. NAT 트래버설(`tunnel/`)도 마찬가지로 유지되지만 연결되어 있지 않습니다. 둘 다 L4 서피스가 안정화된 이후 향후 릴리스의 후보입니다.
