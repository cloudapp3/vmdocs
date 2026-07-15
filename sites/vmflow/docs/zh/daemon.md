---
title: vmflow
description: vmflow CLI 参考，涵盖前台运行、ctl、tui、version、update、service 和 uninstall。
---

# vmflow

```bash
vmflow -config ./examples/config.yaml [-control-port 19090]
```

前台运行模式会加载配置、启动仅监听回环的内部管理通道，以快照方式应用规则，并持续运行到收到 `SIGINT` 或 `SIGTERM`。

## 参数

| 参数 | 默认值 | 说明 |
| --- | --- | --- |
| `-config` | _(必填)_ | YAML 配置文件的路径。 |
| `-control-port` | _(取自配置)_ | 覆盖回环管理端口。 |
| `-log-file` | _(stdout)_ | 将日志写入该文件而非 stdout（在服务管理器下很有用；在 Windows 上必填）。 |

## 运行时行为

- 启动时，规则会通过快照方式应用（`ReplaceAll`）。参见[规则与生命周期](./rules)。
- `vmflow ctl` 和 `vmflow tui` 是受支持的管理入口。

- 如需作为受管理的开机自启服务运行，参见 [`vmflow service`](./service)。
