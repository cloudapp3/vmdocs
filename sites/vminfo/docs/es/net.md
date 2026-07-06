---
title: net
description: "Diagnóstico de red bajo demanda: resolución DNS, prueba de puerto TCP, ping y consulta geográfica de IP pública."
---

# `vminfo net`

Ejecuta diagnósticos de red puntuales desde el mismo binario que ya usas para las
métricas del host. Cada subcomando imprime por defecto una salida legible por
humanos y acepta `--json` para scripting.

## Subcomandos

| Acción | Qué hace |
| --- | --- |
| `net dns` | Resuelve un dominio a direcciones |
| `net port` | Prueba la conectividad y latencia TCP a `host:port` |
| `net ping` | Sondea un host con RTT TCP o ICMP |
| `net ip` | Consulta la IP pública + información de ASN / geográfica |

## `net dns`

```bash
vminfo net dns example.com
vminfo net dns example.com --server 1.1.1.1
vminfo net dns example.com --server 1.1.1.1 --json
```

| Flag | Descripción |
| --- | --- |
| dominio posicional | El dominio a resolver (exactamente uno) |
| `--server` | Servidor DNS como `host` o `host:port`; vacío = predeterminado del sistema |
| `--json` | Escribe el resultado como JSON |

## `net port`

```bash
vminfo net port example.com 443
vminfo net port example.com 443 --timeout 3s --json
```

| Flag | Descripción |
| --- | --- |
| `host` / `port` | Host y puerto objetivo (1–65535) |
| `--timeout` | Tiempo de espera de conexión, por defecto `2s` |
| `--json` | Escribe el resultado como JSON |

## `net ping`

```bash
vminfo net ping example.com                       # ping TCP, puerto 80
vminfo net ping example.com --tcp-port 443        # ping TCP en el 443
vminfo net ping example.com --mode icmp           # ping ICMP real (requiere privilegios)
vminfo net ping example.com --count 6 --json
```

| Flag | Descripción |
| --- | --- |
| host posicional | El host a sondear (exactamente uno) |
| `--mode` | `tcp` (por defecto) o `icmp` |
| `--count` | Número de sondeos, por defecto `4` |
| `--timeout` | Tiempo de espera por sondeo, por defecto `1s` |
| `--tcp-port` | Puerto TCP objetivo, por defecto `80` (solo modo tcp) |
| `--json` | Escribe el resultado como JSON |

::: tip TCP vs ICMP
El modo `tcp` mide RTT mediante TCP-dial — es multiplataforma y no requiere
privilegios, así que funciona en cualquier lugar. El modo `icmp` envía paquetes
reales ICMP Echo a través de `golang.org/x/net`; en Linux necesita
`net.ipv4.ping_group_range` para conceder el socket UDP ICMP sin privilegios, y
no es compatible con Windows. Si ICMP no está disponible, cambia a `--mode tcp`.
:::

## `net ip`

```bash
vminfo net ip                       # tu propia IP pública + ASN / geo
vminfo net ip 8.8.8.8               # consulta una IP específica
vminfo net ip --json
```

| Flag | Descripción |
| --- | --- |
| ip posicional | IP opcional a consultar; omitida = tu propia IP pública |
| `--server` | URL base del servicio de consulta, por defecto `https://ip.bestcheapvps.org` |
| `--json` | Escribe el resultado como JSON |

::: warning Petición saliente
`net ip` realiza una petición explícita, activada por el usuario, a un servicio
de consulta de terceros (`ip.bestcheapvps.org` por defecto) para obtener ASN,
datos geográficos y marcadores de riesgo. Esto se indica en `--help` y en la
salida del comando. Nunca se ejecuta automáticamente — solo cuando tú lo
solicitas.
:::

## Notas

- La salida legible está localizada; la salida JSON es estable e independiente del idioma.
- Los resultados JSON reflejan el tiempo en `elapsed_ms` y exponen errores en un campo `error`.
- Estos diagnósticos también están disponibles desde el panel web mediante
  [`POST /api/v1/net/diag`](/es/api#post-api-v1-net-diag).

## Ejemplo

```bash
vminfo net ping example.com --tcp-port 443 --count 4 --json
```

## Relacionado

- [HTTP API](/es/api)
- [panel web](/es/web-dashboard)
