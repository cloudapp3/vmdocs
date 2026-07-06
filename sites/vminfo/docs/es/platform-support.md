---
title: Compatibilidad de plataformas
description: Qué características están disponibles en Linux, macOS y Windows.
---

# Compatibilidad de plataformas

| Capacidad | Linux | macOS | Windows |
| --- | --- | --- | --- |
| `summary` / `watch` | ✅ | ✅ | ✅ |
| TUI | ✅ | ✅ | ✅ |
| Panel web | ✅ | ✅ | ✅ |
| `ps` / `kill` | ✅ | ⚠️ stub | ⚠️ stub |
| `update --check` | ✅ | ✅ | ✅ |
| Instalación con `update` | ✅ | ✅ | ⚠️ solo comprobación |

Notas:

- La TUI requiere una TTY real.
- `ps` y `kill` son exclusivos de Linux por diseño.
- Las compilaciones que no son de Linux mantienen stubs no soportados para las funciones de procesos.
- Windows puede comprobar actualizaciones, pero el autoreemplazo no está soportado.
