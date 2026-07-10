---
title: vmflow version
description: 打印 vmflow 的构建元数据，可选 JSON 格式。
---

# vmflow version

```bash
vmflow version [-json]
```

别名：`vmflow v`。

打印构建元数据——版本、commit 和构建时间。加上 `-json` 可获得机器可读的输出。

## 示例

```bash
vmflow version
vmflow version -json
```

可用于验证安装或提交 bug 报告。
