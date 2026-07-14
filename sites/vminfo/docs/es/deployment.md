---
title: Despliegue
description: Ejecuta el panel web de vminfo de forma segura en local, por un túnel SSH o detrás de un proxy inverso HTTPS.
---

# Despliegue

`vminfo --web` es un panel ligero para un solo host. No necesita base de datos ni pretende ser una plataforma de monitorización central. Mantén el servidor HTTP integrado dentro de un límite de confianza.

## Panel solo local

La configuración predeterminada y más segura no necesita autenticación:

```bash
vminfo --web
```

Escucha en `127.0.0.1:20021`. Abre `http://127.0.0.1:20021` en la misma máquina o comprueba la API:

```bash
curl -fsS http://127.0.0.1:20021/api/v1/health
```

Sin autenticación solo se aceptan cabeceras Host con `localhost` o una IP loopback, lo que bloquea el DNS rebinding.

## Acceso remoto por SSH

Para administración individual, conserva el listener en loopback y crea un túnel:

```bash
# En el servidor
vminfo --web

# En tu estación de trabajo
ssh -L 20021:127.0.0.1:20021 user@server
```

Después abre `http://127.0.0.1:20021` en tu estación. El puerto del panel no queda publicado en la red del servidor.

## Acceso mediante un proxy inverso HTTPS

Para una URL persistente, mantén vminfo en loopback y usa un proxy HTTPS en el mismo host:

```bash
vminfo --web --bind 127.0.0.1 --port 20021 --token
```

`--token` sin valor genera un token aleatorio y una URL lista para abrir. También puedes pasar un valor fijo:

```bash
vminfo --web --bind 127.0.0.1 --port 20021 --token "$VMINFO_WEB_TOKEN"
```

El proxy debe terminar TLS, reenviar a `127.0.0.1:20021`, conservar `Host`, establecer
`X-Forwarded-Proto: https`, admitir upgrades WebSocket en `/ws` y mantener panel y API en el mismo origen.

La primera visita correcta a `/?token=...` guarda una cookie `HttpOnly`,
`SameSite=Lax` y redirige a una URL sin el token. Si la petición se reconoce como HTTPS, la cookie también lleva `Secure`.

::: warning Seguridad del transporte
El servidor integrado usa HTTP. El token controla el acceso, pero no cifra el tráfico. No expongas el puerto directamente a Internet; usa un proxy HTTPS o un túnel SSH.
:::

## Enlace directo a una red privada

Un bind que no sea loopback siempre requiere token:

```bash
vminfo --web --bind 0.0.0.0 --port 20021 --token
```

Sin `--token`, vminfo falla al arrancar. Limita los orígenes con un firewall y recuerda que la conexión sigue siendo HTTP sin cifrar.

## Protecciones del navegador y de la API

- Las peticiones REST y WebSocket con `Origin` deben coincidir en scheme, host y puerto
- No se devuelve `Access-Control-Allow-Origin: *`
- Con token, las páginas, `/api/v1/*` y `/ws` requieren el token o la cookie
- Los clientes nativos sin `Origin` siguen siendo compatibles
- Los diagnósticos de red validan JSON, tamaño, número de pruebas y timeout

## Supervisión del proceso

Usa el supervisor existente del host, como systemd, launchd o un runtime de contenedores. Ejecuta como usuario no root cuando sea posible, reinicia tras fallos y usa `SIGTERM` para detenerlo. vminfo no instala una definición de servicio.

## Verificación

```bash
curl -fsS http://127.0.0.1:20021/api/v1/health
curl -fsS "http://127.0.0.1:20021/api/v1/health?token=$VMINFO_WEB_TOKEN"
```

No existe un endpoint público de health separado. Con autenticación, `/api/v1/health` también está protegido.

## Relacionado

- [Panel web](/es/web-dashboard)
- [HTTP API](/es/api)
- [Instalación](/es/installation)
- [Comando update](/es/update)
