---
title: Установка
description: Установите vmflow из GitHub Releases однострочным инсталлятором или соберите из исходников. Поддерживаются --version, --dir, --skip-verify и GITHUB_TOKEN.
---

# Установка

`vmflow` поставляется как одиночный статический бинарный файл для Linux и macOS (`amd64` и `arm64`). Получите его из GitHub Releases через инсталлятор или соберите из исходников.

В релизах публикуются переносимые архивы, а не управляемые дистрибутивом пакеты `.deb` или `.rpm`. Используйте установщик ниже либо распакуйте архив вручную.

## Однострочный инсталлятор

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vmflow/main/install.sh | bash
```

Глобальная установка в `/usr/local/bin`:

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vmflow/main/install.sh | sudo bash -s -- --dir /usr/local/bin
```

Установка конкретного тега релиза:

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vmflow/main/install.sh | bash -s -- --version v0.1.0
```

### Параметры инсталлятора

| Параметр | Описание |
| --- | --- |
| `--version <tag>` | Установить конкретный тег релиза. По умолчанию — последний релиз. |
| `--dir <path>` | Каталог установки. При отсутствии определяется автоматически (см. ниже). |
| `--skip-verify` | Пропустить проверку контрольной суммы SHA-256. |
| `--uninstall` | Делегировать `vmflow uninstall` (удалить службу, бинарный файл, конфигурацию, журналы, сертификаты, кэш обновлений). |
| `-h, --help` | Показать справку. |

Инсталлятор скачивает архивы из GitHub Releases, по умолчанию проверяет `checksums.txt` по SHA-256 и автоматически определяет каталог установки в следующем порядке: `/usr/local/bin` → `~/.local/bin` → `~/bin`. Переопределить можно через `--dir PATH` или переменную окружения `VMFLOW_INSTALL_DIR`.

Для приватных релизов или повышения лимитов GitHub API задайте `GITHUB_TOKEN` или `GH_TOKEN`.

## Сборка из исходников

Требования: [Go](https://go.dev/dl/) (свежая версия, см. `go.mod`).

```bash
git clone https://github.com/cloudapp3/vmflow.git
cd vmflow
go build -trimpath -o vmflow ./cmd/vmflow
```

Либо через Makefile:

```bash
make build
```

## Проверка установки

```bash
vmflow version
vmflow version -json
```

## PATH не задан?

Если инсталлятор сообщает, что выбранный каталог не входит в ваш `PATH`, создайте символьную ссылку:

```bash
sudo ln -sf "$HOME/.local/bin/vmflow" /usr/local/bin/vmflow
```

…либо добавьте каталог в `PATH` вашей оболочки:

```bash
export PATH="$HOME/.local/bin:$PATH"
```

## Обновление vmflow

После установки из тегированного релиза (v0.1.1 и новее) `vmflow` может обновлять сам себя:

```bash
vmflow update --check            # проверить наличие нового релиза
vmflow update                    # установить самый свежий релиз
vmflow update --version v0.1.1   # установить конкретную версию
```

Подробности, флаги и платформенные особенности — см. [`vmflow update`](./update). (Релиз v0.1.0 появился раньше команды `update` — переустановите его инсталлятором выше, чтобы получить самообновление.)
