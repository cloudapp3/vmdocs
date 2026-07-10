---
title: vmflow update
description: Verifica ou instala a versão mais recente do vmflow — vmflow update, --check, --version.
---

# vmflow update

Verifica o GitHub Releases e instala o build mais recente com tag do `vmflow` no lugar.

```bash
vmflow update [--check] [--version <tag>]
```

Alias: `vmflow u`.

## Flags

| Flag | Descrição |
| --- | --- |
| `--check` | Apenas verifica se há atualizações; não instala. |
| `--version <tag>` | Instala ou inspeciona uma tag de release específica (ex. `v0.1.1`). |

## O que faz

1. Consulta a API do GitHub Releases para `cloudapp3/vmflow`.
2. Compara a release mais recente com a versão do build em execução.
3. Ao instalar: baixa o pacote para o SO/arquitetura atual, verifica-o contra `checksums.txt` com SHA-256, extrai o binário e substitui atomicamente o binário `vmflow` em execução.

## Exemplos

Verifique se há uma release mais recente disponível, sem instalar:

```bash
vmflow update --check
```

Instale a release mais recente:

```bash
vmflow update
```

Instale uma versão específica:

```bash
vmflow update --version v0.1.1
```

## Observações

- Um build `dev` (por exemplo, compilado a partir do código-fonte sem ldflags de release) não consegue fazer autoatualização sem `--version`, pois sua versão atual é desconhecida. Use `vmflow update --version vX.Y.Z` nesse caso.
- As verificações de atualização são armazenadas em cache por 24 horas no seu diretório de cache (`~/.cache/vmflow/update-check.json`, ou `$XDG_CACHE_HOME/vmflow`). Use `--version` para ignorar o cache para uma tag específica.
- **Windows**: a autoatualização (substituição de binário) não é suportada; o `--check` ainda funciona. Reinstale com `install.sh` ou o pacote da release para atualizar no Windows.
- Para releases privadas ou limites de taxa de API do GitHub mais altos, defina `GITHUB_TOKEN` ou `GH_TOKEN`.
- A autoatualização substitui o binário em execução e precisa de permissão de gravação nele. Se falhar com um erro de permissão, execute novamente com privilégios apropriados (por exemplo `sudo`) ou corrija as permissões do caminho de instalação.

## Relacionados

- [Instalação](./installation)
- [Changelog](/changelog)
