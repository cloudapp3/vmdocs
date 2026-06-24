---
layout: home
hero:
  name: vmbench
  text: VPS benchmark suite with raw metrics and structured reports
  tagline: Cross-platform CLI/TUI benchmark tooling for Linux, macOS, and Windows — focused on raw measurements, diagnostics, and report comparison instead of synthetic total scores.
  image:
    src: /logo.svg
    alt: vmbench
  actions:
    - theme: brand
      text: Get Started
      link: /guide/quick-start
    - theme: alt
      text: View Commands
      link: /commands/
    - theme: alt
      text: Reports
      link: /reports
    - theme: alt
      text: GitHub
      link: https://github.com/cloudapp3/vmbench

features:
  - icon: 📊
    title: Raw metrics only
    details: Preserve median time, throughput, latency, detail, and structured errors. No benchmark total score or grade.
    link: /guide/overview
  - icon: 🧪
    title: External-tool benchmarks
    details: Use sysbench, fio, openssl, dd, STREAM, mbw, Geekbench, and WinSAT adapters instead of in-process fallback scores.
    link: /guide/overview
  - icon: 🌐
    title: VPS network diagnostics
    details: Route, ping, speed providers, IP quality, mail port reachability, and media unlock probes.
    link: /commands/
  - icon: 🖥️
    title: CLI and TUI
    details: Run repeatable commands or use the terminal UI for local benchmark sessions and report browsing.
    link: /guide/quick-start
  - icon: 📄
    title: JSON and HTML reports
    details: Export machine-readable JSON and shareable HTML reports for automation and comparison.
    link: /reports
  - icon: 🤖
    title: MCP stdio server
    details: Expose bounded benchmark tools to local LLM clients without arbitrary shell execution.
    link: /commands/
---

## Install in one command

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vmbench/main/install.sh | bash
```

Or install from source:

```bash
go install github.com/cloudapp3/vmbench/cmd/vmbench@latest
```

## Why vmbench

vmbench is built for VPS buyers, hosting reviewers, SREs, and server operators who need benchmark evidence that remains explainable after the run finishes.

Use it when you need to:

- benchmark CPU, memory, disk, and network behavior on the same host
- keep missing tools and network failures visible as structured errors
- compare two reports using raw time, throughput, and latency deltas
- avoid synthetic total scores that mix unrelated dimensions too early
- export JSON / HTML reports for automation, sharing, and archives

<div class="vmbench-callout">
  <strong>No benchmark total score:</strong> vmbench reports measured values and diagnostics. IP Quality risk scores are business diagnostics, not benchmark scores.
</div>

## Quick links

- [Quick start](/guide/quick-start)
- [Overview](/guide/overview)
- [Platform support](/guide/platform-support)
- [Command reference](/commands/)
- [Reports](/reports)
- [中文文档](/zh/)
