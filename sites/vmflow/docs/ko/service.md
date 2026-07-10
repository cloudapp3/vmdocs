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

이 서비스는 플랫폼의 감독자(supervisor) 하에서 단순히 `vmflow daemon`을 실행합니다. Linux와 macOS에서는 감독자가 중지를 위해 `SIGTERM`을 보내고, Windows에서는 데몬이 시작 시 Service Control Manager를 감지하여 상태를 스스로 보고합니다(stdout을 사용할 수 없으므로 `-log-file`이 필요합니다).

## 액션

| 액션 | 설명 |
| --- | --- |
| `install` | unit/plist를 생성(또는 Windows Service를 등록)하고, **활성화**한 뒤 지금 **시작**합니다. Linux/macOS에서는 root, Windows에서는 관리자 권한이 필요합니다. |
| `uninstall` | 서비스를 중지하고 제거합니다. 설정 파일과 로그 파일은 그대로 남겨둡니다. |
| `status` | 현재 서비스 상태를 출력합니다. |

## 플래그

| 플래그 | 기본값 | 설명 |
| --- | --- | --- |
| `-config` | 플랫폼 경로¹ | 서비스가 구동할 설정 파일 경로입니다. 설정은 이미 존재해야 합니다. |
| `-user` | `root` _(systemd)_ | 이 사용자로 unit을 실행합니다. 없으면 시스템 사용자로 생성됩니다. Linux 전용. |
| `-log-file` | _(stdout)_ | 데몬 로그를 이곳으로 리다이렉트합니다. Linux/Windows에서는 `-log-file`로 전달되고, macOS에서는 launchd 캡처 경로를 설정합니다. 사실상 **Windows에서 필수**입니다. |
| `-extra-args` | _(없음)_ | 데몬 명령줄에 그대로 추가되는 추가 플래그, 예: `"-control-listen 0.0.0.0:19090"`. |
| `-binary` | 현재 실행 파일 | vmflow 바이너리 경로입니다. `install`의 경우 root/admin이 소유한 신뢰할 수 있는 위치의 **절대 경로**여야 합니다. |

¹ 기본 설정 경로: Linux `/etc/vmflow/config.yaml`, macOS `/usr/local/etc/vmflow/config.yaml`, Windows `C:\ProgramData\vmflow\config.yaml`.

## 예제

```bash
# 1. install a config at the default system path, then register the service
sudo vmflow service install

# 2. point the service at a specific config and run it as a dedicated user
sudo vmflow service install -config /etc/vmflow/config.yaml -user vmflow

# 3. bind the control API off-loopback (auth/mTLS still required — see Deployment)
sudo vmflow service install -extra-args "-control-listen 0.0.0.0:19090"

# 4. check / remove
vmflow service status
sudo vmflow service uninstall
```

## 보안 참고 사항

- `install`의 경우, 바이너리는 신뢰할 수 있는 설치 위치에 있는 root/admin 소유의 절대 경로로 확인되어야 하며, 그렇지 않으면 설치가 거부됩니다. 이는 권한이 낮은 사용자가 권한 있는 설치 이후에 바이너리를 교체하는 것을 방지합니다.
- 컨트롤 API를 루프백 외부에 바인딩하는 것은 여전히 데몬의 [시작 안전 검사](./daemon#startup-safety)의 적용을 받습니다 — `auth` 또는 mTLS를 활성화하지 않으면 서비스가 크래시 루프에 빠집니다.

완전한 제거(서비스 + 바이너리 + 설정 + 로그 + 인증서)를 원하면 [`vmflow uninstall`](./uninstall)을 사용하세요.
