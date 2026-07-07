---
title: 명령어 참조
description: vminfo CLI 명령어와 공통 워크플로 개요.
---

# 명령어 참조

## 공통 명령어

| 명령어 | 기능 |
| --- | --- |
| `vminfo` | 대화형 TUI 시작 |
| `vminfo info` | TUI의 별칭 |
| `vminfo summary` | 하나의 스냅샷 수집 |
| `vminfo watch` | 스냅샷을 지속적으로 스트리밍 |
| `vminfo --web` | 웹 대시보드 시작 |
| `vminfo ps` | Linux의 로컬 프로세스 나열 |
| `vminfo kill <pid>` | Linux 프로세스에 SIGTERM 전송 |
| `vminfo net` | 네트워크 진단 실행 (dns / port / ping / ip) |
| `vminfo update` | 릴리스 업데이트 확인 또는 설치 |
| `vminfo --lang zh` | UI 언어 전환 |

## 치트 시트

```bash
vminfo
vminfo info
vminfo summary
vminfo summary --json
vminfo watch
vminfo watch --json
vminfo watch --count 1
vminfo --web
vminfo --web --token
vminfo --web --token secret-token
vminfo --web --tui
vminfo --web --bind 0.0.0.0 --port 8080
vminfo ps
vminfo ps nginx
vminfo ps --filter ssh
vminfo ps --tree
vminfo ps --watch
vminfo ps --limit 20
vminfo ps --json
vminfo ps --sort mem
vminfo kill <pid>
vminfo net dns example.com
vminfo net port example.com 443
vminfo net ping example.com --tcp-port 443
vminfo net ip
vminfo update
vminfo update --check
vminfo update --version v0.1.0
vminfo --lang zh
```

자세한 내용은 아래 페이지를 참조하세요:

- [summary](/ko/summary)
- [watch](/ko/watch)
- [ps](/ko/ps)
- [kill](/ko/kill)
- [net](/ko/net)
- [update](/ko/update)
