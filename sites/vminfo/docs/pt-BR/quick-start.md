---
title: Início rápido
description: Instale o vminfo e inspecione as métricas de tempo de execução do host a partir do TUI, do JSON ou do painel web.
---

# Início rápido

O vminfo oferece visibilidade rápida do tempo de execução do host a partir do terminal, da saída JSON, do painel no navegador ou das APIs Go.

## Instalação

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vminfo/main/install.sh | bash
```

Com sudo:

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vminfo/main/install.sh | sudo bash
```

## Iniciar o TUI

```bash
vminfo
```

## Imprimir um instantâneo JSON

```bash
vminfo summary --json
```

## Iniciar o painel web

```bash
vminfo --web
```

Endereço padrão:

```text
http://127.0.0.1:20021
```

## Próximos passos

- Leia a [referência de comandos](/pt-BR/commands)
- Abra o [guia do painel web](/pt-BR/web-dashboard)
- Use a [HTTP API](/pt-BR/api)
- Integre a [biblioteca Go](/pt-BR/library)
