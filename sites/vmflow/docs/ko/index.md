---
layout: home
description: vmflow는 작고 순수 Go로 작성된 L4 포워딩 런타임입니다. TCP/UDP/tcp+udp 포트 포워딩, 규칙 라이프사이클, 사전 검사, Prometheus 메트릭, 터미널 UI, 그리고 데몬과 컨트롤 플레인에 임베드할 수 있는 Go 라이브러리를 제공합니다.
hero:
  name: vmflow
  text: 데몬과 컨트롤 플레인을 위한 L4 포워딩 런타임
  tagline: 작고 순수한 Go 기반 TCP/UDP 포워딩 런타임입니다. 독립형 데몬으로 실행하거나, 런타임을 여러분만의 컨트롤 플레인에 임베드할 수 있습니다. 규칙 라이프사이클, 사전 검사, 메트릭, 터미널 UI를 기본으로 제공합니다.
  image:
    src: /logo.svg
    alt: vmflow
  actions:
    - theme: brand
      text: 시작하기
      link: ./quick-start
    - theme: alt
      text: CLI 참조
      link: ./commands
    - theme: alt
      text: GitHub
      link: https://github.com/cloudapp3/vmflow

features:
  - icon: 🔀
    title: L4 포워딩
    details: TCP, UDP, 그리고 결합된 tcp+udp 포트 포워딩을 지원하며 규칙별 속도 제한과 최대 연결 수 제한을 제공합니다.
    link: ./forwarding
  - icon: 🔄
    title: 규칙 라이프사이클
    details: 규칙을 시작, 중지, 재시작, 제거하거나, 증분 diff와 핫 리로드를 통해 전체 desired-state 스냅샷을 적용할 수 있습니다.
    link: ./rules
  - icon: 🛡️
    title: 적용 전 사전 검사
    details: 단 하나의 규칙이 변경되기 전에 중복 규칙 ID, 리스너 충돌, 사용 불가능한 포트, DNS 실패를 잡아냅니다.
    link: ./precheck
  - icon: 🧩
    title: 임베드 가능한 런타임
    details: 최상위 Go API를 임포트하여 여러분만의 컨트롤 플레인에 인프로세스 포워딩을 추가하세요. 엔진은 포워딩과 카운터만 담당합니다.
    link: ./library
  - icon: 📊
    title: Prometheus 메트릭과 로그
    details: /metrics 엔드포인트와 구조화된 text/JSON 로깅으로 별도의 연결 없이도 포워딩 상태를 관측할 수 있습니다.
    link: ./ctl
  - icon: 🖥️
    title: TUI와 Telegram 봇
    details: 터미널 대시보드와 (선택 사항인) Telegram 봇으로 어디서든 규칙을 조회하고 제어할 수 있습니다.
    link: ./tui-guide
  - icon: ⬆️
    title: 자체 업데이트
    details: "`vmflow update`로 최신 릴리스를 그 자리에서 확인하고 설치할 수 있습니다. 첫 설치 이후에는 설치 스크립트가 필요 없습니다."
    link: ./update
---

## 한 번의 명령으로 설치

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vmflow/main/install.sh | bash
```

데몬을 시작합니다:

```bash
vmflow -config ./examples/config.yaml
```

다른 터미널에서 쿼리합니다:

```bash
vmflow ctl rules
vmflow ctl stats
vmflow ctl precheck
```

## vmflow를 선택하는 이유

vmflow는 가볍고 인프로세스로 동작하는 L4 포워딩이 필요한 개발자와 운영자를 위해 만들어졌습니다. 독립형 데몬으로도, 더 큰 컨트롤 플레인 안의 라이브러리로도 사용할 수 있습니다.

다음과 같은 상황에 적합합니다:

- 포트 간 TCP/UDP 트래픽을 규칙별 제한과 함께 포워딩해야 할 때
- 여러분만의 desired-state나 데이터베이스로 포워딩 규칙을 구동해야 할 때
- 포워딩 설정을 적용하기 전에 검증해야 할 때
- 번들 CLI/TUI로 규칙 통계를 확인하고 설정을 리로드해야 할 때
- 데이터베이스나 웹 UI를 도입하지 않고 다른 Go 서비스에 포워딩을 임베드하고 싶을 때

## 빠른 링크

- [빠른 시작](./quick-start)
- [설치](./installation)
- [설정](./configuration)
- [명령어 참조](./commands)
- [Go 라이브러리](./library)
- [中文文档](/zh/)
