---
title: Quick Start
description: Install vminfo and inspect host runtime metrics from TUI, JSON, or web dashboard.
---

# Quick Start

vminfo gives you fast host runtime visibility from the terminal, JSON output, browser dashboard, or Go APIs.

## Install a release build

For a system-wide install on Linux or macOS, use `/usr/local/bin` explicitly:

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vminfo/main/install.sh | sudo bash -s -- --dir /usr/local/bin
```

Without `sudo`, the installer chooses the first writable location from
`/usr/local/bin`, `~/.local/bin`, and `~/bin`:

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vminfo/main/install.sh | bash
```

You can also install from source with Go:

```bash
go install github.com/cloudapp3/vminfo/cmd/vminfo@latest
```

Confirm that the selected directory is on `PATH`:

```bash
vminfo version
```

If the shell reports `command not found`, add the install directory to `PATH`
or rerun the installer with `--dir /usr/local/bin`.

## Inspect the host

Launch the interactive terminal UI from a real TTY:

```bash
vminfo
```

For scripts, collect one formatted snapshot or JSON object:

```bash
vminfo summary
vminfo summary --json
```

To observe a few samples without entering the TUI:

```bash
vminfo watch --count 3
vminfo watch --json --count 3
```

`summary` and `watch` work on Linux, macOS, and Windows. Process listing and
termination are Linux-only.

## Start a local web dashboard

```bash
vminfo --web
```

Default address:

```text
http://127.0.0.1:20021
```

The default loopback listener is local and unauthenticated. Any non-loopback
bind, including `0.0.0.0`, requires `--token`:

```bash
vminfo --web --bind 0.0.0.0 --port 20021 --token
```

The built-in server is HTTP. For remote use, keep it behind an HTTPS reverse
proxy or access it through an SSH tunnel; see [Deployment](/guide/deployment).

## Run a network check

```bash
vminfo net dns example.com
vminfo net port example.com 443
vminfo net ping example.com --tcp-port 443
vminfo net ip
```

`net ip` is the only command above that contacts the configured IP metadata
service; it runs only when requested.

## Check for updates

Release builds can check GitHub Releases without installing anything:

```bash
vminfo update --check
```

Run `vminfo update` when you are ready to download, checksum-verify, and install
the newer release. Replacing a binary in `/usr/local/bin` may require elevated
permissions.

## Common first-run issues

- **No interactive UI:** the TUI needs a real terminal. Use `summary --json` in
  CI, redirected shells, and other non-interactive environments.
- **Permission denied during update:** rerun with appropriate privileges or
  reinstall into a user-writable directory.
- **Remote web bind rejected:** add `--token`; do not expose the HTTP listener
  directly to an untrusted network.
- **ICMP ping rejected:** use the default TCP mode or configure the platform's
  ICMP permissions.

## Next steps

- Read the [command reference](/commands/)
- Open the [web dashboard guide](/guide/web-dashboard)
- Review the [secure deployment guide](/guide/deployment)
- Use the [HTTP API](/api)
- Embed the [Go library](/library/)
