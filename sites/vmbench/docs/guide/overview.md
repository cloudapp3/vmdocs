---
title: Overview
description: Product model and benchmark philosophy for vmbench.
---

# Overview

vmbench is a cross-platform VPS and host benchmark suite written in Go, with a parallel Rust translation track.

The product model is simple:

- keep raw metrics visible
- keep structured errors visible
- compare reports using raw dimensions
- do not collapse unrelated dimensions into a benchmark total score

## Measurement model

vmbench reports:

- median time
- throughput
- latency
- detail and structured errors

For comparison, lower time / latency is better, and higher throughput is better. IP Quality risk scoring is a diagnostic signal, not a benchmark score.

## Suite sections

The VPS suite groups diagnostics into sections:

- `hardware`
- `route`
- `ping`
- `speed`
- `ip_quality`
- `mail`
- `media`

## External tools

Hardware benchmarks use external tools such as sysbench, fio, and openssl. Optional adapters include dd, STREAM, mbw, Geekbench, and WinSAT.

Missing tools are recorded as workload errors instead of being replaced with in-process fallback results.
