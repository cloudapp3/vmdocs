---
title: Встраивание vmflow
description: Встраивание среды выполнения перенаправления vmflow в собственную плоскость управления на Go — разделение ответственности, рекомендуемый API, поток данных и руководство по персистентности.
---

# Встраивание vmflow

vmflow может работать как standalone-демон, но основная среда выполнения перенаправления также спроектирована для встраивания в более крупную плоскость управления на Go — ваш собственный сервис, который уже владеет пользователями, хранилищем, UI или оркестрацией узлов.

## Разделение ответственности

При встраивании разделяйте ответственности:

| Слой | Владеет |
| --- | --- |
| Ваше хост-приложение | базой данных, пользователями, биллингом, веб-UI, оркестрацией узлов, принадлежностью правил, агрегацией истории |
| Среда выполнения vmflow | перенаправлением TCP/UDP, жизненным циклом правил, контролем максимального числа соединений, счётчиками в реальном времени |

Направление зависимости одностороннее:

```text
your application  ->  github.com/cloudapp3/vmflow
```

vmflow не должен импортировать модели вашего приложения, код работы с БД или протоколы задач.

## Рекомендуемый API

Для большинства встраивающих используйте фасад верхнего уровня:

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

Низкоуровневый API `engine.Manager` также доступен для продвинутых сценариев:

```go
manager := rt.Manager()
```

Предпочитайте `Runtime.Apply`, когда ваше приложение вычисляет полное желаемое состояние из собственной базы данных. Используйте `StartRule`, `RestartRule`, `StopRule` и `RemoveRule` только для целевых локальных операций.

Полный набор методов см. в [Runtime API](./runtime).

## Поток данных

Рекомендуемый поток при встраивании:

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

При встраивании **не делайте YAML источником истины**. Ваше приложение должно владеть желаемым состоянием и передавать `[]engine.Rule` напрямую в vmflow.

## Руководство по персистентности

vmflow может предоставлять локальное хранилище для standalone-режима демона. При встраивании предпочтите одно из:

1. Храните историю трафика и журналы аудита в существующей базе данных вашего приложения.
2. Отключите любое локальное хранилище vmflow.
3. Используйте vmflow только для счётчиков в реальном времени и жизненного цикла перенаправления.

Это исключает два конкурирующих источника истины.

## Правила HTTPS и сертификаты (отключено)

::: warning Отключено в текущей сборке
Перенаправление HTTPS и управление ACME/сертификатами **не включены**: валидация правил в `engine` отвергает протоколы `http`/`https`, демон не запускает ACME, а маршруты `/v1/certs*` и подкоманда CLI `certs` удалены. Приведённые ниже заметки описывают зарезервированный интерфейс на случай повторного включения. Исходный код сохранён в `acme/`, `certstore/`, `certreview/`, `engine/https.go`, `engine/proxy.go`.
:::

Правила HTTPS требуют провайдера сертификатов. Standalone-демон может использовать встроенный ACME-менеджер. Встраиваемые приложения могут внедрить собственный провайдер:

```go
rt := vmflow.NewRuntime(vmflow.Options{
    CertProvider: myProvider,
})
```

Провайдер должен удовлетворять:

```go
type CertProvider interface {
    GetCertificate(hello *tls.ClientHelloInfo) (*tls.Certificate, error)
    Obtain(ctx context.Context, domains []string) error
}
```

## Стабильные и опциональные пакеты

Стабильная поверхность встраивания:

```text
github.com/cloudapp3/vmflow
github.com/cloudapp3/vmflow/engine
```

Опциональные пакеты демона/control:

```text
config/
controlapi/
tui/
bot/
acme/
cmd/
```

Опциональные пакеты полезны для standalone-развёртываний vmflow, но не должны требоваться при встраивании.

## Завершение работы

Используйте `Close` или `Shutdown` при выходе приложения:

```go
_ = rt.Shutdown(ctx)
```

Текущая реализация останавливается синхронно. Форма `Shutdown(ctx)` зарезервирована для будущей поддержки аккуратного освобождения ресурсов.
