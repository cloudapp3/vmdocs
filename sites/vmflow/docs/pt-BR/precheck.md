---
title: Precheck
description: Valide uma configuração do vmflow antes de aplicá-la — IDs duplicados, conflitos de listener, vinculabilidade de porta e resolução de DNS.
---

# Precheck

O precheck valida uma configuração **sem aplicá-la**. Ele é executado automaticamente antes de todo `reload`, e você pode executá-lo sob demanda para verificar com segurança uma alteração de configuração.

## Execute

```bash
vmflow ctl precheck
```

Ou pela API: `GET|POST /v1/precheck`.

## O que ele verifica

O precheck produz uma lista de achados, cada um sendo um **erro** ou um **aviso**. Erros bloqueiam um recarregamento; avisos não.

| Verificação | Severidade | Observações |
| --- | --- | --- |
| Validação do modelo de regra | error | Campos de regra malformados. |
| `duplicate_rule_id` | error | O mesmo ID aparece mais de uma vez no snapshot. |
| Conflito de listener | error | Duas regras reivindicam o mesmo `listen_addr:port`. |
| Vinculabilidade de porta | error | De fato tenta vincular a porta de escuta para confirmar que está disponível. |
| Resolução de DNS do alvo | error | O `target_addr` deve resolver. |
| Configuração de domínio HTTPS | — | _Desativado no build atual_ (protocolos http/https são rejeitados). |
| Endereço ACME HTTP-01 | — | _Desativado no build atual_ (subsistema ACME está desligado). |
| Privilégio de porta baixa | warning | Vincular portas privilegiadas (<1024) geralmente requer permissões elevadas. |

## Exemplo de resposta

```json
{
  "config_path": "./examples/config.yaml",
  "rule_count": 1,
  "result": {
    "ok": true,
    "error_count": 0,
    "warning_count": 0,
    "checked_rules": 1,
    "checked_time_ms": 1,
    "items": []
  }
}
```

## Como o recarregamento o utiliza

`POST /v1/reload` executa as mesmas verificações primeiro. Se `error_count > 0`, o recarregamento é rejeitado e as regras em execução são deixadas exatamente como estavam. Isso torna seguro o envio de edições de configuração por meio de automação: uma configuração quebrada não pode ser parcialmente aplicada.

::: warning Portas locais
A sonda de vinculabilidade de porta abre um listener local brevemente. Se o seu ambiente bloquear a criação de sockets locais, o precheck (e, portanto, o recarregamento) não poderá validar totalmente a vinculabilidade.
:::
