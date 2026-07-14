---
title: kill
description: Safely send SIGTERM to a Linux process by PID, with PID validation and protected targets.
---

# `vminfo kill`

Sends `SIGTERM` to one Linux process, waits briefly for it to stop, and reports
the result. It does not send `SIGKILL`.

::: warning
This command terminates a process. Confirm both the PID and command immediately
before running it; operating systems can reuse a PID after a process exits.
:::

## Usage

```bash
vminfo kill 1234
```

On success:

```text
sent SIGTERM to PID 1234
```

## Validation and safeguards

- exactly one positive, 32-bit PID is required
- PID 1 is refused
- vminfo refuses to terminate its own process
- the caller must have permission to signal the target
- vminfo waits up to three seconds for the process to disappear
- failures are returned instead of being reported as a successful signal

Use `vminfo ps <keyword>` or `vminfo ps --filter <keyword>` immediately before
`kill` to verify the target:

```bash
vminfo ps nginx
vminfo kill 1234
```

## Platform behavior

- Linux-only
- macOS and Windows builds return an unsupported error
- sending a signal to another user's process may require elevated permission

If the process handles `SIGTERM`, it can clean up before exiting. If it remains
running, inspect its logs and use the operating system's process tools to decide
whether stronger action is appropriate; vminfo intentionally does not escalate
to `SIGKILL`.

## Related

- [ps](/commands/ps)
- [TUI controls](/guide/tui-controls)
