---
title: Hoja de ruta
description: vmflow v0.3.0 es la versión estable actual; las funciones publicadas y el trabajo futuro se registran por separado.
---

# Hoja de ruta

vmflow v0.3.0 es la versión estable actual. El reenvío L4, el plano de control local, la observabilidad, el ciclo de vida del servicio nativo, el control de tráfico, la TUI y la API de embebido ya están disponibles.

## Funciones base entregadas antes de v0.3.0

- [x] Reenvío TCP, UDP y `tcp+udp`
- [x] `ApplySnapshot`, ciclo de vida de reglas y recarga en caliente de YAML
- [x] Gestión local mediante CLI/TUI
- [x] Métricas de Prometheus y logging estructurado
- [x] Autenticación de gestión y verificación previa de reglas
- [x] API de runtime Go embebible

## v0.3.0 - publicada el 2026-08-03

- [x] Límites de ancho de banda upload/download compartidos por regla
- [x] Cuotas de tráfico diarias y mensuales persistentes
- [x] Conmutación automática de DNS para verificaciones y reenvío saliente
- [x] Panel Host Network con contadores y tasas de interfaces en vivo
- [x] Localización de CLI/TUI en inglés y chino simplificado
- [x] Instalación, arranque, estado y recuperación desde TUI del servicio nativo
- [x] Herramientas MCP de solo lectura por stdio para diagnóstico local

## Trabajo futuro

- [ ] Drenaje ordenado de conexiones existentes
- [ ] API de suscripción a eventos
- [ ] Verificación manual en Windows y macOS
- [ ] Imagen Docker oficial y ejemplos de despliegue
- [ ] Mayor cobertura multiplataforma y de integración

## Reservado para más adelante

El reenvío HTTP/HTTPS y la gestión de certificados ACME están implementados en el código fuente (`engine/https.go`, `engine/proxy.go`, `acme/`, `certstore/`, `certreview/`) pero deshabilitados en el build actual. El cruce de NAT (`tunnel/`) se conserva igualmente, sin conectar. Ambos son candidatos a una release futura una vez que la superficie L4 se estabilice.
