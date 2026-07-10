---
title: Instalação
description: Instale o vmflow a partir do GitHub Releases com o instalador de uma linha, ou compile a partir do código-fonte. Suporta --version, --dir, --skip-verify e GITHUB_TOKEN.
---

# Instalação

O `vmflow` é distribuído como um único binário estático para Linux e macOS (`amd64` e `arm64`). Obtenha-o pelo GitHub Releases com o instalador, ou compile a partir do código-fonte.

Além dos binários estáticos, cada release também publica pacotes de sistema `.deb` e `.rpm` (construídos via GoReleaser).

## Instalador de uma linha

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vmflow/main/install.sh | bash
```

Instale globalmente em `/usr/local/bin`:

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vmflow/main/install.sh | sudo bash -s -- --dir /usr/local/bin
```

Instale uma tag de release específica:

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vmflow/main/install.sh | bash -s -- --version v0.1.0
```

### Opções do instalador

| Opção | Descrição |
| --- | --- |
| `--version <tag>` | Instala uma tag de release específica. O padrão é a release mais recente. |
| `--dir <path>` | Diretório de instalação. Detectado automaticamente quando omitido (veja abaixo). |
| `--skip-verify` | Ignora a verificação de checksum SHA-256. |
| `--uninstall` | Delega para `vmflow uninstall` (remove serviço, binário, configuração, logs, certificados, cache de atualização). |
| `-h, --help` | Exibe a ajuda. |

O instalador baixa os arquivos do GitHub Release, verifica o `checksums.txt` com SHA-256 por padrão e detecta automaticamente um diretório de instalação nesta ordem: `/usr/local/bin` → `~/.local/bin` → `~/bin`. Você pode sobrescrever isso com `--dir PATH` ou a variável de ambiente `VMFLOW_INSTALL_DIR`.

Para releases privados ou limites de taxa (rate limits) mais altos da API do GitHub, defina `GITHUB_TOKEN` ou `GH_TOKEN`.

## Compilar a partir do código-fonte

Requisitos: [Go](https://go.dev/dl/) (uma versão recente, veja `go.mod`).

```bash
git clone https://github.com/cloudapp3/vmflow.git
cd vmflow
go build -trimpath -o vmflow ./cmd/vmflow
```

Ou com o Makefile:

```bash
make build
```

## Verificar a instalação

```bash
vmflow version
vmflow version -json
```

## PATH não configurado?

Se o instalador relatar que o diretório escolhido não está no seu `PATH`, crie um link simbólico:

```bash
sudo ln -sf "$HOME/.local/bin/vmflow" /usr/local/bin/vmflow
```

…ou adicione o diretório ao `PATH` do seu shell:

```bash
export PATH="$HOME/.local/bin:$PATH"
```

## Atualizar o vmflow

Depois de instalado a partir de uma release com tag (v0.1.1 ou posterior), o `vmflow` consegue se autoatualizar:

```bash
vmflow update --check            # check for a newer release
vmflow update                    # install the newest release
vmflow update --version v0.1.1   # install a specific version
```

Consulte [`vmflow update`](./update) para detalhes, flags e notas por plataforma. (A release v0.1.0 é anterior ao comando `update` — reinstale-a com o instalador acima para obter a autoatualização.)
