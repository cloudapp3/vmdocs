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

## Deploy the vminfo docs site

The public vminfo documentation site is deployed from this repository. These
settings are for documentation maintainers; they are not instructions for
deploying the vminfo application itself.

### Cloudflare Pages settings

| Setting | Value |
| --- | --- |
| Framework preset | VitePress or None |
| Build command | `pnpm docs:build:vminfo` |
| Build output directory | `sites/vminfo/docs/.vitepress/dist` |
| Root directory | `/` |
| Node.js version | 20 or newer |

If the Pages project needs to install dependencies during the build, use:

```bash
corepack enable && pnpm install --frozen-lockfile && pnpm docs:build:vminfo
```

Add the custom domain in the Cloudflare Pages project before creating or
changing its DNS record. The production site uses
`https://vminfo.bestcheapvps.org/` at the domain root, so the VitePress config
does not set `base`. A future subpath deployment such as
`https://example.com/vminfo/` would require `base: "/vminfo/"` instead.

Do not commit `sites/*/docs/.vitepress/dist/`; Cloudflare Pages must publish the
fresh output produced by the build command.
