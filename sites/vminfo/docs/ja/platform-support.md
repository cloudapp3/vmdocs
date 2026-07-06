---
title: プラットフォームサポート
description: Linux・macOS・Windows で利用できる機能の対応状況。
---

# プラットフォームサポート

| 機能 | Linux | macOS | Windows |
| --- | --- | --- | --- |
| `summary` / `watch` | ✅ | ✅ | ✅ |
| TUI | ✅ | ✅ | ✅ |
| Web ダッシュボード | ✅ | ✅ | ✅ |
| `ps` / `kill` | ✅ | ⚠️ stub | ⚠️ stub |
| `update --check` | ✅ | ✅ | ✅ |
| `update` インストール | ✅ | ✅ | ⚠️ 確認のみ |

注意事項：

- TUI は実際の TTY が必要です。
- `ps` と `kill` は設計上 Linux 専用です。
- Linux 以外のビルドは、プロセス機能についてサポート対象外のスタブ（stub）を保持します。
- Windows はアップデートの確認は可能ですが、自己置換はサポートされていません。
