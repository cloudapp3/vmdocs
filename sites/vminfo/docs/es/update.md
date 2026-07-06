---
title: update
description: Comprueba o instala la última release etiquetada de vminfo.
---

# `vminfo update`

Comprueba GitHub Releases y, cuando es posible, instala la compilación etiquetada más reciente.

## Uso

```bash
vminfo update
vminfo update --check
vminfo update --version v0.1.0
```

## Notas

- `--check` solo comprueba si hay actualizaciones.
- `--version` comprueba o instala una etiqueta de release específica.
- Una compilación de desarrollo no puede actualizarse automáticamente sin `--version`.
- En Windows, el modo de instalación no es compatible porque el binario no puede reemplazarse a sí mismo en su sitio.

## Ejemplo

```bash
vminfo update --check
```

## Relacionado

- [Instalación](/es/installation)
- [Changelog](/changelog)
