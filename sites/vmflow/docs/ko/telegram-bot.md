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

봇은 `bot_chat`에 설정된 단일 채팅으로 고정되어 있으며, 그 외 다른 채팅의 메시지와 콜백 쿼리는 무시합니다. 봇은 컨트롤 API가 아니라 인프로세스 엔진과 **직접** 통신하므로, 컨트롤 API 인증은 봇과 무관합니다. 컨트롤 API를 루프백 외부에 노출하는 것은 여전히 별도의 규칙이 있습니다([배포](./deployment) 참고).

## 명령

| 명령 | 효과 |
| --- | --- |
| `/start` | 도움말 텍스트를 표시합니다. |
| `/status` | 실행 중인 규칙 수, 총 연결 수, 업로드/다운로드 총합. |
| `/rules` | 실행 중인 규칙을 표로 나열합니다(name, proto, listen→target, conns, up/down). |
| `/detail <id>` | 단일 규칙의 설정과 라이브 트래픽을 표시합니다. |
| `/reload` | 리로드를 요청합니다. 확인 시 **모든 규칙을 중지합니다**(아래 비고 참고). |
| `/stop <id>` | ID로 단일 규칙을 중지합니다(확인 요청). |
| `/start_rule <id>` | 규칙 시작을 요청합니다(아래 비고 참고). |

파괴적인 동작은 적용되기 전에 인라인 버튼으로 확인을 요청합니다.

::: warning `/reload`와 `/start_rule`의 제약
- `/reload`는 설정을 **다시 읽지 않습니다**. 확인 시 `StopAll()`을 호출하고 다음과 같이 응답합니다: _"✅ All rules stopped. Use control API /v1/reload for full config reload."_ 설정 변경을 실제로 적용하려면 컨트롤 API에 `vmflow ctl reload`(또는 `POST /v1/reload`)를 실행하세요.
- `/start_rule`은 스텁입니다. 확인 시 컨트롤 API `/v1/reload`를 사용하라는 힌트로 응답하는데, 단일 규칙을 다시 적용하려면 봇이 가지지 않은 전체 규칙 설정이 필요하기 때문입니다.

반대로 `/stop <id>`는 완전히 동작합니다 — 해당 규칙을 즉시 중지합니다.
:::

## 비고

- 이 연동은 선택적이며 best-effort입니다. 프로덕션 리로드를 위한 컨트롤 API를 대체하지 않습니다.
- 봇은 데몬 프로세스를 공유하므로 데몬이 재시작되면 봇도 재시작됩니다.
