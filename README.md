# vmdocs

Documentation monorepo for the cloudapp3 projects published on bestcheapvps.org subdomains.

| Project | Live documentation | Source |
| --- | --- | --- |
| vminfo | https://vminfo.bestcheapvps.org | https://github.com/cloudapp3/vminfo |
| vmbench | https://vmbench.bestcheapvps.org | https://github.com/cloudapp3/vmbench |
| vmflow | https://vmflow.bestcheapvps.org | https://github.com/cloudapp3/vmflow |
| tgbot | https://tgbot.bestcheapvps.org | https://github.com/cloudapp3/tgbot |

## Repository layout

Each site owns its VitePress config, Markdown, theme overrides, and public assets:

```text
sites/<project>/docs/
```

Dependencies and site-specific scripts live at the repository root. Build output stays isolated under `sites/<project>/docs/.vitepress/dist` and is not committed.

## Local development

Install the pinned dependencies:

```bash
corepack enable
pnpm install --frozen-lockfile
```

Use the project-specific commands:

| Project | Development | Build | Preview |
| --- | --- | --- | --- |
| vminfo | `pnpm docs:dev:vminfo` | `pnpm docs:build:vminfo` | `pnpm docs:preview:vminfo` |
| vmbench | `pnpm docs:dev:vmbench` | `pnpm docs:build:vmbench` | `pnpm docs:preview:vmbench` |
| vmflow | `pnpm docs:dev:vmflow` | `pnpm docs:build:vmflow` | `pnpm docs:preview:vmflow` |
| tgbot | `pnpm docs:dev:tgbot` | `pnpm docs:build:tgbot` | `pnpm docs:preview:tgbot` |

The compatibility aliases `docs:dev`, `docs:build`, and `docs:preview` continue to target vminfo.

## Cloudflare Pages

Create one Pages project per documentation site. Use the repository root `/`, Node 22, and the matching site command and output path.

For tgbot:

| Setting | Value |
| --- | --- |
| Production branch | `main` |
| Build command | `pnpm docs:build:tgbot` |
| Build output directory | `sites/tgbot/docs/.vitepress/dist` |
| Root directory | `/` |
| Node.js version | `22` |

When the Pages project needs an explicit install step, use:

```bash
corepack enable && pnpm install --frozen-lockfile && pnpm docs:build:tgbot
```

The site is published at the custom-domain root, so VitePress does not set `base`. Add the custom domain in Pages before changing DNS.

Before launch, confirm that `tgbot.bestcheapvps.org` resolves to the Pages project
and serves HTTPS. In Cloudflare, add a host-based redirect from the production
`*.pages.dev` hostname to `https://tgbot.bestcheapvps.org` while preserving the
path and query string. If the default hostname must remain reachable, apply an
`X-Robots-Tag: noindex` response-header rule to that hostname only. Do not put
that directive in `sites/tgbot/docs/public/_headers`, because the same static
file is also served from the canonical custom domain.
