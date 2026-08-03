---
title: Referência de Comandos
description: Referência CLI do vmflow para foreground, ctl, tui, mcp, version, update, service e uninstall.
---

# Referência de Comandos

O vmflow é um único binário com comandos de configuração inicial, foreground explícito, estado, gerenciamento, serviço e manutenção.

| Comando | Alias | Finalidade |
| --- | --- | --- |
| `vmflow` | - | Exibe status de config/daemon e o próximo passo. |
| `vmflow init` | - | Escolhe idioma e modo, criando a primeira regra validada e credenciais locais. |
| [`vmflow run`](./daemon) | - | Executa o encaminhamento em foreground com o config de usuário da plataforma. |
| `vmflow status` | - | Inspeciona caminho config, regras, daemon e serviço nativo; aceita `-json`. |
| [`ctl`](./ctl) | `c` | Consulta e controla um daemon em execução. |
| [`tui`](./tui) | `t` | Painel de terminal. |
| [`mcp`](./mcp) | - | Servidor MCP stdio somente leitura para um daemon local em execução. |
| [`version`](./version) | `v` | Exibe os metadados de build. |
| [`update`](./update) | `u` | Verifica ou instala uma versão mais recente. |
| [`service`](./service) | `svc` | Instala, inicia, inspeciona ou desinstala o serviço nativo. |
| [`uninstall`](./uninstall) | `remove`, `rm` | Desinstalação com um comando e limpeza. |

## Flags comuns de gerenciamento {#common-client-flags}

Os comandos `ctl`, `tui` e `mcp` se conectam ao daemon local.

| Flag | Variável | Padrão | Descrição |
| --- | --- | --- | --- |
| `-token` | `VMFLOW_CONTROL_TOKEN` | _(nenhum)_ | Bearer token quando a autenticação está habilitada. |

Para gerenciamento remoto, use o túnel SSH descrito em [Gerenciamento local](./api).

## Observações

- Os binários separados mais antigos `relayd`, `relayctl` e `relaytui` ainda podem ser compilados por compatibilidade — são wrappers finos sobre os mesmos pacotes e leem a mesma variável de ambiente `VMFLOW_CONTROL_TOKEN` — mas os releases preferem o binário unificado `vmflow`.
- Os comandos de túnel (`tunnel-server`, `tunnel-client`, `tunnel-ctl`) e os comandos de certificado (`certs`, `certs-obtain`, `certs-review`) **não estão habilitados** no build atual.
