---
title: Despliegue
description: Ejecuta vmflow con gestión loopback, logs, métricas, acceso SSH y servicio nativo.
---

# Despliegue

vmflow funciona como un proceso de reenvío de larga duración. La gestión permanece en loopback y usa la CLI/TUI incluidas.

## Gestión local

El canal de gestión interno siempre se enlaza a `127.0.0.1`. La configuración solo define el puerto local:

```yaml
control_port: 19090
```

Las interfaces compatibles son `vmflow ctl` y `vmflow tui`. El transporte interno no es una API pública de integración.

## Gestión remota

Reenvía el puerto loopback mediante SSH y usa la CLI/TUI local:

```bash
ssh -N -L 19090:127.0.0.1:19090 user@server
vmflow ctl rules
```

## Logging

Define el formato que mejor encaje con tu pila:

```yaml
log:
  level: info
  format: json # text or json
```

`json` es lo más sencillo para recolectores de logs; `text` es más cómodo en un terminal. Bajo un gestor de servicios también puedes pasar `-log-file` al daemon (obligatorio en Windows).

## Métricas

Configura Prometheus en el mismo host para leer el listener de métricas loopback:

```yaml
scrape_configs:
  - job_name: vmflow
    static_configs:
      - targets: ['127.0.0.1:19090']
    metrics_path: /metrics
```

## Recarga segura

Usa `vmflow ctl reload` para aplicar cambios. Primero se ejecuta el [precheck](./precheck) y una configuración inválida nunca se aplica parcialmente.

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
ExecStart=/usr/local/bin/vmflow -config /etc/vmflow/config.yaml
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

- Los contadores acumulados pueden persistir opcionalmente; conexiones activas y tasas permanecen locales al proceso.
- Sin panel web ni coordinador multi-nodo incluidos.
- Todavía no se publica una imagen Docker oficial; usa el instalador de servicio nativo integrado para el inicio automático.
