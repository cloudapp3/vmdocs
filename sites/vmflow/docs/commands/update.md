---
title: vmflow update
description: Check for or install the latest vmflow release — vmflow update, --check, --version.
---

# vmflow update

Check GitHub Releases and install the newest tagged build of `vmflow` in place.

```bash
vmflow update [--check] [--version <tag>]
```

Alias: `vmflow u`.

## Flags

| Flag | Description |
| --- | --- |
| `--check` | Only check for updates; do not install. |
| `--version <tag>` | Install or inspect a specific release tag (e.g. `v0.1.1`). |

## What it does

1. Queries the GitHub Releases API for `cloudapp3/vmflow`.
2. Compares the latest release against the running build's version.
3. When installing: downloads the archive for the current OS/arch, verifies it against `checksums.txt` with SHA-256, extracts the binary, and atomically replaces the running `vmflow` binary.

## Examples

Check whether a newer release is available, without installing:

```bash
vmflow update --check
```

Install the newest release:

```bash
vmflow update
```

Install a specific version:

```bash
vmflow update --version v0.1.1
```

## Notes

- A `dev` build (for example, built from source without release ldflags) cannot self-update without `--version`, because its current version is unknown. Use `vmflow update --version vX.Y.Z` in that case.
- Update checks are cached for 24 hours under your cache directory (`~/.cache/vmflow/update-check.json`, or `$XDG_CACHE_HOME/vmflow`). Use `--version` to bypass the cache for a specific tag.
- **Windows**: self-update (binary replacement) is not supported; `--check` still works. Reinstall with `install.sh` or the release archive to update on Windows.
- For private releases or higher GitHub API rate limits, set `GITHUB_TOKEN` or `GH_TOKEN`.
- Self-update replaces the running binary and needs write permission to it. If it fails with a permission error, rerun with appropriate privileges (for example `sudo`) or fix the install path permissions.

## Related

- [Installation](/guide/installation)
- [Changelog](/changelog)
