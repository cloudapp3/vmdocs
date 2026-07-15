---
title: Telegram 봇
description: vmflow 규칙을 조회하고 제어하는 선택적 Telegram 봇 — /status, /rules, /detail, /reload, /stop, /start_rule.
---

# Telegram 봇

vmflow는 가볍고 채팅 기반의 조회와 제어를 위해 선택적으로 실행할 수 있는 Telegram 봇을 제공합니다 — 휴대폰으로 작업하며 빠른 확인을 위해 SSH로 접속하고 싶지 않을 때 유용합니다.

## 활성화하기

봇은 두 필드가 **모두** 설정되었을 때만 시작됩니다:

```yaml
bot_token: <your-telegram-bot-token>
bot_chat: <chat-id>
```

`bot_token`은 [@BotFather](https://t.me/BotFather)에서 발급받은 토큰이고, `bot_chat`은 봇이 응답하도록 허용된 숫자 chat ID입니다. `bot_token`을 설정하지 않으면 단순히 봇이 시작되지 않습니다.

## 인증

봇은 `bot_chat` 채팅에만 응답합니다. `bot_control_token`을 `auth.tokens`의 admin token으로 설정하면 쓰기가 활성화되며, 없으면 읽기 전용입니다. 요청은 프로세스 내부에서 처리됩니다.

## 명령

| 명령 | 효과 |
| --- | --- |
| `/start` | 도움말 텍스트를 표시합니다. |
| `/status` | 실행 중인 규칙 수, 총 연결 수, 업로드/다운로드 총합. |
| `/rules` | 실행 중인 규칙을 표로 나열합니다(name, proto, listen→target, conns, up/down). |
| `/detail <id>` | 단일 규칙의 설정과 라이브 트래픽을 표시합니다. |
| `/reload` | 확인 후 디스크에서 설정을 다시 읽습니다. |
| `/stop <id>` | ID로 단일 규칙을 중지합니다(확인 요청). |
| `/start_rule <id>` | 확인 후 규칙을 활성화하고 시작합니다. |

파괴적인 동작은 적용되기 전에 인라인 버튼으로 확인을 요청합니다.

::: tip
Bot 쓰기 명령은 TUI와 같은 사전 검사, 트랜잭션 적용, 롤백, 낙관적 동시성 제어를 사용합니다. 충돌 시 재시도를 안내합니다.
:::

## 비고

- 이 연동은 선택 사항이며 CLI/TUI가 기본 관리 인터페이스입니다.
- 봇은 데몬 프로세스를 공유하므로 데몬이 재시작되면 봇도 재시작됩니다.
