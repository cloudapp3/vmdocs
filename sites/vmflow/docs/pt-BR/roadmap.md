---
title: Roadmap
description: Roadmap de releases do vmflow — baseline v0.1 lançado, v0.2 em andamento, v0.3 planejado.
---

# Roadmap

O vmflow está em um MVP prático no estilo v0.1. O caminho de encaminhamento, o ciclo de vida de regras, o plano de controle local, o básico de observabilidade e a API de incorporação estão prontos.

## v0.1 — baseline

- [x] Encaminhamento TCP
- [x] Encaminhamento UDP
- [x] `ApplySnapshot`
- [x] daemon + CLI
- [x] gerenciamento local por CLI/TUI
- [x] Configuração YAML

## v0.2 — em andamento

- [x] Métricas do Prometheus
- [x] Logs estruturados melhores
- [x] Autenticação de gerenciamento
- [x] Precheck de regras
- [ ] Drenagem suave (graceful drain)
- [ ] Verificação manual no Windows / macOS

## v0.3 — planejado

- [ ] Bucket de largura de banda compartilhado por regra
- [ ] API de assinatura de eventos
- [ ] Melhorias no hot-reload de configuração
- [x] Serviço nativo de inicialização no boot (systemd / launchd / Windows Service via `vmflow service install`)
- [ ] Imagem oficial do Docker / exemplos

## Reservado para depois

O encaminhamento HTTP/HTTPS e o gerenciamento de certificados/ACME estão implementados no código-fonte (`engine/https.go`, `engine/proxy.go`, `acme/`, `certstore/`, `certreview/`), mas desabilitados no build atual. A travessia NAT (`tunnel/`) também é mantida, mas não conectada. Ambos são candidatos para uma release futura assim que a superfície L4 se estabilizar.
