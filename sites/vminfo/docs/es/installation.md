---
title: Instalación
description: Instala vminfo con el instalador de shell, go install o un directorio de binarios personalizado.
---

# Instalación

## Instalador de shell (Linux/macOS)

El script instalador es la vía más rápida para Linux y macOS.

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vminfo/main/install.sh | bash
```

Con sudo:

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vminfo/main/install.sh | sudo bash
```

El script selecciona automáticamente un directorio de instalación en este orden:

1. `/usr/local/bin`
2. `~/.local/bin`
3. `~/bin`

Si quieres un directorio fijo, pasa `--dir`:

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vminfo/main/install.sh | bash -s -- --dir /opt/bin
```

El script también admite `--skip-verify` si quieres omitir explícitamente la verificación de checksum.

## Instalación con Go

```bash
go install github.com/cloudapp3/vminfo/cmd/vminfo@latest
```

## Actualización

```bash
vminfo update
vminfo update --check
vminfo update --version v0.1.0
```

Notas:

- `vminfo update` instala la release etiquetada más reciente cuando ejecutas un build etiquetado
- `vminfo update --check` solo comprueba si hay actualizaciones
- `vminfo update --version v0.1.0` comprueba o instala una etiqueta de release específica

## Solución de problemas de PATH

Si `vminfo` está instalado pero no se encuentra, asegúrate de que tu directorio de instalación esté en el `PATH`.

Ejemplos habituales:

```bash
export PATH="$HOME/.local/bin:$PATH"
export PATH="$HOME/bin:$PATH"
```

## Desinstalación

Elimina el binario del directorio donde lo instalaste:

```bash
rm -f /usr/local/bin/vminfo
rm -f ~/.local/bin/vminfo
rm -f ~/bin/vminfo
```
