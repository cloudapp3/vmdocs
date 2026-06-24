---
title: Reports
description: JSON, HTML, console, and compare report behavior in vmbench.
---

# Reports

vmbench emits the same measurement model across console, JSON, and HTML reports.

| Format | Output | Use case |
| --- | --- | --- |
| Console | default terminal output | Human-readable local runs |
| JSON | `--json report.json` | Automation, archival, comparison |
| HTML | `--html report.html` | Sharing and visual inspection |
| Compare | `vmbench compare a.json b.json` | Raw metric deltas between two reports |

## No benchmark total score

vmbench intentionally avoids synthetic total scores, grades, and category scores. Reports preserve raw metrics and structured errors so readers can inspect each dimension independently.
