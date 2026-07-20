# Contributing

Thanks for helping maintain the documentation sites in this repository.

## Workflow

1. Fork or branch the repository.
2. Run `corepack enable` and `pnpm install --frozen-lockfile`.
3. Start the target site with `pnpm docs:dev:<project>`.
4. Make focused edits under `sites/<project>/docs/`.
5. Verify with `pnpm docs:build:<project>`.
6. Open a pull request with the project name in the summary.

For tgbot:

```bash
pnpm docs:dev:tgbot
pnpm docs:build:tgbot
pnpm check:seo:tgbot
```

## Requirements

- Keep navigation and internal links valid.
- Update every registered language version of a translated page.
- Keep canonical URLs, sitemap hostname, robots metadata, and the production domain aligned.
- Never include real tokens, secrets, private keys, user payloads, or identifying screenshots.
- Do not commit `node_modules/`, VitePress cache files, or `sites/*/docs/.vitepress/dist/`.
