---
title: Configuração
description: Referência de configuração YAML do vmflow — endereço de controle, TLS, logging, tokens de autenticação e regras de encaminhamento.
---

# Configuração

O vmflow é controlado por um único arquivo YAML. Passe-o ao daemon com `-config`:

```bash
vmflow daemon -config ./examples/config.yaml
```

Um reload relê este arquivo e aplica o novo estado desejado (veja [Regras e Ciclo de Vida](./rules)).

## Exemplo completo

```yaml
version: 1
control_listen_addr: 127.0.0.1:19090

log:
  level: info
  format: text # text or json

# Enable auth (or set control_tls.client_ca_file for mTLS) before exposing
# control_listen_addr outside localhost; otherwise the daemon refuses to start.
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
| `control_listen_addr` | Endereço de escuta da API de controle local. O padrão é `127.0.0.1:19090`; mantenha em loopback a menos que você habilite auth ou mTLS. |
| `control_tls` | TLS / mTLS opcional para a API de controle (veja `control_tls` abaixo). |
| `log` | Logging estruturado — `level` e `format`. |
| `auth` | Autenticação por bearer-token com papéis `admin` / `viewer`. |
| `bot_token`, `bot_chat` | Bot do Telegram — veja [Bot do Telegram](./telegram-bot). |
| `rules` | Regras de encaminhamento (veja `rules[]` abaixo). |

## `control_tls`

TLS (e TLS mútuo) opcional para a API de controle. O TLS fica ativo quando tanto `cert_file` quanto `key_file` estão definidos; definir `client_ca_file` habilita o TLS mútuo.

```yaml
control_tls:
  cert_file: /etc/vmflow/server.pem
  key_file: /etc/vmflow/server.key
  client_ca_file: /etc/vmflow/client-ca.pem   # optional → mTLS
  min_version: "1.2"                           # "1.2" (default) or "1.3"
```

| Campo | Descrição |
| --- | --- |
| `cert_file` | Caminho do certificado do servidor. |
| `key_file` | Caminho da chave do servidor. |
| `client_ca_file` | Bundle de CA para certificados de cliente. Definir isto habilita o **TLS mútuo** e satisfaz a verificação de segurança de inicialização fora de loopback. |
| `min_version` | `1.2` (padrão) ou `1.3`. |

Veja [API HTTP → TLS e TLS mútuo](./api#tls-and-mutual-tls). Os clientes usam `-tls-ca-file`, `-tls-client-cert`, `-tls-client-key` e `-tls-skip-verify` — veja [Flags comuns do cliente](./commands#common-client-flags).

## `log`

| Campo | Valores |
| --- | --- |
| `level` | Nível de log (ex. `debug`, `info`, `warn`, `error`). |
| `format` | `text` ou `json`. |

## `auth`

Autenticação por bearer-token para a API de controle. Veja [API HTTP](./api#authentication).

| Campo | Descrição |
| --- | --- |
| `enabled` | Quando `false`, a API de controle trata as requisições como um chamador anônimo de nível admin — seguro apenas em loopback. |
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

Além das seções acima, a configuração aceita campos de bot do Telegram e de ACME/certificado. Os campos de bot e o `control_tls` estão **ativos**; os campos de ACME/certificado são reservados para quando o suporte a HTTPS for reativado e são ignorados atualmente.

| Campo | Status |
| --- | --- |
| `control_tls` | Ativo — veja `control_tls` acima e [API HTTP](./api#tls-and-mutual-tls). |
| `bot_token`, `bot_chat` | Ativo — veja [Bot do Telegram](./telegram-bot). |
| `acme_*`, `cert_cache_dir`, `cert_review.*` | Reservado (ignorado no build atual). |
