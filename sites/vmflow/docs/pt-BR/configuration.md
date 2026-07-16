---
title: Configuração
description: Referência YAML do vmflow para gerenciamento local, logs, autenticação, estatísticas, regras de encaminhamento e políticas de acesso por IP de origem.
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
    source_ip_mode: allowlist
    source_ips:
      - 203.0.113.8
      - 198.51.100.0/24
      - 2001:db8:100::/48
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
| `source_ip_mode` | Modo de admissão por IP de origem: `off`, `allowlist` ou `denylist`. Se omitido, usa `off`. |
| `source_ips` | Endereços IPv4/IPv6 literais ou CIDRs usados pelo modo selecionado. Máximo de 256 entradas por regra. |
| `remark` | Nota de formato livre. |

## Política de acesso por IP de origem

`allowlist` aceita somente origens que correspondam a `source_ips`. `denylist` rejeita as origens correspondentes e aceita as demais. Uma lista de permissão ou bloqueio ativa deve conter pelo menos uma entrada; nomes de host, endereços inválidos, entradas vazias e listas com mais de 256 entradas são rejeitados.

O TCP verifica o peer do socket antes de consumir `max_conn` ou conectar ao destino. O UDP verifica antes de criar uma sessão ou consumir os limites de sessões UDP da regra ou globais. Alterar o modo ou o conjunto efetivo de entradas reinicia a regra e fecha conexões TCP e sessões UDP existentes, aplicando a nova política imediatamente.

A política vê o peer real do socket. Atrás de NAT ou proxy L4, ele pode ser o endereço do gateway ou do proxy, e não o do cliente original. O vmflow não confia em cabeçalhos HTTP encaminhados nem em metadados de PROXY protocol. Use um firewall de nuvem, security group ou firewall do host como primeira camada contra ataques de alto volume.

::: tip
Os protocolos `http` e `https` existem no código-fonte, mas estão desabilitados no build atual. Eles são rejeitados pela validação. Veja a [referência de encaminhamento](./forwarding).
:::

## Outros campos

Além disso, a configuração aceita campos do bot do Telegram e campos reservados de ACME/certificados. Consulte [Telegram Bot](./telegram-bot) para os campos ativos.

| Campo | Status |
| --- | --- |
| `bot_token`, `bot_chat` | Ativo — veja [Bot do Telegram](./telegram-bot). |
| `acme_*`, `cert_cache_dir`, `cert_review.*` | Reservado (ignorado no build atual). |
