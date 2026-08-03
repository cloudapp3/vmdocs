---
title: Início Rápido
description: Instale o vmflow e execute sua primeira regra de encaminhamento TCP em dois minutos.
---

# Início Rápido

Este guia instala o vmflow v0.3.0 estável, cria a primeira regra validada com `vmflow init` e consulta o daemon em execução pela CLI.

## 1. Instalar

Instale o `v0.3.0` para o shell atual (Linux/macOS):

```bash
VMFLOW_BIN_DIR="$(
  curl -fsSL https://raw.githubusercontent.com/cloudapp3/vmflow/main/install.sh \
    | bash -s -- --version v0.3.0 --print-install-dir
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

## 2. Inicializar o vmflow

Execute o assistente de primeiro uso:

```bash
vmflow init
```

O idioma é a primeira escolha: `1` seleciona English e `2` chinês simplificado. Depois escolha o serviço nativo recomendado, modo foreground no terminal atual ou salvar sem iniciar. O assistente cria uma regra validada, ativa o gerenciamento local autenticado e grava o config system/user correto para o modo escolhido.

O modo serviço instala, habilita e já inicia o vmflow, portanto não inicie um segundo processo foreground. O modo foreground também já está em execução e permanece ligado ao terminal atual. Execute `vmflow run` mais tarde somente se você salvou sem iniciar.

## 3. Consultá-lo

Em outro terminal, consulte o daemon local pela CLI incluída:

```bash
vmflow ctl rules
vmflow ctl stats
vmflow ctl metrics
vmflow ctl precheck
```

## 4. Abrir a interface de terminal

Para o serviço nativo do sistema, use o comando padrão. Primeiro ele verifica se o serviço local está instalado e em execução:

```bash
vmflow tui
```

No modo foreground, mantenha o terminal do daemon aberto e informe explicitamente o endereço do processo iniciado manualmente:

```bash
vmflow tui -addr http://127.0.0.1:19090
```

Um `-addr` explícito ignora a verificação do serviço nativo. Pressione <kbd>Tab</kbd> para alternar entre as visualizações Dashboard, Rules e Detail. Consulte [Dashboard da TUI](./tui-guide).

## 5. Recarregar após editar a configuração

Consulte o caminho ativo com `vmflow status`, edite esse arquivo e aplique o novo estado:

```bash
vmflow status
vmflow ctl reload
```

O reload executa o [precheck](./precheck) primeiro; se houver erros, a alteração é rejeitada e as regras em execução permanecem intactas.

## Próximos passos

- [Configuração](./configuration) — todos os campos YAML explicados
- [Engine de Encaminhamento](./forwarding) — protocolos, bandwidth compartilhado, cotas diárias/mensais e limites de conexões
- [Regras e Ciclo de Vida](./rules) — aplicação de snapshot e diff incremental
- [`vmflow service install`](./service) — execute o vmflow como um serviço nativo de inicialização no boot (systemd / launchd / Windows Service)
- [`vmflow uninstall`](./uninstall) — desmontagem com um único comando (serviço, binário, configuração, logs, certificados)
