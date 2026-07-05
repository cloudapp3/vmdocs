---
layout: home
description: vmflow is a small pure-Go L4 forwarding runtime — TCP/UDP/tcp+udp port forwarding, rule lifecycle, precheck, Prometheus metrics, a terminal UI, and an embeddable Go library for daemons and control planes.
hero:
  name: vmflow
  text: L4 forwarding runtime for daemons and control planes
  tagline: A small pure-Go TCP/UDP forwarding runtime. Run it as a standalone daemon, or embed the runtime into your own control plane. Rule lifecycle, precheck, metrics, and a terminal UI included.
  image:
    src: /logo.svg
    alt: vmflow
  actions:
    - theme: brand
      text: Get Started
      link: /guide/quick-start
    - theme: alt
      text: CLI Reference
      link: /commands/
    - theme: alt
      text: HTTP API
      link: /api
    - theme: alt
      text: GitHub
      link: https://github.com/cloudapp3/vmflow

features:
  - icon: 🔀
    title: L4 Forwarding
    details: TCP, UDP, and combined tcp+udp port forwarding with per-rule speed limiting and max-connection caps.
    link: /guide/forwarding
  - icon: 🔄
    title: Rule Lifecycle
    details: Start, stop, restart, and remove rules, or apply a full desired-state snapshot with incremental diff and hot reload.
    link: /guide/rules
  - icon: 🛡️
    title: Precheck Before Apply
    details: Catch duplicate rule IDs, listener conflicts, unavailable ports, and DNS failures before a single rule changes.
    link: /guide/precheck
  - icon: 🧩
    title: Embeddable Runtime
    details: Import the top-level Go API to add in-process forwarding to your own control plane. The engine owns only forwarding and counters.
    link: /library/
  - icon: 📊
    title: Prometheus Metrics & Logs
    details: A /metrics endpoint plus structured text/JSON logging keep forwarding observable without extra wiring.
    link: /api
  - icon: 🖥️
    title: TUI & Telegram Bot
    details: A terminal dashboard and an optional Telegram bot let you inspect and control rules from wherever you operate.
    link: /guide/tui
---

## Install in one command

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vmflow/main/install.sh | bash
```

Start the daemon:

```bash
vmflow daemon -config ./examples/config.yaml
```

Query it from another terminal:

```bash
vmflow ctl health
vmflow ctl rules
vmflow ctl stats
vmflow ctl precheck
```

## Why vmflow

vmflow is built for developers and operators who need lightweight, in-process L4 forwarding — as a standalone daemon or as a library inside a larger control plane.

Use it when you need to:

- forward TCP/UDP traffic between ports with per-rule limits
- drive forwarding rules from your own desired-state or database
- validate a forwarding config before applying it
- expose rule stats and reload through a small local API
- embed forwarding into another Go service without pulling in a database or web UI

## Quick links

- [Quick start](/guide/quick-start)
- [Installation](/guide/installation)
- [Configuration](/guide/configuration)
- [Command reference](/commands/)
- [HTTP API](/api)
- [Go Library](/library/)
- [中文文档](/zh/)
