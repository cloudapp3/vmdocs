---
title: Contributing
description: Contribute to vmflow — development workflow, docs workflow, and pull request guidance.
---

# Contributing

Thanks for helping improve vmflow.

## Develop vmflow

```bash
git clone https://github.com/cloudapp3/vmflow.git
cd vmflow
make fmt
make test
make vet
make smoke
make build
```

Some tests bind local ports. If your sandbox blocks local sockets, run them in an environment that permits local listeners.

## Work on this documentation

This site lives in a separate repo, [`cloudapp3/vmdocs`](https://github.com/cloudapp3/vmdocs), under `sites/vmflow/docs/`:

```bash
git clone https://github.com/cloudapp3/vmdocs.git
cd vmdocs
pnpm install
pnpm docs:dev:vmflow      # local dev server
pnpm docs:build:vmflow    # production build
```

## Pull requests

- Open an issue first for larger changes, so the approach can be discussed.
- Keep PRs small and focused.
- Before submitting code: `make fmt && make vet && make test`.
- Before submitting docs: `pnpm docs:build:vmflow` must pass, and links must resolve.
