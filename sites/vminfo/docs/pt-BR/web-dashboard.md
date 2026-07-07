---
title: Painel web
description: Inicie a HTTP API somente leitura e o painel no navegador, incluindo autenticação por token e acesso via WebSocket.
---

# Painel web

O `vminfo --web` inicia uma HTTP API leve e somente leitura e um painel com temas intercambiáveis.

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

Você também pode iniciar o TUI junto com o painel:

```bash
vminfo --web --tui
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
- `/healthz` continua público para verificações locais
- `/`, `/api/v1/*` e `/ws` exigem o token ou o cookie de autenticação
- o modo protegido por token não expõe um `Access-Control-Allow-Origin: *` permissivo
- os upgrades de WebSocket exigem que a origem do navegador corresponda ao host do painel

::: warning Acesso remoto
Ao vincular a `0.0.0.0`, habilite o `--token`, a menos que o painel seja exposto apenas a uma rede privada confiável.
:::

## Endpoints

| Endpoint | Finalidade |
| --- | --- |
| `GET /healthz` | Verificação de estado pública |
| `GET /api/v1/snapshot` | Instantâneo completo do tempo de execução |
| `GET /api/v1/cpu` | Dados de CPU |
| `GET /api/v1/memory` | Dados de memória e swap |
| `GET /api/v1/disk` | Dados do sistema de arquivos e de E/S de disco |
| `GET /api/v1/network` | Totais de rede e dados de interface |
| `GET /api/v1/processes` | Lista de processos |
| `GET /api/v1/system` | Metadados do host |
| `GET /api/v1/health` | Pontuação de saúde e avisos |
| `POST /api/v1/net/diag` | Executa um diagnóstico de rede (dns / port / ping / ip) |
| `GET /ws` | Fluxo de instantâneos em tempo real |

Consulte a [referência completa da HTTP API](/pt-BR/api) para obter exemplos de payload e parâmetros de consulta.

## Temas

O painel vem com temas intercambiáveis no cabeçalho: **Automático**, **Neon**, **Claro**, **Terminal** e **Synthwave**. "Automático" segue o esquema de cores do sistema operacional.

A fonte [JetBrains Mono](https://www.jetbrains.com/lp/mono/) está **embutida** no binário, então o painel é totalmente autossuficiente — ele é renderizado com a fonte monoespaçada pretendida e funciona offline sem requisições de fonte externas.
