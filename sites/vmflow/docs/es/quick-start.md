---
title: Inicio rápido
description: Instala vmflow y ejecuta tu primera regla de reenvío TCP en dos minutos.
---

# Inicio rápido

Esta guía instala la versión preliminar actual de vmflow con su configuración colocada junto al binario, inicia el daemon y lo consulta desde la CLI.

## 1. Instalar

Instala `v0.2.0-rc.4` para el shell actual (Linux/macOS):

```bash
VMFLOW_BIN_DIR="$(
  curl -fsSL https://raw.githubusercontent.com/cloudapp3/vmflow/main/install.sh \
    | bash -s -- --version v0.2.0-rc.4 --print-install-dir
)" \
  && [ -n "$VMFLOW_BIN_DIR" ] \
  && [ "${VMFLOW_BIN_DIR#/}" != "$VMFLOW_BIN_DIR" ] \
  && [ -x "$VMFLOW_BIN_DIR/vmflow" ] \
  && export PATH="$VMFLOW_BIN_DIR:$PATH"
```

Verifica:

```bash
vmflow version -json
```

Cuando hace falta, el instalador también configura PATH para futuras sesiones de shells compatibles. Consulta [Instalación](./installation) para la instalación del sistema con `--system`, la selección del directorio, la verificación de checksums y la compilación desde el código fuente.

## 2. Iniciar el daemon

Inicia el daemon con el `config.yaml` creado junto al binario instalado:

```bash
vmflow
```

La configuración colocada junto al binario es el valor por defecto del runtime. El ejemplo SSH incluido está deshabilitado y escucha en `127.0.0.1:2201`; revisa la configuración antes de activar la regla.

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

Abre la configuración junto al binario resuelto y aplica el nuevo estado deseado:

```bash
VMFLOW_CONFIG="$(dirname "$(command -v vmflow)")/config.yaml"
"${EDITOR:-vi}" "$VMFLOW_CONFIG"
vmflow ctl reload
```

La recarga ejecuta primero la [verificación previa](./precheck); si hay errores, el cambio se rechaza y las reglas en ejecución quedan intactas.

## Qué sigue

- [Configuración](./configuration) — todos los campos YAML explicados
- [Motor de reenvío](./forwarding) — protocolos, límites de velocidad, topes de conexiones
- [Reglas y ciclo de vida](./rules) — aplicación de instantánea y diff incremental
- [`vmflow service install`](./service) — ejecuta vmflow como servicio nativo al arranque (systemd / launchd / Windows Service)
- [`vmflow uninstall`](./uninstall) — desmontaje con un solo comando (servicio, binario, configuración, logs, certificados)
