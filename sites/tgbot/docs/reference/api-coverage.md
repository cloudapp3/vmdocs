---
title: tgbot Telegram Bot API Coverage
description: See which Telegram Bot API methods, types, fields, and parameters tgbot generates and what its coverage checks guarantee.
---

# API Coverage

tgbot generates its Bot API types, method wrappers, and union support from the official Telegram Bot API documentation.

## Current development snapshot

The `master` branch is generated from Telegram Bot API 10.2, published July 14, 2026. The latest tagged tgbot release remains `v0.1.0`, so the v0.2 surface is still a preview contract until a new tag is published.

Check the generated file headers and the release tag before relying on a specific Bot API version.

## Regenerate the SDK

From the tgbot repository:

```bash
go run ./cmd/apigen
```

Use a previously downloaded official page for a deterministic or offline run:

```bash
go run ./cmd/apigen -html /path/to/telegram_bot_api.html
```

The generator writes:

- `sdk_types.go`
- `sdk_methods.go`
- `sdk_unions.go`

## Verify generated output

```bash
./scripts/check_generated.sh
python3 scripts/verify_telegram_bot_api_coverage.py
```

The repository also contains a compressed Bot API documentation snapshot for deterministic generation checks. A scheduled workflow compares against the live official page for drift.

## What the coverage check proves

The coverage script compares:

- official named types against repository types and union interfaces
- official fields against generated JSON field names
- official methods against generated parameter structs
- official parameters against generated JSON parameter names

## What it does not prove

The check does not establish that every Go field type, return type, union decoder, optionality rule, or runtime behavior is correct. Tests and review cover those contracts separately.

The precise claim is: the repository matches the official Telegram Bot API names and field/parameter sets checked by the script.

Use [pkg.go.dev](https://pkg.go.dev/github.com/cloudapp3/tgbot) for Go signatures and the [official Telegram documentation](https://core.telegram.org/bots/api) for platform semantics.

See [Methods and types](/sdk/methods-and-types) for generated-code usage and the [v0.2 migration guide](/migration/v0.2) for unreleased API changes.
