---
title: update
description: Check GitHub Releases, verify checksums, and atomically install a newer tagged vminfo build.
---

# `vminfo update`

Checks GitHub Releases and, on supported platforms, installs a newer tagged
build of the same application.

## Usage

```bash
vminfo update
vminfo update --check
vminfo update --version v0.2.1
```

## Modes

| Command | Behavior |
| --- | --- |
| `vminfo update --check` | Report whether a newer release is available; do not modify the binary |
| `vminfo update` | Check the latest release and install it when newer |
| `vminfo update --version vX.Y.Z` | Inspect or install that exact tag when it is newer than the current build |

The command does not accept positional arguments. A development build can run
`--check`, but installing from a development build requires an explicit
`--version` tag. The version selector is not a downgrade mechanism: a target
that is not newer is reported without replacing the binary.

## Download and verification

Before replacing the executable, vminfo:

1. fetches release metadata from `cloudapp3/vminfo` on GitHub
2. downloads the archive for the current OS and architecture
3. downloads `checksums.txt` from the same release
4. verifies the archive's SHA-256 checksum
5. extracts the binary to a unique temporary file in the install directory
6. syncs and atomically renames it over the current executable

The update fails closed if release metadata, an archive, its checksum entry, or
checksum verification is missing. Temporary files are removed after failures.

## Permissions and platforms

- Linux and macOS release builds support in-place replacement.
- Windows supports checking, but not in-place installation.
- The updater resolves the running executable path, including symlinks.
- Replacing a binary under `/usr/local/bin` usually requires suitable
  permissions; a user-owned install directory usually does not.

If installation fails with a permission error, rerun with the permissions used
to install the binary or install a fresh release into a writable directory.

## Caching and GitHub limits

Latest-release checks use a 24-hour cache under `$XDG_CACHE_HOME/vminfo` or
`~/.cache/vminfo`. Non-regular cache paths are ignored. Set `GITHUB_TOKEN` or
`GH_TOKEN` if anonymous GitHub API rate limits are a problem.

Release builds may also run a quiet background update check when another vminfo
command starts. It only prints a notice; it never installs automatically. Use
the global `--no-update-check` option to skip that background check.

## Examples

```bash
# CI or monitoring: check only.
vminfo update --check

# Install the newest release.
vminfo update

# Install a known newer tag.
vminfo update --version v0.2.1
```

## Related

- [Installation](/guide/installation)
- [Changelog](/changelog)
