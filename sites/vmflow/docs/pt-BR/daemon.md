---
title: vmflow daemon
description: Executa o daemon de encaminhamento do vmflow — caminho da configuração, endereço de escuta do controle e flags de segurança na inicialização.
---

# vmflow daemon

```bash
vmflow daemon -config ./examples/config.yaml [-control-listen 127.0.0.1:19090]
```

Alias: `vmflow d`.

O daemon carrega o arquivo de configuração, inicia a control API e aplica as regras como um snapshot. Em seguida, ele continua em execução até ser interrompido (`SIGINT` / `SIGTERM`, que também é como o systemd e o launchd o interrompem).

## Flags

| Flag | Padrão | Descrição |
| --- | --- | --- |
| `-config` | _(obrigatório)_ | Caminho para o arquivo de configuração YAML. |
| `-control-listen` | _(da configuração)_ | Sobrescreve o endereço de escuta da control API (`control_listen_addr` na configuração, cujo padrão é `127.0.0.1:19090`). |
| `-insecure-allow-remote-control` | `false` | **Perigoso:** permite vincular a control API a um endereço que não seja de loopback sem autenticação. Consulte [Implantação](./deployment). |
| `-log-file` | _(stdout)_ | Grava os logs neste arquivo em vez do stdout (útil sob um gerenciador de serviços; obrigatório no Windows). |

## Segurança na inicialização {#startup-safety}

O daemon se recusa a iniciar quando a control API está vinculada a um endereço que não seja de loopback (`0.0.0.0`, `::`, um IP que não seja de loopback ou `:port`) sem autenticação, pois isso exporia um endpoint de controle remoto sem autenticação. Para iniciar mesmo assim, faça uma destas opções:

- vincular a `127.0.0.1` (o padrão),
- habilitar `auth` na configuração,
- habilitar mTLS (`control_tls.client_ca_file`) ou
- passar `-insecure-allow-remote-control` para reconhecer o risco.

## Comportamento em execução

- Na inicialização, as regras são aplicadas via snapshot (`ReplaceAll`). Consulte [Regras e Ciclo de Vida](./rules).
- A control API expõe [health, rules, stats, precheck, reload, metrics](./api).
- `POST /v1/reload` (ou `vmflow ctl reload`) relê a configuração e a reaplica após o [precheck](./precheck).
- Para executar como um serviço gerenciado de inicialização no boot, consulte [`vmflow service`](./service).
