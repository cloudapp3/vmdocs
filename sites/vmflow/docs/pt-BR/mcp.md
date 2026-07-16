---
title: Servidor MCP
description: Conecte Claude, Codex e outros clientes MCP a um daemon vmflow por um adaptador stdio somente leitura.
---

# Servidor MCP

`vmflow mcp` inicia em foreground um servidor MCP somente de ferramentas sobre
stdio. Ele se conecta a um daemon vmflow já em execução pelo canal de
gerenciamento loopback. Não inicia encaminhamento, não abre uma porta de rede
MCP e não modifica a configuração do daemon.

## Requisitos

- Execute o comando MCP no mesmo host do daemon vmflow.
- Mantenha o listener de gerenciamento do daemon restrito ao loopback.
- Com autenticação habilitada, use um token viewer dedicado por meio de
  `VMFLOW_CONTROL_TOKEN`.

## Ferramentas

| Ferramenta | Finalidade |
| --- | --- |
| `get_vmflow_status` | Resumo de conexão, versão, autorização, regras, tráfego e estado degradado |
| `list_forwarding_rules` | Resumos filtrados sem detalhes de endpoints ou políticas de origem |
| `get_forwarding_rule` | Configuração, estado e estatísticas de uma regra selecionada explicitamente |
| `get_traffic_stats` | Contadores filtrados por regra e totais agregados |
| `run_config_precheck` | Validação somente leitura da configuração persistida atual |

Todas as ferramentas são somente leitura. Listas e precheck retornam 50 itens
por padrão e aceitam no máximo 200. O adaptador permite até quatro chamadas
simultâneas.

## Token viewer

Configure um token dedicado ao cliente MCP:

```yaml
auth:
  enabled: true
  tokens:
    - name: mcp-viewer
      token: replace-with-a-long-random-token
      role: viewer
```

Prefira a variável de ambiente em vez de `-token`, que exporia o token na linha
de comando do processo.

## Claude Desktop

```json
{
  "mcpServers": {
    "vmflow": {
      "command": "/usr/local/bin/vmflow",
      "args": ["mcp"],
      "env": {
        "VMFLOW_CONTROL_TOKEN": "replace-with-a-long-random-token"
      }
    }
  }
}
```

## Codex

```toml
[mcp_servers.vmflow]
command = "/usr/local/bin/vmflow"
args = ["mcp"]
env = { VMFLOW_CONTROL_TOKEN = "replace-with-a-long-random-token" }
```

Se o daemon usar outra porta de gerenciamento, acrescente `-addr` e a URL
loopback a `args`:

```json
"args": ["mcp", "-addr", "http://127.0.0.1:49127"]
```

`-addr` aceita somente `localhost` ou um IP loopback. Para um daemon em outra
máquina, execute `vmflow mcp` nessa máquina, por exemplo via SSH, em vez de
expor o listener de gerenciamento.

## Limite de dados

Os detalhes das regras podem conter endereços de destino, políticas de IP de
origem, domínios e observações. Tráfego e precheck também podem revelar a
topologia da rede local. Os resultados são enviados ao modelo configurado no
cliente MCP.

O servidor não expõe escrita de configuração, YAML bruto, tokens de bot, chaves
privadas de certificados, execução de shell, acesso a arquivos, prompts ou
resources. O precheck pode resolver destinos já presentes na configuração do
daemon.

## Solução de problemas

- `connected: false`: o daemon não está acessível no endereço loopback.
- HTTP `401`: defina o token viewer correto em `VMFLOW_CONTROL_TOKEN`.
- Endpoint de sessão indisponível: reinicie o daemon com a mesma release do
  vmflow usada para iniciar o servidor MCP.
- TLS ou mTLS personalizado: use os mesmos parâmetros `-tls-*` aceitos por
  `vmflow ctl` e `vmflow tui`.
