---
layout: home
hero:
  name: vmlg
  text: 单二进制多节点网络与 BGP Looking Glass
  tagline: 纯 Go 静态编译（8.6 MB，零 CGO / 零 Node 构建），集多机房同屏回程对比、实时 SSE MTR、零落盘测速包、受控 iPerf3 租约池与纯 SVG BGP 拓扑图于一体。
  image:
    src: /logo.svg
    alt: vmlg
  actions:
    - theme: brand
      text: 快速开始
      link: /zh/quick-start
    - theme: alt
      text: BGP 拓扑与 MCP
      link: /zh/bgp-mcp
    - theme: alt
      text: GitHub
      link: https://github.com/cloudapp3/vmlg
    - theme: alt
      text: Telegram 群
      link: https://t.me/VMPulse

features:
  - icon: ⚡
    title: 多节点同屏回程横评
    details: 自动识别访客 IP，一键并发测试全球在线节点延迟、丢包率与回程骨干网（CN2 GIA / 9929 / CMIN2 / IXP）。
  - icon: 🚀
    title: 零落盘测速包 & iPerf3 租约池
    details: 内存 ChaCha8 不可压缩测速流（磁盘占用为 0）+ HTML5 浏览器测速 + 到期自动回收的单次 iPerf3 端口租约。
  - icon: 🌐
    title: 可插拔 BGP & 纯 SVG 拓扑
    details: 只读直连 BIRD 2/3 Unix Socket、FRRouting JSON 与 GoBGP，零 Graphviz 渲染客户端 SVG AS-Path 拓扑图。
  - icon: 🛡️
    title: 双维度防滥用护栏
    details: 严格拦截 SSRF / DNS 重绑定，同时限制单访客与单目标 /24 网段探测速率，杜绝反射放大滥用。
---

## 一键安装

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vmlg/main/install.sh | bash -s -- --system
```
