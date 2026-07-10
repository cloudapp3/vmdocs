---
title: vmflow service
description: Регистрация vmflow как нативной службы ОС, которая стартует при загрузке и перезапускается при сбое — systemd, launchd или Windows Service.
---

# vmflow service

```bash
vmflow service (install|uninstall|status) [flags]
```

Псевдоним: `vmflow svc`.

Регистрирует `vmflow` как нативную службу ОС, которая **стартует при загрузке** и **перезапускается при сбое**:

| Платформа | Механизм | Расположение |
| --- | --- | --- |
| Linux | systemd unit | `/etc/systemd/system/<name>.service` |
| macOS | launchd daemon | `/Library/LaunchDaemons/io.cloudapp.<name>.plist` |
| Windows | Windows Service | управляется через `services.msc` / `sc.exe` |

Служба просто запускает `vmflow daemon` под супервизором платформы. На Linux и macOS супервизор посылает `SIGTERM` для остановки; на Windows демон определяет Service Control Manager при запуске и сообщает состояние сам (stdout недоступен, поэтому обязателен `-log-file`).

## Действия

| Действие | Описание |
| --- | --- |
| `install` | Генерирует unit/plist (или регистрирует Windows Service), **включает** его и **запускает** сейчас. Требует root на Linux/macOS, права администратора на Windows. |
| `uninstall` | Останавливает и удаляет службу. Файлы конфигурации и журналов остаются на месте. |
| `status` | Выводит текущее состояние службы. |

## Флаги

| Флаг | По умолчанию | Описание |
| --- | --- | --- |
| `-config` | путь платформы¹ | Путь к файлу конфигурации, с которым работает служба. Конфигурация должна уже существовать. |
| `-user` | `root` _(systemd)_ | Запускать unit от имени этого пользователя; при отсутствии создаётся как системный пользователь. Только Linux. |
| `-log-file` | _(stdout)_ | Перенаправляет журналы демона сюда. Передаётся как `-log-file` на Linux/Windows; задаёт пути захвата launchd на macOS. Фактически **обязателен на Windows**. |
| `-extra-args` | _(нет)_ | Дополнительные флаги, дословно добавляемые в командную строку демона, например `"-control-listen 0.0.0.0:19090"`. |
| `-binary` | текущий исполняемый файл | Путь к бинарному файлу vmflow. Для `install` это должен быть **абсолютный путь**, принадлежащий root/admin в доверенном расположении. |

¹ Пути конфигурации по умолчанию: Linux `/etc/vmflow/config.yaml`, macOS `/usr/local/etc/vmflow/config.yaml`, Windows `C:\ProgramData\vmflow\config.yaml`.

## Примеры

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

## Замечания по безопасности

- Для `install` путь к бинарному файлу должен разрешаться в абсолютный, принадлежащий root/admin путь в доверенном расположении установки; иначе установка отвергается. Это не позволяет менее привилегированному пользователю подменить бинарный файл после привилегированной установки.
- Привязка control API к адресу, отличному от loopback, по-прежнему подчиняется [проверке безопасности при запуске](./daemon#startup-safety) демона — включите `auth` или mTLS, иначе служба уйдёт в цикл падений.

Для полного удаления (служба + бинарный файл + конфигурация + журналы + сертификаты) используйте [`vmflow uninstall`](./uninstall).
