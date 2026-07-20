---
title: vmflow uninstall
description: One-command uninstall of vmflow — removes the service, binary, config, logs, certificates, and update cache.
---

# vmflow uninstall

```bash
vmflow uninstall [--dry-run]
```

Aliases: `vmflow remove`, `vmflow rm`.

Performs a complete teardown of a vmflow installation. It runs a **plan → confirm → execute** flow:

1. **Plan** — probes the system and lists everything that would be removed.
2. **Confirm** — prompts `[y/N]` (skipped under `--dry-run` or when there is nothing to remove).
3. **Execute** — removes the items in order, tolerating already-absent paths so the command is idempotent.

## Flags

| Flag | Default | Description |
| --- | --- | --- |
| `--dry-run` | `false` | Print the removal plan without removing anything. |

## What it removes

Items are removed in this order (service first, the running binary last, so a still-supervised daemon is gone before its executable is deleted):

| Item | Notes |
| --- | --- |
| Native service | Stops and removes the systemd unit / launchd plist / Windows Service. |
| Config files | The platform default config (see [`service`](./service)) and installer-owned colocated config. An unowned colocated config is preserved. |
| External TLS / ACME certificates | Certificate and key files referenced outside vmflow-owned storage are preserved. |
| Log directories | e.g. `/var/log/vmflow` (Linux/macOS), `C:\ProgramData\vmflow\logs` (Windows). |
| Self-update cache | The updater cache directory. |
| vmflow binary | The running executable, removed last. |

::: warning Package-manager installs
If the binary is owned by a package manager (`dpkg` / `rpm`), `uninstall` prints a warning and recommends `apt remove` / `yum remove` instead, since deleting the file directly leaves the package database stale. It still proceeds if you confirm.
:::

Protected paths (system roots, your home directory) are never removed.

## Installer-managed installations

For a user installation created by `install.sh`, prefer the installer-level uninstall:

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vmflow/main/install.sh \
  | bash -s -- --uninstall
```

It delegates to `vmflow uninstall` when supported and falls back to shell cleanup for an old or missing binary. After binary cleanup succeeds, it also removes the exact installer-owned PATH block from `.zshrc`, `.bashrc`, or `.profile`. Similar user-written PATH lines, symlinked startup files, and non-writable startup files are left untouched.

Use `sudo bash -s -- --uninstall` only for a root-owned system installation. Pass `--dir PATH` with `--uninstall` when removing an explicitly selected custom directory.

## Examples

```bash
# preview only
vmflow uninstall --dry-run

# full teardown (will prompt to confirm)
sudo vmflow uninstall
```
