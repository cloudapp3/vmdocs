---
title: Início Rápido
description: Instale o vmflow e execute sua primeira regra de encaminhamento TCP em dois minutos.
---

# Início Rápido

Este guia instala o pré-lançamento atual do vmflow com a configuração ao lado do binário, inicia o daemon e o consulta pela CLI.

## 1. Instalar

Instale o `v0.2.0-rc.4` para o shell atual (Linux/macOS):

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

Verifique:

```bash
vmflow version -json
```

Quando necessário, o instalador também configura o PATH para futuras sessões de shells compatíveis. Consulte [Instalação](./installation) para instalação no sistema com `--system`, seleção de diretório, verificação de checksum e compilação a partir do código-fonte.

## 2. Iniciar o daemon

Inicie o daemon com o `config.yaml` criado ao lado do binário instalado:

```bash
vmflow
```

A configuração ao lado do binário é o padrão do runtime. O exemplo SSH incluído está desabilitado e escuta em `127.0.0.1:2201`; revise a configuração antes de ativar a regra.

## 3. Consultá-lo

Em outro terminal, consulte o daemon local pela CLI incluída:

```bash
vmflow ctl rules
vmflow ctl stats
vmflow ctl metrics
vmflow ctl precheck
```

## 4. Abrir a interface de terminal

```bash
vmflow tui
```

Pressione <kbd>Tab</kbd> para alternar entre as visualizações Dashboard, Rules e Detail. Consulte [Dashboard da TUI](./tui-guide).

## 5. Recarregar após editar a configuração

Abra a configuração ao lado do binário resolvido e aplique o novo estado desejado:

```bash
VMFLOW_CONFIG="$(dirname "$(command -v vmflow)")/config.yaml"
"${EDITOR:-vi}" "$VMFLOW_CONFIG"
vmflow ctl reload
```

O reload executa o [precheck](./precheck) primeiro; se houver erros, a alteração é rejeitada e as regras em execução permanecem intactas.

## Próximos passos

- [Configuração](./configuration) — todos os campos YAML explicados
- [Engine de Encaminhamento](./forwarding) — protocolos, limites de velocidade, limites de conexões
- [Regras e Ciclo de Vida](./rules) — aplicação de snapshot e diff incremental
- [`vmflow service install`](./service) — execute o vmflow como um serviço nativo de inicialização no boot (systemd / launchd / Windows Service)
- [`vmflow uninstall`](./uninstall) — desmontagem com um único comando (serviço, binário, configuração, logs, certificados)
