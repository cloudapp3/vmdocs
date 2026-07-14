---
title: 배포
description: 로컬 접속, SSH 터널 또는 HTTPS 리버스 프록시를 통해 vminfo 웹 대시보드를 안전하게 운영합니다.
---

# 배포

`vminfo --web`은 단일 호스트용 경량 대시보드입니다. 데이터베이스가 필요 없으며 중앙 집중식 모니터링 서비스가 아닙니다. 내장 HTTP 서버는 신뢰할 수 있는 경계 안에서 운영하세요.

## 로컬 전용 대시보드

가장 안전한 기본 구성에는 인증이 필요하지 않습니다.

```bash
vminfo --web
```

`127.0.0.1:20021`에서 수신합니다. 같은 머신에서
`http://127.0.0.1:20021`을 열거나 API를 확인하세요.

```bash
curl -fsS http://127.0.0.1:20021/api/v1/health
```

인증하지 않은 모드는 `localhost` 또는 루프백 IP Host 헤더만 허용하여 DNS rebinding을 차단합니다.

## SSH를 통한 원격 접속

한 명이 관리한다면 서버는 루프백에 유지하고 터널을 만드세요.

```bash
# 서버
vminfo --web

# 워크스테이션
ssh -L 20021:127.0.0.1:20021 user@server
```

워크스테이션에서 `http://127.0.0.1:20021`을 엽니다. 서버 네트워크에는 대시보드 포트가 공개되지 않습니다.

## HTTPS 리버스 프록시를 통한 접속

지속적인 브라우저 URL이 필요하다면 vminfo는 루프백에 유지하고 같은 호스트의 HTTPS 리버스 프록시를 사용하세요.

```bash
vminfo --web --bind 127.0.0.1 --port 20021 --token
```

값 없는 `--token`은 임의의 token과 바로 열 수 있는 URL을 생성합니다. 고정 값도 지정할 수 있습니다.

```bash
vminfo --web --bind 127.0.0.1 --port 20021 --token "$VMINFO_WEB_TOKEN"
```

프록시는 다음을 수행해야 합니다.

- TLS를 종료하고 `127.0.0.1:20021`로 전달
- 원래 `Host` 헤더 유지
- `X-Forwarded-Proto: https` 설정
- `/ws`의 WebSocket upgrade 지원
- 대시보드와 API를 동일 출처로 유지

처음 `/?token=...`에 정상 접속하면 `HttpOnly`, `SameSite=Lax` cookie가 저장되고 token이 제거된 URL로 리디렉션됩니다. HTTPS 요청으로 인식되면 cookie에 `Secure`도 설정됩니다.

::: warning 전송 보안
내장 서버는 HTTP를 사용합니다. token은 접근만 제어하며 트래픽을 암호화하지 않습니다. 포트를 인터넷에 직접 공개하지 말고 HTTPS 프록시나 SSH 터널을 사용하세요.
:::

## 사설 네트워크에 직접 바인딩

신뢰할 수 있는 사설망에서 직접 접속하더라도 루프백이 아닌 bind에는 token이 필수입니다.

```bash
vminfo --web --bind 0.0.0.0 --port 20021 --token
```

`--token`이 없으면 시작 즉시 실패합니다. 방화벽으로 접속 원본을 제한하고 연결은 암호화되지 않은 HTTP임을 기억하세요.

## 브라우저 및 API 보호

- `Origin`이 있는 REST 및 WebSocket 요청은 scheme, host, port가 일치해야 합니다
- `Access-Control-Allow-Origin: *`를 반환하지 않습니다
- token 모드에서 페이지, `/api/v1/*`, `/ws`는 token 또는 cookie가 필요합니다
- `Origin`이 없는 네이티브 클라이언트는 계속 지원됩니다
- 네트워크 진단은 JSON, 본문 크기, 횟수 및 timeout을 검증합니다

## 프로세스 관리

systemd, launchd 또는 컨테이너 런타임처럼 호스트에서 이미 사용하는 supervisor를 사용하세요. 가능하면 non-root 사용자로 실행하고, 비정상 종료 후 다시 시작하며, 종료 시 `SIGTERM`을 보내세요. vminfo는 service 정의를 자동 설치하지 않습니다.

## 배포 확인

```bash
curl -fsS http://127.0.0.1:20021/api/v1/health
curl -fsS "http://127.0.0.1:20021/api/v1/health?token=$VMINFO_WEB_TOKEN"
```

별도의 공개 health endpoint는 없습니다. 인증을 사용하면 `/api/v1/health`도 보호됩니다.

## 관련 문서

- [웹 대시보드](/ko/web-dashboard)
- [HTTP API](/ko/api)
- [설치](/ko/installation)
- [update 명령](/ko/update)
