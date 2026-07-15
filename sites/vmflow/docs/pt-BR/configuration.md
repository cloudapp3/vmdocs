---
title: Configuração
description: Referência YAML do vmflow para gerenciamento local, logs, autenticação, estatísticas e regras.
---

# Configuração

O vmflow é controlado por um único arquivo YAML. Passe-o ao daemon com `-config`:

```bash
vmflow -config ./examples/config.yaml
```

Um reload relê este arquivo e aplica o novo estado desejado (veja [Regras e Ciclo de Vida](./rules)).

## Exemplo completo

```yaml
version: 1
control_port: 19090

log:
  level: info
  format: text # text or json

# O gerenciamento sempre usa 127.0.0.1; configure somente a porta.
# The CLI/TUI can pass the token with -token or VMFLOW_CONTROL_TOKEN.
auth:
  enabled: false
  tokens:
    - name: admin
      token: change-me
      role: admin

rules:
  - rule_id: ssh-forward
    name: ssh-forward
    protocol: tcp
    listen_addr: 0.0.0.0
    listen_port: 2201
    target_addr: 127.0.0.1
    target_port: 22
    enabled: true
    speed_limit: 0
    max_conn: 0
    remark: example
```

## Campos de nível superior

| Campo | Descrição |
| --- | --- |
| `version` | Versão do esquema de configuração. Atualmente `1`. |
| `control_port` | Porta de gerenciamento local. Padrão `19090`; o host é sempre `127.0.0.1`. |
| `log` | Logging estruturado — `level` e `format`. |
| `auth` | Autenticação por bearer-token com papéis `admin` / `viewer`. |
| `bot_token`, `bot_chat` | Bot do Telegram — veja [Bot do Telegram](./telegram-bot). |
| `rules` | Regras de encaminhamento (veja `rules[]` abaixo). |

## `log`

| Campo | Valores |
| --- | --- |
| `level` | Nível de log (ex. `debug`, `info`, `warn`, `error`). |
| `format` | `text` ou `json`. |

## `auth`

Autenticação Bearer token para gerenciamento via CLI/TUI.

| Campo | Descrição |
| --- | --- |
| `enabled` | Exige tokens configurados para as ferramentas locais de gerenciamento. |
| `tokens[].name` | Rótulo para o token (não usado para autenticação). |
| `tokens[].token` | A string do bearer token. |
| `tokens[].role` | `admin` (leitura + escrita) ou `viewer` (somente leitura). |

## `rules[]`

Cada entrada descreve uma regra de encaminhamento.

| Campo | Descrição |
| --- | --- |
| `rule_id` | ID único e estável, usado para diff entre reloads. |
| `name` | Nome legível por humanos. |
| `protocol` | `tcp`, `udp` ou `tcp+udp`. |
| `listen_addr` | Endereço para escutar (ex. `0.0.0.0`). |
| `listen_port` | Porta para escutar. |
| `target_addr` | Endereço de upstream para encaminhar. |
| `target_port` | Porta de upstream. |
| `enabled` | Se `false`, a regra é mantida na configuração, mas não é iniciada. |
| `speed_limit` | Limite de taxa por conexão em bytes/seg (`0` = ilimitado). |
| `max_conn` | Máximo de conexões concorrentes (`0` = ilimitado). Novas conexões acima do limite são fechadas. |
| `idle_timeout` | Timeout de inatividade por conexão em segundos (`0` = padrão de 5 minutos). Alterá-lo reinicia a regra. |
| `remark` | Nota de formato livre. |

::: tip
Os protocolos `http` e `https` existem no código-fonte, mas estão desabilitados no build atual. Eles são rejeitados pela validação. Veja a [referência de encaminhamento](./forwarding).
:::

## Outros campos

Além disso, a configuração aceita campos do bot do Telegram e campos reservados de ACME/certificados. Consulte [Telegram Bot](./telegram-bot) para os campos ativos.

| Campo | Status |
| --- | --- |
| `bot_token`, `bot_chat` | Ativo — veja [Bot do Telegram](./telegram-bot). |
| `acme_*`, `cert_cache_dir`, `cert_review.*` | Reservado (ignorado no build atual). |
