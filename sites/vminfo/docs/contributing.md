---
title: Contributing
description: How to contribute documentation improvements to the vminfo docs site.
---

# Contributing

Thanks for helping improve the vminfo documentation site. Documentation fixes, examples, screenshots, SEO improvements, translations, and focused pull requests are all welcome.

Chinese or English issues and PRs are both welcome.

## Ways to contribute

- Report documentation bugs or outdated examples
- Request new guide, CLI, API, or library pages
- Improve documentation, examples, or onboarding
- Add screenshots or improve visual explanations
- Improve English and Chinese documentation consistency

## Before you start

- Prefer opening an issue first for large documentation rewrites
- For small documentation fixes, feel free to open a pull request directly
- Keep changes small and focused
- Avoid adding new documentation dependencies unless there is a strong reason and prior discussion
- Do not revert unrelated user changes in the working tree

## Repository layout

- `sites/vminfo/docs/` — vminfo VitePress documentation source
- `sites/vminfo/docs/.vitepress/` — vminfo VitePress and Teek configuration
- `sites/vminfo/docs/assets/` — screenshots and GIFs
- `sites/vminfo/docs/public/` — public static assets such as logo and favicon
- `sites/<project>/docs/` — future docs sites for additional subdomains
- `package.json` — local development and build scripts

## Compatibility expectations

- Keep documentation consistent with the source project at [cloudapp3/vminfo](https://github.com/cloudapp3/vminfo)
- Do not invent CLI flags, HTTP endpoints, or Go APIs
- Check source code before documenting behavior that may have changed
- Keep internal links and image paths valid
- Do not commit generated files such as `sites/*/docs/.vitepress/dist/`

## Local development

```bash
git clone https://github.com/cloudapp3/vmdocs.git
cd vmdocs
pnpm install
pnpm docs:dev:vminfo
pnpm docs:build:vminfo
pnpm docs:preview:vminfo
```

When documenting source behavior, also inspect the source project:

```bash
git clone https://github.com/cloudapp3/vminfo.git
```

## Pull request checklist

- [ ] The change is focused and clearly described
- [ ] `pnpm docs:build:vminfo` passes
- [ ] Links and image paths are valid
- [ ] New or important pages include clear frontmatter
- [ ] English and Chinese docs were updated together when appropriate
- [ ] No unrelated files were reverted

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](https://github.com/cloudapp3/vminfo/blob/main/LICENSE).
