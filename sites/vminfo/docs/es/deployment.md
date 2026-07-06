---
title: Despliegue
description: Despliega el sitio de documentación en Cloudflare Pages con la salida de compilación y la configuración de dominio personalizado correctas.
---

# Despliegue

Este sitio de documentación está diseñado para desplegarse sin problemas en Cloudflare Pages desde el monorrepo de documentación `cloudapp3/vmdocs`.

## Ajustes de Cloudflare Pages

| Ajuste | Valor |
| --- | --- |
| Preset de framework | VitePress o None |
| Comando de build | `pnpm docs:build:vminfo` |
| Directorio de salida de build | `sites/vminfo/docs/.vitepress/dist` |
| Directorio raíz | `/` |
| Versión de Node.js | 20 o superior |

Si tu proyecto de Pages necesita instalar dependencias durante el build, usa:

```bash
corepack enable && pnpm install --frozen-lockfile && pnpm docs:build:vminfo
```

## Dominio personalizado

- Usa un subdominio de documentación como `vminfo.bestcheapvps.org`
- Añade primero el dominio personalizado dentro del proyecto de Cloudflare Pages
- Luego configura el DNS como indique Cloudflare
- No crees únicamente un CNAME manual sin vincular el proyecto de Pages

## Ruta base

- Para un dominio personalizado en la raíz del sitio, no establezcas `base`
- Para un despliegue en una subruta como `https://example.com/vminfo/`, establece `base: "/vminfo/"`

## Salida

Cloudflare Pages debería publicar el sitio estático desde `sites/vminfo/docs/.vitepress/dist`.
