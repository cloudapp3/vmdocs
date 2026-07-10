---
title: Incorporando o vmflow
description: Incorpore o runtime de encaminhamento do vmflow em seu próprio plano de controle em Go — divisão de responsabilidades, API recomendada, fluxo de dados e orientações de persistência.
---

# Incorporando o vmflow

O vmflow pode ser executado como um daemon autônomo, mas o runtime de encaminhamento principal também foi projetado para ser incorporado a um plano de controle maior em Go — seu próprio serviço que já gerencia usuários, armazenamento, uma UI ou orquestração de nós.

## Divisão de responsabilidades

Mantenha as responsabilidades separadas ao incorporar:

| Camada | Responsável por |
| --- | --- |
| Sua aplicação hospedeira | banco de dados, usuários, cobrança, UI web, orquestração de nós, propriedade de regras, agregação histórica |
| runtime do vmflow | encaminhamento TCP/UDP, ciclo de vida de regras, aplicação de limite máximo de conexões, contadores em tempo real |

A direção da dependência é unidirecional:

```text
your application  ->  github.com/cloudapp3/vmflow
```

O vmflow não deve importar os modelos, o código de banco de dados ou os protocolos de tarefas da sua aplicação.

## API recomendada

Para a maioria das integrações, use a fachada de nível superior:

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

A API de nível inferior `engine.Manager` também está disponível para uso avançado:

```go
manager := rt.Manager()
```

Prefira `Runtime.Apply` quando sua aplicação computar o estado desejado completo a partir de seu próprio banco de dados. Use `StartRule`, `RestartRule`, `StopRule` e `RemoveRule` apenas para operações locais direcionadas.

Consulte [API de Runtime](./runtime) para o conjunto completo de métodos.

## Fluxo de dados

Fluxo recomendado para uso incorporado:

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

Quando incorporado, **evite tornar o YAML a fonte da verdade**. Sua aplicação deve ser a dona do estado desejado e passar `[]engine.Rule` diretamente ao vmflow.

## Orientações de persistência

O vmflow pode fornecer um armazenamento local para o modo de daemon autônomo. Quando incorporado, prefira uma destas opções:

1. Persistir o histórico de tráfego e os logs de auditoria no banco de dados existente da sua aplicação.
2. Desabilitar qualquer armazenamento local do vmflow.
3. Usar o vmflow apenas para contadores em tempo real e o ciclo de vida do encaminhamento.

Isso evita duas fontes de verdade concorrentes.

## Regras HTTPS e certificados (desabilitado)

::: warning Desabilitado no build atual
O encaminhamento HTTPS e o gerenciamento de certificados/ACME **não estão habilitados**: a validação de regras do `engine` rejeita protocolos `http`/`https`, o daemon não inicia o ACME, e as rotas `/v1/certs*` e o subcomando `certs` da CLI foram removidos. As notas abaixo descrevem a interface reservada para quando for reativado. O código-fonte é mantido em `acme/`, `certstore/`, `certreview/`, `engine/https.go`, `engine/proxy.go`.
:::

Regras HTTPS exigem um provedor de certificados. O daemon autônomo pode usar o gerenciador ACME integrado. Aplicações incorporadas podem injetar seu próprio provedor:

```go
rt := vmflow.NewRuntime(vmflow.Options{
    CertProvider: myProvider,
})
```

O provedor deve satisfazer:

```go
type CertProvider interface {
    GetCertificate(hello *tls.ClientHelloInfo) (*tls.Certificate, error)
    Obtain(ctx context.Context, domains []string) error
}
```

## Pacotes estáveis vs. opcionais

Superfície estável de incorporação:

```text
github.com/cloudapp3/vmflow
github.com/cloudapp3/vmflow/engine
```

Pacotes opcionais de daemon/controle:

```text
config/
controlapi/
tui/
bot/
acme/
cmd/
```

Os pacotes opcionais são úteis para implantações autônomas do vmflow, mas não devem ser exigidos por uma integração incorporada.

## Encerramento

Use `Close` ou `Shutdown` quando sua aplicação encerrar:

```go
_ = rt.Shutdown(ctx)
```

A implementação atual para de forma síncrona. A assinatura `Shutdown(ctx)` está reservada para suporte futuro a drenagem suave (graceful drain).
