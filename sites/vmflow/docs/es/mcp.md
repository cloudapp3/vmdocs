---
title: Servidor MCP
description: Conecta Claude, Codex y otros clientes MCP a un daemon vmflow mediante un adaptador stdio de solo lectura.
---

# Servidor MCP

`vmflow mcp` inicia en foreground un servidor MCP de solo herramientas sobre
stdio. Se conecta a un daemon vmflow ya activo mediante el canal de gestión
loopback. No inicia el reenvío, no abre un puerto de red MCP ni modifica la
configuración del daemon.

## Requisitos

- Ejecuta el comando MCP en el mismo host que el daemon vmflow.
- Mantén el listener de gestión del daemon limitado a loopback.
- Si la autenticación está habilitada, usa un token viewer dedicado mediante
  `VMFLOW_CONTROL_TOKEN`.

## Herramientas

| Herramienta | Propósito |
| --- | --- |
| `get_vmflow_status` | Resumen de conexión, versión, autorización, reglas, tráfico y estado degradado |
| `list_forwarding_rules` | Resúmenes filtrados sin detalles de endpoints ni políticas de origen |
| `get_forwarding_rule` | Configuración, estado y estadísticas de una regla seleccionada explícitamente |
| `get_traffic_stats` | Contadores filtrados por regla y totales agregados |
| `run_config_precheck` | Validación de solo lectura de la configuración persistida actual |

Todas las herramientas son de solo lectura. Las listas y el precheck devuelven
50 elementos por defecto y aceptan un máximo de 200. El adaptador permite como
máximo cuatro llamadas simultáneas.

## Token viewer

Configura un token dedicado al cliente MCP:

```yaml
auth:
  enabled: true
  tokens:
    - name: mcp-viewer
      token: replace-with-a-long-random-token
      role: viewer
```

Es preferible usar la variable de entorno en lugar de `-token`, que expondría
el token en la línea de comandos del proceso.

## Claude Desktop

```json
{
  "mcpServers": {
    "vmflow": {
      "command": "/usr/local/bin/vmflow",
      "args": ["mcp"],
      "env": {
        "VMFLOW_CONTROL_TOKEN": "replace-with-a-long-random-token"
      }
    }
  }
}
```

## Codex

```toml
[mcp_servers.vmflow]
command = "/usr/local/bin/vmflow"
args = ["mcp"]
env = { VMFLOW_CONTROL_TOKEN = "replace-with-a-long-random-token" }
```

Si el daemon usa un puerto de gestión distinto, añade `-addr` y la URL loopback
a `args`:

```json
"args": ["mcp", "-addr", "http://127.0.0.1:49127"]
```

`-addr` solo acepta `localhost` o una IP loopback. Para un daemon en otra
máquina, ejecuta `vmflow mcp` en esa máquina, por ejemplo mediante SSH, en lugar
de exponer el listener de gestión.

## Límite de datos

Los detalles de reglas pueden contener direcciones de destino, políticas de IP
de origen, dominios y notas. El tráfico y el precheck también pueden revelar la
topología de la red local. Los resultados se envían al modelo configurado en el
cliente MCP.

El servidor no expone escritura de configuración, YAML sin procesar, tokens de
bot, claves privadas de certificados, ejecución de shell, acceso a archivos,
prompts ni resources. El precheck puede resolver destinos que ya están en la
configuración del daemon.

## Solución de problemas

- `connected: false`: el daemon no está disponible en la dirección loopback.
- HTTP `401`: configura el token viewer correcto en `VMFLOW_CONTROL_TOKEN`.
- Endpoint de sesión no disponible: reinicia el daemon con la misma release de
  vmflow usada para iniciar el servidor MCP.
- TLS o mTLS personalizado: usa los mismos parámetros `-tls-*` compatibles con
  `vmflow ctl` y `vmflow tui`.
