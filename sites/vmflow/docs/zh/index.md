---
layout: home
description: vmflow 是一个轻量的纯 Go L4 转发运行时——支持 TCP/UDP/tcp+udp 端口转发、规则生命周期、预检、Prometheus 指标、终端 UI，以及面向守护进程和控制面的可嵌入 Go 库。
hero:
  name: vmflow
  text: 面向守护进程和控制面的 L4 转发运行时
  tagline: 一个轻量的纯 Go TCP/UDP 转发运行时。可作为独立守护进程运行，也可将运行时嵌入你自己的控制面。内置规则生命周期、预检、指标和终端 UI。
  image:
    src: /logo.svg
    alt: vmflow
  actions:
    - theme: brand
      text: 快速开始
      link: ./quick-start
    - theme: alt
      text: CLI 参考
      link: ./commands
    - theme: alt
      text: HTTP API
      link: ./api
    - theme: alt
      text: GitHub
      link: https://github.com/cloudapp3/vmflow

features:
  - icon: 🔀
    title: L4 转发
    details: 支持 TCP、UDP 以及 tcp+udp 组合端口转发，每条规则可单独设置限速和最大连接数上限。
    link: ./forwarding
  - icon: 🔄
    title: 规则生命周期
    details: 启动、停止、重启和删除规则，或通过增量 diff 和热重载应用一份完整的期望状态快照。
    link: ./rules
  - icon: 🛡️
    title: 应用前预检
    details: 在任何规则发生改变之前，先拦截重复的规则 ID、监听器冲突、不可用端口和 DNS 错误。
    link: ./precheck
  - icon: 🧩
    title: 可嵌入的运行时
    details: 导入顶层 Go API，即可在你自己的控制面中加入进程内转发。引擎只负责转发和计数。
    link: ./library
  - icon: 📊
    title: Prometheus 指标与日志
    details: /metrics 端点加上结构化的 text/JSON 日志，让转发无需额外接线即可被观测。
    link: ./api
  - icon: 🖥️
    title: TUI 与 Telegram bot
    details: 终端仪表盘和可选的 Telegram bot，让你可以在任何操作位置查看并控制规则。
    link: ./tui-guide
  - icon: ⬆️
    title: 自更新
    details: 使用 `vmflow update` 就地检查并安装更新的版本——首次安装后无需再用安装脚本。
    link: ./update
---

## 一键安装

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vmflow/main/install.sh | bash
```

启动守护进程：

```bash
vmflow daemon -config ./examples/config.yaml
```

在另一个终端中查询它：

```bash
vmflow ctl health
vmflow ctl rules
vmflow ctl stats
vmflow ctl precheck
```

## 为什么选择 vmflow

vmflow 面向需要轻量、进程内 L4 转发的开发者和运维人员——无论是作为独立守护进程，还是作为更大控制面中的一座库。

当你需要以下能力时，可以使用它：

- 在端口之间转发 TCP/UDP 流量，并为每条规则设置限制
- 从你自己的期望状态或数据库驱动转发规则
- 在应用转发配置之前先校验它
- 通过一个小巧的本地 API 暴露规则统计和重载能力
- 把转发能力嵌入到另一个 Go 服务中，而无需引入数据库或 Web UI

## 快速链接

- [快速开始](./quick-start)
- [安装](./installation)
- [配置](./configuration)
- [命令参考](./commands)
- [HTTP API](./api)
- [Go 库](./library)
- [英文文档](/)
