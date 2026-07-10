---
title: Hoja de ruta
description: Hoja de ruta de releases de vmflow — línea base v0.1 publicada, v0.2 en curso, v0.3 planificada.
---

# Hoja de ruta

vmflow se encuentra en un MVP práctico estilo v0.1. La ruta de reenvío, el ciclo de vida de las reglas, el plano de control local, lo básico de observabilidad y la API de embebido están listos.

## v0.1 — línea base

- [x] Reenvío TCP
- [x] Reenvío UDP
- [x] `ApplySnapshot`
- [x] daemon + CLI
- [x] API de control local
- [x] Configuración YAML

## v0.2 — en curso

- [x] Métricas de Prometheus
- [x] Mejor logging estructurado
- [x] Autenticación de la API de control
- [x] Verificación previa de reglas
- [ ] Drenaje ordenado
- [ ] Verificación manual en Windows / macOS

## v0.3 — planificada

- [ ] Bucket compartido de ancho de banda por regla
- [ ] API de suscripción a eventos
- [ ] Mejoras de recarga en caliente de configuración
- [x] Servicio nativo de arranque (systemd / launchd / Windows Service vía `vmflow service install`)
- [ ] Imagen Docker oficial / ejemplos

## Reservado para más adelante

El reenvío HTTP/HTTPS y la gestión de certificados ACME están implementados en el código fuente (`engine/https.go`, `engine/proxy.go`, `acme/`, `certstore/`, `certreview/`) pero deshabilitados en el build actual. El cruce de NAT (`tunnel/`) se conserva igualmente, sin conectar. Ambos son candidatos a una release futura una vez que la superficie L4 se estabilice.
