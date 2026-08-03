---
title: Inicio rápido
description: Instala vmflow y ejecuta tu primera regla de reenvío TCP en dos minutos.
---

# Inicio rápido

Esta guía instala vmflow v0.3.0 estable, crea la primera regla validada con `vmflow init` y consulta el daemon en ejecución desde la CLI.

## 1. Instalar

Instala `v0.3.0` para el shell actual (Linux/macOS):

```bash
VMFLOW_BIN_DIR="$(
  curl -fsSL https://raw.githubusercontent.com/cloudapp3/vmflow/main/install.sh \
    | bash -s -- --version v0.3.0 --print-install-dir
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

## 2. Inicializar vmflow

Ejecuta el asistente de primer uso:

```bash
vmflow init
```

El idioma es la primera elección: `1` selecciona English y `2` chino simplificado. Después elige el servicio nativo recomendado, modo foreground en el terminal actual o guardar sin iniciar. El asistente crea una regla validada, activa la gestión local autenticada y escribe el config system/user correcto para el modo elegido.

El modo servicio instala, habilita y ya inicia vmflow, por lo que no debes lanzar un segundo proceso foreground. El modo foreground también está en ejecución y permanece ligado al terminal actual. Ejecuta `vmflow run` más tarde solo si guardaste sin iniciar.

## 3. Consultarlo

Desde otro terminal, consulta el daemon local con la CLI incluida:

```bash
vmflow ctl rules
vmflow ctl stats
vmflow ctl metrics
vmflow ctl precheck
```

## 4. Abrir la interfaz de terminal

Para el servicio nativo del sistema, usa el comando predeterminado. Primero comprueba que el servicio local esté instalado y en ejecución:

```bash
vmflow tui
```

En modo foreground, mantén abierto el terminal del daemon e indica explícitamente la dirección del proceso iniciado manualmente:

```bash
vmflow tui -addr http://127.0.0.1:19090
```

Un `-addr` explícito omite la comprobación del servicio nativo. Pulsa <kbd>Tab</kbd> para alternar entre las vistas Dashboard, Rules y Detail. Consulta [Panel TUI](./tui-guide).

## 5. Recargar tras editar la configuración

Consulta la ruta activa con `vmflow status`, edita ese archivo y aplica el nuevo estado:

```bash
vmflow status
vmflow ctl reload
```

La recarga ejecuta primero la [verificación previa](./precheck); si hay errores, el cambio se rechaza y las reglas en ejecución quedan intactas.

## Qué sigue

- [Configuración](./configuration) — todos los campos YAML explicados
- [Motor de reenvío](./forwarding) — protocolos, bandwidth compartido, cuotas diarias/mensuales y topes de conexiones
- [Reglas y ciclo de vida](./rules) — aplicación de instantánea y diff incremental
- [`vmflow service install`](./service) — ejecuta vmflow como servicio nativo al arranque (systemd / launchd / Windows Service)
- [`vmflow uninstall`](./uninstall) — desmontaje con un solo comando (servicio, binario, configuración, logs, certificados)
