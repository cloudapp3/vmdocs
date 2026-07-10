---
title: Instalación
description: Instala vmflow desde GitHub Releases con el instalador de una línea o compílalo desde el código fuente. Admite --version, --dir, --skip-verify y GITHUB_TOKEN.
---

# Instalación

`vmflow` se distribuye como un único binario estático para Linux y macOS (`amd64` y `arm64`). Obténlo desde GitHub Releases con el instalador, o compílalo desde el código fuente.

Además de los binarios estáticos, cada release también publica paquetes de sistema `.deb` y `.rpm` (generados con GoReleaser).

## Instalador de una línea

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vmflow/main/install.sh | bash
```

Instala globalmente en `/usr/local/bin`:

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vmflow/main/install.sh | sudo bash -s -- --dir /usr/local/bin
```

Instala una etiqueta de release específica:

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vmflow/main/install.sh | bash -s -- --version v0.1.0
```

### Opciones del instalador

| Opción | Descripción |
| --- | --- |
| `--version <tag>` | Instala una etiqueta de release específica. Por defecto, la última release. |
| `--dir <path>` | Directorio de instalación. Se autodetecta si se omite (ver más abajo). |
| `--skip-verify` | Omite la verificación de checksums SHA-256. |
| `--uninstall` | Delega en `vmflow uninstall` (elimina servicio, binario, configuración, logs, certificados, caché de actualización). |
| `-h, --help` | Muestra la ayuda. |

El instalador descarga los archivos de GitHub Release, verifica `checksums.txt` con SHA-256 por defecto y autodetecta un directorio de instalación en este orden: `/usr/local/bin` → `~/.local/bin` → `~/bin`. Puedes sobrescribirlo con `--dir PATH` o con la variable de entorno `VMFLOW_INSTALL_DIR`.

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

## ¿PATH no está definido?

Si el instalador reporta que el directorio elegido no está en tu `PATH`, crea un symlink:

```bash
sudo ln -sf "$HOME/.local/bin/vmflow" /usr/local/bin/vmflow
```

…o añade el directorio al `PATH` de tu shell:

```bash
export PATH="$HOME/.local/bin:$PATH"
```

## Actualizar vmflow

Una vez instalado desde una release etiquetada (v0.1.1 o posterior), `vmflow` puede actualizarse a sí mismo:

```bash
vmflow update --check            # comprueba si hay una release más reciente
vmflow update                    # instala la release más reciente
vmflow update --version v0.1.1   # instala una versión específica
```

Consulta [`vmflow update`](./update) para detalles, flags y notas por plataforma. (La release v0.1.0 es anterior al comando `update`; reinstálala con el instalador de arriba para obtener la autoactualización.)
