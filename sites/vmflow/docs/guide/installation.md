---
title: Installation
description: Install vmflow from GitHub Releases with privilege-aware user or system installation, PATH integration, checksum verification, and uninstall support.
---

# Installation

`vmflow` ships as a single static binary for Linux and macOS (`amd64` and `arm64`). Get it from GitHub Releases with the installer, or build from source.

Releases intentionally use portable archives instead of distro-managed `.deb` or `.rpm` packages. Use the installer below or unpack an archive manually.

## Recommended user install

```bash
VMFLOW_BIN_DIR="$(
  curl -fsSL https://raw.githubusercontent.com/cloudapp3/vmflow/main/install.sh \
    | bash -s -- --version v0.2.0-rc.4 --print-install-dir
)" \
  && [ -n "$VMFLOW_BIN_DIR" ] \
  && [ "${VMFLOW_BIN_DIR#/}" != "$VMFLOW_BIN_DIR" ] \
  && [ -x "$VMFLOW_BIN_DIR/vmflow" ] \
  && export PATH="$VMFLOW_BIN_DIR:$PATH"
```

This pins the current prerelease and exports its selected directory for the current shell. Omit `--version v0.2.0-rc.4` to follow the latest stable release instead. The unversioned installer currently resolves to `v0.1.1`, which predates the MCP and Source IP policy features documented here.

## System-wide install

Install to `/usr/local/bin` without running the downloaded script itself as root:

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vmflow/main/install.sh \
  | bash -s -- --version v0.2.0-rc.4 --system
```

When a non-root user requests `--system`, the installer validates sudo before downloading and uses it only for target checks and writes. A newly created colocated config is root-owned with mode `0600`; use the root/sudo verification and startup commands printed by the installer.

To install another release, change the tag passed to `--version`:

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vmflow/main/install.sh | bash -s -- --version v0.2.0-rc.4
```

### Installer options

| Option | Description |
| --- | --- |
| `--version <tag>` | Install a specific release tag. Defaults to the latest stable release. |
| `--dir <path>` | Use an explicit installation directory; also available through `VMFLOW_INSTALL_DIR`. |
| `--system` | Install system-wide to `/usr/local/bin`, using sudo only when required. |
| `--skip-verify` | Skip SHA-256 checksum verification. |
| `--no-modify-path` | Do not add an automatically selected user directory to a shell startup file. |
| `--print-install-dir` | Print only the selected directory to stdout after a successful install. |
| `--uninstall` | Uninstall through `vmflow uninstall` when available, with a shell fallback for older or missing binaries. |
| `-h, --help` | Show help. |

### Directory and PATH behavior

Without `--dir`, the installer first reuses a conventional existing vmflow installation that has a colocated config. A fresh root install uses `/usr/local/bin`; a fresh unprivileged install prefers `~/.local/bin` or `~/bin` when already in `PATH`, then falls back to `~/.local/bin`.

For an automatic user install, the installer adds one idempotent PATH block to `.zshrc`, `.bashrc`, or `.profile` when needed and prints the exact reload command. It cannot change the current shell, which is why the recommended command captures `--print-install-dir` and exports it immediately. Explicit `--dir` or `VMFLOW_INSTALL_DIR` selections never modify shell startup files.

### Config and archive behavior

The installer downloads a GitHub Release archive and verifies `checksums.txt` with SHA-256 by default. It accepts both the current top-level `config.yaml` archive layout and the legacy `examples/config.yaml` layout. The first install creates `config.yaml` beside the binary with mode `0600`; upgrades replace only the binary and preserve the existing config and forwarding rules.

For private releases or higher GitHub API rate limits, set `GITHUB_TOKEN` or `GH_TOKEN`.

## Build from source

Requirements: [Go](https://go.dev/dl/) (a recent version, see `go.mod`).

```bash
git clone https://github.com/cloudapp3/vmflow.git
cd vmflow
go build -trimpath -o vmflow ./cmd/vmflow
```

Or with the Makefile:

```bash
make build
```

## Verify the install

```bash
vmflow version
vmflow version -json
```

## Updating vmflow

Once installed from a tagged release (v0.1.1 or later), `vmflow` can update itself:

```bash
vmflow update --check            # check for a newer release
vmflow update                    # install the newest release
vmflow update --version v0.2.0-rc.4 # install this prerelease
```

See [`vmflow update`](../commands/update) for details, flags, and platform notes.

## Uninstalling an installer-managed copy

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vmflow/main/install.sh \
  | bash -s -- --uninstall
```

This removes the exact PATH block created by the installer after binary cleanup succeeds. Use `sudo bash -s -- --uninstall` only for a root-owned system installation. See [`vmflow uninstall`](../commands/uninstall) for cleanup scope and preservation rules.
