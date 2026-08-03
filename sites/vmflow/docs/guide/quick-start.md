---
title: Quick Start
description: Install vmflow and run your first TCP forwarding rule in two minutes.
---

# Quick Start

This guide installs stable vmflow v0.3.0, creates a validated first rule with `vmflow init`, and queries the running daemon from the CLI.

## 1. Install

Install `v0.3.0` for the current shell (Linux/macOS):

```bash
VMFLOW_BIN_DIR="$(
  curl -fsSL https://raw.githubusercontent.com/cloudapp3/vmflow/main/install.sh \
    | bash -s -- --version v0.3.0 --print-install-dir
)" \
  && [ -n "$VMFLOW_BIN_DIR" ] \
  && [ "${VMFLOW_BIN_DIR#/}" != "$VMFLOW_BIN_DIR" ] \
  && [ -x "$VMFLOW_BIN_DIR/vmflow" ] \
  && export PATH="$VMFLOW_BIN_DIR:$PATH"
```

Verify:

```bash
vmflow version -json
```

The installer also configures PATH for future supported shell sessions when needed. See [Installation](./installation) for system-wide installation with `--system`, directory selection, checksum verification, and building from source.

## 2. Initialize vmflow

Run the first-use wizard:

```bash
vmflow init
```

Language is the first choice: `1` selects English and `2` selects Simplified Chinese. Next choose the recommended native system service, foreground mode in the current terminal, or save without starting. The wizard then creates a validated forwarding rule, enables authenticated local management, and writes the correct system or user configuration path for the selected mode.

System-service mode installs, enables, and starts vmflow, so do not start a second foreground process. Foreground mode is also already running and stays attached to the current terminal. Only if you chose not to start yet, start the saved user configuration later with:

```bash
vmflow run
```

## 3. Query it

From another terminal, query the local daemon with the bundled CLI:

```bash
vmflow ctl rules
vmflow ctl stats
vmflow ctl metrics
vmflow ctl precheck
```

## 4. Open the terminal UI

For native system-service mode, use the default command. It verifies that the local service is installed and running:

```bash
vmflow tui
```

For foreground mode, keep the daemon terminal open and explicitly address that manually started process:

```bash
vmflow tui -addr http://127.0.0.1:19090
```

An explicit `-addr` bypasses the native-service check. Press <kbd>Tab</kbd> to switch between the Dashboard, Rules, and Detail views. See [TUI Dashboard](./tui).

## 5. Reload after editing the config

Use `vmflow status` to find the active config path, edit that file, then apply the new desired state:

```bash
vmflow status
vmflow ctl reload
```

Reload runs [precheck](./precheck) first; if there are errors, the change is rejected and the running rules are left untouched.

## What's next

- [Configuration](./configuration) — every YAML field explained
- [Forwarding Engine](./forwarding) — protocols, shared bandwidth, traffic quotas, connection caps
- [Rules & Lifecycle](./rules) — snapshot apply and incremental diff
- [`vmflow service install`](../commands/service) — run vmflow as a boot-time native service (systemd / launchd / Windows Service)
- [`vmflow uninstall`](../commands/uninstall) — one-command teardown (service, binary, config, logs, certs)
