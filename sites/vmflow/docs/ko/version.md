---
title: vmflow version
description: vmflow 빌드 메타데이터를 출력하며, JSON 형식도 선택할 수 있습니다.
---

# vmflow version

```bash
vmflow version [-json]
```

별칭: `vmflow v`.

빌드 메타데이터(버전, 커밋, 빌드 시간)를 출력합니다. 머신이 읽을 수 있는 출력이 필요하면 `-json`을 추가하세요.

## 예제

```bash
vmflow version
vmflow version -json
```

설치를 확인하거나 버그 리포트를 작성할 때 유용합니다.
