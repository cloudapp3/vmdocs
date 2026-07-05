---
title: Quick Start
description: Install vmflow and run your first TCP forwarding rule in two minutes.
---

# Quick Start

This guide installs the `vmflow` binary, starts the daemon with a sample config, and queries it from the CLI.

## 1. Install

Install the latest prebuilt binary (Linux/macOS):

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vmflow/main/install.sh | bash
```

Prefer a global install:

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vmflow/main/install.sh | sudo bash -s -- --dir /usr/local/bin
```

Verify:

```bash
vmflow version
```

See [Installation](./installation) for `--version`, checksum verification, and building from source.

## 2. Start the daemon

Grab the sample config and start the daemon:

```bash
vmflow daemon -config ./examples/config.yaml
```

The sample forwards TCP `0.0.0.0:2201` to `127.0.0.1:22` (SSH).

## 3. Query it

From another terminal, point the CLI at the local admin API (default `127.0.0.1:19090`):

```bash
vmflow ctl health
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

Edit `examples/config.yaml`, then apply the new desired state:

```bash
vmflow ctl reload
```

Reload runs [precheck](./precheck) first; if there are errors, the change is rejected and the running rules are left untouched.

## What's next

- [Configuration](./configuration) — every YAML field explained
- [Forwarding Engine](./forwarding) — protocols, speed limits, connection caps
- [Rules & Lifecycle](./rules) — snapshot apply and incremental diff
