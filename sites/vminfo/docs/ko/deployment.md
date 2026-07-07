---
title: 배포
description: 올바른 빌드 출력과 커스텀 도메인 설정으로 문서 사이트를 Cloudflare Pages에 배포합니다.
---

# 배포

이 문서 사이트는 `cloudapp3/vmdocs` 문서 모노레포에서 Cloudflare Pages로 문제없이 배포되도록 설계되었습니다.

## Cloudflare Pages 설정

| 설정 | 값 |
| --- | --- |
| 프레임워크 프리셋 | VitePress 또는 None |
| 빌드 명령 | `pnpm docs:build:vminfo` |
| 빌드 출력 디렉터리 | `sites/vminfo/docs/.vitepress/dist` |
| 루트 디렉터리 | `/` |
| Node.js 버전 | 20 이상 |

Pages 프로젝트가 빌드 중에 의존성을 설치해야 한다면 다음을 사용하세요.

```bash
corepack enable && pnpm install --frozen-lockfile && pnpm docs:build:vminfo
```

## 커스텀 도메인

- `vminfo.bestcheapvps.org`와 같은 문서 서브도메인을 사용하세요
- 먼저 Cloudflare Pages 프로젝트 내에 커스텀 도메인을 추가하세요
- 그 다음 Cloudflare가 안내하는 대로 DNS를 구성하세요
- Pages 프로젝트를 연결하지 않고 수동 CNAME만 만들지 마세요

## 기본 경로

- 사이트 루트의 커스텀 도메인에는 `base`를 설정하지 마세요
- `https://example.com/vminfo/`와 같은 서브경로 배포에는 `base: "/vminfo/"`를 설정하세요

## 출력

Cloudflare Pages는 `sites/vminfo/docs/.vitepress/dist`에서 정적 사이트를 게시해야 합니다.
