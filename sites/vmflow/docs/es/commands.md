---
title: Referencia de comandos
description: Referencia de la CLI de vmflow — subcomandos daemon, ctl, tui, version, update, service, uninstall y sus alias.
---

# Referencia de comandos

vmflow es un único binario con siete subcomandos. Los alias se muestran en la tabla siguiente.

| Comando | Alias | Propósito |
| --- | --- | --- |
| [`daemon`](./daemon) | `d` | Ejecuta el daemon de reenvío. |
| [`ctl`](./ctl) | `c` | Consulta y controla un daemon en ejecución. |
| [`tui`](./tui) | `t` | Panel de terminal. |
| [`version`](./version) | `v` | Imprime los metadatos de build. |
| [`update`](./update) | `u` | Comprueba o instala una release más reciente. |
| [`service`](./service) | `svc` | Registra como servicio nativo del SO (arranque en boot). |
| [`uninstall`](./uninstall) | `remove`, `rm` | Desinstalación con un solo comando y limpieza. |

## Flags comunes de cliente {#common-client-flags}

`ctl` y `tui` son clientes de la [API de control](./api) y comparten estas flags:

| Flag | Variable de entorno | Por defecto | Descripción |
| --- | --- | --- | --- |
| `-addr` | _(ninguna)_ | `http://127.0.0.1:19090` | URL base de la API de control. |
| `-token` | `VMFLOW_CONTROL_TOKEN` | _(ninguna)_ | Bearer token cuando auth está habilitado. |
| `-tls-ca-file` | `VMFLOW_TLS_CA_FILE` | _(ninguna)_ | Bundle de CA para verificar el certificado del servidor de la API de control (CAs privadas/autofirmadas). |
| `-tls-client-cert` | `VMFLOW_TLS_CLIENT_CERT` | _(ninguna)_ | Certificado de cliente para mTLS (obligatorio cuando el servidor define `control_tls.client_ca_file`). |
| `-tls-client-key` | `VMFLOW_TLS_CLIENT_KEY` | _(ninguna)_ | Clave de cliente para mTLS (se usa con `-tls-client-cert`). |
| `-tls-skip-verify` | `VMFLOW_TLS_INSECURE` (`1`/`true`) | `false` | Omite la verificación del certificado del servidor (peligroso, solo para depuración). |
| `-H` / `--header` | `VMFLOW_HEADERS` (separadas por `;`) | _(ninguna)_ | Cabecera de petición extra como `Name: Value` (repetible). |

## Notas

- Los antiguos binarios separados `relayd`, `relayctl` y `relaytui` aún se pueden compilar por compatibilidad — son thin shims sobre los mismos paquetes y leen la misma variable de entorno `VMFLOW_CONTROL_TOKEN` — pero las releases prefieren el binario unificado `vmflow`.
- Los comandos de túnel (`tunnel-server`, `tunnel-client`, `tunnel-ctl`) y de certificados (`certs`, `certs-obtain`, `certs-review`) **no están habilitados** en el build actual.
