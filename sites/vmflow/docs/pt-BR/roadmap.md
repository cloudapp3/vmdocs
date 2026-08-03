---
title: Roadmap
description: vmflow v0.3.0 é a versão estável atual; recursos entregues e trabalhos futuros são acompanhados separadamente.
---

# Roadmap

O vmflow v0.3.0 é a versão estável atual. Encaminhamento L4, plano de controle local, observabilidade, ciclo de vida do serviço nativo, controle de tráfego, TUI e API de incorporação estão disponíveis hoje.

## Recursos básicos entregues antes do v0.3.0

- [x] Encaminhamento TCP, UDP e `tcp+udp`
- [x] `ApplySnapshot`, ciclo de vida de regras e hot reload de YAML
- [x] Gerenciamento local por CLI/TUI
- [x] Métricas do Prometheus e logs estruturados
- [x] Autenticação de gerenciamento e precheck de regras
- [x] API de runtime Go incorporável

## v0.3.0 - lançado em 2026-08-03

- [x] Limites de largura de banda upload/download compartilhados por regra
- [x] Cotas de tráfego diárias e mensais persistentes
- [x] Failover automático de DNS para verificações e encaminhamento de saída
- [x] Painel Host Network com contadores e taxas de interfaces em tempo real
- [x] Localização da CLI/TUI em inglês e chinês simplificado
- [x] Instalação, inicialização no boot, status e recuperação via TUI do serviço nativo
- [x] Ferramentas MCP somente leitura via stdio para diagnóstico local

## Trabalho futuro

- [ ] Drenagem suave das conexões existentes
- [ ] API de assinatura de eventos
- [ ] Verificação manual no Windows e macOS
- [ ] Imagem oficial do Docker e exemplos de implantação
- [ ] Maior cobertura multiplataforma e de integração

## Reservado para depois

O encaminhamento HTTP/HTTPS e o gerenciamento de certificados/ACME estão implementados no código-fonte (`engine/https.go`, `engine/proxy.go`, `acme/`, `certstore/`, `certreview/`), mas desabilitados no build atual. A travessia NAT (`tunnel/`) também é mantida, mas não conectada. Ambos são candidatos para uma release futura assim que a superfície L4 se estabilizar.
