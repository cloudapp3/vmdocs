---
title: vmflow
description: Referência CLI do vmflow para foreground, ctl, tui, version, update, service e uninstall.
---

# vmflow

```bash
vmflow -config ./examples/config.yaml [-control-port 19090]
```

O modo foreground carrega a configuração, inicia o canal interno somente no loopback, aplica o snapshot de regras e roda até `SIGINT` ou `SIGTERM`.

## Flags

| Flag | Padrão | Descrição |
| --- | --- | --- |
| `-config` | _(obrigatório)_ | Caminho para o arquivo de configuração YAML. |
| `-control-port` | _(da configuração)_ | Sobrescreve a porta de gerenciamento loopback. |
| `-log-file` | _(stdout)_ | Grava os logs neste arquivo em vez do stdout (útil sob um gerenciador de serviços; obrigatório no Windows). |

## Comportamento em execução

- Na inicialização, as regras são aplicadas via snapshot (`ReplaceAll`). Consulte [Regras e Ciclo de Vida](./rules).
- `vmflow ctl` e `vmflow tui` são as interfaces de gerenciamento suportadas.

- Para executar como um serviço gerenciado de inicialização no boot, consulte [`vmflow service`](./service).
