---
title: HTTP API
description: HTTP API somente leitura e endpoints WebSocket expostos pelo painel web do vminfo.
---

# HTTP API

O `vminfo --web` inicia uma HTTP API leve e somente leitura e um painel.

## Iniciar o servidor

```bash
vminfo --web
```

Endereço padrão:

```text
http://127.0.0.1:20021
```

Endereço personalizado:

```bash
vminfo --web --bind 0.0.0.0 --port 8080 --interval 1s
```

## Autenticação

Por padrão, o painel e a API são locais e sem autenticação.

Quando `--token` está habilitado:

```bash
vminfo --web --token
vminfo --web --token my-secret
```

- `--token` sem argumento gera automaticamente um token seguro para URL
- `--token my-secret` usa um token fixo
- a primeira visita bem-sucedida a `/?token=...` define um cookie para as requisições posteriores
- `/healthz` continua público
- `/`, `/api/v1/*` e `/ws` exigem o token ou o cookie de autenticação
- o modo protegido por token não expõe um `Access-Control-Allow-Origin: *` permissivo
- as requisições WebSocket devem usar a mesma origem do navegador que o host do painel

## Endpoints

### `GET /healthz`

Verificação de estado pública do processo web.

```json
{
  "status": "ok",
  "ws_clients": 0
}
```

### `GET /api/v1/snapshot`

Retorna o instantâneo completo atual do painel.

```json
{
  "timestamp": "2026-06-14T12:00:00Z",
  "system": {},
  "cpu": {},
  "memory": {},
  "disk": {},
  "network": {},
  "load": {},
  "processes": {},
  "health": {}
}
```

### `GET /api/v1/cpu`

Retorna os totais de CPU, o uso por núcleo e um histórico curto de CPU em memória.

### `GET /api/v1/memory`

Retorna os totais de memória e swap, o uso, a disponibilidade e as porcentagens.

### `GET /api/v1/disk`

Retorna o uso do sistema de arquivos e as taxas de E/S de disco.

### `GET /api/v1/network`

Retorna a taxa de transferência de rede, as contagens de conexões TCP/UDP e os contadores de interfaces.

No Linux, a resposta também inclui a distribuição de estados TCP (quantos sockets estão em `ESTABLISHED`, `TIME_WAIT`, `SYN_RECV`, …) e o uso de conntrack (entradas `nf_conntrack` atuais vs. máx.), de modo que você possa detectar a saturação de sockets ou do rastreamento de conexões.

### `GET /api/v1/processes`

Retorna a lista de processos enriquecida.

Parâmetros de consulta suportados:

| Parâmetro | Descrição |
| --- | --- |
| `filter` | Correspondência sem distinção entre maiúsculas e minúsculas com PID, PPID, nome, comando, usuário ou estado |
| `q` | Alias para `filter` |
| `sort` | `cpu`, `mem`, `pid` ou `name`; o padrão é `cpu` |
| `limit` | Número máximo de linhas retornadas; `0` ou omitido significa sem limite |

Exemplo:

```bash
curl 'http://127.0.0.1:20021/api/v1/processes?filter=ssh&sort=mem&limit=10'
```

Formato da resposta:

```json
{
  "total": 128,
  "list": [
    {
      "pid": 1234,
      "ppid": 1,
      "name": "sshd",
      "user": "root",
      "cpu_percent": 0.1,
      "mem_percent": 0.2,
      "rss": 12345678,
      "status": "S",
      "command": "sshd: user@pts/0",
      "threads": 1,
      "nice": 0,
      "uptime": 3600,
      "started_at_unix": 1781434800
    }
  ]
}
```

### `GET /api/v1/system`

Retorna metadados do host, SO/kernel/arquitetura, modelo/núcleos de CPU e tempo de atividade.

### `GET /api/v1/health`

Retorna a pontuação de saúde leve e os avisos usados pelo painel.

```json
{
  "score": 90,
  "warnings": [
    {
      "level": "warning",
      "code": "disk_high",
      "message": "disk usage is 88.5%"
    }
  ]
}
```

O campo `code` identifica o aviso. Os códigos relacionados à rede incluem:

| Código | Significado |
| --- | --- |
| `network_errors` | Taxa de erros sustentada por interface (eventos/s, não contadores acumulados) |
| `network_drops` | Taxa sustentada de pacotes descartados por interface |
| `tcpconn_high` | Número de sockets TCP excepcionalmente alto (≥5000 aviso / ≥20000 crítico) |
| `conntrack_high` | Tabela de conntrack se enchendo (≥85% aviso / ≥95% crítico, Linux) |

O que dispara `network_errors` / `network_drops` são taxas, não contadores brutos, de modo que um total acumulado por muito tempo não mantém marcado um host que, de resto, está saudável.

### `POST /api/v1/net/diag`

Executa um diagnóstico de rede sob demanda — as mesmas sondas do [`comando net`](/pt-BR/net), invocável a partir do painel. Ele está montado no mux protegido, de modo que, quando a autenticação por token está habilitada, ele herda as verificações de token / cookie e de mesma origem como as outras rotas `/api/v1/*`.

Corpo da requisição:

| Campo | Descrição |
| --- | --- |
| `action` | `dns`, `port`, `ping` ou `ip` |
| `target` | Domínio (dns) ou host (port/ping); obrigatório. Para `ip`, o IP a consultar ou vazio para o seu próprio IP público |
| `port` | Porta de destino (ações port / ping) |
| `server` | Servidor DNS opcional (dns) ou URL base do serviço de consulta de IP (ip) |
| `timeout_ms` | Tempo limite por sondagem em milissegundos (port / ping) |
| `count` | Número de sondagens (ping) |
| `mode` | Modo de ping: `tcp` (padrão) ou `icmp` |

Exemplo:

```bash
curl -X POST http://127.0.0.1:20021/api/v1/net/diag \
  -H 'Content-Type: application/json' \
  -d '{"action":"ping","target":"example.com","port":443,"count":4,"mode":"tcp"}'
```

O formato da resposta corresponde ao resultado JSON correspondente da CLI (`DNSResult`, `PortResult`, `PingResult` ou `IPInfo`).

### `GET /ws`

Fluxo WebSocket de instantâneos completos do painel.

- envia o instantâneo mais recente imediatamente após a conexão
- transmite instantâneos atualizados conforme o coletor é atualizado
- no modo protegido por token, a requisição deve ser autenticada e passar nas verificações de mesma origem

## Veja também

- [Guia do painel web](/pt-BR/web-dashboard)
- [Referência de comandos](/pt-BR/commands)
