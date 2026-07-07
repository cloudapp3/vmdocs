---
title: Implantação
description: Implante o site de documentação no Cloudflare Pages com a saída de build correta e as configurações de domínio personalizado.
---

# Implantação

Este site de documentação foi projetado para ser implantado sem problemas no Cloudflare Pages a partir do monorepo de documentação `cloudapp3/vmdocs`.

## Configurações do Cloudflare Pages

| Configuração | Valor |
| --- | --- |
| Preset de framework | VitePress ou None |
| Comando de build | `pnpm docs:build:vminfo` |
| Diretório de saída do build | `sites/vminfo/docs/.vitepress/dist` |
| Diretório raiz | `/` |
| Versão do Node.js | 20 ou superior |

Se o seu projeto do Pages precisar instalar dependências durante o build, use:

```bash
corepack enable && pnpm install --frozen-lockfile && pnpm docs:build:vminfo
```

## Domínio personalizado

- Use um subdomínio de documentação como `vminfo.bestcheapvps.org`
- Adicione o domínio personalizado dentro do projeto do Cloudflare Pages primeiro
- Depois configure o DNS conforme o Cloudflare indicar
- Não crie apenas um CNAME manual sem vincular o projeto do Pages

## Caminho base

- Para um domínio personalizado na raiz do site, não defina `base`
- Para uma implantação em um subcaminho como `https://example.com/vminfo/`, defina `base: "/vminfo/"`

## Saída

O Cloudflare Pages deve publicar o site estático a partir de `sites/vminfo/docs/.vitepress/dist`.
