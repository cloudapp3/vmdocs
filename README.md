# vmdocs

Monorepo documentation source for vminfo and future bestcheapvps.org subdomain docs sites.

- Live site: https://vminfo.bestcheapvps.org
- Source project: https://github.com/cloudapp3/vminfo
- Docs repo: https://github.com/cloudapp3/vmdocs

## Local development

```bash
pnpm install
pnpm docs:dev:vminfo
pnpm docs:build:vminfo
pnpm docs:preview:vminfo
```

Compatibility aliases are also available for the current default site:

```bash
pnpm docs:dev
pnpm docs:build
pnpm docs:preview
```

## What lives here

- vminfo docs source in `sites/vminfo/docs/`
- vminfo Cloudflare Pages output at `sites/vminfo/docs/.vitepress/dist`
- shared dependencies and build scripts at the repository root
- room for future docs sites under `sites/<project>/docs/`
