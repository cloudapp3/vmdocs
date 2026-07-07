---
title: Instalação
description: Instale o vminfo com o instalador de shell, o go install ou um diretório de binários personalizado.
---

# Instalação

## Instalador de shell (Linux/macOS)

O script de instalação é o caminho mais rápido para Linux e macOS.

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vminfo/main/install.sh | bash
```

Com sudo:

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vminfo/main/install.sh | sudo bash
```

O script seleciona automaticamente um diretório de instalação nesta ordem:

1. `/usr/local/bin`
2. `~/.local/bin`
3. `~/bin`

Se você quiser um diretório fixo, passe `--dir`:

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vminfo/main/install.sh | bash -s -- --dir /opt/bin
```

O script também oferece suporte a `--skip-verify` caso você queira ignorar explicitamente a verificação de checksum.

## Instalação via Go

```bash
go install github.com/cloudapp3/vminfo/cmd/vminfo@latest
```

## Atualização

```bash
vminfo update
vminfo update --check
vminfo update --version v0.1.0
```

Observações:

- `vminfo update` instala o lançamento marcado com tag mais recente quando você está executando um build com tag
- `vminfo update --check` apenas verifica se há atualizações
- `vminfo update --version v0.1.0` verifica ou instala uma tag de lançamento específica

## Solução de problemas de PATH

Se o `vminfo` foi instalado, mas não é encontrado, certifique-se de que o seu diretório de instalação esteja no `PATH`.

Exemplos comuns:

```bash
export PATH="$HOME/.local/bin:$PATH"
export PATH="$HOME/bin:$PATH"
```

## Desinstalação

Remova o binário do diretório em que você o instalou:

```bash
rm -f /usr/local/bin/vminfo
rm -f ~/.local/bin/vminfo
rm -f ~/bin/vminfo
```
