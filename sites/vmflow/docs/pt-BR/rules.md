---
title: Regras e Ciclo de Vida
description: Gerencie as regras de encaminhamento do vmflow — operações de regra única, aplicação de snapshot completo com diff incremental e consultas de estado.
---

# Regras e Ciclo de Vida

Uma *regra* é a unidade que o vmflow gerencia: uma entrada de encaminhamento `{protocol, listen, target}` com limites e metadados. As regras têm um ciclo de vida que pode ser guiado uma de cada vez ou como um snapshot inteiro de estado desejado.

## Identidade estável

Cada regra tem um `rule_id` que deve ser único dentro de uma configuração/snapshot. O ID é como o vmflow faz a correspondência de uma regra recebida com uma em execução para decidir o que mudou. Mantenha os IDs estáveis entre recarregamentos — é isso que faz o diff funcionar.

## Operações de regra única

| Operação | Efeito |
| --- | --- |
| `StartRule` | Inicia uma regra (não deve estar já em execução). |
| `RestartRule` | Para e inicia uma regra em execução, capturando novos campos. |
| `StopRule` | Para uma regra em execução; mantém sua configuração. |
| `RemoveRule` | Para e descarta uma regra do conjunto ativo. |

Essas são boas para operações locais direcionadas. Quando você tem um estado desejado completo, prefira a aplicação de snapshot.

## Aplicação de snapshot

`ApplySnapshot(rules, opts)` recebe o conjunto completo desejado de regras e o reconcilia com o que está em execução. Com `ReplaceAll`, qualquer regra em execução ausente do snapshot é parada.

Para cada regra, a aplicação produz uma ação:

| Ação | Significado |
| --- | --- |
| `started` | A regra está no snapshot, mas não estava em execução. |
| `restarted` | A regra estava em execução, mas seus campos de tempo de execução mudaram. |
| `stopped` | A regra estava em execução, mas está ausente do snapshot (com `ReplaceAll`). |
| `removed` | A regra foi parada e descartada. |
| `unchanged` | A regra estava em execução e seus campos de tempo de execução não mudaram. |
| `failed` | A regra não pôde ser iniciada (ex.: porta indisponível). |

…e um resumo: `Applied`, `Stopped`, `Failed`, `Total`.

::: tip O que conta como "alterado"?
Apenas campos de runtime (protocolo, endereços/portas, speed limit legado, bandwidth compartilhado, traffic quota, máx. de conexões, `idle_timeout`, política Source IP e enabled) são comparados. Editar `remark`, timestamps ou reordenar CIDRs equivalentes **não** reinicia a regra. Alterar bandwidth, quota ou a política efetiva reinicia a regra e fecha conexões/sessões, mas preserva o uso da cota do mesmo `rule_id`.
:::

## Recarregar

`vmflow ctl reload` recarrega o arquivo de configuração e executa `ApplySnapshot` com `ReplaceAll = true`. Ele executa o [precheck](./precheck) primeiro; em caso de qualquer erro, o recarregamento é rejeitado e as regras em execução permanecem intactas.

## Consultas de estado

| Método | Retorna |
| --- | --- |
| `RunningRules` / `RunningCount` | Regras em execução no momento / contagem. |
| `Snapshot(id)` | Estado ativo de uma regra. |
| `SnapshotAll()` | Estado ativo de todas as regras em execução. |
| `StopAll()` | Para tudo (ex.: no desligamento). |
