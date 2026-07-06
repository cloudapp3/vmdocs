---
title: Resumen
description: Qué hace vminfo y qué métricas del host recopila.
---

# Resumen

vminfo es un kit de herramientas multiplataforma de información del tiempo de ejecución del host para diagnóstico local rápido.

## Qué te ofrece

- **TUI** — un panel a pantalla completa en la terminal
- **Salida JSON** — instantáneas y flujos continuos aptos para scripts
- **Panel web** — una interfaz ligera en el navegador con endpoints REST y WebSocket
- **Biblioteca Go** — recolección de métricas importable y APIs de TUI embebido

## Métricas recopiladas

vminfo recopila:

- uso de CPU, uso por núcleo, frecuencia de CPU
- uso de memoria y swap
- uso de disco y E/S de disco
- totales de red, velocidades, conteos TCP/UDP
- distribución de estados TCP (`ESTABLISHED` / `TIME_WAIT` / `SYN_RECV` / …) y uso de conntrack (Linux)
- tráfico, errores y descartes por interfaz
- listas de procesos y metadatos de procesos
- lecturas de temperatura
- tiempo de actividad y metadatos del host

## Tipos públicos de Go

- `StaticInfo`
- `RuntimeStats`
- `Snapshot`
- `ProcessInfo`
- `AppMetadata`

## Puntos de entrada habituales

- `vminfo`
- `vminfo info`
- `vminfo summary`
- `vminfo watch`
- `vminfo --web`
- `vminfo ps`
- `vminfo kill <pid>`
- `vminfo net dns | port | ping | ip`
- `vminfo update`

## Buenos casos de uso

vminfo es una buena opción cuando quieres:

- un único binario para inspección rápida del host
- una interfaz de terminal legible para trabajo interactivo
- JSON para scripts, CI o automatización
- un panel en el navegador sin desplegar una pila de monitorización
- una biblioteca de Go que puedas integrar en otra CLI
