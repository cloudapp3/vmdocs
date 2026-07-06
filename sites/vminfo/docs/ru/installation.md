---
title: Установка
description: Установите vminfo через shell-установщик, go install или в произвольном каталоге для бинарников.
---

# Установка

## Shell-установщик (Linux/macOS)

Скрипт-установщик — самый быстрый путь для Linux и macOS.

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vminfo/main/install.sh | bash
```

С sudo:

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vminfo/main/install.sh | sudo bash
```

Скрипт автоматически выбирает каталог для установки в следующем порядке:

1. `/usr/local/bin`
2. `~/.local/bin`
3. `~/bin`

Если нужен фиксированный каталог, передайте `--dir`:

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vminfo/main/install.sh | bash -s -- --dir /opt/bin
```

Скрипт также поддерживает `--skip-verify`, если вы хотите явно пропустить проверку контрольной суммы.

## Установка через go install

```bash
go install github.com/cloudapp3/vminfo/cmd/vminfo@latest
```

## Обновление

```bash
vminfo update
vminfo update --check
vminfo update --version v0.1.0
```

Примечания:

- `vminfo update` устанавливает новейший релиз с тегом, когда вы запускаете сборку с тегом
- `vminfo update --check` только проверяет наличие обновлений
- `vminfo update --version v0.1.0` проверяет или устанавливает конкретный тег релиза

## Решение проблем с PATH

Если `vminfo` установлен, но не найден, убедитесь, что каталог установки присутствует в `PATH`.

Типичные примеры:

```bash
export PATH="$HOME/.local/bin:$PATH"
export PATH="$HOME/bin:$PATH"
```

## Удаление

Удалите бинарник из каталога, в который выполнялась установка:

```bash
rm -f /usr/local/bin/vminfo
rm -f ~/.local/bin/vminfo
rm -f ~/bin/vminfo
```
