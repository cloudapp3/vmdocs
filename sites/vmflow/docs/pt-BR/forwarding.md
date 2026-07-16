---
title: Engine de Encaminhamento
description: Como o vmflow encaminha tráfego TCP, UDP e tcp+udp, com admissão por IP de origem, limite de velocidade, limite de conexões e contadores por regra.
---

# Engine de Encaminhamento

O pacote `engine/` é o núcleo puro de encaminhamento. Ele é dono de listeners, loops de proxy, sessões, contadores e do ciclo de vida das regras — e nada mais. Ele não depende de um banco de dados, de um control plane ou de uma UI. Isso o mantém embutível.

## Protocolos

Cada regra escolhe um protocolo por meio do campo `protocol`.

| Protocolo | Comportamento |
| --- | --- |
| `tcp` | Encaminhamento de porta TCP. |
| `udp` | Encaminhamento de porta UDP. |
| `tcp+udp` | Encaminha tanto TCP quanto UDP na mesma porta a partir de uma única regra. |
| `http` | Forward proxy HTTP (plain + `CONNECT`). **Desativado no build atual.** |
| `https` | Forward com término de TLS com certificados por domínio. **Desativado no build atual.** |

`http` e `https` existem no código-fonte (`engine/https.go`, `engine/proxy.go`) junto aos pacotes ACME/certstore, mas o build atual os rejeita na validação e não conecta o gerenciamento de certificados. Eles estão reservados para reativação futura.

## Controles por regra

Cada regra carrega controles de tempo de execução independentes do protocolo:

- **`speed_limit`** — limite de taxa bidirecional por conexão (token bucket), em bytes/seg. `0` significa ilimitado. Isso é intencionalmente simples e por sessão; não é um bucket global de largura de banda compartilhado.
- **`max_conn`** — limite de conexões simultâneas. Quando o limite é atingido, novas conexões são fechadas imediatamente. `0` significa ilimitado.
- **`idle_timeout`** — tempo limite de ociosidade por conexão em segundos. `0` significa usar o padrão (5 minutos / 300s). Alterá-lo reinicia a regra.
- **`source_ip_mode` / `source_ips`** — `off`, uma lista de permissão IPv4/IPv6 ou uma lista de bloqueio IPv4/IPv6. As entradas podem ser endereços literais ou CIDRs, até 256 por regra.
- **`enabled`** — uma regra desativada é mantida na configuração (e nos snapshots), mas não é iniciada.

## Admissão por IP de origem

O TCP avalia o peer do socket após `Accept`, mas antes de reservar uma vaga de conexão ou conectar ao destino. O UDP avalia o datagrama de origem antes de criar uma sessão ou consumir os limites de sessões UDP. O tráfego rejeitado não consome capacidade de encaminhamento.

Alterar a política efetiva de origem reinicia a regra e fecha conexões TCP e sessões UDP existentes. Apenas reordenar CIDRs equivalentes não causa reinício. A política usa somente o peer do socket: o vmflow não confia em cabeçalhos HTTP encaminhados nem em metadados de PROXY protocol, e NAT ou proxies L4 upstream podem ocultar o endereço do cliente original.

## Contadores de tráfego

Toda regra em execução relata contadores em tempo real:

- contagem de conexões atuais
- total de bytes de upload
- total de bytes de download
- total de rejeições por IP de origem (tentativas de conexão TCP ou datagramas UDP)

Consulte os contadores com `vmflow ctl stats` ou pela TUI. As rejeições da política de origem também são exportadas como `vmflow_rule_source_ip_denied_total`. Quando a persistência de estatísticas está habilitada, esse total sobrevive a reinicializações do daemon. Em UDP, a contagem de conexões é uma aproximação das sessões.

## Equivalência de regras

As regras carregam tanto campos de tempo de execução (protocolo, endereços, portas, limites, `idle_timeout`, política de IP de origem) quanto metadados (`remark`, `revision`, timestamps). A engine compara apenas os campos de tempo de execução ao fazer o diff de um novo snapshot em relação ao estado ativo, então edições cosméticas não causam reinícios desnecessários — mas alterar `idle_timeout` ou a política efetiva de origem dispara um reinício. Consulte [Regras e Ciclo de Vida](./rules).
