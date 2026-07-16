---
title: Precheck
description: Validate a vmflow configuration before applying it — source IP policies, duplicate IDs, listener conflicts, port bindability, and DNS resolution.
---

# Precheck

Precheck validates a configuration **without applying it**. It runs automatically before every `reload`, and you can run it on demand to sanity-check a config change safely.

## Run it

```bash
vmflow ctl precheck
```

Run `vmflow ctl precheck` to validate the current configuration.

## What it checks

Precheck produces a list of findings, each either an **error** or a **warning**. Errors block a reload; warnings do not.

| Check | Severity | Notes |
| --- | --- | --- |
| Rule model validation | error | Malformed rule fields. |
| Source IP policy | error | Invalid mode, hostname, malformed/empty entry, empty active list, or more than 256 entries. |
| `source_ip_duplicate` | warning | An entry resolves to the same address or CIDR as an earlier entry. |
| `source_ip_redundant` | warning | An entry is already covered by a broader CIDR in the same list. |
| `duplicate_rule_id` | error | Same ID appears more than once in the snapshot. |
| Listener conflict | error | Two rules claim the same `listen_addr:port`. |
| Port bindability | error | Actually tries to bind the listen port to confirm it is available. |
| Target DNS resolution | error | The `target_addr` must resolve. |
| HTTPS domain config | — | _Disabled in current build_ (http/https protocols are rejected). |
| ACME HTTP-01 address | — | _Disabled in current build_ (ACME subsystem is off). |
| Low-port privilege | warning | Binding privileged ports (<1024) usually needs elevated permissions. |

## Example response

```json
{
  "config_path": "./examples/config.yaml",
  "rule_count": 1,
  "result": {
    "ok": true,
    "error_count": 0,
    "warning_count": 0,
    "checked_rules": 1,
    "checked_time_ms": 1,
    "items": []
  }
}
```

## How reload uses it

`vmflow ctl reload` runs the same checks first. If `error_count > 0`, the reload is rejected and the running rules are left exactly as they were. This makes config edits safe to ship through automation: a broken config cannot partially apply.

::: warning Local ports
The port-bindability probe opens a local listener briefly. If your environment blocks local socket creation, precheck (and therefore reload) cannot fully validate bindability.
:::
