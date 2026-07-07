---
layout: home
titleTemplate: false
description: O vminfo é um monitor de sistema para terminal e CLI multiplataforma para Linux, macOS e Windows — métricas em tempo real de CPU, memória, disco, rede e processos, saída JSON, um painel web e uma biblioteca Go embutível.
hero:
  name: vminfo
  text: Monitor de sistema para terminal, painel web e biblioteca Go
  tagline: Visibilidade multiplataforma do tempo de execução do host para Linux, macOS e Windows — a partir do TUI, da saída JSON, do painel no navegador ou das APIs Go embutíveis.
  image:
    src: /logo.svg
    alt: vminfo
  actions:
    - theme: brand
      text: Começar
      link: /pt-BR/quick-start
    - theme: alt
      text: Ver comandos
      link: /pt-BR/commands
    - theme: alt
      text: HTTP API
      link: /pt-BR/api
    - theme: alt
      text: GitHub
      link: https://github.com/cloudapp3/vminfo

features:
  - icon: 🖥️
    title: TUI polido
    details: Painel em tempo real no terminal para CPU, memória, disco, rede, carga e processos.
    link: /pt-BR/tui-controls
  - icon: 📦
    title: JSON amigável para scripts
    details: Exporte instantâneos e fluxos contínuos para automação, CI e diagnóstico.
    link: /pt-BR/summary
  - icon: 🌐
    title: Painel web com temas
    details: Inicie um painel somente leitura no navegador com endpoints REST e WebSocket e temas intercambiáveis.
    link: /pt-BR/web-dashboard
  - icon: 🧩
    title: APIs Go embutíveis
    details: Importe as APIs de coleta do vminfo ou integre o TUI interativo na sua própria CLI de Go.
    link: /pt-BR/library
  - icon: ⚡
    title: Visibilidade do tempo de execução sem configuração
    details: Sem daemon, sem banco de dados, sem servidor central. Instale e inspecione o host local rapidamente.
    link: /pt-BR/installation
  - icon: 🔍
    title: Diagnóstico de rede
    details: Execute sob demanda consultas DNS, portas TCP, ping e buscas de IP público / ASN pela CLI ou pelo painel.
    link: /pt-BR/net
  - icon: 🔒
    title: Modo web com token
    details: Proteja o acesso remoto ao painel com verificações de token, cookie, CORS e origem do WebSocket.
    link: /pt-BR/api
---

## Instale com um único comando

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vminfo/main/install.sh | bash
```

Depois, inicie a interface do terminal:

```bash
vminfo
```

Ou obtenha um instantâneo JSON para seus scripts:

```bash
vminfo summary --json
```

## Por que o vminfo

O vminfo foi criado para desenvolvedores, SREs, engenheiros de DevOps e operadores de servidores que precisam de visibilidade sem atritos de uma máquina.

Use-o quando precisar:

- inspecionar CPU, memória, disco, rede, carga e processos a partir de um terminal
- exportar JSON legível por máquina para scripts e automação
- abrir um painel no navegador em um servidor com `vminfo --web`
- integrar a coleta de métricas do host em outra ferramenta em Go
- diagnosticar um único host sem executar uma plataforma de monitoramento completa

## Capturas de tela

<div class="vminfo-screenshot-grid">
  <img src="../assets/tui-overview-refreshed.png" alt="Visão geral do TUI do vminfo" />
  <img src="../assets/web-dashboard.png" alt="Painel web do vminfo" />
  <img src="../assets/tui-processes.png" alt="Visualização de processos do vminfo" />
  <img src="../assets/tui-help.png" alt="Sobreposição de ajuda do vminfo" />
</div>

![Visão geral do TUI do vminfo](../assets/tui-overview-refreshed.png)

## Links rápidos

- [Início rápido](/pt-BR/quick-start)
- [Instalação](/pt-BR/installation)
- [Implantação](/pt-BR/deployment)
- [Referência de comandos](/pt-BR/commands)
- [HTTP API](/pt-BR/api)
- [Biblioteca Go](/pt-BR/library)
- [中文文档](/zh/)
- [日本語ドキュメント](/ja/)
