---
title: vmflow version
description: Print vmflow build metadata, optionally as JSON.
---

# vmflow version

```bash
vmflow version [-json]
```

Alias: `vmflow v`.

Prints build metadata (version, commit, build time, target OS/arch). Add `-json` for machine-readable output.

## Examples

```bash
vmflow version
vmflow version -json
```

Useful for verifying an install or filing bug reports.
