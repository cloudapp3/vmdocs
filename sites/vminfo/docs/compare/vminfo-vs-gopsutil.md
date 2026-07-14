---
title: vminfo vs gopsutil
description: Understand when to use the vminfo system monitoring toolkit or the lower-level gopsutil Go library, and how the two projects relate.
---

# vminfo vs gopsutil

gopsutil and vminfo operate at different layers. gopsutil is a broad, low-level Go library for reading host and process statistics across many operating systems. vminfo is a ready-to-run monitoring product and a smaller high-level Go API built partly on gopsutil.

They are complements, not direct replacements.

## Relationship

vminfo currently imports `github.com/shirou/gopsutil/v3` for cross-platform CPU, memory, disk, network, host, load, and process primitives. It adds sampling, normalization, public snapshot types, CLI output, a TUI, a web dashboard, network diagnostics, updater/installer flows, and platform-specific behavior.

The current gopsutil project publishes its main API as `github.com/shirou/gopsutil/v4`. If you need the newest low-level packages or a platform-specific function that vminfo does not expose, import gopsutil directly rather than waiting for a vminfo wrapper.

## At a glance

| Area | vminfo | gopsutil |
| --- | --- | --- |
| Product layer | CLI, TUI, JSON, Web/API, and Go packages | Go library packages |
| API level | High-level `StaticInfo`, `RuntimeStats`, `Snapshot`, process, and TUI entry points | Lower-level CPU, disk, host, load, memory, network, and process primitives |
| User interface | Ready-to-run terminal and browser interfaces | No operator UI is the project's primary purpose |
| Output contracts | Text, JSON snapshots, JSON Lines, and HTTP responses | Go values returned to the calling application |
| Platform scope | Linux, macOS, Windows, with explicit CLI feature boundaries | A broader platform matrix with package-level differences |
| Control | Opinionated sampling and normalization | Direct access to individual metric packages and platform-specific extensions |

## Choose gopsutil directly when

- you need one low-level metric call rather than a complete host snapshot
- you need platform-specific extension structs or broader OS coverage
- your application owns sampling, retries, serialization, and presentation
- you want to stay on gopsutil's current major version and release cadence
- vminfo's high-level types omit a field required by your product

Example shape:

```go
percentages, err := cpu.Percent(time.Second, false)
if err != nil {
    return err
}
fmt.Println(percentages)
```

## Choose the vminfo Go API when

- you want static host information and sampled runtime stats in a consistent model
- the same data must also be available through a CLI, JSON, TUI, or web dashboard
- you want vminfo to own the sampling interval and aggregate common host signals
- you want to embed the existing terminal UI in another Go CLI

```go
static, err := vminfo.CollectStatic(ctx)
if err != nil {
    return err
}

stats, err := vminfo.CollectStats(ctx, vminfo.Options{
    SampleInterval: time.Second,
})
if err != nil {
    return err
}
```

## Tradeoffs

The vminfo API reduces application-level wiring but intentionally exposes fewer knobs. gopsutil provides more direct control, but your application must decide how to sample counters, handle platform differences, combine errors, and present data.

Using vminfo does not remove gopsutil from the dependency graph today. Evaluate API fit and maintenance ownership rather than assuming that one option necessarily produces a smaller binary or faster collection.

## Sources

- [gopsutil official repository](https://github.com/shirou/gopsutil)
- [gopsutil v4 package documentation](https://pkg.go.dev/github.com/shirou/gopsutil/v4)
- [vminfo package documentation](https://pkg.go.dev/github.com/cloudapp3/vminfo)
- [vminfo collection guide](/library/collect)
- [vminfo TUI embedding guide](/library/embed-tui)

Facts and dependency relationships last checked on **July 14, 2026**. No allocation, CPU, or binary-size comparison is claimed.
