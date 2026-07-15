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

Служба запускает `vmflow` под супервизором платформы. На Linux и macOS супервизор посылает `SIGTERM`; на Windows демон определяет Service Control Manager и сообщает состояние. У SCM нет stdout, поэтому журнал по умолчанию находится в `C:\ProgramData\vmflow\logs\vmflow.log`.

## Действия

| Действие | Описание |
| --- | --- |
| `install` | Проверяет конфигурацию, создаёт или обновляет unit/plist/Windows Service, **включает** и сразу **запускает** службу. Повторный запуск обновляет и перезапускает существующую службу. Требует root на Linux/macOS, права администратора на Windows. |
| `uninstall` | Останавливает и удаляет службу. Файлы конфигурации и журналов остаются на месте. |
| `status` | Выводит текущее состояние службы. |

## Флаги

| Флаг | По умолчанию | Описание |
| --- | --- | --- |
| `-config` | путь платформы¹ | Путь к конфигурации службы. Она должна быть корректной и находиться в защищённом месте, принадлежащем root/admin. |
| `-user` | `root` _(systemd)_ | Запускать unit от имени этого пользователя; при отсутствии создаётся как системный пользователь. Только Linux. |
| `-log-file` | значение платформы | Переопределяет путь журнала. Linux использует stdout/journald, macOS пути launchd, Windows — `C:\ProgramData\vmflow\logs\vmflow.log`. |
| `--control-port` | значение конфигурации | Переопределяет локальный порт управления; адрес остаётся `127.0.0.1`. |
| `--extra-arg` | _(нет)_ | Добавляет будущий флаг в виде `--extra-arg=-flag=value`; параметр можно повторять. Для существующих флагов используйте отдельные опции. |
| `-binary` | текущий исполняемый файл | Путь к бинарному файлу vmflow. Для `install` это должен быть **абсолютный путь**, принадлежащий root/admin в доверенном расположении. |

¹ Пути конфигурации по умолчанию: Linux `/etc/vmflow/config.yaml`, macOS `/usr/local/etc/vmflow/config.yaml`, Windows `C:\ProgramData\vmflow\config.yaml`.

## Примеры

```bash
# 1. install a config at the default system path, then register the service
sudo vmflow service install

# 2. point the service at a specific config and run it as a dedicated user
sudo vmflow service install -config /etc/vmflow/config.yaml -user vmflow

# 3. при необходимости измените loopback-порт управления
sudo vmflow service install --control-port 19100

# 4. check / remove
vmflow service status
sudo vmflow service uninstall
```

## Замечания по безопасности

- Для `install` бинарный файл и конфигурация должны разрешаться в абсолютные пути, принадлежащие root/admin и находящиеся в доверенных местах. Конфигурация разбирается до изменения службы.
- Слушатель управления всегда привязан к `127.0.0.1`; для удалённого доступа используется SSH-туннель.

Для полного удаления (служба + бинарный файл + конфигурация + журналы + сертификаты) используйте [`vmflow uninstall`](./uninstall).
