---
title: Inicio rápido
description: Instala vmflow y ejecuta tu primera regla de reenvío TCP en dos minutos.
---

# Inicio rápido

Esta guía instala el binario `vmflow`, inicia el daemon con una configuración de ejemplo y lo consulta desde la CLI.

## 1. Instalar

Instala el último binario precompilado (Linux/macOS):

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vmflow/main/install.sh | bash
```

¿Prefieres una instalación global?

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vmflow/main/install.sh | sudo bash -s -- --dir /usr/local/bin
```

Verifica:

```bash
vmflow version
```

Consulta [Instalación](./installation) para `--version`, la verificación de checksums y la compilación desde el código fuente.

## 2. Iniciar el daemon

Toma la configuración de ejemplo e inicia el daemon:

```bash
vmflow -config ./examples/config.yaml
```

El ejemplo SSH incluido está deshabilitado y escucha en `127.0.0.1:2201`; revísalo antes de activarlo.

## 3. Consultarlo

Desde otro terminal, consulta el daemon local con la CLI incluida:

```bash
vmflow ctl rules
vmflow ctl stats
vmflow ctl metrics
vmflow ctl precheck
```

## 4. Abrir la interfaz de terminal

```bash
vmflow tui
```

Pulsa <kbd>Tab</kbd> para alternar entre las vistas Dashboard, Rules y Detail. Consulta [Panel TUI](./tui-guide).

## 5. Recargar tras editar la configuración

Edita `examples/config.yaml` y luego aplica el nuevo estado deseado:

```bash
vmflow ctl reload
```

La recarga ejecuta primero la [verificación previa](./precheck); si hay errores, el cambio se rechaza y las reglas en ejecución quedan intactas.

## Qué sigue

- [Configuración](./configuration) — todos los campos YAML explicados
- [Motor de reenvío](./forwarding) — protocolos, límites de velocidad, topes de conexiones
- [Reglas y ciclo de vida](./rules) — aplicación de instantánea y diff incremental
- [`vmflow service install`](./service) — ejecuta vmflow como servicio nativo al arranque (systemd / launchd / Windows Service)
- [`vmflow uninstall`](./uninstall) — desmontaje con un solo comando (servicio, binario, configuración, logs, certificados)
