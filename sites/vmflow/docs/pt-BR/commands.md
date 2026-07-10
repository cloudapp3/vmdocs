---
title: Referência de Comandos
description: Referência da CLI do vmflow — subcomandos daemon, ctl, tui, version, update, service, uninstall e seus aliases.
---

# Referência de Comandos

O vmflow é um único binário com sete subcomandos. Os aliases são exibidos na tabela abaixo.

| Comando | Alias | Finalidade |
| --- | --- | --- |
| [`daemon`](./daemon) | `d` | Executa o daemon de encaminhamento. |
| [`ctl`](./ctl) | `c` | Consulta e controla um daemon em execução. |
| [`tui`](./tui) | `t` | Painel de terminal. |
| [`version`](./version) | `v` | Exibe os metadados de build. |
| [`update`](./update) | `u` | Verifica ou instala uma versão mais recente. |
| [`service`](./service) | `svc` | Registra como um serviço nativo do SO (inicialização no boot). |
| [`uninstall`](./uninstall) | `remove`, `rm` | Desinstalação com um comando e limpeza. |

## Flags comuns de cliente {#common-client-flags}

`ctl` e `tui` são clientes da [control API](./api) e compartilham estas flags:

| Flag | Variável de ambiente | Padrão | Descrição |
| --- | --- | --- | --- |
| `-addr` | _(nenhuma)_ | `http://127.0.0.1:19090` | URL base da control API. |
| `-token` | `VMFLOW_CONTROL_TOKEN` | _(nenhum)_ | Token bearer quando a autenticação está habilitada. |
| `-tls-ca-file` | `VMFLOW_TLS_CA_FILE` | _(nenhuma)_ | Pacote de CA para verificar o certificado do servidor da control API (CAs privadas/autossinadas). |
| `-tls-client-cert` | `VMFLOW_TLS_CLIENT_CERT` | _(nenhum)_ | Certificado de cliente para mTLS (obrigatório quando o servidor define `control_tls.client_ca_file`). |
| `-tls-client-key` | `VMFLOW_TLS_CLIENT_KEY` | _(nenhuma)_ | Chave de cliente para mTLS (usada com `-tls-client-cert`). |
| `-tls-skip-verify` | `VMFLOW_TLS_INSECURE` (`1`/`true`) | `false` | Ignora a verificação do certificado do servidor (perigoso, apenas para debug). |
| `-H` / `--header` | `VMFLOW_HEADERS` (separado por `;`) | _(nenhum)_ | Cabeçalho de requisição extra no formato `Name: Value` (repetível). |

## Observações

- Os binários separados mais antigos `relayd`, `relayctl` e `relaytui` ainda podem ser compilados por compatibilidade — são wrappers finos sobre os mesmos pacotes e leem a mesma variável de ambiente `VMFLOW_CONTROL_TOKEN` — mas os releases preferem o binário unificado `vmflow`.
- Os comandos de túnel (`tunnel-server`, `tunnel-client`, `tunnel-ctl`) e os comandos de certificado (`certs`, `certs-obtain`, `certs-review`) **não estão habilitados** no build atual.
