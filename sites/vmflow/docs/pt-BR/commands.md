---
title: Referência de Comandos
description: Referência CLI do vmflow para foreground, ctl, tui, mcp, version, update, service e uninstall.
---

# Referência de Comandos

O vmflow é um único binário com execução foreground e sete subcomandos.

| Comando | Alias | Finalidade |
| --- | --- | --- |
| `vmflow` | - | Executa o runtime de encaminhamento em foreground. |
| [`ctl`](./ctl) | `c` | Consulta e controla um daemon em execução. |
| [`tui`](./tui) | `t` | Painel de terminal. |
| [`mcp`](./mcp) | - | Servidor MCP stdio somente leitura para um daemon local em execução. |
| [`version`](./version) | `v` | Exibe os metadados de build. |
| [`update`](./update) | `u` | Verifica ou instala uma versão mais recente. |
| [`service`](./service) | `svc` | Registra como um serviço nativo do SO (inicialização no boot). |
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
