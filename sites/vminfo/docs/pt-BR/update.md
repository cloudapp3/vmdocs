---
title: update
description: Verifica ou instala a versão mais recente marcada do vminfo.
---

# `vminfo update`

Verifica o GitHub Releases e, quando possível, instala o build marcado mais recente.

## Uso

```bash
vminfo update
vminfo update --check
vminfo update --version v0.1.0
```

## Notas

- `--check` apenas verifica se há atualizações.
- `--version` verifica ou instala uma tag de versão específica.
- Um build de desenvolvimento não pode se atualizar automaticamente sem `--version`.
- No Windows, o modo de instalação não é compatível porque o binário não pode se substituir no próprio local.

## Exemplo

```bash
vminfo update --check
```

## Relacionado

- [Instalação](/pt-BR/installation)
- [Changelog](/changelog)
