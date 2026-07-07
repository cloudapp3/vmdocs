---
title: net
description: "Diagnóstico de rede sob demanda: resolução DNS, sondagem de porta TCP, ping e consulta geográfica de IP pública."
---

# `vminfo net`

Execute diagnósticos de rede pontuais a partir do mesmo binário que você já usa para as
métricas do host. Cada subcomando imprime por padrão uma saída legível por
humanos e aceita `--json` para scripts.

## Subcomandos

| Ação | O que faz |
| --- | --- |
| `net dns` | Resolve um domínio para endereços |
| `net port` | Testa a conectividade e a latência TCP para `host:port` |
| `net ping` | Sonda um host com RTTs de discagem TCP ou ICMP |
| `net ip` | Consulta o IP público + informações de ASN / geográficas |

## `net dns`

```bash
vminfo net dns example.com
vminfo net dns example.com --server 1.1.1.1
vminfo net dns example.com --server 1.1.1.1 --json
```

| Flag | Descrição |
| --- | --- |
| domínio posicional | O domínio a resolver (exatamente um) |
| `--server` | Servidor DNS como `host` ou `host:port`; vazio = padrão do sistema |
| `--json` | Escreve o resultado como JSON |

## `net port`

```bash
vminfo net port example.com 443
vminfo net port example.com 443 --timeout 3s --json
```

| Flag | Descrição |
| --- | --- |
| `host` / `port` | Host e porta de destino (1–65535) |
| `--timeout` | Tempo limite de conexão, padrão `2s` |
| `--json` | Escreve o resultado como JSON |

## `net ping`

```bash
vminfo net ping example.com                       # ping TCP, porta 80
vminfo net ping example.com --tcp-port 443        # ping TCP na 443
vminfo net ping example.com --mode icmp           # ping ICMP real (requer privilégios)
vminfo net ping example.com --count 6 --json
```

| Flag | Descrição |
| --- | --- |
| host posicional | O host a sondar (exatamente um) |
| `--mode` | `tcp` (padrão) ou `icmp` |
| `--count` | Número de sondas, padrão `4` |
| `--timeout` | Tempo limite por sonda, padrão `1s` |
| `--tcp-port` | Porta TCP de destino, padrão `80` (apenas modo tcp) |
| `--json` | Escreve o resultado como JSON |

::: tip TCP vs ICMP
O modo `tcp` mede RTTs por discagem TCP — é multiplataforma e não exige
privilégios, funcionando em qualquer lugar. O modo `icmp` envia pacotes reais de
ICMP Echo via `golang.org/x/net`; no Linux ele precisa de
`net.ipv4.ping_group_range` para conceder o socket UDP ICMP sem privilégios, e não
é compatível com o Windows. Se o ICMP estiver indisponível, alterne para `--mode tcp`.
:::

## `net ip`

```bash
vminfo net ip                       # seu próprio IP público + ASN / geo
vminfo net ip 8.8.8.8               # consulta um IP específico
vminfo net ip --json
```

| Flag | Descrição |
| --- | --- |
| ip posicional | IP opcional a consultar; omitido = seu próprio IP público |
| `--server` | URL base do serviço de consulta, padrão `https://ip.bestcheapvps.org` |
| `--json` | Escreve o resultado como JSON |

::: warning Requisição de saída
O `net ip` faz uma requisição explícita, acionada pelo usuário, a um serviço de
consulta de terceiros (`ip.bestcheapvps.org` por padrão) para obter ASN, dados
geográficos e marcadores de risco. Isso é indicado em `--help` e na saída do
comando. Nunca é executado automaticamente — apenas quando você o solicita.
:::

## Notas

- A saída legível por humanos é localizada; a saída JSON é estável e independente de idioma.
- Os resultados JSON refletem o tempo em `elapsed_ms` e expõem erros em um campo `error`.
- Esses diagnósticos também estão disponíveis no painel web por meio de
  [`POST /api/v1/net/diag`](/pt-BR/api#post-api-v1-net-diag).

## Exemplo

```bash
vminfo net ping example.com --tcp-port 443 --count 4 --json
```

## Relacionado

- [API HTTP](/pt-BR/api)
- [Painel web](/pt-BR/web-dashboard)
