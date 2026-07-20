---
title: Contribute to tgbot and Its Documentation
description: Learn how to test, regenerate, document, and submit reliable changes to the tgbot Go Telegram Bot SDK.
---

# Contributing

Code and Web documentation live in separate repositories:

- SDK: [cloudapp3/tgbot](https://github.com/cloudapp3/tgbot)
- Documentation: [cloudapp3/vmdocs](https://github.com/cloudapp3/vmdocs/tree/main/sites/tgbot/docs)

## Validate SDK changes

Start with the focused package, then run the full checks:

```bash
go test ./...
go test -race ./...
go vet ./...
test -z "$(gofmt -l .)"
./scripts/check_generated.sh
```

Changes to generated files must originate in `cmd/apigen` or a refreshed official schema, not manual edits to generated output.

## Validate documentation changes

From the vmdocs repository:

```bash
pnpm install --frozen-lockfile
pnpm docs:dev:tgbot
pnpm docs:build:tgbot
pnpm check:seo:tgbot
```

The production build runs the strict tgbot SEO check automatically. It validates
titles, descriptions, canonical URLs, robots directives, complete hreflang
groups, social metadata and images, JSON-LD, the sitemap, and `robots.txt`.

## Content ownership

- Keep task-oriented guides in vmdocs.
- Keep Go API comments in the tgbot source and on pkg.go.dev.
- Keep release notes with the matching tgbot release.
- Link Telegram field semantics to the official Bot API instead of copying the full upstream manual.
- Update English and Chinese pages together when both versions exist.

Never place a real bot token, webhook secret, private update payload, or user identifier in tests, documentation, screenshots, or issue reports.

Before opening a change, review the [API coverage contract](/reference/api-coverage) and compile the documented [examples](/examples/).
