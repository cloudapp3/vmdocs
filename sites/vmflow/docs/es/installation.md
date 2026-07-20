---
title: Instalación
description: Instala vmflow desde GitHub Releases con selección según privilegios, integración de PATH, verificación de checksums y desinstalación, o compílalo desde el código fuente.
---

# Instalación

`vmflow` se distribuye como un único binario estático para Linux y macOS (`amd64` y `arm64`). Obténlo desde GitHub Releases con el instalador, o compílalo desde el código fuente.

Las releases usan archivos portables en lugar de paquetes `.deb` o `.rpm` administrados por la distribución. Usa el instalador de abajo o descomprime un archivo manualmente.

## Instalación de usuario recomendada

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

Este comando fija la versión preliminar actual y exporta su directorio en el PATH del shell actual. Omite `--version v0.2.0-rc.4` para seguir la última versión estable. Actualmente, el instalador sin versión resuelve `v0.1.1`, que no incluye MCP ni las políticas Source IP descritas aquí.

## Instalación del sistema

Instala en `/usr/local/bin` sin ejecutar como root todo el script descargado:

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vmflow/main/install.sh \
  | bash -s -- --version v0.2.0-rc.4 --system
```

Cuando un usuario sin privilegios solicita `--system`, el instalador valida sudo antes de descargar y lo usa solo para comprobar y escribir en el destino. La nueva configuración colocada junto al binario pertenece a root y usa modo `0600`; utiliza los comandos de verificación y arranque con root/sudo que muestra el instalador.

Para instalar otra release, cambia la etiqueta de `--version`:

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vmflow/main/install.sh | bash -s -- --version v0.2.0-rc.4
```

### Opciones del instalador

| Opción | Descripción |
| --- | --- |
| `--version <tag>` | Instala una etiqueta de release específica. Por defecto, la última versión estable. |
| `--dir <path>` | Usa un directorio explícito; también está disponible mediante `VMFLOW_INSTALL_DIR`. |
| `--system` | Instala en todo el sistema en `/usr/local/bin`, usando sudo solo cuando sea necesario. |
| `--skip-verify` | Omite la verificación de checksums SHA-256. |
| `--no-modify-path` | No añade el directorio de usuario elegido automáticamente a un archivo de inicio del shell. |
| `--print-install-dir` | Tras una instalación correcta, imprime solo el directorio elegido en stdout. |
| `--uninstall` | Desinstala mediante `vmflow uninstall` si está disponible y usa un fallback del shell para binarios antiguos o ausentes. |
| `-h, --help` | Muestra la ayuda. |

### Directorio y PATH

Sin `--dir`, el instalador reutiliza primero una instalación convencional existente de vmflow que tenga una configuración colocada junto al binario. Una instalación root nueva usa `/usr/local/bin`. Para un usuario sin privilegios, prefiere `~/.local/bin` o `~/bin` si ya están en PATH y, en caso contrario, usa `~/.local/bin`.

En una instalación automática de usuario, el instalador añade cuando hace falta un único bloque PATH idempotente a `.zshrc`, `.bashrc` o `.profile`, y muestra el comando exacto para recargarlo. No puede cambiar el shell actual; por eso el comando recomendado captura `--print-install-dir` y lo exporta de inmediato. Un `--dir` explícito o `VMFLOW_INSTALL_DIR` nunca modifica archivos de inicio del shell.

### Configuración y compatibilidad de archivos

El instalador descarga un archivo de GitHub Release y verifica `checksums.txt` con SHA-256 por defecto. Admite tanto el `config.yaml` actual en la raíz como el diseño antiguo `examples/config.yaml`. La primera instalación crea `config.yaml` junto al binario con modo `0600`; las actualizaciones sustituyen solo el binario y conservan la configuración y las reglas de reenvío.

Para releases privados o límites de tasa más altos de la API de GitHub, define `GITHUB_TOKEN` o `GH_TOKEN`.

## Compilar desde el código fuente

Requisitos: [Go](https://go.dev/dl/) (una versión reciente; consulta `go.mod`).

```bash
git clone https://github.com/cloudapp3/vmflow.git
cd vmflow
go build -trimpath -o vmflow ./cmd/vmflow
```

O con el Makefile:

```bash
make build
```

## Verifica la instalación

```bash
vmflow version
vmflow version -json
```

## Actualizar vmflow

Una vez instalado desde una release etiquetada (v0.1.1 o posterior), `vmflow` puede actualizarse a sí mismo:

```bash
vmflow update --check            # comprueba si hay una release más reciente
vmflow update                    # instala la release más reciente
vmflow update --version v0.2.0-rc.4 # instala esta versión preliminar
```

Consulta [`vmflow update`](./update) para detalles, flags y notas por plataforma.

## Desinstalar una copia gestionada por el instalador

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vmflow/main/install.sh \
  | bash -s -- --uninstall
```

Tras eliminar correctamente el binario, el comando también quita el bloque PATH exacto creado por el instalador. Usa `sudo bash -s -- --uninstall` solo para una instalación del sistema propiedad de root. Consulta [`vmflow uninstall`](./uninstall) para conocer el alcance de limpieza y las reglas de conservación.
