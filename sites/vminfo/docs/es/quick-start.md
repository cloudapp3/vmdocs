---
title: Inicio rápido
description: Instala vminfo e inspecciona las métricas del host desde el TUI, JSON o el panel web.
---

# Inicio rápido

vminfo te ofrece visibilidad rápida del tiempo de ejecución del host desde la terminal, la salida JSON, el panel en el navegador o las APIs de Go.

## Instalación

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vminfo/main/install.sh | bash
```

Con sudo:

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vminfo/main/install.sh | sudo bash
```

## Lanzar el TUI

```bash
vminfo
```

## Imprimir una instantánea JSON

```bash
vminfo summary --json
```

## Iniciar el panel web

```bash
vminfo --web
```

Dirección por defecto:

```text
http://127.0.0.1:20021
```

## Próximos pasos

- Lee la [referencia de comandos](/es/commands)
- Abre la [guía del panel web](/es/web-dashboard)
- Usa la [HTTP API](/es/api)
- Integra la [biblioteca Go](/es/library)
