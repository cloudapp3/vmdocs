---
title: Instalação
description: Instale o vmflow pelo GitHub Releases com seleção baseada em privilégios, integração ao PATH, verificação de checksum e desinstalação, ou compile a partir do código-fonte.
---

# Instalação

O `vmflow` é distribuído como um único binário estático para Linux e macOS (`amd64` e `arm64`). Obtenha-o pelo GitHub Releases com o instalador, ou compile a partir do código-fonte.

As releases usam archives portáveis em vez de pacotes `.deb` ou `.rpm` gerenciados pela distribuição. Use o instalador abaixo ou extraia um archive manualmente.

## Instalação de usuário recomendada

```bash
VMFLOW_BIN_DIR="$(
  curl -fsSL https://raw.githubusercontent.com/cloudapp3/vmflow/main/install.sh \
    | bash -s -- --version v0.2.0-rc.4 --print-install-dir
)" \
  && [ -n "$VMFLOW_BIN_DIR" ] \
  && [ "${VMFLOW_BIN_DIR#/}" != "$VMFLOW_BIN_DIR" ] \
  && [ -x "$VMFLOW_BIN_DIR/vmflow" ] \
  && export PATH="$VMFLOW_BIN_DIR:$PATH"
```

Esse comando fixa a versão de pré-lançamento atual e exporta o diretório selecionado no PATH do shell atual. Omita `--version v0.2.0-rc.4` para seguir a versão estável mais recente. Atualmente, o instalador sem versão resolve para `v0.1.1`, que não inclui o MCP nem as políticas de Source IP documentadas aqui.

## Instalação no sistema

Instale em `/usr/local/bin` sem executar todo o script baixado como root:

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vmflow/main/install.sh \
  | bash -s -- --version v0.2.0-rc.4 --system
```

Quando um usuário sem privilégios solicita `--system`, o instalador valida o sudo antes do download e o usa apenas para verificar e gravar no destino. A nova configuração ao lado do binário pertence ao root e usa o modo `0600`; use os comandos de verificação e inicialização com root/sudo exibidos pelo instalador.

Para instalar outra release, altere a tag passada para `--version`:

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vmflow/main/install.sh | bash -s -- --version v0.2.0-rc.4
```

### Opções do instalador

| Opção | Descrição |
| --- | --- |
| `--version <tag>` | Instala uma tag de release específica. O padrão é a versão estável mais recente. |
| `--dir <path>` | Usa um diretório explícito; também disponível por `VMFLOW_INSTALL_DIR`. |
| `--system` | Instala no sistema em `/usr/local/bin`, usando sudo apenas quando necessário. |
| `--skip-verify` | Ignora a verificação de checksum SHA-256. |
| `--no-modify-path` | Não adiciona o diretório de usuário selecionado automaticamente a um arquivo de inicialização do shell. |
| `--print-install-dir` | Após uma instalação bem-sucedida, imprime apenas o diretório selecionado em stdout. |
| `--uninstall` | Desinstala via `vmflow uninstall` quando disponível e usa um fallback do shell para binários antigos ou ausentes. |
| `-h, --help` | Exibe a ajuda. |

### Diretório e PATH

Sem `--dir`, o instalador primeiro reutiliza uma instalação convencional existente do vmflow que tenha uma configuração ao lado do binário. Uma nova instalação root usa `/usr/local/bin`. Para um usuário sem privilégios, ele prefere `~/.local/bin` ou `~/bin` quando já estão no PATH e, caso contrário, usa `~/.local/bin`.

Em uma instalação automática de usuário, o instalador adiciona quando necessário um único bloco PATH idempotente a `.zshrc`, `.bashrc` ou `.profile` e mostra o comando exato para recarregá-lo. Ele não pode alterar o shell atual; por isso, o comando recomendado captura `--print-install-dir` e o exporta imediatamente. Um `--dir` explícito ou `VMFLOW_INSTALL_DIR` nunca altera arquivos de inicialização do shell.

### Configuração e compatibilidade de archives

O instalador baixa um archive do GitHub Release e verifica o `checksums.txt` com SHA-256 por padrão. Ele aceita tanto o `config.yaml` atual na raiz quanto o layout legado `examples/config.yaml`. A primeira instalação cria `config.yaml` ao lado do binário com modo `0600`; atualizações substituem apenas o binário e preservam a configuração e as regras de encaminhamento.

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

## Atualizar o vmflow

Depois de instalado a partir de uma release com tag (v0.1.1 ou posterior), o `vmflow` consegue se autoatualizar:

```bash
vmflow update --check            # check for a newer release
vmflow update                    # install the newest release
vmflow update --version v0.2.0-rc.4 # instalar este pré-lançamento
```

Consulte [`vmflow update`](./update) para detalhes, flags e notas por plataforma.

## Desinstalar uma cópia gerenciada pelo instalador

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vmflow/main/install.sh \
  | bash -s -- --uninstall
```

Após a remoção bem-sucedida do binário, o comando também remove o bloco PATH exato criado pelo instalador. Use `sudo bash -s -- --uninstall` apenas para uma instalação do sistema pertencente ao root. Consulte [`vmflow uninstall`](./uninstall) para o escopo da limpeza e as regras de preservação.
