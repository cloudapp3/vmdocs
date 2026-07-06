---
layout: home
titleTemplate: false
description: "vminfo es un monitor de sistema para terminal y CLI multiplataforma para Linux, macOS y Windows: métricas en vivo de CPU, memoria, disco, red y procesos, salida JSON, un panel web y una biblioteca Go embebible."
hero:
  name: vminfo
  text: Monitor de sistema para terminal, panel web y biblioteca Go
  tagline: Visibilidad multiplataforma del tiempo de ejecución del host para Linux, macOS y Windows — desde el TUI, la salida JSON, el panel en el navegador o las APIs Go embebibles.
  image:
    src: /logo.svg
    alt: vminfo
  actions:
    - theme: brand
      text: Comenzar
      link: /es/quick-start
    - theme: alt
      text: Ver comandos
      link: /es/commands
    - theme: alt
      text: HTTP API
      link: /es/api
    - theme: alt
      text: GitHub
      link: https://github.com/cloudapp3/vminfo

features:
  - icon: 🖥️
    title: TUI pulido
    details: Panel en vivo en la terminal para CPU, memoria, disco, red, carga y procesos.
    link: /es/tui-controls
  - icon: 📦
    title: JSON apto para scripts
    details: Exporta instantáneas y flujos continuos para automatización, CI y diagnóstico.
    link: /es/summary
  - icon: 🌐
    title: Panel web con temas
    details: Inicia un panel de solo lectura en el navegador con endpoints REST y WebSocket y temas intercambiables.
    link: /es/web-dashboard
  - icon: 🧩
    title: APIs Go embebibles
    details: Importa las APIs de recolección de vminfo o integra el TUI interactivo en tu propia CLI de Go.
    link: /es/library
  - icon: ⚡
    title: Visibilidad del tiempo de ejecución sin configuración
    details: Sin daemon, sin base de datos, sin servidor central. Instala e inspecciona el host local rápidamente.
    link: /es/installation
  - icon: 🔍
    title: Diagnóstico de red
    details: Ejecuta bajo demanda consultas DNS, puertos TCP, ping y búsquedas de IP pública / ASN desde la CLI o el panel.
    link: /es/net
  - icon: 🔒
    title: Modo web con token
    details: Protege el acceso remoto al panel con verificaciones de token, cookie, CORS y origen de WebSocket.
    link: /es/api
---

## Instala con un solo comando

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vminfo/main/install.sh | bash
```

Después, lanza la interfaz de terminal:

```bash
vminfo
```

O bien, obtén una instantánea JSON para tus scripts:

```bash
vminfo summary --json
```

## Por qué vminfo

vminfo está pensado para desarrolladores, SRE, ingenieros de DevOps y operadores de servidores que necesitan visibilidad sin fricciones de una máquina.

Úsalo cuando necesites:

- inspeccionar CPU, memoria, disco, red, carga y procesos desde una terminal
- exportar JSON legible por máquina para scripts y automatización
- abrir un panel en el navegador en un servidor con `vminfo --web`
- integrar la recolección de métricas del host en otra herramienta de Go
- diagnosticar un único host sin desplegar una plataforma de monitorización completa

## Capturas de pantalla

<div class="vminfo-screenshot-grid">
  <img src="../assets/tui-overview-refreshed.png" alt="Vista general del TUI de vminfo" />
  <img src="../assets/web-dashboard.png" alt="Panel web de vminfo" />
  <img src="../assets/tui-processes.png" alt="Vista de procesos de vminfo" />
  <img src="../assets/tui-help.png" alt="Superposición de ayuda de vminfo" />
</div>

![Vista general del TUI de vminfo](../assets/tui-overview-refreshed.png)

## Enlaces rápidos

- [Inicio rápido](/es/quick-start)
- [Instalación](/es/installation)
- [Despliegue](/es/deployment)
- [Referencia de comandos](/es/commands)
- [HTTP API](/es/api)
- [Biblioteca Go](/es/library)
- [中文文档](/zh/)
- [日本語ドキュメント](/ja/)
