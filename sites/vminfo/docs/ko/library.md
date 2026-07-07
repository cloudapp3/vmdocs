---
title: Go 라이브러리
description: vminfo를 Go 라이브러리로 임베드하여 호스트 지표 수집과 터미널 UI 통합을 구현합니다.
---

# Go 라이브러리

vminfo는 호스트 지표 수집과 터미널 UI 임베드를 위한 퍼블릭 패키지를 제공합니다.

## 패키지

- `github.com/cloudapp3/vminfo`
- `github.com/cloudapp3/vminfo/tui`

## 내보내진 타입

- `StaticInfo`
- `RuntimeStats`
- `Snapshot`
- `ProcessInfo`
- `AppMetadata`

## 공통 진입점

- `CollectStatic`
- `CollectStats`
- `CollectAll`
- `Metadata`
- `tui.Run`

## 관련 문서

- [지표 수집](/ko/collect)
- [TUI 임베드](/ko/embed-tui)
