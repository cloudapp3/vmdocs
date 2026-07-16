---
title: MCP 서버
description: 읽기 전용 stdio 어댑터를 통해 Claude, Codex 및 기타 MCP 클라이언트를 실행 중인 vmflow 데몬에 연결합니다.
---

# MCP 서버

`vmflow mcp`는 포그라운드에서 도구 전용 MCP 서버를 stdio로 시작합니다.
이 서버는 루프백 관리 채널을 통해 이미 실행 중인 vmflow 데몬에 연결합니다.
포워딩을 시작하거나 MCP 네트워크 포트를 열지 않으며 데몬 설정을 변경하지도
않습니다.

## 요구 사항

- vmflow 데몬과 같은 호스트에서 MCP 명령을 실행합니다.
- 데몬 관리 리스너는 루프백에만 유지합니다.
- 인증을 활성화한 경우 `VMFLOW_CONTROL_TOKEN`을 통해 전용 viewer token을
  사용합니다.

## 도구

| 도구 | 용도 |
| --- | --- |
| `get_vmflow_status` | 연결, 버전, 권한, 규칙 수, 트래픽 및 degraded 상태 요약 |
| `list_forwarding_rules` | 엔드포인트나 소스 정책 세부 정보가 없는 필터링된 규칙 요약 |
| `get_forwarding_rule` | 명시적으로 선택한 규칙 하나의 전체 설정, 실행 상태 및 통계 |
| `get_traffic_stats` | 필터링된 규칙별 카운터와 집계 합계 |
| `run_config_precheck` | 현재 영구 저장된 설정의 읽기 전용 검증 |

모든 도구는 읽기 전용입니다. 목록 및 사전 검사 결과는 기본 50개, 최대
200개까지 반환하며 어댑터는 동시에 최대 4개의 도구 호출을 허용합니다.

## Viewer token

MCP 클라이언트 전용 token을 설정합니다.

```yaml
auth:
  enabled: true
  tokens:
    - name: mcp-viewer
      token: replace-with-a-long-random-token
      role: viewer
```

프로세스 명령줄에 token을 노출하는 `-token`보다 환경 변수를 권장합니다.

## Claude Desktop

```json
{
  "mcpServers": {
    "vmflow": {
      "command": "/usr/local/bin/vmflow",
      "args": ["mcp"],
      "env": {
        "VMFLOW_CONTROL_TOKEN": "replace-with-a-long-random-token"
      }
    }
  }
}
```

## Codex

```toml
[mcp_servers.vmflow]
command = "/usr/local/bin/vmflow"
args = ["mcp"]
env = { VMFLOW_CONTROL_TOKEN = "replace-with-a-long-random-token" }
```

데몬이 기본값이 아닌 관리 포트를 사용하면 `args`에 `-addr`와 루프백 URL을
추가합니다.

```json
"args": ["mcp", "-addr", "http://127.0.0.1:49127"]
```

`-addr`는 `localhost` 또는 루프백 IP만 허용합니다. 다른 시스템의 데몬에는
관리 리스너를 공개하지 말고 SSH 등을 통해 해당 시스템에서 `vmflow mcp`를
실행하세요.

## 데이터 경계

규칙 세부 정보에는 대상 주소, 소스 IP 정책, 도메인 및 비고가 포함될 수
있습니다. 트래픽과 사전 검사 결과도 로컬 네트워크 토폴로지를 드러낼 수
있습니다. 도구 결과는 MCP 클라이언트에 설정된 모델로 전송됩니다.

MCP 서버는 설정 쓰기, 원시 YAML, bot token, 인증서 개인 키, 셸 실행, 파일
접근, prompts 또는 resources를 제공하지 않습니다. 사전 검사는 데몬 설정에
이미 존재하는 대상을 확인하기 위해 이름을 해석할 수 있습니다.

## 문제 해결

- `connected: false`: 설정된 루프백 주소에서 데몬에 연결할 수 없습니다.
- HTTP `401`: `VMFLOW_CONTROL_TOKEN`에 올바른 viewer token을 설정합니다.
- Session 엔드포인트를 사용할 수 없음: MCP 서버와 같은 vmflow 릴리스로
  데몬을 다시 시작합니다.
- 사용자 지정 TLS 또는 mTLS: `vmflow ctl`과 `vmflow tui`가 지원하는 동일한
  `-tls-*` 플래그를 사용합니다.
