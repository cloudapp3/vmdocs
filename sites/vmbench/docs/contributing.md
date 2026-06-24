---
title: Contributing
description: How to contribute documentation improvements to the vmbench docs site.
---

# Contributing

Thanks for helping improve the vmbench documentation site. Documentation fixes, examples, screenshots, translations, SEO improvements, and focused pull requests are welcome.

## Repository layout

- `sites/vmbench/docs/` — vmbench VitePress documentation source
- `sites/vmbench/docs/.vitepress/` — vmbench VitePress and Teek configuration
- `sites/vmbench/docs/public/` — public static assets such as logo and favicon
- `package.json` — local development and build scripts

## Local development

```bash
git clone https://github.com/cloudapp3/vmdocs.git
cd vmdocs
pnpm install
pnpm docs:dev:vmbench
pnpm docs:build:vmbench
pnpm docs:preview:vmbench
```

When documenting source behavior, also inspect the source project:

```bash
git clone https://github.com/cloudapp3/vmbench.git
```

## Pull request checklist

- [ ] The change is focused and clearly described
- [ ] `pnpm docs:build:vmbench` passes
- [ ] Links and image paths are valid
- [ ] English and Chinese docs were updated together when appropriate
- [ ] No generated files such as `.vitepress/dist/` were committed
