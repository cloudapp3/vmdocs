---
title: Despliegue
description: Ejecuta vmflow como daemon en producción — exposición de la API de control, autenticación, TLS/mTLS, logs, métricas y configuración de servicio nativo.
---

# Despliegue

vmflow se ejecuta como un daemon duradero que expone una API de control local. Esta página cubre las cuestiones prácticas para ejecutarlo en un host.

## Mantén la API de control en loopback

El `control_listen_addr` por defecto es `127.0.0.1:19090`. Con `auth.enabled: false` la API de control trata cada petición como un llamador anónimo de nivel admin — eso solo es seguro en loopback.

El daemon **se niega a arrancar** si la API de control se vincula a una dirección no loopback (`0.0.0.0`, `::`, una IP no loopback o `:port`) sin protección. Es un comportamiento fail-closed: evita exponer accidentalmente un endpoint de control remoto sin autenticar. Para vincular fuera de loopback, satisface una de estas condiciones:

1. `auth.enabled: true` con al menos un token, **o**
2. TLS mutuo mediante `control_tls.client_ca_file` (los clientes deben presentar un certificado), **o**
3. pasa `-insecure-allow-remote-control` al daemon para reconocer explícitamente el riesgo.

## Exponerlo fuera de localhost

Cuando necesites alcanzar la API de control desde otro host, elige una de las opciones seguras.

### Opción A — auth por bearer token

```yaml
control_listen_addr: 0.0.0.0:19090
auth:
  enabled: true
  tokens:
    - name: admin
      token: <long-random-secret>
      role: admin
    - name: viewer
      token: <another-random-secret>
      role: viewer
```

Usa el token `admin` para cualquier llamada que muta estado (`reload`). Las llamadas de solo lectura funcionan con un token `viewer`.

### Opción B — TLS / TLS mutuo (recomendado)

Termina el TLS en la propia API de control y, para la postura más fuerte, exige certificados de cliente:

```yaml
control_listen_addr: 0.0.0.0:19090
control_tls:
  cert_file: /etc/vmflow/server.pem
  key_file:  /etc/vmflow/server.key
  client_ca_file: /etc/vmflow/client-ca.pem   # mTLS — satisfies the startup check
  min_version: "1.2"
```

Los clientes se conectan entonces con `-tls-ca-file`, `-tls-client-cert`, `-tls-client-key` (consulta [Flags comunes de cliente](./commands#common-client-flags)). Es la forma recomendada de exponer la API de control detrás de un Cloudflare Tunnel sin puertos de entrada. Consulta [HTTP API → TLS y TLS mutuo](./api#tls-and-mutual-tls).

Consulta también [HTTP API → Autenticación](./api#authentication).

## Logging

Define el formato que mejor encaje con tu pila:

```yaml
log:
  level: info
  format: json # text or json
```

`json` es lo más sencillo para recolectores de logs; `text` es más cómodo en un terminal. Bajo un gestor de servicios también puedes pasar `-log-file` al daemon (obligatorio en Windows).

## Métricas

Apunta Prometheus a la API de control:

```yaml
scrape_configs:
  - job_name: vmflow
    static_configs:
      - targets: ['127.0.0.1:19090']
    metrics_path: /metrics
```

Consulta [HTTP API → Métricas](./api#get-metrics) para las familias de métricas expuestas.

## Recarga segura

Los cambios de configuración pasan por `POST /v1/reload` (o `vmflow ctl reload`). La recarga ejecuta primero la [verificación previa](./precheck) y rechaza el cambio ante cualquier error, dejando las reglas en ejecución intactas. Aún no hay ventana de drenaje ordenado: las conexiones existentes a una regla eliminada o modificada no se migran.

## Ejecutar como servicio nativo

Registra vmflow en el gestor de servicios de tu SO para que arranque en el boot y se reinicie ante caídas:

```bash
# installs + enables + starts a systemd unit / launchd plist / Windows Service
sudo vmflow service install
```

Esta es la vía recomendada — consulta [`vmflow service`](./service) para las flags (ruta de configuración, usuario de ejecución, archivo de log, argumentos extra). `vmflow service status` / `vmflow service uninstall` lo consultan y eliminan.

Si prefieres gestionar la unidad tú mismo, aquí tienes un ejemplo funcional de systemd que puedes adaptar:

```ini
[Unit]
Description=vmflow L4 forwarding daemon
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
ExecStart=/usr/local/bin/vmflow daemon -config /etc/vmflow/config.yaml
ExecReload=/usr/local/bin/vmflow ctl reload
Restart=on-failure
RestartSec=3

[Install]
WantedBy=multi-user.target
```

Recarga la configuración tras editarla:

```bash
sudo vmflow ctl reload
# or, with a hand-written unit that wires ExecReload:
sudo systemctl reload vmflow
```

Para un desmontaje completo (servicio + binario + configuración + logs + certificados + caché de actualización), usa [`vmflow uninstall`](./uninstall).

## Límites actuales

- Las estadísticas son **solo en memoria**; no hay agregación histórica integrada.
- Sin panel web ni coordinador multi-nodo incluidos.
- Todavía no hay imagen Docker oficial en el archivo de release (la instalación como servicio nativo y los paquetes `.deb`/`.rpm` sí están disponibles).
