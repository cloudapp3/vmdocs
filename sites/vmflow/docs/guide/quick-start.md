---
title: Quick Start
description: Install vmflow and run your first TCP forwarding rule in two minutes.
---

# Quick Start

This guide installs the current vmflow prerelease with its colocated config, starts the daemon, and queries it from the CLI.

## 1. Install

Install `v0.2.0-rc.4` for the current shell (Linux/macOS):

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

Verify:

```bash
vmflow version -json
```

The installer also configures PATH for future supported shell sessions when needed. See [Installation](./installation) for system-wide installation with `--system`, directory selection, checksum verification, and building from source.

## 2. Start the daemon

Start the daemon with the `config.yaml` created beside the installed binary:

```bash
vmflow
```

The colocated config is the runtime default. Its bundled SSH example is disabled and listens on `127.0.0.1:2201`; review the config before enabling the rule.

## 3. Query it

From another terminal, query the local daemon with the bundled CLI:

```bash
vmflow ctl rules
vmflow ctl stats
vmflow ctl metrics
vmflow ctl precheck
```

## 4. Open the terminal UI

```bash
vmflow tui
```

Press <kbd>Tab</kbd> to switch between the Dashboard, Rules, and Detail views. See [TUI Dashboard](./tui).

## 5. Reload after editing the config

Open the config beside the resolved binary, then apply the new desired state:

```bash
VMFLOW_CONFIG="$(dirname "$(command -v vmflow)")/config.yaml"
"${EDITOR:-vi}" "$VMFLOW_CONFIG"
vmflow ctl reload
```

Reload runs [precheck](./precheck) first; if there are errors, the change is rejected and the running rules are left untouched.

## What's next

- [Configuration](./configuration) — every YAML field explained
- [Forwarding Engine](./forwarding) — protocols, speed limits, connection caps
- [Rules & Lifecycle](./rules) — snapshot apply and incremental diff
- [`vmflow service install`](../commands/service) — run vmflow as a boot-time native service (systemd / launchd / Windows Service)
- [`vmflow uninstall`](../commands/uninstall) — one-command teardown (service, binary, config, logs, certs)
