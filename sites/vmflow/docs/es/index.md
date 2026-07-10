---
layout: home
description: vmflow es un pequeño runtime de reenvío L4 en Go puro — reenvío de puertos TCP/UDP/tcp+udp, ciclo de vida de reglas, verificación previa, métricas de Prometheus, una interfaz de terminal y una biblioteca de Go embebible para daemons y planos de control.
hero:
  name: vmflow
  text: Runtime de reenvío L4 para daemons y planos de control
  tagline: Un pequeño runtime de reenvío TCP/UDP en Go puro. Ejecútalo como un daemon independiente o embebe el runtime en tu propio plano de control. Incluye ciclo de vida de reglas, verificación previa, métricas y una interfaz de terminal.
  image:
    src: /logo.svg
    alt: vmflow
  actions:
    - theme: brand
      text: Comenzar
      link: ./quick-start
    - theme: alt
      text: Referencia CLI
      link: ./commands
    - theme: alt
      text: HTTP API
      link: ./api
    - theme: alt
      text: GitHub
      link: https://github.com/cloudapp3/vmflow

features:
  - icon: 🔀
    title: Reenvío L4
    details: Reenvío de puertos TCP, UDP y tcp+udp combinado con limitación de velocidad y límite máximo de conexiones por regla.
    link: ./forwarding
  - icon: 🔄
    title: Ciclo de vida de reglas
    details: Inicia, detiene, reinicia y elimina reglas, o aplica una instantánea completa del estado deseado con diff incremental y recarga en caliente.
    link: ./rules
  - icon: 🛡️
    title: Verificación previa antes de aplicar
    details: Detecta IDs de regla duplicados, conflictos de listener, puertos no disponibles y fallos de DNS antes de que cambie una sola regla.
    link: ./precheck
  - icon: 🧩
    title: Runtime embebible
    details: Importa la API de Go de nivel superior para añadir reenvío en proceso a tu propio plano de control. El motor solo se encarga del reenvío y los contadores.
    link: ./library
  - icon: 📊
    title: Métricas de Prometheus y logs
    details: Un endpoint /metrics más logs estructurados en formato text/JSON mantienen el reenvío observable sin configuración adicional.
    link: ./api
  - icon: 🖥️
    title: TUI y bot de Telegram
    details: Un panel de terminal y un bot de Telegram opcional te permiten inspeccionar y controlar las reglas desde donde operes.
    link: ./tui-guide
  - icon: ⬆️
    title: Autoactualización
    details: Comprueba e instala versiones más recientes in situ con `vmflow update`; no necesitas el script de instalación tras la primera instalación.
    link: ./update
---

## Instala con un solo comando

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vmflow/main/install.sh | bash
```

Inicia el daemon:

```bash
vmflow daemon -config ./examples/config.yaml
```

Consúltalo desde otro terminal:

```bash
vmflow ctl health
vmflow ctl rules
vmflow ctl stats
vmflow ctl precheck
```

## Por qué vmflow

vmflow está pensado para desarrolladores y operadores que necesitan reenvío L4 ligero en proceso, ya sea como un daemon independiente o como una biblioteca dentro de un plano de control más amplio.

Úsalo cuando necesites:

- reenviar tráfico TCP/UDP entre puertos con límites por regla
- gestionar las reglas de reenvío desde tu propio estado deseado o base de datos
- validar una configuración de reenvío antes de aplicarla
- exponer estadísticas de reglas y recarga mediante una pequeña API local
- embeber el reenvío en otro servicio de Go sin incorporar una base de datos o una interfaz web

## Enlaces rápidos

- [Inicio rápido](./quick-start)
- [Instalación](./installation)
- [Configuración](./configuration)
- [Referencia de comandos](./commands)
- [HTTP API](./api)
- [Biblioteca de Go](./library)
- [中文文档](/zh/)
