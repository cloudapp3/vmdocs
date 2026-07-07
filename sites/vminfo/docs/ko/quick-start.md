---
title: 빠른 시작
description: vminfo를 설치하고 TUI, JSON, 또는 웹 대시보드에서 호스트 런타임 지표를 점검하세요.
---

# 빠른 시작

vminfo는 터미널, JSON 출력, 웹 대시보드, 또는 Go API에서 빠른 호스트 런타임 가시성을 제공합니다.

## 설치

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vminfo/main/install.sh | bash
```

sudo와 함께:

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vminfo/main/install.sh | sudo bash
```

## TUI 실행

```bash
vminfo
```

## JSON 스냅샷 출력

```bash
vminfo summary --json
```

## 웹 대시보드 시작

```bash
vminfo --web
```

기본 주소:

```text
http://127.0.0.1:20021
```

## 다음 단계

- [명령어 참조](/ko/commands) 읽기
- [웹 대시보드 안내서](/ko/web-dashboard) 열기
- [HTTP API](/ko/api) 사용
- [Go 라이브러리](/ko/library) 임베드
