---
layout: home
description: O vmflow é um pequeno runtime de encaminhamento L4 escrito em Go puro — encaminhamento de portas TCP/UDP/tcp+udp, ciclo de vida de regras, precheck, métricas do Prometheus, uma TUI e uma biblioteca Go embutível para daemons e control planes.
hero:
  name: vmflow
  text: Runtime de encaminhamento L4 para daemons e control planes
  tagline: Um pequeno runtime de encaminhamento TCP/UDP em Go puro. Execute-o como um daemon autônomo, ou embuta o runtime no seu próprio control plane. Inclui ciclo de vida de regras, precheck, métricas e uma TUI.
  image:
    src: /logo.svg
    alt: vmflow
  actions:
    - theme: brand
      text: Começar
      link: ./quick-start
    - theme: alt
      text: Referência da CLI
      link: ./commands
    - theme: alt
      text: API HTTP
      link: ./api
    - theme: alt
      text: GitHub
      link: https://github.com/cloudapp3/vmflow

features:
  - icon: 🔀
    title: Encaminhamento L4
    details: Encaminhamento de portas TCP, UDP e tcp+udp combinado, com limite de velocidade e limite máximo de conexões por regra.
    link: ./forwarding
  - icon: 🔄
    title: Ciclo de Vida de Regras
    details: Inicie, interrompa, reinicie e remova regras, ou aplique um snapshot completo de estado desejado com diff incremental e hot reload.
    link: ./rules
  - icon: 🛡️
    title: Precheck Antes de Aplicar
    details: Detecte IDs de regras duplicados, conflitos de listener, portas indisponíveis e falhas de DNS antes que qualquer regra seja alterada.
    link: ./precheck
  - icon: 🧩
    title: Runtime Embutível
    details: Importe a API Go de nível superior para adicionar encaminhamento em processo ao seu próprio control plane. O engine cuida apenas do encaminhamento e dos contadores.
    link: ./library
  - icon: 📊
    title: Métricas e Logs do Prometheus
    details: Um endpoint /metrics e logs estruturados em texto/JSON mantêm o encaminhamento observável sem configuração adicional.
    link: ./api
  - icon: 🖥️
    title: TUI e Bot do Telegram
    details: Um dashboard de terminal e um bot opcional do Telegram permitem inspecionar e controlar regras de onde quer que você opere.
    link: ./tui-guide
  - icon: ⬆️
    title: Autoatualização
    details: Verifique e instale novas releases no próprio local com `vmflow update` — sem necessidade de script de instalação após a primeira instalação.
    link: ./update
---

## Instale com um comando

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vmflow/main/install.sh | bash
```

Inicie o daemon:

```bash
vmflow daemon -config ./examples/config.yaml
```

Consulte-o a partir de outro terminal:

```bash
vmflow ctl health
vmflow ctl rules
vmflow ctl stats
vmflow ctl precheck
```

## Por que vmflow

O vmflow foi criado para desenvolvedores e operadores que precisam de encaminhamento L4 leve e em processo — como um daemon autônomo ou como uma biblioteca dentro de um control plane maior.

Use-o quando precisar:

- encaminhar tráfego TCP/UDP entre portas com limites por regra
- gerenciar regras de encaminhamento a partir do seu próprio estado desejado ou banco de dados
- validar uma configuração de encaminhamento antes de aplicá-la
- expor estatísticas de regras e reload por meio de uma pequena API local
- embutir encaminhamento em outro serviço Go sem incluir um banco de dados ou uma interface web

## Links rápidos

- [Início rápido](./quick-start)
- [Instalação](./installation)
- [Configuração](./configuration)
- [Referência de comandos](./commands)
- [API HTTP](./api)
- [Biblioteca Go](./library)
- [中文文档](/zh/)
