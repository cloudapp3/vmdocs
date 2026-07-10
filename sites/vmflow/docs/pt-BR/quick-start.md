---
title: Início Rápido
description: Instale o vmflow e execute sua primeira regra de encaminhamento TCP em dois minutos.
---

# Início Rápido

Este guia instala o binário `vmflow`, inicia o daemon com uma configuração de exemplo e o consulta a partir da CLI.

## 1. Instalar

Instale o binário pré-compilado mais recente (Linux/macOS):

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vmflow/main/install.sh | bash
```

Prefere uma instalação global:

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vmflow/main/install.sh | sudo bash -s -- --dir /usr/local/bin
```

Verifique:

```bash
vmflow version
```

Consulte [Instalação](./installation) para `--version`, verificação de checksum e compilação a partir do código-fonte.

## 2. Iniciar o daemon

Pegue a configuração de exemplo e inicie o daemon:

```bash
vmflow daemon -config ./examples/config.yaml
```

O exemplo encaminha TCP `0.0.0.0:2201` para `127.0.0.1:22` (SSH).

## 3. Consultá-lo

A partir de outro terminal, aponte a CLI para a API de controle local (padrão `127.0.0.1:19090`):

```bash
vmflow ctl health
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

Edite `examples/config.yaml` e aplique o novo estado desejado:

```bash
vmflow ctl reload
```

O reload executa o [precheck](./precheck) primeiro; se houver erros, a alteração é rejeitada e as regras em execução permanecem intactas.

## Próximos passos

- [Configuração](./configuration) — todos os campos YAML explicados
- [Engine de Encaminhamento](./forwarding) — protocolos, limites de velocidade, limites de conexões
- [Regras e Ciclo de Vida](./rules) — aplicação de snapshot e diff incremental
- [`vmflow service install`](./service) — execute o vmflow como um serviço nativo de inicialização no boot (systemd / launchd / Windows Service)
- [`vmflow uninstall`](./uninstall) — desmontagem com um único comando (serviço, binário, configuração, logs, certificados)
