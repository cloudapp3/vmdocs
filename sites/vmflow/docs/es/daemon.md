---
title: vmflow daemon
description: Ejecuta el daemon de reenvío de vmflow — ruta de configuración, dirección de escucha de control y flags de seguridad de arranque.
---

# vmflow daemon

```bash
vmflow daemon -config ./examples/config.yaml [-control-listen 127.0.0.1:19090]
```

Alias: `vmflow d`.

El daemon carga el archivo de configuración, inicia la API de control y aplica las reglas como una instantánea. Luego sigue sirviendo hasta que se interrumpe (`SIGINT` / `SIGTERM`, que es también cómo lo detienen systemd y launchd).

## Flags

| Flag | Por defecto | Descripción |
| --- | --- | --- |
| `-config` | _(obligatorio)_ | Ruta al archivo de configuración YAML. |
| `-control-listen` | _(desde la configuración)_ | Sobrescribe la dirección de escucha de la API de control (`control_listen_addr` en la configuración, cuyo valor por defecto es `127.0.0.1:19090`). |
| `-insecure-allow-remote-control` | `false` | **Peligroso:** permite vincular la API de control a una dirección no loopback sin auth. Consulta [Despliegue](./deployment). |
| `-log-file` | _(stdout)_ | Escribe los logs en este archivo en lugar de stdout (útil bajo un gestor de servicios; obligatorio en Windows). |

## Seguridad de arranque {#startup-safety}

El daemon se niega a arrancar cuando la API de control se vincula a una dirección no loopback (`0.0.0.0`, `::`, una IP no loopback o `:port`) sin autenticación, ya que ello expondría un endpoint de control remoto sin autenticar. Para arrancar de todos modos, puedes:

- vincular a `127.0.0.1` (el valor por defecto),
- habilitar `auth` en la configuración,
- habilitar TLS mutuo (`control_tls.client_ca_file`), o
- pasar `-insecure-allow-remote-control` para reconocer el riesgo.

## Comportamiento en ejecución

- Al arrancar, las reglas se aplican vía instantánea (`ReplaceAll`). Consulta [Reglas y ciclo de vida](./rules).
- La API de control expone [health, rules, stats, precheck, reload, metrics](./api).
- `POST /v1/reload` (o `vmflow ctl reload`) vuelve a leer la configuración y la reaplica tras la [verificación previa](./precheck).
- Para ejecutarlo como servicio gestionado al arrancar, consulta [`vmflow service`](./service).
