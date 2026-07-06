---
title: Panel web
description: Inicia la HTTP API de solo lectura y el panel web, incluida la autenticación con token y el acceso WebSocket.
---

# Panel web

`vminfo --web` inicia una HTTP API ligera y de solo lectura y un panel con temas intercambiables.

## Iniciar el servidor

```bash
vminfo --web
```

Dirección por defecto:

```text
http://127.0.0.1:20021
```

Dirección personalizada:

```bash
vminfo --web --bind 0.0.0.0 --port 8080 --interval 1s
```

También puedes lanzar el TUI junto con el panel:

```bash
vminfo --web --tui
```

## Autenticación

Por defecto, el panel y la API son locales y sin autenticar.

Cuando se habilita `--token`:

```bash
vminfo --web --token
vminfo --web --token my-secret
```

- `--token` sin argumento genera automáticamente un token seguro para URL
- `--token my-secret` usa un token fijo
- la primera visita exitosa a `/?token=...` establece una cookie para las peticiones posteriores
- `/healthz` sigue siendo público para sondas locales
- `/`, `/api/v1/*` y `/ws` requieren el token o la cookie de autenticación
- el modo protegido con token no expone un `Access-Control-Allow-Origin: *` permisible
- las actualizaciones WebSocket requieren que el origen del navegador coincida con el host del panel

::: warning Acceso remoto
Al enlazar a `0.0.0.0`, habilita `--token` a menos que el panel solo se exponga a una red privada de confianza.
:::

## Endpoints

| Endpoint | Propósito |
| --- | --- |
| `GET /healthz` | Comprobación de estado pública |
| `GET /api/v1/snapshot` | Instantánea completa del tiempo de ejecución |
| `GET /api/v1/cpu` | Datos de CPU |
| `GET /api/v1/memory` | Datos de memoria y swap |
| `GET /api/v1/disk` | Datos de sistema de ficheros y E/S de disco |
| `GET /api/v1/network` | Totales de red y datos por interfaz |
| `GET /api/v1/processes` | Lista de procesos |
| `GET /api/v1/system` | Metadatos del host |
| `GET /api/v1/health` | Puntuación de salud y avisos |
| `POST /api/v1/net/diag` | Ejecuta un diagnóstico de red (dns / port / ping / ip) |
| `GET /ws` | Flujo en vivo de instantáneas |

Consulta la [referencia completa de la HTTP API](/es/api) para ejemplos de cargas y parámetros de consulta.

## Temas

El panel incluye temas intercambiables desde la cabecera: **Auto**, **Neon**, **Light**, **Terminal** y **Synthwave**. «Auto» sigue el esquema de color del sistema operativo.

[JetBrains Mono](https://www.jetbrains.com/lp/mono/) está **embebido** en el binario, por lo que el panel es totalmente autónomo: se renderiza con su tipografía monoespaciada prevista y funciona sin conexión sin peticiones de fuentes externas.
