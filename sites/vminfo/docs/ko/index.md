---
layout: home
titleTemplate: false
description: vminfo는 Linux, macOS, Windows용 크로스 플랫폼 터미널 시스템 모니터이자 CLI입니다 — 실시간 CPU, 메모리, 디스크, 네트워크, 프로세스 지표, JSON 출력, 웹 대시보드, 임베디드 가능한 Go 라이브러리를 제공합니다.
hero:
  name: vminfo
  text: 터미널 시스템 모니터, 웹 대시보드, 그리고 Go 라이브러리
  tagline: Linux, macOS, Windows를 위한 크로스 플랫폼 호스트 런타임 가시성 — TUI, JSON 출력, 웹 대시보드, 또는 임베디드 가능한 Go API에서 사용 가능.
  image:
    src: /logo.svg
    alt: vminfo
  actions:
    - theme: brand
      text: 시작하기
      link: /ko/quick-start
    - theme: alt
      text: 명령어 보기
      link: /ko/commands
    - theme: alt
      text: HTTP API
      link: /ko/api
    - theme: alt
      text: GitHub
      link: https://github.com/cloudapp3/vminfo

features:
  - icon: 🖥️
    title: 세련된 TUI
    details: CPU, 메모리, 디스크, 네트워크, 부하, 프로세스를 보여주는 실시간 터미널 대시보드.
    link: /ko/tui-controls
  - icon: 📦
    title: 스크립트 친화적 JSON
    details: 자동화, CI, 진단을 위한 스냅샷 내보내기와 watch 스트림.
    link: /ko/summary
  - icon: 🌐
    title: 테마가 있는 웹 대시보드
    details: REST 및 WebSocket 엔드포인트와 전환 가능한 테마를 갖춘 읽기 전용 웹 대시보드를 시작하세요.
    link: /ko/web-dashboard
  - icon: 🧩
    title: 임베디드 가능한 Go API
    details: vminfo 수집 API를 임포트하거나 대화형 TUI를 자신의 Go CLI에 임베드하세요.
    link: /ko/library
  - icon: ⚡
    title: 설정 불필요 런타임 가시성
    details: 데몬도, 데이터베이스도, 중앙 서버도 없습니다. 설치하고 로컬 호스트를 빠르게 점검하세요.
    link: /ko/installation
  - icon: 🔍
    title: 네트워크 진단
    details: CLI나 대시보드에서 주문형 DNS, TCP 포트, ping, 공인 IP / ASN 조회를 실행하세요.
    link: /ko/net
  - icon: 🔒
    title: 토큰 인식 웹 모드
    details: 토큰, 쿠키, CORS, WebSocket 오리진 검사로 원격 대시보드 접근을 보호하세요.
    link: /ko/api
---

## 한 번의 명령으로 설치

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vminfo/main/install.sh | bash
```

그런 다음 터미널 UI를 실행하세요:

```bash
vminfo
```

또는 스크립트용 JSON 스냅샷을 얻으세요:

```bash
vminfo summary --json
```

## vminfo를 선택하는 이유

vminfo는 머신에 대한 저마찰 가시성이 필요한 개발자, SRE, DevOps 엔지니어, 서버 운영자를 위해 만들어졌습니다.

다음과 같은 상황에 사용하세요:

- 터미널에서 CPU, 메모리, 디스크, 네트워크, 부하, 프로세스를 점검할 때
- 스크립트와 자동화를 위해 기계 판독 가능 JSON을 내보낼 때
- 서버에서 `vminfo --web`으로 웹 대시보드를 열 때
- 호스트 지표 수집을 다른 Go 도구에 임베드할 때
- 완전한 모니터링 플랫폼을 구동하지 않고 단일 호스트를 진단할 때

## 스크린샷

<div class="vminfo-screenshot-grid">
  <img src="../assets/tui-overview-refreshed.png" alt="vminfo TUI 개요" />
  <img src="../assets/web-dashboard.png" alt="vminfo 웹 대시보드" />
  <img src="../assets/tui-processes.png" alt="vminfo 프로세스 보기" />
  <img src="../assets/tui-help.png" alt="vminfo 도움말 오버레이" />
</div>

![vminfo TUI 개요](../assets/tui-overview-refreshed.png)

## 빠른 링크

- [빠른 시작](/ko/quick-start)
- [설치](/ko/installation)
- [배포](/ko/deployment)
- [명령어 참조](/ko/commands)
- [HTTP API](/ko/api)
- [Go 라이브러리](/ko/library)
- [中文文档](/zh/)
- [日本語ドキュメント](/ja/)
