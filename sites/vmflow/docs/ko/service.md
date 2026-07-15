---
title: vmflow service
description: 부팅 시 시작하고 크래시 시 재시작하도록 vmflow를 네이티브 OS 서비스로 등록합니다 — systemd, launchd, 또는 Windows Service.
---

# vmflow service

```bash
vmflow service (install|uninstall|status) [flags]
```

별칭: `vmflow svc`.

`vmflow`를 **부팅 시 시작**하고 **크래시 시 재시작**하는 네이티브 OS 서비스로 등록합니다:

| 플랫폼 | 메커니즘 | 위치 |
| --- | --- | --- |
| Linux | systemd unit | `/etc/systemd/system/<name>.service` |
| macOS | launchd daemon | `/Library/LaunchDaemons/io.cloudapp.<name>.plist` |
| Windows | Windows Service | `services.msc` / `sc.exe`로 관리 |

이 서비스는 플랫폼의 감독자(supervisor) 하에서 단순히 `vmflow`을 실행합니다. Linux와 macOS에서는 감독자가 중지를 위해 `SIGTERM`을 보내고, Windows에서는 데몬이 Service Control Manager를 감지해 상태를 보고합니다. SCM에는 stdout이 없으므로 기본 로그 경로는 `C:\ProgramData\vmflow\logs\vmflow.log`입니다.

## 액션

| 액션 | 설명 |
| --- | --- |
| `install` | 설정을 검증하고 unit/plist/Windows Service를 생성하거나 업데이트한 뒤 **활성화**하고 즉시 **시작**합니다. 다시 실행하면 기존 서비스를 업데이트하고 재시작합니다. Linux/macOS에서는 root, Windows에서는 관리자 권한이 필요합니다. |
| `uninstall` | 서비스를 중지하고 제거합니다. 설정 파일과 로그 파일은 그대로 남겨둡니다. |
| `status` | 현재 서비스 상태를 출력합니다. |

## 플래그

| 플래그 | 기본값 | 설명 |
| --- | --- | --- |
| `-config` | 플랫폼 경로¹ | 서비스 설정 파일 경로입니다. 설정이 유효하고 root/admin 소유의 보호된 위치에 있어야 합니다. |
| `-user` | `root` _(systemd)_ | 이 사용자로 unit을 실행합니다. 없으면 시스템 사용자로 생성됩니다. Linux 전용. |
| `-log-file` | 플랫폼 기본값 | 로그 위치를 재정의합니다. Linux는 stdout/journald, macOS는 launchd 경로, Windows는 `C:\ProgramData\vmflow\logs\vmflow.log`를 사용합니다. |
| `--control-port` | 설정값 | 로컬 관리 포트를 재정의합니다. 호스트는 `127.0.0.1`로 유지됩니다. |
| `--extra-arg` | _(없음)_ | 향후 데몬 플래그를 `--extra-arg=-flag=value` 형식으로 추가하며 반복할 수 있습니다. 기존 플래그는 전용 서비스 옵션을 사용합니다. |
| `-binary` | 현재 실행 파일 | vmflow 바이너리 경로입니다. `install`의 경우 root/admin이 소유한 신뢰할 수 있는 위치의 **절대 경로**여야 합니다. |

¹ 기본 설정 경로: Linux `/etc/vmflow/config.yaml`, macOS `/usr/local/etc/vmflow/config.yaml`, Windows `C:\ProgramData\vmflow\config.yaml`.

## 예제

```bash
# 1. install a config at the default system path, then register the service
sudo vmflow service install

# 2. point the service at a specific config and run it as a dedicated user
sudo vmflow service install -config /etc/vmflow/config.yaml -user vmflow

# 3. 필요하면 루프백 관리 포트를 변경
sudo vmflow service install --control-port 19100

# 4. check / remove
vmflow service status
sudo vmflow service uninstall
```

## 보안 참고 사항

- `install`에서는 바이너리와 설정 모두 신뢰할 수 있는 위치의 root/admin 소유 절대 경로로 확인되어야 합니다. 서비스 정의를 변경하기 전에 설정을 먼저 분석합니다.
- 관리 리스너는 항상 `127.0.0.1`에 바인딩됩니다. 원격 관리는 SSH 터널을 사용합니다.

완전한 제거(서비스 + 바이너리 + 설정 + 로그 + 인증서)를 원하면 [`vmflow uninstall`](./uninstall)을 사용하세요.
