---
title: Quick Start
description: Install vmbench and run CLI, TUI, suite, report, and MCP workflows.
---

# Quick Start

vmbench provides a cross-platform CLI/TUI workflow for VPS benchmark runs and structured reports.

## Install

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vmbench/main/install.sh | bash
```

Or build from source:

```bash
go install github.com/cloudapp3/vmbench/cmd/vmbench@latest
```

## Launch the TUI

```bash
vmbench
```

## Run hardware benchmarks

```bash
vmbench run
vmbench run --json report.json --html report.html
vmbench run --filter 'sysbench|fio|OpenSSL'
vmbench run --hardware-tool sysbench,openssl,fio,dd
```

## Run the VPS suite

```bash
vmbench suite
vmbench suite --preset quick
vmbench suite --preset website --json suite.json --html suite.html
vmbench suite --only ping,mail
```

## Compare reports

```bash
vmbench compare before.json after.json
```

## Expose MCP stdio tools

```bash
vmbench mcp serve --transport stdio
```

## Next steps

- Read the [overview](/guide/overview)
- Check [platform support](/guide/platform-support)
- Open the [command reference](/commands/)
- Review [report formats](/reports)
