---
title: 平台支持
description: 各功能在 Linux、macOS 与 Windows 上的支持情况。
---

# 平台支持

| 功能 | Linux | macOS | Windows |
| --- | --- | --- | --- |
| `summary` / `watch` | ✅ | ✅ | ✅ |
| TUI | ✅ | ✅ | ✅ |
| Web 仪表盘 | ✅ | ✅ | ✅ |
| `ps` / `kill` | ✅ | ⚠️ stub | ⚠️ stub |
| `update --check` | ✅ | ✅ | ✅ |
| `update` 安装 | ✅ | ✅ | ⚠️ 仅检查 |

说明：

- TUI 需要真实的 TTY。
- `ps` 和 `kill` 在设计上仅限 Linux。
- 非 Linux 构建为进程相关功能保留不支持的桩（stub）。
- Windows 可以检查更新，但不支持自我替换。
