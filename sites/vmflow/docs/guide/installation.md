---
title: Installation
description: Install vmflow from GitHub Releases with the one-line installer, or build from source. Supports --version, --dir, --skip-verify and GITHUB_TOKEN.
---

# Installation

`vmflow` ships as a single static binary for Linux and macOS (`amd64` and `arm64`). Get it from GitHub Releases with the installer, or build from source.

Releases intentionally use portable archives instead of distro-managed `.deb` or `.rpm` packages. Use the installer below or unpack an archive manually.

## One-line installer

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vmflow/main/install.sh | bash
```

Install globally to `/usr/local/bin`:

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vmflow/main/install.sh | sudo bash -s -- --dir /usr/local/bin
```

Install a specific release tag:

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vmflow/main/install.sh | bash -s -- --version v0.1.0
```

### Installer options

| Option | Description |
| --- | --- |
| `--version <tag>` | Install a specific release tag. Defaults to the latest release. |
| `--dir <path>` | Install directory. Auto-detected when omitted (see below). |
| `--skip-verify` | Skip SHA-256 checksum verification. |
| `--uninstall` | Delegate to `vmflow uninstall` (remove service, binary, config, logs, certs, update cache). |
| `-h, --help` | Show help. |

The installer downloads GitHub Release archives, verifies `checksums.txt` with SHA-256 by default, and auto-detects an install directory in this order: `/usr/local/bin` → `~/.local/bin` → `~/bin`. You can override it with `--dir PATH` or the `VMFLOW_INSTALL_DIR` environment variable.

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

## PATH not set?

If the installer reports the chosen directory is not on your `PATH`, either symlink it:

```bash
sudo ln -sf "$HOME/.local/bin/vmflow" /usr/local/bin/vmflow
```

…or add the directory to your shell `PATH`:

```bash
export PATH="$HOME/.local/bin:$PATH"
```

## Updating vmflow

Once installed from a tagged release (v0.1.1 or later), `vmflow` can update itself:

```bash
vmflow update --check            # check for a newer release
vmflow update                    # install the newest release
vmflow update --version v0.1.1   # install a specific version
```

See [`vmflow update`](../commands/update) for details, flags, and platform notes. (The v0.1.0 release predates the `update` command — reinstall it with the installer above to gain self-update.)
