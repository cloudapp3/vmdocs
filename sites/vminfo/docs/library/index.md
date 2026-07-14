---
title: Go Library
description: Use vminfo as a Go library for host metrics, network diagnostics, Linux process operations, and an embeddable terminal UI.
---

# Go Library

vminfo exposes public Go packages for collecting host metrics, running bounded
network diagnostics, inspecting Linux processes, reading build metadata, and
embedding the interactive terminal UI. The web dashboard remains internal to
the CLI and is not an importable package.

## Packages

- [`github.com/cloudapp3/vminfo`](https://pkg.go.dev/github.com/cloudapp3/vminfo)
  provides collectors, result types, network probes, process operations, and
  application metadata.
- [`github.com/cloudapp3/vminfo/tui`](https://pkg.go.dev/github.com/cloudapp3/vminfo/tui)
  runs the same interactive terminal UI used by the vminfo command.

```bash
go get github.com/cloudapp3/vminfo@latest
```

## Collect a snapshot

`CollectAll` returns rarely changing host properties and sampled runtime
metrics in one call:

```go
package main

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/cloudapp3/vminfo"
)

func main() {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	static, stats, err := vminfo.CollectAll(ctx, vminfo.Options{
		SampleInterval: time.Second,
	})
	if err != nil {
		log.Fatal(err)
	}

	fmt.Printf("%s cpu=%.1f%% memory=%d\n", static.Hostname, stats.CPU, stats.MemUsed)
}
```

The sampling interval must leave enough time before the context deadline.
Collection honors context cancellation and returns an error when required host
data cannot be collected. Platform-specific optional fields may be empty or
zero.

## Exported types

| Type | Purpose |
| --- | --- |
| `StaticInfo` | OS, kernel, architecture, hostname, CPU model/cores, and resource totals |
| `RuntimeStats` | Sampled CPU, memory, disk, network, load, sockets, temperatures, interfaces, and uptime |
| `Snapshot` | `StaticInfo` and `RuntimeStats` in the same shape used by `summary --json` |
| `ProcessInfo` | Linux process identity, ownership, command, state, and resource usage |
| `AppMetadata` | Version, build, repository, license, channel, and schema metadata |

## Common entry points

- `CollectStatic(ctx)` reads properties that rarely change.
- `CollectStats(ctx, opts)` samples runtime values and per-second rates.
- `CollectAll(ctx, opts)` returns both layers in one call.
- `Metadata()` reports normalized application and build metadata.
- `ResolveDNS`, `CheckPort`, `Ping`, and `LookupIP` run explicit network probes.
- `ListProcesses` and `TerminateProcess` work on Linux and return unsupported
  errors on other platforms.
- `tui.Run(ctx, opts)` launches the interactive terminal UI.

Network probe functions return typed result values whose `error` JSON field is
populated when a target cannot be reached. Callers should inspect that result,
not only whether the Go function returned.

## Embed the TUI

```go
package main

import (
	"context"
	"log"

	vminfotui "github.com/cloudapp3/vminfo/tui"
)

func main() {
	if err := vminfotui.Run(context.Background(), vminfotui.Options{
		Lang: "en",
	}); err != nil {
		log.Fatal(err)
	}
}
```

`tui.Options` accepts custom `Stdin` and `Stdout` streams for integration and
tests. A real interactive terminal is still required for normal use.

## Platform boundaries

Host collection, network diagnostics, and the TUI target Linux, macOS, and
Windows. Local process listing and termination are Linux-only. In particular,
ICMP probing also depends on platform support and local permissions; TCP ping
is the portable default.

## Related

- [Collect metrics](/library/collect)
- [Embed the TUI](/library/embed-tui)
- [Command JSON output](/commands/summary)
- [Network diagnostics](/commands/net)
- [HTTP API](/api)
