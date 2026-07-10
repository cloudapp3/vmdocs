---
title: Embeber vmflow
description: Embebe el runtime de reenvío de vmflow en tu propio plano de control en Go — separación de responsabilidades, API recomendada, flujo de datos y guía de persistencia.
---

# Embeber vmflow

vmflow puede ejecutarse como un daemon independiente, pero el núcleo del runtime de reenvío también está diseñado para emeberse dentro de un plano de control en Go más amplio — tu propio servicio que ya gestiona usuarios, almacenamiento, una interfaz o la orquestación de nodos.

## Separación de responsabilidades

Mantén las responsabilidades separadas al embeber:

| Capa | Es propietaria de |
| --- | --- |
| Tu aplicación host | base de datos, usuarios, facturación, interfaz web, orquestación de nodos, propiedad de las reglas, agregación histórica |
| Runtime de vmflow | reenvío TCP/UDP, ciclo de vida de las reglas, aplicación del máximo de conexiones, contadores en tiempo real |

La dirección de la dependencia es unidireccional:

```text
your application  ->  github.com/cloudapp3/vmflow
```

vmflow no debe importar los modelos de tu aplicación, el código de base de datos ni los protocolos de tareas.

## API recomendada

Para la mayoría de integradores, usa la fachada de nivel superior:

```go
package main

import (
    "github.com/cloudapp3/vmflow"
    "github.com/cloudapp3/vmflow/engine"
)

func main() {
    rt := vmflow.New()
    defer rt.Close()

    rules := []engine.Rule{
        {
            RuleID:     "ssh-forward",
            Name:       "ssh-forward",
            Protocol:   engine.ProtocolTCP,
            ListenAddr: "0.0.0.0",
            ListenPort: 2201,
            TargetAddr: "127.0.0.1",
            TargetPort: 22,
            Enabled:    true,
        },
    }

    result := rt.Apply(rules) // full replacement snapshot
    if result.FailedRules > 0 {
        // handle failed rules in your application
    }

    snapshots := rt.SnapshotAll()
    _ = snapshots
}
```

La API de nivel inferior `engine.Manager` también está disponible para usos avanzados:

```go
manager := rt.Manager()
```

Prefiere `Runtime.Apply` cuando tu aplicación calcula el estado deseado completo desde su propia base de datos. Usa `StartRule`, `RestartRule`, `StopRule` y `RemoveRule` solo para operaciones locales concretas.

Consulta [Runtime API](./runtime) para el conjunto completo de métodos.

## Flujo de datos

Flujo recomendado para uso embebido:

```text
your DB / business API
        ↓
convert business forwarding records to []engine.Rule
        ↓
vmflow.Runtime.Apply(rules)
        ↓
vmflow.Runtime.SnapshotAll()
        ↓
your application samples and persists traffic history in its own DB
```

Al embeber, **evita que YAML sea la fuente de verdad**. Tu aplicación debería ser propietaria del estado deseado y pasar `[]engine.Rule` directamente a vmflow.

## Guía de persistencia

vmflow puede ofrecer un almacén local para el modo daemon independiente. Al embeber, prefiere una de estas opciones:

1. Persiste el historial de tráfico y los logs de auditoría en la base de datos existente de tu aplicación.
2. Deshabilita cualquier almacén local de vmflow.
3. Usa vmflow solo para contadores en tiempo real y el ciclo de vida del reenvío.

Esto evita dos fuentes de verdad competidoras.

## Reglas y certificados HTTPS (deshabilitado)

::: warning Deshabilitado en el build actual
El reenvío HTTPS y la gestión de certificados ACME **no están habilitados**: la validación de reglas de `engine` rechaza los protocolos `http`/`https`, el daemon no inicia ACME y las rutas `/v1/certs*` y el subcomando CLI `certs` se han eliminado. Las notas siguientes describen la interfaz reservada para cuando se rehabilite. El código fuente se conserva en `acme/`, `certstore/`, `certreview/`, `engine/https.go`, `engine/proxy.go`.
:::

Las reglas HTTPS requieren un proveedor de certificados. El daemon independiente puede usar el gestor ACME integrado. Las aplicaciones embebidas pueden inyectar su propio proveedor:

```go
rt := vmflow.NewRuntime(vmflow.Options{
    CertProvider: myProvider,
})
```

El proveedor debe satisfacer:

```go
type CertProvider interface {
    GetCertificate(hello *tls.ClientHelloInfo) (*tls.Certificate, error)
    Obtain(ctx context.Context, domains []string) error
}
```

## Paquetes estables frente a opcionales

Superficie de embebido estable:

```text
github.com/cloudapp3/vmflow
github.com/cloudapp3/vmflow/engine
```

Paquetes opcionales de daemon/control:

```text
config/
controlapi/
tui/
bot/
acme/
cmd/
```

Los paquetes opcionales son útiles para despliegues independientes de vmflow, pero no deberían ser necesarios para una integración embebida.

## Apagado

Usa `Close` o `Shutdown` cuando tu aplicación se detiene:

```go
_ = rt.Shutdown(ctx)
```

La implementación actual se detiene de forma síncrona. La firma `Shutdown(ctx)` queda reservada para un futuro soporte de drenaje ordenado.
