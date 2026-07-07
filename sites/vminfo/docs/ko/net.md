---
title: net
description: 주문형 네트워크 진단 — DNS 조회, TCP 포트 프로브, ping, 공개 IP/지역 정보 조회.
---

# `vminfo net`

호스트 지표에 이미 사용하고 있는 동일한 바이너리에서 일회성 네트워크 진단을 실행합니다. 각 하위 명령은 기본적으로 사람이 읽을 수 있는 출력을 내며, 스크립팅을 위해 `--json`을 지원합니다.

## 하위 명령

| 동작 | 수행하는 작업 |
| --- | --- |
| `net dns` | 도메인을 주소로 확인합니다 |
| `net port` | `host:port`에 대한 TCP 연결과 지연 시간을 테스트합니다 |
| `net ping` | TCP 다이얼 또는 ICMP RTT로 호스트를 프로브합니다 |
| `net ip` | 공개 IP와 ASN/지역 정보를 조회합니다 |

## `net dns`

```bash
vminfo net dns example.com
vminfo net dns example.com --server 1.1.1.1
vminfo net dns example.com --server 1.1.1.1 --json
```

| 플래그 | 설명 |
| --- | --- |
| 위치 인자 domain | 확인할 도메인 (정확히 하나) |
| `--server` | `host` 또는 `host:port` 형태의 DNS 서버. 비어 있으면 시스템 기본값 |
| `--json` | 결과를 JSON으로 출력합니다 |

## `net port`

```bash
vminfo net port example.com 443
vminfo net port example.com 443 --timeout 3s --json
```

| 플래그 | 설명 |
| --- | --- |
| `host` / `port` | 대상 호스트와 포트 (1–65535) |
| `--timeout` | 다이얼 타임아웃, 기본값 `2s` |
| `--json` | 결과를 JSON으로 출력합니다 |

## `net ping`

```bash
vminfo net ping example.com                       # TCP ping, 포트 80
vminfo net ping example.com --tcp-port 443        # 443에서 TCP ping
vminfo net ping example.com --mode icmp           # 실제 ICMP ping (권한 필요)
vminfo net ping example.com --count 6 --json
```

| 플래그 | 설명 |
| --- | --- |
| 위치 인자 host | 프로브할 호스트 (정확히 하나) |
| `--mode` | `tcp` (기본값) 또는 `icmp` |
| `--count` | 프로브 횟수, 기본값 `4` |
| `--timeout` | 프로브당 타임아웃, 기본값 `1s` |
| `--tcp-port` | TCP 대상 포트, 기본값 `80` (tcp 모드 전용) |
| `--json` | 결과를 JSON으로 출력합니다 |

::: tip TCP vs ICMP
`tcp` 모드는 TCP 다이얼 RTT를 측정합니다. 크로스 플랫폼이며 권한이 필요 없어 어디서든 동작합니다. `icmp` 모드는 `golang.org/x/net`를 통해 실제 ICMP Echo 패킷을 전송합니다. Linux에서는 권한 없는 UDP ICMP 소켓을 허용하도록 `net.ipv4.ping_group_range` 설정이 필요하며, Windows에서는 지원되지 않습니다. ICMP를 사용할 수 없다면 `--mode tcp`로 전환하세요.
:::

## `net ip`

```bash
vminfo net ip                       # 자신의 공개 IP + ASN/지역 정보
vminfo net ip 8.8.8.8               # 특정 IP 조회
vminfo net ip --json
```

| 플래그 | 설명 |
| --- | --- |
| 위치 인자 ip | 조회할 선택적 IP. 생략하면 자신의 공개 IP |
| `--server` | 조회 서비스 기본 URL, 기본값 `https://ip.bestcheapvps.org` |
| `--json` | 결과를 JSON으로 출력합니다 |

::: warning 아웃바운드 요청
`net ip`는 ASN, 지역, 위험 플래그를 가져오기 위해 서드파티 조회 서비스(기본값 `ip.bestcheapvps.org`)에 명시적인 사용자 실행 요청을 보냅니다. 이 사실은 `--help`와 명령 출력에 공개됩니다. 자동으로 실행되지 않으며, 오직 사용자가 요청할 때만 동작합니다.
:::

## 참고

- 사람이 읽을 수 있는 출력은 현지화됩니다. JSON 출력은 안정적이며 언어에 중립적입니다.
- JSON 결과는 타이밍을 `elapsed_ms`에 반영하고, 오류는 `error` 필드로 노출합니다.
- 이 진단 기능은 웹 대시보드에서 [`POST /api/v1/net/diag`](/ko/api#post-api-v1-net-diag)를 통해서도 사용할 수 있습니다.

## 예제

```bash
vminfo net ping example.com --tcp-port 443 --count 4 --json
```

## 관련 문서

- [HTTP API](/ko/api)
- [웹 대시보드](/ko/web-dashboard)
